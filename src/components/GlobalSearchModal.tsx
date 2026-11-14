import React, { useMemo, useState } from 'react';
import { BookOpen, FileQuestion, Search, Stethoscope, X } from 'lucide-react';
import { HISTORICAL_ARCHIVES } from '../data/archives';
import { CLINICAL_CASES } from '../data/clinical_cases';
import { MEDICAL_LESSONS } from '../data/curriculum';
import { MEDICAL_ABBREVIATIONS, MEDICAL_TERMINOLOGY } from '../data/medical_tools_data';
import { ALL_SPECIALTIES } from '../data/qcm_index';
import type { FavoriteEntry, QCMQuestion, SpecialtyName } from '../types/med';

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
  allQuestions: QCMQuestion[];
  favorites: FavoriteEntry[];
  onSelectLesson: (lessonId: string) => void;
  onSelectQCM: (q: QCMQuestion) => void;
  onSelectSpecialty: (spec: SpecialtyName) => void;
  onSelectCase: (caseId: string) => void;
  onOpenArchives: () => void;
  onOpenTools: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  open,
  onClose,
  allQuestions,
  favorites,
  onSelectLesson,
  onSelectQCM,
  onSelectSpecialty,
  onSelectCase,
  onOpenArchives,
  onOpenTools,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<
    'all' | 'lessons' | 'qcm' | 'terms' | 'cases' | 'archives' | 'favorites'
  >('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    return {
      lessons: MEDICAL_LESSONS.filter((l) =>
        `${l.title} ${l.specialty} ${l.chapter} ${l.summary}`.toLowerCase().includes(q)
      ).slice(0, 6),
      qcm: allQuestions
        .filter((item) =>
          `${item.id} ${item.specialty} ${item.stem} ${item.explanation}`.toLowerCase().includes(q)
        )
        .slice(0, 8),
      specialties: ALL_SPECIALTIES.filter((s) => s.toLowerCase().includes(q)),
      terms: [
        ...MEDICAL_TERMINOLOGY.filter((t) => `${t.term} ${t.definition}`.toLowerCase().includes(q)).map(
          (t) => ({ label: t.term, detail: t.definition })
        ),
        ...MEDICAL_ABBREVIATIONS.filter((a) => `${a.abbr} ${a.full}`.toLowerCase().includes(q)).map(
          (a) => ({ label: `${a.abbr} — ${a.full}`, detail: a.context })
        ),
      ].slice(0, 6),
      cases: CLINICAL_CASES.filter((c) =>
        `${c.title} ${c.specialty} ${c.correctDiagnosis}`.toLowerCase().includes(q)
      ).slice(0, 5),
      archives: HISTORICAL_ARCHIVES.filter((a) =>
        `${a.year} ${a.university} ${a.specialty} ${a.examType}`.toLowerCase().includes(q)
      ).slice(0, 5),
      favorites: favorites.filter((f) => `${f.title} ${f.subtitle}`.toLowerCase().includes(q)).slice(0, 5),
    };
  }, [query, allQuestions, favorites]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 p-4 pt-12 sm:pt-20">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un cours, QCM, terme médical, spécialité, annale ou cas clinique..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Fermer la recherche"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          {[
            { id: 'all' as const, label: 'Tout' },
            { id: 'lessons' as const, label: 'Cours' },
            { id: 'qcm' as const, label: 'QCM' },
            { id: 'terms' as const, label: 'Termes & Abrév.' },
            { id: 'cases' as const, label: 'Cas cliniques' },
            { id: 'archives' as const, label: 'Annales' },
            { id: 'favorites' as const, label: 'Favoris' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                filterType === f.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-5">
          {!results ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-8">
              Tapez un mot-clé médical (ex : « acidocétose », « tuberculose », « plexus brachial », « Oran 2024 »).
            </p>
          ) : (
            <>
              {(filterType === 'all' || filterType === 'qcm') && results.specialties.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Spécialités</p>
                  <div className="flex flex-wrap gap-2">
                    {results.specialties.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          onSelectSpecialty(s);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      >
                        {s} →
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(filterType === 'all' || filterType === 'lessons') && results.lessons.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cours médicaux</p>
                  {results.lessons.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        onSelectLesson(l.id);
                        onClose();
                      }}
                      className="w-full text-left rounded-lg p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start gap-2.5"
                    >
                      <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{l.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {l.year}e Année · {l.specialty}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {(filterType === 'all' || filterType === 'qcm') && results.qcm.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Banque QCM</p>
                  {results.qcm.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        onSelectQCM(q);
                        onClose();
                      }}
                      className="w-full text-left rounded-lg p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start gap-2.5"
                    >
                      <FileQuestion className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-mono text-blue-700 dark:text-blue-400">
                          {q.id} · {q.specialty}
                        </p>
                        <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-2">{q.stem}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {(filterType === 'all' || filterType === 'cases') && results.cases.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cas cliniques</p>
                  {results.cases.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCase(c.id);
                        onClose();
                      }}
                      className="w-full text-left rounded-lg p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start gap-2.5"
                    >
                      <Stethoscope className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{c.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{c.specialty}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {(filterType === 'all' || filterType === 'terms') && results.terms.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Terminologie & Abréviations
                  </p>
                  {results.terms.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onOpenTools();
                        onClose();
                      }}
                      className="w-full text-left rounded-lg p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{t.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.detail}</p>
                    </button>
                  ))}
                </div>
              )}

              {(filterType === 'all' || filterType === 'archives') && results.archives.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Annales 2002–2025</p>
                  {results.archives.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        onOpenArchives();
                        onClose();
                      }}
                      className="w-full text-left rounded-lg p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {a.year} · {a.university} · {a.examType}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{a.specialty}</p>
                    </button>
                  ))}
                </div>
              )}

              {(filterType === 'all' || filterType === 'favorites') && results.favorites.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Favoris</p>
                  {results.favorites.map((f) => (
                    <div key={f.id} className="rounded-lg p-2.5 bg-slate-50 dark:bg-slate-800/50">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{f.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{f.subtitle}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
