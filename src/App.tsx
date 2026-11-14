import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  Award,
  BarChart3,
  BookOpen,
  Bookmark,
  ClipboardCheck,
  Download,
  FileQuestion,
  GraduationCap,
  Home,
  Layers,
  Menu,
  Moon,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  MessageCircle,
  Stethoscope,
  Sun,
  WifiOff,
  Wrench,
  X,
} from 'lucide-react';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { HomeView } from './components/HomeView';
import { CurriculumAndLessonsView } from './components/CurriculumAndLessonsView';
import { MedicalBrandLogo } from './components/MedicalBrandLogo';
import { PersonalViews } from './components/PersonalViews';
import { QCMRunner } from './components/QCMRunner';
import { ResidanatEmdAnnalesViews } from './components/ResidanatEmdAnnalesViews';
import { ClinicalCasesView, MedicalToolsView } from './components/ClinicalCasesAndToolsViews';
import { SmartSummariesView } from './components/SmartSummariesView';
import { AIStudyAssistantView } from './components/AIStudyAssistantView';
import { ResidencyUniversityArchivesView } from './components/ResidencyUniversityArchivesView';
import { CLINICAL_CASES } from './data/clinical_cases';
import { MEDICAL_LESSONS } from './data/curriculum';
import { CURATED_QCMS } from './data/qcm_index';
import { DEFAULT_PROGRESS, DEFAULT_SETTINGS, medDzDb } from './db/medDzDb';
import { useOnlineStatus, usePWAInstall } from './hooks/usePWA';
import type {
  AppSettings,
  ArabicNotificationLog,
  ClinicalCase,
  FavoriteEntry,
  MedicalLesson,
  QCMQuestion,
  SavedAINote,
  SectionId,
  SpecialtyName,
  StudySessionRecord,
  UserProgressState,
  WrongAnswerEntry,
} from './types/med';

interface NavItem {
  id: SectionId;
  label: string;
  group: 'Principal' | 'Années d’études (1–7)' | 'Outils & Suivi';
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  // Principal
  { id: 'accueil', label: 'Accueil', group: 'Principal', icon: Home },
  { id: 'residanat', label: 'Résidanat', group: 'Principal', icon: Award },
  { id: 'qcm', label: 'Banque QCM', group: 'Principal', icon: FileQuestion },
  { id: 'emd', label: 'EMD', group: 'Principal', icon: ClipboardCheck },
  { id: 'annales', label: 'Annales et examens précédents', group: 'Principal', icon: Archive },
  { id: 'cours', label: 'Cours médicaux', group: 'Principal', icon: BookOpen },
  { id: 'resumes', label: 'Résumés intelligents', group: 'Principal', icon: Sparkles },
  { id: 'assistant-ia', label: 'Assistant IA médical', group: 'Principal', icon: MessageCircle },
  { id: 'cas-cliniques', label: 'Cas cliniques', group: 'Principal', icon: Stethoscope },

  // Années 1-7
  { id: 'annees', label: 'Années d’études', group: 'Années d’études (1–7)', icon: Layers },
  { id: 'annee-1', label: 'Première année', group: 'Années d’études (1–7)', icon: GraduationCap },
  { id: 'annee-2', label: 'Deuxième année', group: 'Années d’études (1–7)', icon: GraduationCap },
  { id: 'annee-3', label: 'Troisième année', group: 'Années d’études (1–7)', icon: GraduationCap },
  { id: 'annee-4', label: 'Quatrième année', group: 'Années d’études (1–7)', icon: GraduationCap },
  { id: 'annee-5', label: 'Cinquième année', group: 'Années d’études (1–7)', icon: GraduationCap },
  { id: 'annee-6', label: 'Sixième année', group: 'Années d’études (1–7)', icon: GraduationCap },
  { id: 'annee-7', label: 'Septième année', group: 'Années d’études (1–7)', icon: GraduationCap },

