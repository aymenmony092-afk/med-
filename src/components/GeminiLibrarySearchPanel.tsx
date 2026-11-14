import React, { useEffect, useState } from 'react';
import { BookOpen, Search, Loader2, Database, AlertCircle } from 'lucide-react';

type SearchSource = { title?: string; uri?: string; text?: string };

export const GeminiLibrarySearchPanel: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [checking, setChecking] = useState(true);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<SearchSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/library/status')
      .then((response) => response.json())
      .then((data) => { if (active) setEnabled(Boolean(data.searchEnabled)); })
      .catch(() => { if (active) setEnabled(false); })
      .finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, []);

  const search = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!question.trim() || loading || !enabled) return;
    setLoading(true);
    setError('');
    setAnswer('');
    setSources([]);
    try {
      const response = await fetch('/api/library/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Recherche indisponible.');
      setAnswer(typeof data.answer === 'string' ? data.answer : '');
      setSources(Array.isArray(data.sources) ? data.sources : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return <section className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4">
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-3 text-indigo-700 dark:text-indigo-300"><Database className="h-6 w-6" /></div>
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Bibliothèque médicale centrale — Gemini</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Recherche sémantique dans les documents validés de MED DZ.</p>
      </div>
    </div>
    {!enabled && <div className="flex gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 text-xs text-amber-800 dark:text-amber-200">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{checking ? 'Vérification de la bibliothèque…' : 'La bibliothèque centrale Gemini n’est pas encore configurée. Vos documents personnels restent privés et ne sont pas publiés automatiquement.'}</span>
    </div>}
    <form onSubmit={(event) => void search(event)} className="space-y-3">
      <textarea value={question} onChange={(event) => setQuestion(event.target.value)} rows={3}
        placeholder="Ex. : Quelles sont les causes d’une anémie microcytaire selon les documents de la bibliothèque ?"
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-slate-100"
        disabled={!enabled || loading} />
      <button type="submit" disabled={!enabled || !question.trim() || loading}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Recherche dans les documents…</> : <><Search className="h-4 w-4" /> Interroger la bibliothèque</>}
      </button>
    </form>
    {error && <p className="rounded-lg bg-rose-50 dark:bg-rose-950/30 p-3 text-sm text-rose-700 dark:text-rose-200">{error}</p>}
    {answer && <div className="space-y-3">
      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 p-4 text-sm leading-7 text-slate-800 dark:text-slate-100 whitespace-pre-wrap">{answer}</div>
      {!!sources.length && <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Documents récupérés</h3>
        {sources.map((source, index) => <div key={source.uri || source.title || index} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-100"><BookOpen className="h-4 w-4 text-indigo-600" />{source.title || `Document ${index + 1}`}</p>
          {source.text && <p className="mt-1 text-xs text-slate-500 whitespace-pre-wrap">{source.text}</p>}
        </div>)}
      </div>}
      {!sources.length && <p className="text-xs text-amber-700 dark:text-amber-300">Gemini n’a pas fourni de référence de document exploitable pour cette réponse. Vérifiez-la avant de l’utiliser.</p>}
    </div>}
    <p className="text-[11px] text-slate-500">Les réponses sont une aide pédagogique. Vérifiez les passages dans les documents originaux et les références médicales.</p>
  </section>;
};
