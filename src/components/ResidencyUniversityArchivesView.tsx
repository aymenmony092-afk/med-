import React, { useMemo, useState } from 'react';
import { AlertCircle, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import type { QCMQuestion, SpecialtyName, StudySessionRecord } from '../types/med';

type University = 'Batna' | 'Oran' | 'Alger';
const UNIVERSITIES: University[] = ['Batna', 'Oran', 'Alger'];
const YEARS = Array.from({ length: 19 }, (_, index) => 2026 - index);

const SOURCES: Record<University, Array<{ label: string; url: string; note: string }>> = {
  Batna: [
    { label: 'Faculté de médecine — Université Batna 2', url: 'https://med-fac.univ-batna2.dz/', note: 'Site institutionnel de la faculté.' },
    { label: 'Document institutionnel — concours 2023', url: 'https://med-fac.univ-batna2.dz/sites/default/files/medecine-fac/files/concours_de_residanat_session_2023_1.pdf', note: 'Avis officiel sur la session 2023 (ce PDF n’est pas le sujet QCM complet).' },
    { label: 'Catalogue de la Bibliothèque centrale', url: 'https://pmb.univ-batna.dz/opac_bcu/index.php?id=100&l_typdoc=&lvl=categ_see&nbr_lignes=2637&page=18', note: 'Références bibliographiques de médecine et annales disponibles en bibliothèque.' },
  ],
  Oran: [
    { label: 'Faculté de médecine Oran 1', url: 'https://facmed.univ-oran1.dz/', note: 'Site institutionnel de la faculté.' },
    { label: 'Règlement du concours — Oran', url: 'https://facmed.univ-oran1.dz/images/Reglement_int%C3%A9rieur_du_concours_de_r%C3%A9sidanatK.pdf', note: 'Règlement officiel, pas un sujet QCM.' },
    { label: 'Catalogue DZ Residency', url: 'https://www.dz-residency.com/', note: 'Catalogue externe d’épreuves annoncées par faculté et année.' },
  ],
  Alger: [
    { label: 'Faculté d’Alger — QSMQCS', url: 'https://app.qsmqcs.com/residanat/alger', note: 'Catalogue externe proposant des sections et annales par année.' },
    { label: 'Catalogue DZ Residency', url: 'https://www.dz-residency.com/', note: 'Catalogue externe d’épreuves annoncées par faculté et année.' },
  ],
};

interface Props {
  allQuestions: QCMQuestion[];
  onStartSession: (config: { title: string; mode: StudySessionRecord['mode']; questionIds: string[]; specialty?: SpecialtyName | 'Toutes'; immediateFeedback: boolean; timerMinutes: number }) => void;
  onAddAIQuestions: (questions: QCMQuestion[]) => void;
}

export const ResidencyUniversityArchivesView: React.FC<Props> = ({ allQuestions, onStartSession, onAddAIQuestions }) => {
  const [university, setUniversity] = useState<University>('Batna');
  const [year, setYear] = useState(2026);
  const [specialty, setSpecialty] = useState<SpecialtyName>('Cardiologie');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const trainingQuestions = useMemo(() => allQuestions.filter((q) => q.sourceType === 'IA_PEDAGOGIQUE' && q.sourceLabel.includes(`Faculté de ${university} · cible ${year}`)), [allQuestions, university, year]);

  const generateTraining = async () => {
    setLoading(true); setError(''); setSuccess('');
    try {
      const response = await fetch('/api/ai/generate-qcm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ university, targetYear: year, specialty, topic: `Préparation Résidanat — ${university} — session ${year}`, difficulty: 'Moyen', count }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur de génération');
      if (!Array.isArray(data.questions) || !data.questions.length) throw new Error('Aucun QCM n’a été généré.');
      onAddAIQuestions(data.questions);
      setSuccess(`${data.questions.length} QCM d’entraînement ajoutés. Ils ne sont pas des annales officielles de ${year}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de génération.');
    } finally { setLoading(false); }
  };

  const localYearQuestions = allQuestions.filter((q) => q.sourceType === 'ARCHIVE_VERIFIEE' && q.university === university && q.examYear === year);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Annales du Résidanat par faculté (2008–2026)</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Chaque faculté possède son propre espace. Les sujets authentiques ne sont affichés comme disponibles que lorsqu’un document source exploitable a été vérifié. Les QCM créés par Gemini restent dans une section d’entraînement distincte.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {UNIVERSITIES.map((item) => <button key={item} onClick={() => setUniversity(item)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${university === item ? 'bg-blue-600 text-white' : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}>Université de {item}</button>)}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Année de session
            <select value={year} onChange={(e) => { setYear(Number(e.target.value)); setSuccess(''); }} className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100">{YEARS.map((y) => <option key={y} value={y}>{y}</option>)}</select>
          </label>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <span className="font-medium">Sujets originaux disponibles localement</span>
            <div className="mt-1 rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-sm">{localYearQuestions.length ? `${localYearQuestions.length} questions vérifiées` : 'Aucun sujet QCM original vérifié n’est encore intégré pour cette université et cette année.'}</div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Sources et archives — {university}</h2>
        {SOURCES[university].map((source) => <div key={source.url} className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 py-3 last:border-0">
          <div><p className="text-sm font-medium text-slate-800 dark:text-slate-100">{source.label}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{source.note}</p></div>
          <a href={source.url} target="_blank" rel="noreferrer" className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">Ouvrir <ExternalLink className="h-3 w-3" /></a>
        </div>)}
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <div><h2 className="font-semibold text-slate-900 dark:text-slate-100">Entraînement IA ciblé — {university} {year}</h2><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Ces questions sont nouvelles et pédagogiques. Elles ne reproduisent pas et ne prétendent pas provenir de l’épreuve officielle de cette année.</p></div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-xs text-slate-600 dark:text-slate-300">Spécialité
            <select value={specialty} onChange={(e) => setSpecialty(e.target.value as SpecialtyName)} className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm">{['Anatomie','Physiologie','Biochimie','Pharmacologie','Cardiologie','Pneumologie','Neurologie','Gastro-entérologie','Néphrologie','Endocrinologie','Hématologie','Infectiologie','Pédiatrie','Gynécologie-obstétrique','Chirurgie','Médecine interne','Urgences et Réanimation'].map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <label className="text-xs text-slate-600 dark:text-slate-300">Nombre de QCM
            <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm"><option value={3}>3</option><option value={5}>5</option></select>
          </label>
          <div className="flex items-end"><button onClick={() => void generateTraining()} disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Générer des QCM</button></div>
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        {success && <p className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 text-sm text-emerald-700 dark:text-emerald-300">{success}</p>}
        {trainingQuestions.length > 0 && <button onClick={() => onStartSession({ title: `Entraînement IA — ${university} ${year}`, mode: 'residanat_complet', questionIds: trainingQuestions.map((q) => q.id), specialty, immediateFeedback: true, timerMinutes: 0 })} className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300">Lancer les {trainingQuestions.length} QCM déjà générés</button>}
      </section>

      <p className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> Le catalogue local est encore incomplet : les années sans sujet vérifié restent signalées comme manquantes au lieu d’être remplies avec de faux examens.</p>
    </div>
  );
};
