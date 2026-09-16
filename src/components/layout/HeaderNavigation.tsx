import React, { useState } from 'react';
import { 
  Leaf, 
  Bot, 
  Upload, 
  Truck, 
  LayoutDashboard, 
  Trophy, 
  Gift, 
  Factory, 
  ShieldCheck, 
  Bell, 
  Zap, 
  Menu, 
  X, 
  Sparkles, 
  ChevronDown, 
  RotateCcw,
  CheckCircle2,
  UserPlus,
  Settings,
  LogOut,
  MapPin,
  Phone,
  User,
  Smartphone,
  Database,
  WifiOff,
  Users,
  Cpu
} from 'lucide-react';
import { useEcoSort, AppView } from '../../context/EcoSortContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const HeaderNavigation: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentUser, 
    switchRole, 
    isAdminAuthenticated,
    openAdminAuthModal,
    notifications, 
    markNotificationRead, 
    clearAllNotifications, 
    resetToDefaults,
    isRegistered,
    setShowAuthModal,
    setShowEditProfileModal,
    setShowCashOutModal,
    setShowApkModal,
    setShowPushSimulationModal,
    triggerSimulatedPush,
    isDeviceFrameMode,
    setIsDeviceFrameMode,
    logoutUser,
    t,
    effectiveIsOnline,
    pendingOfflineCount,
    setShowOfflineQueueModal,
    isSimulatedOffline,
    setIsSimulatedOffline
  } = useEcoSort();

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState<boolean>(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const allNavItems: { id: AppView; label: string; icon: React.ReactNode; badge?: string; adminOnly?: boolean }[] = [
    { id: 'infographic', label: t('nav.system_blueprint', 'System Blueprint'), icon: <Leaf className="w-3.5 h-3.5" />, adminOnly: true },
    { id: 'virtual-robot', label: t('nav.virtual_robot', 'Virtual Robot'), icon: <Bot className="w-3.5 h-3.5" />, badge: 'Sim' },
    { id: 'smart-bin', label: 'Smart Dust Bins', icon: <Cpu className="w-3.5 h-3.5" />, badge: 'LED', adminOnly: true },
    { id: 'user-app', label: t('nav.upload_classify', 'Upload & Classify'), icon: <Upload className="w-3.5 h-3.5" /> },
    { id: 'collector-app', label: t('nav.agent_console', 'Agent Console'), icon: <Truck className="w-3.5 h-3.5" /> },
    { id: 'user-dashboard', label: t('nav.dashboard', 'Dashboard'), icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'leaderboard', label: t('nav.leaderboard', 'Leaderboard'), icon: <Trophy className="w-3.5 h-3.5" /> },
    { id: 'rewards', label: t('nav.marketplace', 'Marketplace'), icon: <Gift className="w-3.5 h-3.5" /> },
    { id: 'community', label: t('nav.community_hub', 'Community Hub'), icon: <Users className="w-3.5 h-3.5" />, badge: 'Trade' },
    { id: 'recycler', label: t('nav.recycler_hub', 'Recycler Hub'), icon: <Factory className="w-3.5 h-3.5" /> },
    { id: 'admin', label: t('nav.admin_command', 'Admin Command'), icon: <ShieldCheck className="w-3.5 h-3.5" />, adminOnly: true },
    { id: 'impact', label: t('nav.carbon_impact', 'Carbon Impact'), icon: <Leaf className="w-3.5 h-3.5" /> },
    { id: 'demo', label: t('nav.demo_tour', 'Demo Tour'), icon: <Zap className="w-3.5 h-3.5" />, badge: '3-Min' },
  ];

  // Only display admin items to administrators
  const navItems = allNavItems.filter(item => !item.adminOnly || currentUser.role === 'ADMIN');

  const handleLogoClick = () => {
    if (currentUser.role === 'ADMIN' && isAdminAuthenticated) {
      setCurrentView('admin');
    } else if (currentUser.role === 'ADMIN' && !isAdminAuthenticated) {
      openAdminAuthModal();
    } else if (currentUser.role === 'COLLECTION_AGENT') {
      setCurrentView('collector-app');
    } else if (currentUser.role === 'RECYCLER') {
      setCurrentView('recycler');
    } else {
      setCurrentView('user-dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] border-b border-slate-800 text-slate-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
          >
            <img 
              src="/logo.png" 
              alt="EcoSort" 
              className="w-10 h-10 object-contain rounded-xl bg-white p-1 shadow-sm ring-1 ring-white/20 group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-xl tracking-tight">EcoSort</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 uppercase tracking-widest border border-emerald-400/30">GHANA</span>
              </div>
              <span className="text-[10px] text-slate-400 hidden md:block">National AI Smart Recycling Grid</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'admin' && !isAdminAuthenticated) {
                      openAdminAuthModal();
                    } else {
                      setCurrentView(item.id);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <span className={isActive ? 'text-blue-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Role Switcher */}
          <div className="flex items-center gap-2">
            
            {/* Ghanaian Language Switcher */}
            <LanguageSwitcher variant="pill" />

            {/* Quick Demo Tour */}
            <button
              onClick={() => setCurrentView('demo')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'demo'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300'
              }`}
              title="Start 3-Minute Competition Demo Tour"
            >
              <Zap className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
              <span>Demo Tour</span>
            </button>

            {/* Offline / Online Realtime Sync Status Indicator */}
            {(!effectiveIsOnline || pendingOfflineCount > 0) && (
              <button
                onClick={() => setShowOfflineQueueModal(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  !effectiveIsOnline
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                    : 'bg-blue-600/25 text-blue-300 border-blue-500/50'
                }`}
                title={!effectiveIsOnline ? 'App is in Offline Mode. Click to view local queue' : 'Manage Offline Queue'}
              >
                {!effectiveIsOnline ? (
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                )}
                <span>{pendingOfflineCount > 0 ? `${pendingOfflineCount} Queued` : 'Offline'}</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white relative border border-slate-700/60 transition-all cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white font-bold text-[9px] flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-xs text-white uppercase tracking-wider">Live System Events</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setShowPushSimulationModal(true);
                          setNotificationsOpen(false);
                        }}
                        className="text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 cursor-pointer"
                      >
                        ⚡ Push Studio
                      </button>
                      <button 
                        onClick={clearAllNotifications}
                        className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-slate-500 py-4">No notifications logged.</p>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            n.read ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-800/90 border-blue-500/40 text-slate-200 shadow-xs'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-blue-400">{n.title}</span>
                            <span className="text-[9px] font-mono text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] mt-0.5 text-slate-300">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Register / Sign In button if not registered */}
            {!isRegistered ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register / Sign In</span>
              </button>
            ) : (
              /* User Profile & Account Menu */
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-all shadow-xs cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="truncate max-w-[100px] text-white text-[11px] font-bold leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-blue-400 font-mono leading-tight">
                      {currentUser.ecoPoints} pts
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 space-y-2 animate-in fade-in zoom-in-95">
                    
                    {/* User Profile Card Header */}
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                      <div className="flex items-start gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-xs text-white block truncate">{currentUser.name}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-blue-400 font-medium block truncate">{currentUser.email}</span>
                            {currentUser.authProvider === 'google' && (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                                Google
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                            <MapPin className="w-2.5 h-2.5 text-slate-500" />
                            <span className="truncate">{currentUser.community || currentUser.location}</span>
                          </div>
                          {currentUser.phone && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Phone className="w-2.5 h-2.5 text-slate-500" />
                              <span className="font-mono">{currentUser.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-3 gap-1 mt-3 pt-2.5 border-t border-slate-700/60">
                        <button
                          onClick={() => {
                            setShowCashOutModal(true);
                            setRoleDropdownOpen(false);
                          }}
                          className="py-1.5 px-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center gap-1 transition-colors"
                        >
                          <Zap className="w-3 h-3 fill-slate-950" />
                          Cash Out
                        </button>
                        <button
                          onClick={() => {
                            setShowEditProfileModal(true);
                            setRoleDropdownOpen(false);
                          }}
                          className="py-1.5 px-1 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Settings className="w-3 h-3 text-blue-400" />
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            setShowAuthModal(true);
                            setRoleDropdownOpen(false);
                          }}
                          className="py-1.5 px-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors border border-blue-500/30"
                        >
                          <UserPlus className="w-3 h-3" />
                          Register
                        </button>
                      </div>
                    </div>

                    {/* Switch Persona Options */}
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 px-2 py-1 block tracking-wider">
                        Switch Persona Role:
                      </span>
                      
                      <div className="space-y-0.5">
                        <button
                          onClick={() => { switchRole('USER'); setRoleDropdownOpen(false); }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                            currentUser.role === 'USER' && currentUser.entityType === 'INDIVIDUAL' ? 'bg-blue-600/20 text-blue-300' : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="text-sm">👤</span>
                          <div className="min-w-0">
                            <span className="font-semibold block text-[11px] text-white truncate">Citizen / Household</span>
                            <span className="text-[9px] text-slate-400 block truncate">Bright Mensah • UG Legon</span>
                          </div>
                        </button>

                        <button
                          onClick={() => { switchRole('COMMUNITY_ADMIN'); setRoleDropdownOpen(false); }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                            currentUser.role === 'COMMUNITY_ADMIN' ? 'bg-emerald-600/20 text-emerald-300' : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="text-sm">🏫</span>
                          <div className="min-w-0">
                            <span className="font-semibold block text-[11px] text-white truncate">School & Community Lead</span>
                            <span className="text-[9px] text-slate-400 block truncate">Mrs. Joyce Darko • Achimota</span>
                          </div>
                        </button>

                        <button
                          onClick={() => { switchRole('COLLECTION_AGENT'); setRoleDropdownOpen(false); }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                            currentUser.role === 'COLLECTION_AGENT' ? 'bg-amber-600/20 text-amber-300' : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="text-sm">🛵</span>
                          <div className="min-w-0">
                            <span className="font-semibold block text-[11px] text-white truncate">Field Agent</span>
                            <span className="text-[9px] text-slate-400 block truncate">Kwame Asante • Madina Fleet</span>
                          </div>
                        </button>

                        <button
                          onClick={() => { switchRole('RECYCLER'); setRoleDropdownOpen(false); }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                            currentUser.role === 'RECYCLER' ? 'bg-emerald-600/20 text-emerald-300' : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="text-sm">🏭</span>
                          <div className="min-w-0">
                            <span className="font-semibold block text-[11px] text-white truncate">Recycler Partner</span>
                            <span className="text-[9px] text-slate-400 block truncate">Accra Circular • Tema Hub</span>
                          </div>
                        </button>

                        <button
                          onClick={() => { switchRole('ADMIN'); setRoleDropdownOpen(false); }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                            currentUser.role === 'ADMIN' ? 'bg-purple-600/20 text-purple-300' : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="text-sm">🛡️</span>
                          <div className="min-w-0">
                            <span className="font-semibold block text-[11px] text-white truncate">EPA Command</span>
                            <span className="text-[9px] text-slate-400 block truncate">UMaT SRID • EPA Command</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1 text-[10px]">
                      <button
                        onClick={() => { resetToDefaults(); setRoleDropdownOpen(false); }}
                        className="px-2 py-1 rounded text-slate-400 hover:text-white flex items-center gap-1 hover:bg-slate-800 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset Demo
                      </button>

                      <button
                        onClick={() => { logoutUser(); setRoleDropdownOpen(false); }}
                        className="px-2 py-1 rounded text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:bg-rose-950/40 transition-colors font-semibold"
                      >
                        <LogOut className="w-3 h-3" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0F172A] border-b border-slate-800 px-4 py-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                  currentView === item.id
                    ? 'bg-slate-800 text-white border border-blue-500/40'
                    : 'bg-slate-900 text-slate-300'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }}
              className="py-2 px-3 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register / Sign In
            </button>
            <button
              onClick={() => { setShowEditProfileModal(true); setMobileMenuOpen(false); }}
              className="py-2 px-3 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Profile Details
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

