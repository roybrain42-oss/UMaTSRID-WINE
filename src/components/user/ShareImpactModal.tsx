import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Leaf, 
  Coins, 
  Scale, 
  Wind, 
  Smartphone, 
  MessageCircle, 
  Twitter, 
  Linkedin, 
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  Eye,
  Award,
  Layers,
  Palette
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { ShareImpactStats, ShareCardTheme, ShareCardFormat } from '../../types/shareImpact';
import { 
  renderImpactImageToCanvas, 
  getImpactImageBlob, 
  getImpactImageFile, 
  generateShareText 
} from '../../utils/generateImpactImage';

interface ShareImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  customStats?: Partial<ShareImpactStats>;
}

export const ShareImpactModal: React.FC<ShareImpactModalProps> = ({
  isOpen,
  onClose,
  customStats
}) => {
  const { 
    currentUser, 
    submissions, 
    ecoPointsPerGhs, 
    triggerCelebration, 
    addToast 
  } = useEcoSort();

  const [theme, setTheme] = useState<ShareCardTheme>('EMERALD_GHANA');
  const [format, setFormat] = useState<ShareCardFormat>('POST_SQUARE');
  const [timeframe, setTimeframe] = useState<'ALL_TIME' | 'WEEKLY'>('ALL_TIME');
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [canNativeShareFiles, setCanNativeShareFiles] = useState<boolean>(false);
  const [canNativeShare, setCanNativeShare] = useState<boolean>(false);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute stats based on user data
  const userSubmissions = submissions.filter(s => s.userId === currentUser.id);
  const weeklyWasteKg = +(Math.max(4.8, currentUser.totalWasteKg * 0.22)).toFixed(1);
  const weeklyPoints = Math.max(48, Math.round(currentUser.ecoPoints * 0.25));

  const totalWaste = timeframe === 'WEEKLY' ? weeklyWasteKg : currentUser.totalWasteKg;
  const points = timeframe === 'WEEKLY' ? weeklyPoints : currentUser.ecoPoints;
  const momoGhs = +(points / ecoPointsPerGhs).toFixed(2);
  const co2OffsetKg = +(totalWaste * 1.6).toFixed(1);
  const treesEquivalent = +(totalWaste * 1.6 * 0.08).toFixed(1);
  const plasticBottlesCount = Math.round(totalWaste * 32);

  const stats: ShareImpactStats = {
    userName: currentUser.name,
    rankTitle: currentUser.rankTitle,
    community: currentUser.community || currentUser.location || 'Accra, Ghana',
    totalWasteKg: totalWaste,
    ecoPoints: points,
    momoGhs: momoGhs,
    co2OffsetKg: co2OffsetKg,
    treesEquivalent: +treesEquivalent,
    verifiedCollections: timeframe === 'WEEKLY' ? Math.max(2, Math.round(currentUser.verifiedCollections * 0.2)) : currentUser.verifiedCollections,
    plasticBottlesCount: plasticBottlesCount,
    waterSavedLiters: Math.round(totalWaste * 24),
    energySavedKwh: +(totalWaste * 2.8).toFixed(1),
    streakDays: 6,
    accuracyScore: 98.4,
    verificationBadge: 'EPA Ghana Node Verified',
    timeframe: timeframe === 'WEEKLY' ? 'Weekly Milestone' : 'All-Time Journey',
    ...customStats
  };

  // Check Web Share API capabilities
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      setCanNativeShare(true);
      if (typeof navigator.canShare === 'function') {
        try {
          const testFile = new File(['test'], 'test.png', { type: 'image/png' });
          setCanNativeShareFiles(navigator.canShare({ files: [testFile] }));
        } catch {
          setCanNativeShareFiles(false);
        }
      }
    }
  }, []);

  // Generate and refresh preview when parameters change
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsGenerating(true);

    renderImpactImageToCanvas(stats, { theme, format })
      .then((canvas) => {
        if (!isMounted) return;
        previewCanvasRef.current = canvas;
        setPreviewDataUrl(canvas.toDataURL('image/png'));
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error('Failed to render impact card:', err);
        setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, theme, format, timeframe, currentUser, submissions]);

  if (!isOpen) return null;

  // 1. Web Share API Handler (Primary Action)
  const handleWebShare = async () => {
    const { title, text, url } = generateShareText(stats);

    try {
      if (canNativeShareFiles) {
        const file = await getImpactImageFile(stats, { theme, format });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title,
            text,
            url,
            files: [file]
          });
          triggerCelebration();
          addToast({
            title: 'Shared Successfully! 🎉',
            message: 'Your EcoSort impact card was shared to your community platform.',
            type: 'success'
          });
          return;
        }
      }

      // Fallback to text share if files aren't supported by browser share sheet
      if (canNativeShare) {
        await navigator.share({
          title,
          text: `${text}\n\nGenerated via EcoSort Ghana 🇬🇭`,
          url
        });
        triggerCelebration();
        addToast({
          title: 'Shared Successfully! 🌿',
          message: 'Impact summary shared via device share sheet.',
          type: 'success'
        });
        return;
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Web Share failed, falling back to copy:', err);
        handleCopyText();
      }
    }
  };

  // 2. Download Image PNG
  const handleDownload = async () => {
    try {
      const blob = await getImpactImageBlob(stats, { theme, format });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanName = stats.userName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      a.download = `EcoSort_Ghana_Impact_${cleanName}_${theme.toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      triggerCelebration();
      addToast({
        title: 'Image Downloaded! 📥',
        message: 'High-resolution PNG saved to your device for easy posting.',
        type: 'success'
      });
    } catch (err) {
      addToast({
        title: 'Download Failed',
        message: 'Could not generate download file.',
        type: 'error'
      });
    }
  };

  // 3. Copy Image to Clipboard
  const handleCopyImage = async () => {
    try {
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        const blob = await getImpactImageBlob(stats, { theme, format });
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 3000);
        addToast({
          title: 'Image Copied to Clipboard! 📋',
          message: 'Paste directly into WhatsApp Web, Telegram, or Twitter composer.',
          type: 'success'
        });
      } else {
        handleCopyText();
      }
    } catch (err) {
      handleCopyText();
    }
  };

  // 4. Copy Formatted Text to Clipboard
  const handleCopyText = () => {
    const { text } = generateShareText(stats);
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
    addToast({
      title: 'Text Copied to Clipboard! 📋',
      message: 'Impact text summary copied. Ready to paste in any app.',
      type: 'success'
    });
  };

  // 5. WhatsApp Direct Share
  const handleWhatsAppShare = () => {
    const { text, url } = generateShareText(stats);
    const fullText = `${text}\n\n👉 Join me on EcoSort Ghana: ${url}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
    window.open(waUrl, '_blank');
  };

  // 6. X / Twitter Direct Share
  const handleTwitterShare = () => {
    const tweetText = `🌿 Proud to sort and recycle with @EcoSortGhana! I've diverted ${stats.totalWasteKg}kg of waste, earned ${stats.ecoPoints} EcoPoints (GH₵ ${stats.momoGhs.toFixed(2)} MoMo) and offset ${stats.co2OffsetKg}kg of CO₂ in ${stats.community}! 🇬🇭♻️ #EcoSortGhana #CleanGhana #CircularEconomy`;
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.origin || 'https://ecosort.gh')}`;
    window.open(twUrl, '_blank');
  };

  // 7. LinkedIn Direct Share
  const handleLinkedInShare = () => {
    const lnUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin || 'https://ecosort.gh')}`;
    window.open(lnUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Share My Impact Card
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Web Share API
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generate an official high-res circular milestone graphic to inspire your community.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Column Grid (Left: Preview, Right: Controls & Share Options) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 overflow-y-auto">
          
          {/* Left Column: Live Canvas Card Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950/50 rounded-2xl p-4 border border-slate-800 relative">
            
            {/* Aspect Ratio & Theme Badge Indicator */}
            <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                Live Card Preview ({format === 'POST_SQUARE' ? '1:1 Square' : format === 'STORY_PORTRAIT' ? '9:16 Story' : '16:9 Banner'})
              </span>
              <span className="font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
                Retina High-DPI
              </span>
            </div>

            {/* Preview Image Container */}
            <div className="relative w-full max-w-sm sm:max-w-md flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 bg-black/40">
              {isGenerating && (
                <div className="absolute inset-0 z-10 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center gap-2 text-white text-xs font-semibold">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  Generating High-Res Canvas...
                </div>
              )}

              {previewDataUrl ? (
                <img 
                  src={previewDataUrl} 
                  alt="EcoSort Impact Summary Card" 
                  className={`w-full object-contain transition-all duration-300 ${
                    format === 'STORY_PORTRAIT' ? 'max-h-[380px]' : format === 'LANDSCAPE_BANNER' ? 'max-h-[220px]' : 'max-h-[320px]'
                  }`}
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
                  Loading Card Preview...
                </div>
              )}
            </div>

            {/* Quick Card Stats Pill bar */}
            <div className="w-full grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2">
                <span className="text-[10px] text-slate-400 block">Diverted</span>
                <span className="text-xs font-black text-emerald-400">{stats.totalWasteKg} kg</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2">
                <span className="text-[10px] text-slate-400 block">EcoPoints</span>
                <span className="text-xs font-black text-amber-400">{stats.ecoPoints} Pts</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2">
                <span className="text-[10px] text-slate-400 block">MoMo Value</span>
                <span className="text-xs font-black text-blue-400">GH₵ {stats.momoGhs.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls & Sharing Hub (5 cols) */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
            
            <div className="space-y-4">
              
              {/* 1. Timeframe Picker */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Select Impact Scope
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTimeframe('ALL_TIME')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      timeframe === 'ALL_TIME'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    🌟 All-Time Journey ({currentUser.totalWasteKg} kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeframe('WEEKLY')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      timeframe === 'WEEKLY'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    📅 This Week ({weeklyWasteKg} kg)
                  </button>
                </div>
              </div>

              {/* 2. Card Theme Picker */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-emerald-400" />
                  Theme & Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('EMERALD_GHANA')}
                    className={`p-2.5 rounded-xl text-left border flex items-center gap-2.5 transition-all ${
                      theme === 'EMERALD_GHANA'
                        ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-xs'
                        : 'bg-slate-800/40 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-500 border border-emerald-200 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Emerald Ghana</span>
                      <span className="text-[10px] text-slate-400">Forest & Gold</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('KENTE_GOLD')}
                    className={`p-2.5 rounded-xl text-left border flex items-center gap-2.5 transition-all ${
                      theme === 'KENTE_GOLD'
                        ? 'bg-amber-950/80 border-amber-400 text-white shadow-xs'
                        : 'bg-slate-800/40 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-amber-500 border border-amber-200 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Kente Gold</span>
                      <span className="text-[10px] text-slate-400">Warm Amber Heritage</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('CYBER_DARK')}
                    className={`p-2.5 rounded-xl text-left border flex items-center gap-2.5 transition-all ${
                      theme === 'CYBER_DARK'
                        ? 'bg-blue-950/80 border-blue-400 text-white shadow-xs'
                        : 'bg-slate-800/40 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-blue-500 border border-blue-200 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Cyber Dark</span>
                      <span className="text-[10px] text-slate-400">Midnight & Indigo</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('COASTAL_BLUE')}
                    className={`p-2.5 rounded-xl text-left border flex items-center gap-2.5 transition-all ${
                      theme === 'COASTAL_BLUE'
                        ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-xs'
                        : 'bg-slate-800/40 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-cyan-500 border border-cyan-200 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Coastal Blue</span>
                      <span className="text-[10px] text-slate-400">Clean Ocean Azure</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. Format / Aspect Ratio Picker */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  Card Format & Aspect Ratio
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('POST_SQUARE')}
                    className={`py-2 px-2 rounded-xl text-center border transition-all ${
                      format === 'POST_SQUARE'
                        ? 'bg-blue-600/20 border-blue-400 text-blue-300 shadow-xs'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold block">1:1 Square</span>
                    <span className="text-[9px] text-slate-400">WhatsApp / Feed</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('STORY_PORTRAIT')}
                    className={`py-2 px-2 rounded-xl text-center border transition-all ${
                      format === 'STORY_PORTRAIT'
                        ? 'bg-blue-600/20 border-blue-400 text-blue-300 shadow-xs'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold block">9:16 Story</span>
                    <span className="text-[9px] text-slate-400">Status / TikTok</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('LANDSCAPE_BANNER')}
                    className={`py-2 px-2 rounded-xl text-center border transition-all ${
                      format === 'LANDSCAPE_BANNER'
                        ? 'bg-blue-600/20 border-blue-400 text-blue-300 shadow-xs'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold block">16:9 Banner</span>
                    <span className="text-[9px] text-slate-400">Twitter / Link</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Action Buttons Hub */}
            <div className="space-y-3 pt-2">
              
              {/* PRIMARY WEB SHARE API BUTTON */}
              <button
                type="button"
                onClick={handleWebShare}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Share2 className="w-5 h-5 text-slate-950" />
                <span>Share Card via Web Share API 🚀</span>
              </button>

              {/* Secondary 1-Click Platform Channels */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="py-2.5 px-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  WhatsApp
                </button>

                <button
                  type="button"
                  onClick={handleTwitterShare}
                  className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Twitter className="w-3.5 h-3.5 text-sky-400" />
                  X / Twitter
                </button>

                <button
                  type="button"
                  onClick={handleLinkedInShare}
                  className="py-2.5 px-2 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                  LinkedIn
                </button>
              </div>

              {/* Direct Utilities: Download PNG & Copy Clipboard */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  Download PNG
                </button>

                <button
                  type="button"
                  onClick={handleCopyImage}
                  className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                  {copiedImage ? 'Copied Image!' : 'Copy Image'}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
