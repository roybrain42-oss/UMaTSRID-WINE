import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  ScanFace,
  Lock,
  Smartphone,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Key,
  RefreshCw,
  ChevronRight,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';

export const BiometricSecurityStatusCard: React.FC = () => {
  const {
    currentUser,
    biometricCapability,
    isBiometricsEnrolled,
    registerUserBiometrics,
    removeUserBiometrics,
    authenticateWithBiometrics,
    setShowEditProfileModal,
    setShowCashOutModal,
    t
  } = useEcoSort();

  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const isEnabled = isBiometricsEnrolled || !!currentUser?.biometricsEnabled;
  const biometricLabel = currentUser?.biometricDeviceName || biometricCapability?.biometricTypeLabel || 'Face ID / Fingerprint';
  const chipLevel = biometricCapability?.securityChipLevel || 'FIDO2 / WebAuthn Level 2 Secure Enclave';
  const isFace = biometricCapability?.biometricIconName === 'ScanFace' || currentUser?.biometricType === 'FACE_ID';

  const handleEnrollNow = async () => {
    setIsEnrolling(true);
    setTestResult(null);
    try {
      const res = await registerUserBiometrics();
      if (res.success) {
        setTestResult({
          success: true,
          message: 'Biometric passkey activated! You can now authorize MoMo payouts with 1 touch.'
        });
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleTestSensor = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await authenticateWithBiometrics('TEST_PROMPT', 'Test Biometric Hardware Sensor');
      if (res.success) {
        setTestResult({
          success: true,
          message: `Biometric sensor hardware validated: Authenticated via ${res.biometricType || 'Secure Enclave'}.`
        });
      } else {
        setTestResult({
          success: false,
          message: res.message || 'Sensor test was cancelled or unsuccessful.'
        });
      }
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className={`rounded-3xl p-6 border transition-all duration-200 relative overflow-hidden shadow-xs ${
      isEnabled
        ? 'bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 dark:from-slate-900 dark:via-emerald-950/10 dark:to-slate-900 border-emerald-200 dark:border-emerald-800/60'
        : 'bg-gradient-to-br from-white via-amber-50/20 to-orange-50/20 dark:from-slate-900 dark:via-amber-950/10 dark:to-slate-900 border-amber-200 dark:border-amber-800/60'
    }`}>
      
      {/* Background Watermark Icon */}
      <div className="absolute -right-6 -bottom-6 opacity-5 dark:opacity-[0.03] pointer-events-none">
        {isFace ? (
          <ScanFace className="w-48 h-48 text-emerald-900 dark:text-emerald-100" />
        ) : (
          <Fingerprint className="w-48 h-48 text-emerald-900 dark:text-emerald-100" />
        )}
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Side: Status Icon & Details */}
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-transform ${
            isEnabled 
              ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/20' 
              : 'bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 shadow-amber-500/20'
          }`}>
            {isEnabled ? (
              isFace ? <ScanFace className="w-7 h-7" /> : <Fingerprint className="w-7 h-7" />
            ) : (
              <ShieldAlert className="w-7 h-7" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isEnabled
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50'
                  : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50'
              }`}>
                {isEnabled ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{isFace ? 'FaceID Enabled' : 'Biometrics Active'}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>Biometric Setup Required</span>
                  </>
                )}
              </span>

              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" />
                FIDO2 / WebAuthn Level 2
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              {isEnabled ? `${biometricLabel} Security Shield` : 'Enable Biometric Authentication'}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              {isEnabled ? (
                <>
                  Your wallet is locked with <strong className="text-slate-800 dark:text-slate-200">{chipLevel}</strong>. All MoMo cash-out transfers & 1-touch logins require biometric hardware assertion.
                </>
              ) : (
                <>
                  Protect your <strong className="text-slate-800 dark:text-slate-200">{currentUser.ecoPoints} EcoPoints (GH₵ {(currentUser.ecoPoints / 10).toFixed(2)})</strong>. Bind your device's biometric sensor (Face ID, Windows Hello, or Fingerprint) for instant MoMo authorizations with zero SMS OTP delays.
                </>
              )}
            </p>

            {/* Registered Timestamp & Chips */}
            {isEnabled && (
              <div className="flex flex-wrap items-center gap-2.5 pt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                {currentUser.biometricRegisteredAt && (
                  <span>Enrolled: {new Date(currentUser.biometricRegisteredAt).toLocaleDateString()}</span>
                )}
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  MoMo Shield: {
                    currentUser.momoBiometricPolicy === 'ALWAYS' 
                      ? 'Required for All Transfers' 
                      : currentUser.momoBiometricPolicy === 'NEVER'
                      ? 'Disabled'
                      : `Required Above GH₵ ${(currentUser.momoBiometricThresholdGhs ?? 20).toFixed(0)}`
                  }
                </span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(true)}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                >
                  Configure Limits
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Action CTA Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          {isEnabled ? (
            <>
              <button
                type="button"
                onClick={handleTestSensor}
                disabled={isTesting}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    {isFace ? <ScanFace className="w-3.5 h-3.5 text-emerald-500" /> : <Fingerprint className="w-3.5 h-3.5 text-emerald-500" />}
                    <span>Test Sensor</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowEditProfileModal(true)}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Manage Passkeys</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEnrollNow}
              disabled={isEnrolling}
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
            >
              {isEnrolling ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Enrolling Hardware Passkey...</span>
                </>
              ) : (
                <>
                  {isFace ? <ScanFace className="w-4 h-4" /> : <Fingerprint className="w-4 h-4" />}
                  <span>Enable Face ID / Fingerprint</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          )}
        </div>

      </div>

      {/* Sensor Test Feedback Banner */}
      {testResult && (
        <div className={`mt-4 p-3 rounded-xl text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in ${
          testResult.success 
            ? 'bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
            : 'bg-rose-100/80 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>

          <button
            type="button"
            onClick={() => setTestResult(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

    </div>
  );
};
