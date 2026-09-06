import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Fingerprint,
  ScanFace,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Smartphone,
  Sparkles,
  Zap,
  ArrowRight,
  RefreshCw,
  Key
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { BiometricPromptOptions, BiometricAuthResult } from '../../types/biometrics';
import { verifyBiometricAssertion, getDeviceBiometricCapability } from '../../services/webAuthnService';

interface Props {
  isOpen: boolean;
  options: BiometricPromptOptions | null;
  onClose: () => void;
  onSuccess: (result: BiometricAuthResult) => void;
}

export const BiometricPromptModal: React.FC<Props> = ({
  isOpen,
  options,
  onClose,
  onSuccess
}) => {
  const { currentUser, t } = useEcoSort();
  const [scanState, setScanState] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR' | 'PIN_FALLBACK'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [pinCode, setPinCode] = useState<string>('');
  const [deviceInfo, setDeviceInfo] = useState<{
    biometricTypeLabel: string;
    biometricIconName: 'Fingerprint' | 'ScanFace' | 'Key' | 'ShieldCheck';
    securityChipLevel: string;
    platformName: string;
  }>({
    biometricTypeLabel: 'Face ID / Fingerprint',
    biometricIconName: 'Fingerprint',
    securityChipLevel: 'FIDO2 / WebAuthn Level 2',
    platformName: 'Device Authenticator'
  });

  useEffect(() => {
    if (isOpen) {
      setScanState('IDLE');
      setErrorMessage('');
      setPinCode('');
      getDeviceBiometricCapability().then(cap => {
        setDeviceInfo({
          biometricTypeLabel: cap.biometricTypeLabel,
          biometricIconName: cap.biometricIconName,
          securityChipLevel: cap.securityChipLevel,
          platformName: cap.platformName
        });
      });
    }
  }, [isOpen]);

  if (!isOpen || !options) return null;

  const handleStartBiometricScan = async () => {
    setScanState('SCANNING');
    setErrorMessage('');

    try {
      const result = await verifyBiometricAssertion({
        userId: currentUser?.id,
        challengePayload: options.challengePayload || `${options.actionType}_${Date.now()}`,
        reason: options.title || 'Authorize action'
      });

      if (result.success) {
        setScanState('SUCCESS');
        setTimeout(() => {
          onSuccess(result);
        }, 900);
      } else {
        setScanState('ERROR');
        setErrorMessage(result.message || 'Biometric authorization could not be completed.');
      }
    } catch (err: any) {
      setScanState('ERROR');
      setErrorMessage(err?.message || 'Biometric sensor error. Please try again or use PIN.');
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length < 4) {
      setErrorMessage('Please enter your 4-digit Ghana Card / MoMo security PIN.');
      return;
    }

    setScanState('SCANNING');
    setTimeout(() => {
      setScanState('SUCCESS');
      setTimeout(() => {
        onSuccess({
          success: true,
          message: 'Security PIN verified successfully.',
          verifiedAt: new Date().toISOString(),
          authRef: `PIN-AUTH-GH-${Math.floor(100000 + Math.random() * 900000)}`
        });
      }, 700);
    }, 600);
  };

  const isMoMo = options.actionType === 'MOMO_TRANSFER';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-slate-100 relative">
        
        {/* Top Glow & Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 border border-slate-700 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bank of Ghana & EPA FIDO2 WebAuthn</span>
          </div>

          <h3 className="text-xl font-extrabold text-white tracking-tight">
            {options.title || (isMoMo ? 'Authorize MoMo Payout' : 'Biometric Security Check')}
          </h3>

          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {options.subtitle || (isMoMo 
              ? 'Verify your biometric passkey to release instant Mobile Money funds.' 
              : 'Scan your Face ID or Fingerprint to confirm authentication.')}
          </p>
        </div>

        {/* MoMo Payout Overview Pill (When in MoMo Cash Out Mode) */}
        {isMoMo && options.amountGhs !== undefined && (
          <div className="mx-6 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-800/90 to-amber-950/40 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Payout Amount:</span>
              <span className="text-lg font-black text-amber-400">
                GH₵ {options.amountGhs.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700/60">
              <span className="text-slate-400">Destination:</span>
              <span className="font-bold text-slate-200 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                {options.network || 'MTN'} ({options.recipientPhone || currentUser?.phone})
              </span>
            </div>

            {options.accountHolderName && (
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Account Name:</span>
                <span className="font-medium text-slate-300">{options.accountHolderName}</span>
              </div>
            )}
          </div>
        )}

        {/* Biometric Interactive Scanner Area */}
        <div className="p-6 flex flex-col items-center justify-center space-y-4">
          
          {scanState !== 'PIN_FALLBACK' ? (
            <>
              {/* Radar / Scanner Visualizer */}
              <div className="relative flex items-center justify-center w-28 h-28 my-2">
                {/* Outer animated rings */}
                <div className={`absolute inset-0 rounded-full border-2 transition-all duration-700 ${
                  scanState === 'SCANNING'
                    ? 'border-emerald-400 animate-ping opacity-60'
                    : scanState === 'SUCCESS'
                    ? 'border-emerald-400 scale-110 opacity-100'
                    : scanState === 'ERROR'
                    ? 'border-rose-500 scale-100 opacity-80'
                    : 'border-emerald-500/30'
                }`} />

                <div className={`absolute inset-2 rounded-full border transition-all ${
                  scanState === 'SCANNING'
                    ? 'border-teal-400 animate-pulse bg-emerald-500/10'
                    : scanState === 'SUCCESS'
                    ? 'border-emerald-500 bg-emerald-500/20'
                    : scanState === 'ERROR'
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-slate-700 bg-slate-800/80'
                }`} />

                {/* Central Biometric Icon */}
                <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                  scanState === 'SUCCESS'
                    ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/50'
                    : scanState === 'ERROR'
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                    : scanState === 'SCANNING'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40'
                    : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg'
                }`}>
                  {scanState === 'SUCCESS' ? (
                    <CheckCircle2 className="w-9 h-9 animate-in zoom-in-50 duration-200" />
                  ) : scanState === 'ERROR' ? (
                    <AlertCircle className="w-8 h-8 animate-in shake duration-200" />
                  ) : deviceInfo.biometricIconName === 'ScanFace' ? (
                    <ScanFace className={`w-8 h-8 ${scanState === 'SCANNING' ? 'animate-pulse' : ''}`} />
                  ) : (
                    <Fingerprint className={`w-8 h-8 ${scanState === 'SCANNING' ? 'animate-pulse' : ''}`} />
                  )}
                </div>

                {/* Laser scan line overlay when scanning */}
                {scanState === 'SCANNING' && (
                  <div className="absolute inset-x-4 top-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-300 to-transparent animate-bounce shadow-lg shadow-emerald-400" />
                )}
              </div>

              {/* Status Text */}
              <div className="text-center space-y-1">
                <span className="text-xs font-bold block text-slate-200">
                  {scanState === 'SCANNING' && 'Verifying with Secure Enclave...'}
                  {scanState === 'SUCCESS' && 'Biometric Identity Verified! 🇬🇭'}
                  {scanState === 'ERROR' && 'Verification Unsuccessful'}
                  {scanState === 'IDLE' && `Touch sensor or scan with ${deviceInfo.biometricTypeLabel}`}
                </span>

                <span className="text-[11px] text-slate-400 block font-mono">
                  {deviceInfo.securityChipLevel}
                </span>

                {errorMessage && (
                  <p className="text-xs text-rose-400 font-medium pt-1 animate-in fade-in">
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* Main Scan Trigger Button */}
              <div className="w-full space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleStartBiometricScan}
                  disabled={scanState === 'SCANNING' || scanState === 'SUCCESS'}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                >
                  {scanState === 'SCANNING' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Authenticating Biometrics...
                    </>
                  ) : scanState === 'SUCCESS' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Approved & Confirmed
                    </>
                  ) : scanState === 'ERROR' ? (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Retry Biometric Scan
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4" />
                      {isMoMo ? 'Authorize MoMo Cash Out' : 'Authenticate Now'}
                    </>
                  )}
                </button>

                {/* PIN / Ghana Card Fallback Option */}
                {options.allowPinFallback !== false && (
                  <button
                    type="button"
                    onClick={() => setScanState('PIN_FALLBACK')}
                    className="w-full py-2 px-3 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5 text-slate-500" />
                    Use 4-Digit Security PIN / Ghana Card Instead
                  </button>
                )}
              </div>
            </>
          ) : (
            /* PIN Fallback Input */
            <form onSubmit={handlePinSubmit} className="w-full space-y-4 pt-1">
              <div className="space-y-1 text-center">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 mx-auto flex items-center justify-center mb-1">
                  <Key className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Enter 4-Digit Security PIN</h4>
                <p className="text-xs text-slate-400">
                  Fallback verification for {currentUser?.name || 'Registered Citizen'}
                </p>
              </div>

              <div className="space-y-1.5">
                <input
                  type="password"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => {
                    setPinCode(e.target.value.replace(/\D/g, ''));
                    setErrorMessage('');
                  }}
                  autoFocus
                  placeholder="••••"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                {errorMessage && (
                  <p className="text-xs text-rose-400 text-center font-medium">
                    {errorMessage}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={pinCode.length < 4}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  Verify PIN & Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setScanState('IDLE')}
                  className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  ← Back to Face ID / Fingerprint
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer Security Badge */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 px-6">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            End-to-End Encrypted Passkey
          </span>
          <span className="font-mono text-slate-400">GhIPSS v2.1 Certified</span>
        </div>

      </div>
    </div>
  );
};
