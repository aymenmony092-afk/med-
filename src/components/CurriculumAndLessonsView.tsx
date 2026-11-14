import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  GraduationCap,
  Layers,
  Loader2,
  Play,
  RotateCw,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react';
import { ACADEMIC_YEARS, MEDICAL_LESSONS } from '../data/curriculum';
import { CLINICAL_CASES } from '../data/clinical_cases';
import type {
  MedicalLesson,
  QCMQuestion,
  SavedAINote,
  SectionId,
  SpecialtyName,
} from '../types/med';
import { MedicalDiagramSVG } from './MedicalBrandLogo';
import { AnatomyDiagramViewer, resolveBoardIdForLesson } from './AnatomyDiagramViewer';

interface CurriculumAndLessonsViewProps {
  mode: 'overview' | 'year' | 'lessons';
  selectedYear?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  activeLessonId: string | null;
  onSelectLesson: (id: string | null) => void;
  onNavigate: (section: SectionId) => void;
  completedLessonIds: string[];
  onToggleLessonCompleted: (lessonId: string) => void;
  favoriteIds: Set<string>;
  onToggleFavoriteLesson: (lesson: MedicalLesson) => void;
  onStartYearQCM: (year: number, title: string, specialty?: SpecialtyName) => void;
  onStartYearEMD: (year: number) => void;
  onSendLessonToAI: (lesson: MedicalLesson) => void;
  onOpenClinicalCase: (caseId: string) => void;
  allQuestions: QCMQuestion[];
  savedAINotes: SavedAINote[];
  onSaveAINote: (note: SavedAINote) => Promise<void> | void;
  onToggleFavoriteNote: (note: SavedAINote) => void;
}

