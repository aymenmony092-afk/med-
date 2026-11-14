import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Bookmark,
  Layers,
  Loader2,
  RotateCw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { ALL_SPECIALTIES } from '../data/qcm_index';
import type { SavedAINote } from '../types/med';

interface SmartSummariesViewProps {
  initialTopic?: string;
  initialSpecialty?: string;
  initialContent?: string;
  savedNotes: SavedAINote[];
  onSaveNote: (note: SavedAINote) => void;
  onDeleteNote: (id: string) => void;
  favoriteIds: Set<string>;
  onToggleFavoriteNote: (note: SavedAINote) => void;
}

type StudyMode = 'summarize' | 'explain' | 'flashcards' | 'revision_sheet' | 'exam_points';

const MODE_LABELS: Array<{ id: StudyMode; label: string }> = [
  { id: 'summarize', label: 'Résumer un cours' },
  { id: 'revision_sheet', label: 'Fiche de révision' },
  { id: 'explain', label: 'Expliquer un concept' },
  { id: 'flashcards', label: 'Créer des flashcards' },
  { id: 'exam_points', label: 'Points clés & pièges' },
];

export const SmartSummariesView: React.FC<SmartSummariesViewProps> = ({
  initialTopic = '',
  initialSpecialty = 'Cardiologie',
  initialContent = '',
  savedNotes,
  onSaveNote,
  onDeleteNote,
  favoriteIds,
  onToggleFavoriteNote,
}) => {
  const [mode, setMode] = useState<StudyMode>('revision_sheet');
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [topic, setTopic] = useState(initialTopic);
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<SavedAINote | null>(savedNotes[0] || null);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
    if (initialSpecialty) setSpecialty(initialSpecialty);
    if (initialContent) setContent(initialContent);
  }, [initialTopic, initialSpecialty, initialContent]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() && !content.trim()) {
      setError('Veuillez saisir un intitulé de cours ou coller un extrait à synthétiser.');
      return;
    }
    setLoading(true);
    setError(null);
    setFlippedCards({});

    try {
      const resp = await fetch('/api/ai/study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, specialty, topic, content }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Erreur lors de la génération.');
      }
      const newNote: SavedAINote = {
        id: `AINOTE-${Date.now()}`,
        mode,
        title: data.title || topic || `Fiche ${specialty}`,
        specialty,
        summary: data.summary || '',
        keyPoints: Array.isArray(data.keyPoints) ? data.keyPoints : [],
        examTraps: Array.isArray(data.examTraps) ? data.examTraps : [],
        flashcards: Array.isArray(data.flashcards) ? data.flashcards : [],
        referenceNote: data.referenceNote || `Référentiel pédagogique · ${specialty}`,
        createdAt: new Date().toISOString(),
      };
      onSaveNote(newNote);
      setActiveNote(newNote);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de contacter le service IA. Vos fiches déjà sauvegardées restent accessibles hors-ligne.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Résumés intelligents & Fiches de révision
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Générez des fiches de révision, explications physiopathologiques, flashcards et pièges d’examen, automatiquement sauvegardés hors-ligne.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-3 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Transparence pédagogique :</strong> les synthèses produites dans cet onglet sont générées par intelligence artificielle à visée d’étude. Elles doivent toujours être confrontées aux cours universitaires et référentiels officiels.
          </span>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            {MODE_LABELS.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  mode === m.id
                    ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                Spécialité médicale
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              >
                {ALL_SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                Intitulé du cours ou concept à clarifier
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex : Physiopathologie de l’œdème aigu du poumon ou Insuffisance surrénalienne..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
              Texte du cours ou notes personnelles (optionnel)
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Collez un passage de cours ou une question difficile pour obtenir une synthèse ciblée..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Génération en cours...' : 'Générer la fiche intelligente'}
            </button>
          </div>
        </form>
      </div>

      {/* Saved AI Notes + Active Viewer */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Fiches sauvegardées hors-ligne ({savedNotes.length})
            </h2>
          </div>
          {savedNotes.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
              Aucune fiche générée pour l’instant. Lancez une première synthèse ci-dessus.
            </p>
          ) : (
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {savedNotes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    setActiveNote(n);
                    setFlippedCards({});
                  }}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                    activeNote?.id === n.id
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-teal-700 dark:text-teal-400">{n.specialty}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(n.id);
                        if (activeNote?.id === n.id) setActiveNote(null);
                      }}
                      aria-label="Supprimer cette fiche"
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                    {n.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          {!activeNote ? (
            <div className="py-12 text-center space-y-2">
              <Layers className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Sélectionnez une fiche sauvegardée ou générez-en une nouvelle.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Contenu généré par IA · {activeNote.specialty}
                  </p>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {activeNote.title}
                  </h2>
                </div>
                <button
                  onClick={() => onToggleFavoriteNote(activeNote)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                    favoriteIds.has(activeNote.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  {favoriteIds.has(activeNote.id) ? 'En favoris' : 'Favori'}
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Synthèse structurée</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeNote.summary}
                </p>
              </div>

              {activeNote.keyPoints.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                    Points essentiels à retenir
                  </h3>
                  <ul className="space-y-1.5">
                    {activeNote.keyPoints.map((kp, i) => (
                      <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 font-mono text-xs mt-0.5">0{i + 1}.</span>
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeNote.examTraps.length > 0 && (
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Pièges fréquents en QCM
                  </h3>
                  <ul className="space-y-1">
                    {activeNote.examTraps.map((trap, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-amber-600 dark:text-amber-400">•</span>
                        <span>{trap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeNote.flashcards.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Flashcards de révision active (cliquez pour retourner)
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {activeNote.flashcards.map((fc, idx) => {
                      const flipped = Boolean(flippedCards[idx]);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFlippedCards((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                          className={`text-left rounded-xl border p-4 min-h-[112px] flex flex-col justify-between transition-colors ${
                            flipped
                              ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-blue-400'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                            <span>{flipped ? 'Réponse' : `Carte ${idx + 1}`}</span>
                            <RotateCw className="w-3 h-3" />
                          </div>
                          <p className="mt-2 text-xs font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                            {flipped ? fc.back : fc.front}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                {activeNote.referenceNote}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
