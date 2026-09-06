import React, { useState } from 'react';
import { 
  Leaf, 
  Coins, 
  Scale, 
  Truck, 
  Wind, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Bot, 
  Gift, 
  Trophy, 
  Upload,
  Sparkles,
  Zap,
  MapPin,
  Settings,
  Share2,
  HelpCircle,
  School,
  Users,
  Building2,
  User,
  BarChart3,
  RefreshCw,
  Calendar,
  Camera,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { PersonalizedWeeklySummary } from './PersonalizedWeeklySummary';
import { RecyclingTipOfDay } from './RecyclingTipOfDay';
import { NearbyDropOffMap } from './NearbyDropOffMap';
import { WastePreSortingFAQ } from './WastePreSortingFAQ';
import { UserDashboardSkeleton } from './UserDashboardSkeleton';
import { EcosystemRoleSwitcher } from '../dashboard/EcosystemRoleSwitcher';
import { SchoolCommunityDashboardView } from '../dashboard/SchoolCommunityDashboardView';

export const UserDashboardView: React.FC = () => {
  const { 
    currentUser, 
    submissions, 
    setCurrentView, 
    setShowEditProfileModal,
    setShowCashOutModal,
    openShareImpactModal,
    openInstantScanModal,
    ecoPointsPerGhs,
    t,
    currentLanguageInfo,
    leaderboard,
    saveToLocalCacheNow,
  } = useEcoSort();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dashboardTab, setDashboardTab] = useState<'OVERVIEW' | 'WEEKLY_SUMMARY' | 'NEARBY_MAP' | 'PRE_SORT_GUIDE'>('OVERVIEW');

  // Trigger smooth skeleton when refreshing data
  const handleRefreshData = () => {
    setIsLoading(true);
    saveToLocalCacheNow();
    setTimeout(() => {
      setIsLoading(false);
    }, 350);
  };

  if (isLoading) {
    return <UserDashboardSkeleton />;
  }

  // If the operational ecosystem role is School / Community Lead, render dedicated SchoolCommunityDashboardView
  if (currentUser.role === 'COMMUNITY_ADMIN' || (currentUser.role === 'USER' && (currentUser.entityType === 'SCHOOL' || currentUser.entityType === 'COMMUNITY' || currentUser.entityType === 'ORGANIZATION') && currentUser.memberCount && currentUser.memberCount > 50)) {
    return <SchoolCommunityDashboardView />;
  }

  const userSubmissions = submissions.filter(s => s.userId === currentUser.id);
  const estimatedCashGhs = +(currentUser.ecoPoints / ecoPointsPerGhs).toFixed(2);
  const userRankEntry = leaderboard.find(l => l.isCurrentUser || l.id === currentUser.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Sleek Ecosystem Role Switcher */}
      <EcosystemRoleSwitcher />

      {/* Clean User Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {currentLanguageInfo.flagEmoji} {currentLanguageInfo.greeting.split(' ')[0]}!
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {currentUser.name}
              </h1>

              {/* National Rank Badge */}
              {userRankEntry && (
                <button
                  onClick={() => setCurrentView('leaderboard')}
                  className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Trophy className="w-3 h-3 text-amber-500" />
                  <span>Rank #{userRankEntry.rank}</span>
                </button>
              )}
            </div>
            
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {currentUser.community || currentUser.location}
              </span>
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Settings className="w-3 h-3" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          <button
            onClick={openInstantScanModal}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Instant Scan ⚡</span>
          </button>

          <button
            onClick={() => setCurrentView('user-app')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload & Earn</span>
          </button>

          <button
            onClick={() => setShowCashOutModal(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Cash Out (GH₵ {estimatedCashGhs.toFixed(2)})</span>
          </button>

          <button
            onClick={() => openShareImpactModal()}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title="Share Impact Card"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl flex-wrap">
          <button
            onClick={() => setDashboardTab('OVERVIEW')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              dashboardTab === 'OVERVIEW'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setDashboardTab('WEEKLY_SUMMARY')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              dashboardTab === 'WEEKLY_SUMMARY'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Weekly Highlights</span>
          </button>

          <button
            onClick={() => setDashboardTab('NEARBY_MAP')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              dashboardTab === 'NEARBY_MAP'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span>Drop-Off Hubs</span>
          </button>

          <button
            onClick={() => setDashboardTab('PRE_SORT_GUIDE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              dashboardTab === 'PRE_SORT_GUIDE'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-500" />
            <span>Sorting Guide</span>
          </button>
        </div>

        <button
          onClick={handleRefreshData}
          className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          title="Refresh dashboard"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tab Content */}
      {dashboardTab === 'OVERVIEW' ? (
        <div className="space-y-6">
          {/* Instant Camera Scan Feature Callout Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-500/30 p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/25 shrink-0">
                <Camera className="w-6 h-6 stroke-2 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-white text-base">Instant Camera Waste Scanner</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    ⚡ No Form Required
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Point camera at plastic bottles, pure water sachets, or cans. AI classifies & credits points immediately.
                </p>
              </div>
            </div>

            <button
              onClick={openInstantScanModal}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Launch Instant Scan ⚡</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Core Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* EcoPoints */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Available Points</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {currentUser.ecoPoints}
                </div>
                <div className="text-amber-600 dark:text-amber-400 font-bold text-xs mt-0.5">
                  ≈ GH₵ {estimatedCashGhs.toFixed(2)} MoMo
                </div>
              </div>
            </div>

            {/* Waste Diverted */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Waste Diverted</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {currentUser.totalWasteKg} <span className="text-sm font-semibold text-slate-400">kg</span>
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xs mt-0.5">
                  +4.8 kg this week
                </div>
              </div>
            </div>

            {/* Verified Pickups */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Verified Pickups</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {currentUser.verifiedCollections}
                </div>
                <div className="text-blue-600 dark:text-blue-400 font-bold text-xs mt-0.5">
                  100% Certified
                </div>
              </div>
            </div>

            {/* Carbon Saved */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Carbon Saved</span>
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Wind className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {currentUser.co2SavedKg} <span className="text-sm font-semibold text-slate-400">kg CO₂</span>
                </div>
                <div className="text-teal-600 dark:text-teal-400 font-bold text-xs mt-0.5">
                  EPA Standard
                </div>
              </div>
            </div>
          </div>

          {/* Clean Tip of the Day */}
          <RecyclingTipOfDay />

          {/* Main Grid: Chart & Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Monthly Progress Chart */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Monthly Recycling Progress
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Goal: 15.0 kg / month</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                  +125 Pts this week
                </span>
              </div>

              {/* Simple Area Chart */}
              <div className="h-48 w-full relative pt-2">
                <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGradBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeDasharray="3 3" />

                  <polygon
                    points="30,150 110,120 210,130 320,70 470,30 470,160 30,160"
                    fill="url(#chartGradBlue)"
                  />

                  <polyline
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="30,150 110,120 210,130 320,70 470,30"
                  />

                  <circle cx="30" cy="150" r="4" className="fill-blue-600 stroke-white stroke-2" />
                  <circle cx="110" cy="120" r="4" className="fill-blue-600 stroke-white stroke-2" />
                  <circle cx="210" cy="130" r="4" className="fill-blue-600 stroke-white stroke-2" />
                  <circle cx="320" cy="70" r="4" className="fill-blue-600 stroke-white stroke-2" />
                  <circle cx="470" cy="30" r="5" className="fill-blue-700 stroke-white stroke-2" />
                </svg>

                <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2">
                  <span>Wk 1</span>
                  <span>Wk 2</span>
                  <span>Wk 3</span>
                  <span>Wk 4</span>
                  <span>Now</span>
                </div>
              </div>

              {/* Material Allocation Bar */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Material Breakdown</span>
                  <span className="font-mono text-slate-500">42.5 kg Total</span>
                </div>
                
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div style={{ width: '65%' }} className="bg-blue-500 h-full" title="Plastic 65%" />
                  <div style={{ width: '20%' }} className="bg-amber-500 h-full" title="Metal 20%" />
                  <div style={{ width: '15%' }} className="bg-emerald-500 h-full" title="Paper 15%" />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span> Plastic 65%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> Metal 20%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Paper 15%</span>
                </div>
              </div>
            </div>

            {/* Right: Recent Submissions Activity */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between">
              <div>
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">Recent Submissions</h2>
                  <button 
                    onClick={() => setCurrentView('user-app')}
                    className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline cursor-pointer"
                  >
                    + New
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {userSubmissions.slice(0, 4).map((sub) => (
                    <div 
                      key={sub.id} 
                      className="p-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img src={sub.imageUrl} alt="item" className="w-9 h-9 rounded-lg object-cover border border-slate-100 dark:border-slate-800" />
                        <div>
                          <span className="font-bold text-xs text-slate-900 dark:text-white block">
                            {sub.classification.material}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {sub.actualWeightKg || sub.userWeightEstimateKg} kg • {sub.preferredPickupTime}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 block">
                          +{sub.pointsAwarded || sub.classification.estimatedPoints} pts
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {sub.status === 'POINTS_AWARDED' ? 'Cleared' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Shortcuts */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setCurrentView('rewards')}
                  className="p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-500" />
                  Marketplace
                </button>
                <button
                  onClick={() => setCurrentView('leaderboard')}
                  className="p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  Leaderboard
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : dashboardTab === 'WEEKLY_SUMMARY' ? (
        <PersonalizedWeeklySummary />
      ) : dashboardTab === 'NEARBY_MAP' ? (
        <NearbyDropOffMap />
      ) : (
        <WastePreSortingFAQ />
      )}
    </div>
  );
};
