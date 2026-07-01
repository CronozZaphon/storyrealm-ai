// ============================================================
// INDEXEDDB CLIENT — Browser-side persistent storage
// No backend needed. Stories survive refresh, browser restarts
// ============================================================

const DB_NAME = 'StoryRealmDB';
const DB_VERSION = 1;

interface StoryRecord {
  id: number;
  title: string;
  description: string;
  genre: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ChapterRecord {
  id: number;
  storyId: number;
  title: string;
  content: string;
  orderNum: number;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

interface SettingsRecord {
  id: number;
  openaiKey?: string;
  claudeKey?: string;
  preferredAi: string;
  companion: string;
  theme: string;
  wordCountGoal: number;
  writingStreak: number;
  lastWritingDate: string;
}

let db: IDBDatabase | null = null;
let initPromise: Promise<IDBDatabase> | null = null;

function initDB(): Promise<IDBDatabase> {
  if (db) return Promise.resolve(db);
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains('stories')) {
        const storiesStore = database.createObjectStore('stories', { keyPath: 'id', autoIncrement: true });
        storiesStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        storiesStore.createIndex('status', 'status', { unique: false });
      }

      if (!database.objectStoreNames.contains('chapters')) {
        const chaptersStore = database.createObjectStore('chapters', { keyPath: 'id', autoIncrement: true });
        chaptersStore.createIndex('storyId', 'storyId', { unique: false });
        chaptersStore.createIndex('orderNum', 'orderNum', { unique: false });
      }

      if (!database.objectStoreNames.contains('characters')) {
        database.createObjectStore('characters', { keyPath: 'id', autoIncrement: true });
      }

      if (!database.objectStoreNames.contains('settings')) {
        database.createObjectStore('settings', { keyPath: 'id', autoIncrement: true });
      }

      if (!database.objectStoreNames.contains('sessions')) {
        database.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });

  return initPromise;
}

function getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
  return initDB().then((database) => {
    const tx = database.transaction(storeName, mode);
    return tx.objectStore(storeName);
  });
}

// Stories CRUD
export const storyDB = {
  async list(): Promise<StoryRecord[]> {
    const store = await getStore('stories');
    return new Promise((resolve, reject) => {
      const request = store.index('updatedAt').openCursor(null, 'prev');
      const results: StoryRecord[] = [];
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) { results.push(cursor.value); cursor.continue(); }
        else resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  },

  async get(id: number): Promise<{ story: StoryRecord | null; chapters: ChapterRecord[] }> {
    const story = await new Promise<StoryRecord | null>(async (resolve, reject) => {
      const store = await getStore('stories');
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
    const chapters = await this.getChapters(id);
    return { story, chapters };
  },

  async create(data: Omit<StoryRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<StoryRecord> {
    const store = await getStore('stories', 'readwrite');
    const record = { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    return new Promise((resolve, reject) => {
      const req = store.add(record);
      req.onsuccess = () => resolve({ ...record, id: req.result as number });
      req.onerror = () => reject(req.error);
    });
  },

  async update(id: number, data: Partial<StoryRecord>): Promise<void> {
    const store = await getStore('stories', 'readwrite');
    return new Promise((resolve, reject) => {
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const existing = getReq.result;
        if (!existing) { resolve(); return; }
        const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
        const putReq = store.put(updated);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      };
    });
  },

  async delete(id: number): Promise<void> {
    const store = await getStore('stories', 'readwrite');
    await new Promise<void>((resolve, reject) => {
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    // Also delete chapters
    const chapters = await this.getChapters(id);
    for (const ch of chapters) {
      await this.deleteChapter(ch.id);
    }
  },

  // Chapters
  async getChapters(storyId: number): Promise<ChapterRecord[]> {
    const store = await getStore('chapters');
    return new Promise((resolve, reject) => {
      const request = store.index('storyId').openCursor(storyId);
      const results: ChapterRecord[] = [];
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) { results.push(cursor.value); cursor.continue(); }
        else resolve(results.sort((a, b) => a.orderNum - b.orderNum));
      };
      request.onerror = () => reject(request.error);
    });
  },

  async saveChapter(data: Omit<ChapterRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: number; createdAt?: string }): Promise<ChapterRecord> {
    const store = await getStore('chapters', 'readwrite');
    const record: any = { ...data, updatedAt: new Date().toISOString() };
    if (!record.createdAt) record.createdAt = new Date().toISOString();

    return new Promise((resolve, reject) => {
      const req = record.id ? store.put(record) : store.add(record);
      req.onsuccess = () => {
        const id = record.id || (req.result as number);
        resolve({ ...record, id } as ChapterRecord);
      };
      req.onerror = () => reject(req.error);
    });
  },

  async deleteChapter(id: number): Promise<void> {
    const store = await getStore('chapters', 'readwrite');
    return new Promise((resolve, reject) => {
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  // Auto-save session
  async saveSession(storyId: number, content: string): Promise<void> {
    const store = await getStore('sessions', 'readwrite');
    return new Promise((resolve, reject) => {
      const req = store.put({ storyId, content, savedAt: new Date().toISOString(), id: `session_${storyId}` });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async getSession(storyId: number): Promise<string | null> {
    const store = await getStore('sessions');
    return new Promise((resolve, reject) => {
      const req = store.get(`session_${storyId}`);
      req.onsuccess = () => resolve(req.result?.content || null);
      req.onerror = () => reject(req.error);
    });
  },

  // Settings
  async getSettings(): Promise<Partial<SettingsRecord>> {
    const store = await getStore('settings');
    return new Promise((resolve, reject) => {
      const req = store.get(1);
      req.onsuccess = () => resolve(req.result || {});
      req.onerror = () => reject(req.error);
    });
  },

  async saveSettings(data: Partial<SettingsRecord>): Promise<void> {
    const store = await getStore('settings', 'readwrite');
    return new Promise((resolve, reject) => {
      const getReq = store.get(1);
      getReq.onsuccess = () => {
        const existing = getReq.result || { id: 1 };
        const updated = { ...existing, ...data };
        const putReq = store.put(updated);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      };
    });
  },

  // Export/Import
  async exportAll(): Promise<string> {
    const stories = await this.list();
    const chapters: ChapterRecord[] = [];
    for (const s of stories) {
      const chs = await this.getChapters(s.id);
      chapters.push(...chs);
    }
    return JSON.stringify({ stories, chapters, exportedAt: new Date().toISOString(), version: '1.0' }, null, 2);
  },

  async importAll(json: string): Promise<{ stories: number; chapters: number }> {
    const data = JSON.parse(json);
    let storyCount = 0;
    let chapterCount = 0;

    for (const s of data.stories || []) {
      const { id, ...storyData } = s;
      await this.create(storyData);
      storyCount++;
    }
    for (const c of data.chapters || []) {
      const { id, ...chData } = c;
      await this.saveChapter(chData);
      chapterCount++;
    }
    return { stories: storyCount, chapters: chapterCount };
  },

  // Stats
  async getStats(): Promise<{ totalStories: number; totalWords: number; totalChapters: number; writingStreak: number }> {
    const stories = await this.list();
    let totalWords = 0;
    let totalChapters = 0;
    for (const s of stories) {
      const chs = await this.getChapters(s.id);
      totalChapters += chs.length;
      for (const c of chs) {
        totalWords += (c.content || '').split(/\s+/).filter(Boolean).length;
      }
    }
    const settings = await this.getSettings();
    return {
      totalStories: stories.length,
      totalWords,
      totalChapters,
      writingStreak: settings.writingStreak || 0,
    };
  },
};
