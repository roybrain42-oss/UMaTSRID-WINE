export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speedKmh?: number | null;
  timestamp: number;
}

export type GpsTrackingMode = 'IDLE' | 'LOCATING' | 'LIVE_TRACKING' | 'PERMISSION_DENIED' | 'UNAVAILABLE' | 'SIMULATED';

export interface GpsTelemetry {
  coordinates: GpsCoordinates | null;
  status: GpsTrackingMode;
  errorMessage?: string | null;
  isHighAccuracy: boolean;
  distanceTraveledMeters: number;
  lastUpdatedTime: string;
  closestZoneName: string;
  satellitesEstimated: number;
  isOfflineCached?: boolean;
}

export interface GhanaGeoBoundary {
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  svgMapX: number; // 0 to 100 percentage
  svgMapY: number; // 0 to 100 percentage
}

export interface CachedMapTile {
  key: string; // e.g. "ghana_accra_sector_1"
  region: string;
  title: string;
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  svgVectorPathData?: string;
  centerCoordinates: {
    latitude: number;
    longitude: number;
  };
  cachedTimestamp: number;
  landmarks: Array<{
    name: string;
    lat: number;
    lng: number;
    type: string;
  }>;
}

export interface CachedLocationRecord {
  id: string;
  coordinates: GpsCoordinates;
  zoneName: string;
  capturedAt: number;
  offlineSyncState: 'STORED_OFFLINE' | 'SYNCED';
  speedKmh?: number;
  heading?: number;
}
