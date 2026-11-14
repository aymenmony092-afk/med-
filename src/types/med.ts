export type SectionId =
  | 'accueil'
  | 'annees'
  | 'annee-1'
  | 'annee-2'
  | 'annee-3'
  | 'annee-4'
  | 'annee-5'
  | 'annee-6'
  | 'annee-7'
  | 'cours'
  | 'resumes'
  | 'assistant-ia'
  | 'qcm'
  | 'emd'
  | 'residanat'
  | 'annales'
  | 'cas-cliniques'
  | 'outils'
  | 'favoris'
  | 'erreurs'
  | 'statistiques'
  | 'parametres';

export type SpecialtyName =
  | 'Anatomie'
  | 'Physiologie'
  | 'Biochimie'
  | 'Histologie'
  | 'Embryologie'
  | 'Pharmacologie'
  | 'Microbiologie'
  | 'Immunologie'
  | 'Pathologie'
  | 'Cardiologie'
  | 'Pneumologie'
  | 'Neurologie'
  | 'Gastro-entérologie'
  | 'Néphrologie'
  | 'Endocrinologie'
  | 'Hématologie'
  | 'Infectiologie'
  | 'Pédiatrie'
  | 'Gynécologie-obstétrique'
  | 'Chirurgie'
  | 'Médecine interne'
  | 'Urgences et Réanimation';

export type DifficultyLevel = 'Facile' | 'Moyen' | 'Difficile';

export type QuestionSourceType =
  | 'ARCHIVE_VERIFIEE'
  | 'REFERENCE_PEDAGOGIQUE'
  | 'IA_PEDAGOGIQUE';

export interface QCMQuestion {
  id: string;
  specialty: SpecialtyName;
  yearLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'Résidanat';
  stem: string;
  choices: [string, string, string, string, string];
  correctIndex: number;
  explanation: string;
  incorrectExplanations: string;
  difficulty: DifficultyLevel;
  sourceType: QuestionSourceType;
  sourceLabel: string;
  examYear?: number;
  university?: string;
  reference: string;
  /** Exact provenance for imported historical exam questions. */
  sourceDocumentTitle?: string;
  sourcePage?: number;
  sourceQuestionNumber?: string;
  correctionStatus?: 'OFFICIELLE' | 'VERIFIEE' | 'PROPOSEE' | 'NON_VERIFIEE';
  correctionReference?: string;
}

export interface MedicalLesson {
  id: string;
  year: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  subject: string;
  specialty: SpecialtyName;
  chapter: string;
  title: string;
  durationMin: number;
  objectives: string[];
  definitions: Array<{ term: string; definition: string }>;
  contentSections: Array<{ heading: string; body: string }>;
  summary: string;
  highYieldPoints: string[];
  diagramType: 'cardiac' | 'nephron' | 'respiratory' | 'neuro' | 'endocrine' | 'metabolic' | 'anatomy' | 'none';
  reference: string;
}

export interface AcademicYearCurriculum {
  year: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  sectionId: SectionId;
  title: string;
  cycle: 'Cycle Préclinique' | 'Cycle Clinique' | 'Internat & Résidanat';
  description: string;
  modules: Array<{
    name: string;
    specialty: SpecialtyName;
    coefficient: number;
    semesters: string;
    keyTopics: string[];
  }>;
}

export interface HistoricalExamRecord {
  id: string;
  year: number;
  university:
    | 'Alger'
    | 'Oran'
    | 'Constantine'
    | 'Annaba'
    | 'Blida'
    | 'Tizi Ouzou'
    | 'Sétif'
    | 'Batna'
    | 'Tlemcen'
    | 'Sidi Bel Abbès';
  specialty: string;
  examType: 'Résidanat' | 'EMD';
  yearLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  questionCount: number;
  availability: 'DISPONIBLE_SERIE_VERIFIEE' | 'INDISPONIBLE_LOCALEMENT';
  linkedQuestionIds: string[];
  sourceNote: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  specialty: SpecialtyName;
  yearLevel: 4 | 5 | 6 | 7;
  difficulty: DifficultyLevel;
  patientPresentation: string;
  medicalHistory: string[];
  symptoms: string[];
  clinicalExam: {
    vitals: string;
    findings: string[];
  };
  labResults: Array<{ parameter: string; value: string; normalRange: string; status: 'normal' | 'bas' | 'eleve' }>;
  diagnosticQuestions: Array<{
    question: string;
    choices: string[];
    correctIndex: number;
    rationale: string;
  }>;
  differentialDiagnosis: string[];
  correctDiagnosis: string;
  explanation: string;
  managementPrinciples: string[];
  reference: string;
}

export interface StudySessionRecord {
  id: string;
  title: string;
  mode: 'residanat_complet' | 'residanat_specialite' | 'banque_qcm' | 'emd' | 'rattrapage' | 'aleatoire';
  specialty?: SpecialtyName | 'Toutes';
  yearLevel?: number;
  questionIds: string[];
  answers: Record<string, number>;
  flaggedIds: string[];
  currentIndex: number;
  immediateFeedback: boolean;
  timerSecondsTotal: number;
  timerSecondsRemaining: number;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  scorePercent?: number;
}

export interface WrongAnswerEntry {
  questionId: string;
  wrongCount: number;
  lastMissedAt: string;
  lastSelectedIndex: number;
  mastered: boolean;
}

export interface FavoriteEntry {
  id: string;
  type: 'qcm' | 'lesson' | 'case' | 'ai_note';
  title: string;
  subtitle: string;
  savedAt: string;
}

export interface SavedAINote {
  id: string;
  lessonId?: string;
  mode: 'summarize' | 'explain' | 'flashcards' | 'revision_sheet' | 'exam_points';
  title: string;
  specialty: string;
  summary: string;
  clinicalTakeaway?: string;
  keyPoints: string[];
  examTraps: string[];
  flashcards: Array<{ front: string; back: string }>;
  referenceNote: string;
  createdAt: string;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  answered: number;
  correct: number;
  studySeconds: number;
}

export interface ArabicNotificationLog {
  id: string;
  category: 'daily' | 'unfinished' | 'goal' | 'streak' | 'scheduled';
  arabicTitle: string;
  arabicBody: string;
  triggeredAt: string;
  read: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  studentName: string;
  university: string;
  currentYear: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  dailyQuestionGoal: number;
  arabicNotificationsEnabled: boolean;
  dailyReminderTime: string; // HH:mm
  scheduledSessionTime: string; // HH:mm
  unfinishedExamReminder: boolean;
  streakReminder: boolean;
}

export interface UserProgressState {
  totalAnswered: number;
  totalCorrect: number;
  totalStudySeconds: number;
  streakDays: number;
  lastStudyDate: string;
  completedLessonIds: string[];
  completedCaseIds: string[];
  specialtyStats: Record<string, { answered: number; correct: number }>;
  dailyHistory: DailyActivity[];
}
