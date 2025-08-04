import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { videoStorage, StoredVideo } from './video-storage';

// IndexedDBのモック
const mockIndexedDB = {
  databases: new Map(),
  open: vi.fn(),
};

// IDBRequestのモック
class MockIDBRequest {
  result: any;
  error: any;
  onsuccess: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(result?: any, error?: any) {
    this.result = result;
    this.error = error;
    // 非同期でコールバックを実行
    setTimeout(() => {
      if (error && this.onerror) {
        this.onerror();
      } else if (this.onsuccess) {
        this.onsuccess();
      }
    }, 0);
  }
}

// IDBObjectStoreのモック
class MockIDBObjectStore {
  name: string;
  data: Map<string, any>;

  constructor(name: string) {
    this.name = name;
    this.data = new Map();
  }

  add(value: any) {
    const key = value.id;
    if (this.data.has(key)) {
      return new MockIDBRequest(undefined, new Error('Key already exists'));
    }
    this.data.set(key, value);
    return new MockIDBRequest(key);
  }

  get(key: string) {
    const value = this.data.get(key);
    return new MockIDBRequest(value);
  }

  getAll() {
    const values = Array.from(this.data.values());
    return new MockIDBRequest(values);
  }

  delete(key: string) {
    this.data.delete(key);
    return new MockIDBRequest();
  }

  clear() {
    this.data.clear();
    return new MockIDBRequest();
  }

  createIndex() {
    // モックでは何もしない
  }
}

// IDBTransactionのモック
class MockIDBTransaction {
  db: MockIDBDatabase;
  stores: Map<string, MockIDBObjectStore>;

  constructor(db: MockIDBDatabase, storeNames: string[]) {
    this.db = db;
    this.stores = new Map();
    storeNames.forEach(name => {
      if (db.objectStores.has(name)) {
        this.stores.set(name, db.objectStores.get(name)!);
      }
    });
  }

  objectStore(name: string) {
    return this.stores.get(name);
  }
}

// IDBDatabaseのモック
class MockIDBDatabase {
  name: string;
  version: number;
  objectStoreNames: DOMStringList;
  objectStores: Map<string, MockIDBObjectStore>;

  constructor(name: string, version: number) {
    this.name = name;
    this.version = version;
    this.objectStores = new Map();
    this.objectStoreNames = {
      length: 0,
      contains: (name: string) => this.objectStores.has(name),
      item: (index: number) => Array.from(this.objectStores.keys())[index],
      [Symbol.iterator]: function* () {
        yield* Array.from(this.objectStores.keys());
      }
    } as DOMStringList;
  }

  createObjectStore(name: string, options?: any) {
    const store = new MockIDBObjectStore(name);
    this.objectStores.set(name, store);
    (this.objectStoreNames as any).length = this.objectStores.size;
    return store;
  }

  transaction(storeNames: string[], mode?: string) {
    return new MockIDBTransaction(this, Array.isArray(storeNames) ? storeNames : [storeNames]);
  }
}

// IDBOpenDBRequestのモック
class MockIDBOpenDBRequest extends MockIDBRequest {
  onupgradeneeded: ((event: any) => void) | null = null;

  constructor(name: string, version: number) {
    const db = new MockIDBDatabase(name, version);
    super(db);

    // 新規作成の場合、upgradeが必要
    setTimeout(() => {
      if (this.onupgradeneeded) {
        this.onupgradeneeded({ target: this });
      }
      if (this.onsuccess) {
        this.onsuccess();
      }
    }, 0);
  }
}

