// IndexedDB caching utilities for offline support
const DB_NAME = "BEFACache";
const DB_VERSION = 1;

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class CacheManager {
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
        
        if (!db.objectStoreNames.contains("posts")) {
          db.createObjectStore("posts", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("players")) {
          db.createObjectStore("players");
        }
        if (!db.objectStoreNames.contains("schedule")) {
          db.createObjectStore("schedule");
        }
        if (!db.objectStoreNames.contains("products")) {
          db.createObjectStore("products", { keyPath: "id" });
        }
      };
    });
  }

  async get<T>(storeName: string, key: string): Promise<T | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const item = request.result as CacheItem<T> | undefined;
        if (item) {
          // Cache valid for 5 minutes
          const isValid = Date.now() - item.timestamp < 5 * 60 * 1000;
          resolve(isValid ? item.data : null);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async set<T>(storeName: string, key: string, data: T): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const item: CacheItem<T> = { data, timestamp: Date.now() };
      const request = store.put({ ...item, id: key });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result as CacheItem<T>[];
        const validItems = items
          .filter(item => Date.now() - item.timestamp < 5 * 60 * 1000)
          .map(item => item.data);
        resolve(validItems);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const cache = new CacheManager();