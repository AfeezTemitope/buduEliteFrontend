const DB_NAME = "BEFACache";
const DB_VERSION = 2;

interface CacheItem<T> {
    data: T;
    timestamp: number;
}

class CacheManager {
    private db: IDBDatabase | null = null;
    private isSupported: boolean = true;

    constructor() {
        // Check if IndexedDB is supported
        if (typeof window === 'undefined' || !window.indexedDB) {
            console.warn('IndexedDB not supported, caching disabled');
            this.isSupported = false;
        }
    }

    async init(): Promise<void> {
        if (!this.isSupported) return;

        return new Promise((resolve, reject) => {
            try {
                const request = indexedDB.open(DB_NAME, DB_VERSION);

                request.onerror = () => {
                    console.error('IndexedDB initialization error:', request.error);
                    this.isSupported = false;
                    resolve(); // Don't reject, just disable caching
                };

                request.onsuccess = () => {
                    this.db = request.result;
                    resolve();
                };

                request.onupgradeneeded = (event) => {
                    const db = (event.target as IDBOpenDBRequest).result;

                    try {
                        // Use consistent key approach for all stores
                        if (!db.objectStoreNames.contains("posts")) {
                            db.createObjectStore("posts");
                        }
                        if (!db.objectStoreNames.contains("players")) {
                            db.createObjectStore("players");
                        }
                        if (!db.objectStoreNames.contains("schedule")) {
                            db.createObjectStore("schedule");
                        }
                        if (!db.objectStoreNames.contains("products")) {
                            db.createObjectStore("products");
                        }
                    } catch (error) {
                        console.error('Error creating object stores:', error);
                    }
                };
            } catch (error) {
                console.error('IndexedDB not available:', error);
                this.isSupported = false;
                resolve();
            }
        });
    }

    async get<T>(storeName: string, key: string): Promise<T | null> {
        if (!this.isSupported) return null;

        try {
            if (!this.db) await this.init();
            if (!this.db) return null;

            return new Promise((resolve) => {
                try {
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

                    request.onerror = () => {
                        console.error('Cache get error:', request.error);
                        resolve(null);
                    };
                } catch (error) {
                    console.error('Cache get error:', error);
                    resolve(null);
                }
            });
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    async set<T>(storeName: string, key: string, data: T): Promise<void> {
        if (!this.isSupported) return;

        try {
            if (!this.db) await this.init();
            if (!this.db) return;

            return new Promise((resolve) => {
                try {
                    const transaction = this.db!.transaction([storeName], "readwrite");
                    const store = transaction.objectStore(storeName);
                    const item: CacheItem<T> = { data, timestamp: Date.now() };

                    // For out-of-line keys, provide key as second parameter
                    const request = store.put(item, key);

                    request.onsuccess = () => resolve();
                    request.onerror = () => {
                        console.error('Cache set error:', request.error);
                        resolve();
                    };
                } catch (error) {
                    console.error('Cache set error:', error);
                    resolve();
                }
            });
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    async getAll<T>(storeName: string): Promise<T[]> {
        if (!this.isSupported) return [];

        try {
            if (!this.db) await this.init();
            if (!this.db) return [];

            return new Promise((resolve) => {
                try {
                    const transaction = this.db!.transaction([storeName], "readonly");
                    const store = transaction.objectStore(storeName);
                    const request = store.getAll();

                    request.onsuccess = () => {
                        const items = request.result as CacheItem<T>[];
                        const validItems = items
                            .filter(item => item && Date.now() - item.timestamp < 5 * 60 * 1000)
                            .map(item => item.data);
                        resolve(validItems);
                    };

                    request.onerror = () => {
                        console.error('Cache getAll error:', request.error);
                        resolve([]);
                    };
                } catch (error) {
                    console.error('Cache getAll error:', error);
                    resolve([]);
                }
            });
        } catch (error) {
            console.error('Cache getAll error:', error);
            return [];
        }
    }

    async clear(storeName: string): Promise<void> {
        if (!this.isSupported) return;

        try {
            if (!this.db) await this.init();
            if (!this.db) return;

            return new Promise((resolve) => {
                try {
                    const transaction = this.db!.transaction([storeName], "readwrite");
                    const store = transaction.objectStore(storeName);
                    const request = store.clear();

                    request.onsuccess = () => resolve();
                    request.onerror = () => {
                        console.error('Cache clear error:', request.error);
                        resolve();
                    };
                } catch (error) {
                    console.error('Cache clear error:', error);
                    resolve();
                }
            });
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    }
}

export const cache = new CacheManager();