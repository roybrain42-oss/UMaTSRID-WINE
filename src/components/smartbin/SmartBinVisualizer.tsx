import React, { useEffect, useState } from 'react';
import { 
  SmartDustBin, 
  LedColorName, 
  LedPattern, 
  LedMode 
} from '../../types/smartBin';
import { getLedRingPixels } from '../../data/smartBinSeedData';
import { 
  Zap, 
  Radio, 
  Sun, 
  BatteryCharging, 
  Cpu, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Volume2, 
  Lock, 
  Unlock,
  Layers,
  Scale,
  Wifi,
  Flame
} from 'lucide-react';

interface SmartBinVisualizerProps {
  bin: SmartDustBin;
  onDropItem?: (itemType: 'PLASTIC_BOTTLE' | 'SACHET' | 'CAN' | 'PAPER' | 'CONTAMINANT') => void;
  isProcessing?: boolean;
}

export const SmartBinVisualizer: React.FC<SmartBinVisualizerProps> = ({
  bin,
  onDropItem,
  isProcessing = false
}) => {
  const [animStep, setAnimStep] = useState<number>(0);
  const [lidOpen, setLidOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'INTERACTIVE' | 'SENSORS'>('INTERACTIVE');

  // Animation ticker for LED ring chase / pulse / rainbow effects
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimStep((prev) => (prev + 1) % 120);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const led = bin.ledIndicator;
  const pixels = getLedRingPixels(led.mode, led.colorHex, led.colorName, led.pattern, animStep);

  // Compute glowing color style
  const glowStyle = {
    boxShadow: `0 0 35px ${led.colorHex}66, inset 0 0 15px ${led.colorHex}44`,
    borderColor: led.colorHex
  };

  const handleSimDrop = (itemType: 'PLASTIC_BOTTLE' | 'SACHET' | 'CAN' | 'PAPER' | 'CONTAMINANT') => {
    setLidOpen(true);
    setTimeout(() => {
      setLidOpen(false);
    }, 2200);
    if (onDropItem) {
      onDropItem(itemType);
    }
  };

  const isLocked = bin.overallFillLevel >= 90 || led.mode === 'BIN_FULL';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Background glow ambiance */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: led.colorHex }}
      />

      {/* Top Header Bar with Hardware Telemetry Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-emerald-400 font-black shadow-inner">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">{bin.name}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {bin.hardwareMcu} Online
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>{bin.location}</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-[11px] text-slate-400">{bin.ipAddress}</span>
            </p>
          </div>
        </div>

        {/* Live Sensor Quick Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
            <Wifi className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-mono">{bin.signalRssi} dBm</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
            {bin.isSolarPowered ? (
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            ) : (
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="font-mono font-bold text-amber-300">{bin.batteryLevel}%</span>
          </div>
        </div>
      </div>

      {/* Main Hardware Bin 3D Visualizer & LED Ring Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6 relative z-10 items-center">
        
        {/* Left Column: Physical Bin Schematic & LED Ring */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-950/70 rounded-3xl border border-slate-800/80 relative">
          
          {/* LED Ring Display (NeoPixel 12-Ring Halo) */}
          <div className="relative mb-6 flex flex-col items-center">
            
            {/* Outer Circular Ring with 12 Glowing NeoPixel LEDs */}
            <div 
              className="w-48 h-48 rounded-full border-4 flex items-center justify-center relative transition-all duration-300"
              style={glowStyle}
            >
              {/* 12 Individual Circular Pixel Nodes */}
              {pixels.map((pixelHex, idx) => {
                const angle = (idx * 360) / 12;
                const rad = (angle * Math.PI) / 180;
                const radius = 80; // distance from center in px
                const x = radius * Math.cos(rad);
                const y = radius * Math.sin(rad);

                return (
                  <div
                    key={idx}
                    className="absolute w-4 h-4 rounded-full transition-all duration-200"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      backgroundColor: pixelHex,
                      boxShadow: `0 0 12px ${pixelHex}, inset 0 0 4px #ffffff`
                    }}
                  />
                );
              })}

              {/* Center Core: Optical Camera Reticle & Status Display */}
              <div className="w-28 h-28 rounded-full bg-slate-900 border-2 border-slate-700 flex flex-col items-center justify-center text-center p-2 shadow-inner">
                {isProcessing ? (
                  <div className="flex flex-col items-center">
                    <Sparkles className="w-6 h-6 text-blue-400 animate-spin" />
                    <span className="text-[10px] font-black text-blue-400 mt-1 uppercase tracking-widest">Scanning</span>
                  </div>
                ) : isLocked ? (
                  <div className="flex flex-col items-center">
                    <Lock className="w-6 h-6 text-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black text-rose-400 mt-1 uppercase">Full</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-4 h-4 rounded-full animate-ping mb-1"
                      style={{ backgroundColor: led.colorHex }}
                    />
                    <span className="text-[11px] font-black tracking-wider uppercase" style={{ color: led.colorHex }}>
                      {led.colorName}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-mono mt-0.5">
                      {led.pattern}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                WS2812B RGB Ring • {led.brightness}% Brightness
              </span>
            </div>
          </div>

          {/* Physical Bin Body with Interactive Opening Servo Flap & Chamber Level */}
          <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-xl relative">
            {/* Top Servo Lid Flap */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                {lidOpen ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-slate-500" />}
                Servo Flap: <strong className={lidOpen ? 'text-emerald-400' : 'text-slate-300'}>{lidOpen ? 'OPEN (90°)' : 'CLOSED (0°)'}</strong>
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">SG90 Servo</span>
            </div>

            {/* Simulated Animated Flap Door */}
            <div className="my-3 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden relative">
              <div 
                className={`w-full h-full flex items-center justify-center font-black text-xs transition-all duration-500 ${
                  lidOpen ? 'bg-emerald-500/20 text-emerald-300 border-b-2 border-emerald-400' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {lidOpen ? '⚡ INTAKE CHUTE OPEN' : '🔒 INTAKE CHUTE IDLE'}
              </div>
            </div>

            {/* Ultrasonic Fill Level Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Ultrasonic Fill Level</span>
                <span className={`font-black font-mono ${
                  bin.overallFillLevel >= 90 ? 'text-rose-400' : bin.overallFillLevel >= 75 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {bin.overallFillLevel}% ({bin.totalWeightKg.toFixed(1)} / {bin.maxCapacityKg} kg)
                </span>
              </div>
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    bin.overallFillLevel >= 90 
                      ? 'bg-rose-500 shadow-lg shadow-rose-500/50 animate-pulse' 
                      : bin.overallFillLevel >= 75 
                        ? 'bg-amber-500' 
                        : 'bg-emerald-500'
                  }`}
                  style={{ width: `${bin.overallFillLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Drop Test & Real-Time Telemetry */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Live Status Message & LCD HUD */}
          <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                SMART BIN LCD MONITOR
              </span>
              <span>16x2 I2C Display</span>
            </div>

            <div 
              className="p-3.5 rounded-xl border font-mono text-sm font-bold flex items-center gap-3 transition-colors duration-300"
              style={{
                backgroundColor: `${led.colorHex}15`,
                borderColor: `${led.colorHex}66`,
                color: led.colorHex
              }}
            >
              <div className="text-xl">
                {led.colorName === 'GREEN' && '🟢'}
                {led.colorName === 'AMBER' && '🟡'}
                {led.colorName === 'RED' && '🔴'}
                {led.colorName === 'BLUE' && '🔵'}
                {led.colorName === 'PURPLE' && '🟣'}
                {led.colorName === 'RAINBOW' && '🌈'}
              </div>
              <div className="leading-snug">
                <div className="text-white text-xs uppercase tracking-wider font-sans font-bold">LED Status: {led.colorName} ({led.mode})</div>
                <div className="text-sm mt-0.5 font-mono">{led.statusMessage}</div>
              </div>
            </div>
          </div>

          {/* 1-Tap Interactive Drop Testing Panel */}
          <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Simulate Hardware Waste Deposit
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">Triggers LED + Auto-Credit</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => handleSimDrop('PLASTIC_BOTTLE')}
                disabled={isProcessing || isLocked}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-blue-500/30 text-left transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
              >
                <div className="text-xl mb-1">🥤</div>
                <div className="font-bold text-xs text-white">Voltic PET Bottle</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5">+2 Pts • 🟢 Green LED</div>
              </button>

              <button
                onClick={() => handleSimDrop('SACHET')}
                disabled={isProcessing || isLocked}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-blue-500/30 text-left transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
              >
                <div className="text-xl mb-1">💧</div>
                <div className="font-bold text-xs text-white">Pure Water Sachet</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5">+1 Pt • 🟢 Green LED</div>
              </button>

              <button
                onClick={() => handleSimDrop('CAN')}
                disabled={isProcessing || isLocked}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-left transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
              >
                <div className="text-xl mb-1">🥫</div>
                <div className="font-bold text-xs text-white">Beverage Can</div>
                <div className="text-[10px] text-amber-400 font-bold mt-0.5">+3 Pts • 🟢 Green LED</div>
              </button>

              <button
                onClick={() => handleSimDrop('PAPER')}
                disabled={isProcessing || isLocked}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-left transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
              >
                <div className="text-xl mb-1">📦</div>
                <div className="font-bold text-xs text-white">Cardboard Box</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5">+4 Pts • 🟢 Green LED</div>
              </button>

              <button
                onClick={() => handleSimDrop('CONTAMINANT')}
                disabled={isProcessing}
                className="p-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 text-left transition-all hover:scale-[1.02] cursor-pointer col-span-2 sm:col-span-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">⚠️ 🔋</span>
                  <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">Test Contaminant</span>
                </div>
                <div className="font-bold text-xs text-white mt-1">Hazardous Battery / Non-Recyclable</div>
                <div className="text-[10px] text-rose-400 font-bold mt-0.5">Triggers 🔴 Red Strobe & Rejection Buzzer</div>
              </button>
            </div>
          </div>

          {/* Multi-Chamber Realtime Breakdown */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Chamber Compartments
            </h5>
            <div className="space-y-2">
              {bin.chambers.map((ch) => (
                <div key={ch.id} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: ch.colorCode }}
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{ch.name}</span>
                      <span className="text-[10px] text-slate-400">{ch.currentWeightKg} kg / {ch.capacityKg} kg</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-mono font-black text-slate-200">{ch.fillLevel}%</span>
                    </div>
                    <div className="w-16 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${ch.fillLevel}%`,
                          backgroundColor: ch.fillLevel >= 85 ? '#EF4444' : ch.colorCode
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
