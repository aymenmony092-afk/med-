import React, { useMemo, useState } from 'react';
import {
  Bell,
  Bookmark,
  CheckCircle2,
  Download,
  Moon,
  Play,
  RotateCcw,
  Sun,
  Trash2,
} from 'lucide-react';
import { ALL_SPECIALTIES } from '../data/qcm_index';
import type {
  AppSettings,
  ArabicNotificationLog,
  FavoriteEntry,
  QCMQuestion,
  SectionId,
  StudySessionRecord,
  UserProgressState,
  WrongAnswerEntry,
} from '../types/med';

interface PersonalViewsProps {
  mode: 'favoris' | 'erreurs' | 'statistiques' | 'parametres';
  favorites: FavoriteEntry[];
  onRemoveFavorite: (id: string) => void;
  onOpenFavorite: (fav: FavoriteEntry) => void;
  wrongAnswers: WrongAnswerEntry[];
  questionsMap: Record<string, QCMQuestion>;
  onMarkWrongMastered: (questionId: string) => void;
  onStartWrongSession: (questionIds: string[]) => void;
  progress: UserProgressState;
  sessions: StudySessionRecord[];
  onResumeSession: (session: StudySessionRecord) => void;
  onDeleteSession: (id: string) => void;
  settings: AppSettings;
  onUpdateSettings: (next: AppSettings) => void;
  notifications: ArabicNotificationLog[];
  onTriggerArabicTestNotification: (category: ArabicNotificationLog['category']) => void;
  onExportBackup: () => void;
  onResetProgress: () => void;
  pwaInstall: {
    isInstallable: boolean;
    isInstalled: boolean;
    isIOS: boolean;
    install: () => Promise<boolean>;
  };
  onNavigate: (section: SectionId) => void;
}

function formatDuration(sec: number): string {
  const mins = Math.floor(sec / 60);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) return `${hrs} h ${mins % 60} min`;
  return `${mins} min`;
}

