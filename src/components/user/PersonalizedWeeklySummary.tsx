import React, { useState } from 'react';
import { 
  Sparkles, 
  Leaf, 
  Coins, 
  Scale, 
  Wind, 
  TrendingUp, 
  Calendar, 
  Share2, 
  CheckCircle2, 
  Zap, 
  Droplet, 
  ChevronRight, 
  ChevronLeft,
  Copy,
  Check,
  RefreshCw,
  Trees
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';

interface PersonalizedWeeklySummaryProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const PersonalizedWeeklySummary: React.FC<PersonalizedWeeklySummaryProps> = ({
  onClose,
  isModal = false
}) => {
  const { 
    currentUser, 
    submissions, 
    ecoPointsPerGhs, 
    setShowCashOutModal,
    openShareImpactModal,
    addToast
  } = useEcoSort();

  const [selectedWeek, setSelectedWeek] = useState<'CURRENT' | 'PREVIOUS' | 'TWO_WEEKS_AGO'>('CURRENT');
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const userSubmissions = submissions.filter(s => s.userId === currentUser.id);
  const currentWeekWasteKg = +(Math.max(4.8, currentUser.totalWasteKg * 0.22)).toFixed(1);
  const currentWeekPoints = Math.max(48, Math.round(currentUser.ecoPoints * 0.25));
  const currentWeekCo2Kg = +(currentWeekWasteKg * 1.6).toFixed(2);
  const currentWeekMomoGhs = +(currentWeekPoints / ecoPointsPerGhs).toFixed(2);

  const weeklyData = {
    CURRENT: {
      label: 'This Week',
      dateRange: 'Aug 11 - Aug 17, 2026',
      wasteKg: currentWeekWasteKg,
      wasteTrend: '+28.4%',
      points: currentWeekPoints,
      pointsTrend: '+35 Pts',
      momoGhs: currentWeekMomoGhs,
      co2Kg: currentWeekCo2Kg,
      treesEquivalent: +(currentWeekCo2Kg * 0.08).toFixed(1),
      waterLiters: Math.round(currentWeekWasteKg * 24),
      energyKwh: +(currentWeekWasteKg * 2.8).toFixed(1),
      collections: Math.max(2, Math.round(currentUser.verifiedCollections * 0.2)),
      accuracyScore: 98.6,
      streakDays: 6,
      breakdown: [
        { category: 'Plastics (PET & HDPE)', weightKg: +(currentWeekWasteKg * 0.62).toFixed(1), percentage: 62, color: 'bg-blue-500', count: 18 },
        { category: 'Metals (Cans)', weightKg: +(currentWeekWasteKg * 0.24).toFixed(1), percentage: 24, color: 'bg-amber-500', count: 6 },
        { category: 'Paper & Cardboard', weightKg: +(currentWeekWasteKg * 0.14).toFixed(1), percentage: 14, color: 'bg-emerald-500', count: 4 },
      ],
      topAchievement: 'Master Sorter Badge Unlocked (PET Accuracy > 95%)',
    },
    PREVIOUS: {
      label: 'Last Week',
      dateRange: 'Aug 4 - Aug 10, 2026',
      wasteKg: +(currentWeekWasteKg * 0.78).toFixed(1),
      wasteTrend: '+12.1%',
      points: Math.round(currentWeekPoints * 0.75),
      pointsTrend: '+20 Pts',
      momoGhs: +(currentWeekMomoGhs * 0.75).toFixed(2),
      co2Kg: +(currentWeekCo2Kg * 0.78).toFixed(2),
      treesEquivalent: +(currentWeekCo2Kg * 0.78 * 0.08).toFixed(1),
      waterLiters: Math.round(currentWeekWasteKg * 0.78 * 24),
      energyKwh: +(currentWeekWasteKg * 0.78 * 2.8).toFixed(1),
      collections: Math.max(1, Math.round(currentUser.verifiedCollections * 0.15)),
      accuracyScore: 97.2,
      streakDays: 5,
      breakdown: [
        { category: 'Plastics (PET & HDPE)', weightKg: +(currentWeekWasteKg * 0.78 * 0.55).toFixed(1), percentage: 55, color: 'bg-blue-500', count: 12 },
        { category: 'Metals (Cans)', weightKg: +(currentWeekWasteKg * 0.78 * 0.30).toFixed(1), percentage: 30, color: 'bg-amber-500', count: 5 },
        { category: 'Paper & Cardboard', weightKg: +(currentWeekWasteKg * 0.78 * 0.15).toFixed(1), percentage: 15, color: 'bg-emerald-500', count: 3 },
      ],
      topAchievement: '5-Day Active Sorting Streak (+15 pts)',
    },
    TWO_WEEKS_AGO: {
      label: '2 Weeks Ago',
      dateRange: 'Jul 28 - Aug 3, 2026',
      wasteKg: +(currentWeekWasteKg * 0.65).toFixed(1),
      wasteTrend: 'Baseline',
      points: Math.round(currentWeekPoints * 0.62),
      pointsTrend: '+15 Pts',
      momoGhs: +(currentWeekMomoGhs * 0.62).toFixed(2),
      co2Kg: +(currentWeekCo2Kg * 0.65).toFixed(2),
      treesEquivalent: +(currentWeekCo2Kg * 0.65 * 0.08).toFixed(1),
      waterLiters: Math.round(currentWeekWasteKg * 0.65 * 24),
      energyKwh: +(currentWeekWasteKg * 0.65 * 2.8).toFixed(1),
      collections: 1,
      accuracyScore: 95.0,
      streakDays: 3,
      breakdown: [
        { category: 'Plastics (PET & HDPE)', weightKg: +(currentWeekWasteKg * 0.65 * 0.70).toFixed(1), percentage: 70, color: 'bg-blue-500', count: 10 },
        { category: 'Metals (Cans)', weightKg: +(currentWeekWasteKg * 0.65 * 0.20).toFixed(1), percentage: 20, color: 'bg-amber-500', count: 3 },
        { category: 'Paper & Cardboard', weightKg: +(currentWeekWasteKg * 0.65 * 0.10).toFixed(1), percentage: 10, color: 'bg-emerald-500', count: 2 },
      ],
      topAchievement: 'First EcoSort Verification Completed',
    }
  };

  const activeData = weeklyData[selectedWeek];

  const handleCopySummary = () => {
    const text = `♻️ My EcoSort Weekly Summary (${activeData.label}):
• Waste Diverted: ${activeData.wasteKg} kg (${activeData.wasteTrend})
• EcoPoints Earned: +${activeData.points} pts (GH₵ ${activeData.momoGhs})
• Carbon Offset: ${activeData.co2Kg} kg CO₂ saved
• Pickups Completed: ${activeData.collections}`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
    addToast({
      title: 'Copied!',
      message: 'Weekly summary copied to clipboard.',
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Weekly Recycling Highlights
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {activeData.dateRange} • {activeData.streakDays} day sorting streak
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Week Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['CURRENT', 'PREVIOUS', 'TWO_WEEKS_AGO'] as const).map((wKey) => (
              <button
                key={wKey}
                onClick={() => setSelectedWeek(wKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedWeek === wKey
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {weeklyData[wKey].label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopySummary}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title="Copy weekly stats"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 3 Core Weekly Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* CARD 1: Waste Diverted */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Waste Diverted</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                {activeData.wasteTrend}
              </span>
            </div>

            <div className="mt-4 text-center py-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {activeData.wasteKg} <span className="text-lg text-blue-600 font-semibold">kg</span>
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">{activeData.collections} collections</span>
            </div>

            {/* Visual Breakdown Bar */}
            <div className="mt-4 space-y-2">
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                {activeData.breakdown.map((item, idx) => (
                  <div key={idx} style={{ width: `${item.percentage}%` }} className={`${item.color} h-full`} />
                ))}
              </div>

              <div className="space-y-1.5 pt-1 text-xs">
                {activeData.breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      {item.category}
                    </span>
                    <strong className="text-slate-900 dark:text-white font-medium">{item.weightKg} kg</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex justify-between text-slate-500">
            <span>Accuracy Score</span>
            <strong className="text-blue-600 dark:text-blue-400 font-bold">{activeData.accuracyScore}%</strong>
          </div>
        </div>

        {/* CARD 2: Carbon Avoided */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Carbon Saved</span>
              <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-full">
                EPA Validated
              </span>
            </div>

            <div className="mt-4 text-center py-4 bg-teal-50/50 dark:bg-teal-950/20 rounded-2xl border border-teal-100 dark:border-teal-900/30">
              <span className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400">
                {activeData.co2Kg} <span className="text-lg font-semibold">kg CO₂</span>
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">Avoided from open burning</span>
            </div>

            {/* Eco Equivalencies */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <Trees className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <span className="font-bold block text-slate-900 dark:text-white">{activeData.treesEquivalent}</span>
                <span className="text-[10px] text-slate-400">Trees</span>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <Droplet className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <span className="font-bold block text-slate-900 dark:text-white">{activeData.waterLiters} L</span>
                <span className="text-[10px] text-slate-400">Water</span>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="font-bold block text-slate-900 dark:text-white">{activeData.energyKwh} kWh</span>
                <span className="text-[10px] text-slate-400">Energy</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex justify-between text-slate-500">
            <span>SDG Alignment</span>
            <strong className="text-emerald-600 font-bold">Goal 12 & 13</strong>
          </div>
        </div>

        {/* CARD 3: Points & Cash */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Earned Rewards</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                {activeData.pointsTrend}
              </span>
            </div>

            <div className="mt-4 text-center py-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                +{activeData.points} <span className="text-lg text-amber-500 font-semibold">Pts</span>
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
                ≈ GH₵ {activeData.momoGhs} Mobile Money
              </span>
            </div>

            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Achievement
              </div>
              <p className="text-[11px] leading-relaxed">{activeData.topAchievement}</p>
            </div>
          </div>

          <button
            onClick={() => setShowCashOutModal(true)}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            Cash Out Now
          </button>
        </div>

      </div>
    </div>
  );
};
