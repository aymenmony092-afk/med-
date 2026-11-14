import React from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Clock,
  FileQuestion,
  GraduationCap,
  Play,
  RotateCcw,
  Sparkles,
  Stethoscope,
  Wrench,
} from 'lucide-react';
import { ACADEMIC_YEARS, MEDICAL_LESSONS } from '../data/curriculum';
import heroBannerImg from '../assets/images/med_dz_hero_banner_1794659124857.jpg';
import type {
  AppSettings,
  ArabicNotificationLog,
  QCMQuestion,
  SectionId,
  StudySessionRecord,
  UserProgressState,
} from '../types/med';

interface HomeViewProps {
  settings: AppSettings;
  progress: UserProgressState;
  allQuestions: QCMQuestion[];
  wrongCount: number;
  sessions: StudySessionRecord[];
  latestArabicNotification: ArabicNotificationLog | null;
  onNavigate: (section: SectionId) => void;
  onResumeSession: (session: StudySessionRecord) => void;
  onQuickStartResidanat: () => void;
  onOpenLesson: (lessonId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  settings,
  progress,
  allQuestions,
  wrongCount,
  sessions,
  latestArabicNotification,
  onNavigate,
  onResumeSession,
  onQuickStartResidanat,
  onOpenLesson,
}) => {
  const unfinished = sessions.find((s) => !s.completedAt) || null;
  const successRate =
    progress.totalAnswered > 0 ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100) : 0;

  const today = new Date().toISOString().slice(0, 10);
  const todayAnswered = progress.dailyHistory.find((d) => d.date === today)?.answered ?? 0;

  return (
    <div className="space-y-6">
      {/* Hero Split Banner */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden grid lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
              MED DZ · {settings.university} · {settings.currentYear === 1 ? '1ère Année' : `${settings.currentYear}e Année`}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight [text-wrap:balance]">
              Plateforme Algérienne d’Études Médicales & Préparation au Résidanat
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Révisez le programme complet de la 1ère à la 7ème année avec des QCM pédagogiques corrigés, consultez les annales dont la provenance est documentée et entraînez-vous sur des cas cliniques hors-ligne.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onQuickStartResidanat}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
            >
              <Play className="w-4 h-4" />
              Lancer une série Résidanat
            </button>
            <button
              onClick={() => onNavigate('emd')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
            >
              <GraduationCap className="w-4 h-4 text-teal-600" />
              Préparer un EMD
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 min-h-[220px] bg-slate-100 dark:bg-slate-800 relative">
          <img
            src={heroBannerImg}
            alt="Bureau d'études médicales avec blouse blanche, stéthoscope et atlas anatomique"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 4-column KPI strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">Objectif du jour</p>
          <p className="mt-1 text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
            {todayAnswered} / {settings.dailyQuestionGoal} QCM
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">Taux de réussite global</p>
          <p className="mt-1 text-xl font-bold font-mono tabular-nums text-blue-700 dark:text-blue-400">
            {successRate} %
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">Banque d’entraînement hors-ligne</p>
          <p className="mt-1 text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
            {allQuestions.length} questions
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Annales originales vérifiées : {allQuestions.filter((q) => q.sourceType === 'ARCHIVE_VERIFIEE' && (q.reference?.startsWith('https://') || q.reference?.startsWith('http://')) && ['Alger', 'Oran', 'Batna'].includes(q.university || '') && Number.isInteger(q.examYear) && Number(q.examYear) >= 2008 && Number(q.examYear) <= 2026 && Boolean(q.sourceDocumentTitle?.trim()) && Number.isInteger(q.sourcePage) && (q.sourcePage ?? 0) > 0 && Boolean(q.sourceQuestionNumber?.trim())).length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">Erreurs à consolider</p>
          <p className="mt-1 text-xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            {wrongCount} QCM
          </p>
        </div>
      </section>

      {/* Resume Unfinished Session + Latest Arabic Reminder */}
      <div className="grid gap-4 lg:grid-cols-2">
        {unfinished ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Session en cours sauvegardée
              </p>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-1 truncate">
                {unfinished.title}
              </h2>
              <p className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400 mt-0.5">
                {Object.keys(unfinished.answers).length}/{unfinished.questionIds.length} questions répondues
              </p>
            </div>
            <button
              onClick={() => onResumeSession(unfinished)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 whitespace-nowrap shrink-0"
            >
              Reprendre
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-teal-700 dark:text-teal-400">Rattrapage intelligent</p>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-1">
                Carnet d’erreurs & Statistique
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Suivez votre progression par spécialité et retravaillez vos lacunes.
              </p>
            </div>
            <button
              onClick={() => onNavigate(wrongCount > 0 ? 'erreurs' : 'statistiques')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
            >
              {wrongCount > 0 ? <RotateCcw className="w-3.5 h-3.5" /> : <BarChart3 className="w-3.5 h-3.5" />}
              {wrongCount > 0 ? 'Mes erreurs' : 'Statistiques'}
            </button>
          </div>
        )}

        <div
          dir="rtl"
          className="font-arabic rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-center"
        >
          <p className="text-xs font-bold text-teal-700 dark:text-teal-400">
            {latestArabicNotification?.arabicTitle || 'تذكير المراجعة اليومية — MED DZ'}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">
            {latestArabicNotification?.arabicBody ||
              `هدفك اليومي: ${settings.dailyQuestionGoal} سؤالاً. حافظ على استمرارية المراجعة (${progress.streakDays} يوم متتالي).`}
          </p>
        </div>
      </div>

      {/* Quick Access Modules */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Accès direct aux espaces d’étude
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              id: 'residanat' as SectionId,
              title: 'Résidanat',
              desc: '22 spécialités & simulation concours',
              icon: GraduationCap,
            },
            {
              id: 'qcm' as SectionId,
              title: 'Banque QCM',
              desc: 'Filtres multi-critères & mode aléatoire',
              icon: FileQuestion,
            },
            {
              id: 'cas-cliniques' as SectionId,
              title: 'Cas cliniques',
              desc: 'Raisonnement diagnostique interactif',
              icon: Stethoscope,
            },
            {
              id: 'resumes' as SectionId,
              title: 'Résumés intelligents',
              desc: 'Fiches, flashcards & pièges par IA',
              icon: Sparkles,
            },
            {
              id: 'cours' as SectionId,
              title: 'Cours médicaux',
              desc: `${MEDICAL_LESSONS.length} leçons complètes hors-ligne`,
              icon: BookOpen,
            },
            {
              id: 'outils' as SectionId,
              title: 'Outils médicaux',
              desc: 'IMC, convertisseur, labo & formules',
              icon: Wrench,
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className="text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-sm">
                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    {card.title}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{card.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Years 1-7 Quick Bar + Featured Lessons */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Parcours par année (1ère à 7ème)
            </h2>
            <button
              onClick={() => onNavigate('annees')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Tout voir
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ACADEMIC_YEARS.map((y) => (
              <button
                key={y.year}
                onClick={() => onNavigate(y.sectionId)}
                className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2.5 text-left hover:border-blue-500 transition-colors"
              >
                <p className="text-xs font-bold font-mono text-blue-700 dark:text-blue-400">
                  {y.year === 1 ? '1ère Année' : `${y.year}e Année`}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {y.modules[0]?.specialty}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Leçons recommandées hors-ligne
            </h2>
            <button
              onClick={() => onNavigate('cours')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Catalogue complet
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {MEDICAL_LESSONS.filter((l) => l.year === settings.currentYear || l.year === 4)
              .slice(0, 3)
              .map((l) => (
                <button
                  key={l.id}
                  onClick={() => onOpenLesson(l.id)}
                  className="w-full text-left py-2.5 flex items-center justify-between gap-3 hover:opacity-80"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {l.year}e Année · {l.specialty}
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {l.title}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-blue-600 dark:text-blue-400 shrink-0">
                    {l.durationMin} min
                  </span>
                </button>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};
