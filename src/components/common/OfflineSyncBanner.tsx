import React, { useState } from 'react';
import { 
  WifiOff, 
  Wifi, 
  RefreshCw, 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Database, 
  Zap,
  Layers,
  X
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';

export const OfflineSyncBanner: React.FC = () => {
  const { 
    isOnline, 
    isSimulatedOffline, 
    setIsSimulatedOffline, 
    effectiveIsOnline,
    pendingOfflineCount,
    syncOfflineQueueNow,
    setShowOfflineQueueModal,
    lastCachedAt,
    t
  } = useEcoSort();

  const [isSyncing, setIsSyncing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await syncOfflineQueueNow();
    } finally {
      setIsSyncing(false);
    }
  };

  // If online and no items pending and not dismissed, show nothing or brief status
  if (effectiveIsOnline && pendingOfflineCount === 0) {
    return null;
  }

  return (
    <aside 
      aria-label="Offline and sync status"
      className="fixed bottom-16 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className={`p-3.5 sm:p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all ${
        !effectiveIsOnline 
          ? 'bg-slate-900/95 border-amber-500/50 shadow-amber-950/40 text-white'
          : 'bg-slate-900/95 border-emerald-500/50 shadow-emerald-950/40 text-white'
      }`}>
        <div className="flex items-start justify-between gap-3">
          {/* Icon & Title */}
          <div className="flex items-start gap-2.5">
            <div className={`p-2 rounded-xl border shrink-0 ${
              !effectiveIsOnline 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 animate-pulse'
            }`}>
              {!effectiveIsOnline ? (
                <WifiOff className="w-4 h-4" />
              ) : (
                <Wifi className="w-4 h-4" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-xs tracking-tight">
                  {!effectiveIsOnline ? 'Offline Queue Active' : 'Connection Restored'}
                </span>
                {isSimulatedOffline && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-bold border border-purple-400/30">
                    Simulated
                  </span>
                )}
                {pendingOfflineCount > 0 && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                    {pendingOfflineCount} {pendingOfflineCount === 1 ? 'upload' : 'uploads'} pending
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                {!effectiveIsOnline 
                  ? `IndexedDB active. Dashboard stats & uploads preserved offline.${lastCachedAt ? ` (Snapshot: ${lastCachedAt})` : ''}`
                  : `Online connection restored! ${pendingOfflineCount > 0 ? 'Ready to sync queued waste uploads.' : 'All data synced with EPA Ledger.'}`
                }
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOfflineQueueModal(true)}
              className="text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
            >
              <HardDrive className="w-3 h-3 text-blue-400" />
              <span>Manage Queue ({pendingOfflineCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!effectiveIsOnline ? (
              <button
                onClick={() => setIsSimulatedOffline(false)}
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-colors flex items-center gap-1"
                title="Reconnect network simulation"
              >
                <Wifi className="w-3 h-3" />
                <span>Go Online</span>
              </button>
            ) : (
              <button
                onClick={handleManualSync}
                disabled={isSyncing || pendingOfflineCount === 0}
                className="text-[11px] font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 px-3 py-1 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync All Now'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
