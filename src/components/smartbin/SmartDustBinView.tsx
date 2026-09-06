import React, { useState } from 'react';
import { useEcoSort } from '../../context/EcoSortContext';
import { SmartDustBin, LedColorName } from '../../types/smartBin';
import { SmartBinVisualizer } from './SmartBinVisualizer';
import { SmartBinLedStudio } from './SmartBinLedStudio';
import { SmartBinHardwareGuide } from './SmartBinHardwareGuide';
import { SmartBinPairModal } from './SmartBinPairModal';
import { 
  Cpu, 
  Sparkles, 
  Radio, 
  Sliders, 
  Code2, 
  Plus, 
  Layers, 
  MapPin, 
  BatteryCharging, 
  Sun, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Truck, 
  Zap, 
  Trophy, 
  ArrowRight,
  Wifi,
  SlidersHorizontal
} from 'lucide-react';
import { soundEffects } from '../../utils/audioChime';

export const SmartDustBinView: React.FC = () => {
  const { 
    smartBins, 
    selectedSmartBin, 
    setSelectedSmartBin, 
    updateSmartBinLed, 
    depositToSmartBin, 
    registerNewSmartBin,
    triggerSmartBinEmptying,
    currentUser,
    addToast
  } = useEcoSort();

  const [activeTab, setActiveTab] = useState<'SIMULATOR' | 'LED_STUDIO' | 'FIRMWARE' | 'FLEET'>('SIMULATOR');
  const [showPairModal, setShowPairModal] = useState<boolean>(false);
  const [isProcessingDeposit, setIsProcessingDeposit] = useState<boolean>(false);

  // Default to first bin if none selected
  const activeBin: SmartDustBin = selectedSmartBin || smartBins[0] || ({} as SmartDustBin);

  // Fleet summary calculations
  const totalBinsCount = smartBins.length;
  const onlineBinsCount = smartBins.filter(b => b.status === 'ONLINE').length;
  const fullBinsCount = smartBins.filter(b => b.overallFillLevel >= 90).length;
  const totalWeightKg = smartBins.reduce((acc, b) => acc + b.totalWeightKg, 0);
  const totalPointsDistributed = smartBins.reduce((acc, b) => acc + b.totalPointsRewarded, 0);

  const handleSimulateDeposit = async (itemType: 'PLASTIC_BOTTLE' | 'SACHET' | 'CAN' | 'PAPER' | 'CONTAMINANT') => {
    if (!activeBin || !activeBin.id) return;

    setIsProcessingDeposit(true);

    const itemsMap = {
      PLASTIC_BOTTLE: {
        name: 'Voltic 1.5L PET Mineral Water Bottle',
        category: 'PLASTIC' as const,
        material: 'PET Plastic',
        weightKg: 0.18,
        chamberId: activeBin.chambers?.find(c => c.category === 'PLASTIC')?.id
      },
      SACHET: {
        name: 'Pure Water Sachet (LDPE)',
        category: 'PLASTIC' as const,
        material: 'LDPE Sachet Film',
        weightKg: 0.05,
        chamberId: activeBin.chambers?.find(c => c.category === 'PLASTIC')?.id
      },
      CAN: {
        name: 'Malta Guinness Aluminum Can 330ml',
        category: 'METAL' as const,
        material: 'Aluminum Can',
        weightKg: 0.15,
        chamberId: activeBin.chambers?.find(c => c.category === 'METAL')?.id
      },
      PAPER: {
        name: 'Recycled Cardboard Packaging',
        category: 'PAPER' as const,
        material: 'Clean Cardboard',
        weightKg: 0.40,
        chamberId: activeBin.chambers?.find(c => c.category === 'PAPER')?.id
      },
      CONTAMINANT: {
        name: 'Lead-Acid Alkaline Battery (Hazardous)',
        category: 'HAZARDOUS' as const,
        material: 'Toxic Heavy Metal',
        weightKg: 0.20,
        chamberId: undefined
      }
    };

    const targetItem = itemsMap[itemType];

    try {
      const res = await depositToSmartBin(activeBin.id, {
        itemName: targetItem.name,
        category: targetItem.category as any,
        material: targetItem.material,
        weightKg: targetItem.weightKg,
        chamberId: targetItem.chamberId
      });

      if (res.success) {
        soundEffects.playCelebration();
      } else {
        soundEffects.playErrorTone();
      }
    } catch (e) {
      console.error('Deposit simulation error:', e);
    } finally {
      setIsProcessingDeposit(false);
    }
  };

  const handleEmptyBin = (binId: string) => {
    triggerSmartBinEmptying(binId);
    soundEffects.playSuccessJingle();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>Smart Dust Bin & LED Indicator IoT Grid</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Autonomous Smart Bins with <span className="text-emerald-400">Real-Time LED Indicators</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Connect your ESP32, Arduino, or smart dustbin hardware to the EcoSort Ghana platform.
              Visual LED indicators give instant user feedback: 🟢 Green (Accepted), 🔵 Blue (Scanning), 🟡 Amber (Near Capacity), and 🔴 Red (Lid Locked/Full).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPairModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Connect Smart Dust Bin ⚡
            </button>
          </div>
        </div>

        {/* Fleet Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Connected Fleet</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-black text-white">{onlineBinsCount} / {totalBinsCount}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Active Online</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">LED Indicator Status</span>
            <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-slate-200">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">🟢 {smartBins.filter(b => b.ledIndicator.colorName === 'GREEN').length}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">🟡 {smartBins.filter(b => b.ledIndicator.colorName === 'AMBER').length}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-rose-400 font-bold">🔴 {smartBins.filter(b => b.ledIndicator.colorName === 'RED').length}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Recycled Volume</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-black text-emerald-400 font-mono">{totalWeightKg.toFixed(1)} kg</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">EcoPoints Rewarded</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-black text-amber-400 font-mono">+{totalPointsDistributed.toLocaleString()} Pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Bin Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {smartBins.map((bin) => {
          const isSelected = activeBin.id === bin.id;
          const led = bin.ledIndicator;
          return (
            <button
              key={bin.id}
              onClick={() => setSelectedSmartBin(bin)}
              className={`px-4 py-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-slate-800 border-emerald-400 shadow-lg ring-1 ring-emerald-400'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div 
                className="w-3.5 h-3.5 rounded-full shadow"
                style={{
                  backgroundColor: led.colorHex,
                  boxShadow: `0 0 8px ${led.colorHex}`
                }}
              />
              <div className="text-left">
                <span className="text-xs font-black text-white block">{bin.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{bin.overallFillLevel}% Full • {bin.district}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('SIMULATOR')}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'SIMULATOR'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Live Visualizer & Deposit Sim
        </button>

        <button
          onClick={() => setActiveTab('LED_STUDIO')}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'LED_STUDIO'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          LED Pattern & Diagnostic Studio
        </button>

        <button
          onClick={() => setActiveTab('FIRMWARE')}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'FIRMWARE'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          ESP32 / Arduino Firmware & Pinout
        </button>

        <button
          onClick={() => setActiveTab('FLEET')}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'FLEET'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Ghana Fleet Map & Grid
        </button>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'SIMULATOR' && activeBin && (
        <SmartBinVisualizer
          bin={activeBin}
          onDropItem={handleSimulateDeposit}
          isProcessing={isProcessingDeposit}
        />
      )}

      {activeTab === 'LED_STUDIO' && activeBin && (
        <SmartBinLedStudio
          bin={activeBin}
          onUpdateLed={updateSmartBinLed}
        />
      )}

      {activeTab === 'FIRMWARE' && activeBin && (
        <SmartBinHardwareGuide bin={activeBin} />
      )}

      {activeTab === 'FLEET' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smartBins.map((bin) => (
            <div 
              key={bin.id}
              className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4 hover:border-slate-700 transition-all shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow"
                    style={{
                      backgroundColor: bin.ledIndicator.colorHex,
                      boxShadow: `0 0 10px ${bin.ledIndicator.colorHex}`
                    }}
                  />
                  <div>
                    <h4 className="text-sm font-black text-white">{bin.name}</h4>
                    <p className="text-xs text-slate-400">{bin.location}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-mono ${
                  bin.overallFillLevel >= 90 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                    : bin.overallFillLevel >= 75 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {bin.overallFillLevel}% Full
                </span>
              </div>

              {/* Sensor Bar */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Weight</span>
                  <span className="font-black text-white">{bin.totalWeightKg} kg</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Battery</span>
                  <span className="font-black text-amber-300">{bin.batteryLevel}%</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">MCU</span>
                  <span className="font-black text-emerald-400">{bin.hardwareMcu}</span>
                </div>
              </div>

              {/* Status Message */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
                <span className="truncate">{bin.ledIndicator.statusMessage}</span>
                <span className="text-[10px] text-slate-500 font-mono ml-2 uppercase">{bin.ledIndicator.pattern}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setSelectedSmartBin(bin);
                    setActiveTab('SIMULATOR');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white cursor-pointer"
                >
                  Open Simulator ⚡
                </button>

                {bin.overallFillLevel >= 75 && (
                  <button
                    onClick={() => handleEmptyBin(bin.id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black cursor-pointer shadow"
                  >
                    Dispatch Collector 🚛
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pair New Smart Bin Modal */}
      <SmartBinPairModal
        isOpen={showPairModal}
        onClose={() => setShowPairModal(false)}
        onRegisterBin={registerNewSmartBin}
      />
    </div>
  );
};
