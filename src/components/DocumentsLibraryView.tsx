import React, { useEffect, useState } from 'react';
import { FileText, FileUp, Trash2, Download, Sparkles, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import type { QCMQuestion } from '../types/med';
import { medDzDb } from '../db/medDzDb';

type StoredDocument = { id: string; name: string; mimeType: string; size: number; addedAt: string; blob: Blob };

interface Props { onAddAIQuestions: (questions: QCMQuestion[]) => Promise<void>; }

const MAX_FILE_BYTES = 13 * 1024 * 1024;
const ACCEPTED = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'text/plain'];

export const DocumentsLibraryView: React.FC<Props> = ({ onAddAIQuestions }) => {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [count, setCount] = useState(5);
  const [specialty, setSpecialty] = useState('Médecine générale');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const refresh = async () => {
    const saved = await medDzDb.getDocuments();
    setDocuments(saved.sort((a, b) => b.addedAt.localeCompare(a.addedAt)));
    if (!selectedId && saved[0]) setSelectedId(saved[0].id);
  };

  useEffect(() => { void refresh(); }, []);

  const upload = async (file?: File) => {
    if (!file) return;
    setError(''); setMessage('');
    if (!ACCEPTED.includes(file.type)) {
      setError('Format non pris en charge. Pour le moment : PDF, PNG, JPG, WEBP ou TXT.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError('Le fichier dépasse la limite de 13 Mo.');
      return;
    }
    const doc: StoredDocument = {
      id: `DOC-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name, mimeType: file.type, size: file.size,
      addedAt: new Date().toISOString(), blob: file,
    };
    await medDzDb.saveDocument(doc);
    setSelectedId(doc.id);
    await refresh();
    setMessage('Document enregistré sur cet appareil. Il reste disponible hors connexion.');
  };

  const remove = async (doc: StoredDocument) => {
    if (!window.confirm(`Supprimer « ${doc.name} » de la bibliothèque ?`)) return;
    await medDzDb.deleteDocument(doc.id);
    if (selectedId === doc.id) setSelectedId('');
    await refresh();
  };

  const generate = async () => {
    const doc = documents.find((item) => item.id === selectedId);
    if (!doc || loading) return;
    setLoading(true); setError(''); setMessage('');
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Lecture du fichier impossible.'));
        reader.readAsDataURL(doc.blob);
      });
      const fileBase64 = dataUrl.split(',')[1] || '';
      const response = await fetch('/api/ai/generate-qcm-from-document', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: doc.name, mimeType: doc.mimeType, fileBase64, count, specialty }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Erreur pendant la génération.');
      const questions = Array.isArray(result.questions) ? result.questions as QCMQuestion[] : [];
      if (!questions.length) throw new Error('Le document ne contient pas assez de contenu lisible pour créer des QCM fiables.');
      await onAddAIQuestions(questions);
      setMessage(`${questions.length} QCM créés et ajoutés à la Banque QCM. Ils sont identifiés comme contenus générés par IA, pas comme annales originales.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue.');
    } finally { setLoading(false); }
  };

  const selected = documents.find((item) => item.id === selectedId);

  return <div className="space-y-6">
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-3">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/50 p-3 text-blue-700 dark:text-blue-300"><FileUp className="h-6 w-6" /></div>
        <div><h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Documents médicaux & QCM IA</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Importez vos propres documents, conservez-les dans MED DZ et générez des QCM à partir de leur contenu.</p></div>
      </div>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 p-7 text-center hover:bg-blue-50 dark:hover:bg-blue-950/40">
        <FileUp className="h-7 w-7 text-blue-600" />
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Choisir un document à importer</span>
        <span className="text-xs text-slate-500">PDF, PNG, JPG, WEBP ou TXT · 13 Mo maximum</span>
        <input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,application/pdf,image/png,image/jpeg,image/webp,text/plain" className="hidden" onChange={(event) => { void upload(event.target.files?.[0]); event.currentTarget.value = ''; }} />
      </label>
      <p className="text-xs text-slate-500 dark:text-slate-400">Les fichiers sont conservés localement sur cet appareil. Pour analyser un document avec Gemini, son contenu est envoyé au service IA configuré sur le serveur.</p>
    </section>

    {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
    {message && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</div>}

    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
      <h2 className="font-semibold text-slate-900 dark:text-slate-100">Ma bibliothèque ({documents.length})</h2>
      {!documents.length ? <div className="py-8 text-center text-sm text-slate-500"><BookOpen className="mx-auto mb-2 h-8 w-8 opacity-50" />Aucun document importé pour le moment.</div> :
        <div className="space-y-2">{documents.map((doc) => <div key={doc.id} className={`flex items-center gap-3 rounded-xl border p-3 ${selectedId === doc.id ? 'border-blue-400 bg-blue-50/60 dark:bg-blue-950/20' : 'border-slate-200 dark:border-slate-700'}`}>
          <FileText className="h-5 w-5 shrink-0 text-blue-600" />
          <button className="min-w-0 flex-1 text-left" onClick={() => setSelectedId(doc.id)}>
            <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{doc.name}</span>
            <span className="text-xs text-slate-500">{(doc.size / 1024 / 1024).toFixed(2)} Mo · {new Date(doc.addedAt).toLocaleDateString('fr-FR')}</span>
          </button>
          <a className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" href={URL.createObjectURL(doc.blob)} download={doc.name} aria-label="Télécharger"><Download className="h-4 w-4" /></a>
          <button className="rounded-lg p-2 text-rose-500 hover:bg-rose-50" onClick={() => void remove(doc)} aria-label="Supprimer"><Trash2 className="h-4 w-4" /></button>
        </div>)}</div>}
    </section>

    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-blue-600" /><h2 className="font-semibold text-slate-900 dark:text-slate-100">Créer des QCM à partir du document</h2></div>
      <p className="text-sm text-slate-600 dark:text-slate-300">Gemini analyse le fichier sélectionné et produit des questions nouvelles fondées sur son contenu. Les QCM générés restent distincts des annales historiques.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Spécialité
          <input value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm" />
        </label>
        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Nombre de QCM
          <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm">{[3,5,8,10].map((n) => <option key={n} value={n}>{n}</option>)}</select>
        </label>
      </div>
      <button disabled={!selected || loading} onClick={() => void generate()} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyse du document…</> : <><Sparkles className="h-4 w-4" /> Générer les QCM avec Gemini</>}
      </button>
      {selected && <p className="text-xs text-slate-500">Document sélectionné : {selected.name}</p>}
      <p className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> Les réponses générées doivent être relues et validées par rapport au document et aux références médicales. Une page source est indiquée lorsque Gemini peut la repérer.</p>
    </section>
  </div>;
};
