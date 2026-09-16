import React, { useState } from 'react';
import { 
  Bell, 
  Smartphone, 
  Zap, 
  User, 
  Settings, 
  RotateCcw, 
  LogOut, 
  UserPlus, 
  ChevronDown,
  X,
  Coins,
  ShieldCheck,
  Database,
  WifiOff,
  Share2
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const MobileAppHeader: React.FC = () => {
  const { 
    currentUser, 
    notifications, 
    markNotificationRead, 
    clearAllNotifications,
    setShowCashOutModal,
    setShowApkModal,
    setShowEditProfileModal,
    setShowAuthModal,
    setShowPushSimulationModal,
    openShareImpactModal,
    triggerSimulatedPush,
    switchRole,
    resetToDefaults,
    logoutUser,
    ecoPointsPerGhs,
    isRegistered,
    effectiveIsOnline,
    pendingOfflineCount,
    setShowOfflineQueueModal
  } = useEcoSort();

  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const cashBalanceGhs = +(currentUser.ecoPoints / ecoPointsPerGhs).toFixed(2);

  return (
    <header className="xl:hidden sticky top-0 z-30 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 py-2.5 shadow-md">
      <div className="flex items-center justify-between gap-2">
        
        {/* Brand & Live Status */}
        <div className="flex items-center gap-2.5">
          <img 
            src="/logo.png" 
            alt="EcoSort" 
            className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 shadow-sm ring-1 ring-white/20"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-black text-sm tracking-tight text-white">EcoSort</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">GH 🇬🇭</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${effectiveIsOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-[9px] text-slate-400 font-mono">
                {effectiveIsOnline ? 'Edge AI Online' : 'IndexedDB Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Offline Queue Indicator Button */}
          {(!effectiveIsOnline || pendingOfflineCount > 0) && (
            <button
              onClick={() => setShowOfflineQueueModal(true)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border transition-all ${
                !effectiveIsOnline
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                  : 'bg-blue-600/20 text-blue-300 border-blue-500/40'
              }`}
              title="View Offline Queue"
            >
              {!effectiveIsOnline ? <WifiOff className="w-3 h-3 text-amber-400" /> : <Database className="w-3 h-3 text-blue-400" />}
              {pendingOfflineCount > 0 && <span>{pendingOfflineCount}</span>}
            </button>
          )}

          {/* Language Switcher Pill */}
          <LanguageSwitcher variant="pill" />

          {/* Quick MoMo Cash Pill Button */}
          <button
            onClick={() => setShowCashOutModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold transition-all"
            title="Convert points to Mobile Money cash"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>GH₵ {cashBalanceGhs.toFixed(0)}</span>
          </button>

          {/* Quick APK Shortcut Button */}
          <button
            onClick={() => setShowApkModal(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-[10px] font-bold transition-all"
            title="Install APK"
          >
            <Smartphone className="w-3 h-3" />
            <span>APK</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white font-bold text-[9px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Button */}
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="relative p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700 cursor-pointer"
            title="User menu"
          >
            <User className="w-4 h-4 text-emerald-400" />
          </button>

        </div>

      </div>

      {/* Mobile Profile & Role Switcher Sheet */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">User Profile</span>
              <button onClick={() => setProfileOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-sm text-white block truncate">{currentUser.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-blue-400 font-mono block">{currentUser.rankTitle}</span>
                  {currentUser.authProvider === 'google' && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                      Google
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block">{currentUser.community || currentUser.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  setShowCashOutModal(true);
                }}
                className="py-2.5 px-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                MoMo Cash Out
              </button>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  openShareImpactModal();
                }}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share Impact
              </button>
            </div>

            <button
              onClick={() => {
                setProfileOpen(false);
                setShowEditProfileModal(true);
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/80 text-slate-300 hover:bg-slate-700 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5 text-blue-400" />
              Edit Profile Settings
            </button>

            {/* Role Switcher */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 block px-1">Switch Role:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { role: 'USER' as const, label: 'Citizen', emoji: '👤' },
                  { role: 'COLLECTION_AGENT' as const, label: 'Agent Kwame', emoji: '🛵' },
                  { role: 'RECYCLER' as const, label: 'Recycler Tema', emoji: '🏭' },
                  { role: 'ADMIN' as const, label: 'EPA Command', emoji: '🛡️' }
                ].map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      switchRole(item.role);
                      setProfileOpen(false);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      currentUser.role === item.role
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px]">
              <button
                onClick={() => {
                  resetToDefaults();
                  setProfileOpen(false);
                }}
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
              </button>

              <button
                onClick={() => {
                  logoutUser();
                  setProfileOpen(false);
                }}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-xs text-white uppercase tracking-wider">Live System Events</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowPushSimulationModal(true);
                    setNotificationsOpen(false);
                  }}
                  className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20"
                >
                  ⚡ Push Studio
                </button>
                <button onClick={clearAllNotifications} className="text-[10px] text-slate-400 hover:text-white">
                  Clear
                </button>
                <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Test Bar */}
            <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-900/90 rounded-2xl border border-slate-800">
              <button
                onClick={() => {
                  triggerSimulatedPush('push-surge-madina');
                  setNotificationsOpen(false);
                }}
                className="py-1 px-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[10px] font-bold truncate"
              >
                ⚡ Hub Surge (92%)
              </button>
              <button
                onClick={() => {
                  triggerSimulatedPush('push-milestone-ug-10k');
                  setNotificationsOpen(false);
                }}
                className="py-1 px-2 rounded-xl bg-yellow-950/40 border border-yellow-500/30 text-yellow-300 text-[10px] font-bold truncate"
              >
                🏆 Cup Milestone
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {notifications.map(n => (
                <div 
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer ${
                    n.read ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-800/90 border-blue-500/40 text-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-blue-400">{n.title}</span>
                    <span className="text-[9px] font-mono text-slate-500">{n.timestamp}</span>
                  </div>
                  <p className="text-[11px] mt-0.5 text-slate-300">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
