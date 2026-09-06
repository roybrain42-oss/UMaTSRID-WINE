import React, { useState, useEffect } from 'react';
import { 
  X, 
  WifiOff, 
  Wifi, 
  RefreshCw, 
  Database, 
  HardDrive, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Scale, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Info,
  Server,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { QueuedOfflineSubmission } from '../../types/offline';
import { offlineQueueService } from '../../services/offlineQueue';

export const OfflineQueueModal: React.FC = () => {
  const { 
    showOfflineQueueModal, 
    setShowOfflineQueueModal,
    isOnline,
    isSimulatedOffline,
    setIsSimulatedOffline,
    effectiveIsOnline,
    pendingOfflineQueue,
    pendingOfflineCount,
    offlineStats,
    syncOfflineQueueNow,
    removeQueuedOfflineSubmission,
    clearOfflineQueue,
    addTestOfflineSubmission,
    lastCachedAt,
    saveToLocalCacheNow,
    clearLocalCacheData,
    t
  } = useEcoSort();

  const [activeTab, setActiveTab] = useState<'QUEUE' | 'STORAGE_DIAGNOSTICS' | 'TESTING'>('QUEUE');
  const [isSyncing, setIsSyncing] = useState(false);
  const [allSubmissions, setAllSubmissions] = useState<QueuedOfflineSubmission[]>([]);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (showOfflineQueueModal) {
      offlineQueueService.getAllQueued().then(items => {
        setAllSubmissions(items);
      });
    }
  }, [showOfflineQueueModal, pendingOfflineQueue]);

  if (!showOfflineQueueModal) return null;

  const handleSyncAll = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const result = await syncOfflineQueueNow();
      setSyncFeedback(`Successfully synced ${result.successCount} queued item(s) with EPA Ghana Circular Ledger!`);
      const updated = await offlineQueueService.getAllQueued();
      setAllSubmissions(updated);
    } catch (e: any) {
      setSyncFeedback(`Sync encountered an issue: ${e?.message || 'Check network connection'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    await removeQueuedOfflineSubmission(id);
    const updated = await offlineQueueService.getAllQueued();
    setAllSubmissions(updated);
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear all queued offline items?')) {
      await clearOfflineQueue();
      setAllSubmissions([]);
    }
  };

  const handleAddTest = async () => {
    await addTestOfflineSubmission();
    const updated = await offlineQueueService.getAllQueued();
    setAllSubmissions(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${
              !effectiveIsOnline 
                ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' 
                : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  Offline Persistence & Sync Center
                </h2>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                  !effectiveIsOnline 
                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' 
                    : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                }`}>
                  {!effectiveIsOnline ? '🟠 Offline Cache Mode' : '🟢 Online & Ready'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Service Worker Cache • IndexedDB State Persistence • Auto-Sync
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowOfflineQueueModal(false)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('QUEUE')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'QUEUE'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Queued Submissions ({pendingOfflineCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('STORAGE_DIAGNOSTICS')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'STORAGE_DIAGNOSTICS'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Storage & Service Worker</span>
          </button>

          <button
            onClick={() => setActiveTab('TESTING')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'TESTING'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulation Lab</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 max-h-[60vh]">
          {syncFeedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{syncFeedback}</span>
            </div>
          )}

          {/* TAB 1: QUEUE LIST */}
          {activeTab === 'QUEUE' && (
            <div className="space-y-4">
              {/* Controls bar */}
              <div className="flex items-center justify-between gap-3 flex-wrap bg-slate-850 p-3.5 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-white">{allSubmissions.length} Total items</span> in local persistence engine.
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddTest}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+ Add Test Upload</span>
                  </button>

                  {allSubmissions.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/20 flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  )}

                  <button
                    onClick={handleSyncAll}
                    disabled={isSyncing || pendingOfflineCount === 0 || !effectiveIsOnline}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : `Sync Pending (${pendingOfflineCount})`}</span>
                  </button>
                </div>
              </div>

              {allSubmissions.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-850/40 rounded-3xl border border-dashed border-slate-800 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-200">Offline Queue is Empty</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    All recycling submissions are synchronized. When you upload waste without internet access, items will be safely cached here and synced automatically when you reconnect.
                  </p>
                  <button
                    onClick={handleAddTest}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
                  >
                    <Plus className="w-4 h-4" />
                    Simulate An Offline Submission
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {allSubmissions.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.imageThumbnail || item.imageUrl} 
                          alt="Waste Item" 
                          className="w-14 h-14 rounded-xl object-cover border border-slate-700 bg-slate-900 shrink-0" 
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{item.classification.material}</span>
                            <span className={`text-[10px] font-black px-2 py-0.2 rounded-full border ${
                              item.status === 'QUEUED'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : item.status === 'SYNCED'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            }`}>
                              {item.status === 'QUEUED' ? '⏳ Queued Offline' : item.status === 'SYNCED' ? '✅ Synced to EPA Ledger' : '❌ Failed'}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                            <span className="flex items-center gap-1 text-slate-300">
                              <Scale className="w-3 h-3 text-emerald-400" />
                              {item.userWeightEstimateKg} kg
                            </span>
                            <span className="flex items-center gap-1 text-slate-300">
                              <MapPin className="w-3 h-3 text-blue-400" />
                              {item.community}
                            </span>
                            <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                              <Clock className="w-3 h-3" />
                              {item.queuedAt}
                            </span>
                          </div>

                          {item.notes && (
                            <p className="text-[11px] text-slate-400 italic">"{item.notes}"</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <div className="text-right mr-2 hidden sm:block">
                          <span className="font-black text-xs text-emerald-400 block">
                            +{item.classification.estimatedPoints} Pts
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">ID: {item.id.slice(0, 10)}...</span>
                        </div>

                        {item.status === 'QUEUED' && effectiveIsOnline && (
                          <button
                            onClick={handleSyncAll}
                            className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                            title="Sync this item now"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 transition-colors"
                          title="Delete from local queue"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STORAGE & SERVICE WORKER DIAGNOSTICS */}
          {activeTab === 'STORAGE_DIAGNOSTICS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Storage Engine */}
                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-blue-400" />
                      Storage Engine
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {offlineStats?.storageEngine || 'IndexedDB'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    High-capacity local persistence with automatic LocalStorage fallback mirror.
                  </p>
                </div>

                {/* Service Worker Status */}
                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      Service Worker
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Active (v2.1.0)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Pre-cached app shell, stale-while-revalidate strategy, and background sync tags.
                  </p>
                </div>

                {/* Estimated Storage Usage */}
                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                      Queue Storage Footprint
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {((offlineStats?.totalSizeEstimatedBytes || 0) / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Image payloads are automatically compressed to ensure minimal device footprint.
                  </p>
                </div>

                {/* Connectivity Protocol */}
                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      EPA Ledger Reconnect
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Auto-Polling + Event
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Sync triggers immediately upon <code className="text-[11px] text-emerald-300 bg-slate-900 px-1 py-0.2 rounded font-mono">window.online</code> event or background sync message.
                  </p>
                </div>
              </div>

              {/* IndexedDB Dashboard Cache Manager */}
              <div className="p-4 rounded-2xl bg-slate-850 border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">IndexedDB Dashboard State Cache</h4>
                      <p className="text-[11px] text-slate-400">
                        {lastCachedAt ? `Complete stats snapshot active (Cached at ${lastCachedAt})` : 'Active on device'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => saveToLocalCacheNow()}
                      className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Take Snapshot Now</span>
                    </button>
                    <button
                      onClick={() => clearLocalCacheData()}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 text-xs font-medium border border-slate-700 transition-colors"
                    >
                      Clear Cache
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300">
                  User profile metrics, waste submissions, transaction receipts, and eco-points are cached continuously in IndexedDB so your dashboard and historical stats stay loaded when offline.
                </p>
              </div>

              {/* Cache Strategy Explanation */}
              <div className="p-4 rounded-2xl bg-slate-850/60 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-400" />
                  Offline Architectural Specifications
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                  <li><strong>Offline Optical Classification:</strong> On-device heuristic resin classifier provides instant material estimation without network latency.</li>
                  <li><strong>Local Database Store:</strong> IndexedDB guarantees persistence across app reloads, low-battery browser closures, and network drops.</li>
                  <li><strong>Automatic Sync:</strong> As soon as connectivity is re-established, the sync dispatcher securely broadcasts the queued batches to the backend ledger.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: SIMULATION LAB */}
          {activeTab === 'TESTING' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      {isSimulatedOffline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
                      Network Connectivity Simulation
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Toggle offline mode to test submitting waste without internet connectivity.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsSimulatedOffline(prev => !prev)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                      isSimulatedOffline 
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    {isSimulatedOffline ? 'Simulating Offline 🔴' : 'Simulating Online 🟢'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-xs text-white">1. Add Test Offline PET Batch</h4>
                  <p className="text-[11px] text-slate-400">
                    Injects a sample 3.2 kg PET plastic bottles upload directly into the offline queue.
                  </p>
                  <button
                    onClick={handleAddTest}
                    className="w-full py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Inject Test Submission
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-xs text-white">2. Trigger Reconnection Sync</h4>
                  <p className="text-[11px] text-slate-400">
                    Reconnects network and runs full sync batch process with celebration sound and toasts.
                  </p>
                  <button
                    onClick={async () => {
                      setIsSimulatedOffline(false);
                      setTimeout(() => {
                        handleSyncAll();
                      }, 200);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Reconnect & Sync All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${effectiveIsOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{effectiveIsOnline ? 'EPA Ghana Node: Connected' : 'EPA Ghana Node: Disconnected (Local Queue Active)'}</span>
          </div>

          <button
            onClick={() => setShowOfflineQueueModal(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            Close Center
          </button>
        </div>
      </div>
    </div>
  );
};
