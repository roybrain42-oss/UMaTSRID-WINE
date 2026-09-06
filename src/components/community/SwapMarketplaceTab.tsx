import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  RefreshCw, 
  Heart, 
  MapPin, 
  Coins, 
  Gift, 
  Eye, 
  ShieldCheck, 
  Star, 
  Sparkles,
  Tag,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { CommunitySwapItem, SwapItemCategory, SwapTradeType } from '../../types/community';
import { CreateSwapItemModal } from './CreateSwapItemModal';
import { RequestTradeModal } from './RequestTradeModal';

export const SwapMarketplaceTab: React.FC = () => {
  const { 
    swapItems, 
    toggleLikeSwapItem, 
    currentUser,
    ecoPointsPerGhs 
  } = useEcoSort();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTradeType, setSelectedTradeType] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [onlyMyItems, setOnlyMyItems] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [tradeModalItem, setTradeModalItem] = useState<CommunitySwapItem | null>(null);

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'ALL', label: 'All Items', icon: '✨' },
    { id: 'UPCYCLED_CRAFT', label: 'Upcycled Art', icon: '🎨' },
    { id: 'REUSABLE_PACKAGING', label: 'Containers & Jars', icon: '🥫' },
    { id: 'GARDEN_COMPOST', label: 'Garden & Compost', icon: '🌱' },
    { id: 'TOOLS_REPAIR', label: 'Tools & Fixes', icon: '🛠️' },
    { id: 'CLEAN_MATERIALS', label: 'Sorted Materials', icon: '📦' },
    { id: 'BOOKS_EDUCATION', label: 'Books & Guides', icon: '📚' }
  ];

  const districts = useMemo(() => {
    const list = Array.from(new Set(swapItems.map(i => i.district || i.location).filter(Boolean)));
    return ['ALL', ...list];
  }, [swapItems]);

  const filteredItems = useMemo(() => {
    return swapItems.filter(item => {
      if (onlyMyItems && item.sellerId !== currentUser.id) return false;
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      if (selectedTradeType !== 'ALL' && item.tradeType !== selectedTradeType) return false;
      if (selectedDistrict !== 'ALL' && (item.district !== selectedDistrict && item.location !== selectedDistrict)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesLoc = item.location.toLowerCase().includes(q) || (item.district && item.district.toLowerCase().includes(q));
        const matchesSeller = item.sellerName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesSeller) return false;
      }
      return true;
    });
  }, [swapItems, searchQuery, selectedCategory, selectedTradeType, selectedDistrict, onlyMyItems, currentUser.id]);

  const myListedCount = swapItems.filter(i => i.sellerId === currentUser.id).length;

  return (
    <div className="space-y-6" id="swap-marketplace-tab">
      {/* Action Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-xl space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest border border-emerald-400/30">
                Eco-Trade & Swap Spot
              </span>
              <span className="text-xs text-slate-300">Ghana Circular Economy Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Circular Barter & Second-Life Marketplace
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Trade upcycled goods, exchange reusable containers, and claim clean materials with your neighbors. No waste goes to landfill!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
              id="list-swap-item-btn"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              List an Item (+10 Pts)
            </button>
          </div>
        </div>

        {/* Quick Mini Stats inside Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-emerald-800/60 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Active Listings</span>
            <strong className="text-white text-base font-black">{swapItems.length} Goods</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Zero-Waste Trades</span>
            <strong className="text-emerald-400 text-base font-black">480+ Swapped</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Landfill Diverted</span>
            <strong className="text-teal-300 text-base font-black">1,820 kg</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase font-bold">My Listings</span>
            <strong className="text-amber-300 text-base font-black">{myListedCount} Items</strong>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crafts, glass jars, tools, materials, locations..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              id="search-swap-items-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Trade Type Filter Pills & My Items Toggle */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedTradeType('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedTradeType === 'ALL'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedTradeType('BARTER')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedTradeType === 'BARTER'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <RefreshCw className="w-3 h-3" />
              Barter Swap
            </button>
            <button
              onClick={() => setSelectedTradeType('POINTS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedTradeType === 'POINTS'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
              }`}
            >
              <Coins className="w-3 h-3" />
              EcoPoints
            </button>
            <button
              onClick={() => setSelectedTradeType('FREE_GIFT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedTradeType === 'FREE_GIFT'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
              }`}
            >
              <Gift className="w-3 h-3" />
              Free Gift
            </button>

            <button
              onClick={() => setOnlyMyItems(!onlyMyItems)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                onlyMyItems
                  ? 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              My Listings ({myListedCount})
            </button>
          </div>
        </div>

        {/* Category Carousel Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}

          {/* District Dropdown */}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="ALL">All Ghana Districts</option>
              {districts.filter(d => d !== 'ALL').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Item Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Circular Swap Items Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, selecting "All Types", or be the first to list an item in this category!
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
          >
            List First Item (+10 Pts)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isOwner = item.sellerId === currentUser.id;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                id={`swap-item-card-${item.id}`}
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Trade Type Tag Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {item.tradeType === 'BARTER' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <RefreshCw className="w-3 h-3" />
                          Barter Swap
                        </span>
                      )}
                      {item.tradeType === 'POINTS' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/95 backdrop-blur-md text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <Coins className="w-3 h-3" />
                          {item.pointsPrice} EcoPts
                        </span>
                      )}
                      {item.tradeType === 'FREE_GIFT' && (
                        <span className="px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <Gift className="w-3 h-3" />
                          Zero Cost Gift
                        </span>
                      )}
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={() => toggleLikeSwapItem(item.id)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
                        item.isLiked
                          ? 'bg-rose-500 text-white scale-110'
                          : 'bg-slate-900/60 text-white hover:bg-slate-900/90'
                      }`}
                      title="Save item to favorites"
                    >
                      <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-current' : ''}`} />
                    </button>

                    {/* Condition Pill */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950/75 backdrop-blur-md text-slate-200 text-[10px] font-medium">
                        {item.condition === 'UPCYCLED_ART' ? '🎨 Upcycled Art' : `Condition: ${item.condition}`}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        {item.category.replace('_', ' ')}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[120px]">{item.district || item.location}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Barter Preferences Highlight */}
                    {item.barterPreferences && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                        <strong className="text-emerald-600 dark:text-emerald-400 block font-bold text-[10px] uppercase">
                          Seeking in Return:
                        </strong>
                        <span className="line-clamp-1">{item.barterPreferences}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer with Seller & Action */}
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  {/* Seller Info */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={item.sellerName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {isOwner ? 'You (Owner)' : item.sellerName}
                        </span>
                        {item.sellerBadges?.includes('Verified Citizen') && (
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                        <span>{item.sellerRating.toFixed(1)}</span>
                        <span>•</span>
                        <span>{item.likesCount} likes</span>
                      </div>
                    </div>
                  </div>

                  {/* Trade Action Button */}
                  {isOwner ? (
                    <span className="text-[11px] font-bold text-slate-500 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                      Your Listing
                    </span>
                  ) : (
                    <button
                      onClick={() => setTradeModalItem(item)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all flex-shrink-0"
                      id={`request-trade-btn-${item.id}`}
                    >
                      <span>Trade</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CreateSwapItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <RequestTradeModal
        item={tradeModalItem}
        isOpen={!!tradeModalItem}
        onClose={() => setTradeModalItem(null)}
      />
    </div>
  );
};
