import type {
  AppSettings,
  ArabicNotificationLog,
  FavoriteEntry,
  QCMQuestion,
  SavedAINote,
  StudySessionRecord,
  UserProgressState,
  WrongAnswerEntry,
} from '../types/med';

const DB_NAME = 'med_dz_offline_db';
const DB_VERSION = 1;

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  studentName: 'Étudiant en Médecine',
  university: 'Université d’Alger 1 — Faculté de Médecine',
  currentYear: 7,
  dailyQuestionGoal: 30,
  arabicNotificationsEnabled: true,
  dailyReminderTime: '20:00',
  scheduledSessionTime: '17:30',
  unfinishedExamReminder: true,
  streakReminder: true,
};

export const DEFAULT_PROGRESS: UserProgressState = {
  totalAnswered: 0,
  totalCorrect: 0,
  totalStudySeconds: 0,
  streakDays: 1,
  lastStudyDate: new Date().toISOString().slice(0, 10),
  completedLessonIds: [],
  completedCaseIds: [],
  specialtyStats: {},
  dailyHistory: [],
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB indisponible'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('kv')) {
        db.createObjectStore('kv', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('sessions')) {
        db.createObjectStore('sessions', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('wrongAnswers')) {
        db.createObjectStore('wrongAnswers', { keyPath: 'questionId' });
      }
      if (!db.objectStoreNames.contains('favorites')) {
        db.createObjectStore('favorites', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('aiNotes')) {
        db.createObjectStore('aiNotes', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('customQuestions')) {
        db.createObjectStore('customQuestions', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('notifications')) {
        db.createObjectStore('notifications', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getKV<T>(key: string, fallback: T): Promise<T> {
  try {
    const db = await openDatabase();
    return await new Promise<T>((resolve) => {
      const tx = db.transaction('kv', 'readonly');
      const store = tx.objectStore('kv');
      const req = store.get(key);
      req.onsuccess = () => {
        resolve(req.result ? (req.result.value as T) : fallback);
      };
      req.onerror = () => resolve(fallback);
    });
  } catch {
    try {
      const raw = localStorage.getItem(`med_dz_${key}`);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }
}

async function setKV<T>(key: string, value: T): Promise<void> {
  try {
    localStorage.setItem(`med_dz_${key}`, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('kv', 'readwrite');
      tx.objectStore('kv').put({ key, value });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // fallback already saved to localStorage
  }
}

async function getAllStore<T>(storeName: string): Promise<T[]> {
  try {
    const db = await openDatabase();
    return await new Promise<T[]>((resolve) => {
      const tx = db.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve((req.result as T[]) || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

async function putStoreItem<T>(storeName: string, item: T): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}

async function deleteStoreItem(storeName: string, key: string): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}

async function clearStore(storeName: string): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}

export const medDzDb = {
  getSettings: () => getKV<AppSettings>('settings', DEFAULT_SETTINGS),
  saveSettings: (settings: AppSettings) => setKV('settings', settings),

  getProgress: () => getKV<UserProgressState>('progress', DEFAULT_PROGRESS),
  saveProgress: (progress: UserProgressState) => setKV('progress', progress),

  getSessions: async (): Promise<StudySessionRecord[]> => {
    const list = await getAllStore<StudySessionRecord>('sessions');
    return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  saveSession: (session: StudySessionRecord) => putStoreItem('sessions', session),
  deleteSession: (id: string) => deleteStoreItem('sessions', id),

  getWrongAnswers: () => getAllStore<WrongAnswerEntry>('wrongAnswers'),
  saveWrongAnswer: (entry: WrongAnswerEntry) => putStoreItem('wrongAnswers', entry),
  deleteWrongAnswer: (questionId: string) => deleteStoreItem('wrongAnswers', questionId),

  getFavorites: async (): Promise<FavoriteEntry[]> => {
    const list = await getAllStore<FavoriteEntry>('favorites');
    return list.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  },
  saveFavorite: (fav: FavoriteEntry) => putStoreItem('favorites', fav),
  deleteFavorite: (id: string) => deleteStoreItem('favorites', id),

  getAINotes: async (): Promise<SavedAINote[]> => {
    const list = await getAllStore<SavedAINote>('aiNotes');
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  saveAINote: (note: SavedAINote) => putStoreItem('aiNotes', note),
  deleteAINote: (id: string) => deleteStoreItem('aiNotes', id),

  getCustomQuestions: () => getAllStore<QCMQuestion>('customQuestions'),
  saveCustomQuestions: async (questions: QCMQuestion[]) => {
    for (const q of questions) {
      await putStoreItem('customQuestions', q);
    }
  },

  getNotifications: async (): Promise<ArabicNotificationLog[]> => {
    const list = await getAllStore<ArabicNotificationLog>('notifications');
    return list.sort((a, b) => b.triggeredAt.localeCompare(a.triggeredAt));
  },
  saveNotification: (notif: ArabicNotificationLog) => putStoreItem('notifications', notif),

  resetProgressAndUserData: async () => {
    await setKV('progress', DEFAULT_PROGRESS);
    await clearStore('sessions');
    await clearStore('wrongAnswers');
    await clearStore('favorites');
    await clearStore('notifications');
  },
};
