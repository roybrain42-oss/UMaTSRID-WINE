import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  RefreshCw, 
  X, 
  CloudCheck, 
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';
import { Toast } from '../../types';
import { useEcoSort } from '../../context/EcoSortContext';

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const [progress, setProgress] = useState<number>(100);
  const duration = toast.duration || (toast.type === 'sync' ? 4500 : 4000);

  useEffect(() => {
    if (toast.type === 'sync' && toast.syncState === 'syncing') {
      // Don't auto-dismiss while actively syncing
      return;
    }

    // Auto-dismiss timer outside of setState updater
    const dismissTimer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    // Wall-clock progress animation timer
    const startTime = Date.now();
    const intervalTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remainingPct);
      if (remainingPct <= 0) {
        clearInterval(intervalTimer);
      }
    }, 50);

    return () => {
      clearTimeout(dismissTimer);
      clearInterval(intervalTimer);
    };
  }, [duration, onClose, toast.id, toast.type, toast.syncState]);

  // Color theme by toast type
  const getColors = () => {
    switch (toast.type) {
      case 'sync':
        return {
          bg: 'bg-slate-900/95 border-blue-500/40 text-white shadow-blue-500/10',
          iconBg: 'bg-blue-500/20 text-blue-400 border border-blue-400/30',
          barColor: 'bg-blue-500',
          badgeText: 'text-blue-300 bg-blue-500/20 border-blue-400/30'
        };
      case 'success':
        return {
          bg: 'bg-slate-900/95 border-emerald-500/40 text-white shadow-emerald-500/10',
          iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30',
          barColor: 'bg-emerald-500',
          badgeText: 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30'
        };
      case 'warning':
        return {
          bg: 'bg-slate-900/95 border-amber-500/40 text-white shadow-amber-500/10',
          iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-400/30',
          barColor: 'bg-amber-500',
          badgeText: 'text-amber-300 bg-amber-500/20 border-amber-400/30'
        };
      case 'error':
        return {
          bg: 'bg-slate-900/95 border-rose-500/40 text-white shadow-rose-500/10',
          iconBg: 'bg-rose-500/20 text-rose-400 border border-rose-400/30',
          barColor: 'bg-rose-500',
          badgeText: 'text-rose-300 bg-rose-500/20 border-rose-400/30'
        };
      case 'points':
        return {
          bg: 'bg-slate-900/95 border-amber-500/40 text-white shadow-amber-500/10',
          iconBg: 'bg-amber-500/20 text-amber-300 border border-amber-400/30',
          barColor: 'bg-amber-400',
          badgeText: 'text-amber-300 bg-amber-500/20 border-amber-400/30'
        };
      default:
        return {
          bg: 'bg-slate-900/95 border-slate-700 text-white shadow-slate-900/20',
          iconBg: 'bg-blue-500/20 text-blue-400 border border-blue-400/30',
          barColor: 'bg-blue-500',
          badgeText: 'text-blue-300 bg-blue-500/20 border-blue-400/30'
        };
    }
  };

  const colors = getColors();

  return (
    <div 
      className={`relative w-full max-w-sm rounded-2xl p-4 border backdrop-blur-md shadow-2xl transition-all transform animate-in slide-in-from-top-4 fade-in duration-200 overflow-hidden ${colors.bg}`}
      role="alert"
    >
      {/* Top Header Row */}
      <div className="flex items-start gap-3">
        {/* Left Type Icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colors.iconBg}`}>
          {toast.type === 'sync' ? (
            toast.syncState === 'synced' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
            )
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : toast.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h4 className="text-xs font-bold text-white tracking-tight">
              {toast.title}
            </h4>
            {toast.type === 'sync' && (
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${colors.badgeText} flex items-center gap-1`}>
                <Database className="w-2.5 h-2.5" />
                {toast.syncState === 'synced' ? 'SYNCHRONIZED' : 'EPA GRID SYNC'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {toast.message}
          </p>

          {/* Action button if present */}
          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick();
                onClose(toast.id);
              }}
              className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
            >
              <span>{toast.action.label}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => onClose(toast.id)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Linear Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/80 overflow-hidden">
        <div 
          style={{ width: `${progress}%` }} 
          className={`h-full transition-all duration-75 ${colors.barColor}`} 
        />
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useEcoSort();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div 
      aria-live="polite" 
      className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-auto items-end"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};
