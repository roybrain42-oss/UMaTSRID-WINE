import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  Radio, 
  Compass, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Scale, 
  ShieldCheck, 
  Crosshair, 
  Sliders, 
  ExternalLink,
  ChevronRight,
  Zap,
  Activity,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { CollectionJob } from '../../types';
import { useGpsLocation } from '../../hooks/useGpsLocation';
import { 
  calculateHaversineDistanceKm, 
  projectGpsToSvgCanvas, 
  formatCoordinates, 
  GpsService 
} from '../../services/gpsService';
import { GpsTrackingModal } from '../common/GpsTrackingModal';

interface CollectorGpsRouteMapProps {
  jobs: CollectionJob[];
  onAcceptJob: (job: CollectionJob) => void;
  onOpenVerification: (job: CollectionJob) => void;
}

// Approximate reference coordinates for common Ghanaian collection locations
const COMMUNITY_COORDINATES: Record<string, { lat: number; lng: number; mapX: number; mapY: number }> = {
  'Legon Campus': { lat: 5.6508, lng: -0.1870, mapX: 48, mapY: 38 },
  'Madina': { lat: 5.6685, lng: -0.1658, mapX: 58, mapY: 28 },
  'East Legon': { lat: 5.6372, lng: -0.1583, mapX: 62, mapY: 46 },
  'Abeka Lapaz': { lat: 5.6020, lng: -0.2350, mapX: 38, mapY: 56 },
  'Osu': { lat: 5.5560, lng: -0.1830, mapX: 50, mapY: 68 },
  'Tema': { lat: 5.6698, lng: 0.0166, mapX: 82, mapY: 52 },
  'Kumasi KNUST': { lat: 6.6745, lng: -1.5716, mapX: 25, mapY: 20 },
};

