import React from 'react';
import { 
  Target, 
  MapPin, 
  Users, 
  Trophy, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Leaf
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';

export const DistrictQuestsTab: React.FC = () => {
  const { districtQuests, setCurrentView, addToast, triggerCelebration } = useEcoSort();

  const handleContribute = (questTitle: string) => {
    addToast({
      title: 'Redirecting to AI Waste Scanner 📸',
      message: `Every kilogram you upload contributes directly to ${questTitle}!`,
      type: 'info',
      duration: 4000
    });
    setCurrentView('user-app');
  };

  return (
    <div className="space-y-6" id="district-quests-tab">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-xl space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold uppercase tracking-widest border border-indigo-400/30">
                National Collective Quests
              </span>
              <span className="text-xs text-slate-300">Neighborhood Collaborative Targets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              District Clean Quests & Community Prize Pools
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join forces with students, residents, and businesses in your district. When the collective weight goal is unlocked, the community prize pool is split among all active contributors!
            </p>
          </div>

          <button
            onClick={() => {
              triggerCelebration();
              addToast({
                title: 'Ghana District Network Active 🇬🇭',
                message: 'All 16 regions are participating in March 2026 clean quests!',
                type: 'success',
                duration: 3500
              });
            }}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            Check Live Rankings
          </button>
        </div>
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {districtQuests.map((quest) => {
          const progressPercent = Math.min(100, Math.round((quest.currentCollectedKg / quest.targetWeightKg) * 100));
          const isCompleted = quest.status === 'COMPLETED' || progressPercent >= 100;

          return (
            <div
              key={quest.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              id={`district-quest-${quest.id}`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{quest.districtName}, {quest.region}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                      {quest.title}
                    </h3>
                  </div>

                  {/* Prize Badge */}
                  <div className="px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-right flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider block">Community Pool</span>
                    <strong className="text-sm font-black flex items-center gap-1 justify-end">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      {quest.communityPrizePoolPts} Pts
                    </strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {quest.description}
                </p>

                {/* Progress Metric Block */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-400">
                      Progress: {quest.currentCollectedKg.toLocaleString()} / {quest.targetWeightKg.toLocaleString()} kg
                    </span>
                    <span className={isCompleted ? 'text-emerald-600 font-extrabold' : 'text-indigo-600'}>
                      {progressPercent}% Complete
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-teal-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      {quest.contributorsCount} active contributors
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Leaf className="w-3 h-3" />
                      {quest.co2SavedKg} kg CO₂ saved
                    </span>
                  </div>
                </div>

                {/* Category & Deadline */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    Category: {quest.targetCategory}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    ⏳ {quest.daysLeft} days remaining
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleContribute(quest.title)}
                  className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-98"
                  id={`contribute-quest-btn-${quest.id}`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Contribute Recyclables to Quest</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
