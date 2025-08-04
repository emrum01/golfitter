// IndexedDBを使用した動画のローカルストレージ管理

const DB_NAME = 'GolfitterVideoDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

export interface StoredVideo {
  id: string;
  name: string;
  type: string;
  size: number;
  data: Blob;
  uploadedAt: Date;
  metadata?: {
    duration?: number;
    width?: number;
    height?: number;
  };
}

class VideoStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('uploadedAt', 'uploadedAt', { unique: false });
        }
      };
    });
  }

  async saveVideo(file: File): Promise<string> {
    if (!this.db) await this.init();

    const id = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const video: StoredVideo = {
      id,
      name: file.name,
      type: file.type,
      size: file.size,
      data: file,
      uploadedAt: new Date(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(video);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  async getVideo(id: string): Promise<StoredVideo | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllVideos(): Promise<StoredVideo[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteVideo(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAll(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  getVideoUrl(video: StoredVideo): string {
    return URL.createObjectURL(video.data);
  }

  revokeVideoUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}

export const videoStorage = new VideoStorage();