import React, { useState } from 'react';
import { 
  Bell, 
  Flame, 
  Trophy, 
  Sparkles, 
  Zap, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Smartphone, 
  Clock, 
  CheckCircle2, 
  X, 
  Play, 
  Radio, 
  Sliders, 
  ShieldCheck, 
  ArrowRight,
  Info,
  RotateCcw,
  Trash2,
  Send,
  MapPin,
  Building2,
  Lightbulb
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { PUSH_NOTIFICATION_SCENARIOS } from '../../data/pushNotificationScenarios';
import { soundEffects } from '../../utils/audioChime';

export const PushNotificationCenterModal: React.FC = () => {
  const { 
    showPushSimulationModal, 
    setShowPushSimulationModal, 
    pushSettings, 
    updatePushSettings, 
    triggerSimulatedPush, 
    pushAlerts,
    addToast,
    triggerCelebration,
    setCurrentView
  } = useEcoSort();

  const [activeTab, setActiveTab] = useState<'TRIGGER_STUDIO' | 'SETTINGS' | 'HISTORY'>('TRIGGER_STUDIO');
  const [customTitle, setCustomTitle] = useState<string>('⚡ Surge Alert: Kasoa Buyback Center at 90%');
  const [customBody, setCustomBody] = useState<string>('High volume drop-offs arriving! Earn +25% bonus EcoPoints on all sorted metals & plastics.');
  const [customCategory, setCustomCategory] = useState<'HUB_SURGE' | 'COMPETITION_MILESTONE' | 'REWARD_BOOST'>('HUB_SURGE');

  if (!showPushSimulationModal) return null;

  const handleTestChime = () => {
    soundEffects.playPushChime();
    addToast({
      title: '🔊 Push Chime Played',
      message: 'Mobile dual-tone push chime generated via Web Audio API.',
      type: 'info'
    });
  };

  const handleTestFanfare = () => {
    soundEffects.playMilestoneFanfare();
    triggerCelebration();
    addToast({
      title: '🎺 Milestone Fanfare Played',
      message: 'Celebratory competition fanfare and confetti triggered!',
      type: 'points'
    });
  };

  const handleRequestNativePermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          updatePushSettings({ nativeBrowserPush: true });
          addToast({
            title: '✅ Browser Notifications Allowed',
            message: 'EcoSort can now send system push notifications even when backgrounded.',
            type: 'info'
          });
          new Notification('EcoSort Ghana 🇬🇭', {
            body: 'Push notifications successfully activated on your device!',
            icon: '/favicon.ico'
          });
        } else {
          updatePushSettings({ nativeBrowserPush: false });
          addToast({
            title: '⚠️ Permission Denied / Blocked',
            message: 'In-app simulated floating banners will continue to function normally.',
            type: 'info'
          });
        }
      } catch {
        addToast({
          title: 'Simulated Mode Active',
          message: 'Running in iframe sandbox. In-app floating banners active.',
          type: 'info'
        });
      }
    } else {
      addToast({
        title: 'Native Notification API Not Supported',
        message: 'In-app simulated floating push banners will be used.',
        type: 'info'
      });
    }
  };

  const handleSendCustomAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customBody.trim()) return;

    triggerSimulatedPush({
      id: `push-custom-${Date.now()}`,
      category: customCategory,
      title: customTitle,
      body: customBody,
      timestamp: 'Just now',
      timestampMs: Date.now(),
      actionLabel: customCategory === 'HUB_SURGE' ? '📍 View Surge on Map' : customCategory === 'COMPETITION_MILESTONE' ? '🏆 View Leaderboard' : '💰 View Rewards',
      actionTargetView: customCategory === 'COMPETITION_MILESTONE' ? 'leaderboard' : 'user-dashboard',
      actionTab: customCategory === 'HUB_SURGE' ? 'NEARBY_MAP' : undefined,
      bonusPointsReward: customCategory === 'COMPETITION_MILESTONE' ? 50 : undefined
    });

    addToast({
      title: '🚀 Push Alert Dispatched',
      message: 'Custom push notification broadcast to the client interface.',
      type: 'info'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-6 text-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 border-b border-slate-700/80">
          <button
            onClick={() => setShowPushSimulationModal(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 border border-slate-700 transition-colors"
            title="Close simulator modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold tracking-widest text-blue-300 uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30">
              SIMULATED PUSH NOTIFICATION STUDIO
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
            Live Push Alert Simulation Engine
          </h2>
          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-lg">
            Trigger simulated real-time push alerts for high-volume drop-off center surges, national recycling competition milestones, and flash reward boosts with authentic sound chimes.
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('TRIGGER_STUDIO')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'TRIGGER_STUDIO' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Trigger Test Alerts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SETTINGS')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'SETTINGS' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Automation & Sound</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('HISTORY')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'HISTORY' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Push History ({pushAlerts.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Instant Trigger Studio */}
        {activeTab === 'TRIGGER_STUDIO' && (
          <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
            
            {/* Quick Demo Scenarios Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pre-Configured Scenarios (1-Click Test):
                </span>
                <span className="text-[10px] text-blue-400 font-mono">
                  Instant Dispatch
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PUSH_NOTIFICATION_SCENARIOS.map((scenario) => {
                  const isSurge = scenario.category === 'HUB_SURGE';
                  const isMilestone = scenario.category === 'COMPETITION_MILESTONE';

                  return (
                    <div 
                      key={scenario.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSurge 
                          ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60' 
                          : isMilestone
                          ? 'bg-yellow-950/20 border-yellow-500/30 hover:border-yellow-500/60'
                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            isSurge 
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                              : isMilestone 
                              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          }`}>
                            {isSurge ? '⚡ Hub Surge' : isMilestone ? '🏆 Milestone' : '💰 MoMo Boost'}
                          </span>
                          {scenario.surgeCapacityPercent && (
                            <span className="text-[10px] font-bold text-amber-400">
                              {scenario.surgeCapacityPercent}% Full
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-xs text-white line-clamp-1">
                          {scenario.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {scenario.body}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          triggerSimulatedPush(scenario);
                          setShowPushSimulationModal(false);
                        }}
                        className={`mt-3 w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                          isSurge
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                            : isMilestone
                            ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 shadow-yellow-500/20'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                        }`}
                      >
                        <Send className="w-3 h-3" />
                        <span>Simulate Alert Now</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Alert Composer */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Compose Custom Push Alert:
                </span>
              </div>

              <form onSubmit={handleSendCustomAlert} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomCategory('HUB_SURGE')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      customCategory === 'HUB_SURGE'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-slate-900/60 text-slate-400 border-slate-700'
                    }`}
                  >
                    ⚡ Drop-Off Surge
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomCategory('COMPETITION_MILESTONE')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      customCategory === 'COMPETITION_MILESTONE'
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500'
                        : 'bg-slate-900/60 text-slate-400 border-slate-700'
                    }`}
                  >
                    🏆 Competition Milestone
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomCategory('REWARD_BOOST')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      customCategory === 'REWARD_BOOST'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-900/60 text-slate-400 border-slate-700'
                    }`}
                  >
                    💰 MoMo Boost
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Notification Headline:
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. ⚡ Surge Alert: Kasoa Buyback Center at 90%"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Notification Message Body:
                  </label>
                  <textarea
                    rows={2}
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="e.g. High volume drop-offs arriving! Earn +25% bonus EcoPoints..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Custom Push Notification</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* Tab 2: Settings & Automation */}
        {activeTab === 'SETTINGS' && (
          <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
            
            {/* Auto Periodic Simulation Interval */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    🤖 Autonomous Auto-Simulation Scheduler
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Automatically simulates incoming drop-off surges, competition milestones & daily tips every 10 minutes.
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  pushSettings.autoIntervalSeconds > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
                }`}>
                  {pushSettings.autoIntervalSeconds > 0 
                    ? `Active: Every ${Math.round(pushSettings.autoIntervalSeconds / 60)} min${Math.round(pushSettings.autoIntervalSeconds / 60) > 1 ? 's' : ''}` 
                    : 'Manual Only'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {[
                  { label: 'Manual Only', val: 0 },
                  { label: '3 mins', val: 180 },
                  { label: '5 mins', val: 300 },
                  { label: '10 mins (Default)', val: 600 },
                  { label: '15 mins', val: 900 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => {
                      updatePushSettings({ autoIntervalSeconds: item.val });
                      addToast({
                        title: 'Auto-Simulation Updated ⏱️',
                        message: item.val === 0 
                          ? 'Autonomous scheduler paused (manual triggers only).' 
                          : `Auto-simulation scheduled for every ${Math.round(item.val / 60)} minutes (${item.val}s).`,
                        type: 'info'
                      });
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                      pushSettings.autoIntervalSeconds === item.val
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                        : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound & Audio Synth Chime */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    🔊 Mobile Push Chime & Fanfare Sound Effects
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Synthetic Web Audio dual-tone chime and celebratory trumpet fanfare.
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => updatePushSettings({ soundEnabled: !pushSettings.soundEnabled })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    pushSettings.soundEnabled
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {pushSettings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{pushSettings.soundEnabled ? 'Enabled' : 'Muted'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestChime}
                  className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3 h-3 text-blue-400" />
                  <span>Preview Push Chime</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestFanfare}
                  className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  <span>Preview Milestone Fanfare</span>
                </button>
              </div>
            </div>

            {/* Category Preferences */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-bold text-white block">
                Filter Alert Categories:
              </span>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Drop-Off Center High-Volume Surges</span>
                      <span className="text-[10px] text-slate-400">Alerts when nearby community hubs exceed 85% capacity</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushSettings.hubSurgeAlerts}
                    onChange={(e) => updatePushSettings({ hubSurgeAlerts: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Recycling Competition Milestones</span>
                      <span className="text-[10px] text-slate-400">Campus cup milestones (10,000kg) and bonus point grants</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushSettings.competitionMilestoneAlerts}
                    onChange={(e) => updatePushSettings({ competitionMilestoneAlerts: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Flash MoMo Cashout Boosts</span>
                      <span className="text-[10px] text-slate-400">Limited-time zero-fee and boosted conversion rates</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushSettings.bonusRewardAlerts}
                    onChange={(e) => updatePushSettings({ bonusRewardAlerts: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">💡 10-Minute Daily Recycling Wisdom & Tips</span>
                      <span className="text-[10px] text-slate-400">Periodic waste management hacks with +5 bonus EcoPoints</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushSettings.dailyTipAlerts !== false}
                    onChange={(e) => updatePushSettings({ dailyTipAlerts: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            {/* Browser Native Push Permission */}
            <div className="bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  🌐 Browser Native Web Push API
                </span>
                <span className="text-[10px] text-slate-300">
                  Allow system-level OS banner notifications when browser tab is inactive.
                </span>
              </div>

              <button
                type="button"
                onClick={handleRequestNativePermission}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all shrink-0 ml-2"
              >
                Request OS Permission
              </button>
            </div>

          </div>
        )}

        {/* Tab 3: Push History Log */}
        {activeTab === 'HISTORY' && (
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Logged Push Notifications ({pushAlerts.length})
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Persisted in Session Ledger
              </span>
            </div>

            {pushAlerts.length === 0 ? (
              <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-800 space-y-2">
                <Bell className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-400">No push notifications logged yet.</p>
                <p className="text-[11px] text-slate-500">Switch to the Trigger tab to dispatch test alerts!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pushAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          alert.category === 'HUB_SURGE'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : alert.category === 'COMPETITION_MILESTONE'
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        }`}>
                          {alert.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {alert.timestamp}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          triggerSimulatedPush(alert);
                          setShowPushSimulationModal(false);
                        }}
                        className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Re-Trigger
                      </button>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-white">
                        {alert.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        {alert.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Simulated Push Daemon Active</span>
          </div>

          <button
            onClick={() => setShowPushSimulationModal(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