  // Outils & Suivi
  { id: 'outils', label: 'Outils médicaux', group: 'Outils & Suivi', icon: Wrench },
  { id: 'favoris', label: 'Favoris', group: 'Outils & Suivi', icon: Bookmark },
  { id: 'erreurs', label: 'Mes erreurs', group: 'Outils & Suivi', icon: RotateCcw },
  { id: 'statistiques', label: 'Statistiques et progression', group: 'Outils & Suivi', icon: BarChart3 },
  { id: 'parametres', label: 'Paramètres', group: 'Outils & Suivi', icon: Settings },
];

const ARABIC_MESSAGES: Record<
  ArabicNotificationLog['category'],
  { title: string; body: string }
> = {
  daily: {
    title: 'تذكير المراجعة اليومية — MED DZ',
    body: 'حان وقت جلسة المراجعة اليومية للتحضير لامتحان الإقامة الطبية والامتحانات الفصلية.',
  },
  unfinished: {
    title: 'امتحان غير مكتمل',
    body: 'لديك جلسة أسئلة غير مكتملة محفوظة. يمكنك استئناف الإجابة من حيث توقفت الآن.',
  },
  goal: {
    title: 'هدف الدراسة اليومي',
    body: 'تقدم نحو هدفك اليومي في حل أسئلة الاختيار من متعدد لتعزيز ثبات المعلومات الطبية.',
  },
  streak: {
    title: 'سلسلة المراجعة المتواصلة',
    body: 'أحسنت! واصل المراجعة اليوم للحفاظ على سلسلة أيامك المتتالية في MED DZ.',
  },
  scheduled: {
    title: 'موعد جلسة التدريب المبرمجة',
    body: 'بدأ موعد جلسة التدريب المجدولة. اختر تخصصك وابدأ الاختبار الآن.',
  },
};

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('accueil');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Persisted State
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [progress, setProgress] = useState<UserProgressState>(DEFAULT_PROGRESS);
  const [sessions, setSessions] = useState<StudySessionRecord[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswerEntry[]>([]);
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [aiNotes, setAiNotes] = useState<SavedAINote[]>([]);
  const [customQuestions, setCustomQuestions] = useState<QCMQuestion[]>([]);
  const [notifications, setNotifications] = useState<ArabicNotificationLog[]>([]);
  const [activeArabicBanner, setActiveArabicBanner] = useState<ArabicNotificationLog | null>(null);

  // Active sub-views
  const [activeSession, setActiveSession] = useState<StudySessionRecord | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [aiPrefill, setAiPrefill] = useState<{ topic: string; specialty: string; content: string }>({
    topic: '',
    specialty: 'Cardiologie',
    content: '',
  });

  const isOnline = useOnlineStatus();
  const pwaInstall = usePWAInstall();

  // Load IndexedDB on startup
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [s, p, sess, wrongs, favs, notes, custQ, notifs] = await Promise.all([
          medDzDb.getSettings(),
          medDzDb.getProgress(),
          medDzDb.getSessions(),
          medDzDb.getWrongAnswers(),
          medDzDb.getFavorites(),
          medDzDb.getAINotes(),
          medDzDb.getCustomQuestions(),
          medDzDb.getNotifications(),
        ]);
        if (!mounted) return;
        setSettings(s);
        setProgress(p);
        setSessions(sess);
        setWrongAnswers(wrongs);
        setFavorites(favs);
        setAiNotes(notes);
        setCustomQuestions(custQ);
        setNotifications(notifs);
      } catch (err) {
        console.error('MED DZ local storage hydration fallback:', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Sync Tailwind dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  // All questions deduplicated by ID
  const allQuestions = useMemo(() => {
    const map = new Map<string, QCMQuestion>();
    for (const q of CURATED_QCMS) map.set(q.id, q);
    for (const q of customQuestions) if (!map.has(q.id)) map.set(q.id, q);
    return Array.from(map.values());
  }, [customQuestions]);

  const questionsMap = useMemo(() => {
    const map: Record<string, QCMQuestion> = {};
    for (const q of allQuestions) map[q.id] = q;
    return map;
  }, [allQuestions]);

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const activeWrongCount = useMemo(
    () => wrongAnswers.filter((w) => !w.mastered && questionsMap[w.questionId]).length,
    [wrongAnswers, questionsMap]
  );

  // Trigger Arabic Notification
  const triggerArabicNotification = async (category: ArabicNotificationLog['category']) => {
    const msg = ARABIC_MESSAGES[category];
    const item: ArabicNotificationLog = {
      id: `NOTIF-${Date.now()}`,
      category,
      arabicTitle: msg.title,
      arabicBody: msg.body,
      triggeredAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [item, ...prev]);
    setActiveArabicBanner(item);
    await medDzDb.saveNotification(item);

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
        } catch {
          // ignore
        }
      }
      if (Notification.permission === 'granted') {
        try {
          new Notification(msg.title, { body: msg.body, icon: '/pwa-192x192.png', lang: 'ar', dir: 'rtl' });
        } catch {
          // ignore
        }
      }
    }
  };

  // Scheduled Arabic reminder checker (checks once per minute)
  useEffect(() => {
    if (!settings.arabicNotificationsEnabled) return;
    const interval = window.setInterval(() => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const todayKey = now.toISOString().slice(0, 10);

      if (hhmm === settings.dailyReminderTime) {
        const alreadySent = notifications.some(
          (n) => n.category === 'daily' && n.triggeredAt.startsWith(todayKey)
        );
        if (!alreadySent) triggerArabicNotification('daily');
      } else if (hhmm === settings.scheduledSessionTime) {
        const alreadySent = notifications.some(
          (n) => n.category === 'scheduled' && n.triggeredAt.startsWith(todayKey)
        );
        if (!alreadySent) triggerArabicNotification('scheduled');
      }
    }, 30000);
    return () => window.clearInterval(interval);
  }, [settings, notifications]);

  const handleUpdateSettings = (next: AppSettings) => {
    setSettings(next);
    medDzDb.saveSettings(next);
  };

  const handleNavigate = (section: SectionId) => {
    setActiveSection(section);
    setActiveSession(null);
    if (section !== 'cours') setActiveLessonId(null);
    if (section !== 'cas-cliniques') setActiveCaseId(null);
    setMobileMenuOpen(false);
  };

  const handleStartSession = async (config: {
    title: string;
    mode: StudySessionRecord['mode'];
    questionIds: string[];
    specialty?: SpecialtyName | 'Toutes';
    yearLevel?: number;
    immediateFeedback: boolean;
    timerMinutes: number;
  }) => {
    const newSession: StudySessionRecord = {
      id: `SESS-${Date.now()}`,
      title: config.title,
      mode: config.mode,
      specialty: config.specialty,
      yearLevel: config.yearLevel,
      questionIds: config.questionIds,
      answers: {},
      flaggedIds: [],
      currentIndex: 0,
      immediateFeedback: config.immediateFeedback,
      timerSecondsTotal: config.timerMinutes * 60,
      timerSecondsRemaining: config.timerMinutes * 60,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSession(newSession);
    await medDzDb.saveSession(newSession);
  };

  const handleUpdateSession = async (updated: StudySessionRecord) => {
    setActiveSession(updated);
    setSessions((prev) => {
      const exists = prev.some((s) => s.id === updated.id);
      return exists ? prev.map((s) => (s.id === updated.id ? updated : s)) : [updated, ...prev];
    });
    await medDzDb.saveSession(updated);
  };

  const handleRecordAnswer = async (
    q: QCMQuestion,
    selectedIndex: number,
    isCorrect: boolean,
    elapsedSec: number
  ) => {
    const today = new Date().toISOString().slice(0, 10);

    setProgress((prev) => {
      const prevSpec = prev.specialtyStats[q.specialty] || { answered: 0, correct: 0 };
      const nextSpec = {
        answered: prevSpec.answered + 1,
        correct: prevSpec.correct + (isCorrect ? 1 : 0),
      };

      const existingDay = prev.dailyHistory.find((d) => d.date === today);
      const nextDaily = existingDay
        ? prev.dailyHistory.map((d) =>
            d.date === today
              ? {
                  ...d,
                  answered: d.answered + 1,
                  correct: d.correct + (isCorrect ? 1 : 0),
                  studySeconds: d.studySeconds + elapsedSec,
                }
              : d
          )
        : [
            ...prev.dailyHistory,
            { date: today, answered: 1, correct: isCorrect ? 1 : 0, studySeconds: elapsedSec },
          ];

      let nextStreak = prev.streakDays;
      if (prev.lastStudyDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        nextStreak = prev.lastStudyDate === yesterday ? prev.streakDays + 1 : 1;
      }

      const next: UserProgressState = {
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
        totalStudySeconds: prev.totalStudySeconds + elapsedSec,
        streakDays: nextStreak,
        lastStudyDate: today,
        specialtyStats: {
          ...prev.specialtyStats,
          [q.specialty]: nextSpec,
        },
        dailyHistory: nextDaily,
      };
      medDzDb.saveProgress(next);
      return next;
    });

    if (!isCorrect) {
      setWrongAnswers((prev) => {
        const existing = prev.find((w) => w.questionId === q.id);
        const entry: WrongAnswerEntry = existing
          ? {
              ...existing,
              wrongCount: existing.wrongCount + 1,
              lastMissedAt: new Date().toISOString(),
              lastSelectedIndex: selectedIndex,
              mastered: false,
            }
          : {
              questionId: q.id,
              wrongCount: 1,
              lastMissedAt: new Date().toISOString(),
              lastSelectedIndex: selectedIndex,
              mastered: false,
            };
        medDzDb.saveWrongAnswer(entry);
        return existing ? prev.map((w) => (w.questionId === q.id ? entry : w)) : [entry, ...prev];
      });
    }
  };

  const toggleFavorite = async (entry: FavoriteEntry) => {
    const exists = favorites.some((f) => f.id === entry.id);
    if (exists) {
      setFavorites((prev) => prev.filter((f) => f.id !== entry.id));
      await medDzDb.deleteFavorite(entry.id);
    } else {
      setFavorites((prev) => [entry, ...prev]);
      await medDzDb.saveFavorite(entry);
    }
  };

  const handleToggleFavoriteQCM = (q: QCMQuestion) =>
    toggleFavorite({
      id: q.id,
      type: 'qcm',
      title: q.stem,
      subtitle: `QCM · ${q.specialty} · ${q.id}`,
      savedAt: new Date().toISOString(),
    });

  const handleToggleFavoriteLesson = (l: MedicalLesson) =>
    toggleFavorite({
      id: l.id,
      type: 'lesson',
      title: l.title,
      subtitle: `Cours ${l.year}e Année · ${l.specialty}`,
      savedAt: new Date().toISOString(),
    });

  const handleToggleFavoriteCase = (cc: ClinicalCase) =>
    toggleFavorite({
      id: cc.id,
      type: 'case',
      title: cc.title,
      subtitle: `Cas clinique · ${cc.specialty}`,
      savedAt: new Date().toISOString(),
    });

  const handleToggleFavoriteNote = (note: SavedAINote) =>
    toggleFavorite({
      id: note.id,
      type: 'ai_note',
      title: note.title,
      subtitle: `Fiche IA · ${note.specialty}`,
      savedAt: new Date().toISOString(),
    });

  const handleToggleLessonCompleted = (lessonId: string) => {
    setProgress((prev) => {
      const exists = prev.completedLessonIds.includes(lessonId);
      const next = {
        ...prev,
        completedLessonIds: exists
          ? prev.completedLessonIds.filter((id) => id !== lessonId)
          : [...prev.completedLessonIds, lessonId],
      };
      medDzDb.saveProgress(next);
      return next;
    });
  };

  const handleMarkCaseCompleted = (caseId: string) => {
    setProgress((prev) => {
      if (prev.completedCaseIds.includes(caseId)) return prev;
      const next = {
        ...prev,
        completedCaseIds: [...prev.completedCaseIds, caseId],
      };
      medDzDb.saveProgress(next);
      return next;
    });
  };

  const handleExportBackup = () => {
    const payload = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      app: 'MED DZ',
      settings,
      progress,
      sessions,
      wrongAnswers,
      favorites,
      aiNotes,
      customQuestions,
      notifications,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `med-dz-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = async (file: File) => {
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Format de fichier invalide');
      }
      const backup = parsed as {
        app?: string;
        settings?: AppSettings;
        progress?: UserProgressState;
        sessions?: StudySessionRecord[];
        wrongAnswers?: WrongAnswerEntry[];
        favorites?: FavoriteEntry[];
        aiNotes?: SavedAINote[];
        customQuestions?: QCMQuestion[];
        notifications?: ArabicNotificationLog[];
      };

      if (
        backup.app !== 'MED DZ' ||
        !backup.settings ||
        !backup.progress ||
        !Array.isArray(backup.sessions) ||
        !Array.isArray(backup.wrongAnswers) ||
        !Array.isArray(backup.favorites)
      ) {
        throw new Error('Cette sauvegarde MED DZ est incomplète ou incompatible');
      }
      if (
        !['light', 'dark'].includes(backup.settings.theme) ||
        !Array.isArray(backup.progress.dailyHistory) ||
        !Array.isArray(backup.progress.completedLessonIds) ||
        !Array.isArray(backup.progress.completedCaseIds)
      ) {
        throw new Error('Les données de profil ou de progression sont invalides');
      }

      const restored = {
        settings: backup.settings,
        progress: backup.progress,
        sessions: backup.sessions,
        wrongAnswers: backup.wrongAnswers,
        favorites: backup.favorites,
        aiNotes: Array.isArray(backup.aiNotes) ? backup.aiNotes : [],
        customQuestions: Array.isArray(backup.customQuestions) ? backup.customQuestions : [],
        notifications: Array.isArray(backup.notifications) ? backup.notifications : [],
      };

      await medDzDb.replaceAllData(restored);
      setSettings(restored.settings);
      setProgress(restored.progress);
      setSessions(restored.sessions);
      setWrongAnswers(restored.wrongAnswers);
      setFavorites(restored.favorites);
      setAiNotes(restored.aiNotes);
      setCustomQuestions(restored.customQuestions);
      setNotifications(restored.notifications);
      setActiveSession(null);
      setActiveArabicBanner(null);
      window.alert('Sauvegarde MED DZ restaurée avec succès.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      window.alert(`Impossible de restaurer la sauvegarde : ${message}`);
    }
  };

  const handleResetProgress = async () => {
    await medDzDb.resetProgressAndUserData();
    setProgress(DEFAULT_PROGRESS);
    setSessions([]);
    setWrongAnswers([]);
    setFavorites([]);
    setNotifications([]);
  };

  const currentNavLabel = NAV_ITEMS.find((i) => i.id === activeSection)?.label || 'MED DZ';

  const yearNumberFromSection = (sec: SectionId): 1 | 2 | 3 | 4 | 5 | 6 | 7 | undefined => {
    if (sec === 'annee-1') return 1;
    if (sec === 'annee-2') return 2;
    if (sec === 'annee-3') return 3;
    if (sec === 'annee-4') return 4;
    if (sec === 'annee-5') return 5;
    if (sec === 'annee-6') return 6;
    if (sec === 'annee-7') return 7;
    return undefined;
  };

  const renderSidebarContent = () => {
    const groups: NavItem['group'][] = ['Principal', 'Années d’études (1–7)', 'Outils & Suivi'];
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <MedicalBrandLogo size={36} />
          <div className="min-w-0">
            <p className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 font-display">
              MED DZ
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Médecine & Résidanat Algérie
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Navigation principale">
          {groups.map((grp) => (
            <div key={grp} className="space-y-1">
              <p className="px-2.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                {grp}
              </p>
              {NAV_ITEMS.filter((i) => i.group === grp).map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id && !activeSession;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      active
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.id === 'erreurs' && activeWrongCount > 0 && (
                      <span className="font-mono text-[11px] text-rose-600 dark:text-rose-400 shrink-0">
                        {activeWrongCount}
                      </span>
                    )}
                    {item.id === 'favoris' && favorites.length > 0 && (
                      <span className="font-mono text-[11px] text-slate-400 shrink-0">
                        {favorites.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {pwaInstall.isInstallable && !pwaInstall.isInstalled && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={pwaInstall.install}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-teal-600 text-white text-xs font-medium hover:bg-teal-700"
            >
              <Download className="w-3.5 h-3.5" />
              Installer l’application
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[268px] shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 h-screen">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl z-10">
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fermer le menu"
              className="absolute top-3.5 right-3 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Clean Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Ouvrir le menu de navigation"
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
              {activeSession ? activeSession.title : currentNavLabel}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 hover:border-blue-400 whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Rechercher cours, QCM, termes...</span>
              <span className="sm:hidden">Rechercher</span>
            </button>

            <button
              onClick={() =>
                handleUpdateSettings({
                  ...settings,
                  theme: settings.theme === 'light' ? 'dark' : 'light',
                })
              }
              aria-label="Basculer mode clair ou sombre"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Arabic Notification Banner when triggered */}
        {activeArabicBanner && (
          <div
            dir="rtl"
            className="font-arabic mx-4 sm:mx-6 mt-4 rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/50 px-4 py-3 flex items-center justify-between gap-4"
          >
            <div className="text-right">
              <p className="text-xs font-bold text-teal-800 dark:text-teal-300">
                {activeArabicBanner.arabicTitle}
              </p>
              <p className="text-xs text-slate-800 dark:text-slate-200 mt-0.5">
                {activeArabicBanner.arabicBody}
              </p>
            </div>
            <button
              onClick={() => setActiveArabicBanner(null)}
              aria-label="إغلاق الإشعار"
              className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Offline Connectivity Indicator */}
        {!isOnline && (
          <div className="mx-4 sm:mx-6 mt-4 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>
              Mode hors-ligne actif : vos cours, QCM, cas cliniques, outils médicaux et statistiques restent pleinement accessibles depuis votre base locale.
            </span>
          </div>
        )}

        {/* Active Viewport */}
        <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto">
          {activeSession ? (
            <QCMRunner
              session={activeSession}
              questionsMap={questionsMap}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavoriteQCM}
              onUpdateSession={handleUpdateSession}
              onRecordAnswer={handleRecordAnswer}
              onExit={() => setActiveSession(null)}
            />
          ) : activeSection === 'accueil' ? (
            <HomeView
              settings={settings}
              progress={progress}
              allQuestions={allQuestions}
              wrongCount={activeWrongCount}
              sessions={sessions}
              latestArabicNotification={notifications[0] || null}
              onNavigate={handleNavigate}
              onResumeSession={(s) => setActiveSession(s)}
              onQuickStartResidanat={() => {
                const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
                handleStartSession({
                  title: 'Série Rapide Résidanat (20 QCM)',
                  mode: 'residanat_complet',
                  questionIds: shuffled.slice(0, Math.min(20, shuffled.length)).map((q) => q.id),
                  specialty: 'Toutes',
                  immediateFeedback: true,
                  timerMinutes: 0,
                });
              }}
              onOpenLesson={(lessonId) => {
                setActiveLessonId(lessonId);
                setActiveSection('cours');
              }}
            />
          ) : activeSection === 'annees' ||
            yearNumberFromSection(activeSection) !== undefined ||
            activeSection === 'cours' ? (
            <CurriculumAndLessonsView
              mode={
                activeSection === 'annees'
                  ? 'overview'
                  : activeSection === 'cours'
                  ? 'lessons'
                  : 'year'
              }
              selectedYear={yearNumberFromSection(activeSection)}
              activeLessonId={activeLessonId}
              onSelectLesson={(id) => {
                setActiveLessonId(id);
                if (id && activeSection !== 'cours') {
                  setActiveSection('cours');
                }
              }}
              onNavigate={handleNavigate}
              completedLessonIds={progress.completedLessonIds}
              onToggleLessonCompleted={handleToggleLessonCompleted}
              favoriteIds={favoriteIds}
              onToggleFavoriteLesson={handleToggleFavoriteLesson}
              onStartYearQCM={(yr, title, spec) => {
                const pool = allQuestions.filter((q) => {
                  if (spec && q.specialty !== spec) return false;
                  if (!spec && yr !== 7 && q.yearLevel !== yr) return false;
                  return true;
                });
                const fallbackPool = pool.length > 0 ? pool : allQuestions.slice(0, 15);
                handleStartSession({
                  title,
                  mode: 'banque_qcm',
                  yearLevel: yr,
                  specialty: spec,
                  questionIds: fallbackPool.map((q) => q.id),
                  immediateFeedback: true,
                  timerMinutes: 0,
                });
              }}
              onStartYearEMD={(yr) => {
                const pool = allQuestions.filter((q) => (yr === 7 ? true : q.yearLevel === yr));
                handleStartSession({
                  title: `EMD Blanc — ${yr}e Année`,
                  mode: 'emd',
                  yearLevel: yr,
                  questionIds: pool.map((q) => q.id),
                  immediateFeedback: false,
                  timerMinutes: Math.max(15, pool.length * 2),
                });
              }}
              onSendLessonToAI={(lesson) => {
                setAiPrefill({
                  topic: lesson.title,
                  specialty: lesson.specialty,
                  content: `${lesson.summary}\n${lesson.contentSections.map((s) => `${s.heading}: ${s.body}`).join('\n')}`,
                });
                setActiveLessonId(null);
                setActiveSection('resumes');
              }}
              onOpenClinicalCase={(caseId) => {
                setActiveCaseId(caseId);
                setActiveSection('cas-cliniques');
              }}
              allQuestions={allQuestions}
              savedAINotes={aiNotes}
              onSaveAINote={async (note) => {
                setAiNotes((prev) => [note, ...prev]);
                await medDzDb.saveAINote(note);
              }}
              onToggleFavoriteNote={handleToggleFavoriteNote}
            />
          ) : activeSection === 'assistant-ia' ? (
            <AIStudyAssistantView />
          ) : activeSection === 'resumes' ? (
            <SmartSummariesView
              initialTopic={aiPrefill.topic}
              initialSpecialty={aiPrefill.specialty}
              initialContent={aiPrefill.content}
              savedNotes={aiNotes}
              onSaveNote={async (note) => {
                setAiNotes((prev) => [note, ...prev]);
                await medDzDb.saveAINote(note);
              }}
              onDeleteNote={async (id) => {
                setAiNotes((prev) => prev.filter((n) => n.id !== id));
                await medDzDb.deleteAINote(id);
              }}
              favoriteIds={favoriteIds}
              onToggleFavoriteNote={handleToggleFavoriteNote}
            />
          ) : activeSection === 'annales' ? (
            <ResidencyUniversityArchivesView
              allQuestions={allQuestions}
              onStartSession={handleStartSession}
            />
          ) : activeSection === 'residanat' ||
            activeSection === 'qcm' ||
            activeSection === 'emd' ? (
            <ResidanatEmdAnnalesViews
              mode={activeSection}
              allQuestions={allQuestions}
              wrongCount={activeWrongCount}
              specialtyStats={progress.specialtyStats}
              onStartSession={handleStartSession}
              onAddAIQuestions={async (qs) => {
                setCustomQuestions((prev) => [...qs, ...prev]);
                await medDzDb.saveCustomQuestions(qs);
              }}
            />
          ) : activeSection === 'cas-cliniques' ? (
            <ClinicalCasesView
              activeCaseId={activeCaseId}
              onSelectCase={setActiveCaseId}
              completedCaseIds={progress.completedCaseIds}
              onMarkCaseCompleted={handleMarkCaseCompleted}
              favoriteIds={favoriteIds}
              onToggleFavoriteCase={handleToggleFavoriteCase}
            />
          ) : activeSection === 'outils' ? (
            <MedicalToolsView />
          ) : (
            <PersonalViews
              mode={activeSection as 'favoris' | 'erreurs' | 'statistiques' | 'parametres'}
              favorites={favorites}
              onRemoveFavorite={async (id) => {
                setFavorites((prev) => prev.filter((f) => f.id !== id));
                await medDzDb.deleteFavorite(id);
              }}
              onOpenFavorite={(fav) => {
                if (fav.type === 'qcm' && questionsMap[fav.id]) {
                  handleStartSession({
                    title: `Favori — ${questionsMap[fav.id].specialty}`,
                    mode: 'banque_qcm',
                    questionIds: [fav.id],
                    immediateFeedback: true,
                    timerMinutes: 0,
                  });
                } else if (fav.type === 'lesson') {
                  setActiveLessonId(fav.id);
                  setActiveSection('cours');
                } else if (fav.type === 'case') {
                  setActiveCaseId(fav.id);
                  setActiveSection('cas-cliniques');
                } else if (fav.type === 'ai_note') {
                  setActiveSection('resumes');
                }
              }}
              wrongAnswers={wrongAnswers}
              questionsMap={questionsMap}
              onMarkWrongMastered={async (qId) => {
                setWrongAnswers((prev) =>
                  prev.map((w) => (w.questionId === qId ? { ...w, mastered: true } : w))
                );
                const target = wrongAnswers.find((w) => w.questionId === qId);
                if (target) await medDzDb.saveWrongAnswer({ ...target, mastered: true });
              }}
              onStartWrongSession={(ids) =>
                handleStartSession({
                  title: `Session de rattrapage (${ids.length} erreurs)`,
                  mode: 'rattrapage',
                  questionIds: ids,
                  immediateFeedback: true,
                  timerMinutes: 0,
                })
              }
              progress={progress}
              sessions={sessions}
              onResumeSession={(s) => setActiveSession(s)}
              onDeleteSession={async (id) => {
                setSessions((prev) => prev.filter((s) => s.id !== id));
                await medDzDb.deleteSession(id);
              }}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              notifications={notifications}
              onTriggerArabicTestNotification={triggerArabicNotification}
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
              onResetProgress={handleResetProgress}
              pwaInstall={pwaInstall}
              onNavigate={handleNavigate}
            />
          )}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        allQuestions={allQuestions}
        favorites={favorites}
        onSelectLesson={(lessonId) => {
          setActiveLessonId(lessonId);
          setActiveSection('cours');
        }}
        onSelectQCM={(q) =>
          handleStartSession({
            title: `Recherche — ${q.id}`,
            mode: 'banque_qcm',
            questionIds: [q.id],
            specialty: q.specialty,
            immediateFeedback: true,
            timerMinutes: 0,
          })
        }
        onSelectSpecialty={(spec) => {
          const qs = allQuestions.filter((q) => q.specialty === spec);
          handleStartSession({
            title: `QCM — ${spec}`,
            mode: 'residanat_specialite',
            specialty: spec,
            questionIds: qs.map((q) => q.id),
            immediateFeedback: true,
            timerMinutes: 0,
          });
        }}
        onSelectCase={(caseId) => {
          setActiveCaseId(caseId);
          setActiveSection('cas-cliniques');
        }}
        onOpenArchives={() => handleNavigate('annales')}
        onOpenTools={() => handleNavigate('outils')}
      />
    </div>
  );
}
