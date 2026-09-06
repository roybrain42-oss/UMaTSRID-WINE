import { useState, useEffect, useCallback, useRef } from 'react';
import { GpsCoordinates, GpsTelemetry, GpsTrackingMode, CachedMapTile } from '../types/gps';
import { GpsService, calculateHaversineDistanceKm, getClosestGhanaianZone } from '../services/gpsService';
import { localDataCache, DEFAULT_GHANA_OFFLINE_TILES } from '../services/localDataCache';

interface UseGpsLocationOptions {
  autoStart?: boolean;
  highAccuracy?: boolean;
  onLocationChange?: (coords: GpsCoordinates) => void;
}

export function useGpsLocation(options: UseGpsLocationOptions = {}) {
  const { autoStart = false, highAccuracy = true, onLocationChange } = options;

  const [coords, setCoords] = useState<GpsCoordinates | null>(null);
  const [status, setStatus] = useState<GpsTrackingMode>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [distanceTraveled, setDistanceTraveled] = useState<number>(0);
  const [isHighAccuracy, setIsHighAccuracy] = useState<boolean>(highAccuracy);
  const [lastUpdated, setLastUpdated] = useState<string>('Never');
  const [isOfflineCached, setIsOfflineCached] = useState<boolean>(false);
  const [cachedTiles, setCachedTiles] = useState<CachedMapTile[]>(DEFAULT_GHANA_OFFLINE_TILES);

  const previousCoordsRef = useRef<GpsCoordinates | null>(null);
  const stopTrackingRef = useRef<(() => void) | null>(null);

  // Load last known cached coordinates and map tiles from IndexedDB on startup
  useEffect(() => {
    let isMounted = true;

    async function loadCachedGeospatialData() {
      try {
        // 1. Load cached tiles
        const tiles = await localDataCache.getAllCachedMapTiles();
        if (isMounted && tiles && tiles.length > 0) {
          setCachedTiles(tiles);
        }

        // 2. Load last known coordinates
        const lastLocationRecord = await localDataCache.getLastCachedUserLocation();
        if (isMounted && lastLocationRecord && !coords) {
          setCoords(lastLocationRecord.coordinates);
          setLastUpdated(`${new Date(lastLocationRecord.capturedAt).toLocaleTimeString()} (Offline Cache)`);
          setIsOfflineCached(true);
        }
      } catch (err) {
        console.warn('Error loading cached geospatial data from IndexedDB:', err);
      }
    }

    loadCachedGeospatialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Stop active stream
  const stopTracking = useCallback(() => {
    if (stopTrackingRef.current) {
      stopTrackingRef.current();
      stopTrackingRef.current = null;
    }
    GpsService.stopRealTimeTracking();
    setStatus('IDLE');
  }, []);

  // Request single instant GPS position with IndexedDB persistence
  const requestCurrentLocation = useCallback(async () => {
    setStatus('LOCATING');
    setErrorMessage(null);

    try {
      const position = await GpsService.getCurrentPosition(isHighAccuracy);
      setCoords(position);
      setStatus('LIVE_TRACKING');
      setIsOfflineCached(false);
      setLastUpdated(new Date(position.timestamp).toLocaleTimeString());

      // Cache coordinate breadcrumb into IndexedDB
      const zoneName = getClosestGhanaianZone(position.latitude, position.longitude);
      localDataCache.cacheUserLocation(position, zoneName);

      if (onLocationChange) {
        onLocationChange(position);
      }
      return position;
    } catch (err: any) {
      console.warn('GPS location request error, falling back to IndexedDB cached location:', err);

      // Attempt to load last cached coordinate from IndexedDB
      const cached = await localDataCache.getLastCachedUserLocation();
      if (cached) {
        setCoords(cached.coordinates);
        setIsOfflineCached(true);
        setLastUpdated(`${new Date(cached.capturedAt).toLocaleTimeString()} (Cached)`);
      }

      if (err?.code === 1) {
        // PERMISSION_DENIED
        setStatus('PERMISSION_DENIED');
        setErrorMessage('Location permission was denied. Please allow GPS access in your browser settings.');
      } else if (err?.code === 2) {
        // POSITION_UNAVAILABLE
        setStatus('UNAVAILABLE');
        setErrorMessage('GPS position unavailable. Operating in offline cached map mode.');
      } else if (err?.code === 3) {
        // TIMEOUT
        setStatus('UNAVAILABLE');
        setErrorMessage('GPS location request timed out. Using offline cached coordinates.');
      } else {
        setStatus('UNAVAILABLE');
        setErrorMessage(err?.message || 'Unable to access device GPS.');
      }
      return cached ? cached.coordinates : null;
    }
  }, [isHighAccuracy, onLocationChange]);

  // Start continuous real-time live GPS stream with IndexedDB storage
  const startRealTimeTracking = useCallback(() => {
    setStatus('LOCATING');
    setErrorMessage(null);

    stopTracking();

    const cleanup = GpsService.startRealTimeTracking(
      (newPosition) => {
        setCoords(newPosition);
        setStatus('LIVE_TRACKING');
        setIsOfflineCached(false);
        setLastUpdated(new Date(newPosition.timestamp).toLocaleTimeString());

        // Cache coordinates to IndexedDB
        const zoneName = getClosestGhanaianZone(newPosition.latitude, newPosition.longitude);
        localDataCache.cacheUserLocation(newPosition, zoneName);

        // Calculate distance traveled between updates
        if (previousCoordsRef.current) {
          const deltaKm = calculateHaversineDistanceKm(
            previousCoordsRef.current.latitude,
            previousCoordsRef.current.longitude,
            newPosition.latitude,
            newPosition.longitude
          );
          if (deltaKm > 0.002) {
            // Greater than 2 meters
            setDistanceTraveled((prev) => prev + deltaKm * 1000);
          }
        }
        previousCoordsRef.current = newPosition;

        if (onLocationChange) {
          onLocationChange(newPosition);
        }
      },
      async (error) => {
        console.warn('Real-time GPS watch error, using IndexedDB cache:', error);
        
        const cached = await localDataCache.getLastCachedUserLocation();
        if (cached) {
          setCoords(cached.coordinates);
          setIsOfflineCached(true);
        }

        if (error.code === 1) {
          setStatus('PERMISSION_DENIED');
          setErrorMessage('Location permission denied. Click to re-grant browser GPS permission.');
        } else {
          setStatus('UNAVAILABLE');
          setErrorMessage(error.message || 'GPS connection lost. Offline tracking active.');
        }
      },
      isHighAccuracy
    );

    stopTrackingRef.current = cleanup;
  }, [isHighAccuracy, onLocationChange, stopTracking]);

  // Switch to Ghana simulation coordinate
  const setSimulatedGhanaLocation = useCallback(
    (lat: number = 5.6508, lng: number = -0.1870, accuracy: number = 4) => {
      stopTracking();
      const simulated: GpsCoordinates = {
        latitude: lat,
        longitude: lng,
        accuracyMeters: accuracy,
        altitude: 45,
        heading: 90,
        speedKmh: 12.5,
        timestamp: Date.now(),
      };
      setCoords(simulated);
      setStatus('SIMULATED');
      setIsOfflineCached(false);
      setLastUpdated(new Date().toLocaleTimeString());
      setErrorMessage(null);

      // Cache simulated position to IndexedDB
      const zoneName = getClosestGhanaianZone(lat, lng);
      localDataCache.cacheUserLocation(simulated, zoneName);

      if (onLocationChange) {
        onLocationChange(simulated);
      }
    },
    [onLocationChange, stopTracking]
  );

  useEffect(() => {
    if (autoStart) {
      startRealTimeTracking();
    }
    return () => {
      stopTracking();
    };
  }, [autoStart, startRealTimeTracking, stopTracking]);

  const telemetry: GpsTelemetry = {
    coordinates: coords,
    status,
    errorMessage,
    isHighAccuracy,
    distanceTraveledMeters: Math.round(distanceTraveled),
    lastUpdatedTime: lastUpdated,
    closestZoneName: coords ? getClosestGhanaianZone(coords.latitude, coords.longitude) : 'Searching...',
    satellitesEstimated: status === 'LIVE_TRACKING' ? (isHighAccuracy ? 14 : 7) : (isOfflineCached ? 0 : 0),
    isOfflineCached,
  };

  return {
    coords,
    status,
    errorMessage,
    telemetry,
    isHighAccuracy,
    isOfflineCached,
    cachedTiles,
    setIsHighAccuracy,
    requestCurrentLocation,
    startRealTimeTracking,
    stopTracking,
    setSimulatedGhanaLocation,
  };
}
