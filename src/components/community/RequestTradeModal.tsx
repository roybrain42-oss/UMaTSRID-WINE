import React, { useState } from 'react';
import { 
  X, 
  RefreshCw, 
  MapPin, 
  Coins, 
  Gift, 
  Send, 
  ShieldCheck, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { CommunitySwapItem, SwapTradeType } from '../../types/community';

interface RequestTradeModalProps {
  item: CommunitySwapItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RequestTradeModal: React.FC<RequestTradeModalProps> = ({ item, isOpen, onClose }) => {
  const { currentUser, proposeSwapTrade, ecoPointsPerGhs } = useEcoSort();

  const [tradeType, setTradeType] = useState<SwapTradeType>(item?.tradeType || 'BARTER');
  const [offeredPoints, setOfferedPoints] = useState<number>(item?.pointsPrice || 20);
  const [offeredItemTitle, setOfferedItemTitle] = useState('');
  const [message, setMessage] = useState('');
  const [meetupLocation, setMeetupLocation] = useState(
    item ? `EcoSort Verified Station near ${item.district || item.location}` : 'Public Community Hub'
  );

  if (!isOpen || !item) return null;

  const hasEnoughPoints = currentUser.ecoPoints >= (item.pointsPrice || offeredPoints);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    proposeSwapTrade({
      itemId: item.id,
      swapItemId: item.id,
      itemTitle: item.title,
      sellerId: item.sellerId,
      sellerName: item.sellerName,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterAvatar: currentUser.avatar,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      offerType: tradeType === 'POINTS' ? 'POINTS' : tradeType === 'BARTER' ? 'OFFER_ITEM' : 'FREE_PICKUP',
      tradeType,
      offeredPoints: tradeType === 'POINTS' ? offeredPoints : undefined,
      offeredItemTitle: tradeType === 'BARTER' ? offeredItemTitle.trim() : undefined,
      message: message.trim() || `Hello ${item.sellerName}, I am interested in swapping for "${item.title}". Let's arrange a safe meetup in ${item.district || item.location}!`,
      meetupLocation: meetupLocation.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        id="request-trade-modal"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Propose Circular Trade</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Trade with {item.sellerName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
            id="close-request-trade-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item Summary Card */}
        <div className="p-4 mx-6 mt-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                {item.category.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                Condition: {item.condition}
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate mt-1">
              {item.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{item.district || item.location}</span>
              {item.pointsPrice && (
                <span className="font-bold text-amber-600 dark:text-amber-400 ml-auto">
                  {item.pointsPrice} Pts
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Trade Type Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              How do you want to trade?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTradeType('BARTER')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  tradeType === 'BARTER'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-xs font-bold block">Swap Item</span>
                <span className="text-[10px] text-slate-500">Item Barter</span>
              </button>

              <button
                type="button"
                onClick={() => setTradeType('POINTS')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  tradeType === 'POINTS'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-xs font-bold block">Pay Points</span>
                <span className="text-[10px] text-slate-500">{item.pointsPrice || 25} EcoPts</span>
              </button>

              <button
                type="button"
                onClick={() => setTradeType('FREE_GIFT')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  tradeType === 'FREE_GIFT'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-xs font-bold block">Zero Cost</span>
                <span className="text-[10px] text-slate-500">Claim Gift</span>
              </button>
            </div>
          </div>

          {/* Conditional Offer Inputs */}
          {tradeType === 'BARTER' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Item / Material You Are Offering to Swap *
              </label>
              <input
                type="text"
                required
                value={offeredItemTitle}
                onChange={(e) => setOfferedItemTitle(e.target.value)}
                placeholder="e.g., 5kg Clean Aluminum cans, Handcrafted pot, Seedlings..."
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                id="offered-item-title-input"
              />
            </div>
          )}

          {tradeType === 'POINTS' && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">EcoPoints Offer</span>
                  <span className="text-[11px] text-amber-700 dark:text-amber-400">
                    Your balance: {currentUser.ecoPoints} Pts (≈ GH₵ {(currentUser.ecoPoints / ecoPointsPerGhs).toFixed(2)})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={offeredPoints}
                    onChange={(e) => setOfferedPoints(parseInt(e.target.value) || 1)}
                    className="w-20 px-2.5 py-1.5 rounded-lg border border-amber-400 bg-white dark:bg-slate-800 text-right font-bold text-xs"
                    id="points-offer-input"
                  />
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300">Pts</span>
                </div>
              </div>
              {!hasEnoughPoints && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Insufficient points. You have {currentUser.ecoPoints} Pts. Recycle or swap items to earn more.</span>
                </div>
              )}
            </div>
          )}

          {/* Meetup / Pickup Hub */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Proposed Safe Meetup Spot
            </label>
            <input
              type="text"
              value={meetupLocation}
              onChange={(e) => setMeetupLocation(e.target.value)}
              placeholder="e.g., EcoSort Commonwealth Station or Accra Mall Gate 2"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
              id="meetup-spot-input"
            />
          </div>

          {/* Friendly Note */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Message to Seller
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I am in the area and would love to exchange..."
              className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none resize-none"
              id="trade-message-input"
            />
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>EcoSort Safety: Always meet in public hubs or verified EcoSort Agent collection stations.</span>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={tradeType === 'POINTS' && !hasEnoughPoints}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              id="submit-trade-proposal-btn"
            >
              <Send className="w-4 h-4" />
              Send Trade Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
