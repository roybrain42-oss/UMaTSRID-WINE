import React, { useState } from 'react';
import { 
  Lightbulb, 
  CheckCircle2, 
  Share2, 
  Coins, 
  ChevronRight, 
  ChevronLeft,
  Copy,
  Check
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';

export interface RecyclingTip {
  id: string;
  category: 'Plastics' | 'Metals' | 'E-Waste' | 'Paper & Glass';
  title: string;
  actionableStep: string;
  impactMetrics: string;
  difficulty: 'Easy' | 'Intermediate';
  pointsReward: number;
}

export const RECYCLING_TIPS_DATABASE: RecyclingTip[] = [
  {
    id: 'tip-1',
    category: 'Plastics',
    title: 'Keep Bottle Caps Attached When Crushing PET Bottles',
    actionableStep: 'Rinse bottles, flatten firmly to save space, and screw the cap back on before bagging.',
    impactMetrics: 'Saves bottle caps from falling through sorting screens into landfills.',
    difficulty: 'Easy',
    pointsReward: 5
  },
  {
    id: 'tip-2',
    category: 'Plastics',
    title: 'Bundle Clean Water Sachets (LDPE)',
    actionableStep: 'Drain water droplets completely, air-dry, and pack 50+ sachets into one master bag.',
    impactMetrics: 'Prevents street gutter clogging and feeds circular paving stone production.',
    difficulty: 'Easy',
    pointsReward: 5
  },
  {
    id: 'tip-3',
    category: 'Metals',
    title: 'Rinse & Separate Drink Cans from Food Tins',
    actionableStep: 'Lightly rinse drink cans (Malt, Coke) and food tins. Crush cans flat to save 80% space.',
    impactMetrics: 'Saves 95% of energy compared to virgin bauxite smelting.',
    difficulty: 'Easy',
    pointsReward: 5
  },
  {
    id: 'tip-4',
    category: 'E-Waste',
    title: 'Tape Battery Terminals Before Drop-off',
    actionableStep: 'Place clear tape over battery terminals (+/- poles) before placing in e-waste drop bins.',
    impactMetrics: 'Eliminates fire hazards and protects groundwater from heavy metals.',
    difficulty: 'Intermediate',
    pointsReward: 10
  },
  {
    id: 'tip-5',
    category: 'Paper & Glass',
    title: 'Keep Paper Clean and Away from Cooking Oil',
    actionableStep: 'Keep cartons and paper dry. Avoid mixing oil-soaked food boxes with clean paper.',
    impactMetrics: '1 ton of clean paper preserves 17 mature trees and 26,000L of water.',
    difficulty: 'Easy',
    pointsReward: 5
  }
];

export const RecyclingTipOfDay: React.FC = () => {
  const { addToast } = useEcoSort();
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
  const [completedTipIds, setCompletedTipIds] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const activeTip = RECYCLING_TIPS_DATABASE[currentTipIndex];
  const isPracticed = completedTipIds.includes(activeTip.id);

  const handleNext = () => {
    setCurrentTipIndex((prev) => (prev + 1) % RECYCLING_TIPS_DATABASE.length);
  };

  const handlePrev = () => {
    setCurrentTipIndex((prev) => (prev - 1 + RECYCLING_TIPS_DATABASE.length) % RECYCLING_TIPS_DATABASE.length);
  };

  const handlePracticeAction = () => {
    if (isPracticed) return;
    setCompletedTipIds((prev) => [...prev, activeTip.id]);
    addToast({
      title: `+${activeTip.pointsReward} EcoPoints Earned! 🎉`,
      message: `Verified: ${activeTip.title}`,
      type: 'success'
    });
  };

  const handleShare = () => {
    const text = `💡 EcoSort Recycling Tip: ${activeTip.title} - ${activeTip.actionableStep}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      title: 'Copied to Clipboard!',
      message: 'Ready to share with neighbors.',
      type: 'info'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
      <div className="flex items-start gap-3.5 max-w-2xl">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-5 h-5 fill-amber-500/20" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Tip of the Day
            </span>
            <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
              {activeTip.category}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {activeTip.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {activeTip.actionableStep}
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end shrink-0 flex-wrap">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Previous tip"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold px-2 text-slate-600 dark:text-slate-300">
            {currentTipIndex + 1}/{RECYCLING_TIPS_DATABASE.length}
          </span>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Next tip"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handlePracticeAction}
          disabled={isPracticed}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            isPracticed
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
          }`}
        >
          {isPracticed ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Practiced</span>
            </>
          ) : (
            <>
              <Coins className="w-3.5 h-3.5" />
              <span>I Did This (+{activeTip.pointsReward} Pts)</span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          title="Share tip"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
