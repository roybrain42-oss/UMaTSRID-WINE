import { GpsCoordinates, GhanaGeoBoundary } from '../types/gps';

// Standard Ghanaian Landmark Reference Coordinates
export const GHANA_REFERENCE_ZONES: GhanaGeoBoundary[] = [
  { name: 'UG Legon Campus', region: 'Greater Accra', latitude: 5.6508, longitude: -0.1870, radiusKm: 3.5, svgMapX: 48, svgMapY: 38 },
  { name: 'Madina / Zongo Junction', region: 'Greater Accra', latitude: 5.6685, longitude: -0.1658, radiusKm: 4.0, svgMapX: 58, svgMapY: 28 },
  { name: 'East Legon / Lagos Ave', region: 'Greater Accra', latitude: 5.6372, longitude: -0.1583, radiusKm: 3.0, svgMapX: 62, svgMapY: 46 },
  { name: 'Accra Central / Ministries', region: 'Greater Accra', latitude: 5.5502, longitude: -0.1983, radiusKm: 5.0, svgMapX: 42, svgMapY: 74 },
  { name: 'Osu / Oxford Street', region: 'Greater Accra', latitude: 5.5560, longitude: -0.1830, radiusKm: 2.5, svgMapX: 50, svgMapY: 68 },
  { name: 'Tema Industrial Area', region: 'Greater Accra', latitude: 5.6698, longitude: 0.0166, radiusKm: 8.0, svgMapX: 82, svgMapY: 52 },
  { name: 'KNUST Tech Junction', region: 'Ashanti Region', latitude: 6.6745, longitude: -1.5716, radiusKm: 6.0, svgMapX: 25, svgMapY: 20 },
  { name: 'Ashesi Campus Berekuso', region: 'Eastern Region', latitude: 5.7597, longitude: -0.2198, radiusKm: 4.0, svgMapX: 36, svgMapY: 15 },
  { name: 'Cape Coast Castle Green', region: 'Central Region', latitude: 5.1053, longitude: -1.2466, radiusKm: 5.0, svgMapX: 18, svgMapY: 82 },
  { name: 'Tamale Central Market', region: 'Northern Region', latitude: 9.4008, longitude: -0.8393, radiusKm: 7.0, svgMapX: 30, svgMapY: 8 },
];

// Great-circle distance between two GPS coordinates using the Haversine formula
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

// Convert real world GPS coordinates (latitude, longitude) to 2D SVG canvas percentages (0-100%)
// Bounding box for Southern Ghana / Accra region
export function projectGpsToSvgCanvas(
  latitude: number,
  longitude: number
): { x: number; y: number } {
  // Bounding box approximate anchors:
  // North: 5.80 (top 10%), South: 5.48 (bottom 85%)
  // West: -0.30 (left 15%), East: 0.08 (right 90%)
  const minLat = 5.48;
  const maxLat = 5.80;
  const minLng = -0.30;
  const maxLng = 0.08;

  // Invert Y because latitude increases going North (upwards), while SVG Y increases downwards
  let x = ((longitude - minLng) / (maxLng - minLng)) * 80 + 10;
  let y = ((maxLat - latitude) / (maxLat - minLat)) * 75 + 10;

  // Clamp within 5% to 95%
  x = Math.max(5, Math.min(95, x));
  y = Math.max(5, Math.min(95, y));

  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

// Reverse geotag closest Ghanaian municipal zone
export function getClosestGhanaianZone(latitude: number, longitude: number): string {
  let closestZone = GHANA_REFERENCE_ZONES[0];
  let minDistance = calculateHaversineDistanceKm(
    latitude,
    longitude,
    closestZone.latitude,
    closestZone.longitude
  );

  for (const zone of GHANA_REFERENCE_ZONES) {
    const dist = calculateHaversineDistanceKm(
      latitude,
      longitude,
      zone.latitude,
      zone.longitude
    );
    if (dist < minDistance) {
      minDistance = dist;
      closestZone = zone;
    }
  }

  if (minDistance <= 1.5) {
    return `${closestZone.name}, ${closestZone.region}`;
  } else if (minDistance <= 10.0) {
    return `Near ${closestZone.name} (${minDistance} km)`;
  } else {
    return `Ghana Grid (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`;
  }
}

// Format coordinates to readable string
export function formatCoordinates(lat: number, lng: number): string {
  const latStr = `${Math.abs(lat).toFixed(5)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lngStr = `${Math.abs(lng).toFixed(5)}° ${lng >= 0 ? 'E' : 'W'}`;
  return `${latStr}, ${lngStr}`;
}

export class GpsService {
  private static watchId: number | null = null;

  /**
   * Acquire a one-shot high accuracy GPS position
   */
  public static async getCurrentPosition(highAccuracy: boolean = true): Promise<GpsCoordinates> {
    return new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser environment.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: GpsCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracyMeters: Math.round(position.coords.accuracy),
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speedKmh: position.coords.speed ? Math.round(position.coords.speed * 3.6 * 10) / 10 : 0,
            timestamp: position.timestamp,
          };
          resolve(coords);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: 12000,
          maximumAge: 0,
        }
      );
    });
  }

  /**
   * Start continuous real-time GPS stream
   */
  public static startRealTimeTracking(
    onUpdate: (coords: GpsCoordinates) => void,
    onError: (error: GeolocationPositionError) => void,
    highAccuracy: boolean = true
  ): () => void {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return () => {};
    }

    // Stop existing watch if any
    this.stopRealTimeTracking();

    try {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const coords: GpsCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracyMeters: Math.round(position.coords.accuracy),
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speedKmh: position.coords.speed ? Math.round(position.coords.speed * 3.6 * 10) / 10 : 0,
            timestamp: position.timestamp,
          };
          onUpdate(coords);
        },
        (error) => {
          onError(error);
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: 15000,
          maximumAge: 1000,
        }
      );
    } catch (err) {
      console.warn('watchPosition invocation error:', err);
    }

    return () => this.stopRealTimeTracking();
  }

  /**
   * Stop active GPS stream
   */
  public static stopRealTimeTracking(): void {
    if (this.watchId !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Generate Google Maps directions external URL with live coordinates
   */
  public static getGoogleMapsDirectionsUrl(
    destLat: number,
    destLng: number,
    originLat?: number,
    originLng?: number
  ): string {
    if (originLat !== undefined && originLng !== undefined) {
      return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
  }
}
