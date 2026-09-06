import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Camera,
  Layers,
  Trash2,
  Droplets,
  Package,
  Cpu,
  Apple,
  Wine,
  ShieldCheck,
  Zap,
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';

export type WasteCategory = 'ALL' | 'PLASTICS' | 'SACHETS' | 'METALS' | 'PAPER' | 'ORGANIC' | 'EWASTE_GLASS';

interface FAQItem {
  id: string;
  category: WasteCategory;
  question: string;
  shortSummary: string;
  badge: {
    text: string;
    color: string;
  };
  steps: string[];
  dos: string[];
  donts: string[];
  pointBonusTip: string;
  epaGhanaStandard: string;
  materialType: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'pet-plastics',
    category: 'PLASTICS',
    question: 'How do I prepare PET Plastic Bottles (Voltic, Bel-Aqua, Coke) for collection?',
    shortSummary: 'Rinse out liquids, crush bottles to save 70% bag space, and keep caps attached or bundled.',
    badge: { text: 'High Demand', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    steps: [
      'Pour out all remaining liquid, juices, or water completely.',
      'Give a quick rinse with greywater (used rinse water) if sugary drinks were inside to deter ants.',
      'Uncap, flatten/crush the bottle with your hand or foot to remove air, then screw cap back on tightly.',
      'Pack crushed bottles into a clean clear bag or reusable sack for collection.'
    ],
    dos: [
      'Flatten bottles completely to maximize storage in collector tricycles',
      'Bundle transparent clear bottles together for premium sorting rate',
      'Leave plastic cap on after crushing so it stays within the recycling stream'
    ],
    donts: [
      'Do not pack bottles filled with sand, urine, or dirty oil',
      'Avoid mixing burning debris or cigarette ash inside bottles',
      'Do not bundle with unrinsed dairy/milk residues'
    ],
    pointBonusTip: 'Dry, crushed clear PET earns the standard +15 EcoPoints/kg bonus from registered aggregators.',
    epaGhanaStandard: 'EPA-GH Std 402/2024: Transparent PET Polyethylene Terephthalate Grade A.',
    materialType: 'Plastic (PET #1)'
  },
  {
    id: 'pure-water-sachets',
    category: 'SACHETS',
    question: 'How should "Pure Water" LDPE sachets be pre-sorted and bundled?',
    shortSummary: 'Dry thoroughly to avoid foul mold odor, shake out trapped drops, and pack tightly inside a master rubber bag.',
    badge: { text: 'Ghana Special', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    steps: [
      'Ensure the empty sachet rubber has no stagnant water trapped inside (give it a brisk shake).',
      'Air-dry damp sachets on a clean tray or line for 15 minutes before long-term storage.',
      'Stuff hundreds of flattened sachets into one single "mother" sachet bag until densely packed.',
      'Weigh or tie the top securely before requesting collection.'
    ],
    dos: [
      'Collect in bulk (e.g. 50-100+ sachets per bundle)',
      'Keep sachets away from cooking grease and charcoal dust',
      'Pack tightly to make transport easy for local tricycle agents'
    ],
    donts: [
      'Do not pack wet sachets sealed in dark bags for weeks (generates foul mildew odor)',
      'Do not mix with food waste or soup wrappers'
    ],
    pointBonusTip: 'Clean dry LDPE sachet bundles get 100% quick approval by collection agents without re-weighing disputes.',
    epaGhanaStandard: 'Ghana Environmental Sanitation Code: Low-Density Polyethylene (LDPE #4) Circular Stream.',
    materialType: 'Plastic Sachet (LDPE #4)'
  },
  {
    id: 'metals-cans',
    category: 'METALS',
    question: 'How do I pre-sort beverage cans, canned food tins, and scrap aluminium?',
    shortSummary: 'Rinse food sauce residues (tomato paste, sardine tins), flatten drink cans, and keep iron/steel dry.',
    badge: { text: 'Top MoMo Value', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    steps: [
      'Rinse food tins (sardine, mackerel, tomato purée, evaporated milk) with soapy water to eliminate grease and pests.',
      'Carefully push sharp lid edges inside the can to prevent injury to sorters and collectors.',
      'Crush aluminium drink cans (Club, Guinness, Malta, Coke) flat.',
      'Store in a dry box or sack away from rain to prevent rusting of ferrous metals.'
    ],
    dos: [
      'Clean food residues completely to maintain hygienic pickup',
      'Separate lightweight aluminium cans from heavier scrap iron if possible',
      'Check for sharp edges and tuck them safely'
    ],
    donts: [
      'Do not include pressurized aerosol spray cans unless completely depressurized and punctured safely',
      'Do not mix chemical paint cans without prior drying'
    ],
    pointBonusTip: 'Clean aluminium cans fetch the highest payout tier (+20 EcoPoints/kg) at Ghana smelter depots.',
    epaGhanaStandard: 'EPA Ghana Scrap Metal Circularity Standard GS 1209:2023.',
    materialType: 'Metal (Aluminium & Tin)'
  },
  {
    id: 'paper-cardboard',
    category: 'PAPER',
    question: 'How should carton boxes, books, office paper, and egg crates be prepared?',
    shortSummary: 'Keep completely dry, remove adhesive plastic packing tape, and flatten all cardboard boxes flat.',
    badge: { text: 'Keep 100% Dry', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    steps: [
      'Break down and flatten all corrugated cardboard boxes (appliance, parcel, food cartons).',
      'Peel off heavy plastic packing tape, styrofoam inserts, and bubble wrap.',
      'Tie flattened boxes in neat bundles using twine, string, or rubber bands.',
      'Store indoors in a dry area—never allow rain or damp ground water to soak paper.'
    ],
    dos: [
      'Flatten all boxes to save space in storage',
      'Bundle newspapers, magazines, and notebooks separately',
      'Recycle clean cardboard egg crates'
    ],
    donts: [
      'Do not include oil-soaked pizza boxes or jollof rice paper takeaway boxes (grease ruins paper pulp)',
      'Do not recycle wax-coated drink cups or carbon copy paper'
    ],
    pointBonusTip: 'Dry, unsoiled cardboard retains maximum fiber strength and is eagerly accepted by local paper mills in Tema.',
    epaGhanaStandard: 'Ghana National Paper Recycling Quality Standard GS 984.',
    materialType: 'Paper & Corrugated Cardboard'
  },
  {
    id: 'organic-compost',
    category: 'ORGANIC',
    question: 'How do I separate kitchen scraps, plantain peels, and garden clippings?',
    shortSummary: 'Separate food scraps from plastics immediately at the kitchen counter; keep dairy and meats segregated.',
    badge: { text: 'Soil Nutrients', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
    steps: [
      'Place a dedicated compost bin with a tight-fitting lid in your kitchen or backyard.',
      'Collect cassava/plantain/yam peels, vegetable trimmings, fruit rinds, and coffee grounds.',
      'Mix in "brown" dry materials (dry leaves, sawdust, or shredded unbleached paper) to prevent odor.',
      'Coordinate with your community urban farm drop-off or private composter weekly.'
    ],
    dos: [
      'Add fruit skins, vegetable cuttings, eggshells, and lawn grass',
      'Keep organic waste in a ventilated, shaded container',
      'Use newspaper lining at the bottom of your organic bucket for easy cleaning'
    ],
    donts: [
      'Never mix plastic wrappers, sachet rubbers, or glass with organic scraps',
      'Avoid large quantities of cooked oily sauces or raw animal carcasses in basic neighborhood compost'
    ],
    pointBonusTip: 'Diverting organic waste reduces methane in landfills and earns community green badges.',
    epaGhanaStandard: 'EPA Ghana Organic Waste & Soil Enrichment Protocol 2025.',
    materialType: 'Organic (Food & Biomass)'
  },
  {
    id: 'ewaste-batteries-glass',
    category: 'EWASTE_GLASS',
    question: 'How should electronic waste, used phone batteries, and glass bottles be handled?',
    shortSummary: 'Handle glass gently to avoid breakage; tape lithium battery terminals and keep hazardous electronics dry.',
    badge: { text: 'Hazard Safe', color: 'bg-red-500/20 text-red-300 border-red-500/40' },
    steps: [
      'For glass beverage bottles (Star, Club, Malt): check if deposit return applies or keep whole without breaking.',
      'For broken glass: wrap securely in heavy newspaper or a sturdy box and label clearly "BROKEN GLASS" to protect waste workers.',
      'For AA/AAA or phone lithium batteries: place clear tape over metal terminals to prevent short-circuit sparks.',
      'Deliver e-waste (cables, old phones, broken tablets) directly to certified e-waste hubs (e.g. Agbogbloshie Green Hub / EPA Smart Depot).'
    ],
    dos: [
      'Keep whole glass bottles intact to enable deposit wash and refill loops',
      'Bag used batteries in a dry pouch away from heat or sunlight',
      'Bundle copper cables and phone chargers neatly'
    ],
    donts: [
      'Never burn cables with tires or open flames (produces lethal toxic dioxins)',
      'Never dispose of lithium battery packs in general open trash bins',
      'Do not crush glass bottles into fine dust'
    ],
    pointBonusTip: 'E-waste and whole glass return bottles qualify for specialized high-tier EcoPoints multiplier rewards.',
    epaGhanaStandard: 'Hazardous and Electronic Waste Control and Management Act (Act 917 Ghana).',
    materialType: 'E-Waste & Glass'
  }
];

export const WastePreSortingFAQ: React.FC = () => {
  const { setCurrentView } = useEcoSort();
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['pet-plastics', 'pure-water-sachets']));

  // Filter items by category & search query
  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch =
        item.question.toLowerCase().includes(query) ||
        item.shortSummary.toLowerCase().includes(query) ||
        item.materialType.toLowerCase().includes(query) ||
        item.steps.some(s => s.toLowerCase().includes(query)) ||
        item.dos.some(d => d.toLowerCase().includes(query)) ||
        item.donts.some(d => d.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(FAQ_DATA.map(i => i.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Pre-Sorting & Waste Prep Guidelines
              </h3>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 px-2.5 py-0.5 rounded-full font-bold">
                EPA Ghana Standards
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Learn how to properly clean, crush, separate, and bundle materials to guarantee 100% collector acceptance and earn full EcoPoints.
            </p>
          </div>
        </div>

        {/* Global Expand / Collapse All Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            Collapse All
          </button>
        </div>
      </div>

      {/* Quick Search & Category Filter Pills */}
      <div className="pt-6 pb-4 space-y-3.5">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pre-sorting tips (e.g., 'sachet', 'cans', 'oil', 'paper', 'dry', 'flatten')..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'ALL', label: 'All Materials', count: FAQ_DATA.length },
            { id: 'PLASTICS', label: 'PET Plastics (#1)', count: 1 },
            { id: 'SACHETS', label: 'Pure Water Sachets (#4)', count: 1 },
            { id: 'METALS', label: 'Aluminium & Tin Cans', count: 1 },
            { id: 'PAPER', label: 'Cardboard & Paper', count: 1 },
            { id: 'ORGANIC', label: 'Food & Compost', count: 1 },
            { id: 'EWASTE_GLASS', label: 'E-Waste & Glass', count: 1 }
          ].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as WasteCategory)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Accordion List */}
      <div className="space-y-3 mt-2">
        {filteredFAQs.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-500">
            <Search className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">No pre-sorting guidelines matched your search.</p>
            <button
              onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
              className="mt-2 text-xs text-emerald-600 font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredFAQs.map((item) => {
            const isExpanded = expandedIds.has(item.id);

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'border-emerald-500/50 bg-slate-50/50 dark:bg-slate-800/50 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Accordion Header / Trigger */}
                <button
                  type="button"
                  onClick={() => toggleExpand(item.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 focus:outline-none transition-colors"
                >
                  <div className="space-y-1.5 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {item.materialType}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${item.badge.color}`}>
                        {item.badge.text}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {item.question}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2">
                      {item.shortSummary}
                    </p>
                  </div>

                  <div className={`p-2 rounded-xl border transition-transform duration-200 shrink-0 ${
                    isExpanded
                      ? 'bg-emerald-600 text-white border-emerald-500 rotate-180'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Content Drawer */}
                {isExpanded && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 space-y-4 text-xs sm:text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    
                    {/* Step-by-Step Preparation Checklist */}
                    <div>
                      <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        Step-by-Step Preparation Checklist:
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.steps.map((step, idx) => (
                          <div
                            key={idx}
                            className="bg-white dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200 dark:border-slate-700/70 flex items-start gap-2.5"
                          >
                            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Do's and Don'ts Split Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {/* Do's */}
                      <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-3.5">
                        <h6 className="font-bold text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-1.5 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          Recommended Best Practices (Do):
                        </h6>
                        <ul className="space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200/90">
                          {item.dos.map((d, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2">
                              <span className="text-emerald-500 font-black">•</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Don'ts */}
                      <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-2xl p-3.5">
                        <h6 className="font-bold text-rose-800 dark:text-rose-300 text-xs flex items-center gap-1.5 mb-2">
                          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          Avoid These Mistakes (Don't):
                        </h6>
                        <ul className="space-y-1.5 text-xs text-rose-900 dark:text-rose-200/90">
                          {item.donts.map((dn, dnIdx) => (
                            <li key={dnIdx} className="flex items-start gap-2">
                              <span className="text-rose-500 font-black">•</span>
                              <span>{dn}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Footer Tip & Official EPA Reference */}
                    <div className="bg-slate-100 dark:bg-slate-900/90 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span>EcoPoints Bonus Tip:</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                          {item.pointBonusTip}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400">
                          {item.epaGhanaStandard}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentView('user-app')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Scan & Upload Material
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Why Pre-Sorting Matters Infobox */}
      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-900/20 via-emerald-900/10 to-teal-900/20 border border-blue-500/20 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 dark:text-white block">
            Why Pre-Sorting Directly Increases Your MoMo Payout:
          </span>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
            When you rinse, flatten, and separate items at home, collection agents spend 80% less time inspecting bags. Clean sorted materials achieve higher market scrap pricing at recycling factories in Tema and Kumasi, enabling EcoSort Ghana to credit you with maximum EcoPoints and instant MoMo cash.
          </p>
        </div>
      </div>

    </section>
  );
};
