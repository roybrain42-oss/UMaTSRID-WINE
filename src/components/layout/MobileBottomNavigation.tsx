import React, { useState } from 'react';
import { 
  Leaf, 
  Bot, 
  Upload, 
  Gift, 
  LayoutDashboard, 
  Menu, 
  X, 
  Truck, 
  Factory, 
  ShieldCheck, 
  Trophy, 
  Zap, 
  Smartphone, 
  RotateCcw,
  Sparkles,
  Camera,
  Coins,
  Users,
  Cpu,
  LogOut,
  LogIn
} from 'lucide-react';
import { useEcoSort, AppView } from '../../context/EcoSortContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const MobileBottomNavigation: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    setShowCashOutModal,
    setShowApkModal,
    openInstantScanModal,
    currentUser,
    isAdminAuthenticated,
    openAdminAuthModal,
    logoutUser,
    ecoPointsPerGhs,
    t
  } = useEcoSort();

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const mainTabs = [
    {
      id: 'infographic' as AppView,
      label: t('nav.system_blueprint', 'Blueprint'),
      icon: <Leaf className="w-5 h-5" />
    },
    {
      id: 'virtual-robot' as AppView,
      label: t('nav.virtual_robot', 'Robot Sim'),
      icon: <Bot className="w-5 h-5" />
    },
    // Center Floating Action Button handled separately
    {
      id: 'rewards' as AppView,
      label: t('nav.momo_cash', 'MoMo Cash'),
      icon: <Coins className="w-5 h-5 text-amber-400" />,
      badge: `GH₵ ${(currentUser.ecoPoints / ecoPointsPerGhs).toFixed(0)}`
    },
    {
      id: 'user-dashboard' as AppView,
      label: t('nav.dashboard', 'Dashboard'),
      icon: <LayoutDashboard className="w-5 h-5" />
    }
  ];

  const isAdmin = currentUser.role === 'ADMIN';

  const drawerItems = [
    ...(isAdmin ? [
      { id: 'infographic' as AppView, label: 'EPA System Blueprint', icon: <Leaf className="w-5 h-5 text-emerald-400" />, desc: 'System architecture & national robotics schematics' },
      { id: 'smart-bin' as AppView, label: 'Smart Dust Bins Status (LED)', icon: <Cpu className="w-5 h-5 text-emerald-400" />, desc: 'Real-time Red, Yellow, Green LED status across places' }
    ] : []),
    { id: 'user-app' as AppView, label: 'Upload & AI Classify', icon: <Upload className="w-5 h-5 text-blue-500" />, desc: 'Scan recyclables for EcoPoints' },
    { id: 'collector-app' as AppView, label: 'Collector Agent Console', icon: <Truck className="w-5 h-5 text-amber-500" />, desc: 'Fleet pickups & digital scale validation' },
    { id: 'leaderboard' as AppView, label: 'Campus Leaderboard & Cups', icon: <Trophy className="w-5 h-5 text-yellow-500" />, desc: 'University & community standings' },
    { id: 'community' as AppView, label: 'Eco-Trade & Community Hub', icon: <Users className="w-5 h-5 text-indigo-400" />, desc: 'Item swapping, cleanups & local eco-forum' },
    { id: 'recycler' as AppView, label: 'Recycler Logistics Hub', icon: <Factory className="w-5 h-5 text-purple-500" />, desc: 'Bulk industrial material procurement' },
    ...(isAdmin ? [{ id: 'admin' as AppView, label: 'EPA Ghana Command', icon: <ShieldCheck className="w-5 h-5 text-teal-500" />, desc: 'National telemetry & reward rate rules' }] : []),
    { id: 'impact' as AppView, label: 'Carbon Offset Impact', icon: <Leaf className="w-5 h-5 text-emerald-500" />, desc: 'CO₂ avoided and landfill diversion' },
    { id: 'demo' as AppView, label: '3-Minute Competition Pitch Tour', icon: <Zap className="w-5 h-5 text-blue-400" />, desc: 'Step-by-step end-to-end live walk' },
  ];

  return (
    <>
      {/* Mobile Bottom Dock Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-lg border-t border-slate-800 text-slate-400 px-2 pb-safe pt-1 xl:hidden shadow-2xl">
        <div className="flex items-center justify-around relative h-16 max-w-md mx-auto">
          
          {/* Left Tab 1: Blueprint (Admin only) or Dashboard (Citizen/Collector/Recycler) */}
          {isAdmin ? (
            <button
              onClick={() => {
                if (!isAdminAuthenticated) {
                  openAdminAuthModal();
                } else {
                  setCurrentView('infographic');
                }
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                currentView === 'infographic'
                  ? 'text-blue-400 font-bold scale-105'
                  : 'hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${currentView === 'infographic' ? 'bg-blue-500/20' : ''}`}>
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Blueprint</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('user-dashboard')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                currentView === 'user-dashboard'
                  ? 'text-blue-400 font-bold scale-105'
                  : 'hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${currentView === 'user-dashboard' ? 'bg-blue-500/20' : ''}`}>
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Dashboard</span>
            </button>
          )}

          {/* Left Tab 2: Robot Sim */}
          <button
            onClick={() => setCurrentView('virtual-robot')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              currentView === 'virtual-robot'
                ? 'text-blue-400 font-bold scale-105'
                : 'hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl transition-colors ${currentView === 'virtual-robot' ? 'bg-blue-500/20' : ''}`}>
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Robot Sim</span>
          </button>

          {/* CENTER ELEVATED HERO BUTTON: SNAP & EARN CAMERA */}
          <div className="relative -top-5 flex flex-col items-center justify-center">
            <button
              onClick={() => setCurrentView('user-app')}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 transform active:scale-95 ${
                currentView === 'user-app'
                  ? 'bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 ring-4 ring-blue-500/40 scale-105'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/30'
              }`}
              title="Snap & Upload Waste"
            >
              <div className="relative">
                <Camera className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              </div>
            </button>
            <span className="text-[9px] font-extrabold text-blue-300 uppercase tracking-wider mt-1">
              Snap & Earn
            </span>
          </div>

          {/* Right Tab 1: MoMo Rewards */}
          <button
            onClick={() => setCurrentView('rewards')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              currentView === 'rewards'
                ? 'text-amber-400 font-bold scale-105'
                : 'hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl transition-colors relative ${currentView === 'rewards' ? 'bg-amber-500/20' : ''}`}>
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">MoMo Cash</span>
          </button>

          {/* Right Tab 2: More Drawer */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-white transition-all"
          >
            <div className="p-1 rounded-xl hover:bg-slate-800">
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">More</span>
          </button>

        </div>
      </nav>

      {/* Slide-Up Mobile App Drawer / Menu Sheet */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="absolute inset-0"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative bg-[#0F172A] border-t border-slate-800 rounded-t-3xl p-6 text-slate-100 max-h-[85vh] overflow-y-auto space-y-5 animate-slide-up shadow-2xl">
            
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto -mt-2 mb-2" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                  EcoSort Mobile Hub
                </span>
                <h3 className="text-lg font-black text-white">All Application Modules</h3>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Instant Camera Scanner 1-Tap Trigger */}
            <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-transparent p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <Zap className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">AI Camera Scanner</span>
                  <span className="text-sm font-black text-white">Instant Verify & Earn</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  openInstantScanModal();
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-md cursor-pointer"
              >
                Scan Now ⚡
              </button>
            </div>

            {/* Quick MoMo Payout Card */}
            <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">Available Balance</span>
                <span className="text-xl font-black text-white">{currentUser.ecoPoints} Pts <span className="text-xs text-amber-300 font-mono font-bold">(≈ GH₵ {(currentUser.ecoPoints / ecoPointsPerGhs).toFixed(2)})</span></span>
              </div>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setShowCashOutModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md"
              >
                Withdraw MoMo
              </button>
            </div>

            {/* Language Switcher Section */}
            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
              <LanguageSwitcher variant="inline" />
            </div>

            {/* Grid of Modules */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block px-1">
                Portals & Logistics
              </span>

              {drawerItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if ((item.id === 'admin' || item.id === 'infographic') && !isAdminAuthenticated) {
                      setDrawerOpen(false);
                      openAdminAuthModal();
                    } else {
                      setCurrentView(item.id);
                      setDrawerOpen(false);
                    }
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center gap-3.5 transition-all text-left ${
                    currentView === item.id
                      ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                      : 'bg-slate-900/80 hover:bg-slate-800/90 text-slate-300 border border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-xs block text-white">{item.label}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Account & Session Controls */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  logoutUser('SIGN_IN');
                }}
                className="py-3 px-3 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <LogIn className="w-4 h-4 text-blue-400" />
                <span>Log In</span>
              </button>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  logoutUser('SIGN_IN');
                }}
                className="py-3 px-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 hover:text-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Log Out</span>
              </button>
            </div>

            {/* APK Shortcut & PWA Install Banner */}
            <div>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setShowApkModal(true);
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Install EcoSort Android APK / PWA</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
