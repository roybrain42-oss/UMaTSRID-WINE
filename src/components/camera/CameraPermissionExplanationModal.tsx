import React from 'react';
import {
  Camera,
  ShieldCheck,
  Sparkles,
  Lock,
  Eye,
  CheckCircle2,
  X,
  Zap,
  ArrowRight,
  Layers
} from 'lucide-react';

interface CameraPermissionExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGrantAccess: () => void;
  onUsePresetsInstead?: () => void;
}

export const CameraPermissionExplanationModal: React.FC<CameraPermissionExplanationModalProps> = ({
  isOpen,
  onClose,
  onGrantAccess,
  onUsePresetsInstead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col relative transform transition-all">
        
        {/* Top Header Graphic & Close */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-6 text-white overflow-hidden">
          {/* Background Decorative Rings */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-teal-400/20 rounded-full blur-xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 shadow-inner flex-shrink-0">
              <Camera className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="bg-emerald-400/25 border border-emerald-300/30 text-emerald-100 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  EPA Ghana AI Vision
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                Camera Access Needed
              </h3>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Real-time optical recognition for recyclable waste
              </p>
            </div>
          </div>
        </div>

        {/* Informative Body Content */}
        <div className="p-6 space-y-5">
          
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            To automatically identify plastic resin codes, aluminum cans, cardboard packaging, and pure water sachets, EcoSort Ghana uses real-time computer vision right from your lens.
          </p>

          {/* Reasons List */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
              <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Instant SPI Resin & Material Recognition
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Identifies PET #1, HDPE #2, LDPE #4 water sachets, metals, and cardboard within seconds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
              <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Automated Reward Rate & Weight Calculation
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Calculates your exact EcoPoints and Mobile Money cash redemption rate automatically.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Privacy & Ghana Data Protection Compliant</span>
                  <span className="text-[9px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded font-mono text-slate-700 dark:text-slate-300">
                    GDPC 2012
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Your camera is only active while scanning waste. No personal facial data is recorded or stored.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>Your browser will prompt you to click <strong>"Allow"</strong> on the next step.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={onGrantAccess}
              className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all transform active:scale-98"
            >
              <Camera className="w-4 h-4" />
              <span>Grant Camera Access</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {onUsePresetsInstead ? (
              <button
                type="button"
                onClick={onUsePresetsInstead}
                className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                <span>Use Sample Presets</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
              >
                Not Now
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
