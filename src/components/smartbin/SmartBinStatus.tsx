import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  MapPin, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  Sun, 
  Battery, 
  Search, 
  Sliders, 
  Activity, 
  ArrowUpRight,
  Sparkles,
  Zap,
  Info,
  Bell,
  BellRing,
  BellOff
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

interface SmartBinStatusProps {
  compact?: boolean;
  maxDisplay?: number;
  onViewAll?: () => void;
}

export const SmartBinStatus: React.FC<SmartBinStatusProps> = ({
  compact = false,
  maxDisplay,
  onViewAll
}) => {
  const { 
    smartBins, 
    triggerSmartBinEmptying,
    depositToSmartBin,
    pushSettings,
    updatePushSettings,
    addToast
  } = useEcoSort();

  const isBinAlertsEnabled = pushSettings.adminBinCapacityAlerts !== false;

  const toggleBinAlerts = () => {
    const next = !isBinAlertsEnabled;
    updatePushSettings({ adminBinCapacityAlerts: next });
    addToast({
      title: next ? '🔔 90% Push Alerts Enabled' : '🔕 90% Push Alerts Muted',
      message: next ? 'You will be notified when any bin reaches 90%.' : 'Capacity alerts paused for smart dust bins.',
      type: next ? 'success' : 'info'
    });
  };

  const [filterState, setFilterState] = useState<'ALL' | 'EMPTY' | 'HALF_FULL' | 'FULL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    let list = smartBins.filter(bin => {
      const { state } = getBinLedState(bin.overallFillLevel);
      const matchesFilter = filterState === 'ALL' || state === filterState;
      const matchesSearch = 
        bin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (maxDisplay && maxDisplay > 0) {
      list = list.slice(0, maxDisplay);
    }
    return list;
  }, [smartBins, filterState, searchQuery, maxDisplay]);

  // Quick State Override for Testing / Demonstration
  const handleQuickSetFill = (binId: string, targetFill: number) => {
    const targetBin = smartBins.find(b => b.id === binId);
    if (!targetBin) return;

    const newWeight = Number(((targetFill / 100) * targetBin.maxCapacityKg).toFixed(2));
    const ledInfo = getBinLedState(targetFill);

    depositToSmartBin(binId, {
      itemName: 'Diagnostic Sensor Calibrate',
      category: 'PLASTIC',
      material: 'Test Polyethylene',
      weightKg: Math.max(0.1, newWeight - targetBin.totalWeightKg)
    });

    soundEffects.playRewardChime();

    addToast({
      title: `Smart Bin LED: ${ledInfo.label}`,
      message: `${targetBin.name} set to ${targetFill}% (${ledInfo.colorName} LED active).`,
      type: targetFill > 75 ? 'warning' : 'success'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Header with Title & Quick LED Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                Real-Time Smart Bin Status
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live Red, Yellow, and Green LED fill indicators across monitored public bins
              </p>
            </div>
          </div>
        </div>

        {/* 3-State LED Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterState('EMPTY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterState === 'EMPTY'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"></span>
            <span>Green ({stats.emptyCount} Empty)</span>
          </button>

          <button
            onClick={() => setFilterState('HALF_FULL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterState === 'HALF_FULL'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-500/20'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]"></span>
            <span>Yellow ({stats.halfFullCount} Half Full)</span>
          </button>

          <button
            onClick={() => setFilterState('FULL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterState === 'FULL'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-500/20'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#EF4444]"></span>
            <span>Red ({stats.fullCount} Full)</span>
          </button>

          {/* 90% Push Alerts Toggle Button */}
          <button
            onClick={toggleBinAlerts}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              isBinAlertsEnabled
                ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={isBinAlertsEnabled ? '90% Capacity Push Alerts Active: Click to pause' : '90% Capacity Push Alerts Paused: Click to enable'}
          >
            {isBinAlertsEnabled ? (
              <BellRing className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-bounce" />
            ) : (
              <BellOff className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>90% Push Alerts: {isBinAlertsEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {filterState !== 'ALL' && (
            <button
              onClick={() => setFilterState('ALL')}
              className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold cursor-pointer underline"
            >
              Show All ({stats.total})
            </button>
          )}
        </div>
      </div>

      {/* Search Input if not compact */}
      {!compact && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by bin location, district or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      )}

      {/* Grid of Real-Time Smart Bins */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBins.map((bin) => {
          const ledInfo = getBinLedState(bin.overallFillLevel);

          return (
            <div
              key={bin.id}
              className="bg-slate-50 dark:bg-slate-950/70 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <MapPin className="w-3 h-3 text-emerald-500" />
                      <span>{bin.district}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5 leading-snug">
                      {bin.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {bin.location}
                    </p>
                  </div>

                  {/* 3-State Traffic-Light Style Physical Lamp */}
                  <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex flex-col items-center gap-1 shrink-0">
                    <div 
                      className={`w-3 h-3 rounded-full transition-all ${
                        ledInfo.colorName === 'RED' 
                          ? 'bg-red-500 shadow-[0_0_8px_#EF4444] animate-pulse' 
                          : 'bg-red-950/50 opacity-20'
                      }`}
                      title="Red: Full"
                    />
                    <div 
                      className={`w-3 h-3 rounded-full transition-all ${
                        ledInfo.colorName === 'YELLOW' 
                          ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]' 
                          : 'bg-amber-950/50 opacity-20'
                      }`}
                      title="Yellow: Half Full"
                    />
                    <div 
                      className={`w-3 h-3 rounded-full transition-all ${
                        ledInfo.colorName === 'GREEN' 
                          ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]' 
                          : 'bg-emerald-950/50 opacity-20'
                      }`}
                      title="Green: Empty"
                    />
                  </div>
                </div>

                {/* Fill Gauge & LED Status */}
                <div className={`p-3 rounded-xl border mb-3 ${ledInfo.badgeBg} ${ledInfo.badgeBorder}`}>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                    <div className="flex items-center gap-1.5">
                      <div 
                        className={`w-2.5 h-2.5 rounded-full ${
                          ledInfo.colorName === 'GREEN' ? 'bg-emerald-500' :
                          ledInfo.colorName === 'YELLOW' ? 'bg-amber-500' :
                          'bg-red-500 animate-pulse'
                        }`} 
                      />
                      <span className={ledInfo.badgeText}>
                        {ledInfo.label} • {bin.overallFillLevel}%
                      </span>
                    </div>
                    <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                      {bin.totalWeightKg} / {bin.maxCapacityKg} kg
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        ledInfo.colorName === 'GREEN' ? 'bg-emerald-500' :
                        ledInfo.colorName === 'YELLOW' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${bin.overallFillLevel}%` }}
                    />
                  </div>
                </div>

                {/* Telemetry info */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-3 px-1">
                  <span className="flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-500" />
                    Solar: {bin.solarWattsGenerated || 14}W
                  </span>
                  <span>Range: {bin.ultrasonicDistanceCm || 35}cm</span>
                  <span>Battery: {bin.batteryLevel}%</span>
                </div>
              </div>

              {/* Quick Action Simulation Buttons */}
              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-1">
                <div className="grid grid-cols-3 gap-1 flex-1">
                  <button
                    onClick={() => handleQuickSetFill(bin.id, 15)}
                    className="px-1.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-500/20 transition-all cursor-pointer text-center"
                    title="Set to Empty (Green LED)"
                  >
                    🟢 Empty
                  </button>
                  <button
                    onClick={() => handleQuickSetFill(bin.id, 55)}
                    className="px-1.5 py-1 text-[10px] font-bold rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900 border border-amber-500/20 transition-all cursor-pointer text-center"
                    title="Set to Half Full (Yellow LED)"
                  >
                    🟡 Half
                  </button>
                  <button
                    onClick={() => handleQuickSetFill(bin.id, 90)}
                    className="px-1.5 py-1 text-[10px] font-bold rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 border border-red-500/20 transition-all cursor-pointer text-center"
                    title="Set to Full (Red LED)"
                  >
                    🔴 Full
                  </button>
                </div>

                <button
                  onClick={() => triggerSmartBinEmptying(bin.id)}
                  className="p-1.5 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-all cursor-pointer"
                  title="Empty Bin (Dispatch Complete)"
                >
                  <Truck className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {onViewAll && (
        <div className="pt-2 text-center">
          <button
            onClick={onViewAll}
            className="px-4 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <span>Open Dedicated Smart Dust Bin Network Manager</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
