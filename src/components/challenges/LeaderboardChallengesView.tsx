import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Medal, 
  Users, 
  Scale, 
  Sparkles, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  School,
  Building2,
  Gift,
  Bell,
  Send
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';

export const LeaderboardChallengesView: React.FC = () => {
  const { leaderboard, challenge, currentUser, triggerCelebration, triggerSimulatedPush, setShowPushSimulationModal } = useEcoSort();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNIVERSITY' | 'SCHOOL' | 'COMMUNITY'>('ALL');
  const [timeFilter, setTimeFilter] = useState<'MONTH' | 'WEEK' | 'ALL_TIME'>('MONTH');
  const [hasJoinedChallenge, setHasJoinedChallenge] = useState<boolean>(true);

  const filteredEntries = leaderboard.filter(item => {
    if (activeFilter === 'ALL') return true;
    return item.type === activeFilter;
  });

  const progressPercent = Math.min(100, Math.round((challenge.currentKg / challenge.goalKg) * 100));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Active Challenge Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-400/30">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              National Recycling Championship • Active Challenge
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {challenge.title}
            </h1>
            <p className="text-slate-300 text-sm">
              {challenge.subtitle} • Compete with campuses across Ghana to divert single-use plastic waste into circular value.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2.5 min-w-[220px]">
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 text-center">
              <span className="text-[10px] text-amber-300 font-bold uppercase block">Funded Prize Pool</span>
              <span className="text-2xl font-black text-amber-400">GH₵ {challenge.prizePoolGhs.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Top 3 Green Labs Grants</span>
            </div>

            <button
              onClick={() => triggerSimulatedPush('push-milestone-ug-10k')}
              className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              title="Simulate push alert when 10,000kg milestone is reached"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Simulate Milestone Push Alert</span>
            </button>
          </div>
        </div>

        {/* Progress Bar towards National Goal */}
        <div className="mt-6 pt-6 border-t border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">National Milestone: {challenge.currentKg.toLocaleString()} / {challenge.goalKg.toLocaleString()} kg Diverted</span>
            <span className="text-amber-400 font-mono">{progressPercent}% Goal Met</span>
          </div>

          <div className="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-slate-800">
            <div 
              style={{ width: `${progressPercent}%` }}
              className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-md shadow-amber-500/30"
            />
          </div>
        </div>
      </div>

      {/* Leaderboard Controls & Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-500" />
              Ghana National Recycling Leaderboard
            </h2>
            <p className="text-xs text-slate-500">Live verified metric rankings based on audited weight receipts</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeFilter === 'ALL' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('UNIVERSITY')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeFilter === 'UNIVERSITY' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Universities
              </button>
              <button
                onClick={() => setActiveFilter('SCHOOL')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeFilter === 'SCHOOL' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Halls
              </button>
              <button
                onClick={() => setActiveFilter('COMMUNITY')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeFilter === 'COMMUNITY' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Communities
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="space-y-3">
          {filteredEntries.map((entry, index) => (
            <div 
              key={entry.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                entry.id === 'inst-ug-legon'
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-400 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank Badge */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${
                  entry.rank === 1 ? 'bg-amber-400 text-slate-950' :
                  entry.rank === 2 ? 'bg-slate-300 text-slate-900' :
                  entry.rank === 3 ? 'bg-amber-700 text-white' :
                  'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  #{entry.rank}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {entry.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {entry.badge}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {entry.location} • {entry.participantsCount} Active Champions
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">Total Recycled</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {entry.wasteCollectedKg.toLocaleString()} kg
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">EcoPoints</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    +{entry.pointsEarned.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
