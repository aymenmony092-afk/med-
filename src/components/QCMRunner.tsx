import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import type { QCMQuestion, StudySessionRecord } from '../types/med';

interface QCMRunnerProps {
  session: StudySessionRecord;
  questionsMap: Record<string, QCMQuestion>;
  favoriteIds: Set<string>;
  onToggleFavorite: (q: QCMQuestion) => void;
  onUpdateSession: (updated: StudySessionRecord) => void;
  onRecordAnswer: (q: QCMQuestion, selectedIndex: number, isCorrect: boolean, elapsedSec: number) => void;
  onExit: () => void;
}

function formatTimer(totalSec: number): string {
  const safe = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const QCMRunner: React.FC<QCMRunnerProps> = ({
  session,
  questionsMap,
  favoriteIds,
  onToggleFavorite,
  onUpdateSession,
  onRecordAnswer,
  onExit,
}) => {
  const [localSession, setLocalSession] = useState<StudySessionRecord>(session);
  const [showNavGrid, setShowNavGrid] = useState(false);

  useEffect(() => {
    setLocalSession(session);
  }, [session.id]);

  // Countdown timer when timerSecondsTotal > 0 and session not completed
  useEffect(() => {
    if (localSession.completedAt || localSession.timerSecondsTotal <= 0) return;

    const timer = window.setInterval(() => {
      setLocalSession((prev) => {
        if (prev.completedAt) return prev;
        const nextRemaining = Math.max(0, prev.timerSecondsRemaining - 1);
        if (nextRemaining === 0) {
          // A timed exam must update the same learning statistics as a manual finish.
          // In immediate-feedback mode answers were already recorded when selected.
          if (!prev.immediateFeedback) {
            for (const questionId of prev.questionIds) {
              const question = questionsMap[questionId];
              const selectedIndex = prev.answers[questionId];
              if (question && selectedIndex !== undefined) {
                onRecordAnswer(
                  question,
                  selectedIndex,
                  selectedIndex === question.correctIndex,
                  25
                );
              }
            }
          }
          const score = computeScore(prev);
          const finished: StudySessionRecord = {
            ...prev,
            timerSecondsRemaining: 0,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            scorePercent: score,
          };
          onUpdateSession(finished);
          return finished;
        }
        const updated = {
          ...prev,
          timerSecondsRemaining: nextRemaining,
          updatedAt: new Date().toISOString(),
        };
        if (nextRemaining % 5 === 0) {
          onUpdateSession(updated);
        }
        return updated;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [localSession.completedAt, localSession.timerSecondsTotal]);

  const questions = useMemo(
    () => localSession.questionIds.map((id) => questionsMap[id]).filter(Boolean),
    [localSession.questionIds, questionsMap]
  );

  function computeScore(s: StudySessionRecord): number {
    const qs = s.questionIds.map((id) => questionsMap[id]).filter(Boolean);
    if (qs.length === 0) return 0;
    let correct = 0;
    for (const q of qs) {
      if (s.answers[q.id] === q.correctIndex) correct += 1;
    }
    return Math.round((correct / qs.length) * 100);
  }

  const currentQuestion = questions[localSession.currentIndex];
  const answeredCount = Object.keys(localSession.answers).length;
  const correctCount = questions.filter((q) => localSession.answers[q.id] === q.correctIndex).length;

  const handleSelectChoice = (choiceIdx: number) => {
    if (!currentQuestion || localSession.completedAt) return;
    // In immediate feedback mode, lock once answered
    if (localSession.immediateFeedback && localSession.answers[currentQuestion.id] !== undefined) {
      return;
    }

    const alreadyAnswered = localSession.answers[currentQuestion.id] !== undefined;
    const nextAnswers = { ...localSession.answers, [currentQuestion.id]: choiceIdx };
    const updated: StudySessionRecord = {
      ...localSession,
      answers: nextAnswers,
      updatedAt: new Date().toISOString(),
    };
    setLocalSession(updated);
    onUpdateSession(updated);

    // In exam mode, answers are scored once at final submission (or timeout).
    // Recording here as well would double-count every answered question.
    if (!alreadyAnswered && localSession.immediateFeedback) {
      onRecordAnswer(currentQuestion, choiceIdx, choiceIdx === currentQuestion.correctIndex, 25);
    }
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    const exists = localSession.flaggedIds.includes(currentQuestion.id);
    const nextFlags = exists
      ? localSession.flaggedIds.filter((id) => id !== currentQuestion.id)
      : [...localSession.flaggedIds, currentQuestion.id];
    const updated = { ...localSession, flaggedIds: nextFlags, updatedAt: new Date().toISOString() };
    setLocalSession(updated);
    onUpdateSession(updated);
  };

  const handleGoTo = (index: number) => {
    const clamped = Math.max(0, Math.min(questions.length - 1, index));
    const updated = { ...localSession, currentIndex: clamped, updatedAt: new Date().toISOString() };
    setLocalSession(updated);
    onUpdateSession(updated);
    setShowNavGrid(false);
  };

  const handleFinishExam = () => {
    // Record any answers that were in exam mode (not yet scored)
    if (!localSession.immediateFeedback) {
      for (const q of questions) {
        const sel = localSession.answers[q.id];
        if (sel !== undefined) {
          // ensure wrong answers / stats recorded on completion if not already recorded
          onRecordAnswer(q, sel, sel === q.correctIndex, 25);
        }
      }
    }
    const score = computeScore(localSession);
    const finished: StudySessionRecord = {
      ...localSession,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scorePercent: score,
    };
    setLocalSession(finished);
    onUpdateSession(finished);
  };

  const handleRestartWrongOnly = () => {
    const wrongIds = questions
      .filter((q) => localSession.answers[q.id] !== q.correctIndex)
      .map((q) => q.id);
    if (wrongIds.length === 0) return;
    const restarted: StudySessionRecord = {
      ...localSession,
      id: `SESS-${Date.now()}`,
      title: `Rattrapage — ${localSession.title}`,
      mode: 'rattrapage',
      questionIds: wrongIds,
      answers: {},
      flaggedIds: [],
      currentIndex: 0,
      immediateFeedback: true,
      timerSecondsTotal: 0,
      timerSecondsRemaining: 0,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: undefined,
      scorePercent: undefined,
    };
    setLocalSession(restarted);
    onUpdateSession(restarted);
  };

  if (!currentQuestion) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
        <p className="text-slate-600 dark:text-slate-300">Aucune question disponible pour cette session.</p>
        <button
          onClick={onExit}
          className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          Retour
        </button>
      </div>
    );
  }

  const selectedAnswer = localSession.answers[currentQuestion.id];
  const isRevealed =
    Boolean(localSession.completedAt) ||
    (localSession.immediateFeedback && selectedAnswer !== undefined);
  const isFlagged = localSession.flaggedIds.includes(currentQuestion.id);
  const isFavorited = favoriteIds.has(currentQuestion.id);

  return (
    <div className="space-y-6">
      {/* Top session control bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => {
              onUpdateSession(localSession);
              onExit();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            Sauvegarder & Quitter
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {localSession.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              Question {localSession.currentIndex + 1} / {questions.length} · Répondues : {answeredCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {localSession.timerSecondsTotal > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono tabular-nums text-slate-800 dark:text-slate-200">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {formatTimer(localSession.timerSecondsRemaining)}
            </div>
          )}
          <button
            onClick={() => setShowNavGrid((v) => !v)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            Grille ({questions.length})
          </button>
          {!localSession.completedAt && (
            <button
              onClick={handleFinishExam}
              className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 whitespace-nowrap shrink-0"
            >
              Terminer & Corriger
            </button>
          )}
        </div>
      </div>

      {/* Completion Summary Banner */}
      {localSession.completedAt && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
                Session terminée et enregistrée hors-ligne
              </p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                Score : {localSession.scorePercent ?? computeScore(localSession)} % ({correctCount}/{questions.length})
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Vous pouvez parcourir chaque question ci-dessous pour consulter les explications scientifiques détaillées.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {correctCount < questions.length && (
                <button
                  onClick={handleRestartWrongOnly}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" />
                  Refaire mes erreurs ({questions.length - correctCount})
                </button>
              )}
              <button
                onClick={onExit}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
              >
                Fermer la session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation grid */}
      {showNavGrid && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
            Navigation rapide · Bleu = actuelle · Vert = correcte · Rouge = erreur · Drapeau = à revoir
          </p>
          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2">
            {questions.map((q, idx) => {
              const ans = localSession.answers[q.id];
              const flagged = localSession.flaggedIds.includes(q.id);
              const showCorrectness = Boolean(localSession.completedAt) || (localSession.immediateFeedback && ans !== undefined);
              let cls = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
              if (idx === localSession.currentIndex) {
                cls = 'border-blue-600 bg-blue-600 text-white';
              } else if (showCorrectness && ans !== undefined) {
                cls =
                  ans === q.correctIndex
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300';
              } else if (ans !== undefined) {
                cls = 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300';
              }
              return (
                <button
                  key={q.id}
                  onClick={() => handleGoTo(idx)}
                  className={`relative h-9 rounded-lg border text-xs font-mono tabular-nums font-semibold transition-colors ${cls}`}
                >
                  {idx + 1}
                  {flagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Question Card */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 space-y-6">
        {/* Clean unboxed metadata row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono font-semibold text-blue-700 dark:text-blue-400">{currentQuestion.id}</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{currentQuestion.specialty}</span>
            <span aria-hidden="true">·</span>
            <span>Difficulté : {currentQuestion.difficulty}</span>
            <span aria-hidden="true">·</span>
            <span>{currentQuestion.sourceLabel}</span>
            {currentQuestion.sourceType === 'ARCHIVE_VERIFIEE' && currentQuestion.sourcePage && currentQuestion.sourceQuestionNumber && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-teal-700 dark:text-teal-300">
                  Annale vérifiée · p. {currentQuestion.sourcePage} · Q. {currentQuestion.sourceQuestionNumber}
                  {currentQuestion.sourceDocumentTitle ? ` · ${currentQuestion.sourceDocumentTitle}` : ''}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFlag}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isFlagged
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              {isFlagged ? 'Marquée à revoir' : 'À revoir'}
            </button>
            <button
              onClick={() => onToggleFavorite(currentQuestion)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isFavorited
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {isFavorited ? 'En favoris' : 'Favori'}
            </button>
          </div>
        </div>

        {/* Question stem */}
        <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
          {currentQuestion.stem}
        </h3>

        {/* 5 choices A-E */}
        <div className="space-y-3">
          {currentQuestion.choices.map((choice, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === currentQuestion.correctIndex;

            let cardStyle =
              'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-600 text-slate-800 dark:text-slate-200';
            if (isRevealed) {
              if (isCorrect) {
                cardStyle =
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100';
              } else if (isSelected && !isCorrect) {
                cardStyle =
                  'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100';
              } else {
                cardStyle =
                  'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400';
              }
            } else if (isSelected) {
              cardStyle =
                'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-950 dark:text-blue-100';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectChoice(idx)}
                className={`w-full text-left rounded-xl border p-4 transition-colors flex items-start justify-between gap-3 ${cardStyle}`}
              >
                <span className="text-sm md:text-[15px] leading-relaxed">{choice}</span>
                {isRevealed && isCorrect && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    Correcte
                  </span>
                )}
                {isRevealed && isSelected && !isCorrect && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 dark:text-rose-300 shrink-0">
                    <XCircle className="w-4 h-4" />
                    Votre choix
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scientific Explanation */}
        {isRevealed && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Correction scientifique détaillée
              </span>
              <span className="text-xs font-mono text-teal-700 dark:text-teal-300">
                Réponse juste : {String.fromCharCode(65 + currentQuestion.correctIndex)}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Statut du corrigé : {
                currentQuestion.correctionStatus === 'OFFICIELLE' ? 'Officiel' :
                currentQuestion.correctionStatus === 'VERIFIEE' ? 'Vérifié' :
                currentQuestion.correctionStatus === 'PROPOSEE' ? 'Proposé — à confirmer' :
                'Non vérifié — ne pas considérer comme corrigé officiel'
              }
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {currentQuestion.explanation}
            </p>
            {currentQuestion.incorrectExplanations && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Analyse des propositions erronées :
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentQuestion.incorrectExplanations}
                </p>
              </div>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Référence : {currentQuestion.reference}
            </p>
          </div>
        )}

        {/* Bottom Prev / Next bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => handleGoTo(localSession.currentIndex - 1)}
            disabled={localSession.currentIndex === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédente
          </button>

          {localSession.currentIndex < questions.length - 1 ? (
            <button
              onClick={() => handleGoTo(localSession.currentIndex + 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              Suivante
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : !localSession.completedAt ? (
            <button
              onClick={handleFinishExam}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700"
            >
              Valider la session
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