export const CollectorGpsRouteMap: React.FC<CollectorGpsRouteMapProps> = ({
  jobs,
  onAcceptJob,
  onOpenVerification,
}) => {
  const {
    coords: gpsCoords,
    status: gpsStatus,
    telemetry: gpsTelemetry,
    isHighAccuracy,
    setIsHighAccuracy,
    requestCurrentLocation,
    startRealTimeTracking,
    stopTracking,
    setSimulatedGhanaLocation,
  } = useGpsLocation({ autoStart: true, highAccuracy: true });

  const [selectedJob, setSelectedJob] = useState<CollectionJob | null>(null);
  const [isGpsModalOpen, setIsGpsModalOpen] = useState<boolean>(false);
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Agent's current real-time GPS location
  const agentLat = gpsCoords ? gpsCoords.latitude : 5.6508;
  const agentLng = gpsCoords ? gpsCoords.longitude : -0.1870;

  // Calculate live dynamic distance to each job from agent's exact GPS
  const jobsWithLiveDistance = useMemo(() => {
    return jobs.map((job) => {
      // Find matching coordinate anchor or fallback
      const anchorKey = Object.keys(COMMUNITY_COORDINATES).find(k => 
        job.community?.toLowerCase().includes(k.toLowerCase()) || 
        job.location?.toLowerCase().includes(k.toLowerCase())
      ) || 'Legon Campus';

      const anchor = COMMUNITY_COORDINATES[anchorKey] || COMMUNITY_COORDINATES['Legon Campus'];
      
      // Calculate real Haversine distance from agent's GPS to pickup location
      const distanceKm = calculateHaversineDistanceKm(
        agentLat,
        agentLng,
        anchor.lat,
        anchor.lng
      );

      return {
        ...job,
        dynamicDistanceKm: distanceKm,
        jobLat: anchor.lat,
        jobLng: anchor.lng,
        mapX: anchor.mapX,
        mapY: anchor.mapY,
      };
    }).sort((a, b) => a.dynamicDistanceKm - b.dynamicDistanceKm);
  }, [jobs, agentLat, agentLng]);

  // Agent SVG pin position projected from real GPS
  const agentSvgCoords = useMemo(() => {
    return projectGpsToSvgCanvas(agentLat, agentLng);
  }, [agentLat, agentLng]);

  const activeJob = useMemo(() => {
    if (!selectedJob) return jobsWithLiveDistance[0] || null;
    return jobsWithLiveDistance.find(j => j.id === selectedJob.id) || jobsWithLiveDistance[0] || null;
  }, [selectedJob, jobsWithLiveDistance]);

  const handleLaunchNavigation = (job: typeof jobsWithLiveDistance[0]) => {
    const url = GpsService.getGoogleMapsDirectionsUrl(
      job.jobLat,
      job.jobLng,
      agentLat,
      agentLng
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`space-y-4 ${isFullScreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}>
      
      {/* Real-time Fleet Navigation Bar */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            gpsStatus === 'LIVE_TRACKING'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
          }`}>
            <Truck className={`w-5 h-5 ${gpsStatus === 'LIVE_TRACKING' ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-white">Field Fleet GPS Radar</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                gpsStatus === 'LIVE_TRACKING'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  : gpsTelemetry.isOfflineCached
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {gpsStatus === 'LIVE_TRACKING' ? '● REAL-TIME AGENT GPS ACTIVE' : gpsTelemetry.isOfflineCached ? '💾 OFFLINE MAP CACHE' : 'GPS STANDBY'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Agent Position: <span className="font-bold text-amber-300">{gpsTelemetry.closestZoneName}</span>
              {gpsCoords && <span className="font-mono text-[11px] ml-1 text-slate-500">({gpsCoords.latitude.toFixed(4)}°N, {gpsCoords.longitude.toFixed(4)}°W ±{gpsCoords.accuracyMeters}m)</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={requestCurrentLocation}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1 cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            <span>Recenter GPS</span>
          </button>
          
          <button
            type="button"
            onClick={() => setIsGpsModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Telemetry HUD</span>
          </button>
        </div>
      </div>

      {/* Main Map Visual Stage */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
        
        {/* Map Header Controls */}
        <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-white">
          <span className="font-bold flex items-center gap-1.5 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Live Pickup Route Optimization Radar ({jobsWithLiveDistance.length} pending jobs)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 1.8))}
              className="w-6 h-6 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.8))}
              className="w-6 h-6 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1 rounded-lg bg-slate-800 text-slate-300"
            >
              {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Vector SVG Stage */}
        <div className="relative w-full h-[360px] sm:h-[420px] bg-[#090D16] overflow-hidden flex items-center justify-center">
          
          <div 
            className="absolute inset-0 transition-transform duration-300"
            style={{ transform: `scale(${mapZoom})` }}
          >
            {/* Ambient Map Contours */}
            <svg className="w-full h-full opacity-35" viewBox="0 0 1000 650" preserveAspectRatio="none">
              <path d="M0,520 Q200,480 400,530 T750,490 T1000,540 L1000,650 L0,650 Z" fill="#0369a1" opacity="0.2" />
              <path d="M480,260 L480,500" stroke="#334155" strokeWidth="3" fill="none" />
              <path d="M220,180 Q350,300 480,380" stroke="#334155" strokeWidth="2.5" fill="none" />
              <path d="M480,380 L780,480" stroke="#334155" strokeWidth="3" fill="none" />
              <circle cx="480" cy="380" r="160" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeDasharray="6,6" />
            </svg>

            {/* Agent Live Tricycle Position Marker */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-700 pointer-events-none"
              style={{ left: `${agentSvgCoords.x}%`, top: `${agentSvgCoords.y}%` }}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 animate-ping absolute" />
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center border-2 border-white shadow-xl font-black">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="absolute top-9 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md whitespace-nowrap">
                  Agent Vehicle #04
                </div>
              </div>
            </div>

            {/* Job Destination Markers */}
            {jobsWithLiveDistance.map((job) => {
              const isSelected = activeJob?.id === job.id;
              const isEnRoute = job.status === 'ACCEPTED' || job.status === 'EN_ROUTE';

              return (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  style={{ left: `${job.mapX}%`, top: `${job.mapY}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300 cursor-pointer ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                  }`}
                >
                  <div className="relative flex flex-col items-center">
                    {isSelected && (
                      <div className="w-10 h-10 rounded-full bg-emerald-400/30 animate-ping absolute -top-1" />
                    )}

                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all shadow-lg ${
                      isEnRoute
                        ? 'bg-amber-500 text-slate-950 border-white'
                        : 'bg-emerald-600 text-white border-emerald-400'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>

                    <div className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-900/90 text-slate-200 border border-slate-700 whitespace-nowrap shadow-md">
                      {job.community} ({job.dynamicDistanceKm}km)
                    </div>
                  </div>
                </button>
              );
            })}

          </div>

          {/* Floating Selected Job Detail Overlay */}
          {activeJob && (
            <div className="absolute bottom-3 left-3 right-3 z-30 bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-700 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <img 
                    src={activeJob.photoUrl} 
                    alt="waste" 
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" 
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {activeJob.wasteCategory} • Est. {activeJob.estimatedWeightKg} kg
                      </span>
                      <span className="text-[10px] font-mono text-amber-300 font-bold">
                        📍 {activeJob.dynamicDistanceKm} km from you
                      </span>
                    </div>
                    <h5 className="text-sm font-extrabold text-white mt-0.5">{activeJob.userName} ({activeJob.community})</h5>
                    <p className="text-xs text-slate-300 truncate max-w-md">{activeJob.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    type="button"
                    onClick={() => handleLaunchNavigation(activeJob)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Turn-by-Turn GPS
                  </button>

                  {activeJob.status === 'REQUESTED' ? (
                    <button
                      type="button"
                      onClick={() => onAcceptJob(activeJob)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      Accept Route
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenVerification(activeJob)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      Verify & Weigh
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* GPS Telemetry Modal */}
      <GpsTrackingModal
        isOpen={isGpsModalOpen}
        onClose={() => setIsGpsModalOpen(false)}
        telemetry={gpsTelemetry}
        onRequestLocation={requestCurrentLocation}
        onStartTracking={startRealTimeTracking}
        onStopTracking={stopTracking}
        onSimulateGhanaLocation={setSimulatedGhanaLocation}
        isHighAccuracy={isHighAccuracy}
        onToggleHighAccuracy={setIsHighAccuracy}
      />

    </div>
  );
};
