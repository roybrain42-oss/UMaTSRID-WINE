import React, { useState } from 'react';
import { 
  Gift, 
  Plus, 
  Trash2, 
  Edit3, 
  Coins, 
  Sparkles, 
  Check, 
  X, 
  Flame, 
  ShoppingBag,
  Save,
  Tag
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { RewardItem } from '../../types';

export const AdminRewardManager: React.FC = () => {
  const { rewards, addReward, updateReward, deleteReward } = useEcoSort();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<RewardItem | null>(null);

  // New reward state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [costPoints, setCostPoints] = useState<number>(100);
  const [valueGhs, setValueGhs] = useState<number>(10);
  const [category, setCategory] = useState<'AIRTIME' | 'MOMO_CASH' | 'GROCERY' | 'TRANSPORT' | 'ECO_MERCH' | 'UTILITY' | 'OTHER'>('AIRTIME');
  const [vendor, setVendor] = useState('MTN Ghana');
  const [icon, setIcon] = useState('📱');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=300');
  const [popular, setPopular] = useState(false);
  const [inStock, setInStock] = useState(true);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReward({
      title: title.trim(),
      description: description.trim(),
      costPoints,
      valueGhs,
      originalPriceGhs: valueGhs,
      category,
      vendor: vendor.trim(),
      sponsorName: vendor.trim(),
      icon,
      imageUrl,
      popular,
      inStock,
      stockCount: 100
    });

    // Reset
    setTitle('');
    setDescription('');
    setCostPoints(100);
    setValueGhs(10);
    setIsAddOpen(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReward) return;

    const val = editingReward.valueGhs ?? editingReward.originalPriceGhs ?? (editingReward.costPoints / 10);

    updateReward(editingReward.id, {
      title: editingReward.title,
      description: editingReward.description,
      costPoints: editingReward.costPoints,
      valueGhs: val,
      originalPriceGhs: val,
      category: editingReward.category,
      vendor: editingReward.vendor || editingReward.sponsorName || 'EcoSort Partner',
      sponsorName: editingReward.sponsorName || editingReward.vendor || 'EcoSort Partner',
      icon: editingReward.icon || '🎁',
      imageUrl: editingReward.imageUrl,
      popular: editingReward.popular,
      inStock: editingReward.inStock
    });

    setEditingReward(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-600" />
            Marketplace Rewards & Redemption Catalog
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure redeemable partner incentives, MoMo cash multipliers, airtime vouchers & eco-merch.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Reward Item
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <div 
            key={reward.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-purple-300 dark:hover:border-purple-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-2xl border border-purple-200 dark:border-purple-900">
                    {reward.icon || '🎁'}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {reward.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      {reward.vendor || reward.sponsorName || 'EcoSort Partner'} • {reward.category}
                    </span>
                  </div>
                </div>

                {reward.popular && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold border border-amber-500/20 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" /> Hot
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {reward.description}
              </p>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Cost</span>
                  <span className="font-black text-purple-600 dark:text-purple-400 font-mono text-sm">
                    {reward.costPoints} Pts
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Value</span>
                  <span className="font-black text-slate-900 dark:text-white font-mono text-sm">
                    GH₵ {((reward.valueGhs ?? reward.originalPriceGhs ?? (reward.costPoints / 10))).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${reward.inStock ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {reward.inStock ? 'In Stock' : 'Out of Stock'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingReward({ 
                    ...reward,
                    valueGhs: reward.valueGhs ?? reward.originalPriceGhs ?? (reward.costPoints / 10),
                    vendor: reward.vendor || reward.sponsorName || 'EcoSort Partner',
                    icon: reward.icon || '🎁'
                  })}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Edit reward details"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteReward(reward.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 transition-colors cursor-pointer"
                  title="Delete reward"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Reward Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
            <div className="bg-purple-900 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Gift className="w-6 h-6 text-purple-300" />
                <h3 className="font-black text-lg">Add Marketplace Reward</h3>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="text-purple-300 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GH₵ 20 MTN Airtime Voucher"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Instant mobile top-up delivered to your phone..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cost (EcoPoints) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={costPoints}
                    onChange={(e) => setCostPoints(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Value (GH₵) *</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    required
                    value={valueGhs}
                    onChange={(e) => setValueGhs(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="AIRTIME">Airtime & Data</option>
                    <option value="MOMO_CASH">Mobile Money Cash</option>
                    <option value="GROCERY">Grocery & Food</option>
                    <option value="TRANSPORT">Transport & Fuel</option>
                    <option value="ECO_MERCH">Eco Merch & Bags</option>
                    <option value="UTILITY">Utility Bills</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Vendor / Partner</label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="e.g. MTN / Melcom"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                    className="rounded text-purple-600"
                  />
                  Featured Hot Item 🔥
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded text-purple-600"
                  />
                  In Stock Available
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Reward Modal */}
      {editingReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
            <div className="bg-purple-900 p-6 text-white flex items-center justify-between">
              <h3 className="font-black text-lg">Edit Reward: {editingReward.title}</h3>
              <button onClick={() => setEditingReward(null)} className="text-purple-300 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={editingReward.title}
                  onChange={(e) => setEditingReward({ ...editingReward, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingReward.description}
                  onChange={(e) => setEditingReward({ ...editingReward, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cost (EcoPoints)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingReward.costPoints}
                    onChange={(e) => setEditingReward({ ...editingReward, costPoints: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Value (GH₵)</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    required
                    value={editingReward.valueGhs ?? editingReward.originalPriceGhs ?? (editingReward.costPoints / 10)}
                    onChange={(e) => setEditingReward({ ...editingReward, valueGhs: parseFloat(e.target.value) || 0, originalPriceGhs: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingReward.popular}
                    onChange={(e) => setEditingReward({ ...editingReward, popular: e.target.checked })}
                    className="rounded text-purple-600"
                  />
                  Featured Hot Item 🔥
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingReward.inStock}
                    onChange={(e) => setEditingReward({ ...editingReward, inStock: e.target.checked })}
                    className="rounded text-purple-600"
                  />
                  In Stock Available
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingReward(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
