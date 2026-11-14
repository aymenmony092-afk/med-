import type { Express, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { timingSafeEqual } from 'node:crypto';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const MAX_FILE_BYTES = 13 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'text/plain': '.txt',
};

function getClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey && apiKey !== 'MY_GEMINI_API_KEY' ? new GoogleGenAI({ apiKey }) : null;
}

function isAuthorized(req: Request): boolean {
  const expected = process.env.MED_DZ_LIBRARY_ADMIN_TOKEN || '';
  const supplied = req.header('x-med-dz-admin-token') || '';
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

function requireAdmin(req: Request, res: Response): boolean {
  if (isAuthorized(req)) return true;
  res.status(401).json({ error: 'Accès administrateur requis.' });
  return false;
}

function getStoreName(): string {
  return (process.env.GEMINI_FILE_SEARCH_STORE || '').trim();
}

function getText(response: any): string {
  if (typeof response?.text === 'string') return response.text.trim();
  const parts = response?.candidates?.[0]?.content?.parts || [];
  return parts.map((part: any) => typeof part.text === 'string' ? part.text : '').join('\n').trim();
}

export function registerGeminiFileSearchRoutes(app: Express): void {
  app.get('/api/library/status', (_req, res) => {
    const configured = Boolean(getClient() && getStoreName());
    res.json({
      enabled: configured,
      searchEnabled: configured,
      centralIndex: configured ? 'Gemini File Search' : null,
      uploadEnabled: configured && Boolean(process.env.MED_DZ_LIBRARY_ADMIN_TOKEN),
      originalFileRetention: 'Gemini Files API temporary originals are deleted after 48 hours; keep permanent originals in separate object storage.',
      note: 'File Search stores indexed content and embeddings, not a permanent downloadable copy of the original file.',
    });
  });

  // Owner-only provisioning. The returned store name must be saved as a server environment variable.
  app.post('/api/admin/library/create-store', async (req, res) => {
    if (!requireAdmin(req, res)) return;
    try {
      if (getStoreName()) {
        return res.status(409).json({ error: 'GEMINI_FILE_SEARCH_STORE est déjà configuré.' });
      }
      const ai = getClient();
      if (!ai) return res.status(503).json({ error: 'GEMINI_API_KEY non configurée.' });
      const store = await ai.fileSearchStores.create({
        config: {
          displayName: 'MED DZ — Bibliothèque médicale',
          embeddingModel: 'models/gemini-embedding-2',
        },
      });
      if (!store.name) return res.status(502).json({ error: 'Google n’a pas retourné le nom du magasin.' });
      return res.status(201).json({
        storeName: store.name,
        nextStep: 'Enregistrer cette valeur dans GEMINI_FILE_SEARCH_STORE côté serveur, puis redémarrer le service.',
      });
    } catch (err) {
      console.error('MED DZ File Search store creation failed:', err);
      return res.status(502).json({ error: 'Impossible de créer la bibliothèque Gemini.' });
    }
  });

  // Only the owner can add material to the shared corpus. This endpoint is deliberately
  // not called by the student upload UI until authentication, rights review and file storage exist.
  app.post('/api/admin/library/index-document', async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const { fileName, mimeType, fileBase64, metadata, rightsConfirmed, personalDataChecked } = req.body as {
      fileName?: string;
      mimeType?: string;
      fileBase64?: string;
      metadata?: Record<string, unknown>;
      rightsConfirmed?: boolean;
      personalDataChecked?: boolean;
    };

    if (!fileName || typeof fileName !== 'string' || !mimeType || !ALLOWED_TYPES[mimeType] ||
        typeof fileBase64 !== 'string' || !fileBase64) {
      return res.status(400).json({ error: 'Fichier invalide ou format non pris en charge.' });
    }
    if (fileBase64.length > Math.ceil(MAX_FILE_BYTES * 4 / 3) + 16) {
      return res.status(413).json({ error: 'Le fichier dépasse la limite de 13 Mo.' });
    }
    if (rightsConfirmed !== true || personalDataChecked !== true) {
      return res.status(403).json({
        error: 'Indexation partagée refusée : confirmez les droits de diffusion et l’absence de données personnelles.',
      });
    }

    const ai = getClient();
    const storeName = getStoreName();
    if (!ai || !storeName) {
      return res.status(503).json({ error: 'La bibliothèque Gemini n’est pas configurée.' });
    }

    let tempDir = '';
    try {
      const bytes = Buffer.from(fileBase64, 'base64');
      if (!bytes.length || bytes.length > MAX_FILE_BYTES) {
        return res.status(413).json({ error: 'Taille de fichier invalide ou supérieure à 13 Mo.' });
      }
      tempDir = await mkdtemp(path.join(tmpdir(), 'med-dz-index-'));
      const safeName = path.basename(fileName).replace(/[^\p{L}\p{N}._ -]/gu, '_').slice(0, 120) || 'document';
      const tempPath = path.join(tempDir, safeName);
      await writeFile(tempPath, bytes);

      const fields = metadata || {};
      const metadataPairs: Array<[string, unknown]> = [
        ['med_dz_type', fields.documentType],
        ['specialty', fields.specialty],
        ['university', fields.university],
        ['academic_year', fields.academicYear],
        ['language', fields.language],
        ['rights_basis', fields.rightsBasis],
      ];
      const customMetadata: Array<{ key: string; stringValue: string }> = metadataPairs
        .flatMap(([key, value]) => typeof value === 'string' && value.trim()
          ? [{ key, stringValue: value.trim().slice(0, 200) }]
          : []);

      let operation = await ai.fileSearchStores.uploadToFileSearchStore({
        file: tempPath,
        fileSearchStoreName: storeName,
        config: { displayName: safeName, customMetadata },
      });

      // Bound the request duration; never report success until Google marks indexing complete.
      let polls = 0;
      while (!operation.done && polls < 36) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        operation = await ai.operations.get({ operation });
        polls += 1;
      }
      if (!operation.done) {
        return res.status(202).json({
          indexed: false,
          pending: true,
          message: 'L’indexation prend plus de temps que prévu. Vérifiez l’état avant de relancer pour éviter les doublons.',
        });
      }
      if ((operation as any).error) {
        return res.status(502).json({ error: 'Google n’a pas pu indexer ce document.' });
      }
      return res.status(201).json({
        indexed: true,
        fileName: safeName,
        storeName,
        note: 'Le contenu indexé est conservé dans File Search. La copie originale temporaire côté Gemini est supprimée après 48 heures.',
      });
    } catch (err) {
      console.error('MED DZ File Search indexing failed:', err);
      return res.status(502).json({ error: 'Échec de l’indexation Gemini. Le fichier original doit rester conservé séparément.' });
    } finally {
      if (tempDir) await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
    }
  });

  // Read-only search over the curated community store.
  app.post('/api/library/search', async (req, res) => {
    const question = typeof req.body?.question === 'string' ? req.body.question.trim().slice(0, 6000) : '';
    if (!question) return res.status(400).json({ error: 'Saisissez une question.' });
    const ai = getClient();
    const storeName = getStoreName();
    if (!ai || !storeName) return res.status(503).json({ error: 'La bibliothèque centrale n’est pas encore configurée.' });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{
          role: 'user',
          parts: [{ text: `Réponds en français médical clair à partir des documents indexés dans la bibliothèque MED DZ. Priorise strictement les documents récupérés. N'invente aucune source, année, université, page ou citation. Si les documents ne contiennent pas la réponse, dis-le explicitement. Distingue les informations documentées des connaissances générales.\n\nQuestion : ${question}` }],
        }],
        config: {
          tools: [{ fileSearch: { fileSearchStoreNames: [storeName] } }],
        },
      });
      const answer = getText(response);
      if (!answer) return res.status(502).json({ error: 'Gemini n’a retourné aucune réponse exploitable.' });
      const chunks = (response as any).candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.map((chunk: any) => chunk.retrievedContext || chunk.web || null)
        .filter(Boolean)
        .map((source: any) => ({
          title: typeof source.title === 'string' ? source.title : '',
          uri: typeof source.uri === 'string' ? source.uri : '',
          text: typeof source.text === 'string' ? source.text.slice(0, 1200) : '',
        }));
      return res.json({ answer, sources, grounded: sources.length > 0 });
    } catch (err) {
      console.error('MED DZ File Search query failed:', err);
      return res.status(502).json({ error: 'La recherche dans la bibliothèque Gemini a échoué.' });
    }
  });
}
