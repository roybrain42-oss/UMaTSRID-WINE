import React, { useState } from 'react';
import { 
  Leaf, 
  Wind, 
  Trees, 
  Droplets, 
  Scale, 
  Globe, 
  Info,
  Download,
  FileJson,
  Check,
  Sparkles
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { MonthlyImpactTrendChart } from './MonthlyImpactTrendChart';
import { NeighborhoodRecyclingSummary } from './NeighborhoodRecyclingSummary';

export const EnvironmentalImpactView: React.FC = () => {
  const { currentUser, submissions } = useEcoSort();
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showDownloadedNotice, setShowDownloadedNotice] = useState<boolean>(false);

  const totalWasteAll = 12480 + submissions.reduce((acc, s) => acc + (s.actualWeightKg || s.userWeightEstimateKg), 0);
  const plasticKg = Math.round(totalWasteAll * 0.45);
  const co2Total = Math.round(totalWasteAll * 1.6);
  const treesTotal = +(totalWasteAll / 55).toFixed(1);
  const waterLiters = Math.round(totalWasteAll * 12);
  const landfillM3 = +(totalWasteAll * 0.0015).toFixed(1);

  const handleDownloadReport = () => {
    setIsExporting(true);

    try {
      const userSubmissions = submissions.filter(s => s.userId === currentUser.id);
      const categoryBreakdown: Record<string, { weightKg: number; count: number; points: number }> = {};
      userSubmissions.forEach(sub => {
        const cat = sub.classification?.category || 'OTHER';
        const weight = sub.actualWeightKg || sub.userWeightEstimateKg || 0;
        const points = sub.pointsAwarded || 0;
        if (!categoryBreakdown[cat]) {
          categoryBreakdown[cat] = { weightKg: 0, count: 0, points: 0 };
        }
        categoryBreakdown[cat].weightKg = +(categoryBreakdown[cat].weightKg + weight).toFixed(2);
        categoryBreakdown[cat].count += 1;
        categoryBreakdown[cat].points += points;
      });

      const reportData = {
        reportTitle: "EcoSort Ghana - Environmental Impact Report",
        generatedAt: new Date().toISOString(),
        userProfile: {
          id: currentUser.id,
          name: currentUser.name,
          community: currentUser.community || currentUser.location || "Ghana",
          totalWasteKg: currentUser.totalWasteKg,
          co2SavedKg: currentUser.co2SavedKg,
          ecoPoints: currentUser.ecoPoints,
        },
        impactMetrics: {
          carbonSavedKg: currentUser.co2SavedKg,
          recycledWasteKg: currentUser.totalWasteKg,
          treesSavedEquivalent: +(currentUser.totalWasteKg / 55).toFixed(2),
          waterConservedLitres: Math.round(currentUser.totalWasteKg * 12),
        },
        categoryBreakdown
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
      const downloadAnchor = document.createElement('a');
      const sanitizedName = currentUser.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const dateStamp = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `ecosort-impact-${sanitizedName}-${dateStamp}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setTimeout(() => {
        setIsExporting(false);
        setShowDownloadedNotice(true);
        setTimeout(() => setShowDownloadedNotice(false), 3500);
      }, 300);
    } catch (err) {
      console.error("Failed to generate impact report:", err);
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-teal-500/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
            <Leaf className="w-3 h-3 text-teal-400" />
            Ghana EPA Carbon Model
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Environmental Impact & Carbon Tracker
          </h1>
          <p className="text-teal-200/80 text-xs sm:text-sm max-w-xl">
            Real-time ecological savings calculated from verified waste diversion.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            type="button"
            id="download-impact-report-btn"
            onClick={handleDownloadReport}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {showDownloadedNotice ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Downloaded</span>
              </>
            ) : isExporting ? (
              <>
                <FileJson className="w-4 h-4 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </>
            )}
          </button>

          <div className="bg-slate-900/90 border border-teal-500/30 px-4 py-2.5 rounded-xl text-center">
            <span className="text-[10px] text-teal-300 font-bold uppercase block">Total Net CO₂</span>
            <span className="text-xl sm:text-2xl font-black text-teal-400">{(co2Total / 1000).toFixed(1)} <span className="text-xs font-normal text-white">Tons</span></span>
          </div>
        </div>
      </div>

      {/* 6 Core Impact Badges */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Waste */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-2">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Total Waste</span>
            <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{totalWasteAll.toLocaleString()} kg</span>
          </div>
        </div>

        {/* Plastic Diverted */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-2">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Plastic</span>
            <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">{plasticKg.toLocaleString()} kg</span>
          </div>
        </div>

        {/* CO2 Emissions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 flex items-center justify-center mb-2">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">CO₂ Saved</span>
            <span className="text-lg sm:text-xl font-bold text-teal-600 dark:text-teal-400">{co2Total.toLocaleString()} kg</span>
          </div>
        </div>

        {/* Trees Equivalent */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-2">
            <Trees className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Trees Equiv.</span>
            <span className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">{treesTotal}</span>
          </div>
        </div>

        {/* Water Conserved */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 flex items-center justify-center mb-2">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Water Saved</span>
            <span className="text-lg sm:text-xl font-bold text-cyan-600 dark:text-cyan-400">{waterLiters.toLocaleString()} L</span>
          </div>
        </div>

        {/* Landfill Volume Saved */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-2">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Landfill Vol.</span>
            <span className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400">{landfillM3} m³</span>
          </div>
        </div>

      </div>

      {/* Top 3 Most Recycled Materials in Local Neighborhood */}
      <NeighborhoodRecyclingSummary />

      {/* Monthly Trend Graph */}
      <MonthlyImpactTrendChart submissions={submissions} />
    </div>
  );
};
