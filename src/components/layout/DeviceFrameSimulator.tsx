import React from 'react';
import { Smartphone, Monitor, X, RotateCcw, Zap, Wifi, Battery, Signal } from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';

interface DeviceFrameSimulatorProps {
  children: React.ReactNode;
}

export const DeviceFrameSimulator: React.FC<DeviceFrameSimulatorProps> = ({ children }) => {
  const { isDeviceFrameMode, setIsDeviceFrameMode } = useEcoSort();

  if (!isDeviceFrameMode) {
    return <>{children}</>;
  }

  const now = new Date();
  const timeString = `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-6 select-none relative overflow-x-hidden">
      
      {/* Top Floating Control Bar on Desktop */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 text-xs text-slate-300 shadow-xl">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white">Mobile App Simulator (Android / iOS)</span>
        </div>

        <button
          onClick={() => setIsDeviceFrameMode(false)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors border border-slate-700"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Exit Frame Mode</span>
        </button>
      </div>

      {/* Smartphone Device Mockup Body */}
      <div className="w-full max-w-[420px] h-[860px] max-h-[94vh] bg-slate-900 rounded-[50px] p-3.5 shadow-[0_25px_70px_rgba(0,0,0,0.8)] border-[10px] border-slate-800 relative flex flex-col overflow-hidden ring-1 ring-slate-700/50">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-2.5 shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
          <div className="w-2 h-2 rounded-full bg-blue-500/80 animate-pulse" />
        </div>

        {/* Smartphone Virtual Status Bar */}
        <div className="w-full pt-1.5 pb-1 px-6 flex justify-between items-center text-[11px] font-bold text-white z-40 bg-[#0F172A] shrink-0">
          <span>{timeString}</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Smartphone Viewport Screen Scroll Container */}
        <div className="w-full flex-1 bg-[#F8FAFC] dark:bg-slate-900 rounded-[38px] overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </div>

        {/* Smartphone Bottom Home Bar */}
        <div className="w-full h-5 bg-[#0F172A] flex items-center justify-center shrink-0">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>

      </div>

    </div>
  );
};
