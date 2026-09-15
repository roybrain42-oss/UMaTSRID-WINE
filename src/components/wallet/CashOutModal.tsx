import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Coins, 
  CreditCard, 
  Zap, 
  Receipt,
  Copy,
  Check,
  Building,
  RefreshCw,
  Fingerprint,
  ScanFace,
  Lock,
  Sparkles,
  Settings,
  Sliders,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useEcoSort, ECO_POINTS_PER_GHS } from '../../context/EcoSortContext';
import { CashWithdrawalRecord } from '../../types';
import { haptics } from '../../utils/haptics';

export const CashOutModal: React.FC = () => {
  const { 
    currentUser, 
    showCashOutModal, 
    setShowCashOutModal, 
    requestCashWithdrawal,
    isBiometricsEnrolled,
    biometricCapability,
    openBiometricPrompt,
    updateUserProfile
  } = useEcoSort();

  const [pointsToConvert, setPointsToConvert] = useState<number>(() => Math.min(100, Math.max(10, currentUser.ecoPoints)));
  const [network, setNetwork] = useState<'MTN' | 'Telecel' | 'AT' | 'Other'>(() => {
    if (currentUser.ghanaTelecomNetwork) return currentUser.ghanaTelecomNetwork;
    const phone = currentUser.phone || '';
    if (phone.includes('024') || phone.includes('054') || phone.includes('055') || phone.includes('059')) return 'MTN';
    if (phone.includes('020') || phone.includes('050')) return 'Telecel';
    if (phone.includes('027') || phone.includes('057') || phone.includes('026') || phone.includes('056')) return 'AT';
    return 'MTN';
  });

  const [recipientPhone, setRecipientPhone] = useState<string>(currentUser.phone || '');
  const [accountHolderName, setAccountHolderName] = useState<string>(currentUser.name || '');
  const [ghanaCardNumber, setGhanaCardNumber] = useState<string>(currentUser.ghanaCardNumber || 'GHA-729103841-2');
  const [useBiometrics, setUseBiometrics] = useState<boolean>(true);
  const [showInlinePolicyConfig, setShowInlinePolicyConfig] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [completedWithdrawal, setCompletedWithdrawal] = useState<CashWithdrawalRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const isBiometricReady = isBiometricsEnrolled || !!currentUser?.biometricsEnabled;
  const isFace = biometricCapability?.biometricIconName === 'ScanFace' || currentUser?.biometricType === 'FACE_ID';

  const momoPolicy = currentUser.momoBiometricPolicy || (currentUser.requireBiometricForMoMo === false ? 'NEVER' : 'THRESHOLD_ONLY');
  const momoThreshold = currentUser.momoBiometricThresholdGhs ?? 20;

  const grossCashGhs = +(pointsToConvert / ECO_POINTS_PER_GHS).toFixed(2);
  const feeGhs = 0.00;
  const netPayoutGhs = grossCashGhs;
  const isExceedingThreshold = netPayoutGhs >= momoThreshold;
  const isMandatedByPolicy = isBiometricReady && (momoPolicy === 'ALWAYS' || (momoPolicy === 'THRESHOLD_ONLY' && isExceedingThreshold));

  // Sync inputs when modal opens or user changes
  useEffect(() => {
    if (showCashOutModal) {
      setErrorMsg('');
      setCompletedWithdrawal(null);
      setIsProcessing(false);
      setShowInlinePolicyConfig(false);
      
      const currentGross = +(pointsToConvert / ECO_POINTS_PER_GHS).toFixed(2);
      const isExceeding = currentGross >= momoThreshold;
      const shouldMandate = isBiometricReady && (momoPolicy === 'ALWAYS' || (momoPolicy === 'THRESHOLD_ONLY' && isExceeding));
      
      if (momoPolicy === 'NEVER') {
        setUseBiometrics(false);
      } else if (shouldMandate) {
        setUseBiometrics(true);
      } else {
        setUseBiometrics(false);
      }

      if (currentUser.phone && !recipientPhone) setRecipientPhone(currentUser.phone);
      if (currentUser.name && !accountHolderName) setAccountHolderName(currentUser.name);
      if (currentUser.ghanaCardNumber) setGhanaCardNumber(currentUser.ghanaCardNumber);
      
      // Default to affordable points
      if (currentUser.ecoPoints >= 50) {
        setPointsToConvert(Math.min(100, currentUser.ecoPoints));
      } else {
        setPointsToConvert(currentUser.ecoPoints);
      }
    }
  }, [showCashOutModal, currentUser, isBiometricReady, momoPolicy, momoThreshold]);

  // Adjust biometric mandate when points change
  useEffect(() => {
    if (isBiometricReady) {
      if (momoPolicy === 'ALWAYS') {
        setUseBiometrics(true);
      } else if (momoPolicy === 'THRESHOLD_ONLY') {
        if (isExceedingThreshold) {
          setUseBiometrics(true);
        }
      }
    }
  }, [pointsToConvert, isBiometricReady, momoPolicy, isExceedingThreshold]);

  // Auto-detect network if phone changes
  const handlePhoneChange = (val: string) => {
    setRecipientPhone(val);
    const clean = val.replace(/\D/g, '');
    if (clean.startsWith('024') || clean.startsWith('054') || clean.startsWith('055') || clean.startsWith('059') || clean.startsWith('23324') || clean.startsWith('23354')) {
      setNetwork('MTN');
    } else if (clean.startsWith('020') || clean.startsWith('050') || clean.startsWith('23320') || clean.startsWith('23350')) {
      setNetwork('Telecel');
    } else if (clean.startsWith('027') || clean.startsWith('057') || clean.startsWith('026') || clean.startsWith('056') || clean.startsWith('23327')) {
      setNetwork('AT');
    }
  };

  if (!showCashOutModal) return null;

  const canAfford = currentUser.ecoPoints >= pointsToConvert && pointsToConvert > 0;

  const handleQuickPreset = (pts: number) => {
    haptics.light();
    const capped = Math.min(pts, currentUser.ecoPoints);
    setPointsToConvert(capped);
    setErrorMsg('');
  };

  const handleMaxPoints = () => {
    haptics.light();
    setPointsToConvert(currentUser.ecoPoints);
    setErrorMsg('');
  };

  const handleSubmitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAfford) {
      haptics.error();
      setErrorMsg(`You have ${currentUser.ecoPoints} points. Cannot withdraw ${pointsToConvert} points.`);
      return;
    }
    if (!recipientPhone.trim()) {
      haptics.error();
      setErrorMsg('Please enter a valid recipient mobile money phone number.');
      return;
    }
    if (!accountHolderName.trim()) {
      haptics.error();
      setErrorMsg('Please provide the Mobile Money account name.');
      return;
    }

    haptics.medium();
    setErrorMsg('');

    let authRef: string | undefined = undefined;
    let authType = currentUser.biometricType || (isFace ? 'FACE_ID' : 'FINGERPRINT');

    // 1. Biometric verification step if mandated by policy or enabled by user
    const shouldPromptBiometrics = isBiometricReady && (isMandatedByPolicy || useBiometrics);
    if (shouldPromptBiometrics) {
      const bioResult = await openBiometricPrompt({
        actionType: 'MOMO_WITHDRAWAL',
        amountGhs: netPayoutGhs,
        recipientPhone,
        network,
        accountHolderName,
        recipient: `${network} ${recipientPhone} (${accountHolderName})`,
        title: `Authorize MoMo Cash-Out (GH₵ ${netPayoutGhs.toFixed(2)})`,
        subtitle: `Scan ${isFace ? 'Face ID' : 'Fingerprint'} to confirm instant transfer to ${recipientPhone}`
      });

      if (!bioResult.success) {
        haptics.error();
        setErrorMsg(bioResult.message || 'Biometric authorization was cancelled or failed.');
        return;
      }
      authRef = bioResult.signatureReference || `BIO-MOMO-${Math.floor(100000 + Math.random() * 900000)}`;
      if (bioResult.biometricType) {
        authType = bioResult.biometricType;
      }
    }

    setIsProcessing(true);

    // Step-by-step simulated gateway progression
    setProcessStep('GhIPSS Instant Switch: Biometric signature verified...');
    await new Promise(r => setTimeout(r, 500));

    setProcessStep(`Authenticating with ${network === 'MTN' ? 'MTN MoMo API v2.1' : network === 'Telecel' ? 'Telecel Cash Gateway' : 'AT Money Switch'}...`);
    await new Promise(r => setTimeout(r, 600));

    setProcessStep(`Verifying KYC for ${accountHolderName} (${recipientPhone})...`);
    await new Promise(r => setTimeout(r, 500));

    setProcessStep(`Executing Instant Credit Transfer of GH₵ ${netPayoutGhs.toFixed(2)}...`);
    await new Promise(r => setTimeout(r, 600));

    const result = await requestCashWithdrawal({
      pointsToConvert,
      network,
      recipientPhone,
      accountHolderName,
      ghanaCardNumber,
      authorizedViaBiometrics: useBiometrics && isBiometricReady,
      biometricAuthRef: authRef,
      biometricType: authType
    });

    setIsProcessing(false);

    if (result.success && result.withdrawal) {
      haptics.cashOut();
      setCompletedWithdrawal(result.withdrawal);
    } else {
      haptics.error();
      setErrorMsg(result.message || 'Withdrawal failed. Please check network and try again.');
    }
  };

  const handleCopyRef = (ref: string) => {
    haptics.light();
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 p-6 text-slate-950 relative shrink-0">
          <button
            onClick={() => setShowCashOutModal(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-900 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" />
              Instant MoMo Cash Out
            </div>
            <span className="text-xs font-bold text-slate-950/80">
              10 Pts = GH₵ 1.00
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-950 tracking-tight">
            Convert EcoPoints to Cash
          </h2>
          <p className="text-xs text-slate-950/85 mt-1 font-medium">
            Real-time direct payout via MTN MoMo, Telecel Cash & AT Money.
          </p>

          {/* Current Balance Pill */}
          <div className="mt-4 inline-flex items-center gap-2 bg-slate-950/10 px-3 py-1.5 rounded-xl border border-slate-950/15">
            <Coins className="w-4 h-4 text-slate-950" />
            <span className="text-xs font-bold text-slate-950">Your Balance:</span>
            <span className="font-mono font-black text-sm text-slate-950">
              {currentUser.ecoPoints} Pts <span className="text-xs font-semibold text-slate-900">(≈ GH₵ {(currentUser.ecoPoints / ECO_POINTS_PER_GHS).toFixed(2)})</span>
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-900 dark:text-slate-100">
          
          {completedWithdrawal ? (
            /* SUCCESS VIEW & DIGITAL RECEIPT */
            <div className="space-y-5 animate-in zoom-in-95 duration-200">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  MoMo Payout Successful! 🎉
                </h3>
                <p className="text-xs text-slate-500">
                  <strong className="text-emerald-600 font-mono font-bold">GH₵ {completedWithdrawal.netPayoutGhs.toFixed(2)}</strong> has been instantly credited to your Mobile Money account.
                </p>
              </div>

              {/* Biometric Verification Badge */}
              {completedWithdrawal.authorizedViaBiometrics && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-300">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                      {isFace ? <ScanFace className="w-4 h-4" /> : <Fingerprint className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        Biometrically Verified & Signed
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                        Ref: {completedWithdrawal.biometricAuthRef || 'FIDO2-SECURE-ENCLAVE-AUTH'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-200 dark:bg-emerald-900/60 rounded font-bold">
                    WebAuthn Level 2
                  </span>
                </div>
              )}

              {/* Simulated SMS Alert Preview */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 dark:text-amber-300">
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-amber-600" />
                    Incoming SMS • {completedWithdrawal.network} Mobile Money
                  </span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400">Just Now</span>
                </div>
                <p className="font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-white/70 dark:bg-slate-900/80 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                  &quot;Payment of <strong>GH₵ {completedWithdrawal.netPayoutGhs.toFixed(2)}</strong> received from <strong>ECOSORT GHANA EPA RECYCLING FUND</strong> for waste recovery incentive. Fee: GH₵ 0.00. Balance updated. Ref: {completedWithdrawal.transactionRef}.&quot;
                </p>
              </div>

              {/* Transaction Receipt Card */}
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Transaction ID:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-slate-900 dark:text-slate-100">
                    <span>{completedWithdrawal.transactionRef}</span>
                    <button 
                      type="button"
                      onClick={() => handleCopyRef(completedWithdrawal.transactionRef)}
                      className="p-1 text-slate-400 hover:text-emerald-600"
                      title="Copy Reference"
                    >
                      {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">EcoPoints Converted:</span>
                  <span className="font-mono font-bold text-rose-600">-{completedWithdrawal.pointsConverted} Pts</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Recipient Account:</span>
                  <span className="font-bold">{completedWithdrawal.accountHolderName} ({completedWithdrawal.recipientPhone})</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Telco Network:</span>
                  <span className="font-bold text-amber-600">{completedWithdrawal.network} Mobile Money</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Gateway Switch:</span>
                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">{completedWithdrawal.payoutGateway}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Remaining Point Balance:</span>
                  <span className="font-mono font-bold text-emerald-600">{currentUser.ecoPoints} Pts</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-emerald-500" />
                    httpSMS Receipt:
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    📲 Dispatched to {completedWithdrawal.recipientPhone}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCompletedWithdrawal(null);
                    setPointsToConvert(Math.min(100, currentUser.ecoPoints));
                  }}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition-colors text-slate-700 dark:text-slate-300"
                >
                  Make Another Withdrawal
                </button>

                <button
                  type="button"
                  onClick={() => setShowCashOutModal(false)}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
                >
                  Done
                </button>
              </div>

            </div>
          ) : isProcessing ? (
            /* PROCESSING LOADER */
            <div className="py-12 px-4 text-center space-y-6 animate-in fade-in">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-amber-200 dark:border-amber-900 border-t-amber-500 animate-spin" />
                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  {useBiometrics ? <ShieldCheck className="w-6 h-6 animate-pulse" /> : <Smartphone className="w-6 h-6 animate-pulse" />}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Processing MoMo Instant Payout...
                </h3>
                <p className="text-xs font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 py-2 px-3 rounded-xl border border-amber-200 dark:border-amber-900/60 inline-block">
                  {processStep}
                </p>
              </div>

              <div className="max-w-xs mx-auto text-left text-[11px] text-slate-400 space-y-1.5 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Biometric Assertion & Signature Validated</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>GhIPSS Telco Open API Routing Connected</span>
                </div>
                <div className="flex items-center gap-2 animate-pulse text-amber-600 dark:text-amber-400 font-semibold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Transferring GH₵ {netPayoutGhs.toFixed(2)} to {recipientPhone}...</span>
                </div>
              </div>
            </div>
          ) : (
            /* WITHDRAWAL FORM */
            <form onSubmit={handleSubmitWithdrawal} className="space-y-4">
              
              {/* Point Input & Presets */}
              <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    EcoPoints to Convert
                  </label>
                  <button
                    type="button"
                    onClick={handleMaxPoints}
                    className="text-[11px] font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400"
                  >
                    Withdraw All ({currentUser.ecoPoints} Pts)
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max={currentUser.ecoPoints}
                    step="1"
                    value={pointsToConvert || ''}
                    onChange={(e) => {
                      setPointsToConvert(Math.max(0, parseInt(e.target.value) || 0));
                      setErrorMsg('');
                    }}
                    required
                    placeholder="e.g. 100"
                    className="w-full pl-4 pr-16 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-lg font-mono font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    EcoPoints
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                  {[50, 100, 200, 500].map((preset) => {
                    const disabled = currentUser.ecoPoints < preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleQuickPreset(preset)}
                        disabled={disabled}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 ${
                          pointsToConvert === preset
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : disabled
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-400'
                        }`}
                      >
                        {preset} Pts (GH₵ {(preset / ECO_POINTS_PER_GHS).toFixed(0)})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Conversion Summary Box */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20 p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Gross Cash Value:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">GH₵ {grossCashGhs.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    EPA Processing Fee (Subsidized):
                  </span>
                  <span className="font-mono font-bold text-emerald-600">GH₵ 0.00 (FREE)</span>
                </div>
                <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">You Receive:</span>
                  <span className="font-mono text-xl font-black text-amber-600 dark:text-amber-400">
                    GH₵ {netPayoutGhs.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Telco Network Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Select Mobile Money Network
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNetwork('MTN')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 text-center transition-all ${
                      network === 'MTN'
                        ? 'border-yellow-500 bg-yellow-500/10 text-yellow-800 dark:text-yellow-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-yellow-400 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-xs">
                      MTN
                    </div>
                    <span className="text-[11px] font-bold">MTN MoMo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNetwork('Telecel')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 text-center transition-all ${
                      network === 'Telecel'
                        ? 'border-red-500 bg-red-500/10 text-red-800 dark:text-red-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                      TC
                    </div>
                    <span className="text-[11px] font-bold">Telecel Cash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNetwork('AT')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 text-center transition-all ${
                      network === 'AT'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-800 dark:text-blue-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                      AT
                    </div>
                    <span className="text-[11px] font-bold">AT Money</span>
                  </button>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    Recipient Phone ({network}) *
                  </label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    required
                    placeholder="024 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>📲</span> An instant SMS transaction alert will be dispatched via httpSMS.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    required
                    placeholder="e.g. Bright Mensah"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Optional Ghana Card for Bank of Ghana Compliance */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span>Ghana Card ID (BoG / EPA KYC Verification)</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Tier 1 Verified</span>
                </label>
                <input
                  type="text"
                  value={ghanaCardNumber}
                  onChange={(e) => setGhanaCardNumber(e.target.value)}
                  placeholder="GHA-XXXXXXXXX-X"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Biometric Authorization & Security Policy Card */}
              <div className={`p-3.5 rounded-2xl border transition-all ${
                isBiometricReady 
                  ? isMandatedByPolicy
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/80 shadow-xs'
                    : 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/80'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isBiometricReady 
                        ? isMandatedByPolicy 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {isFace ? <ScanFace className="w-4 h-4" /> : <Fingerprint className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                        <span>Biometric Hardware Shield</span>
                        {isBiometricReady && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                            isMandatedByPolicy
                              ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                              : 'bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200'
                          }`}>
                            {isMandatedByPolicy ? 'Policy Required 🔒' : 'Optional Pass ⚡'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isBiometricReady ? (
                          momoPolicy === 'ALWAYS' ? (
                            'Mandated for all transactions by your security policy'
                          ) : momoPolicy === 'THRESHOLD_ONLY' ? (
                            isExceedingThreshold ? (
                              <span>Transfer (GH₵ {netPayoutGhs.toFixed(2)}) ≥ GH₵ {momoThreshold.toFixed(2)} threshold → Biometrics required</span>
                            ) : (
                              <span>Transfer (GH₵ {netPayoutGhs.toFixed(2)}) &lt; GH₵ {momoThreshold.toFixed(2)} threshold → Fast-pass active</span>
                            )
                          ) : (
                            'Biometric confirmation currently disabled for MoMo'
                          )
                        ) : (
                          'Biometrics not enrolled on this device'
                        )}
                      </div>
                    </div>
                  </div>

                  {isBiometricReady && (
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useBiometrics}
                          disabled={isMandatedByPolicy}
                          onChange={(e) => setUseBiometrics(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className={`w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                          isMandatedByPolicy
                            ? 'bg-emerald-600 opacity-90 cursor-not-allowed'
                            : 'bg-slate-300 dark:bg-slate-700 peer-checked:bg-blue-600'
                        }`}></div>
                      </label>
                    </div>
                  )}
                </div>

                {/* Inline Policy & Threshold Quick Adjustment Toggle */}
                {isBiometricReady && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => setShowInlinePolicyConfig(!showInlinePolicyConfig)}
                      className="text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-between w-full"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sliders className="w-3 h-3 text-amber-500" />
                        <span>MoMo Policy: {momoPolicy === 'ALWAYS' ? 'Every Transaction' : momoPolicy === 'THRESHOLD_ONLY' ? `Above GH₵ ${momoThreshold.toFixed(0)}` : 'Disabled'}</span>
                      </span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                        <span>{showInlinePolicyConfig ? 'Close' : 'Adjust Policy'}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${showInlinePolicyConfig ? 'rotate-180' : ''}`} />
                      </span>
                    </button>

                    {/* Collapsible Policy Drawer */}
                    {showInlinePolicyConfig && (
                      <div className="mt-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 animate-in fade-in">
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              updateUserProfile({ momoBiometricPolicy: 'ALWAYS', requireBiometricForMoMo: true });
                              setUseBiometrics(true);
                            }}
                            className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${
                              momoPolicy === 'ALWAYS'
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent'
                            }`}
                          >
                            Always Prompt
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateUserProfile({ momoBiometricPolicy: 'THRESHOLD_ONLY', requireBiometricForMoMo: true });
                            }}
                            className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${
                              momoPolicy === 'THRESHOLD_ONLY'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent'
                            }`}
                          >
                            Threshold Limit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateUserProfile({ momoBiometricPolicy: 'NEVER', requireBiometricForMoMo: false });
                              setUseBiometrics(false);
                            }}
                            className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${
                              momoPolicy === 'NEVER'
                                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent'
                            }`}
                          >
                            Never Prompt
                          </button>
                        </div>

                        {/* If Threshold policy, adjust amount */}
                        {momoPolicy === 'THRESHOLD_ONLY' && (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-500">Require sensor for transfers ≥</span>
                              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">GH₵ {momoThreshold.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[5, 10, 20, 50, 100].map((amt) => (
                                <button
                                  key={amt}
                                  type="button"
                                  onClick={() => updateUserProfile({ momoBiometricThresholdGhs: amt })}
                                  className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${
                                    momoThreshold === amt
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                  }`}
                                >
                                  GH₵ {amt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2 border border-rose-200 dark:border-rose-900">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCashOutModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!canAfford || pointsToConvert <= 0}
                  className={`flex-2 py-3.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                    canAfford && pointsToConvert > 0
                      ? isBiometricReady && useBiometrics
                        ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 cursor-pointer'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isBiometricReady && useBiometrics ? (
                    <>
                      {isFace ? <ScanFace className="w-4 h-4" /> : <Fingerprint className="w-4 h-4" />}
                      <span>Authorize GH₵ {netPayoutGhs.toFixed(2)} with {isFace ? 'Face ID' : 'Biometrics'}</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Withdraw GH₵ {netPayoutGhs.toFixed(2)} to {network}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Regulatory Notice */}
              <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-slate-400" />
                <span>Instant settlement via Bank of Ghana GhIPSS Switch & EPA Circular Fund</span>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
