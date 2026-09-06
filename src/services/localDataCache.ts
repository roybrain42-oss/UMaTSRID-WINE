// IndexedDB Local-First Data & Geospatial Cache Engine for EcoSort Ghana
// Ensures complete dashboard stats, submissions, transactions, and real-time offline GPS map tiles
// remain accessible and interactive when offline or when network connectivity is intermittent.

import { 
  UserProfile, 
  WasteSubmission, 
  CollectionJob, 
  PointTransaction, 
  CashWithdrawalRecord, 
  RewardItem, 
  RewardRateRule, 
  RewardRedemption, 
  LeaderboardEntry, 
  Challenge, 
  RecyclerInventory, 
  RecyclerOrder, 
  RobotSortingEvent,
  AdminAuditLog 
} from '../types';
import { GpsCoordinates, CachedMapTile, CachedLocationRecord } from '../types/gps';
import { AppNotification } from '../context/EcoSortContext';

export interface EcoSortCachedState {
  currentUser?: UserProfile;
  allUsers?: UserProfile[];
  adminAuditLogs?: AdminAuditLog[];
  submissions?: WasteSubmission[];
  collectionJobs?: CollectionJob[];
  rewardRules?: RewardRateRule[];
  rewards?: RewardItem[];
  redemptions?: RewardRedemption[];
  transactions?: PointTransaction[];
  cashWithdrawals?: CashWithdrawalRecord[];
  leaderboard?: LeaderboardEntry[];
  challenge?: Challenge;
  recyclerInventory?: RecyclerInventory[];
  recyclerOrders?: RecyclerOrder[];
  robotEvents?: RobotSortingEvent[];
  notifications?: AppNotification[];
  lastCachedTimestamp?: number;
}

export interface CachedDashboardMetrics {
  totalEcoPoints: number;
  totalWasteKg: number;
  co2SavedKg: number;
  verifiedCollections: number;
  cashEquivalentGhs: number;
  submissionsCount: number;
  communityRank: number;
  lastUpdated: string;
  isCachedOffline: boolean;
}

const DB_NAME = 'ecosort_local_cache_db_v4';
const DB_VERSION = 3;

const STORES = {
  SNAPSHOT: 'app_snapshot',
  SUBMISSIONS: 'submissions',
  TRANSACTIONS: 'transactions',
  METRICS: 'dashboard_metrics',
  MAP_TILES: 'cached_map_tiles',
  OFFLINE_LOCATIONS: 'cached_user_coordinates',
} as const;

const LOCALSTORAGE_BACKUP_KEY = 'ecosort_idb_cache_fallback_v4';
const LOCALSTORAGE_METRICS_KEY = 'ecosort_dashboard_metrics_cache_v4';
const LOCALSTORAGE_LAST_LOCATION_KEY = 'ecosort_last_known_gps_coord_v4';
const LOCALSTORAGE_MAP_TILES_BACKUP_KEY = 'ecosort_map_tiles_backup_v4';

// Pre-seeded Ghana offline regional map tile definitions
export const DEFAULT_GHANA_OFFLINE_TILES: CachedMapTile[] = [
  {
    key: 'ghana_greater_accra_core',
    region: 'Greater Accra',
    title: 'Greater Accra Metropolitan & Coastal Basin',
    bounds: { minLat: 5.48, maxLat: 5.80, minLng: -0.30, maxLng: 0.08 },
    centerCoordinates: { latitude: 5.6037, longitude: -0.1870 },
    cachedTimestamp: Date.now(),
    landmarks: [
      { name: 'UG Legon Eco Hub', lat: 5.6508, lng: -0.1870, type: 'HUB' },
      { name: 'Madina Market Buyback', lat: 5.6685, lng: -0.1658, type: 'BUYBACK' },
      { name: 'East Legon Smart Bin', lat: 5.6372, lng: -0.1583, type: 'SMART_BIN' },
      { name: 'EPA Ghana HQ Ministries', lat: 5.5502, lng: -0.1983, type: 'EPA_DEPOT' },
      { name: 'Osu Oxford Green Point', lat: 5.5560, lng: -0.1830, type: 'DEPOT' },
      { name: 'Tema Industrial Logistics', lat: 5.6698, lng: 0.0166, type: 'DEPOT' },
    ]
  },
  {
    key: 'ghana_ashanti_kumasi_basin',
    region: 'Ashanti Region',
    title: 'Kumasi Metropolitan & KNUST Tech Corridor',
    bounds: { minLat: 6.55, maxLat: 6.80, minLng: -1.70, maxLng: -1.45 },
    centerCoordinates: { latitude: 6.6745, longitude: -1.5716 },
    cachedTimestamp: Date.now(),
    landmarks: [
      { name: 'KNUST Tech Junction Eco Depot', lat: 6.6745, lng: -1.5716, type: 'HUB' },
      { name: 'Kejetia Central Market Station', lat: 6.6965, lng: -1.6250, type: 'BUYBACK' }
    ]
  },
  {
    key: 'ghana_eastern_berekuso_ridge',
    region: 'Eastern Region',
    title: 'Akuapem South & Berekuso Solar Ridge',
    bounds: { minLat: 5.70, maxLat: 5.85, minLng: -0.28, maxLng: -0.15 },
    centerCoordinates: { latitude: 5.7597, longitude: -0.2198 },
    cachedTimestamp: Date.now(),
    landmarks: [
      { name: 'Ashesi Solar Smart Bin Cluster', lat: 5.7597, lng: -0.2198, type: 'SMART_BIN' }
    ]
  }
];

