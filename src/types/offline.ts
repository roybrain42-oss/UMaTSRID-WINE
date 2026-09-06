import { WasteClassificationResult } from './index';

export type OfflineQueueStatus = 'QUEUED' | 'SYNCING' | 'SYNCED' | 'FAILED';

export interface QueuedOfflineSubmission {
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  imageThumbnail?: string;
  classification: WasteClassificationResult;
  userWeightEstimateKg: number;
  pickupAddress: string;
  community: string;
  preferredPickupTime: string;
  notes?: string;
  status: OfflineQueueStatus;
  queuedAt: string;
  queuedTimestamp: number;
  retryCount: number;
  lastError?: string;
  offlineHeuristicUsed?: boolean;
  syncedAt?: string;
}

export interface OfflineCacheStats {
  pendingCount: number;
  syncedCount: number;
  failedCount: number;
  totalSizeEstimatedBytes: number;
  storageEngine: 'IndexedDB' | 'LocalStorage';
  serviceWorkerRegistered: boolean;
}
