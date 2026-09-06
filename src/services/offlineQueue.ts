// Offline Local Persistence Engine for EcoSort Ghana
// Uses IndexedDB with transparent LocalStorage fallback for offline upload queueing

import { QueuedOfflineSubmission, OfflineCacheStats } from '../types/offline';
import { requestBackgroundSync } from './serviceWorkerRegistration';

const DB_NAME = 'ecosort_offline_db_v2';
const DB_VERSION = 1;
const STORE_NAME = 'offline_submissions';
const LOCAL_STORAGE_FALLBACK_KEY = 'ecosort_offline_queue_backup_v2';

class OfflineQueueEngine {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private hasIndexedDB: boolean = typeof window !== 'undefined' && 'indexedDB' in window;

  constructor() {
    if (this.hasIndexedDB) {
      this.initIndexedDB();
    }
  }

  private initIndexedDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('status', 'status', { unique: false });
            store.createIndex('queuedTimestamp', 'queuedTimestamp', { unique: false });
            store.createIndex('userId', 'userId', { unique: false });
          }
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          resolve(db);
        };

        request.onerror = (event) => {
          console.warn('[OfflineQueue] IndexedDB open error, using LocalStorage fallback:', event);
          this.hasIndexedDB = false;
          reject((event.target as IDBOpenDBRequest).error);
        };
      } catch (err) {
        console.warn('[OfflineQueue] IndexedDB init exception:', err);
        this.hasIndexedDB = false;
        reject(err);
      }
    });

    return this.dbPromise;
  }

  // --- LocalStorage Fallback Helpers ---
  private getFromLocalStorage(): QueuedOfflineSubmission[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveToLocalStorage(items: QueuedOfflineSubmission[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('[OfflineQueue] LocalStorage quota exceeded or error:', e);
    }
  }

  // --- Public Queue Management API ---

  public async getAllQueued(): Promise<QueuedOfflineSubmission[]> {
    if (this.hasIndexedDB) {
      try {
        const db = await this.initIndexedDB();
        return new Promise((resolve) => {
          const transaction = db.transaction([STORE_NAME], 'readonly');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.getAll();

          request.onsuccess = () => {
            const result: QueuedOfflineSubmission[] = request.result || [];
            result.sort((a, b) => b.queuedTimestamp - a.queuedTimestamp);
            resolve(result);
          };

          request.onerror = () => {
            resolve(this.getFromLocalStorage());
          };
        });
      } catch {
        return this.getFromLocalStorage();
      }
    }
    return this.getFromLocalStorage();
  }

  public async getPendingItems(): Promise<QueuedOfflineSubmission[]> {
    const all = await this.getAllQueued();
    return all.filter(item => item.status === 'QUEUED' || item.status === 'FAILED');
  }

  public async addSubmission(submission: QueuedOfflineSubmission): Promise<QueuedOfflineSubmission> {
    // 1. Save in IndexedDB if available
    if (this.hasIndexedDB) {
      try {
        const db = await this.initIndexedDB();
        await new Promise<void>((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.put(submission);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (err) {
        console.warn('[OfflineQueue] Failed writing to IndexedDB, saving to LocalStorage fallback:', err);
      }
    }

    // 2. Also keep mirror in LocalStorage for high reliability
    const localItems = this.getFromLocalStorage();
    const filtered = localItems.filter(i => i.id !== submission.id);
    this.saveToLocalStorage([submission, ...filtered]);

    // 3. Request Background Sync from Service Worker
    requestBackgroundSync();

    return submission;
  }

  public async updateSubmission(
    id: string, 
    updates: Partial<QueuedOfflineSubmission>
  ): Promise<QueuedOfflineSubmission | null> {
    let existingItem: QueuedOfflineSubmission | null = null;

    if (this.hasIndexedDB) {
      try {
        const db = await this.initIndexedDB();
        existingItem = await new Promise((resolve) => {
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          const getReq = store.get(id);

          getReq.onsuccess = () => {
            if (getReq.result) {
              const updated = { ...getReq.result, ...updates };
              store.put(updated);
              resolve(updated);
            } else {
              resolve(null);
            }
          };
          getReq.onerror = () => resolve(null);
        });
      } catch {
        // fallback
      }
    }

    // Update LocalStorage mirror
    const localItems = this.getFromLocalStorage();
    const targetIdx = localItems.findIndex(i => i.id === id);
    if (targetIdx !== -1) {
      const updated = { ...localItems[targetIdx], ...updates };
      localItems[targetIdx] = updated;
      this.saveToLocalStorage(localItems);
      if (!existingItem) existingItem = updated;
    }

    return existingItem;
  }

  public async removeSubmission(id: string): Promise<boolean> {
    if (this.hasIndexedDB) {
      try {
        const db = await this.initIndexedDB();
        await new Promise<void>((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.delete(id);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (e) {
        console.warn('[OfflineQueue] Delete IndexedDB error:', e);
      }
    }

    const localItems = this.getFromLocalStorage().filter(i => i.id !== id);
    this.saveToLocalStorage(localItems);
    return true;
  }

  public async clearAll(): Promise<void> {
    if (this.hasIndexedDB) {
      try {
        const db = await this.initIndexedDB();
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        transaction.objectStore(STORE_NAME).clear();
      } catch (e) {
        console.warn('[OfflineQueue] Clear IndexedDB error:', e);
      }
    }
    this.saveToLocalStorage([]);
  }

  public async getStats(): Promise<OfflineCacheStats> {
    const all = await this.getAllQueued();
    const pendingCount = all.filter(i => i.status === 'QUEUED').length;
    const syncedCount = all.filter(i => i.status === 'SYNCED').length;
    const failedCount = all.filter(i => i.status === 'FAILED').length;

    // Estimate storage size
    const rawString = JSON.stringify(all);
    const sizeBytes = new Blob([rawString]).size;

    const isSwActive = typeof navigator !== 'undefined' && 'serviceWorker' in navigator && !!navigator.serviceWorker.controller;

    return {
      pendingCount,
      syncedCount,
      failedCount,
      totalSizeEstimatedBytes: sizeBytes,
      storageEngine: this.hasIndexedDB ? 'IndexedDB' : 'LocalStorage',
      serviceWorkerRegistered: isSwActive
    };
  }
}

export const offlineQueueService = new OfflineQueueEngine();

// Helper to create offline data URI thumbnail safely
export async function createOfflineThumbnail(dataUrl: string, maxDim = 320): Promise<string> {
  if (typeof window === 'undefined' || !dataUrl.startsWith('data:image')) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
