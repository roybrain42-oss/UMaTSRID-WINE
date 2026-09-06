import React, { useState } from 'react';
import { 
  SmartDustBin, 
  LedColorName, 
  LedPattern, 
  LedMode 
} from '../../types/smartBin';
import { 
  Sparkles, 
  Sliders, 
  Send, 
  RotateCcw, 
  Volume2, 
  Play, 
  Check, 
  AlertCircle, 
  Radio, 
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { soundEffects } from '../../utils/audioChime';

interface SmartBinLedStudioProps {
  bin: SmartDustBin;
  onUpdateLed: (binId: string, ledConfig: any) => void;
}

export const SmartBinLedStudio: React.FC<SmartBinLedStudioProps> = ({
  bin,
  onUpdateLed
}) => {
  const [selectedColor, setSelectedColor] = useState<LedColorName>(bin.ledIndicator.colorName);
  const [selectedPattern, setSelectedPattern] = useState<LedPattern>(bin.ledIndicator.pattern);
  const [brightness, setBrightness] = useState<number>(bin.ledIndicator.brightness);
  const [customMessage, setCustomMessage] = useState<string>(bin.ledIndicator.statusMessage);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [lastSentSuccess, setLastSentSuccess] = useState<boolean>(false);

  const COLOR_PALETTE: { name: LedColorName; hex: string; label: string; desc: string }[] = [
    { name: 'GREEN', hex: '#10B981', label: '🟢 Green (Ready)', desc: 'Item verified, lid unlocked, ready for deposit' },
    { name: 'AMBER', hex: '#F59E0B', label: '🟡 Amber (Warning)', desc: '75-89% fill level, high capacity alert' },
    { name: 'RED', hex: '#EF4444', label: '🔴 Red (Alert/Full)', desc: '90%+ capacity reached or contaminant detected' },
    { name: 'BLUE', hex: '#3B82F6', label: '🔵 Blue (Scanning)', desc: 'Optical sensor analysis & WiFi mesh sync' },
    { name: 'PURPLE', hex: '#8B5CF6', label: '🟣 Purple (Reward)', desc: 'EcoPoints multiplier & jackpot drops' },
    { name: 'RAINBOW', hex: '#EC4899', label: '🌈 Rainbow (Celebration)', desc: 'Dynamic festival mode & goal completions' },
    { name: 'CYAN', hex: '#06B6D4', label: '💠 Cyan (Standby)', desc: 'Low-power solar sleep & mesh ping' },
  ];

  const PATTERNS: { id: LedPattern; label: string; desc: string }[] = [
    { id: 'STEADY', label: 'Steady Solid', desc: 'Constant continuous illumination' },
    { id: 'BREATHING', label: 'Breathing Glow', desc: 'Smooth pulsing sine-wave fade' },
    { id: 'PULSE', label: 'Rhythmic Pulse', desc: 'Standard alert heartbeat' },
    { id: 'CHASE', label: 'Rotational Chase', desc: 'Fast circular radar sweep' },
    { id: 'RAPID_BLINK', label: 'Rapid Strobe', desc: 'Emergency or contaminant warning' },
    { id: 'RAINBOW_SWIRL', label: 'Rainbow Swirl', desc: 'Full-spectrum RGB chromatic cycle' },
  ];

  const handleApplyPreset = (mode: LedMode) => {
    switch (mode) {
      case 'IDLE_READY':
        setSelectedColor('GREEN');
        setSelectedPattern('BREATHING');
        setCustomMessage('🟢 READY: Insert Clean Plastic Bottles or Sachets');
        break;
      case 'SCANNING':
        setSelectedColor('BLUE');
        setSelectedPattern('CHASE');
        setCustomMessage('🔵 SCANNING: Analyzing Optical Resins...');
        break;
      case 'BIN_FULL':
        setSelectedColor('RED');
        setSelectedPattern('RAPID_BLINK');
        setCustomMessage('🔴 FULL (90%+): Lid Locked - Collection Dispatched');
        break;
      case 'RAINBOW_REWARD':
        setSelectedColor('RAINBOW');
        setSelectedPattern('RAINBOW_SWIRL');
        setCustomMessage('🌈 BONUS REWARD: +25 EcoPoints Jackpot Awarded!');
        break;
    }
  };

  const handlePushToMcu = async () => {
    setIsSending(true);
    setLastSentSuccess(false);

    const foundColor = COLOR_PALETTE.find(c => c.name === selectedColor) || COLOR_PALETTE[0];

    try {
      // Send command to backend server endpoint
      await fetch(`/api/smart-bins/${bin.id}/led-command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          color: selectedColor,
          pattern: selectedPattern,
          brightness,
          message: customMessage
        })
      });

      // Update local state in context
      onUpdateLed(bin.id, {
        colorName: selectedColor,
        colorHex: foundColor.hex,
        pattern: selectedPattern,
        brightness,
        statusMessage: customMessage,
        mode: selectedColor === 'GREEN' ? 'IDLE_READY' : selectedColor === 'RED' ? 'BIN_FULL' : selectedColor === 'BLUE' ? 'SCANNING' : 'MANUAL_TEST'
      });

      soundEffects.playPointChime();
      setLastSentSuccess(true);
      setTimeout(() => setLastSentSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to send LED command:', e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            LED Indicator Pattern & Behavior Studio
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure live RGB color states, animation frequencies, and optical alerts for {bin.name}
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleApplyPreset('IDLE_READY')}
            className="px-2.5 py-1 text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 rounded-lg cursor-pointer"
          >
            🟢 Ready
          </button>
          <button
            onClick={() => handleApplyPreset('SCANNING')}
            className="px-2.5 py-1 text-xs font-bold text-blue-400 hover:bg-blue-500/10 rounded-lg cursor-pointer"
          >
            🔵 Scan
          </button>
          <button
            onClick={() => handleApplyPreset('BIN_FULL')}
            className="px-2.5 py-1 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
          >
            🔴 Full
          </button>
          <button
            onClick={() => handleApplyPreset('RAINBOW_REWARD')}
            className="px-2.5 py-1 text-xs font-bold text-purple-400 hover:bg-purple-500/10 rounded-lg cursor-pointer"
          >
            🌈 Rainbow
          </button>
        </div>
      </div>

      {/* 1. Color Palette Selection */}
      <div className="space-y-2.5">
        <label className="text-xs font-black uppercase tracking-wider text-slate-300 block">
          1. Select Primary LED Color State
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {COLOR_PALETTE.map((c) => {
            const isSelected = selectedColor === c.name;
            return (
              <button
                key={c.name}
                onClick={() => {
                  setSelectedColor(c.name);
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isSelected 
                    ? 'bg-slate-800 border-emerald-400 shadow-md ring-1 ring-emerald-400' 
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-5 h-5 rounded-full shadow-lg transition-transform"
                    style={{
                      backgroundColor: c.hex,
                      boxShadow: `0 0 10px ${c.hex}`
                    }}
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">{c.label}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{c.desc}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Pattern Animation Mode */}
      <div className="space-y-2.5">
        <label className="text-xs font-black uppercase tracking-wider text-slate-300 block">
          2. Select NeoPixel Animation Pattern
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {PATTERNS.map((p) => {
            const isSelected = selectedPattern === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPattern(p.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-800 border-blue-400 shadow-md ring-1 ring-blue-400' 
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{p.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Brightness Slider & LCD Custom Status Text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>LED Ring Brightness (PWM)</span>
            <span className="text-emerald-400 font-mono">{brightness}% (Level {Math.round(brightness * 2.55)})</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>10% (Night Eco)</span>
            <span>50% (Standard)</span>
            <span>100% (High Daylight)</span>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300 block">
            Status Message on LCD / Webhook
          </label>
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="e.g. 🟢 READY: Insert Plastic Bottles"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Action Button: Broadcast to Microcontroller */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Radio className="w-4 h-4 text-emerald-400" />
          <span>Streams via <strong className="text-slate-300">HTTP REST & MQTT Webhook</strong> directly to ESP32 / Arduino</span>
        </div>

        <button
          onClick={handlePushToMcu}
          disabled={isSending}
          className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg transition-all ${
            lastSentSuccess 
              ? 'bg-emerald-500 text-slate-950 scale-105' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 hover:scale-[1.02]'
          }`}
        >
          {isSending ? (
            <>
              <Cpu className="w-4 h-4 animate-spin" />
              Broadcasting to Bin...
            </>
          ) : lastSentSuccess ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              LED Pattern Synced!
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Apply Pattern & Sync Hardware ⚡
            </>
          )}
        </button>
      </div>
    </div>
  );
};
