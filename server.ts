import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '2mb' }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'MED DZ API',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

app.post('/api/ai/study', async (req, res) => {
  try {
    const { mode, topic, content, specialty } = req.body as {
      mode?: 'summarize' | 'explain' | 'flashcards' | 'revision_sheet' | 'exam_points';
      topic?: string;
      content?: string;
      specialty?: string;
    };

    if (!topic && !content) {
      return res.status(400).json({ error: 'Veuillez fournir un sujet ou un texte médical à analyser.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Service IA indisponible : la clé serveur GEMINI_API_KEY n’est pas configurée dans l’environnement.',
      });
    }

    const modeLabelMap: Record<string, string> = {
      summarize: 'Résumé structuré de cours médical',
      explain: 'Explication pédagogique d’un concept physiopathologique ou clinique complexe',
      flashcards: 'Jeu de flashcards de révision active',
      revision_sheet: 'Fiche de révision synthétique pour l’EMD et le Résidanat',
      exam_points: 'Points clés tombables à l’examen et pièges fréquents (QCM)',
    };

    const chosenMode = mode && modeLabelMap[mode] ? mode : 'summarize';

    const prompt = `Tu es un enseignant agrégé de médecine algérienne préparant des étudiants (1ère à 7ème année) et des candidats au concours national de Résidanat.
Tâche : ${modeLabelMap[chosenMode]}
Spécialité : ${specialty || 'Médecine générale'}
Sujet : ${topic || 'Cours médical'}
Contenu source fourni par l'étudiant :
${content || '(Aucun texte supplémentaire fourni, utilise les connaissances médicales académiques reconnues)'}

Exigences strictes :
1. Rédige exclusivement en français médical rigoureux et conforme aux référentiels universitaires francophones/algériens.
2. N'invente aucune référence bibliographique obscure ni aucun numéro d'annale d'examen réel.
3. Mets en valeur les mécanismes physiopathologiques, les critères diagnostiques essentiels, les valeurs seuils et les principes de prise en charge.
4. Fournis une réponse JSON structurée conforme au schéma demandé.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Tu es un expert en pédagogie médicale algérienne. Tes réponses sont précises, structurées en français académique et adaptées à la préparation du Résidanat et des EMD.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Titre pédagogique clair en français.' },
            summary: { type: Type.STRING, description: 'Synthèse principale structurée et rigoureuse.' },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Liste de 4 à 7 points essentiels à retenir pour l’examen.',
            },
            examTraps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Pièges classiques rencontrés en QCM de Résidanat ou EMD.',
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                },
              },
              description: '4 à 6 flashcards question/réponse pour révision active.',
            },
            referenceNote: {
              type: Type.STRING,
              description: 'Mention du cadre pédagogique ou du référentiel médical général.',
            },
          },
        },
      },
    });

    const rawText = (response.text ?? '{}').trim();
    const parsed = JSON.parse(rawText);
    return res.json({
      ...parsed,
      aiGenerated: true,
      disclaimer:
        'Contenu généré par intelligence artificielle à visée pédagogique. Vérifiez systématiquement les posologies et recommandations sur les référentiels officiels.',
    });
  } catch (err) {
    console.error('Error in /api/ai/study:', err);
    return res.status(500).json({
      error: 'Erreur lors de la génération de la fiche intelligente. Vérifiez votre connexion ou réessayez.',
    });
  }
});

app.post('/api/ai/lesson-summary', async (req, res) => {
  try {
    const {
      lessonId,
      title,
      year,
      specialty,
      chapter,
      objectives,
      definitions,
      contentSections,
      highYieldPoints,
      summary,
      reference,
    } = req.body as {
      lessonId?: string;
      title?: string;
      year?: number;
      specialty?: string;
      chapter?: string;
      objectives?: string[];
      definitions?: Array<{ term: string; definition: string }>;
      contentSections?: Array<{ heading: string; body: string }>;
      highYieldPoints?: string[];
      summary?: string;
      reference?: string;
    };

    if (!title && (!contentSections || contentSections.length === 0)) {
      return res.status(400).json({
        error: 'Contenu du cours manquant : veuillez sélectionner un cours médical valide.',
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error:
          'Service IA indisponible : la clé serveur GEMINI_API_KEY n’est pas configurée dans les secrets du projet.',
      });
    }

    const formattedSections = (contentSections || [])
      .map((s) => `## ${s.heading}\n${s.body}`)
      .join('\n\n');
    const formattedDefs = (definitions || [])
      .map((d) => `- ${d.term} : ${d.definition}`)
      .join('\n');
    const formattedObjectives = (objectives || []).map((o, i) => `${i + 1}. ${o}`).join('\n');
    const formattedHighYield = (highYieldPoints || []).map((p) => `- ${p}`).join('\n');

    const prompt = `Tu es un enseignant agrégé de médecine algérienne. Analyse le cours médical ci-dessous et produis une FICHE DE SYNTHÈSE RÉSUMÉE haute performance pour les révisions d’EMD et du concours de Résidanat.

Cours : ${title || 'Cours médical'}
Identifiant : ${lessonId || 'Non précisé'}
Niveau : ${year ? `${year}e Année Médecine` : 'Cursus médical'} · Spécialité : ${specialty || 'Médecine'} · Chapitre : ${chapter || 'Programme officiel'}
Référence du cours : ${reference || 'Programme universitaire algérien'}

Objectifs pédagogiques :
${formattedObjectives || '(Non précisés)'}

Définitions clés :
${formattedDefs || '(Aucune)'}

Contenu détaillé du cours :
${formattedSections || summary || '(Contenu résumé uniquement)'}

Points tombables signalés :
${formattedHighYield || '(Non précisés)'}

Consignes strictes :
1. Rédige exclusivement en français médical académique clair, dense et structuré (idéal pour mémorisation rapide avant examen).
2. Ne déforme aucune valeur seuil, posologie ou mécanisme physiopathologique issu du cours.
3. N'invente aucune annale ni statistique non vérifiée.
4. Structure la réponse exactement selon le schéma JSON demandé.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction:
          'Tu es un assistant pédagogique médical spécialisé dans le cursus universitaire algérien. Tu synthétises des cours complets en fiches de révision structurées et fidèles aux sources.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'Titre concis de la fiche de synthèse résumée.',
            },
            summary: {
              type: Type.STRING,
              description:
                'Synthèse résumée structurée couvrant physiopathologie, clinique, diagnostic et prise en charge en 2 à 4 paragraphes clairs.',
            },
            clinicalTakeaway: {
              type: Type.STRING,
              description:
                'Message clinique décisif ou conduite pratique réflexe à retenir en 2 à 3 phrases.',
            },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Liste de 5 à 7 points clés indispensables pour l’EMD et le Résidanat.',
            },
            examTraps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Liste de 3 à 5 pièges classiques rencontrés en QCM.',
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                },
              },
              description: '4 flashcards question/réponse ciblées sur ce cours.',
            },
            referenceNote: {
              type: Type.STRING,
              description: 'Rappel de la référence académique du cours.',
            },
          },
        },
      },
    });

    const rawText = (response.text ?? '{}').trim();
    const parsed = JSON.parse(rawText);

    return res.json({
      ...parsed,
      lessonId,
      aiGenerated: true,
      model: 'gemini-3.8-flash',
      disclaimer:
        'Fiche de synthèse générée automatiquement par Gemini à partir du contenu du cours. Vérifiez toujours les conduites cliniques et posologies sur les référentiels officiels.',
    });
  } catch (err: unknown) {
    console.error('Error in /api/ai/lesson-summary:', err);
    const errObj = err as { status?: number; message?: string };
    const status = typeof errObj?.status === 'number' ? errObj.status : 500;
    const rawMsg = String(errObj?.message || '');

    if (status === 400 || status === 403 || rawMsg.includes('API_KEY_INVALID') || rawMsg.includes('PERMISSION_DENIED')) {
      return res.status(status === 400 ? 400 : 403).json({
        error:
          'Clé API Gemini invalide ou autorisations insuffisantes. Veuillez vérifier GEMINI_API_KEY dans le panneau Settings > Secrets.',
      });
    }
    if (status === 429 || rawMsg.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({
        error:
          'Quota Gemini temporairement atteint (429). Réessayez dans quelques instants ou vérifiez votre clé dans Settings > Secrets.',
      });
    }
    if (status === 404 || rawMsg.includes('NOT_FOUND')) {
      return res.status(404).json({
        error: 'Modèle Gemini introuvable (404). Vérifiez la configuration du modèle serveur.',
      });
    }
    return res.status(500).json({
      error:
        'Impossible de générer la fiche de synthèse résumée pour ce cours. Vérifiez la configuration ou réessayez.',
    });
  }
});

app.post('/api/ai/generate-qcm', async (req, res) => {
  try {
    const { specialty, topic, difficulty, count, university, targetYear } = req.body as {
      specialty?: string;
      topic?: string;
      difficulty?: 'Facile' | 'Moyen' | 'Difficile';
      count?: number;
      university?: string;
      targetYear?: number;
    };
    const universityContext = typeof university === 'string' ? university.trim().slice(0, 100) : '';
    const yearContext = Number.isInteger(targetYear) && Number(targetYear) >= 2000 && Number(targetYear) <= new Date().getFullYear()
      ? Number(targetYear)
      : undefined;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Service IA indisponible : la clé serveur GEMINI_API_KEY n’est pas configurée.',
      });
    }

    const safeCount = Math.min(Math.max(Number(count) || 3, 1), 5);
    const chosenSpecialty = specialty || 'Cardiologie';
    const chosenDifficulty = difficulty || 'Moyen';

    const prompt = `Génère ${safeCount} QCM d'entraînement médical inédits de niveau concours de Résidanat algérien.
Spécialité : ${chosenSpecialty}
Thème ciblé : ${topic || 'Programme officiel de la spécialité'}
Difficulté : ${chosenDifficulty}

Règles strictes :
- Chaque QCM doit comporter un énoncé clinique ou fondamental précis en français, exactement 5 propositions (A, B, C, D, E), une seule bonne réponse (correctIndex de 0 à 4), une explication scientifique détaillée de la bonne réponse, et une justification concise expliquant pourquoi les autres propositions sont inexactes.
- N'affirme JAMAIS que la question provient d'une annale d'examen réelle ou d'une année passée. Indique un ouvrage médical académique reconnu pertinent dans "reference".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Tu rédiges des QCM médicaux de haute précision scientifique en français pour les étudiants en médecine algériens.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              stem: { type: Type.STRING },
              choices: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              incorrectExplanations: { type: Type.STRING },
              reference: { type: Type.STRING },
            },
          },
        },
      },
    });

    const rawText = (response.text ?? '[]').trim();
    const items = JSON.parse(rawText) as Array<{
      stem: string;
      choices: string[];
      correctIndex: number;
      explanation: string;
      incorrectExplanations: string;
      reference: string;
    }>;

    const normalized = items
      .filter((q) => q && typeof q.stem === 'string' && q.stem.trim() && Array.isArray(q.choices) && q.choices.length === 5 && q.choices.every((choice) => typeof choice === 'string' && choice.trim()) && Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex <= 4 && typeof q.explanation === 'string' && q.explanation.trim())
      .map((q, idx) => ({
        id: `IA-${Date.now()}-${idx + 1}`,
        specialty: chosenSpecialty,
        yearLevel: 'Résidanat',
        stem: q.stem,
        choices: q.choices,
        correctIndex: Number(q.correctIndex),
        explanation: q.explanation,
        incorrectExplanations: q.incorrectExplanations,
        difficulty: chosenDifficulty,
        sourceType: 'IA_PEDAGOGIQUE' as const,
        sourceLabel: universityContext && yearContext
          ? `Entraînement IA — thème de ${universityContext} ${yearContext} (non annale officielle)`
          : 'Entraînement généré par IA (non issu d’une annale officielle)',
        reference: q.reference ? `Référence proposée par IA — à vérifier : ${q.reference}` : `Référence académique à vérifier — ${chosenSpecialty}`,
        correctionStatus: 'NON_VERIFIEE' as const,
      }));

    return res.json({ questions: normalized });
  } catch (err) {
    console.error('Error in /api/ai/generate-qcm:', err);
    return res.status(500).json({
      error: 'Impossible de générer les QCM d’entraînement pour le moment.',
    });
  }
});


