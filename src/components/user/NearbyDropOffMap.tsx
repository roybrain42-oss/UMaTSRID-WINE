import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Filter, 
  Clock, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  Compass, 
  Zap, 
  Building2, 
  Recycle, 
  Layers, 
  Info,
  Maximize2,
  Minimize2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award,
  Radio,
  Crosshair,
  Activity,
  Sliders
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { useGpsLocation } from '../../hooks/useGpsLocation';
import { 
  calculateHaversineDistanceKm, 
  projectGpsToSvgCanvas, 
  formatCoordinates, 
  GpsService 
} from '../../services/gpsService';
import { GpsTrackingModal } from '../common/GpsTrackingModal';

export interface DropOffPoint {
  id: string;
  name: string;
  category: 'CAMPUS_HUB' | 'EPA_DEPOT' | 'SMART_BIN' | 'BUYBACK_CENTER';
  address: string;
  zone: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  // Visual position coordinates on SVG canvas (0 to 100 percentage)
  mapX: number;
  mapY: number;
  openHours: string;
  isOpenNow: boolean;
  acceptedMaterials: string[];
  bonusEcoPointsPercent: number;
  fullnessPercent: number;
  contactPhone: string;
  verifiedByEPA: boolean;
  hasInstantCashier: boolean;
  description: string;
}

