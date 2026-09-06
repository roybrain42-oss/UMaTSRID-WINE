import React, { useState } from 'react';
import { 
  Gift, 
  Coins, 
  CheckCircle2, 
  Sparkles, 
  Smartphone, 
  CreditCard, 
  Receipt, 
  ArrowRight,
  ShieldCheck, 
  AlertCircle,
  Zap,
  Copy,
  Check,
  CheckCircle,
  TrendingDown,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { RewardItem } from '../../types';
import { MarketplaceSkeleton } from './MarketplaceSkeleton';
import { haptics } from '../../utils/haptics';

export const RewardMarketplaceView: React.FC = () => {
  const { 
    currentUser, 
    rewards, 
    redemptions, 
    transactions, 
    cashWithdrawals,
    redeemReward,
    setShowCashOutModal,
    ecoPointsPerGhs,
    saveToLocalCacheNow
  } = useEcoSort();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [recipientContact, setRecipientContact] = useState<string>(currentUser.phone || '+233 24 892 4110');
  const [redemptionResult, setRedemptionResult] = useState<{ success: boolean; code?: string; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'MARKETPLACE' | 'MOMO_CASH' | 'CASH_WITHDRAWALS' | 'MY_VOUCHERS' | 'LEDGER'>('MARKETPLACE');
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);

  const handleRefreshMarketplace = () => {
    setIsLoading(true);
    saveToLocalCacheNow();
    setTimeout(() => {
      setIsLoading(false);
    }, 450);
  };

  if (isLoading) {
    return <MarketplaceSkeleton />;
  }

  const handleOpenRedeem = (reward: RewardItem) => {
    haptics.light();
    setSelectedReward(reward);
    setRedemptionResult(null);
  };

  const handleConfirmRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReward) return;

    haptics.medium();
    const res = redeemReward(selectedReward.id, recipientContact);
    if (res.success) {
      haptics.success();
    } else {
      haptics.error();
    }
    setRedemptionResult(res);
  };

  const handleCopy = (text: string) => {
    haptics.light();
    navigator.clipboard.writeText(text);
    setCopiedTxId(text);
    setTimeout(() => setCopiedTxId(null), 2000);
  };

  const totalCashEarnedGhs = cashWithdrawals.reduce((sum, w) => sum + (w.status === 'COMPLETED' ? w.netPayoutGhs : 0), 0);
  const estimatedCashBalanceGhs = +(currentUser.ecoPoints / ecoPointsPerGhs).toFixed(2);

  return (
    <div className="space-y-6 pb-12">
      {/* Wallet & Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-teal-950 text-white rounded-3xl p-6 md:p-8 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-400/30">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              EcoSort Ghana Digital Wallet & MoMo Payout Gateway
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Rewards & Mobile Money Cash Out
            </h1>
            <p className="text-emerald-200/80 text-sm mt-1 max-w-xl">
              Instantly convert verified EcoPoints to <strong className="text-amber-300">Ghanaian Mobile Money (MTN MoMo, Telecel Cash, AT)</strong> or redeem for merchant catalog items.
            </p>
          </div>

          {/* Dual Balance & Cash Out Action Widgets */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 shrink-0">
            
            {/* Balance Badge */}
            <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-2xl">
                🌿
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 font-bold uppercase block">Available Balance</span>
                <span className="text-2xl font-black text-white">{currentUser.ecoPoints} <span className="text-sm font-normal text-emerald-400">Pts</span></span>
                <span className="text-[11px] text-amber-400 font-mono block mt-0.5 font-bold">
                  ≈ GH₵ {estimatedCashBalanceGhs.toFixed(2)} Cash
                </span>
              </div>
            </div>

            {/* Direct Cash Out CTA */}
            <button
              onClick={() => setShowCashOutModal(true)}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 px-5 py-3.5 rounded-2xl font-black text-xs shadow-lg shadow-amber-500/20 flex flex-col justify-center items-center gap-1 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-black text-sm">
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Withdraw MoMo Cash</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-900/80">
                MTN • Telecel • AT Money
              </span>
            </button>

          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('MARKETPLACE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'MARKETPLACE'
                ? 'bg-emerald-500 text-slate-950 shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" /> Catalog & Offers
          </button>

          <button
            onClick={() => setActiveTab('MOMO_CASH')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'MOMO_CASH'
                ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                : 'bg-slate-900 text-amber-400/80 hover:text-amber-300 border border-amber-500/30'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> MoMo Instant Cash Out
          </button>
          
          <button
            onClick={() => setActiveTab('CASH_WITHDRAWALS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'CASH_WITHDRAWALS'
                ? 'bg-emerald-500 text-slate-950 shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5" /> MoMo Payouts ({cashWithdrawals.length})
          </button>

          <button
            onClick={() => setActiveTab('MY_VOUCHERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'MY_VOUCHERS'
                ? 'bg-emerald-500 text-slate-950 shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Active Vouchers ({redemptions.length})
          </button>

          <button
            onClick={() => setActiveTab('LEDGER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'LEDGER'
                ? 'bg-emerald-500 text-slate-950 shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" /> Point Ledger ({transactions.length})
          </button>

          <button
            onClick={handleRefreshMarketplace}
            className="ml-auto px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            title="Refresh rewards database & MoMo rates"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh Catalog</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Reward Marketplace Catalog + MoMo Featured Card */}
      {activeTab === 'MARKETPLACE' && (
        <div className="space-y-6">
          
          {/* Featured MoMo Conversion Card */}
          <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/5 rounded-3xl p-6 border-2 border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shrink-0">
                <Smartphone className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    Direct Mobile Money Cash Out
                  </h3>
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    Most Popular
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Convert any amount of points into Ghanaian Cedis (GH₵) with 0% fees. Instant Bank of Ghana GhIPSS settlement.
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                  <span>Rate: 10 Pts = GH₵ 1.00</span>
                  <span>•</span>
                  <span>Minimum: 10 Pts (GH₵ 1.00)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCashOutModal(true)}
              className="w-full md:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0 transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              Convert Points Now (Instant MoMo)
            </button>
          </div>

          {/* Standard Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards.map((reward) => {
              const canAfford = currentUser.ecoPoints >= reward.costPoints;

              return (
                <div 
                  key={reward.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    <div className="relative rounded-2xl overflow-hidden mb-3 h-44 bg-slate-950">
                      <img 
                        src={reward.imageUrl} 
                        alt={reward.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md text-emerald-400 font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30">
                        {reward.costPoints} Pts
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {reward.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {reward.description}
                    </p>
                    
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Valued: GH₵ {reward.originalPriceGhs.toFixed(2)}</span>
                      <span className="text-emerald-600 font-semibold">{reward.stockCount} left</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenRedeem(reward)}
                    disabled={!canAfford}
                    className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 ${
                      canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 cursor-pointer'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Redeem ({reward.costPoints} Pts)
                      </>
                    ) : (
                      `Need ${reward.costPoints - currentUser.ecoPoints} more pts`
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Dedicated MoMo Instant Cash Out View */}
      {activeTab === 'MOMO_CASH' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Cash Converter Widget */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Mobile Money Cash Conversion Center
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Convert EcoPoints into actual currency disbursed to your mobile phone.
                </p>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
                10 Pts = GH₵ 1.00
              </div>
            </div>

            {/* Quick Conversion Rate Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { pts: 50, cash: 5.00, label: 'Snack / Sachet Pack' },
                { pts: 100, cash: 10.00, label: 'Campus Lunch' },
                { pts: 250, cash: 25.00, label: 'Weekly Transit / TroTro' },
                { pts: 500, cash: 50.00, label: 'Semester Materials' }
              ].map((tier) => (
                <div 
                  key={tier.pts}
                  onClick={() => setShowCashOutModal(true)}
                  className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all cursor-pointer group"
                >
                  <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-amber-600 block">
                    {tier.pts} EcoPoints
                  </span>
                  <span className="text-lg font-black text-slate-900 dark:text-white block mt-1">
                    GH₵ {tier.cash.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {tier.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Payout Channels Supported */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Supported Mobile Money Networks in Ghana
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                    MTN
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">MTN MoMo</span>
                    <span className="text-[10px] text-yellow-800 dark:text-yellow-400 font-mono">024, 054, 055, 059</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    TEL
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Telecel Cash</span>
                    <span className="text-[10px] text-rose-800 dark:text-rose-400 font-mono">020, 050</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    AT
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">AT Money</span>
                    <span className="text-[10px] text-blue-800 dark:text-blue-400 font-mono">027, 057, 026</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Cash Out Dialog Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowCashOutModal(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <Smartphone className="w-4 h-4 fill-slate-950" />
                Open Mobile Money Cash Out Portal (Available: {currentUser.ecoPoints} Pts)
              </button>
            </div>
          </div>

          {/* Quick FAQ & Trust Badge */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Guaranteed MoMo Payouts
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                How MoMo Cash Out Works
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Enter any number of points (minimum 10 points = GH₵ 1.00).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Confirm your registered Ghana phone number and network carrier.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Funds disburse in seconds with 0% e-levy / withdrawal fees subsidized by EPA Ghana.</span>
                </li>
              </ul>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Total Lifetime MoMo Cash Out:</span>
                <span className="font-mono text-lg font-black text-emerald-600 dark:text-emerald-400">
                  GH₵ {totalCashEarnedGhs.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Cash Withdrawals History & Receipts */}
      {activeTab === 'CASH_WITHDRAWALS' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Mobile Money Payout Receipts & Auditable History
              </h2>
              <p className="text-xs text-slate-500">
                Verifiable Bank of Ghana GhIPSS & Telco reference receipts for all EcoPoints cash outs.
              </p>
            </div>
            
            <button
              onClick={() => setShowCashOutModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-sm hover:bg-amber-400 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              New Cash Out
            </button>
          </div>

          {cashWithdrawals.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Smartphone className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold">No Mobile Money withdrawals recorded yet.</p>
              <button
                onClick={() => setShowCashOutModal(true)}
                className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Make Your First MoMo Withdrawal
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cashWithdrawals.map(wdr => (
                <div 
                  key={wdr.id} 
                  className="bg-slate-50 dark:bg-slate-950 p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                      wdr.network === 'MTN'
                        ? 'bg-yellow-400 text-slate-950'
                        : wdr.network === 'Telecel'
                        ? 'bg-rose-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {wdr.network}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          GH₵ {wdr.netPayoutGhs.toFixed(2)} MoMo Transfer
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                          {wdr.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Recipient: <strong className="text-slate-700 dark:text-slate-300">{wdr.accountHolderName} ({wdr.recipientPhone})</strong></span>
                        <span>•</span>
                        <span className="font-mono text-rose-600">-{wdr.pointsConverted} Pts</span>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-2">
                        <span>Ref: {wdr.transactionRef}</span>
                        <button
                          onClick={() => handleCopy(wdr.transactionRef)}
                          className="hover:text-emerald-600"
                          title="Copy reference code"
                        >
                          {copiedTxId === wdr.transactionRef ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs text-slate-400 block">
                      {new Date(wdr.completedAt || wdr.createdAt).toLocaleString()}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                      {wdr.payoutGateway}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: My Active Vouchers Vault */}
      {activeTab === 'MY_VOUCHERS' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Claimed Vouchers & Secret Codes
          </h2>

          {redemptions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Gift className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm">You have not redeemed any vouchers yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {redemptions.map(red => (
                <div key={red.id} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border-2 border-dashed border-emerald-500/50 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{red.rewardTitle}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                        {red.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">Recipient: {red.recipientPhoneOrAddress}</span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center font-mono">
                    <span className="text-[10px] text-slate-400 block uppercase">Redemption Voucher Code</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                      {red.redemptionCode}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Point Ledger */}
      {activeTab === 'LEDGER' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Auditable EcoPoints Transaction History
          </h2>

          <div className="space-y-2">
            {transactions.map(tx => (
              <div key={tx.id} className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{tx.description}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{new Date(tx.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-sm block ${
                    tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                  }`}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Pts
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Bal: {tx.balanceAfter}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Redemption Confirmation Modal */}
      {selectedReward && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            
            {redemptionResult?.success ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Redemption Successful! 🎉
                </h3>
                <p className="text-xs text-slate-500">{redemptionResult.message}</p>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-center">
                  <span className="text-[10px] text-slate-400 uppercase block">Voucher Code</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {redemptionResult.code}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedReward(null)}
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                >
                  Close & View Vouchers
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmRedeem} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Confirm Reward Redemption
                  </h3>
                  <button type="button" onClick={() => setSelectedReward(null)} className="text-slate-400 text-lg">✕</button>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <img src={selectedReward.imageUrl} alt={selectedReward.title} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">{selectedReward.title}</span>
                    <span className="text-xs font-bold text-emerald-600">{selectedReward.costPoints} EcoPoints</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Recipient Phone / Mobile Money / Delivery Contact
                  </label>
                  <input 
                    type="text"
                    value={recipientContact}
                    onChange={(e) => setRecipientContact(e.target.value)}
                    required
                    placeholder="e.g. +233 24 892 4110"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                {redemptionResult && !redemptionResult.success && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{redemptionResult.message}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReward(null)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
                  >
                    Confirm & Deduct {selectedReward.costPoints} Pts
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
