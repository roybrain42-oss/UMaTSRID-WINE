import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  MapPin, 
  RefreshCw, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  Battery, 
  Sun, 
  Wifi, 
  Search, 
  Sliders, 
  ArrowUpRight, 
  Trash2,
  Activity,
  Maximize2,
  Wrench
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { SmartDustBin, SmartBinLedIndicator } from '../../types';
import { soundEffects } from '../../utils/audioChime';

export type BinFillState = 'EMPTY' | 'HALF_FULL' | 'FULL';

export const getBinLedState = (fillLevel: number): {
  state: BinFillState;
  colorName: 'GREEN' | 'YELLOW' | 'RED';
  colorHex: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  glowClass: string;
  label: string;
  description: string;
} => {
  if (fillLevel <= 30) {
    return {
      state: 'EMPTY',
      colorName: 'GREEN',
      colorHex: '#10B981',
      badgeBg: 'bg-emerald-500/10 dark:bg-emerald-950/40',
      badgeText: 'text-emerald-700 dark:text-emerald-400',
      badgeBorder: 'border-emerald-500/30',
      glowClass: 'shadow-[0_0_20px_rgba(16,185,129,0.7)]',
      label: 'Empty',
      description: 'Capacity available for citizens. Green LED active.'
    };
  } else if (fillLevel <= 75) {
    return {
      state: 'HALF_FULL',
      colorName: 'YELLOW',
      colorHex: '#F59E0B',
      badgeBg: 'bg-amber-500/10 dark:bg-amber-950/40',
      badgeText: 'text-amber-700 dark:text-amber-400',
      badgeBorder: 'border-amber-500/30',
      glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.7)]',
      label: 'Half Full',
      description: 'Moderate volume recorded. Yellow LED active.'
    };
  } else {
    return {
      state: 'FULL',
      colorName: 'RED',
      colorHex: '#EF4444',
      badgeBg: 'bg-red-500/10 dark:bg-red-950/40',
      badgeText: 'text-red-700 dark:text-red-400',
      badgeBorder: 'border-red-500/30',
      glowClass: 'shadow-[0_0_25px_rgba(239,68,68,0.85)] animate-pulse',
      label: 'Full',
      description: 'Maximum capacity reached. Red LED flashing. Collection needed.'
    };
  }
};

