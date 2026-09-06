import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  TrendingUp, 
  Wind, 
  Zap, 
  Users,
  Scale
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { WasteCategory, WasteMaterial } from '../../types';

interface NeighborhoodData {
  id: string;
  name: string;
  district: string;
  region: string;
  activeCitizens: number;
  baseMaterials: {
    material: WasteMaterial | string;
    category: WasteCategory;
    displayName: string;
    baseWeightKg: number;
    co2PerKg: number;
    kwhPerKg: number;
    commonItems: string;
    sortingTip: string;
    trendPercentage: number;
    color: string;
    bgGradient: string;
    iconEmoji: string;
  }[];
}

const NEIGHBORHOOD_DATASETS: Record<string, NeighborhoodData> = {
  'legon': {
    id: 'legon',
    name: 'Legon & East Legon',
    district: 'Ayawaso West',
    region: 'Greater Accra',
    activeCitizens: 342,
    baseMaterials: [
      {
        material: 'PET Plastic',
        category: 'PLASTIC',
        displayName: 'PET Plastic Bottles',
        baseWeightKg: 3420,
        co2PerKg: 1.6,
        kwhPerKg: 5.8,
        commonItems: 'Water & soda bottles',
        sortingTip: 'Rinse, flatten, and screw cap on.',
        trendPercentage: 18.4,
        color: 'text-blue-600 dark:text-blue-400',
        bgGradient: 'from-blue-500/10 to-transparent border-blue-500/30',
        iconEmoji: '🧴'
      },
      {
        material: 'LDPE Sachet',
        category: 'PLASTIC',
        displayName: 'Pure Water Sachets',
        baseWeightKg: 2180,
        co2PerKg: 1.6,
        kwhPerKg: 4.2,
        commonItems: 'Drinking water sachet sleeves',
        sortingTip: 'Drain dry and pack into bundle bags.',
        trendPercentage: 12.0,
        color: 'text-cyan-600 dark:text-cyan-400',
        bgGradient: 'from-cyan-500/10 to-transparent border-cyan-500/30',
        iconEmoji: '💧'
      },
      {
        material: 'Aluminum Can',
        category: 'METAL',
        displayName: 'Aluminum Cans',
        baseWeightKg: 1240,
        co2PerKg: 2.4,
        kwhPerKg: 14.0,
        commonItems: 'Malt & soft drink cans',
        sortingTip: 'Rinse and crush flat to save space.',
        trendPercentage: 9.2,
        color: 'text-amber-600 dark:text-amber-400',
        bgGradient: 'from-amber-500/10 to-transparent border-amber-500/30',
        iconEmoji: '🥫'
      }
    ]
  },
  'madina': {
    id: 'madina',
    name: 'Madina & Zongo',
    district: 'La Nkwantanang',
    region: 'Greater Accra',
    activeCitizens: 289,
    baseMaterials: [
      {
        material: 'LDPE Sachet',
        category: 'PLASTIC',
        displayName: 'Pure Water Sachets',
        baseWeightKg: 4120,
        co2PerKg: 1.6,
        kwhPerKg: 4.2,
        commonItems: 'Water sachets from vendors & homes',
        sortingTip: 'Bundle clean dry sachets together.',
        trendPercentage: 22.1,
        color: 'text-cyan-600 dark:text-cyan-400',
        bgGradient: 'from-cyan-500/10 to-transparent border-cyan-500/30',
        iconEmoji: '💧'
      },
      {
        material: 'PET Plastic',
        category: 'PLASTIC',
        displayName: 'PET Beverage Bottles',
        baseWeightKg: 2890,
        co2PerKg: 1.6,
        kwhPerKg: 5.8,
        commonItems: 'Soft drink & mineral water bottles',
        sortingTip: 'Keep caps screwed on.',
        trendPercentage: 14.8,
        color: 'text-blue-600 dark:text-blue-400',
        bgGradient: 'from-blue-500/10 to-transparent border-blue-500/30',
        iconEmoji: '🧴'
      },
      {
        material: 'Aluminum Can',
        category: 'METAL',
        displayName: 'Beverage Cans',
        baseWeightKg: 940,
        co2PerKg: 2.4,
        kwhPerKg: 14.0,
        commonItems: 'Canned drinks and food tins',
        sortingTip: 'Rinse out food residues.',
        trendPercentage: 7.6,
        color: 'text-amber-600 dark:text-amber-400',
        bgGradient: 'from-amber-500/10 to-transparent border-amber-500/30',
        iconEmoji: '🥫'
      }
    ]
  },
  'tema': {
    id: 'tema',
    name: 'Tema Community Hub',
    district: 'Tema Metropolis',
    region: 'Greater Accra',
    activeCitizens: 415,
    baseMaterials: [
      {
        material: 'PET Plastic',
        category: 'PLASTIC',
        displayName: 'PET Bottles & Containers',
        baseWeightKg: 4850,
        co2PerKg: 1.6,
        kwhPerKg: 5.8,
        commonItems: 'Beverage bottles & jugs',
        sortingTip: 'Compress firmly before collection.',
        trendPercentage: 16.2,
        color: 'text-blue-600 dark:text-blue-400',
        bgGradient: 'from-blue-500/10 to-transparent border-blue-500/30',
        iconEmoji: '🧴'
      },
      {
        material: 'Corrugated Paper',
        category: 'PAPER',
        displayName: 'Cardboard & Cartons',
        baseWeightKg: 3200,
        co2PerKg: 0.9,
        kwhPerKg: 3.1,
        commonItems: 'Shipping & food boxes',
        sortingTip: 'Keep dry and fold flat.',
        trendPercentage: 11.4,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgGradient: 'from-emerald-500/10 to-transparent border-emerald-500/30',
        iconEmoji: '📦'
      },
      {
        material: 'Aluminum Can',
        category: 'METAL',
        displayName: 'Scrap Metal & Cans',
        baseWeightKg: 1850,
        co2PerKg: 2.4,
        kwhPerKg: 14.0,
        commonItems: 'Drink cans and sheet tins',
        sortingTip: 'Keep dry and separate from trash.',
        trendPercentage: 8.8,
        color: 'text-amber-600 dark:text-amber-400',
        bgGradient: 'from-amber-500/10 to-transparent border-amber-500/30',
        iconEmoji: '🥫'
      }
    ]
  },
  'kumasi': {
    id: 'kumasi',
    name: 'Kumasi & KNUST Hub',
    district: 'Oforikrom Municipal',
    region: 'Ashanti Region',
    activeCitizens: 380,
    baseMaterials: [
      {
        material: 'LDPE Sachet',
        category: 'PLASTIC',
        displayName: 'Pure Water Sachets',
        baseWeightKg: 3950,
        co2PerKg: 1.6,
        kwhPerKg: 4.2,
        commonItems: 'Hostel and campus water sachets',
        sortingTip: 'Collect into dry bundle sacks.',
        trendPercentage: 20.4,
        color: 'text-cyan-600 dark:text-cyan-400',
        bgGradient: 'from-cyan-500/10 to-transparent border-cyan-500/30',
        iconEmoji: '💧'
      },
      {
        material: 'PET Plastic',
        category: 'PLASTIC',
        displayName: 'PET Drink Bottles',
        baseWeightKg: 3100,
        co2PerKg: 1.6,
        kwhPerKg: 5.8,
        commonItems: 'Plastic drink & juice bottles',
        sortingTip: 'Flatten bottles to save bag room.',
        trendPercentage: 15.1,
        color: 'text-blue-600 dark:text-blue-400',
        bgGradient: 'from-blue-500/10 to-transparent border-blue-500/30',
        iconEmoji: '🧴'
      },
      {
        material: 'Corrugated Paper',
        category: 'PAPER',
        displayName: 'Paper & Study Notes',
        baseWeightKg: 1420,
        co2PerKg: 0.9,
        kwhPerKg: 3.1,
        commonItems: 'Notebooks, books & boxes',
        sortingTip: 'Keep clean and dry.',
        trendPercentage: 6.9,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgGradient: 'from-emerald-500/10 to-transparent border-emerald-500/30',
        iconEmoji: '📦'
      }
    ]
  },
  'osu': {
    id: 'osu',
    name: 'Osu & Coastal Strip',
    district: 'Korle Klottey',
    region: 'Greater Accra',
    activeCitizens: 260,
    baseMaterials: [
      {
        material: 'PET Plastic',
        category: 'PLASTIC',
        displayName: 'PET Plastic Bottles',
        baseWeightKg: 2950,
        co2PerKg: 1.6,
        kwhPerKg: 5.8,
        commonItems: 'Beverage bottles from cafes & homes',
        sortingTip: 'Rinse and crush flat.',
        trendPercentage: 17.0,
        color: 'text-blue-600 dark:text-blue-400',
        bgGradient: 'from-blue-500/10 to-transparent border-blue-500/30',
        iconEmoji: '🧴'
      },
      {
        material: 'LDPE Sachet',
        category: 'PLASTIC',
        displayName: 'Pure Water Sachets',
        baseWeightKg: 2400,
        co2PerKg: 1.6,
        kwhPerKg: 4.2,
        commonItems: 'Single-use water sachets',
        sortingTip: 'Keep dry in ventilated bags.',
        trendPercentage: 14.5,
        color: 'text-cyan-600 dark:text-cyan-400',
        bgGradient: 'from-cyan-500/10 to-transparent border-cyan-500/30',
        iconEmoji: '💧'
      },
      {
        material: 'Aluminum Can',
        category: 'METAL',
        displayName: 'Aluminum Cans',
        baseWeightKg: 980,
        co2PerKg: 2.4,
        kwhPerKg: 14.0,
        commonItems: 'Canned drinks & sodas',
        sortingTip: 'Crush flat to save space.',
        trendPercentage: 8.3,
        color: 'text-amber-600 dark:text-amber-400',
        bgGradient: 'from-amber-500/10 to-transparent border-amber-500/30',
        iconEmoji: '🥫'
      }
    ]
  }
};