app.post('/api/ai/chat', async (req, res) => {
  try {
    const rawMessages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const validMessages = rawMessages
      .filter((item: any) => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string')
      .slice(-12);
    while (validMessages.length && validMessages[0].role === 'assistant') validMessages.shift();
    const messages = validMessages
      .map((item: any) => ({ role: item.role === 'assistant' ? 'model' : 'user', parts: [{ text: item.content.slice(0, 12000) }] }));

    if (!messages.length || messages[messages.length - 1].role !== 'user') {
      return res.status(400).json({ error: 'Veuillez saisir une question.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: 'Service IA indisponible : la clé serveur GEMINI_API_KEY n’est pas configurée.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: messages,
      config: {
        systemInstruction: `Tu es l'assistant pédagogique officiel de l'application MED DZ, spécialisé dans les études médicales et la préparation au Résidanat algérien.
Réponds dans la langue utilisée par l'étudiant (français ou arabe). Sois clair, structuré, précis et pédagogique.
Tu peux expliquer les cours, détailler la physiopathologie, comparer les diagnostics, préparer des fiches, créer des QCM originaux avec cinq propositions et correction expliquée.
N'invente jamais une annale, une année, une université, une source ou une recommandation. Si l'étudiant demande un sujet historique non fourni dans le contexte, indique que tu ne disposes pas du document source et propose un entraînement distinct clairement marqué comme généré par IA.
Pour les questions cliniques, rappelle que la réponse est pédagogique et ne remplace pas l'évaluation d'un professionnel. Ne donne pas de diagnostic individuel définitif ni de prescription personnalisée.`,
      },
    });

    const reply = (response.text || '').trim();
    if (!reply) return res.status(502).json({ error: 'Gemini a retourné une réponse vide. Réessayez.' });
    return res.json({ reply, model: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('Error in /api/ai/chat:', err);
    const status = typeof err?.status === 'number' ? err.status : 500;
    if (status === 429 || String(err?.message || '').includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ error: 'Quota Gemini atteint temporairement. Réessayez un peu plus tard.' });
    }
    if (status === 400 || status === 403 || String(err?.message || '').includes('API_KEY_INVALID')) {
      return res.status(status === 400 ? 400 : 403).json({ error: 'La clé Gemini est invalide ou ses autorisations sont insuffisantes.' });
    }
    if (status === 404 || String(err?.message || '').includes('NOT_FOUND')) {
      return res.status(404).json({ error: 'Le modèle Gemini configuré est introuvable ou non accessible pour cette clé.' });
    }
    return res.status(500).json({ error: 'Erreur du service Gemini. Vérifiez la connexion et réessayez.' });
  }
});

async function startServer() {
  const portArgIdx = process.argv.indexOf('--port');
  const cliPort = portArgIdx !== -1 ? Number(process.argv[portArgIdx + 1]) : NaN;
  const PORT = Number.isFinite(cliPort) && cliPort > 0 ? cliPort : Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== 'production') {
    app.get(['/dev-sw.js', '/sw.js'], (_req, res) => {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.send(`self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) client.navigate(client.url);
  })());
});`);
    });

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MED DZ server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
