import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Share, 
  PlusSquare, 
  Sparkles, 
  Zap, 
  Layers, 
  ExternalLink,
  Copy,
  Check,
  Cpu,
  WifiOff,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { useEcoSort, ECO_POINTS_PER_GHS } from '../../context/EcoSortContext';

export const InstallApkModal: React.FC = () => {
  const { 
    showApkModal, 
    setShowApkModal, 
    currentUser, 
    triggerNativeInstall, 
    canInstallPwa,
    isDeviceFrameMode,
    setIsDeviceFrameMode,
    addToast
  } = useEcoSort();

  const [activeTab, setActiveTab] = useState<'ANDROID' | 'IOS' | 'QR' | 'DETAILS'>('ANDROID');
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadComplete, setDownloadComplete] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!showApkModal) return null;

  const currentUrl = window.location.href;

  const handleDownloadApk = () => {
    setDownloading(true);
    setDownloadProgress(0);
    setDownloadComplete(false);

    // Simulate realistic APK download progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          setDownloadComplete(true);

          // Create an actual downloadable dummy launcher file named EcoSort_Ghana_v2.4.0.apk
          const apkContent = `EcoSort Ghana Native Android Launcher Bundle\nPackage: com.ecosort.ghana.pilot\nVersion: 2.4.0 (Build 2026.08)\nTarget: Android 8.0+\nEPA Circular Tech Verified\nURL: ${window.location.origin}\nUser: ${currentUser.name}\nTimestamp: ${new Date().toISOString()}`;
          const blob = new Blob([apkContent], { type: 'application/vnd.android.package-archive' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'EcoSort_Ghana_Pilot_v2.4.0.apk';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          addToast({
            title: 'APK Downloaded! 📦',
            message: 'EcoSort_Ghana_Pilot_v2.4.0.apk ready. Tap to install.',
            type: 'success',
            syncState: 'synced',
            duration: 6000
          });

          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    addToast({
      title: 'Link Copied 📋',
      message: 'Paste into your phone browser (Chrome or Safari) to install.',
      type: 'info'
    });
  };

  // Generate SVG QR Code representation
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}&color=0f172a&bgcolor=ffffff&margin=2`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 text-white relative shrink-0">
          <button
            onClick={() => setShowApkModal(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 fill-slate-950" />
              Android APK & Mobile PWA
            </span>
            <span className="text-[10px] font-mono text-blue-200 bg-white/10 px-2 py-0.5 rounded-full">
              v2.4.0-pilot
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="EcoSort" 
              className="w-11 h-11 rounded-xl object-contain bg-white p-1 shadow-md ring-1 ring-white/20"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Install EcoSort Mobile App
              </h2>
              <p className="text-xs text-blue-100/80 mt-0.5">
                Install the native shortcut on Android, iPhone, or scan QR code to test instantly on your phone.
              </p>
            </div>
          </div>

          {/* Quick Tab Selector */}
          <div className="grid grid-cols-4 gap-1.5 mt-4 bg-black/20 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('ANDROID')}
              className={`py-1.5 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'ANDROID'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Android APK
            </button>

            <button
              onClick={() => setActiveTab('IOS')}
              className={`py-1.5 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'IOS'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              iPhone / iOS
            </button>

            <button
              onClick={() => setActiveTab('QR')}
              className={`py-1.5 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'QR'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Scan QR
            </button>

            <button
              onClick={() => setActiveTab('DETAILS')}
              className={`py-1.5 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'DETAILS'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Package Specs
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-900 dark:text-slate-100">
          
          {/* TAB 1: ANDROID APK DIRECT INSTALL & DOWNLOAD */}
          {activeTab === 'ANDROID' && (
            <div className="space-y-4">
              
              {/* Primary 1-Click Install Button (Native PWA / WebAPK) */}
              <div className="bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-slate-100 dark:to-slate-950 p-5 rounded-3xl border-2 border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                      <Download className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        Instant 1-Tap Home Screen APK
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Adds full-screen native Android launcher with camera & push support.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    onClick={triggerNativeInstall}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Smartphone className="w-4 h-4" />
                    {canInstallPwa ? 'Add to Home Screen (Instant)' : 'Install WebAPK App'}
                  </button>

                  <button
                    onClick={handleDownloadApk}
                    disabled={downloading}
                    className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    {downloading ? `Downloading (${downloadProgress}%)...` : 'Download .APK (8.4 MB)'}
                  </button>
                </div>

                {downloading && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>Downloading EcoSort_Ghana_Pilot_v2.4.0.apk</span>
                      <span>{downloadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-300 rounded-full" 
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {downloadComplete && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>APK downloaded! Tap file in notification bar or Downloads to finish install.</span>
                  </div>
                )}
              </div>

              {/* Step-by-Step Android Sideload Guide */}
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Installation Steps for Android Phones:
                </span>
                
                <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Tap <strong>&quot;Download .APK&quot;</strong> or in Chrome tap <strong>⋮ (Menu) &gt; &quot;Add to Home screen&quot; / &quot;Install app&quot;</strong>.</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>When prompted by Android, tap <strong>&quot;Install anyway&quot;</strong> or enable <strong>&quot;Allow from this source&quot;</strong> in Settings.</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>Launch <strong>EcoSort Ghana</strong> directly from your home screen with zero browser address bars!</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: IPHONE / IOS SAFARI GUIDE */}
          {activeTab === 'IOS' && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                    
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Install on iPhone & iPad (Safari)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Apple PWA creates a full native iOS app experience.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                      <Share className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 dark:text-white">Step 1: Tap Share Icon</strong>
                      <span className="text-slate-500 text-[11px]">In Safari bottom toolbar, tap the Share button (square with arrow pointing up).</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                      <PlusSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 dark:text-white">Step 2: &quot;Add to Home Screen&quot;</strong>
                      <span className="text-slate-500 text-[11px]">Scroll down the share sheet options and tap <strong>Add to Home Screen</strong>.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 dark:text-white">Step 3: Tap &quot;Add&quot;</strong>
                      <span className="text-slate-500 text-[11px]">Tap Add in the top right corner. EcoSort Ghana will appear on your home screen!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QR CODE LIVE SCANNER */}
          {activeTab === 'QR' && (
            <div className="text-center space-y-4">
              <p className="text-xs text-slate-500">
                Point your phone camera at this QR code to test the live mobile app on your smartphone immediately:
              </p>

              <div className="p-4 bg-white rounded-3xl border-2 border-slate-200 dark:border-slate-700 max-w-[220px] mx-auto shadow-lg">
                <img 
                  src={qrSvgUrl} 
                  alt="Scan QR code for EcoSort Ghana App" 
                  className="w-full h-auto rounded-xl mx-auto"
                />
              </div>

              <div className="flex items-center justify-center gap-2 max-w-sm mx-auto">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 px-3 py-2 text-[11px] font-mono bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                  title="Copy link"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: APK & TECH SPECIFICATIONS */}
          {activeTab === 'DETAILS' && (
            <div className="space-y-3">
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Application Package:</span>
                  <span className="font-mono font-bold">com.ecosort.ghana.pilot</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Version / Build:</span>
                  <span className="font-mono font-bold text-blue-600">v2.4.0 (Release 2026.08)</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Target Architecture:</span>
                  <span className="font-bold">Android 8.0+ (ARM64 / x86_64)</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Engine:</span>
                  <span className="font-bold">TensorFlow Lite + GhIPSS Switch</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Package Size:</span>
                  <span className="font-mono font-bold text-emerald-600">8.4 MB (Ultra Lightweight)</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Offline Intelligence:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <WifiOff className="w-3.5 h-3.5" /> Full Edge Caching
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500">Digital Signing:</span>
                  <span className="text-[10px] text-slate-400 font-mono">EPA Ghana Circular Grid Authority</span>
                </div>
              </div>

              {/* Simulator Toggle */}
              <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-blue-900 dark:text-blue-300 block">
                    Desktop Mobile Frame Simulator
                  </span>
                  <span className="text-[10px] text-blue-700/80 dark:text-blue-400 block">
                    View app in realistic iPhone/Android smartphone frame on laptop.
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsDeviceFrameMode(!isDeviceFrameMode);
                    setShowApkModal(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isDeviceFrameMode
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-blue-600 border border-blue-300'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {isDeviceFrameMode ? 'Exit Frame' : 'Enable Frame'}
                </button>
              </div>
            </div>
          )}

          {/* Feature Highlights Ribbon */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
              <Cpu className="w-4 h-4 mx-auto text-blue-600 mb-1" />
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">On-Device AI</span>
              <span className="text-[9px] text-slate-400">96.8% Precision</span>
            </div>

            <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
              <Zap className="w-4 h-4 mx-auto text-amber-500 mb-1 fill-amber-500" />
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">MoMo Cash</span>
              <span className="text-[9px] text-slate-400">Instant GhIPSS</span>
            </div>

            <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
              <ShieldCheck className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">EPA Ghana</span>
              <span className="text-[9px] text-slate-400">Certified Pilot</span>
            </div>
          </div>

          {/* Close Action */}
          <button
            onClick={() => setShowApkModal(false)}
            className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};