export const AdminSmartBinMonitor: React.FC = () => {
  const { 
    smartBins, 
    triggerSmartBinEmptying,
    depositToSmartBin,
    registerNewSmartBin,
    markBinStatusWithLog,
    addToast
  } = useEcoSort();

  const [filterState, setFilterState] = useState<'ALL' | 'EMPTY' | 'HALF_FULL' | 'FULL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlaceBin, setSelectedPlaceBin] = useState<SmartDustBin | null>(smartBins[0] || null);
  const [showAddPlaceModal, setShowAddPlaceModal] = useState<boolean>(false);

  // New bin form state
  const [newPlaceName, setNewPlaceName] = useState<string>('');
  const [newPlaceLocation, setNewPlaceLocation] = useState<string>('');
  const [newPlaceDistrict, setNewPlaceDistrict] = useState<string>('Accra Metropolitan (AMA)');
  const [newPlaceCapacity, setNewPlaceCapacity] = useState<number>(50);

  // Statistics calculation
  const stats = useMemo(() => {
    let emptyCount = 0;
    let halfFullCount = 0;
    let fullCount = 0;

    smartBins.forEach(bin => {
      const { state } = getBinLedState(bin.overallFillLevel);
      if (state === 'EMPTY') emptyCount++;
      else if (state === 'HALF_FULL') halfFullCount++;
      else fullCount++;
    });

    return {
      total: smartBins.length,
      emptyCount,
      halfFullCount,
      fullCount
    };
  }, [smartBins]);

  // Filtered list
  const filteredBins = useMemo(() => {
    return smartBins.filter(bin => {
      const { state } = getBinLedState(bin.overallFillLevel);
      const matchesFilter = filterState === 'ALL' || state === filterState;
      const matchesSearch = 
        bin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [smartBins, filterState, searchQuery]);

  // Quick State Override for Testing / Demonstration
  const handleQuickSetFill = (binId: string, targetFill: number) => {
    const targetBin = smartBins.find(b => b.id === binId);
    if (!targetBin) return;

    const newWeight = Number(((targetFill / 100) * targetBin.maxCapacityKg).toFixed(2));
    const ledInfo = getBinLedState(targetFill);

    const newLed: SmartBinLedIndicator = {
      mode: targetFill <= 30 ? 'IDLE_READY' : targetFill <= 75 ? 'NEAR_CAPACITY' : 'BIN_FULL',
      colorHex: ledInfo.colorHex,
      colorName: ledInfo.colorName as any,
      pattern: targetFill > 75 ? 'RAPID_BLINK' : targetFill > 30 ? 'PULSE' : 'BREATHING',
      brightness: 90,
      statusMessage: `${ledInfo.label.toUpperCase()}: ${ledInfo.description}`,
      ledRingHex: Array(12).fill(ledInfo.colorHex),
      autoRulesEnabled: true
    };

    // Save directly into local context
    depositToSmartBin(binId, {
      itemName: 'Simulated Diagnostic Check',
      category: 'PLASTIC',
      material: 'Test Package',
      weightKg: Math.max(0.1, newWeight - targetBin.totalWeightKg)
    });

    soundEffects.playRewardChime();

    addToast({
      title: `LED Status Updated: ${ledInfo.label}`,
      message: `${targetBin.name} set to ${targetFill}% (${ledInfo.colorName} LED active).`,
      type: targetFill > 75 ? 'warning' : 'success'
    });
  };

  // Add new location / place bin
  const handleCreatePlaceBin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceName.trim() || !newPlaceLocation.trim()) {
      addToast({
        title: 'Missing Fields',
        message: 'Please provide a place name and location address.',
        type: 'error'
      });
      return;
    }

    const created = registerNewSmartBin({
      name: newPlaceName.trim(),
      location: newPlaceLocation.trim(),
      district: newPlaceDistrict,
      maxCapacityKg: Number(newPlaceCapacity) || 50,
      overallFillLevel: 0,
      totalWeightKg: 0,
      ledIndicator: {
        mode: 'IDLE_READY',
        colorHex: '#10B981',
        colorName: 'GREEN',
        pattern: 'BREATHING',
        brightness: 90,
        statusMessage: '🟢 EMPTY / READY: Green LED illuminated at location.',
        ledRingHex: Array(12).fill('#10B981'),
        autoRulesEnabled: true
      }
    });

    setSelectedPlaceBin(created);
    setShowAddPlaceModal(false);
    setNewPlaceName('');
    setNewPlaceLocation('');

    soundEffects.playSuccessJingle();
  };

  return (
    <div className="space-y-6">
      {/* Header Info Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-400/30">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              Admin Command • Smart Dust Bin Network
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Location Smart Bins & LED Status Monitor
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Live status monitoring for waste bins across designated locations. The hardware LED displays <span className="text-emerald-400 font-bold">Green (Empty)</span>, <span className="text-amber-400 font-bold">Yellow (Half Full)</span>, and <span className="text-red-400 font-bold">Red (Full)</span> in real-time.
            </p>
          </div>

          <button
            onClick={() => setShowAddPlaceModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Place Bin
          </button>
        </div>

        {/* LED Status Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 pt-6 border-t border-slate-800">
          <div 
            onClick={() => setFilterState('ALL')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              filterState === 'ALL' 
                ? 'bg-slate-800 border-slate-600 ring-2 ring-slate-400/50' 
                : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Monitored Places</span>
              <MapPin className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono mt-1">{stats.total}</div>
            <span className="text-[11px] text-slate-400 font-medium">All active hardware locations</span>
          </div>

          {/* Green - Empty */}
          <div 
            onClick={() => setFilterState('EMPTY')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              filterState === 'EMPTY' 
                ? 'bg-emerald-950/70 border-emerald-500 ring-2 ring-emerald-400/50' 
                : 'bg-slate-950/60 border-slate-800 hover:bg-emerald-950/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 uppercase font-bold">Green LED (Empty)</span>
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]"></div>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{stats.emptyCount}</div>
            <span className="text-[11px] text-slate-400 font-medium">0% - 30% fill • Ready</span>
          </div>

          {/* Yellow - Half Full */}
          <div 
            onClick={() => setFilterState('HALF_FULL')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              filterState === 'HALF_FULL' 
                ? 'bg-amber-950/70 border-amber-500 ring-2 ring-amber-400/50' 
                : 'bg-slate-950/60 border-slate-800 hover:bg-amber-950/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-400 uppercase font-bold">Yellow LED (Half Full)</span>
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-[0_0_10px_#F59E0B]"></div>
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">{stats.halfFullCount}</div>
            <span className="text-[11px] text-slate-400 font-medium">31% - 75% fill • Moderate</span>
          </div>

          {/* Red - Full */}
          <div 
            onClick={() => setFilterState('FULL')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              filterState === 'FULL' 
                ? 'bg-red-950/70 border-red-500 ring-2 ring-red-400/50' 
                : 'bg-slate-950/60 border-slate-800 hover:bg-red-950/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-red-400 uppercase font-bold">Red LED (Full)</span>
              <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_12px_#EF4444] animate-pulse"></div>
            </div>
            <div className="text-2xl font-black text-red-400 font-mono mt-1">{stats.fullCount}</div>
            <span className="text-[11px] text-slate-400 font-medium">76% - 100% fill • Pickup Needed</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by place or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* LED Color Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            onClick={() => setFilterState('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterState === 'ALL' 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Places ({smartBins.length})
          </button>
          <button
            onClick={() => setFilterState('EMPTY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterState === 'EMPTY' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Green (Empty) ({stats.emptyCount})
          </button>
          <button
            onClick={() => setFilterState('HALF_FULL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterState === 'HALF_FULL' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-500/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Yellow (Half Full) ({stats.halfFullCount})
          </button>
          <button
            onClick={() => setFilterState('FULL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterState === 'FULL' 
                ? 'bg-red-600 text-white shadow-xs' 
                : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-500/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Red (Full) ({stats.fullCount})
          </button>
        </div>
      </div>

      {/* Main Grid: Location Cards with Physical LED Indicator Lamps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBins.map((bin) => {
          const ledInfo = getBinLedState(bin.overallFillLevel);
          const isSelected = selectedPlaceBin?.id === bin.id;

          return (
            <div
              key={bin.id}
              onClick={() => setSelectedPlaceBin(bin)}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border transition-all duration-300 relative shadow-sm flex flex-col justify-between cursor-pointer ${
                isSelected 
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:ring-emerald-500/30' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                {/* Location & Status Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{bin.district}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                      {bin.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {bin.location}
                    </p>
                  </div>

                  {/* 3-State Traffic Light Style Physical LED Column */}
                  <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-inner flex flex-col items-center gap-1.5 shrink-0">
                    {/* Red LED */}
                    <div 
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        ledInfo.colorName === 'RED' 
                          ? 'bg-red-500 shadow-[0_0_12px_#EF4444] ring-2 ring-red-400 animate-pulse' 
                          : 'bg-red-950/60 opacity-30'
                      }`} 
                      title="Red LED: Full (76-100%)"
                    />
                    {/* Yellow LED */}
                    <div 
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        ledInfo.colorName === 'YELLOW' 
                          ? 'bg-amber-400 shadow-[0_0_12px_#F59E0B] ring-2 ring-amber-300' 
                          : 'bg-amber-950/60 opacity-30'
                      }`} 
                      title="Yellow LED: Half Full (31-75%)"
                    />
                    {/* Green LED */}
                    <div 
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        ledInfo.colorName === 'GREEN' 
                          ? 'bg-emerald-400 shadow-[0_0_12px_#10B981] ring-2 ring-emerald-300' 
                          : 'bg-emerald-950/60 opacity-30'
                      }`} 
                      title="Green LED: Empty (0-30%)"
                    />
                  </div>
                </div>

                {/* Big Visual LED Glow Banner */}
                <div className={`p-4 rounded-2xl border mb-5 transition-all ${ledInfo.badgeBg} ${ledInfo.badgeBorder}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-3.5 h-3.5 rounded-full ${
                          ledInfo.colorName === 'GREEN' ? 'bg-emerald-500 shadow-[0_0_10px_#10B981]' :
                          ledInfo.colorName === 'YELLOW' ? 'bg-amber-500 shadow-[0_0_10px_#F59E0B]' :
                          'bg-red-500 shadow-[0_0_12px_#EF4444] animate-pulse'
                        }`} 
                      />
                      <span className={`text-xs font-black uppercase tracking-wider ${ledInfo.badgeText}`}>
                        {ledInfo.label} ({bin.overallFillLevel}%)
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      {bin.totalWeightKg} / {bin.maxCapacityKg} kg
                    </span>
                  </div>

                  {/* Progress Fill Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        ledInfo.colorName === 'GREEN' ? 'bg-emerald-500' :
                        ledInfo.colorName === 'YELLOW' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${bin.overallFillLevel}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 font-medium">
                    {ledInfo.description}
                  </p>
                </div>

                {/* Hardware Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-5">
                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Range Sensor</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {bin.ultrasonicDistanceCm || 35} cm depth
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Power / Solar</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-500" />
                      {bin.batteryLevel}% ({bin.solarWattsGenerated || 14}W)
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Action Bar: Instant LED State Testing */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Test / Simulate LED Status:
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickSetFill(bin.id, 10);
                    }}
                    className="px-2 py-1.5 text-[11px] font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-500/20 transition-all cursor-pointer"
                    title="Set to Empty (Green LED)"
                  >
                    🟢 Empty
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickSetFill(bin.id, 50);
                    }}
                    className="px-2 py-1.5 text-[11px] font-bold rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900 border border-amber-500/20 transition-all cursor-pointer"
                    title="Set to Half Full (Yellow LED)"
                  >
                    🟡 Half Full
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickSetFill(bin.id, 92);
                    }}
                    className="px-2 py-1.5 text-[11px] font-bold rounded-lg bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 border border-red-500/20 transition-all cursor-pointer"
                    title="Set to Full (Red LED)"
                  >
                    🔴 Full
                  </button>
                </div>

                {/* Reset / Empty button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerSmartBinEmptying(bin.id);
                  }}
                  className="w-full mt-2 py-1.5 px-3 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-500" />
                  Simulate Pickup (Empty Bin)
                </button>

                {/* Maintenance Quick Actions */}
                <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                  {bin.status !== 'MAINTENANCE' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markBinStatusWithLog({
                          binId: bin.id,
                          action: 'UNDER_REPAIR',
                          issueDescription: 'Manual maintenance flagged by admin during monitoring.',
                          technicianName: 'Admin Field Dispatch'
                        });
                      }}
                      className="py-1 px-2 text-[10px] font-bold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      title="Mark as Under Repair"
                    >
                      <Wrench className="w-3 h-3" />
                      Repair
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markBinStatusWithLog({
                          binId: bin.id,
                          action: 'SERVICED',
                          resolutionNotes: 'Repairs completed and certified operational.',
                          technicianName: 'Admin Field Dispatch',
                          resetCapacityIfServiced: true
                        });
                      }}
                      className="py-1 px-2 text-[10px] font-bold rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      title="Mark as Serviced & Online"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Serviced
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markBinStatusWithLog({
                        binId: bin.id,
                        action: 'SENSOR_CALIBRATION',
                        issueDescription: 'Routine optical sensor and ultrasonic depth calibration.',
                        resolutionNotes: 'Sensor tare calibrated to 0%.',
                        technicianName: 'Admin Field Dispatch'
                      });
                    }}
                    className="py-1 px-2 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    title="Calibrate Sensors"
                  >
                    <Activity className="w-3 h-3 text-blue-500" />
                    Calibrate
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBins.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Cpu className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Smart Bins Match Filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or LED status filter above to inspect monitored places.
          </p>
          <button
            onClick={() => {
              setFilterState('ALL');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Add Place Bin Modal */}
      {showAddPlaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Register Smart Bin Place</h3>
                  <p className="text-xs text-slate-500">Deploy hardware LED monitoring to a new location</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddPlaceModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlaceBin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Place / Facility Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Accra Mall Food Court Bin #05"
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Exact Location Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tetteh Quarshie Interchange, Spintex Rd, Accra"
                  value={newPlaceLocation}
                  onChange={(e) => setNewPlaceLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    District
                  </label>
                  <select
                    value={newPlaceDistrict}
                    onChange={(e) => setNewPlaceDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Accra Metropolitan (AMA)">Accra Metropolitan</option>
                    <option value="Korle-Klottey Municipal">Korle-Klottey</option>
                    <option value="Ayawaso West Municipal">Ayawaso West (Legon)</option>
                    <option value="Kumasi Metropolitan (KMA)">Kumasi Metropolitan</option>
                    <option value="Tarkwa-Nsuaem / SRID">Tarkwa-Nsuaem</option>
                    <option value="Tema Metropolitan (TMA)">Tema Metropolitan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Max Capacity (kg)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="200"
                    value={newPlaceCapacity}
                    onChange={(e) => setNewPlaceCapacity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* LED Behavior Notice */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Automatic LED Logic:</span>
                <div className="text-slate-500 text-[11px] space-y-0.5">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>🟢 Green LED:</span> 0% - 30% (Empty & Ready)
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                    <span>🟡 Yellow LED:</span> 31% - 75% (Half Full)
                  </div>
                  <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold">
                    <span>🔴 Red LED:</span> 76% - 100% (Full, Pickup Dispatched)
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPlaceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Deploy Smart Bin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