export const CurriculumAndLessonsView: React.FC<CurriculumAndLessonsViewProps> = ({
  mode,
  selectedYear,
  activeLessonId,
  onSelectLesson,
  onNavigate,
  completedLessonIds,
  onToggleLessonCompleted,
  favoriteIds,
  onToggleFavoriteLesson,
  onStartYearQCM,
  onStartYearEMD,
  onSendLessonToAI,
  onOpenClinicalCase,
  allQuestions,
  savedAINotes,
  onSaveAINote,
  onToggleFavoriteNote,
}) => {
  const [filterYear, setFilterYear] = useState<number | 'all'>('all');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('Toutes');
  const [atlasExpanded, setAtlasExpanded] = useState<boolean>(true);
  const [generatingLessonId, setGeneratingLessonId] = useState<string | null>(null);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);
  const [modalNoteId, setModalNoteId] = useState<string | null>(null);
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const notesByLessonId = useMemo(() => {
    const map: Record<string, SavedAINote> = {};
    for (const note of savedAINotes) {
      if (note.lessonId && !map[note.lessonId]) {
        map[note.lessonId] = note;
      }
    }
    return map;
  }, [savedAINotes]);

  const modalNote = useMemo(
    () => savedAINotes.find((n) => n.id === modalNoteId) || null,
    [savedAINotes, modalNoteId]
  );

  const handleGenerateLessonSummary = async (
    lesson: MedicalLesson,
    openModalOnComplete: boolean
  ) => {
    setGeneratingLessonId(lesson.id);
    setSynthesisError(null);
    setFlippedCards({});

    try {
      const resp = await fetch('/api/ai/lesson-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          title: lesson.title,
          year: lesson.year,
          specialty: lesson.specialty,
          chapter: lesson.chapter,
          objectives: lesson.objectives,
          definitions: lesson.definitions,
          contentSections: lesson.contentSections,
          highYieldPoints: lesson.highYieldPoints,
          summary: lesson.summary,
          reference: lesson.reference,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(
          data.error || 'Erreur lors de la génération de la fiche de synthèse.'
        );
      }

      const generatedNote: SavedAINote = {
        id: `SYNTH-${lesson.id}-${Date.now()}`,
        lessonId: lesson.id,
        mode: 'revision_sheet',
        title: data.title || `Fiche de synthèse — ${lesson.title}`,
        specialty: lesson.specialty,
        summary: data.summary || lesson.summary,
        clinicalTakeaway: data.clinicalTakeaway || undefined,
        keyPoints: Array.isArray(data.keyPoints) ? data.keyPoints : [],
        examTraps: Array.isArray(data.examTraps) ? data.examTraps : [],
        flashcards: Array.isArray(data.flashcards) ? data.flashcards : [],
        referenceNote: data.referenceNote || lesson.reference,
        createdAt: new Date().toISOString(),
      };

      await onSaveAINote(generatedNote);
      if (openModalOnComplete) {
        setModalNoteId(generatedNote.id);
      }
    } catch (err) {
      setSynthesisError(
        err instanceof Error
          ? err.message
          : 'Impossible de joindre l’API Gemini. Vérifiez votre connexion internet.'
      );
    } finally {
      setGeneratingLessonId(null);
    }
  };

  const handleCopySynthesis = async (note: SavedAINote) => {
    const lines = [
      `${note.title} (${note.specialty})`,
      '',
      'SYNTHÈSE RÉSUMÉE :',
      note.summary,
      ...(note.clinicalTakeaway ? ['', 'CONDUITE / MESSAGE CLINIQUE CLÉ :', note.clinicalTakeaway] : []),
      ...(note.keyPoints.length > 0
        ? ['', 'POINTS CLÉS EMD & RÉSIDANAT :', ...note.keyPoints.map((p) => `- ${p}`)]
        : []),
      ...(note.examTraps.length > 0
        ? ['', 'PIÈGES FRÉQUENTS EN QCM :', ...note.examTraps.map((t) => `- ${t}`)]
        : []),
      '',
      `Référence : ${note.referenceNote}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(lines);
      setCopiedNoteId(note.id);
      setTimeout(() => setCopiedNoteId((prev) => (prev === note.id ? null : prev)), 2200);
    } catch {
      // Clipboard API unavailable in restricted context
    }
  };

  const renderSynthesisCard = (note: SavedAINote, lesson: MedicalLesson | undefined, isModal: boolean) => {
    const isFav = favoriteIds.has(note.id);
    const isCopied = copiedNoteId === note.id;
    const isGeneratingThis = lesson ? generatingLessonId === lesson.id : false;

    return (
      <div className="rounded-xl border border-teal-200 dark:border-teal-900/70 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="px-5 py-4 bg-teal-50/70 dark:bg-teal-950/30 border-b border-teal-200 dark:border-teal-900/60 flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-medium text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              Fiche de synthèse résumée · Générée via Gemini · Sauvegardée hors-ligne
            </p>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {note.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {note.specialty} · {new Date(note.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleCopySynthesis(note)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {isCopied ? 'Copiée' : 'Copier'}
            </button>
            <button
              type="button"
              onClick={() => onToggleFavoriteNote(note)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap ${
                isFav
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {isFav ? 'Favori' : 'Sauvegarder'}
            </button>
            {lesson && (
              <button
                type="button"
                disabled={isGeneratingThis}
                onClick={() => handleGenerateLessonSummary(lesson, isModal)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-300 dark:border-teal-800 bg-white dark:bg-slate-900 text-xs font-medium text-teal-800 dark:text-teal-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 disabled:opacity-60 whitespace-nowrap"
              >
                {isGeneratingThis ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RotateCw className="w-3.5 h-3.5" />
                )}
                Régénérer
              </button>
            )}
            {isModal && (
              <button
                type="button"
                onClick={() => setModalNoteId(null)}
                aria-label="Fermer la fiche de synthèse"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/25 px-3.5 py-2.5 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Contenu synthétisé par intelligence artificielle (Gemini) à partir du cours. Vérifiez systématiquement les posologies et conduites cliniques sur les référentiels officiels.
            </span>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Synthèse structurée du cours
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {note.summary}
            </p>
          </div>

          {note.clinicalTakeaway && (
            <div className="rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 p-3.5 space-y-1">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                Message clinique clé & Réflexe pratique
              </p>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {note.clinicalTakeaway}
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {note.keyPoints.length > 0 && (
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-2">
                <h4 className="text-xs font-semibold text-teal-800 dark:text-teal-300">
                  Points clés EMD & Résidanat
                </h4>
                <ul className="space-y-1.5">
                  {note.keyPoints.map((pt, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {note.examTraps.length > 0 && (
              <div className="rounded-lg border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 p-4 space-y-2">
                <h4 className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                  Pièges classiques en QCM
                </h4>
                <ul className="space-y-1.5">
                  {note.examTraps.map((trap, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-rose-600 dark:text-rose-400 font-bold">!</span>
                      <span>{trap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {note.flashcards.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Flashcards express (cliquer pour révéler la réponse)
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {note.flashcards.map((fc, idx) => {
                  const flipped = Boolean(flippedCards[idx]);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setFlippedCards((prev) => ({ ...prev, [idx]: !prev[idx] }))
                      }
                      className={`text-left rounded-lg border p-3 transition-colors ${
                        flipped
                          ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-blue-400'
                      }`}
                    >
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                        {flipped ? 'Réponse' : `Carte ${idx + 1} · Question`}
                      </p>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                        {flipped ? fc.back : fc.front}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>Référence : {note.referenceNote}</span>
            {isModal && lesson && (
              <button
                type="button"
                onClick={() => {
                  setModalNoteId(null);
                  onSelectLesson(lesson.id);
                }}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Ouvrir le cours complet →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const activeLesson = useMemo(
    () => MEDICAL_LESSONS.find((l) => l.id === activeLessonId) || null,
    [activeLessonId]
  );

  const specialties = useMemo(() => {
    const set = new Set(MEDICAL_LESSONS.map((l) => l.specialty));
    return ['Toutes', ...Array.from(set)];
  }, []);

  const filteredLessons = useMemo(() => {
    return MEDICAL_LESSONS.filter((l) => {
      if (filterYear !== 'all' && l.year !== filterYear) return false;
      if (filterSpecialty !== 'Toutes' && l.specialty !== filterSpecialty) return false;
      return true;
    });
  }, [filterYear, filterSpecialty]);

  // Full Lesson Reader Screen
  if (activeLesson) {
    const isCompleted = completedLessonIds.includes(activeLesson.id);
    const isFav = favoriteIds.has(activeLesson.id);
    const existingLessonNote = notesByLessonId[activeLesson.id] || null;
    const isGeneratingCurrent = generatingLessonId === activeLesson.id;

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4">
          <button
            onClick={() => onSelectLesson(null)}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
          >
            ← Retour aux cours
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isGeneratingCurrent}
              onClick={() => handleGenerateLessonSummary(activeLesson, false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-medium hover:bg-teal-700 disabled:opacity-60 whitespace-nowrap"
            >
              {isGeneratingCurrent ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              {isGeneratingCurrent
                ? 'Synthèse Gemini en cours...'
                : existingLessonNote
                ? 'Actualiser la fiche Gemini'
                : 'Générer fiche de synthèse (Gemini)'}
            </button>
            <button
              type="button"
              onClick={() => onSendLessonToAI(activeLesson)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-300 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/40 text-xs font-medium text-teal-800 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/50 whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              Ouvrir dans Résumés IA
            </button>
            <button
              onClick={() => onToggleFavoriteLesson(activeLesson)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap ${
                isFav
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {isFav ? 'Favori enregistré' : 'Ajouter aux favoris'}
            </button>
            <button
              onClick={() => onToggleLessonCompleted(activeLesson.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                isCompleted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isCompleted ? 'Cours maîtrisé' : 'Marquer comme lu'}
            </button>
          </div>
        </div>

        {synthesisError && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-4 text-xs text-rose-800 dark:text-rose-200 flex items-center justify-between gap-3">
            <span>{synthesisError}</span>
            <button
              type="button"
              onClick={() => setSynthesisError(null)}
              className="text-rose-600 dark:text-rose-300 font-semibold"
            >
              Fermer
            </button>
          </div>
        )}

        {existingLessonNote && renderSynthesisCard(existingLessonNote, activeLesson, false)}

        <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 space-y-8">
          <header className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{activeLesson.year}e Année Médecine</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-blue-700 dark:text-blue-400">{activeLesson.specialty}</span>
              <span aria-hidden="true">·</span>
              <span>{activeLesson.chapter}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                <Clock className="w-3.5 h-3.5" />
                {activeLesson.durationMin} min
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {activeLesson.title}
            </h1>
          </header>

          {/* Learning Objectives */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Objectifs pédagogiques
            </h2>
            <ul className="space-y-2">
              {activeLesson.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                    0{i + 1}.
                  </span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Definitions */}
          {activeLesson.definitions.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Définitions fondamentales
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {activeLesson.definitions.map((def, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{def.term}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{def.definition}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Medical Diagram */}
          {activeLesson.diagramType !== 'none' && (
            <section className="space-y-2.5">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Schéma anatomique et physiopathologique interactif
              </h2>
              {['anatomy', 'neuro', 'cardiac', 'nephron', 'respiratory'].includes(
                activeLesson.diagramType
              ) ? (
                <AnatomyDiagramViewer
                  compact
                  initialBoardId={resolveBoardIdForLesson(
                    activeLesson.id,
                    activeLesson.diagramType
                  )}
                />
              ) : (
                <MedicalDiagramSVG type={activeLesson.diagramType} />
              )}
            </section>
          )}

          {/* Core Content */}
          <section className="space-y-6">
            {activeLesson.contentSections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{sec.heading}</h2>
                <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-7 max-w-[75ch]">
                  {sec.body}
                </p>
              </div>
            ))}
          </section>

          {/* Summary & High-Yield Points */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-blue-50/50 dark:bg-blue-950/20 p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                Résumé express pour la révision
              </h3>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeLesson.summary}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-teal-800 dark:text-teal-300 mb-2">
                Points clés tombables à l’EMD et au Résidanat
              </h4>
              <ul className="space-y-1.5">
                {activeLesson.highYieldPoints.map((pt, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Référence académique : {activeLesson.reference}
            </p>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() =>
                onStartYearQCM(activeLesson.year, `QCM — ${activeLesson.specialty}`, activeLesson.specialty)
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              <Play className="w-4 h-4" />
              S’entraîner en QCM sur {activeLesson.specialty}
            </button>
            <button
              onClick={() => onSelectLesson(null)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Fermer le cours
            </button>
          </div>
        </article>
      </div>
    );
  }

  // Overview of all 7 years
  if (mode === 'overview') {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Cursus des Études Médicales en Algérie (1ère à 7ème Année)
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Accédez au programme structuré des sept années de médecine : modules officiels, chapitres, leçons détaillées, fiches de synthèse, exercices QCM, préparation aux EMD et cas cliniques hospitaliers.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {ACADEMIC_YEARS.map((yr) => {
            const yearLessons = MEDICAL_LESSONS.filter((l) => l.year === yr.year);
            const doneCount = yearLessons.filter((l) => completedLessonIds.includes(l.id)).length;
            const yearQcmCount = allQuestions.filter((q) => q.yearLevel === yr.year).length;

            return (
              <div
                key={yr.year}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-blue-700 dark:text-blue-400">{yr.cycle}</span>
                    <span className="font-mono tabular-nums">
                      {yearLessons.length} cours · {yearQcmCount} QCM ciblés
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{yr.title}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{yr.description}</p>
                  <div className="pt-2 text-xs text-slate-500 dark:text-slate-400">
                    Modules principaux : {yr.modules.map((m) => m.specialty).join(' · ')}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    Progression : {doneCount}/{yearLessons.length} leçons lues
                  </span>
                  <button
                    onClick={() => onNavigate(yr.sectionId)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 whitespace-nowrap"
                  >
                    Ouvrir l’année
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Dedicated screen for a specific year (Première à Septième année)
  if (mode === 'year' && selectedYear) {
    const yearInfo = ACADEMIC_YEARS.find((y) => y.year === selectedYear)!;
    const yearLessons = MEDICAL_LESSONS.filter((l) => l.year === selectedYear);
    const yearCases = CLINICAL_CASES.filter((c) => c.yearLevel === selectedYear);
    const yearQuestions = allQuestions.filter((q) => q.yearLevel === selectedYear);

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <button onClick={() => onNavigate('annees')} className="hover:underline text-blue-600 dark:text-blue-400">
                Années d’études
              </button>
              <span aria-hidden="true">/</span>
              <span>{yearInfo.cycle}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{yearInfo.title}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{yearInfo.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onStartYearEMD(selectedYear)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
            >
              <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              EMD {selectedYear}e Année
            </button>
            <button
              onClick={() =>
                onStartYearQCM(
                  selectedYear,
                  selectedYear === 7 ? 'Préparation Résidanat (7e Année)' : `QCM ${selectedYear}e Année`
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
            >
              <Play className="w-4 h-4" />
              Lancer QCM ({selectedYear === 7 ? allQuestions.length : yearQuestions.length} disponibles)
            </button>
          </div>
        </div>

        {/* Modules of this year */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Modules & Unités d’enseignement
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {yearInfo.modules.map((mod, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {mod.semesters} · Coeff. {mod.coefficient}
                    </p>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                      {mod.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => onStartYearQCM(selectedYear, `QCM — ${mod.specialty}`, mod.specialty)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-300 whitespace-nowrap shrink-0"
                  >
                    QCM {mod.specialty}
                  </button>
                </div>
                <ul className="space-y-1">
                  {mod.keyTopics.map((t, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                      <span className="text-teal-600 dark:text-teal-400">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Lessons of this year */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Cours détaillés de la {selectedYear}e année ({yearLessons.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {yearLessons.map((lesson) => {
              const isDone = completedLessonIds.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-blue-700 dark:text-blue-400">{lesson.specialty}</span>
                      <span className="font-mono tabular-nums">{lesson.durationMin} min</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{lesson.summary}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className={`text-xs font-medium ${isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                      {isDone ? 'Lu et maîtrisé' : 'À étudier'}
                    </span>
                    <button
                      onClick={() => onSelectLesson(lesson.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Lire le cours
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Clinical Cases for Clinical Years (4-7) */}
        {selectedYear >= 4 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Cas cliniques recommandés (Simulations pédagogiques)
              </h2>
              <button
                onClick={() => onNavigate('cas-cliniques')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Voir tous les cas cliniques →
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {(yearCases.length > 0 ? yearCases : CLINICAL_CASES.slice(0, 2)).map((cc) => (
                <div
                  key={cc.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {cc.specialty} · Difficulté : {cc.difficulty}
                    </p>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 truncate">
                      {cc.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => onOpenClinicalCase(cc.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    Ouvrir
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // All Medical Lessons Library (Cours médicaux)
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Cours médicaux (1ère à 7ème Année)
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Bibliothèque hors-ligne de cours structurés : objectifs, définitions, schémas explicatifs, points clés d’examen et résumés.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            aria-label="Filtrer par année d'études"
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-200"
          >
            <option value="all">Toutes les années (1 à 7)</option>
            {[1, 2, 3, 4, 5, 6, 7].map((y) => (
              <option key={y} value={y}>
                {y}ère/e Année
              </option>
            ))}
          </select>

          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            aria-label="Filtrer par spécialité"
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-200"
          >
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s === 'Toutes' ? 'Toutes les spécialités' : s}
              </option>
            ))}
          </select>

          <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400 ml-auto">
            {filteredLessons.length} cours disponibles hors-ligne
          </span>
        </div>
      </div>

      {/* Interactive High-Resolution Anatomy Diagrams Atlas */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Schémas d’anatomie haute résolution & Auto-évaluation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Zoomez jusqu’à 300 %, déplacez la planche et masquez les étiquettes pour tester vos connaissances.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAtlasExpanded((v) => !v)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
          >
            {atlasExpanded ? 'Réduire le module' : 'Afficher les schémas'}
          </button>
        </div>

        {atlasExpanded && <AnatomyDiagramViewer initialBoardId="plexus_brachial" />}
      </section>

      {synthesisError && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-4 text-xs text-rose-800 dark:text-rose-200 flex items-center justify-between gap-3">
          <span>{synthesisError}</span>
          <button
            type="button"
            onClick={() => setSynthesisError(null)}
            className="text-rose-600 dark:text-rose-300 font-semibold"
          >
            Fermer
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {filteredLessons.map((lesson) => {
          const isDone = completedLessonIds.includes(lesson.id);
          const existingNote = notesByLessonId[lesson.id];
          const isGeneratingThis = generatingLessonId === lesson.id;
          return (
            <div
              key={lesson.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    {lesson.year}e Année · <strong className="text-blue-700 dark:text-blue-400">{lesson.specialty}</strong>
                  </span>
                  <span className="font-mono tabular-nums">{lesson.durationMin} min</span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                  {lesson.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{lesson.summary}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className={`text-xs font-medium ${isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {isDone ? 'Maîtrisé' : 'Non lu'}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isGeneratingThis}
                    onClick={() =>
                      existingNote
                        ? setModalNoteId(existingNote.id)
                        : handleGenerateLessonSummary(lesson, true)
                    }
                    title="Envoyer le contenu du cours à Gemini pour générer une fiche de synthèse résumée"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-300 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 text-xs font-medium hover:bg-teal-100 dark:hover:bg-teal-900/50 disabled:opacity-60 whitespace-nowrap"
                  >
                    {isGeneratingThis ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    {isGeneratingThis
                      ? 'Synthèse...'
                      : existingNote
                      ? 'Voir fiche IA'
                      : 'Synthèse Gemini'}
                  </button>
                  <button
                    onClick={() => onSelectLesson(lesson.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 whitespace-nowrap"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Ouvrir le cours
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal displaying generated synthesis sheet inside Cours médicaux */}
      {modalNote && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto flex items-start justify-center">
          <div className="w-full max-w-3xl my-auto">
            {renderSynthesisCard(
              modalNote,
              MEDICAL_LESSONS.find((l) => l.id === modalNote.lessonId),
              true
            )}
          </div>
        </div>
      )}
    </div>
  );
};
