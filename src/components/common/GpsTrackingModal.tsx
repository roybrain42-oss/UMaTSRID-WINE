import React from 'react';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  Radio, 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  Sliders, 
  Activity, 
  ExternalLink,
  Zap,
  Globe,
  Crosshair,
  Database,
  WifiOff
} from 'lucide-react';
import { GpsTelemetry, GpsCoordinates } from '../../types/gps';
import { formatCoordinates, GpsService } from '../../services/gpsService';

interface GpsTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: GpsTelemetry;
  onRequestLocation: () => void;
  onStartTracking: () => void;
  onStopTracking: () => void;
  onSimulateGhanaLocation: (lat?: number, lng?: number) => void;
  isHighAccuracy: boolean;
  onToggleHighAccuracy: (val: boolean) => void;
}

export const GpsTrackingModal: React.FC<GpsTrackingModalProps> = ({
  isOpen,
  onClose,
  telemetry,
  onRequestLocation,
  onStartTracking,
  onStopTracking,
  onSimulateGhanaLocation,
  isHighAccuracy,
  onToggleHighAccuracy,
}) => {
  if (!isOpen) return null;

  const isTracking = telemetry.status === 'LIVE_TRACKING';
  const coords = telemetry.coordinates;
  const isOfflineCached = telemetry.isOfflineCached;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-blue-500/40 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col text-white">
        
        {/* Header HUD */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isTracking
                ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
                : isOfflineCached
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                : 'bg-slate-800 border border-slate-700 text-slate-400'
            }`}>
              {isOfflineCached ? <Database className="w-5 h-5 text-amber-400" /> : <Radio className={`w-5 h-5 ${isTracking ? 'animate-pulse' : ''}`} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Real-Time GPS Satellite Telemetry</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                  isTracking 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' 
                    : isOfflineCached
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                    : telemetry.status === 'LOCATING'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {isTracking ? '● LIVE SATELLITE LOCK' : isOfflineCached ? '💾 INDEXEDDB OFFLINE CACHE' : telemetry.status === 'LOCATING' ? 'ACQUIRING FIX...' : 'STANDBY'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                WGS-84 Geodetic Navigation System • EPA Ghana Grid & Offline Vector Cache
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          
          {/* Status Message / Error Banner */}
          {telemetry.status === 'PERMISSION_DENIED' && (
            <div className="bg-amber-950/60 border border-amber-500/40 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                Browser Location Permission Needed
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Your browser or device blocked location access. Please click the location icon in your URL address bar, toggle "Allow", and tap the button below.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={onRequestLocation}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Prompt Location Permission
                </button>
                <button
                  type="button"
                  onClick={() => onSimulateGhanaLocation(5.6508, -0.1870)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl cursor-pointer"
                >
                  Use Ghana Simulated GPS
                </button>
              </div>
            </div>
          )}

          {/* Offline Caching Status Banner */}
          <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">IndexedDB Offline Geocache</span>
                <span className="text-[10px] text-blue-200">Pre-cached Southern Ghana sector map tiles and last known coordinates stored for intermittent connectivity.</span>
              </div>
            </div>
            <span className="px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold font-mono shrink-0">
              TILES SYNCED
            </span>
          </div>

          {/* Real-time Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            
            {/* Latitude */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Latitude (WGS84)</span>
              <span className="text-sm font-bold text-white font-mono">
                {coords ? coords.latitude.toFixed(6) : '0.000000'}°
              </span>
              <span className="text-[9px] text-slate-500 block">
                {coords ? (coords.latitude >= 0 ? 'North Meridian' : 'South Meridian') : '—'}
              </span>
            </div>

            {/* Longitude */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Longitude (WGS84)</span>
              <span className="text-sm font-bold text-white font-mono">
                {coords ? coords.longitude.toFixed(6) : '0.000000'}°
              </span>
              <span className="text-[9px] text-slate-500 block">
                {coords ? (coords.longitude >= 0 ? 'East Meridian' : 'West Meridian') : '—'}
              </span>
            </div>

            {/* Accuracy */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Accuracy Radius</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {coords ? `± ${coords.accuracyMeters} m` : '—'}
              </span>
              <span className="text-[9px] text-slate-500 block">
                {coords && coords.accuracyMeters <= 10 ? 'High Precision Fix' : isOfflineCached ? 'Cached Approximation' : 'Standard Fix'}
              </span>
            </div>

            {/* Speed */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Ground Speed</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">
                {coords && coords.speedKmh ? `${coords.speedKmh} km/h` : '0.0 km/h'}
              </span>
              <span className="text-[9px] text-slate-500 block">Doppler Velocity</span>
            </div>

            {/* Heading */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Compass Heading</span>
              <span className="text-sm font-bold text-indigo-400 font-mono">
                {coords && coords.heading !== null && coords.heading !== undefined ? `${Math.round(coords.heading)}° True` : 'Stationary'}
              </span>
              <span className="text-[9px] text-slate-500 block">Gyro / Magnetometer</span>
            </div>

            {/* Satellites */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Satellites Tracked</span>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {telemetry.satellitesEstimated > 0 ? `${telemetry.satellitesEstimated} Locked` : isOfflineCached ? 'Offline Cache' : 'Searching'}
              </span>
              <span className="text-[9px] text-slate-500 block">GPS / GLONASS / Galileo</span>
            </div>

          </div>

          {/* Current Geotagged Zone Info */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Resolved Ghanaian Territory:
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Last Update: {telemetry.lastUpdatedTime}
              </span>
            </div>
            <h4 className="text-base font-extrabold text-white">
              {telemetry.closestZoneName}
            </h4>
            {coords && (
              <p className="text-xs text-slate-400 font-mono">
                Exact Coordinates: {formatCoordinates(coords.latitude, coords.longitude)}
              </p>
            )}
          </div>

          {/* Precision Configuration Toggle */}
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-xs font-bold text-white block">High Accuracy GPS Mode</span>
                <span className="text-[10px] text-slate-400">Utilizes hardware GNSS satellite receivers for 1-5 meter precision</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToggleHighAccuracy(!isHighAccuracy)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                isHighAccuracy ? 'bg-blue-600' : 'bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                isHighAccuracy ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Quick Simulation Anchors for testing */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Quick Test Location Anchors (Ghana):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => onSimulateGhanaLocation(5.6508, -0.1870)}
                className="px-2.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 text-left text-xs transition-all cursor-pointer"
              >
                <span className="font-bold text-white block text-[11px]">UG Legon</span>
                <span className="text-[9px] text-slate-400">Accra (5.6508°N)</span>
              </button>
              <button
                type="button"
                onClick={() => onSimulateGhanaLocation(5.6685, -0.1658)}
                className="px-2.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 text-left text-xs transition-all cursor-pointer"
              >
                <span className="font-bold text-white block text-[11px]">Madina Zongo</span>
                <span className="text-[9px] text-slate-400">Accra (5.6685°N)</span>
              </button>
              <button
                type="button"
                onClick={() => onSimulateGhanaLocation(5.5502, -0.1983)}
                className="px-2.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 text-left text-xs transition-all cursor-pointer"
              >
                <span className="font-bold text-white block text-[11px]">Accra Central</span>
                <span className="text-[9px] text-slate-400">Ministries (5.5502°N)</span>
              </button>
              <button
                type="button"
                onClick={() => onSimulateGhanaLocation(6.6745, -1.5716)}
                className="px-2.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 text-left text-xs transition-all cursor-pointer"
              >
                <span className="font-bold text-white block text-[11px]">KNUST Kumasi</span>
                <span className="text-[9px] text-slate-400">Ashanti (6.6745°N)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-950 px-5 py-3.5 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {coords && (
              <a
                href={GpsService.getGoogleMapsDirectionsUrl(coords.latitude, coords.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View in Google Maps
              </a>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {isTracking ? (
              <button
                type="button"
                onClick={onStopTracking}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition-all cursor-pointer"
              >
                Stop Live Stream
              </button>
            ) : (
              <button
                type="button"
                onClick={onStartTracking}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5" />
                Start Real-Time GPS Tracking
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
