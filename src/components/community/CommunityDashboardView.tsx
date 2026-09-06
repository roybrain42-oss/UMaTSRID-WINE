import React, { useState } from 'react';
import { 
  Users, 
  RefreshCw, 
  Calendar, 
  MessageSquare, 
  Target, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Coins, 
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  Check,
  X,
  MapPin,
  Clock
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { SwapMarketplaceTab } from './SwapMarketplaceTab';
import { CommunityEventsTab } from './CommunityEventsTab';
import { CommunityForumTab } from './CommunityForumTab';
import { DistrictQuestsTab } from './DistrictQuestsTab';
import { GreenAmbassadorsTab } from './GreenAmbassadorsTab';
import { NearbyDropOffMap } from '../user/NearbyDropOffMap';

export const CommunityDashboardView: React.FC = () => {
  const { 
    swapTradeRequests, 
    acceptSwapTrade, 
    rejectSwapTrade, 
    currentUser,
    swapItems,
    communityEvents,
    forumPosts,
    districtQuests,
    ambassadors
  } = useEcoSort();

  const [activeTab, setActiveTab] = useState<'swap' | 'map' | 'events' | 'forum' | 'quests' | 'ambassadors'>('swap');

  // Trade requests for the current user (either incoming to seller or outgoing as buyer)
  const incomingTrades = swapTradeRequests.filter(r => r.sellerId === currentUser.id && r.status === 'PENDING');
  const mySentTrades = swapTradeRequests.filter(r => r.buyerId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="community-dashboard-view">
      
      {/* Top Banner / Hub Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/20">
              Community & Eco-Trade Hub
            </span>
            <span className="text-xs text-slate-500 font-medium">EcoSort Ghana Circular Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Community Eco-Trade, Drives & Knowledge
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
            Connect directly with your neighbors: swap upcycled goods, sign up for coastal cleanups, join district collective quests, and discuss zero-waste practices.
          </p>
        </div>

        {/* User Community Badge / Quick Points */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-4 rounded-3xl border border-emerald-500/20 flex items-center gap-4 flex-shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
              {currentUser.community || 'Accra Metro'} Chapter
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              {currentUser.ecoPoints} EcoPoints Balance
            </span>
          </div>
        </div>
      </div>

      {/* Incoming Trade Offers Alerts (if any pending) */}
      {incomingTrades.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-5 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <h3 className="text-sm font-black text-amber-950 dark:text-amber-200">
                You have {incomingTrades.length} pending trade {incomingTrades.length === 1 ? 'offer' : 'offers'} on your listings!
              </h3>
            </div>
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">Action Required</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {incomingTrades.map((req) => (
              <div 
                key={req.id} 
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/20 shadow-xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-950 dark:text-white">Offer on: {req.itemTitle}</span>
                    <span className="text-amber-600 dark:text-amber-400 uppercase text-[10px]">{req.tradeType}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                    "{req.message}"
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">From: {req.buyerName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {req.meetupLocation}
                    </span>
                  </div>
                  {req.offeredItemTitle && (
                    <div className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      Offered to swap: {req.offeredItemTitle}
                    </div>
                  )}
                  {req.offeredPoints && (
                    <div className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      Offered points: {req.offeredPoints} EcoPoints
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => rejectSwapTrade(req.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => acceptSwapTrade(req.id)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept Trade
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {[
          { id: 'swap', label: 'Swap Spot', count: swapItems.length, icon: RefreshCw },
          { id: 'map', label: 'Drop-Off Centers & Map', count: 8, icon: MapPin },
          { id: 'events', label: 'Cleanups & Drives', count: communityEvents.length, icon: Calendar },
          { id: 'forum', label: 'Eco-Forum & Q&A', count: forumPosts.length, icon: MessageSquare },
          { id: 'quests', label: 'District Quests', count: districtQuests.length, icon: Target },
          { id: 'ambassadors', label: 'Green Ambassadors', count: ambassadors.length, icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all flex items-center gap-2.5 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md transform scale-102'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
              id={`community-tab-nav-${tab.id}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400 dark:text-emerald-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isActive 
                  ? 'bg-white/20 dark:bg-slate-900/20 text-inherit' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View Content */}
      <div className="pt-2">
        {activeTab === 'swap' && <SwapMarketplaceTab />}
        {activeTab === 'map' && <NearbyDropOffMap />}
        {activeTab === 'events' && <CommunityEventsTab />}
        {activeTab === 'forum' && <CommunityForumTab />}
        {activeTab === 'quests' && <DistrictQuestsTab />}
        {activeTab === 'ambassadors' && <GreenAmbassadorsTab />}
      </div>
    </div>
  );
};
