import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Tag, 
  MapPin, 
  Coins, 
  RefreshCw, 
  Gift, 
  Sparkles, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { SwapItemCategory, SwapTradeType } from '../../types/community';

interface CreateSwapItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_IMAGES = [
  { label: 'Tire Planter', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80' },
  { label: 'Glass Mason Jars', url: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=600&auto=format&fit=crop&q=80' },
  { label: 'Bamboo Cutlery', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80' },
  { label: 'Compost Bin', url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80' },
  { label: 'Kente Tote Bag', url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80' },
  { label: 'Eco Gardening Tool', url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80' }
];

export const CreateSwapItemModal: React.FC<CreateSwapItemModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addSwapItem } = useEcoSort();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SwapItemCategory>('UPCYCLED_CRAFT');
  const [condition, setCondition] = useState<'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'UPCYCLED_ART'>('UPCYCLED_ART');
  const [tradeType, setTradeType] = useState<SwapTradeType>('BARTER');
  const [pointsPrice, setPointsPrice] = useState<number>(35);
  const [barterPreferences, setBarterPreferences] = useState('');
  const [location, setLocation] = useState(currentUser.location || 'Accra, Greater Accra');
  const [district, setDistrict] = useState(currentUser.community || 'Ayawaso West');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [customImageInput, setCustomImageInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addSwapItem({
      title: title.trim(),
      description: description.trim() || 'Pre-loved or upcycled item available for circular trade in Ghana.',
      category,
      condition,
      tradeType,
      pointsPrice: tradeType === 'POINTS' ? pointsPrice : undefined,
      barterPreferences: tradeType === 'BARTER' ? (barterPreferences.trim() || 'Open to any eco-supplies or craft trades') : undefined,
      imageUrl: customImageInput.trim() || imageUrl,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      sellerRating: 4.9,
      sellerBadges: ['Verified Citizen', 'Circular Champion'],
      location: location.trim(),
      district: district.trim(),
      status: 'AVAILABLE'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
        id="create-swap-item-modal"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">List Item on Swap Spot</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Give items second life & earn +10 EcoPoints</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
            id="close-create-swap-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Item Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Upcycled Kente Tote Bag or 12x Glass Bottles"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              id="swap-item-title-input"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SwapItemCategory)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                id="swap-category-select"
              >
                <option value="UPCYCLED_CRAFT">Upcycled Crafts & Art</option>
                <option value="REUSABLE_PACKAGING">Reusable Containers / Jars</option>
                <option value="GARDEN_COMPOST">Garden & Compost Tools</option>
                <option value="TOOLS_REPAIR">Hardware & Repair Tools</option>
                <option value="CLEAN_MATERIALS">Sorted Scrap / Bulk Material</option>
                <option value="BOOKS_EDUCATION">Eco Books & Guides</option>
                <option value="OTHER">Other Circular Goods</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                id="swap-condition-select"
              >
                <option value="UPCYCLED_ART">🎨 Upcycled Art / Handcrafted</option>
                <option value="NEW">✨ Brand New / Never Used</option>
                <option value="LIKE_NEW">💎 Like New (Pristine)</option>
                <option value="GOOD">👍 Good Condition (Functional)</option>
                <option value="FAIR">🛠️ Fair / Suitable for Repurposing</option>
              </select>
            </div>
          </div>

          {/* Trade Type Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Trade / Pricing Model
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setTradeType('BARTER')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  tradeType === 'BARTER'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                }`}
                id="trade-type-barter-btn"
              >
                <RefreshCw className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-bold">Direct Barter</span>
                <span className="text-[10px] text-slate-500">Item for item swap</span>
              </button>

              <button
                type="button"
                onClick={() => setTradeType('POINTS')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  tradeType === 'POINTS'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                }`}
                id="trade-type-points-btn"
              >
                <Coins className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold">EcoPoints</span>
                <span className="text-[10px] text-slate-500">Sell for digital points</span>
              </button>

              <button
                type="button"
                onClick={() => setTradeType('FREE_GIFT')}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  tradeType === 'FREE_GIFT'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                }`}
                id="trade-type-free-btn"
              >
                <Gift className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-bold">Free Giveaway</span>
                <span className="text-[10px] text-slate-500">Zero cost gift</span>
              </button>
            </div>
          </div>

          {/* Conditional Trade Type Fields */}
          {tradeType === 'POINTS' && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-2">
              <label className="block text-xs font-bold text-amber-800 dark:text-amber-300">
                EcoPoints Price (Pts)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="5"
                  max="1000"
                  value={pointsPrice}
                  onChange={(e) => setPointsPrice(Math.max(5, parseInt(e.target.value) || 5))}
                  className="w-32 px-3.5 py-2 rounded-xl border border-amber-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm outline-none"
                  id="swap-points-price-input"
                />
                <span className="text-xs text-amber-700 dark:text-amber-400">
                  ≈ GH₵ {(pointsPrice / 10).toFixed(2)} equivalent value
                </span>
              </div>
            </div>
          )}

          {tradeType === 'BARTER' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                What would you like in return?
              </label>
              <input
                type="text"
                value={barterPreferences}
                onChange={(e) => setBarterPreferences(e.target.value)}
                placeholder="e.g., Seeking organic seeds, scrap aluminum, or potting soil"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                id="swap-barter-pref-input"
              />
            </div>
          )}

          {/* Location & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                City / Region
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Accra, Greater Accra"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Neighborhood / District
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g., Osu / East Legon / Ayawaso"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
              />
            </div>
          </div>

          {/* Image Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Select Preset Photo or Enter Image URL
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
              {PRESET_IMAGES.map((img) => (
                <button
                  type="button"
                  key={img.label}
                  onClick={() => {
                    setImageUrl(img.url);
                    setCustomImageInput('');
                  }}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all group ${
                    imageUrl === img.url && !customImageInput
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 p-0.5 text-[9px] font-bold text-white text-center truncate">
                    {img.label}
                  </div>
                </button>
              ))}
            </div>

            <input
              type="url"
              value={customImageInput}
              onChange={(e) => setCustomImageInput(e.target.value)}
              placeholder="Or paste custom image URL (https://...)"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Description & Pickup Instructions
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe materials, size, condition, and preferred meetup spot (e.g. at EcoSort Commonwealth Station or Accra Mall)..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none resize-none"
              id="swap-item-desc-input"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              id="submit-swap-item-btn"
            >
              <Sparkles className="w-4 h-4" />
              Publish Listing (+10 Pts)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