const AUTHORIZED_DROP_OFF_POINTS_DATA: Omit<DropOffPoint, 'distanceKm'>[] = [
  {
    id: 'hub-ug-legon',
    name: 'UG Legon Central Eco-Hub',
    category: 'CAMPUS_HUB',
    address: 'Near Commonwealth Hall & Balme Library, Legon Campus',
    zone: 'University of Ghana, Accra',
    latitude: 5.6508,
    longitude: -0.1870,
    mapX: 48,
    mapY: 38,
    openHours: 'Mon - Sat: 7:00 AM - 7:00 PM',
    isOpenNow: true,
    acceptedMaterials: ['PET Plastic Bottles', 'HDPE Jugs', 'Aluminium Cans', 'Paper / Cardboard'],
    bonusEcoPointsPercent: 15,
    fullnessPercent: 38,
    contactPhone: '+233 24 892 4110',
    verifiedByEPA: true,
    hasInstantCashier: true,
    description: 'Premier campus circularity center with automated scales and instant MTN / Telecel MoMo disbursement.'
  },
  {
    id: 'hub-madina-market',
    name: 'Madina Zongo Junction Buy-Back Depot',
    category: 'BUYBACK_CENTER',
    address: 'Opposite Madina Central Market Terminal, Madina',
    zone: 'La-Nkwantanang-Madina, Accra',
    latitude: 5.6685,
    longitude: -0.1658,
    mapX: 58,
    mapY: 28,
    openHours: 'Mon - Sun: 6:00 AM - 8:00 PM',
    isOpenNow: true,
    acceptedMaterials: ['PET Plastic Bottles', 'Pure Water Sachets', 'Aluminium Cans', 'Scrap Metals'],
    bonusEcoPointsPercent: 20,
    fullnessPercent: 62,
    contactPhone: '+233 20 445 8891',
    verifiedByEPA: true,
    hasInstantCashier: true,
    description: 'High-volume community recycling hub equipped with heavy-duty digital scales and on-site cash payout.'
  },
  {
    id: 'hub-eastlegon-smartbin',
    name: 'East Legon 24/7 Solar Smart Bin',
    category: 'SMART_BIN',
    address: 'Lagos Avenue (Adjacent to A&C Mall), East Legon',
    zone: 'East Legon, Accra',
    latitude: 5.6372,
    longitude: -0.1583,
    mapX: 62,
    mapY: 46,
    openHours: '24 Hours / 7 Days Automated',
    isOpenNow: true,
    acceptedMaterials: ['PET Plastic Bottles', 'Aluminium Cans'],
    bonusEcoPointsPercent: 10,
    fullnessPercent: 45,
    contactPhone: '+233 30 223 9090',
    verifiedByEPA: true,
    hasInstantCashier: false,
    description: 'Autonomous AI-powered reverse vending container. Scans bar-coded containers and credits EcoPoints immediately.'
  },
  {
    id: 'hub-epa-ministries',
    name: 'EPA Ghana National HQ Drop Station',
    category: 'EPA_DEPOT',
    address: 'Ministries Area, Starlets 91 Way, Accra Central',
    zone: 'Ministries District, Accra',
    latitude: 5.5502,
    longitude: -0.1983,
    mapX: 42,
    mapY: 74,
    openHours: 'Mon - Fri: 8:00 AM - 5:00 PM',
    isOpenNow: true,
    acceptedMaterials: ['PET Plastic Bottles', 'E-Waste / Batteries', 'Industrial Polymers', 'Aluminium Cans'],
    bonusEcoPointsPercent: 25,
    fullnessPercent: 24,
    contactPhone: '+233 24 000 1122',
    verifiedByEPA: true,
    hasInstantCashier: true,
    description: 'Official EPA Ghana certified sorting facility with certified hazardous and electronic waste collection.'
  },
  {
    id: 'hub-osu-oxford',
    name: 'Osu Oxford Street Green Hub',
    category: 'BUYBACK_CENTER',
    address: 'Near Danquah Circle, Oxford Street, Osu',
    zone: 'Osu Klottey, Accra',
    latitude: 5.5560,
    longitude: -0.1830,
    mapX: 50,
    mapY: 68,
    openHours: 'Mon - Sat: 8:00 AM - 8:00 PM',
    isOpenNow: true,
    acceptedMaterials: ['PET Plastic Bottles', 'Glass Containers', 'Aluminium Cans'],
    bonusEcoPointsPercent: 15,
    fullnessPercent: 55,
    contactPhone: '+233 24 555 8900',
    verifiedByEPA: true,
    hasInstantCashier: true,
    description: 'Urban recycling outpost serving commercial businesses, cafes, restaurants, and local residents.'
  },
  {
    id: 'hub-knust-kejetia',
    name: 'KNUST Tech Junction Eco-Depot',
    category: 'CAMPUS_HUB',
    address: 'Commercial Area & Unity Hall Junction, KNUST',
    zone: 'Kumasi Metropolitan, Ashanti',
    latitude: 6.6745,
    longitude: -1.5716,
    mapX: 25,
    mapY: 20,
    openHours: 'Mon - Sun: 7:00 AM - 9:00 PM',
    isOpenNow: true,
    acceptedMaterials: ['PET Plastic Bottles', 'HDPE Jugs', 'Aluminium Cans', 'Paper / Cardboard'],
    bonusEcoPointsPercent: 15,
    fullnessPercent: 40,
    contactPhone: '+233 55 123 9081',
    verifiedByEPA: true,
    hasInstantCashier: true,
    description: 'Ashanti regional hub supporting university students, hall scrap drives, and municipal circularity.'
  },
  {
    id: 'hub-tema-industrial',
    name: 'Tema Harbour Circular Logistics Center',
    category: 'EPA_DEPOT',
    address: 'Community 1 Industrial Triangle, Tema',
    zone: 'Tema Metropolitan, Greater Accra',
    latitude: 5.6698,
    longitude: 0.0166,
    mapX: 82,
    mapY: 52,
    openHours: 'Mon - Sat: 6:00 AM - 6:00 PM',
    isOpenNow: true,
    acceptedMaterials: ['Bulk Polymers (PET/HDPE)', 'Industrial Steel / Metal', 'E-Waste', 'Cardboard Bales'],
    bonusEcoPointsPercent: 30,
    fullnessPercent: 71,
    contactPhone: '+233 30 223 9090',
    verifiedByEPA: true,
    hasInstantCashier: true,
    description: 'Industrial-grade processing center accepting residential drop-offs and bulk agent collections.'
  },
  {
    id: 'hub-ashesi-berekuso',
    name: 'Ashesi Solar Smart Bin Cluster',
    category: 'SMART_BIN',
    address: 'Ashesi University Campus Green, 1 University Avenue, Berekuso',
    zone: 'Berekuso, Eastern Region',
    latitude: 5.7597,
    longitude: -0.2198,
    mapX: 36,
    mapY: 15,
    openHours: '24 Hours / 7 Days Automated',
    isOpenNow: true,
    acceptedMaterials: ['PET Plastic Bottles', 'Aluminium Cans', 'Paper / Notebooks'],
    bonusEcoPointsPercent: 12,
    fullnessPercent: 18,
    contactPhone: '+233 24 888 1234',
    verifiedByEPA: true,
    hasInstantCashier: false,
    description: 'High-tech AI sorting bins powered 100% by solar micro-grid on Ashesi hilltop campus.'
  }
];

