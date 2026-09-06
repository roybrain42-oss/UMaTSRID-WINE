import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  PlusCircle, 
  MinusCircle, 
  Sparkles, 
  AlertCircle,
  Award,
  CheckCircle2
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { UserProfile } from '../../types';

interface AdminAdjustPointsModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAdjustPointsModal: React.FC<AdminAdjustPointsModalProps> = ({ user, isOpen, onClose }) => {
  const { adjustUserPoints } = useEcoSort();

  const [mode, setMode] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [pointsAmount, setPointsAmount] = useState<number>(50);
  const [reason, setReason] = useState('Community Clean-up Milestone Bonus');

  if (!isOpen || !user) return null;

  const quickPresets = [
    { label: '🌟 Community Clean-up Bonus (+100)', pts: 100, m: 'CREDIT' as const, r: 'Community Clean-up Milestone Bonus' },
    { label: '🎯 High Sorting Accuracy (+50)', pts: 50, m: 'CREDIT' as const, r: 'Exceptional sorting accuracy inspection award' },
    { label: '🏆 School Campus Challenge Award (+250)', pts: 250, m: 'CREDIT' as const, r: 'National Green School Campus Challenge prize' },
    { label: '⚠️ Contamination Correction (-30)', pts: 30, m: 'DEBIT' as const, r: 'Waste stream non-recyclable contamination deduction' },
    { label: '🔄 Manual Scale Calibration Adjust (+20)', pts: 20, m: 'CREDIT' as const, r: 'Disputed weight scale calibration adjustment' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pointsAmount <= 0) return;

    const delta = mode === 'CREDIT' ? pointsAmount : -pointsAmount;
    adjustUserPoints(user.id, delta, reason);
    onClose();
  };

  const calculatedBalance = mode === 'CREDIT' 
    ? user.ecoPoints + pointsAmount 
    : Math.max(0, user.ecoPoints - pointsAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 p-6 text-white flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-400/30 text-amber-400">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Adjust EcoPoints Balance</h2>
              <p className="text-xs text-slate-300">
                Target User: <span className="font-bold text-white">{user.name}</span> ({user.role})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Current & Projected Balance Card */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Balance</span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                {user.ecoPoints} Pts
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">New Balance</span>
              <span className={`text-xl font-black font-mono ${mode === 'CREDIT' ? 'text-emerald-500' : 'text-amber-500'}`}>
                {calculatedBalance} Pts
              </span>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('CREDIT')}
              className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === 'CREDIT'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-500" />
              Credit Points (+)
            </button>

            <button
              type="button"
              onClick={() => setMode('DEBIT')}
              className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === 'DEBIT'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <MinusCircle className="w-4 h-4 text-rose-500" />
              Debit Points (-)
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Points Amount
            </label>
            <div className="relative">
              <Coins className="w-4 h-4 text-amber-500 absolute left-3 top-3.5" />
              <input
                type="number"
                min="1"
                max="50000"
                required
                value={pointsAmount}
                onChange={(e) => setPointsAmount(parseInt(e.target.value) || 0)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-black font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Audit Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Official Reason / Audit Note *
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State reason for point adjustment"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick EPA Presets
            </label>
            <div className="flex flex-col gap-1.5">
              {quickPresets.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setPointsAmount(preset.pts);
                    setMode(preset.m);
                    setReason(preset.r);
                  }}
                  className="text-left px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{preset.label}</span>
                  <span className="font-mono text-[10px] text-slate-400">{preset.pts} Pts</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Apply Adjustment
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