describe('VideoStorage', () => {
  beforeEach(() => {
    // IndexedDBのモックを設定
    mockIndexedDB.open.mockImplementation((name: string, version: number) => {
      return new MockIDBOpenDBRequest(name, version);
    });
    (global as any).indexedDB = mockIndexedDB;

    // URL.createObjectURLとURL.revokeObjectURLのモック
    global.URL.createObjectURL = vi.fn((blob: Blob) => `blob:mock-url-${Date.now()}`);
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('init', () => {
    it('データベースを初期化できる', async () => {
      await videoStorage.init();
      expect(mockIndexedDB.open).toHaveBeenCalledWith('GolfitterVideoDB', 1);
    });

    it('オブジェクトストアを作成できる', async () => {
      await videoStorage.init();
      // onupgradeneededが呼ばれてストアが作成されることを確認
      await new Promise(resolve => setTimeout(resolve, 10));
    });
  });

  describe('saveVideo', () => {
    it('動画を保存できる', async () => {
      const mockFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' });
      const videoId = await videoStorage.saveVideo(mockFile);

      expect(videoId).toMatch(/^video_\d+_[a-z0-9]+$/);
    });

    it('保存された動画の情報が正しい', async () => {
      const mockFile = new File(['video content'], 'golf-swing.mp4', { type: 'video/mp4' });
      Object.defineProperty(mockFile, 'size', { value: 1024 * 1024 }); // 1MB

      const videoId = await videoStorage.saveVideo(mockFile);
      
      // getVideoメソッドで確認
      const savedVideo = await videoStorage.getVideo(videoId);
      expect(savedVideo).toBeDefined();
      expect(savedVideo?.name).toBe('golf-swing.mp4');
      expect(savedVideo?.type).toBe('video/mp4');
      expect(savedVideo?.size).toBe(1024 * 1024);
      expect(savedVideo?.uploadedAt).toBeInstanceOf(Date);
    });
  });

  describe('getVideo', () => {
    it('存在する動画を取得できる', async () => {
      const mockFile = new File(['content'], 'test.mp4', { type: 'video/mp4' });
      const videoId = await videoStorage.saveVideo(mockFile);

      const video = await videoStorage.getVideo(videoId);
      expect(video).toBeDefined();
      expect(video?.id).toBe(videoId);
    });

    it('存在しない動画の場合nullを返す', async () => {
      const video = await videoStorage.getVideo('non-existent-id');
      expect(video).toBeNull();
    });
  });

  describe('getAllVideos', () => {
    it('すべての動画を取得できる', async () => {
      const file1 = new File(['content1'], 'video1.mp4', { type: 'video/mp4' });
      const file2 = new File(['content2'], 'video2.mp4', { type: 'video/mp4' });

      await videoStorage.saveVideo(file1);
      await videoStorage.saveVideo(file2);

      const videos = await videoStorage.getAllVideos();
      expect(videos).toHaveLength(2);
      expect(videos[0].name).toBe('video1.mp4');
      expect(videos[1].name).toBe('video2.mp4');
    });

    it('動画がない場合は空配列を返す', async () => {
      const videos = await videoStorage.getAllVideos();
      expect(videos).toEqual([]);
    });
  });

  describe('deleteVideo', () => {
    it('動画を削除できる', async () => {
      const mockFile = new File(['content'], 'test.mp4', { type: 'video/mp4' });
      const videoId = await videoStorage.saveVideo(mockFile);

      await videoStorage.deleteVideo(videoId);

      const video = await videoStorage.getVideo(videoId);
      expect(video).toBeNull();
    });

    it('存在しない動画を削除してもエラーにならない', async () => {
      await expect(videoStorage.deleteVideo('non-existent-id')).resolves.not.toThrow();
    });
  });

  describe('clearAll', () => {
    it('すべての動画を削除できる', async () => {
      const file1 = new File(['content1'], 'video1.mp4', { type: 'video/mp4' });
      const file2 = new File(['content2'], 'video2.mp4', { type: 'video/mp4' });

      await videoStorage.saveVideo(file1);
      await videoStorage.saveVideo(file2);

      await videoStorage.clearAll();

      const videos = await videoStorage.getAllVideos();
      expect(videos).toHaveLength(0);
    });
  });

  describe('getVideoUrl', () => {
    it('動画のURLを生成できる', () => {
      const mockVideo: StoredVideo = {
        id: 'test-id',
        name: 'test.mp4',
        type: 'video/mp4',
        size: 1024,
        data: new Blob(['video content']),
        uploadedAt: new Date(),
      };

      const url = videoStorage.getVideoUrl(mockVideo);
      expect(url).toMatch(/^blob:mock-url-\d+$/);
      expect(URL.createObjectURL).toHaveBeenCalledWith(mockVideo.data);
    });
  });

  describe('revokeVideoUrl', () => {
    it('動画のURLを破棄できる', () => {
      const mockUrl = 'blob:mock-url-12345';
      videoStorage.revokeVideoUrl(mockUrl);
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
    });
  });

  describe('エラーハンドリング', () => {
    it('データベースのオープンに失敗した場合エラーをスローする', async () => {
      mockIndexedDB.open.mockImplementationOnce(() => {
        return new MockIDBRequest(undefined, new Error('Failed to open database'));
      });

      await expect(videoStorage.init()).rejects.toThrow();
    });

    it('動画の保存に失敗した場合エラーをスローする', async () => {
      // 保存が失敗するようにモックを調整
      const mockFile = new File(['content'], 'test.mp4', { type: 'video/mp4' });
      
      // initメソッドをモックして、失敗するtransactionを返すようにする
      const mockDb = {
        transaction: vi.fn(() => ({
          objectStore: vi.fn(() => ({
            add: vi.fn(() => new MockIDBRequest(undefined, new Error('Failed to save')))
          }))
        }))
      };
      
      (videoStorage as any).db = mockDb;

      await expect(videoStorage.saveVideo(mockFile)).rejects.toThrow();
    });
  });
});