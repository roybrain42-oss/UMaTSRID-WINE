import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Flame, 
  Trophy, 
  MapPin, 
  Sparkles, 
  Gift, 
  X, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Zap,
  Sliders,
  ExternalLink,
  Lightbulb
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { SimulatedPushAlert } from '../../types/pushNotification';

export const PushNotificationBanner: React.FC = () => {
  const { 
    activePushBanner, 
    dismissActivePushBanner, 
    claimPushReward,
    setCurrentView,
    setShowPushSimulationModal,
    setShowCashOutModal,
    pushSettings,
    updatePushSettings,
    triggerCelebration,
    addToast
  } = useEcoSort();

  const [progress, setProgress] = useState<number>(100);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const DURATION_MS = 8500;
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (!activePushBanner) {
      setProgress(100);
      return;
    }

    const startTime = Date.now();
    setProgress(100);

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / DURATION_MS) * 100);
        setProgress(remaining);

        if (remaining <= 0) {
          clearInterval(intervalRef.current);
          dismissActivePushBanner();
        }
      }
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activePushBanner, isPaused, dismissActivePushBanner]);

  if (!activePushBanner) return null;

  const handleActionClick = () => {
    // If it has bonus points, claim reward
    if (activePushBanner.bonusPointsReward && !activePushBanner.claimed) {
      claimPushReward(activePushBanner.id, activePushBanner.bonusPointsReward);
      triggerCelebration();
    }

    // If it's a cash boost or MoMo request
    if (activePushBanner.category === 'REWARD_BOOST') {
      setShowCashOutModal(true);
    }

    // Navigate to target view if specified
    if (activePushBanner.actionTargetView) {
      setCurrentView(activePushBanner.actionTargetView);
    }

    // If it's a map action, give feedback
    if (activePushBanner.actionTab === 'NEARBY_MAP' && activePushBanner.hubName) {
      addToast({
        title: `📍 ${activePushBanner.hubName}`,
        message: `High-volume surge active (+${activePushBanner.bonusEcoPointsPercent || 20}% bonus points applied).`,
        type: 'points'
      });
    }

    dismissActivePushBanner();
  };

  const getCategoryIcon = () => {
    switch (activePushBanner.category) {
      case 'HUB_SURGE':
        return <Flame className="w-5 h-5 text-amber-400 animate-pulse" />;
      case 'COMPETITION_MILESTONE':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'DAILY_TIP':
        return <Lightbulb className="w-5 h-5 text-amber-400" />;
      case 'REWARD_BOOST':
        return <Zap className="w-5 h-5 text-emerald-400" />;
      case 'COMMUNITY_DRIVE':
        return <Sparkles className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const getCategoryBadge = () => {
    switch (activePushBanner.category) {
      case 'HUB_SURGE':
        return {
          label: '⚡ HIGH-VOLUME SURGE ALERT',
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        };
      case 'DAILY_TIP':
        return {
          label: '💡 DAILY RECYCLING WISDOM (10-MIN CYCLE)',
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        };
      case 'COMPETITION_MILESTONE':
        return {
          label: '🏆 COMPETITION MILESTONE REACHED',
          bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
        };
      case 'REWARD_BOOST':
        return {
          label: '💰 FLASH REWARD BOOST',
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        };
      case 'COMMUNITY_DRIVE':
        return {
          label: '🇬🇭 EPA COMMUNITY DRIVE',
          bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
        };
      default:
        return {
          label: '🔔 SMART GRID NOTIFICATION',
          bg: 'bg-slate-700 text-slate-200 border-slate-600'
        };
    }
  };

  const badgeInfo = getCategoryBadge();

  return (
    <aside
      aria-label="Simulated Push Alert Banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[460px] z-50 animate-in slide-in-from-top-4 fade-in duration-300 shadow-2xl rounded-2xl overflow-hidden border border-slate-700/90 bg-[#0B132B]/95 backdrop-blur-xl text-slate-100 ring-1 ring-white/10"
    >
      {/* Top Header Strip */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px]">
        <div className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="EcoSort" 
            className="w-5 h-5 rounded-md object-contain bg-white p-0.5 shadow-xs"
            referrerPolicy="no-referrer"
          />
          <span className="font-bold text-white tracking-tight">
            EcoSort <span className="text-[10px] text-emerald-400 font-mono">Push System</span>
          </span>
          <span className="text-[9px] text-slate-400 font-mono">• Just now</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Mute/Unmute toggle shortcut */}
          <button
            onClick={() => updatePushSettings({ soundEnabled: !pushSettings.soundEnabled })}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={pushSettings.soundEnabled ? 'Push chime enabled (click to mute)' : 'Push chime muted (click to unmute)'}
          >
            {pushSettings.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* Settings / Simulator Hub shortcut */}
          <button
            onClick={() => setShowPushSimulationModal(true)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Configure Push Simulation Studio"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dismiss button */}
          <button
            onClick={dismissActivePushBanner}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-0.5"
            title="Dismiss push alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Notification Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          {/* Icon Orb */}
          <div className="w-11 h-11 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center shrink-0 shadow-inner mt-0.5">
            {getCategoryIcon()}
          </div>

          {/* Texts */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeInfo.bg}`}>
                {badgeInfo.label}
              </span>
              {activePushBanner.surgeCapacityPercent && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/30">
                  {activePushBanner.surgeCapacityPercent}% Full
                </span>
              )}
            </div>

            <h4 className="font-bold text-sm text-white leading-snug">
              {activePushBanner.title}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activePushBanner.body}
            </p>
          </div>
        </div>

        {/* Action Button & Quick Claim CTA */}
        <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-mono">
            {isPaused ? '⏸️ Auto-dismiss paused' : '⏱️ Tap to respond'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={dismissActivePushBanner}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Dismiss
            </button>

            <button
              onClick={handleActionClick}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all hover:scale-102"
            >
              <span>{activePushBanner.actionLabel || 'View Live Status'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Auto-Dismiss Progress Bar */}
      <div className="h-1 bg-slate-800 w-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-amber-400 transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </aside>
  );
};