export const NearbyDropOffMap: React.FC = () => {
  const { currentUser, addToast, triggerSimulatedPush } = useEcoSort();

  // Real-time GPS Location Hook
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

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('ALL');
  const [selectedHub, setSelectedHub] = useState<DropOffPoint | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGpsModalOpen, setIsGpsModalOpen] = useState<boolean>(false);

  // Default reference coordinate (UG Legon, Accra) if GPS is pending or not yet resolved
  const currentLatitude = gpsCoords ? gpsCoords.latitude : 5.6508;
  const currentLongitude = gpsCoords ? gpsCoords.longitude : -0.1870;

  // Real-time dynamic distance calculation for all hubs
  const dynamicHubs: DropOffPoint[] = useMemo(() => {
    return AUTHORIZED_DROP_OFF_POINTS_DATA.map(hub => {
      const distanceKm = calculateHaversineDistanceKm(
        currentLatitude,
        currentLongitude,
        hub.latitude,
        hub.longitude
      );
      return {
        ...hub,
        distanceKm,
      };
    });
  }, [currentLatitude, currentLongitude]);

  // Filtered drop-off locations sorted by dynamic live distance
  const filteredHubs = useMemo(() => {
    return dynamicHubs.filter((hub) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        hub.name.toLowerCase().includes(query) ||
        hub.zone.toLowerCase().includes(query) ||
        hub.address.toLowerCase().includes(query);

      const matchesCategory = 
        selectedCategory === 'ALL' || hub.category === selectedCategory;

      const matchesMaterial = 
        selectedMaterial === 'ALL' || 
        hub.acceptedMaterials.some(m => m.toLowerCase().includes(selectedMaterial.toLowerCase()));

      return matchesSearch && matchesCategory && matchesMaterial;
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [dynamicHubs, searchQuery, selectedCategory, selectedMaterial]);

  // Set default selected hub to the closest one once loaded
  useEffect(() => {
    if (!selectedHub && filteredHubs.length > 0) {
      setSelectedHub(filteredHubs[0]);
    }
  }, [filteredHubs, selectedHub]);

  // Calculate live user SVG position on canvas based on actual GPS
  const liveUserSvgCoords = useMemo(() => {
    return projectGpsToSvgCanvas(currentLatitude, currentLongitude);
  }, [currentLatitude, currentLongitude]);

  const handleDirectionsClick = (hub: DropOffPoint) => {
    const url = GpsService.getGoogleMapsDirectionsUrl(
      hub.latitude,
      hub.longitude,
      currentLatitude,
      currentLongitude
    );

    addToast({
      title: `GPS Routing to ${hub.name} 🗺️`,
      message: `Navigating from your live position (${currentLatitude.toFixed(4)}°, ${currentLongitude.toFixed(4)}°) • ${hub.distanceKm} km away. Opening Google Maps navigation...`,
      type: 'success',
      duration: 4500
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareLocation = (hub: DropOffPoint) => {
    const text = `Check out this authorized recycling drop-off hub in Ghana: ${hub.name} (${hub.address}). Distance: ${hub.distanceKm} km. Bonus ${hub.bonusEcoPointsPercent}% EcoPoints available!`;
    navigator.clipboard?.writeText(text);
    setCopiedId(hub.id);
    setTimeout(() => setCopiedId(null), 2500);
    addToast({
      title: 'Location Copied',
      message: 'Drop-off point details copied to clipboard.',
      type: 'info'
    });
  };

  const getCategoryBadge = (category: DropOffPoint['category']) => {
    switch (category) {
      case 'CAMPUS_HUB':
        return { label: 'Campus Hub', bg: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
      case 'EPA_DEPOT':
        return { label: 'EPA Certified Depot', bg: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'SMART_BIN':
        return { label: '24/7 Smart Bin', bg: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
      case 'BUYBACK_CENTER':
        return { label: 'Cash Buyback Depot', bg: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      default:
        return { label: 'Drop Point', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300' };
    }
  };

  const activeHub = selectedHub || filteredHubs[0] || dynamicHubs[0];

  return (
    <div className={`space-y-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-slate-900 p-6 overflow-y-auto' : ''}`}>
      
      {/* Top Banner Card with Real-Time GPS HUD */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 rounded-3xl p-6 md:p-8 text-white border border-blue-600/40 shadow-xl relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest border flex items-center gap-1.5 ${
                gpsStatus === 'LIVE_TRACKING'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-sm shadow-emerald-500/20'
                  : gpsTelemetry.isOfflineCached
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  : gpsStatus === 'LOCATING'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${gpsStatus === 'LIVE_TRACKING' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
                {gpsStatus === 'LIVE_TRACKING' 
                  ? '🛰️ Real-Time GPS Tracking Active' 
                  : gpsTelemetry.isOfflineCached 
                  ? '💾 IndexedDB Offline Map Active' 
                  : gpsStatus === 'LOCATING' 
                  ? '🛰️ Acquiring GPS Fix...' 
                  : '🛰️ GPS Standby'}
              </span>
              <span className="text-xs text-blue-200 font-medium flex items-center gap-1">
                EPA Ghana Grid • <span className="text-emerald-300 font-bold">Offline Tiles Cached</span>
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Authorized Recycling Drop-Off Hubs
            </h2>
            
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Track authorized recycling centers in real time with continuous satellite GPS distance calculations. Drop off your sorted items for automated digital tare weight verification and instant Mobile Money payouts.
            </p>
          </div>

          {/* User Live Location & Telemetry Pill */}
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-blue-500/30 shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-md transition-all ${
                gpsStatus === 'LIVE_TRACKING'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-blue-500 text-white'
              }`}>
                <Radio className={`w-6 h-6 ${gpsStatus === 'LIVE_TRACKING' ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider block">
                  {gpsStatus === 'LIVE_TRACKING' ? 'Live Satellite Position' : 'Current GPS Anchor'}
                </span>
                <span className="text-xs font-black text-white block max-w-[200px] truncate">
                  {gpsTelemetry.closestZoneName}
                </span>
                <span className="text-[11px] text-emerald-300 font-mono font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 
                  Nearest: {filteredHubs[0]?.name.split(' ')[0]} ({filteredHubs[0]?.distanceKm} km)
                </span>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-800 sm:pl-3">
              <button
                type="button"
                onClick={() => setIsGpsModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>GPS Telemetry</span>
              </button>
              <button
                type="button"
                onClick={requestCurrentLocation}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                title="Recalculate GPS fix"
              >
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                <span>Fix GPS</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search center, university, or zone..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category & Material Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Hub Types</option>
            <option value="CAMPUS_HUB">🎓 Campus Hubs</option>
            <option value="EPA_DEPOT">🛡️ EPA Certified Depots</option>
            <option value="SMART_BIN">⚡ 24/7 Smart Bins</option>
            <option value="BUYBACK_CENTER">💰 Cash Buyback Centers</option>
          </select>

          <select
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Recyclables</option>
            <option value="PET Plastic">PET Plastics</option>
            <option value="Aluminium">Aluminium Cans</option>
            <option value="E-Waste">E-Waste & Batteries</option>
            <option value="Paper">Paper & Cardboard</option>
          </select>

          {(searchQuery || selectedCategory !== 'ALL' || selectedMaterial !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedMaterial('ALL');
              }}
              className="px-2.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors whitespace-nowrap cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Visual Map Canvas + List Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Columns: Interactive Vector Map Canvas */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden relative flex flex-col">
          
          {/* Map Header Toolbar with Live GPS controls */}
          <div className="bg-slate-900/90 backdrop-blur-md px-5 py-3.5 border-b border-slate-800 flex items-center justify-between z-20 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${gpsStatus === 'LIVE_TRACKING' ? 'bg-emerald-400 animate-ping' : 'bg-blue-400'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Live Geographic Radar Map (Ghana Region)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={requestCurrentLocation}
                className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Recenter to Live GPS position"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Center GPS</span>
              </button>

              <button
                type="button"
                onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 1.8))}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                title="Zoom in"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.8))}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                title="Zoom out"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setMapZoom(1)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition-colors cursor-pointer"
                title="Reset zoom"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Toggle full screen"
              >
                {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Interactive Map Visual Stage */}
          <div className="relative w-full h-[420px] sm:h-[490px] bg-gradient-to-b from-slate-950 via-[#0B132B] to-slate-950 overflow-hidden flex items-center justify-center">
            
            {/* Ambient Map Grid and Terrain Contours */}
            <div 
              className="absolute inset-0 transition-transform duration-300"
              style={{ transform: `scale(${mapZoom})` }}
            >
              {/* SVG Vector Stylized Map of Southern Ghana / Accra Coastal Arc */}
              <svg 
                className="w-full h-full opacity-40" 
                viewBox="0 0 1000 650" 
                preserveAspectRatio="none"
              >
                {/* Coastal Line & Gulf of Guinea */}
                <path 
                  d="M0,520 Q200,480 400,530 T750,490 T1000,540 L1000,650 L0,650 Z" 
                  fill="#0369a1" 
                  opacity="0.25" 
                />
                <path 
                  d="M0,520 Q200,480 400,530 T750,490 T1000,540" 
                  stroke="#38bdf8" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeDasharray="4,4" 
                />

                {/* Major Highway Corridors (N1, N6, N4 Accra-Kumasi Motorway) */}
                <path d="M480,260 L480,500" stroke="#334155" strokeWidth="3" fill="none" />
                <path d="M220,180 Q350,300 480,380" stroke="#334155" strokeWidth="2.5" fill="none" />
                <path d="M480,380 L780,480" stroke="#334155" strokeWidth="3" fill="none" />
                <path d="M480,380 L620,440" stroke="#475569" strokeWidth="2" fill="none" />

                {/* Region Rings */}
                <circle cx="480" cy="380" r="160" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeDasharray="6,6" />
                <circle cx="480" cy="380" r="90" stroke="#3b82f6" strokeWidth="1" opacity="0.3" fill="none" />
                
                {/* Regional Labels */}
                <text x="440" y="320" fill="#64748b" fontSize="12" fontWeight="bold" letterSpacing="2">GREATER ACCRA</text>
                <text x="180" y="140" fill="#64748b" fontSize="12" fontWeight="bold" letterSpacing="2">ASHANTI REGION</text>
                <text x="760" y="440" fill="#64748b" fontSize="12" fontWeight="bold" letterSpacing="2">TEMA METRO</text>
                <text x="450" y="600" fill="#0284c7" fontSize="13" fontWeight="bold" letterSpacing="3">GULF OF GUINEA</text>
              </svg>

              {/* User Live GPS Position Pin with Dynamic Coordinates & Accuracy Bubble */}
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-700 pointer-events-none"
                style={{ left: `${liveUserSvgCoords.x}%`, top: `${liveUserSvgCoords.y}%` }}
              >
                <div className="relative flex items-center justify-center">
                  {/* Accuracy radius ring */}
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-400/40 animate-ping absolute" />
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white shadow-xl">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="absolute top-9 bg-blue-600 text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md whitespace-nowrap flex items-center gap-1 border border-blue-300/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                    Live GPS Location
                  </div>
                </div>
              </div>

              {/* Drop-off Hub Markers */}
              {filteredHubs.map((hub) => {
                const isSelected = activeHub.id === hub.id;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => setSelectedHub(hub)}
                    style={{ left: `${hub.mapX}%`, top: `${hub.mapY}%` }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300 cursor-pointer group ${
                      isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                    }`}
                  >
                    <div className="relative flex flex-col items-center">
                      {/* Pulse effect for selected pin */}
                      {isSelected && (
                        <div className="w-10 h-10 rounded-full bg-emerald-400/30 animate-ping absolute -top-1" />
                      )}

                      {/* Pin Icon */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all shadow-lg ${
                        isSelected 
                          ? 'bg-emerald-500 text-white border-white ring-4 ring-emerald-400/40' 
                          : hub.category === 'CAMPUS_HUB'
                            ? 'bg-indigo-600 text-white border-indigo-400'
                            : hub.category === 'EPA_DEPOT'
                              ? 'bg-emerald-600 text-white border-emerald-400'
                              : hub.category === 'SMART_BIN'
                                ? 'bg-blue-600 text-white border-blue-400'
                                : 'bg-amber-600 text-white border-amber-400'
                      }`}>
                        {hub.category === 'CAMPUS_HUB' && <Building2 className="w-4 h-4" />}
                        {hub.category === 'EPA_DEPOT' && <ShieldCheck className="w-4 h-4" />}
                        {hub.category === 'SMART_BIN' && <Zap className="w-4 h-4" />}
                        {hub.category === 'BUYBACK_CENTER' && <Award className="w-4 h-4" />}
                      </div>

                      {/* Mini Label badge under pin */}
                      <div className={`mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap shadow-md transition-all ${
                        isSelected 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-slate-900/90 text-slate-300 border border-slate-700'
                      }`}>
                        {hub.name.split(' ')[0]} ({hub.distanceKm}km)
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Floating Active Selected Hub Overlay Card on Map */}
            {activeHub && (
              <div className="absolute bottom-4 left-4 right-4 z-30 bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-700 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        +{activeHub.bonusEcoPointsPercent}% BONUS POINTS
                      </span>
                      <span className="text-[10px] font-mono text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-500/30">
                        📍 {activeHub.distanceKm} km from your GPS
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {activeHub.openHours}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-white">
                      {activeHub.name}
                    </h4>
                    <p className="text-xs text-slate-300 truncate max-w-lg">
                      📍 {activeHub.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        triggerSimulatedPush({
                          id: `push-surge-${activeHub.id}-${Date.now()}`,
                          category: 'HUB_SURGE',
                          title: `⚡ High Volume Alert: ${activeHub.name}`,
                          body: `${activeHub.name} is currently experiencing a high-volume drop-off surge (91% capacity). Earn an extra +${activeHub.bonusEcoPointsPercent + 10}% boosted EcoPoints on deposits today!`,
                          hubId: activeHub.id,
                          hubName: activeHub.name,
                          hubLocation: activeHub.address,
                          surgeCapacityPercent: 91,
                          bonusEcoPointsPercent: activeHub.bonusEcoPointsPercent + 10,
                          actionLabel: '📍 View Directions & Bonus',
                          actionTargetView: 'user-dashboard',
                          actionTab: 'NEARBY_MAP',
                          timestamp: 'Just now',
                          timestampMs: Date.now()
                        });
                      }}
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 whitespace-nowrap cursor-pointer"
                      title="Simulate push alert when this hub experiences high volume capacity"
                    >
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      Surge Alert
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDirectionsClick(activeHub)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30 whitespace-nowrap cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      GPS Route
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShareLocation(activeHub)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {copiedId === activeHub.id ? 'Copied!' : 'Share Hub'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Map Footer Info with Live GPS status */}
          <div className="bg-slate-900 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" /> Campus Hub</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> EPA Certified Depot</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" /> 24/7 Smart Bin</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> Cash Buyback</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-slate-400">
              <span>GPS: {currentLatitude.toFixed(4)}°N, {currentLongitude.toFixed(4)}°W</span>
              {gpsCoords && <span className="text-emerald-400">±{gpsCoords.accuracyMeters}m</span>}
            </div>
          </div>

        </div>

        {/* Right 5 Columns: Drop-off Points List & Details */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Nearby Verified Depots ({filteredHubs.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sorted by real-time GPS distance from your position
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setIsGpsModalOpen(true)}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              Telemetry
            </button>
          </div>

          {/* List of Hub Cards */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredHubs.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Centers Found</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Try adjusting your search query or selecting "All Hub Types" in the filters.
                </p>
              </div>
            ) : (
              filteredHubs.map((hub) => {
                const isSelected = activeHub.id === hub.id;
                const badge = getCategoryBadge(hub.category);

                return (
                  <div
                    key={hub.id}
                    onClick={() => setSelectedHub(hub)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            +{hub.bonusEcoPointsPercent}% PTS
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {hub.name}
                        </h4>

                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                          {hub.address}
                        </p>
                      </div>

                      {/* Distance Chip */}
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono block">
                          {hub.distanceKm} km
                        </span>
                        <span className="text-[10px] text-slate-400">from GPS</span>
                      </div>
                    </div>

                    {/* Accepted Materials Chips */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {hub.acceptedMaterials.slice(0, 2).map((mat, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                            {mat}
                          </span>
                        ))}
                        {hub.acceptedMaterials.length > 2 && (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            +{hub.acceptedMaterials.length - 2} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {hub.hasInstantCashier && (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                            <Zap className="w-3 h-3 fill-amber-500 text-amber-500" /> MoMo Cashier
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDirectionsClick(hub);
                          }}
                          className="text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center hover:underline cursor-pointer"
                        >
                          Navigate <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Guide Card */}
          <div className="bg-gradient-to-r from-emerald-950/30 to-blue-950/30 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block">
              💡 How Self Drop-Off Works
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-300">
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-bold text-white block mb-0.5">1. Bring Waste</span>
                <span>Sorted plastics or cans</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-bold text-white block mb-0.5">2. Scan Scale</span>
                <span>Digital tare reading</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-bold text-white block mb-0.5">3. Instant MoMo</span>
                <span>Direct wallet credit</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Real-time GPS Telemetry Modal */}
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
