import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  BookMarked,
  CheckCircle2,
  Clock,
  Filter,
  Loader2,
  Play,
  Shuffle,
  Sparkles,
} from 'lucide-react';
import { HISTORICAL_ARCHIVES } from '../data/archives';
import { ALL_SPECIALTIES } from '../data/qcm_index';
import type {
  DifficultyLevel,
  HistoricalExamRecord,
  QCMQuestion,
  SpecialtyName,
  StudySessionRecord,
} from '../types/med';

interface ResidanatEmdAnnalesViewsProps {
  mode: 'residanat' | 'qcm' | 'emd' | 'annales';
  allQuestions: QCMQuestion[];
  wrongCount: number;
  specialtyStats: Record<string, { answered: number; correct: number }>;
  onStartSession: (config: {
    title: string;
    mode: StudySessionRecord['mode'];
    questionIds: string[];
    specialty?: SpecialtyName | 'Toutes';
    yearLevel?: number;
    immediateFeedback: boolean;
    timerMinutes: number;
  }) => void;
  onAddAIQuestions: (questions: QCMQuestion[]) => void;
}

export const ResidanatEmdAnnalesViews: React.FC<ResidanatEmdAnnalesViewsProps> = ({
  mode,
  allQuestions,
  wrongCount,
  specialtyStats,
  onStartSession,
  onAddAIQuestions,
}) => {
  // Banque QCM filters
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyName | 'Toutes'>('Toutes');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'Toutes'>('Toutes');
  const [selectedSource, setSelectedSource] = useState<'Toutes' | 'REFERENCE_PEDAGOGIQUE' | 'IA_PEDAGOGIQUE'>('Toutes');
  const [immediateFeedback, setImmediateFeedback] = useState(true);
  const [timerMinutes, setTimerMinutes] = useState(20);
  const [questionLimit, setQuestionLimit] = useState(20);

  // AI QCM generator state
  const [aiSpecialty, setAiSpecialty] = useState<SpecialtyName>('Cardiologie');
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);

  // Archives filters
  const [archiveYearFilter, setArchiveYearFilter] = useState<number | 'all'>('all');
  const [archiveUniFilter, setArchiveUniFilter] = useState<string>('Toutes');
  const [archiveTypeFilter, setArchiveTypeFilter] = useState<'Tous' | 'Résidanat' | 'EMD'>('Tous');

  // EMD filters
  const [emdYear, setEmdYear] = useState<number>(4);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      if (selectedSpecialty !== 'Toutes' && q.specialty !== selectedSpecialty) return false;
      if (selectedDifficulty !== 'Toutes' && q.difficulty !== selectedDifficulty) return false;
      if (selectedSource !== 'Toutes' && q.sourceType !== selectedSource) return false;
      return true;
    });
  }, [allQuestions, selectedSpecialty, selectedDifficulty, selectedSource]);

  const handleGenerateAIQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    setAiError(null);
    setAiSuccessMsg(null);
    try {
      const resp = await fetch('/api/ai/generate-qcm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specialty: aiSpecialty,
          topic: aiTopic || `Programme Résidanat de ${aiSpecialty}`,
          difficulty: 'Moyen',
          count: 3,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Erreur de génération');
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        onAddAIQuestions(data.questions);
        setAiSuccessMsg(
          `${data.questions.length} nouveaux QCM d’entraînement en ${aiSpecialty} ajoutés à votre base locale hors-ligne.`
        );
        setAiTopic('');
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Erreur lors de la génération.');
    } finally {
      setAiLoading(false);
    }
  };

  const launchFilteredQCM = (shuffle = false) => {
    const pool = [...filteredQuestions];
    if (shuffle) {
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
    }
    const chosen = pool.slice(0, Math.min(questionLimit, pool.length)).map((q) => q.id);
    onStartSession({
      title:
        selectedSpecialty === 'Toutes'
          ? shuffle
            ? 'Série Aléatoire — Banque QCM'
            : 'Entraînement Banque QCM'
          : `QCM — ${selectedSpecialty}`,
      mode: shuffle ? 'aleatoire' : 'banque_qcm',
      questionIds: chosen,
      specialty: selectedSpecialty,
      immediateFeedback,
      timerMinutes: immediateFeedback ? 0 : timerMinutes,
    });
  };

  // 1. RÉSIDANAT HUB
  if (mode === 'residanat') {
    const curatedCount = allQuestions.filter((q) => q.sourceType === 'REFERENCE_PEDAGOGIQUE').length;
    const archiveCount = allQuestions.filter((q) => q.sourceType === 'ARCHIVE_VERIFIEE' && (q.reference?.startsWith('https://') || q.reference?.startsWith('http://')) && ['Alger', 'Oran', 'Batna'].includes(q.university || '') && Number.isInteger(q.examYear) && Number(q.examYear) >= 2008 && Number(q.examYear) <= 2026 && Boolean(q.sourceDocumentTitle?.trim()) && Number.isInteger(q.sourcePage) && (q.sourcePage ?? 0) > 0 && Boolean(q.sourceQuestionNumber?.trim())).length;
    const aiCount = allQuestions.filter((q) => q.sourceType === 'IA_PEDAGOGIQUE').length;

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
                Priorité Principale · Concours National de Résidanat
              </p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Préparation Complète au Résidanat de Médecine
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Base pédagogique hors-ligne : <span className="font-mono font-semibold tabular-nums">{curatedCount}</span> QCM d’entraînement couvrant 22 spécialités. Annales originales vérifiées : <span className="font-mono font-semibold tabular-nums">{archiveCount}</span> question(s) avec document, page et numéro contrôlés.
                {aiCount > 0 ? ` (+ ${aiCount} QCM générés par IA, clairement identifiés)` : ''}.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
                  onStartSession({
                    title: 'Simulation Concours de Résidanat',
                    mode: 'residanat_complet',
                    questionIds: shuffled.slice(0, Math.min(60, shuffled.length)).map((q) => q.id),
                    specialty: 'Toutes',
                    immediateFeedback: false,
                    timerMinutes: 90,
                  });
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
              >
                <Clock className="w-4 h-4" />
                Simulation Concours (60 QCM · 90 min)
              </button>
              <button
                onClick={() => {
                  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
                  onStartSession({
                    title: 'Mode Aléatoire Rapide (20 QCM)',
                    mode: 'aleatoire',
                    questionIds: shuffled.slice(0, Math.min(20, shuffled.length)).map((q) => q.id),
                    specialty: 'Toutes',
                    immediateFeedback: true,
                    timerMinutes: 0,
                  });
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
              >
                <Shuffle className="w-4 h-4 text-teal-600" />
                Mode aléatoire (20 QCM)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Annales originales vérifiées</p>
              <p className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                {archiveCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Spécialités couvertes</p>
              <p className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                {ALL_SPECIALTIES.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Erreurs à réviser</p>
              <p className="text-xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                {wrongCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Intégrité des sources</p>
              <p className="text-xs font-medium text-teal-700 dark:text-teal-400 mt-1">
                Référentiels identifiés · Zéro source fabriquée
              </p>
            </div>
          </div>
        </div>

        {/* 22 Specialties Grid */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Tests par spécialité (22 spécialités)
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_SPECIALTIES.map((spec) => {
              const specQuestions = allQuestions.filter((q) => q.specialty === spec);
              const stat = specialtyStats[spec];
              const pct = stat && stat.answered > 0 ? Math.round((stat.correct / stat.answered) * 100) : null;
              return (
                <div
                  key={spec}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{spec}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-0.5">
                      {specQuestions.length} QCM {pct !== null ? `· Réussite ${pct} %` : '· Non débuté'}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      onStartSession({
                        title: `Résidanat — ${spec}`,
                        mode: 'residanat_specialite',
                        questionIds: specQuestions.map((q) => q.id),
                        specialty: spec,
                        immediateFeedback: true,
                        timerMinutes: 0,
                      })
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 shrink-0"
                  >
                    <Play className="w-3 h-3" />
                    Lancer
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* On-demand AI QCM Expansion (transparently tagged) */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Générer des QCM d’entraînement complémentaires (IA pédagogique)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Créez de nouveaux QCM ciblés sur un chapitre précis et sauvegardez-les dans votre base locale hors-ligne. Ces questions sont explicitement marquées « Entraînement généré par IA » et ne sont jamais présentées comme des annales officielles.
            </p>
          </div>
          <form onSubmit={handleGenerateAIQuestions} className="grid gap-3 sm:grid-cols-4">
            <select
              value={aiSpecialty}
              onChange={(e) => setAiSpecialty(e.target.value as SpecialtyName)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            >
              {ALL_SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="Thème précis (ex : Valvulopathies aortiques)"
              className="sm:col-span-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-60"
            >
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {aiLoading ? 'Génération...' : 'Ajouter 3 QCM'}
            </button>
          </form>
          {aiError && <p className="text-xs text-rose-600 dark:text-rose-400">{aiError}</p>}
          {aiSuccessMsg && <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">{aiSuccessMsg}</p>}
        </section>
      </div>
    );
  }

  // 2. BANQUE QCM
  if (mode === 'qcm') {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Banque QCM & Configurateur de Session
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Filtrez par spécialité, difficulté et source, puis choisissez le mode correction immédiate ou examen chronométré.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Spécialité
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value as SpecialtyName | 'Toutes')}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="Toutes">Toutes les spécialités ({allQuestions.length})</option>
                {ALL_SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s} ({allQuestions.filter((q) => q.specialty === s).length})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Difficulté
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | 'Toutes')}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="Toutes">Toutes difficultés</option>
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Origine pédagogique
              </label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value as 'Toutes' | 'REFERENCE_PEDAGOGIQUE' | 'IA_PEDAGOGIQUE')}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="Toutes">Toutes les sources</option>
                <option value="REFERENCE_PEDAGOGIQUE">Référentiels médicaux vérifiés</option>
                <option value="IA_PEDAGOGIQUE">Entraînement généré par IA</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Nombre de questions
              </label>
              <select
                value={questionLimit}
                onChange={(e) => setQuestionLimit(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono"
              >
                <option value={10}>10 questions</option>
                <option value={20}>20 questions</option>
                <option value={40}>40 questions</option>
                <option value={filteredQuestions.length || 100}>Toutes ({filteredQuestions.length})</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={immediateFeedback}
                  onChange={(e) => setImmediateFeedback(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
                Correction immédiate après chaque réponse
              </label>

              {!immediateFeedback && (
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <span>Durée (min) :</span>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(Number(e.target.value) || 20)}
                    className="w-20 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-sm font-mono"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => launchFilteredQCM(true)}
                disabled={filteredQuestions.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                <Shuffle className="w-4 h-4" />
                Ordre aléatoire
              </button>
              <button
                onClick={() => launchFilteredQCM(false)}
                disabled={filteredQuestions.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40"
              >
                <Play className="w-4 h-4" />
                Démarrer ({Math.min(questionLimit, filteredQuestions.length)} QCM)
              </button>
            </div>
          </div>
        </div>

        {/* Preview list of matching QCMs */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Questions correspondantes ({filteredQuestions.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredQuestions.slice(0, 12).map((q) => (
              <div key={q.id} className="py-3 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono text-blue-700 dark:text-blue-400">{q.id}</span> · {q.specialty} · {q.difficulty}
                  </p>
                  <p className="text-sm text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-2">{q.stem}</p>
                </div>
                <button
                  onClick={() =>
                    onStartSession({
                      title: `${q.specialty} — ${q.id}`,
                      mode: 'banque_qcm',
                      questionIds: [q.id],
                      specialty: q.specialty,
                      immediateFeedback: true,
                      timerMinutes: 0,
                    })
                  }
                  className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
                >
                  Ouvrir
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. EMD SECTION
  if (mode === 'emd') {
    const emdArchives = HISTORICAL_ARCHIVES.filter((a) => a.examType === 'EMD');
    const yearPool = allQuestions.filter((q) => (emdYear === 7 ? true : q.yearLevel === emdYear));
    const subjectsInYear = Array.from(new Set(yearPool.map((q) => q.specialty)));

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Préparation aux EMD (Examens de Moyenne Durée)
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Entraînement par année d’étude et par module avec épreuves chronométrées, barème immédiat et corrections détaillées.
              </p>
            </div>
            <button
              onClick={() =>
                onStartSession({
                  title: `EMD Blanc — ${emdYear}e Année`,
                  mode: 'emd',
                  yearLevel: emdYear,
                  questionIds: yearPool.map((q) => q.id),
                  immediateFeedback: false,
                  timerMinutes: Math.max(15, yearPool.length * 2),
                })
              }
              disabled={yearPool.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
            >
              <Clock className="w-4 h-4" />
              EMD Chronométré {emdYear}e Année ({yearPool.length} QCM)
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            {[1, 2, 3, 4, 5, 6, 7].map((yr) => (
              <button
                key={yr}
                onClick={() => setEmdYear(yr)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  emdYear === yr
                    ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {yr === 1 ? '1ère Année' : `${yr}e Année`}
              </button>
            ))}
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Modules EMD disponibles — {emdYear === 1 ? '1ère Année' : `${emdYear}e Année`}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {subjectsInYear.map((spec) => {
              const qs = yearPool.filter((q) => q.specialty === spec);
              return (
                <div
                  key={spec}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      EMD {spec}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-0.5">
                      {qs.length} QCM vérifiés · Durée suggérée : {qs.length * 2} min
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        onStartSession({
                          title: `EMD Révision — ${spec}`,
                          mode: 'emd',
                          yearLevel: emdYear,
                          specialty: spec,
                          questionIds: qs.map((q) => q.id),
                          immediateFeedback: true,
                          timerMinutes: 0,
                        })
                      }
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Révision
                    </button>
                    <button
                      onClick={() =>
                        onStartSession({
                          title: `EMD Chronométré — ${spec}`,
                          mode: 'emd',
                          yearLevel: emdYear,
                          specialty: spec,
                          questionIds: qs.map((q) => q.id),
                          immediateFeedback: false,
                          timerMinutes: Math.max(10, qs.length * 2),
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                    >
                      Test chrono
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Séries EMD universitaires archivées
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {emdArchives.map((rec) => (
              <div key={rec.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Faculté de {rec.university} · {rec.year} · {rec.yearLevel}e Année
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{rec.specialty}</p>
                </div>
                <button
                  onClick={() =>
                    onStartSession({
                      title: `${rec.specialty} (${rec.university} ${rec.year})`,
                      mode: 'emd',
                      yearLevel: rec.yearLevel,
                      questionIds: rec.linkedQuestionIds,
                      immediateFeedback: false,
                      timerMinutes: Math.max(15, rec.linkedQuestionIds.length * 2),
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-medium hover:bg-teal-700"
                >
                  <Play className="w-3.5 h-3.5" />
                  Lancer ({rec.questionCount} QCM)
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // 4. ANNALES ET EXAMENS PRÉCÉDENTS (2002-2025)
  const yearsList = Array.from(new Set(HISTORICAL_ARCHIVES.map((a) => a.year))).sort((a, b) => b - a);
  const universitiesList = ['Toutes', ...Array.from(new Set(HISTORICAL_ARCHIVES.map((a) => a.university)))];

  const filteredArchives = HISTORICAL_ARCHIVES.filter((a) => {
    if (archiveYearFilter !== 'all' && a.year !== archiveYearFilter) return false;
    if (archiveUniFilter !== 'Toutes' && a.university !== archiveUniFilter) return false;
    if (archiveTypeFilter !== 'Tous' && a.examType !== archiveTypeFilter) return false;
    return true;
  });

  const launchArchive = (rec: HistoricalExamRecord) => {
    if (rec.linkedQuestionIds.length === 0) return;
    onStartSession({
      title: `${rec.examType} ${rec.year} — Faculté de ${rec.university}`,
      mode: rec.examType === 'EMD' ? 'emd' : 'residanat_complet',
      questionIds: rec.linkedQuestionIds,
      immediateFeedback: false,
      timerMinutes: Math.max(15, rec.linkedQuestionIds.length * 2),
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Annales et Examens Précédents (2002 – 2025)
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Registre historique organisé par année (2002–2025), faculté algérienne, spécialité et type d’épreuve. Par principe d’intégrité scientifique, les sessions dont l’épreuve officielle complète n’est pas disponible localement sont clairement marquées indisponibles sans jamais inventer de fausses questions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            Filtres :
          </div>
          <select
            value={archiveYearFilter}
            onChange={(e) => setArchiveYearFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-slate-100 font-mono"
          >
            <option value="all">Toutes les années (2002–2025)</option>
            {yearsList.map((y) => (
              <option key={y} value={y}>
                Session {y}
              </option>
            ))}
          </select>

          <select
            value={archiveUniFilter}
            onChange={(e) => setArchiveUniFilter(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-slate-100"
          >
            {universitiesList.map((u) => (
              <option key={u} value={u}>
                {u === 'Toutes' ? 'Toutes les universités' : `Faculté de ${u}`}
              </option>
            ))}
          </select>

          <select
            value={archiveTypeFilter}
            onChange={(e) => setArchiveTypeFilter(e.target.value as 'Tous' | 'Résidanat' | 'EMD')}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="Tous">Tous types (Résidanat & EMD)</option>
            <option value="Résidanat">Résidanat</option>
            <option value="EMD">EMD</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <th className="py-3 px-4">Année</th>
                <th className="py-3 px-4">Université</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Épreuve / Spécialité</th>
                <th className="py-3 px-4 text-right">Questions</th>
                <th className="py-3 px-4">Statut & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredArchives.map((rec) => {
                const available = rec.availability !== 'INDISPONIBLE_LOCALEMENT';
                const pedagogical = rec.availability === 'DISPONIBLE_SERIE_PEDAGOGIQUE';
                return (
                  <tr key={rec.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                      {rec.year}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200">{rec.university}</td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {rec.examType}
                    </td>
                    <td className="py-3.5 px-4">
                      {pedagogical && <p className="mb-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300">Entraînement pédagogique — pas une annale originale</p>}
                      <p className="font-medium text-slate-900 dark:text-slate-100">{rec.specialty}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{rec.sourceNote}</p>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700 dark:text-slate-200">
                      {available ? rec.questionCount : '—'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {available ? (
                        <button
                          onClick={() => launchArchive(rec)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                        >
                          <BookMarked className="w-3.5 h-3.5" />
                          {pedagogical ? "Ouvrir l’entraînement" : "Ouvrir la série"}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          Indisponible localement
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