class LocalDataCacheEngine {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private hasIndexedDB: boolean = typeof window !== 'undefined' && 'indexedDB' in window;
  private lastCachedTime: number = Date.now();

  constructor() {
    if (this.hasIndexedDB) {
      this.initDB();
    }
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          if (!db.objectStoreNames.contains(STORES.SNAPSHOT)) {
            db.createObjectStore(STORES.SNAPSHOT, { keyPath: 'key' });
          }
          if (!db.objectStoreNames.contains(STORES.SUBMISSIONS)) {
            const subStore = db.createObjectStore(STORES.SUBMISSIONS, { keyPath: 'id' });
            subStore.createIndex('createdAt', 'createdAt', { unique: false });
            subStore.createIndex('userId', 'userId', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
            const txStore = db.createObjectStore(STORES.TRANSACTIONS, { keyPath: 'id' });
            txStore.createIndex('timestamp', 'timestamp', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.METRICS)) {
            db.createObjectStore(STORES.METRICS, { keyPath: 'userId' });
          }
          // Spatial stores for Offline Map Tiles & Coordinates Cache
          if (!db.objectStoreNames.contains(STORES.MAP_TILES)) {
            const tileStore = db.createObjectStore(STORES.MAP_TILES, { keyPath: 'key' });
            tileStore.createIndex('region', 'region', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.OFFLINE_LOCATIONS)) {
            const locStore = db.createObjectStore(STORES.OFFLINE_LOCATIONS, { keyPath: 'id' });
            locStore.createIndex('capturedAt', 'capturedAt', { unique: false });
          }
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          // Seed default map tiles if newly created
          this.seedInitialOfflineMapTiles(db);
          resolve(db);
        };

        request.onerror = (event) => {
          console.warn('[LocalDataCache] IndexedDB open error, falling back to LocalStorage:', event);
          this.hasIndexedDB = false;
          reject((event.target as IDBOpenDBRequest).error);
        };
      } catch (err) {
        console.warn('[LocalDataCache] IndexedDB initialization error:', err);
        this.hasIndexedDB = false;
        reject(err);
      }
    });

    return this.dbPromise;
  }

  private async seedInitialOfflineMapTiles(db: IDBDatabase): Promise<void> {
    try {
      const tx = db.transaction([STORES.MAP_TILES], 'readwrite');
      const store = tx.objectStore(STORES.MAP_TILES);
      for (const tile of DEFAULT_GHANA_OFFLINE_TILES) {
        store.put(tile);
      }
    } catch {
      // ignore
    }
  }

  // --- Fallback helpers ---
  private getFallbackState(): EcoSortCachedState | null {
    try {
      const data = localStorage.getItem(LOCALSTORAGE_BACKUP_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private saveFallbackState(state: EcoSortCachedState): void {
    try {
      localStorage.setItem(LOCALSTORAGE_BACKUP_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[LocalDataCache] LocalStorage fallback quota exceeded:', e);
    }
  }

  /**
   * Save complete application state to IndexedDB
   */
  public async saveStateToCache(state: EcoSortCachedState): Promise<void> {
    const timestamp = Date.now();
    this.lastCachedTime = timestamp;
    const stateToSave = { ...state, lastCachedTimestamp: timestamp };

    // 1. Always save in IndexedDB
    if (this.hasIndexedDB) {
      try {
        const db = await this.initDB();
        const tx = db.transaction([STORES.SNAPSHOT, STORES.METRICS], 'readwrite');
        
        // Save complete snapshot
        const snapshotStore = tx.objectStore(STORES.SNAPSHOT);
        snapshotStore.put({ key: 'current_app_state', data: stateToSave, updatedAt: timestamp });

        // Extract and cache lightweight dashboard metrics for instant offline display
        if (state.currentUser) {
          const metrics: CachedDashboardMetrics = {
            totalEcoPoints: state.currentUser.ecoPoints,
            totalWasteKg: state.currentUser.totalWasteKg || 0,
            co2SavedKg: state.currentUser.co2SavedKg || 0,
            verifiedCollections: state.currentUser.verifiedCollections || 0,
            cashEquivalentGhs: +(state.currentUser.ecoPoints / 10).toFixed(2),
            submissionsCount: state.submissions ? state.submissions.length : 0,
            communityRank: 4,
            lastUpdated: new Date().toLocaleTimeString(),
            isCachedOffline: true
          };

          const metricsStore = tx.objectStore(STORES.METRICS);
          metricsStore.put({ userId: state.currentUser.id || 'default_user', ...metrics });

          // Also keep a fast LocalStorage copy of metrics
          try {
            localStorage.setItem(LOCALSTORAGE_METRICS_KEY, JSON.stringify(metrics));
          } catch {
            // ignore
          }
        }

        await new Promise<void>((resolve, reject) => {
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
      } catch (err) {
        console.warn('[LocalDataCache] Error persisting state to IndexedDB:', err);
      }
    }

    // 2. Also keep mirror in LocalStorage
    this.saveFallbackState(stateToSave);
  }

  /**
   * Retrieve cached state from IndexedDB on startup or offline reconnection
   */
  public async loadCachedState(): Promise<EcoSortCachedState | null> {
    if (this.hasIndexedDB) {
      try {
        const db = await this.initDB();
        return new Promise((resolve) => {
          const tx = db.transaction([STORES.SNAPSHOT], 'readonly');
          const store = tx.objectStore(STORES.SNAPSHOT);
          const req = store.get('current_app_state');

          req.onsuccess = () => {
            if (req.result && req.result.data) {
              if (req.result.updatedAt) {
                this.lastCachedTime = req.result.updatedAt;
              }
              resolve(req.result.data as EcoSortCachedState);
            } else {
              resolve(this.getFallbackState());
            }
          };

          req.onerror = () => {
            resolve(this.getFallbackState());
          };
        });
      } catch {
        return this.getFallbackState();
      }
    }
    return this.getFallbackState();
  }

  /**
   * Retrieve fast cached dashboard metrics for offline resilience
   */
  public async getCachedMetrics(userId = 'user-001'): Promise<CachedDashboardMetrics | null> {
    if (this.hasIndexedDB) {
      try {
        const db = await this.initDB();
        return new Promise((resolve) => {
          const tx = db.transaction([STORES.METRICS], 'readonly');
          const store = tx.objectStore(STORES.METRICS);
          const req = store.get(userId);

          req.onsuccess = () => {
            if (req.result) {
              resolve(req.result as CachedDashboardMetrics);
            } else {
              resolve(this.getFallbackMetrics());
            }
          };

          req.onerror = () => {
            resolve(this.getFallbackMetrics());
          };
        });
      } catch {
        return this.getFallbackMetrics();
      }
    }
    return this.getFallbackMetrics();
  }

  private getFallbackMetrics(): CachedDashboardMetrics | null {
    try {
      const data = localStorage.getItem(LOCALSTORAGE_METRICS_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // =========================================================================
  // GEOSPATIAL & MAP TILE CACHING ENGINES (FOR OFFLINE NAVIGATION TRACKING)
  // =========================================================================

  /**
   * Save user GPS coordinates into IndexedDB breadcrumb history
   */
  public async cacheUserLocation(
    coords: GpsCoordinates,
    zoneName: string = 'Ghana Region'
  ): Promise<void> {
    const record: CachedLocationRecord = {
      id: `gps_loc_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      coordinates: coords,
      zoneName,
      capturedAt: coords.timestamp || Date.now(),
      offlineSyncState: 'STORED_OFFLINE',
      speedKmh: coords.speedKmh || 0,
      heading: coords.heading || undefined,
    };

    // Save in IndexedDB
    if (this.hasIndexedDB) {
      try {
        const db = await this.initDB();
        const tx = db.transaction([STORES.OFFLINE_LOCATIONS], 'readwrite');
        const store = tx.objectStore(STORES.OFFLINE_LOCATIONS);
        store.put(record);
      } catch (err) {
        console.warn('[LocalDataCache] Error caching GPS location to IndexedDB:', err);
      }
    }

    // Always preserve last known position in LocalStorage for instantaneous boot
    try {
      localStorage.setItem(LOCALSTORAGE_LAST_LOCATION_KEY, JSON.stringify(record));
    } catch {
      // ignore
    }
  }

  /**
   * Retrieve the most recent cached GPS location from IndexedDB / LocalStorage
   */
  public async getLastCachedUserLocation(): Promise<CachedLocationRecord | null> {
    if (this.hasIndexedDB) {
      try {
        const db = await this.initDB();
        return new Promise((resolve) => {
          const tx = db.transaction([STORES.OFFLINE_LOCATIONS], 'readonly');
          const store = tx.objectStore(STORES.OFFLINE_LOCATIONS);
          const req = store.openCursor(null, 'prev'); // Latest entry

          req.onsuccess = () => {
            const cursor = req.result;
            if (cursor && cursor.value) {
              resolve(cursor.value as CachedLocationRecord);
            } else {
              resolve(this.getFallbackLastLocation());
            }
          };

          req.onerror = () => {
            resolve(this.getFallbackLastLocation());
          };
        });
      } catch {
        return this.getFallbackLastLocation();
      }
    }
    return this.getFallbackLastLocation();
  }

  private getFallbackLastLocation(): CachedLocationRecord | null {
    try {
      const data = localStorage.getItem(LOCALSTORAGE_LAST_LOCATION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Cache loaded map tile definitions in IndexedDB
   */
  public async cacheMapTile(tile: CachedMapTile): Promise<void> {
    if (this.hasIndexedDB) {
      try {
        const db = await this.initDB();
        const tx = db.transaction([STORES.MAP_TILES], 'readwrite');
        const store = tx.objectStore(STORES.MAP_TILES);
        store.put({ ...tile, cachedTimestamp: Date.now() });
      } catch (err) {
        console.warn('[LocalDataCache] Error caching map tile to IndexedDB:', err);
      }
    }

    try {
      const existing = localStorage.getItem(LOCALSTORAGE_MAP_TILES_BACKUP_KEY);
      const tiles: CachedMapTile[] = existing ? JSON.parse(existing) : [];
      const updated = [tile, ...tiles.filter(t => t.key !== tile.key)].slice(0, 10);
      localStorage.setItem(LOCALSTORAGE_MAP_TILES_BACKUP_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  /**
   * Retrieve all cached map tiles for offline GPS rendering
   */
  public async getAllCachedMapTiles(): Promise<CachedMapTile[]> {
    if (this.hasIndexedDB) {
      try {
        const db = await this.initDB();
        return new Promise((resolve) => {
          const tx = db.transaction([STORES.MAP_TILES], 'readonly');
          const store = tx.objectStore(STORES.MAP_TILES);
          const req = store.getAll();

          req.onsuccess = () => {
            if (req.result && req.result.length > 0) {
              resolve(req.result as CachedMapTile[]);
            } else {
              resolve(DEFAULT_GHANA_OFFLINE_TILES);
            }
          };

          req.onerror = () => {
            resolve(DEFAULT_GHANA_OFFLINE_TILES);
          };
        });
      } catch {
        return DEFAULT_GHANA_OFFLINE_TILES;
      }
    }
    return DEFAULT_GHANA_OFFLINE_TILES;
  }

  /**
   * Clear local cache
   */
  public async clearCache(): Promise<void> {
    if (this.hasIndexedDB) {
      try {
        const db = await this.initDB();
        const tx = db.transaction(
          [
            STORES.SNAPSHOT, 
            STORES.METRICS, 
            STORES.SUBMISSIONS, 
            STORES.TRANSACTIONS,
            STORES.MAP_TILES,
            STORES.OFFLINE_LOCATIONS
          ], 
          'readwrite'
        );
        tx.objectStore(STORES.SNAPSHOT).clear();
        tx.objectStore(STORES.METRICS).clear();
        tx.objectStore(STORES.SUBMISSIONS).clear();
        tx.objectStore(STORES.TRANSACTIONS).clear();
        tx.objectStore(STORES.MAP_TILES).clear();
        tx.objectStore(STORES.OFFLINE_LOCATIONS).clear();
      } catch (err) {
        console.warn('[LocalDataCache] Error clearing IndexedDB cache:', err);
      }
    }
    try {
      localStorage.removeItem(LOCALSTORAGE_BACKUP_KEY);
      localStorage.removeItem(LOCALSTORAGE_METRICS_KEY);
      localStorage.removeItem(LOCALSTORAGE_LAST_LOCATION_KEY);
      localStorage.removeItem(LOCALSTORAGE_MAP_TILES_BACKUP_KEY);
    } catch {
      // ignore
    }
  }

  public getLastCachedTimestamp(): number {
    return this.lastCachedTime;
  }
}

export const localDataCache = new LocalDataCacheEngine();