export const PersonalViews: React.FC<PersonalViewsProps> = ({
  mode,
  favorites,
  onRemoveFavorite,
  onOpenFavorite,
  wrongAnswers,
  questionsMap,
  onMarkWrongMastered,
  onStartWrongSession,
  progress,
  sessions,
  onResumeSession,
  onDeleteSession,
  settings,
  onUpdateSettings,
  notifications,
  onTriggerArabicTestNotification,
  onExportBackup,
  onResetProgress,
  pwaInstall,
  onNavigate,
}) => {
  const [favFilter, setFavFilter] = useState<'all' | FavoriteEntry['type']>('all');
  const [confirmReset, setConfirmReset] = useState(false);
  const specialtyBreakdown = useMemo(
    () =>
      ALL_SPECIALTIES.map((spec) => {
        const st = progress.specialtyStats[spec] || { answered: 0, correct: 0 };
        const pct = st.answered > 0 ? Math.round((st.correct / st.answered) * 100) : null;
        return { specialty: spec, ...st, pct };
      }),
    [progress.specialtyStats]
  );

  // 1. FAVORIS
  if (mode === 'favoris') {
    const filtered = favorites.filter((f) => favFilter === 'all' || f.type === favFilter);
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mes Favoris</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Accès rapide hors-ligne à vos QCM, cours, cas cliniques et fiches IA enregistrés.
              </p>
            </div>
            <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              {[
                { id: 'all' as const, label: `Tout (${favorites.length})` },
                { id: 'qcm' as const, label: 'QCM' },
                { id: 'lesson' as const, label: 'Cours' },
                { id: 'case' as const, label: 'Cas cliniques' },
                { id: 'ai_note' as const, label: 'Fiches IA' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFavFilter(t.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                    favFilter === t.id
                      ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-3">
            <Bookmark className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Aucun élément enregistré dans cette catégorie pour le moment.
            </p>
            <button
              onClick={() => onNavigate('residanat')}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
            >
              Explorer le Résidanat & QCM
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((fav) => (
              <div
                key={fav.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {fav.subtitle} · Enregistré le {new Date(fav.savedAt).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                    {fav.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenFavorite(fav)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                  >
                    Ouvrir
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(fav.id)}
                    aria-label="Retirer des favoris"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. MES ERREURS (Wrong-answer notebook)
  if (mode === 'erreurs') {
    const activeErrors = wrongAnswers.filter((w) => !w.mastered && questionsMap[w.questionId]);
    const masteredCount = wrongAnswers.filter((w) => w.mastered).length;

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Carnet d’Erreurs & Rattrapage Ciblé
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Chaque erreur commise en QCM est enregistrée automatiquement pour vous permettre de la retravailler jusqu’à maîtrise complète.
            </p>
            <p className="mt-2 text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              À retravailler : {activeErrors.length} · Erreurs maîtrisées : {masteredCount}
            </p>
          </div>
          {activeErrors.length > 0 && (
            <button
              onClick={() => onStartWrongSession(activeErrors.map((e) => e.questionId))}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              Refaire toutes mes erreurs ({activeErrors.length})
            </button>
          )}
        </div>

        {activeErrors.length === 0 ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Aucune erreur en attente ! Continuez vos séries QCM pour consolider vos acquis.
            </p>
            <button
              onClick={() => onNavigate('qcm')}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
            >
              Ouvrir la Banque QCM
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeErrors.map((err) => {
              const q = questionsMap[err.questionId];
              if (!q) return null;
              return (
                <div
                  key={err.questionId}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      <strong className="font-mono text-blue-700 dark:text-blue-400">{q.id}</strong> · {q.specialty} · Manquée{' '}
                      <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">{err.wrongCount}×</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onStartWrongSession([q.id])}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                      >
                        <Play className="w-3 h-3" />
                        Retester
                      </button>
                      <button
                        onClick={() => onMarkWrongMastered(q.id)}
                        className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        Marquer maîtrisée
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{q.stem}</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Réponse juste : {q.choices[q.correctIndex]}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{q.explanation}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 3. STATISTIQUES ET PROGRESSION
  if (mode === 'statistiques') {
    const successPct =
      progress.totalAnswered > 0 ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100) : 0;

    const weakSubjects = specialtyBreakdown
      .filter((s) => s.answered >= 1 && (s.pct ?? 100) < 65)
      .sort((a, b) => (a.pct ?? 0) - (b.pct ?? 0));

    const unfinishedSessions = sessions.filter((s) => !s.completedAt);
    const completedSessions = sessions.filter((s) => Boolean(s.completedAt));

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Statistiques & Progression de l’Étudiant
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Suivi automatique et persistant de votre préparation : taux de réussite, spécialités faibles, temps d’étude et reprise des examens.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Questions répondues</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                {progress.totalAnswered}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Réponses justes</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                {progress.totalCorrect}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Erreurs cumulées</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                {Math.max(0, progress.totalAnswered - progress.totalCorrect)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Taux de réussite</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-blue-700 dark:text-blue-400">
                {successPct} %
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Temps d’étude / Série</p>
              <p className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                {formatDuration(progress.totalStudySeconds)} · {progress.streakDays}j
              </p>
            </div>
          </div>
        </div>

        {/* Unfinished sessions (Resume) */}
        {unfinishedSessions.length > 0 && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Examens et sessions en cours (Reprendre là où vous vous êtes arrêté)
            </h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {unfinishedSessions.map((sess) => (
                <div key={sess.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{sess.title}</p>
                    <p className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      Progression : {Object.keys(sess.answers).length}/{sess.questionIds.length} questions · Mis à jour le{' '}
                      {new Date(sess.updatedAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onResumeSession(sess)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Reprendre
                    </button>
                    <button
                      onClick={() => onDeleteSession(sess.id)}
                      aria-label="Supprimer la session"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Progress by Specialty */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Performance par spécialité
            </h2>
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {specialtyBreakdown.map((item) => (
                <div key={item.specialty} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{item.specialty}</span>
                    <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {item.answered > 0 ? `${item.correct}/${item.answered} (${item.pct} %)` : '0 QCM'}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.pct === null
                          ? 'bg-slate-300 dark:bg-slate-700'
                          : item.pct >= 70
                          ? 'bg-emerald-500'
                          : item.pct >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${item.pct ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weak subjects & Daily history */}
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Matières faibles à consolider (&lt; 65 %)
              </h2>
              {weakSubjects.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Aucune matière faible détectée pour le moment (répondez à des QCM pour analyser vos points à renforcer).
                </p>
              ) : (
                <div className="space-y-2">
                  {weakSubjects.map((w) => (
                    <div
                      key={w.specialty}
                      className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">{w.specialty}</span>
                      <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                        {w.pct} % ({w.correct}/{w.answered})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Activité quotidienne récente
              </h2>
              {progress.dailyHistory.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Votre activité journalière apparaîtra ici dès votre première question répondue.
                </p>
              ) : (
                <div className="space-y-2">
                  {progress.dailyHistory.slice(-7).reverse().map((d) => (
                    <div key={d.date} className="flex items-center justify-between text-xs font-mono tabular-nums">
                      <span className="text-slate-600 dark:text-slate-300">{d.date}</span>
                      <span className="text-slate-800 dark:text-slate-100">
                        {d.answered} QCM · {d.correct} justes ({d.answered > 0 ? Math.round((d.correct / d.answered) * 100) : 0} %)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Completed Exam History */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Historique des examens terminés ({completedSessions.length})
          </h2>
          {completedSessions.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aucun examen terminé pour le moment.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {completedSessions.map((sess) => (
                <div key={sess.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{sess.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                      Terminé le {new Date(sess.completedAt!).toLocaleString('fr-FR')} · {sess.questionIds.length} QCM
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-mono tabular-nums text-blue-700 dark:text-blue-400">
                      {sess.scorePercent ?? 0} %
                    </span>
                    <button
                      onClick={() => onResumeSession(sess)}
                      className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Revoir la correction
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. PARAMÈTRES
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Paramètres & Préférences
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Personnalisez l’affichage, votre profil universitaire, les notifications en langue arabe, le mode hors-ligne et l’installation sur Android.
          </p>
        </div>

        {/* Theme & Profile */}
        <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Profil étudiant</h2>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Nom / Prénom
              </label>
              <input
                type="text"
                value={settings.studentName}
                onChange={(e) => onUpdateSettings({ ...settings, studentName: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Faculté de médecine
              </label>
              <input
                type="text"
                value={settings.university}
                onChange={(e) => onUpdateSettings({ ...settings, university: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Année actuelle
                </label>
                <select
                  value={settings.currentYear}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, currentYear: Number(e.target.value) as AppSettings['currentYear'] })
                  }
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((y) => (
                    <option key={y} value={y}>
                      {y === 1 ? '1ère Année' : `${y}e Année`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Objectif quotidien (QCM)
                </label>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={settings.dailyQuestionGoal}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, dailyQuestionGoal: Math.max(5, Number(e.target.value) || 20) })
                  }
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Apparence & Installation</h2>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Thème d’affichage</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mode clair ou sombre optimisé pour la lecture prolongée
                </p>
              </div>
              <button
                onClick={() =>
                  onUpdateSettings({ ...settings, theme: settings.theme === 'light' ? 'dark' : 'light' })
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
                {settings.theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Installation Android & Mode Hors-Ligne (PWA)
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                MED DZ stocke vos cours, QCM, statistiques et favoris localement dans IndexedDB et via Service Worker.
              </p>
              {pwaInstall.isInstalled ? (
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Application déjà installée en mode autonome.
                </p>
              ) : pwaInstall.isInstallable ? (
                <button
                  onClick={pwaInstall.install}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                >
                  <Download className="w-4 h-4" />
                  Installer MED DZ sur cet appareil
                </button>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sur Android (Chrome), ouvrez le menu du navigateur et sélectionnez « Installer l’application » ou « Ajouter à l’écran d’accueil ».
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Arabic Notifications Section */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-600" />
                Notifications et rappels (en langue arabe)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Rappels quotidiens, examens inachevés, objectifs d’étude, séries de révision et séances programmées.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.arabicNotificationsEnabled}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, arabicNotificationsEnabled: e.target.checked })
                }
              />
              Activer les rappels en arabe
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1">
                Heure du rappel quotidien
              </label>
              <input
                type="time"
                value={settings.dailyReminderTime}
                onChange={(e) => onUpdateSettings({ ...settings, dailyReminderTime: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1">
                Séance d’entraînement programmée
              </label>
              <input
                type="time"
                value={settings.scheduledSessionTime}
                onChange={(e) => onUpdateSettings({ ...settings, scheduledSessionTime: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-mono"
              />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 pb-2">
                <input
                  type="checkbox"
                  checked={settings.unfinishedExamReminder}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, unfinishedExamReminder: e.target.checked })
                  }
                />
                Alerte examen inachevé
              </label>
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 pb-2">
                <input
                  type="checkbox"
                  checked={settings.streakReminder}
                  onChange={(e) => onUpdateSettings({ ...settings, streakReminder: e.target.checked })}
                />
                Rappel de série quotidienne
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onTriggerArabicTestNotification('daily')}
              className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-medium hover:bg-teal-700"
            >
              Tester rappel quotidien (AR)
            </button>
            <button
              onClick={() => onTriggerArabicTestNotification('unfinished')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Tester examen inachevé (AR)
            </button>
            <button
              onClick={() => onTriggerArabicTestNotification('goal')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Tester objectif d’étude (AR)
            </button>
            <button
              onClick={() => onTriggerArabicTestNotification('streak')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Tester série de révision (AR)
            </button>
          </div>

          {notifications.length > 0 && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Historique des notifications arabes récentes
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notifications.slice(0, 6).map((n) => (
                  <div
                    key={n.id}
                    dir="rtl"
                    className="font-arabic rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-right"
                  >
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-400">{n.arabicTitle}</p>
                    <p className="text-xs text-slate-700 dark:text-slate-200 mt-0.5">{n.arabicBody}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Data Backup & Reset */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onExportBackup}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Download className="w-4 h-4" />
              Exporter mes données hors-ligne (JSON)
            </button>
          </div>

          <div>
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="px-3 py-2 rounded-lg border border-rose-200 dark:border-rose-900 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                Réinitialiser ma progression
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-600">Confirmer la suppression ?</span>
                <button
                  onClick={() => {
                    onResetProgress();
                    setConfirmReset(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-medium"
                >
                  Oui, réinitialiser
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
