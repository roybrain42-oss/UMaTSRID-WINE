import React from 'react';
import { useEcoSort } from '../../context/EcoSortContext';
import { Cpu, ArrowRight, Sparkles, MapPin, Zap, Layers } from 'lucide-react';

export const SmartBinQuickWidget: React.FC = () => {
  const { smartBins, setCurrentView, setSelectedSmartBin, effectiveIsOnline } = useEcoSort();

  const primaryBin = smartBins[0];
  if (!primaryBin) return null;

  const led = primaryBin.ledIndicator;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
      <div 
        className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: led.colorHex }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          {/* Glowing LED Ring Mini Node */}
          <div 
            className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center relative shadow-lg bg-slate-950 shrink-0"
            style={{
              borderColor: led.colorHex,
              boxShadow: `0 0 15px ${led.colorHex}55`
            }}
          >
            <div 
              className="w-4 h-4 rounded-full animate-ping"
              style={{ backgroundColor: led.colorHex }}
            />
            <Cpu className="w-5 h-5 text-white absolute" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                Nearest Smart Dust Bin • {led.colorName} LED Active
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                Live
              </span>
            </div>
            <h4 className="text-sm font-black text-white">{primaryBin.name}</h4>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-500" />
              <span>{primaryBin.location} ({primaryBin.overallFillLevel}% capacity)</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSelectedSmartBin(primaryBin);
              setCurrentView('smart-bin');
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-[1.02] transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            Connect & Deposit
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