export const NeighborhoodRecyclingSummary: React.FC = () => {
  const { currentUser, submissions } = useEcoSort();

  const initialKey = useMemo(() => {
    const loc = (currentUser.community || currentUser.location || '').toLowerCase();
    if (loc.includes('madina') || loc.includes('zongo')) return 'madina';
    if (loc.includes('tema') || loc.includes('industrial')) return 'tema';
    if (loc.includes('kumasi') || loc.includes('knust') || loc.includes('ashanti')) return 'kumasi';
    if (loc.includes('osu') || loc.includes('jamestown') || loc.includes('coastal') || loc.includes('la')) return 'osu';
    return 'legon';
  }, [currentUser.community, currentUser.location]);

  const [selectedNeighborhoodKey, setSelectedNeighborhoodKey] = useState<string>(initialKey);
  const activeNeighborhood = NEIGHBORHOOD_DATASETS[selectedNeighborhoodKey] || NEIGHBORHOOD_DATASETS['legon'];

  const aggregatedMaterials = useMemo(() => {
    const materialMap: Record<string, {
      material: string;
      category: WasteCategory;
      displayName: string;
      totalWeightKg: number;
      co2PerKg: number;
      kwhPerKg: number;
      commonItems: string;
      sortingTip: string;
      trendPercentage: number;
      color: string;
      bgGradient: string;
      iconEmoji: string;
    }> = {};

    activeNeighborhood.baseMaterials.forEach(item => {
      materialMap[item.material] = {
        ...item,
        totalWeightKg: item.baseWeightKg
      };
    });

    submissions.forEach(sub => {
      const mat = sub.classification?.material;
      const weight = sub.actualWeightKg || sub.userWeightEstimateKg || 0;
      if (!mat) return;

      if (materialMap[mat]) {
        materialMap[mat].totalWeightKg += weight;
      }
    });

    const sortedList = Object.values(materialMap).sort((a, b) => b.totalWeightKg - a.totalWeightKg);
    const grandTotalKg = sortedList.reduce((acc, curr) => acc + curr.totalWeightKg, 0);

    return {
      top3: sortedList.slice(0, 3).map((item, index) => ({
        ...item,
        rank: index + 1,
        sharePercentage: grandTotalKg > 0 ? +((item.totalWeightKg / grandTotalKg) * 100).toFixed(1) : 0,
        totalCo2SavedKg: Math.round(item.totalWeightKg * item.co2PerKg),
        totalKwhSaved: Math.round(item.totalWeightKg * item.kwhPerKg)
      })),
      grandTotalKg
    };
  }, [activeNeighborhood, submissions]);

  const top3 = aggregatedMaterials.top3;
  const grandTotal = aggregatedMaterials.grandTotalKg;

  const userContributionKg = useMemo(() => {
    return submissions
      .filter(s => s.userId === currentUser.id)
      .reduce((acc, s) => acc + (s.actualWeightKg || s.userWeightEstimateKg || 0), currentUser.totalWasteKg || 0);
  }, [submissions, currentUser]);

  const rankMedals = ['🥇 #1', '🥈 #2', '🥉 #3'];

  return (
    <section 
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5"
      id="neighborhood-top-materials-summary"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Local Impact
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Top 3 Recycled Materials in {activeNeighborhood.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ranked by certified collected weight in your local area.
          </p>
        </div>

        {/* Neighborhood Selector */}
        <div className="flex items-center gap-2">
          <select
            id="neighborhood-select"
            value={selectedNeighborhoodKey}
            onChange={(e) => setSelectedNeighborhoodKey(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
          >
            <option value="legon">📍 Legon & East Legon</option>
            <option value="madina">📍 Madina & Zongo</option>
            <option value="tema">📍 Tema Hub</option>
            <option value="kumasi">📍 Kumasi & KNUST</option>
            <option value="osu">📍 Osu & Coast</option>
          </select>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <Users className="w-3 h-3 text-emerald-600" />
            <span className="font-bold">{activeNeighborhood.activeCitizens}</span>
          </div>
        </div>
      </div>

      {/* Top 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map((item, idx) => (
          <div
            key={item.material}
            className={`rounded-2xl p-4 sm:p-5 border bg-gradient-to-b ${item.bgGradient} flex flex-col justify-between space-y-4`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs">
                  {rankMedals[idx]}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +{item.trendPercentage}%
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.iconEmoji}</span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {item.displayName}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.commonItems}
                </p>
              </div>

              {/* Weight Metric */}
              <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-baseline justify-between">
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    {item.totalWeightKg.toLocaleString()} <span className="text-xs font-medium text-slate-400">kg</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {item.sharePercentage}%
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-emerald-500" 
                    style={{ width: `${Math.min(100, item.sharePercentage)}%` }}
                  />
                </div>
              </div>

              {/* Savings metrics */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-medium">
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 block font-semibold">CO₂ Saved</span>
                  <span className="font-bold">{item.totalCo2SavedKg.toLocaleString()} kg</span>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium">
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-semibold">Energy</span>
                  <span className="font-bold">{item.totalKwhSaved.toLocaleString()} kWh</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Tip: </span>
              {item.sortingTip}
            </div>
          </div>
        ))}
      </div>

      {/* User Contribution Footnote */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-600" />
          <span>Your neighborhood contribution: <strong className="text-slate-900 dark:text-white font-bold">{userContributionKg.toFixed(1)} kg</strong></span>
        </div>
        <span className="text-emerald-600 font-bold">
          {((userContributionKg / Math.max(1, grandTotal)) * 100).toFixed(2)}% of zone total
        </span>
      </div>
    </section>
  );
};
