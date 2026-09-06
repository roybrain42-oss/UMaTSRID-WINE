import React, { useState, useMemo } from 'react';
import { 
  Navigation, 
  MapPin, 
  Truck, 
  Zap, 
  TrendingDown, 
  Clock, 
  Scale, 
  Leaf, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  ExternalLink, 
  Copy, 
  Send, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  ChevronRight, 
  Fuel, 
  Radio, 
  Battery, 
  Cpu,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { SmartDustBin } from '../../types';
import { 
  GHANA_FLEET_DEPOTS, 
  FLEET_VEHICLES, 
  calculateOptimizedRoute, 
  calculateBinUrgency,
  OptimizedRoutePlan,
  FleetDepot,
  CollectionVehicle,
  RouteWaypoint
} from '../../services/routeOptimizerService';
import { projectGpsToSvgCanvas } from '../../services/gpsService';
import { soundEffects } from '../../utils/audioChime';

type RouteStrategy = 'URGENT_FIRST' | 'PREDICTIVE_SWEEP' | 'FULL_MUNICIPAL' | 'CUSTOM';

export const AdminBinRouteOptimizer: React.FC = () => {
  const { 
    smartBins, 
    allUsers, 
    triggerSmartBinEmptying, 
    triggerSimulatedPush,
    addToast,
    triggerCelebration
  } = useEcoSort();

  // Route Configuration State
  const [selectedDepotId, setSelectedDepotId] = useState<string>(GHANA_FLEET_DEPOTS[0].id);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(FLEET_VEHICLES[1].id);
  const [strategy, setStrategy] = useState<RouteStrategy>('URGENT_FIRST');
  const [selectedBinIds, setSelectedBinIds] = useState<string[]>([]);
  const [assignedAgentId, setAssignedAgentId] = useState<string>('');
  
  // UI View States
  const [activeWaypoint, setActiveWaypoint] = useState<RouteWaypoint | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [isSimulatingRoute, setIsSimulatingRoute] = useState<boolean>(false);

  // Available certified collectors
  const availableAgents = useMemo(() => {
    return allUsers.filter(u => u.role === 'COLLECTION_AGENT' || u.role === 'ADMIN');
  }, [allUsers]);

  // Set default agent if none selected
  React.useEffect(() => {
    if (!assignedAgentId && availableAgents.length > 0) {
      setAssignedAgentId(availableAgents[0].id);
    }
  }, [availableAgents, assignedAgentId]);

  // Active Depot & Vehicle objects
  const selectedDepot = useMemo(() => {
    return GHANA_FLEET_DEPOTS.find(d => d.id === selectedDepotId) || GHANA_FLEET_DEPOTS[0];
  }, [selectedDepotId]);

  const selectedVehicle = useMemo(() => {
    return FLEET_VEHICLES.find(v => v.id === selectedVehicleId) || FLEET_VEHICLES[1];
  }, [selectedVehicleId]);

  // Filter bins based on selected Strategy
  const binsToOptimize = useMemo(() => {
    if (strategy === 'URGENT_FIRST') {
      // Prioritize bins with fill >= 70% or amber/red LED
      const urgent = smartBins.filter(b => b.overallFillLevel >= 70 || b.ledIndicator?.colorName === 'RED' || b.ledIndicator?.colorName === 'AMBER');
      return urgent.length > 0 ? urgent : smartBins; // Fallback to all if none critical
    } else if (strategy === 'PREDICTIVE_SWEEP') {
      // Bins with fill >= 40%
      const predictive = smartBins.filter(b => b.overallFillLevel >= 40);
      return predictive.length > 0 ? predictive : smartBins;
    } else if (strategy === 'CUSTOM') {
      return smartBins.filter(b => selectedBinIds.includes(b.id));
    } else {
      // FULL_MUNICIPAL
      return smartBins;
    }
  }, [smartBins, strategy, selectedBinIds]);

  // Initialize custom selection with all bin IDs
  React.useEffect(() => {
    if (selectedBinIds.length === 0 && smartBins.length > 0) {
      setSelectedBinIds(smartBins.map(b => b.id));
    }
  }, [smartBins, selectedBinIds.length]);

  // Calculate algorithmic optimized route
  const routePlan: OptimizedRoutePlan = useMemo(() => {
    return calculateOptimizedRoute({
      depot: selectedDepot,
      bins: binsToOptimize,
      vehicle: selectedVehicle,
      strategy,
    });
  }, [selectedDepot, binsToOptimize, selectedVehicle, strategy]);

  // Toggle individual bin selection in custom mode
  const handleToggleBin = (binId: string) => {
    setSelectedBinIds(prev => 
      prev.includes(binId) ? prev.filter(id => id !== binId) : [...prev, binId]
    );
  };

  // Copy Route Manifest to clipboard for WhatsApp / SMS fleet dispatch
  const handleCopyManifest = () => {
    navigator.clipboard.writeText(routePlan.manifestSummary);
    soundEffects.play('pop');
    addToast({
      title: '📋 Route Manifest Copied!',
      message: 'Turn-by-turn itinerary copied to clipboard. Ready to paste into driver SMS or WhatsApp dispatch.',
      type: 'success',
      duration: 4000
    });
  };

  // Open Google Maps multi-stop GPS directions
  const handleOpenGoogleMaps = () => {
    window.open(routePlan.googleMapsDirectionsUrl, '_blank', 'noopener,noreferrer');
  };

  // Dispatch route to selected collection driver
  const handleDispatchRoute = () => {
    if (routePlan.waypoints.length === 0) {
      addToast({
        title: 'No Waypoints',
        message: 'Please select at least one smart bin to formulate a collection route.',
        type: 'warning'
      });
      return;
    }

    setIsDispatching(true);
    const agent = availableAgents.find(a => a.id === assignedAgentId) || availableAgents[0];

    setTimeout(() => {
      setIsDispatching(false);
      soundEffects.playMilestoneFanfare();
      triggerCelebration();

      // Dispatch simulated push alert
      triggerSimulatedPush({
        id: `push-dispatch-${Date.now()}`,
        category: 'AGENT_PICKUP',
        title: `🚛 Route Dispatched to ${agent?.name || 'Fleet Driver'}!`,
        body: `Optimized ${routePlan.totalDistanceKm} km route (${routePlan.waypoints.length} Smart Bins, ${routePlan.totalPayloadWeightKg} kg) assigned with estimated ${routePlan.totalEstimatedTimeMinutes} mins completion time.`,
        timestamp: 'Just now',
        timestampMs: Date.now(),
        actionLabel: 'View Live Route',
        actionTargetView: 'admin',
        iconType: 'truck'
      });

      addToast({
        title: `🚀 Route Dispatched to ${agent?.name || 'Driver'}`,
        message: `Assigned ${routePlan.waypoints.length} stops from ${selectedDepot.name}. Push notification broadcasted to fleet radio.`,
        type: 'success',
        duration: 5000
      });
    }, 800);
  };

  // Simulate automated driver completing the route and emptying all bins
  const handleSimulateRouteCompletion = () => {
    if (routePlan.waypoints.length === 0) return;

    setIsSimulatingRoute(true);
    soundEffects.play('pop');

    let delay = 0;
    routePlan.waypoints.forEach((wp, idx) => {
      setTimeout(() => {
        triggerSmartBinEmptying(wp.bin.id);
        if (idx === routePlan.waypoints.length - 1) {
          setIsSimulatingRoute(false);
          triggerCelebration();
          soundEffects.playMilestoneFanfare();
          addToast({
            title: '🏁 Pickup Route Completed!',
            message: `All ${routePlan.waypoints.length} smart bins successfully emptied. ${routePlan.totalPayloadWeightKg} kg waste recovered.`,
            type: 'success',
            duration: 6000
          });
        }
      }, delay);
      delay += 400;
    });
  };

  // SVG Depot coordinates
  const depotSvg = useMemo(() => {
    return projectGpsToSvgCanvas(selectedDepot.coordinates.lat, selectedDepot.coordinates.lng);
  }, [selectedDepot]);

  // Construct SVG Path string connecting Depot -> Waypoints -> Depot
  const svgPathData = useMemo(() => {
    if (routePlan.waypoints.length === 0) return '';
    let path = `M ${depotSvg.x} ${depotSvg.y}`;
    routePlan.waypoints.forEach(wp => {
      path += ` L ${wp.svgCoords.x} ${wp.svgCoords.y}`;
    });
    // Loop back to depot
    path += ` L ${depotSvg.x} ${depotSvg.y}`;
    return path;
  }, [depotSvg, routePlan.waypoints]);

  return (
    <div className="space-y-6">
      
      {/* Top Header & Strategy Control */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 md:p-8 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-400/30">
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              AI Geospatial Routing Engine • EPA Ghana Fleet Dispatch
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Smart Bin Route Optimizer</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-normal">
                TSP 2-Opt Shortest Path
              </span>
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
              Analyzes real-time IoT bin fill levels, LED indicators, and GPS coordinates to compute the most fuel-efficient pickup itinerary for municipal waste collection fleets.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-start lg:justify-end">
            <button
              onClick={handleCopyManifest}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Copy WhatsApp-ready route manifest with stops and ETAs"
            >
              <Copy className="w-4 h-4 text-emerald-400" />
              <span>Copy Manifest</span>
            </button>

            <button
              onClick={handleOpenGoogleMaps}
              className="px-3.5 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-blue-200 text-xs font-bold border border-blue-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Open Google Maps multi-stop navigation"
            >
              <ExternalLink className="w-4 h-4 text-blue-400" />
              <span>Google Maps GPS</span>
            </button>

            <button
              onClick={handleDispatchRoute}
              disabled={isDispatching || routePlan.waypoints.length === 0}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isDispatching ? (
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <Send className="w-4 h-4 text-slate-950" />
              )}
              <span>Dispatch Route</span>
            </button>
          </div>
        </div>

        {/* Configuration Row: Strategy, Depot, Vehicle, Driver */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          
          {/* Strategy Selector */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <label className="text-[10px] text-slate-400 uppercase font-black block mb-1.5 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Route Strategy
            </label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as RouteStrategy)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="URGENT_FIRST">🚨 Critical & High Fill First (≥70%)</option>
              <option value="PREDICTIVE_SWEEP">🔮 Predictive Sweep (≥40% Fill)</option>
              <option value="FULL_MUNICIPAL">🌐 Full Municipal Grid (All Bins)</option>
              <option value="CUSTOM">✏️ Custom Selection ({selectedBinIds.length} Bins)</option>
            </select>
          </div>

          {/* Depot Selector */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <label className="text-[10px] text-slate-400 uppercase font-black block mb-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              Starting Depot Hub
            </label>
            <select
              value={selectedDepotId}
              onChange={(e) => setSelectedDepotId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {GHANA_FLEET_DEPOTS.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.district})
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Selector */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <label className="text-[10px] text-slate-400 uppercase font-black block mb-1.5 flex items-center gap-1">
              <Truck className="w-3 h-3 text-blue-400" />
              Fleet Vehicle
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {FLEET_VEHICLES.map(v => (
                <option key={v.id} value={v.id}>
                  {v.icon} {v.name} (Max {v.maxPayloadKg} kg)
                </option>
              ))}
            </select>
          </div>

          {/* Assignee Collector */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <label className="text-[10px] text-slate-400 uppercase font-black block mb-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              Assigned Fleet Driver
            </label>
            <select
              value={assignedAgentId}
              onChange={(e) => setAssignedAgentId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {availableAgents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.organization || a.community || 'Fleet Driver'})
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* KPI Optimization Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        
        {/* Total Distance & Efficiency Gain */}
        <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Total Route Distance</span>
            <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              -{routePlan.efficiencyGainPercent}% Saved
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {routePlan.totalDistanceKm}
            </span>
            <span className="text-xs font-bold text-slate-500">km</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            vs {routePlan.unoptimizedDistanceKm} km unoptimized ({routePlan.distanceSavedKm} km cut)
          </p>
        </div>

        {/* Estimated Shift Duration */}
        <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Est. Shift Duration</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {routePlan.totalEstimatedTimeMinutes}
            </span>
            <span className="text-xs font-bold text-slate-500">mins</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {routePlan.totalTravelTimeMinutes}m transit • {routePlan.totalServiceTimeMinutes}m emptying
          </p>
        </div>

        {/* Total Payload Volume & Capacity */}
        <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Waste Harvest</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
              routePlan.isVehicleOverloaded 
                ? 'bg-red-500/10 text-red-600 border-red-500/30' 
                : 'bg-blue-500/10 text-blue-600 border-blue-500/30'
            }`}>
              {routePlan.vehicleCapacityUtilizationPercent}% Payload
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {routePlan.totalPayloadWeightKg}
            </span>
            <span className="text-xs font-bold text-slate-500">/ {selectedVehicle.maxPayloadKg} kg</span>
          </div>
          {/* Capacity Progress Bar */}
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                routePlan.isVehicleOverloaded ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, routePlan.vehicleCapacityUtilizationPercent)}%` }}
            />
          </div>
        </div>

        {/* Environmental & Fuel Savings */}
        <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Eco Savings</span>
            <Leaf className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {routePlan.co2EmissionsSavedKg}
            </span>
            <span className="text-xs font-bold text-slate-500">kg CO₂e</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {routePlan.fuelSavedLiters} L diesel avoided via shortest tour
          </p>
        </div>

      </div>

      {/* Main Content Grid: Interactive 2D Map & Turn-by-Turn Waypoints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 Cols): Interactive Route Map */}
        <div className={`${isMapExpanded ? 'lg:col-span-12' : 'lg:col-span-7'} bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4`}>
          
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-500" />
                Live Geospatial Route Visualizer
              </h3>
              <p className="text-xs text-slate-500">
                Interactive Ghanaian GPS grid with directional route path and pulsing Smart Bin LED indicators.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMapExpanded(!isMapExpanded)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                title={isMapExpanded ? 'Collapse Map' : 'Expand Fullscreen Map'}
              >
                {isMapExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 2D SVG GPS Map Canvas */}
          <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center select-none">
            
            {/* Grid Mesh Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
            
            {/* Gulf of Guinea & Coastline aesthetic subtle glow */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-950/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-600 uppercase tracking-widest pointer-events-none">
              Gulf of Guinea Coastline • Greater Accra & Central Grid
            </div>

            {/* SVG Elements: Polyline Route & Waypoints */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full absolute inset-0 preserve-3d"
            >
              {/* Outer Route Halo */}
              {svgPathData && (
                <path
                  d={svgPathData}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="1.8"
                  strokeOpacity="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Animated Directional Route Line */}
              {svgPathData && (
                <path
                  d={svgPathData}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="0.8"
                  strokeDasharray="2, 1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-pulse"
                />
              )}

              {/* Central Starting Depot Marker */}
              <g 
                transform={`translate(${depotSvg.x}, ${depotSvg.y})`}
                className="cursor-pointer group"
              >
                {/* Radar pulse ring */}
                <circle r="4.5" fill="none" stroke="#3B82F6" strokeWidth="0.5" className="animate-ping opacity-40" />
                <circle r="3" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="0.7" />
                {/* Depot Icon */}
                <text x="0" y="1" textAnchor="middle" fontSize="2.8" fill="#FFFFFF" fontWeight="bold">🏢</text>
              </g>

              {/* Waypoint Markers on Bins */}
              {routePlan.waypoints.map((wp) => {
                const isSelected = activeWaypoint?.bin.id === wp.bin.id;
                const isCritical = wp.urgencyLevel === 'CRITICAL';
                const isHigh = wp.urgencyLevel === 'HIGH';
                const colorHex = wp.bin.ledIndicator?.colorHex || (isCritical ? '#EF4444' : isHigh ? '#F59E0B' : '#10B981');

                return (
                  <g
                    key={wp.bin.id}
                    transform={`translate(${wp.svgCoords.x}, ${wp.svgCoords.y})`}
                    onClick={() => setActiveWaypoint(wp)}
                    className="cursor-pointer group"
                  >
                    {/* Glowing LED Halo */}
                    <circle
                      r={isSelected ? '4.5' : '3.2'}
                      fill={colorHex}
                      fillOpacity={isSelected ? '0.4' : '0.2'}
                      stroke={colorHex}
                      strokeWidth={isSelected ? '0.8' : '0.4'}
                      className={isCritical ? 'animate-ping' : ''}
                    />

                    {/* Waypoint Base Pin */}
                    <circle
                      r="2.2"
                      fill="#0F172A"
                      stroke={colorHex}
                      strokeWidth="0.6"
                    />

                    {/* Order Number (#1, #2, #3...) */}
                    <text
                      x="0"
                      y="0.8"
                      textAnchor="middle"
                      fontSize="1.8"
                      fill="#FFFFFF"
                      fontWeight="900"
                      fontFamily="monospace"
                    >
                      {wp.orderIndex}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend Overlay */}
            <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[10px] space-y-1.5 pointer-events-auto shadow-md">
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white/50" />
                <span>Depot: {selectedDepot.name.split(' ')[0]}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Critical Bins (≥75% Fill)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>High Fill (50–74%)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Regular (&lt;50%)</span>
              </div>
            </div>

            {/* Active Waypoint Floating Details Card */}
            {activeWaypoint && (
              <div className="absolute bottom-3 right-3 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 text-white max-w-xs shadow-2xl z-20 animate-in fade-in zoom-in-95">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-lg bg-emerald-500 text-slate-950 font-black font-mono text-[10px] flex items-center justify-center">
                      #{activeWaypoint.orderIndex}
                    </span>
                    <h4 className="font-bold text-xs text-white leading-tight">
                      {activeWaypoint.bin.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => setActiveWaypoint(null)}
                    className="text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-2 space-y-1 text-[11px] text-slate-300">
                  <p className="text-slate-400">{activeWaypoint.bin.location} ({activeWaypoint.bin.district})</p>
                  
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span>Fill Level:</span>
                    <span className="font-bold text-white font-mono">{activeWaypoint.bin.overallFillLevel}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Weight Payload:</span>
                    <span className="font-bold text-emerald-400 font-mono">{activeWaypoint.bin.totalWeightKg} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Leg Transit:</span>
                    <span className="font-bold text-blue-400 font-mono">+{activeWaypoint.distanceFromPreviousKm} km (~{activeWaypoint.estimatedTravelTimeMinutes}m)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Arrival ETA:</span>
                    <span className="font-bold text-amber-400 font-mono">+{activeWaypoint.estimatedArrivalEtaMinutes} mins</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      triggerSmartBinEmptying(activeWaypoint.bin.id);
                      setActiveWaypoint(null);
                    }}
                    className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all cursor-pointer"
                  >
                    🧹 Simulate Empty Bin
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Custom Selection Bin Checkboxes (Only when strategy === 'CUSTOM') */}
          {strategy === 'CUSTOM' && (
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Select Smart Bins to Include in Route:
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedBinIds.length} / {smartBins.length} selected
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {smartBins.map(bin => {
                  const isChecked = selectedBinIds.includes(bin.id);
                  return (
                    <label 
                      key={bin.id} 
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/40 text-slate-900 dark:text-white font-semibold' 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleBin(bin.id)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="truncate flex-1">{bin.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{bin.overallFillLevel}%</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (5 Cols): Turn-by-Turn Waypoint Manifest */}
        <div className={`${isMapExpanded ? 'lg:col-span-12' : 'lg:col-span-5'} space-y-4`}>
          
          {/* Section Header */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500" />
                Optimized Waypoint Itinerary
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {routePlan.waypoints.length} Smart Bins • Starting from {selectedDepot.name.split(' ')[0]}
              </p>
            </div>

            <button
              onClick={handleSimulateRouteCompletion}
              disabled={isSimulatingRoute || routePlan.waypoints.length === 0}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Simulate driver driving and emptying all bins sequentially"
            >
              {isSimulatingRoute ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>Auto-Complete Route</span>
            </button>
          </div>

          {/* Sequential Waypoint Cards List */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            
            {/* Step 0: Starting Depot */}
            <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center shrink-0 font-bold text-xs">
                🏢
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400">
                    Departure Origin (Leg 0)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">0.0 km</span>
                </div>
                <h4 className="font-bold text-xs truncate text-white mt-0.5">{selectedDepot.name}</h4>
                <p className="text-[10px] text-slate-400 truncate">{selectedDepot.location}</p>
              </div>
            </div>

            {/* Waypoints 1..N */}
            {routePlan.waypoints.map((wp) => {
              const isSelected = activeWaypoint?.bin.id === wp.bin.id;
              const isCritical = wp.urgencyLevel === 'CRITICAL';
              const isHigh = wp.urgencyLevel === 'HIGH';

              return (
                <div
                  key={wp.bin.id}
                  onClick={() => setActiveWaypoint(wp)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : isCritical
                      ? 'bg-red-50/50 dark:bg-red-950/20 border-red-500/30 hover:border-red-500/50'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Order Badge */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-mono font-black text-xs border ${
                        isCritical
                          ? 'bg-red-500 text-white border-red-600 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                          : isHigh
                          ? 'bg-amber-500 text-slate-950 border-amber-600'
                          : 'bg-emerald-500 text-slate-950 border-emerald-600'
                      }`}>
                        #{wp.orderIndex}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white truncate">
                            {wp.bin.name}
                          </h4>
                          <span className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            isCritical
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
                              : isHigh
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          }`}>
                            {wp.urgencyLevel}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {wp.bin.location} • {wp.bin.district}
                        </p>
                      </div>
                    </div>

                    {/* ETA & Distance */}
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-900 dark:text-white font-mono block">
                        +{wp.distanceFromPreviousKm} km
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        ETA: +{wp.estimatedArrivalEtaMinutes}m
                      </span>
                    </div>

                  </div>

                  {/* Bin Fill & Chambers Specs */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Fill Level</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {wp.bin.overallFillLevel}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Weight</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {wp.bin.totalWeightKg} kg
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Emptying Time</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                        ~{wp.estimatedServiceTimeMinutes} mins
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}

            {/* Step Final: Return to Depot */}
            <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-400 border border-purple-500/40 flex items-center justify-center shrink-0 font-bold text-xs">
                🏁
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-purple-400">
                    Return to Logistics Depot (End of Shift)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {routePlan.totalDistanceKm} km total
                  </span>
                </div>
                <h4 className="font-bold text-xs truncate text-white mt-0.5">Offload Payload at {selectedDepot.name}</h4>
                <p className="text-[10px] text-slate-400 truncate">Delivery to industrial municipal recycling offtaker</p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
