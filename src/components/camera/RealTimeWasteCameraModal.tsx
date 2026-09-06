import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Sparkles, 
  X, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Scale, 
  ShieldCheck, 
  Eye, 
  Maximize2,
  Scan,
  Compass,
  Check,
  ChevronRight,
  Info,
  Sliders,
  ArrowRight,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  Play,
  Edit3,
  Video,
  VideoOff,
  SwitchCamera
} from 'lucide-react';
import { WasteClassificationResult, RewardRateRule, WasteCategory, WasteMaterial } from '../../types';
import { WasteClassificationService } from '../../services/wasteClassifier';
import { SAMPLE_WASTE_GALLERY } from '../../data/seedData';
import { haptics } from '../../utils/haptics';

interface RealTimeWasteCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (result: WasteClassificationResult, capturedImageDataUrl: string) => void;
  rewardRules: RewardRateRule[];
}

const CATEGORY_OPTIONS: { category: WasteCategory; label: string; defaultMaterial: WasteMaterial; icon: string }[] = [
  { category: 'PLASTIC', label: 'Plastics & Sachets', defaultMaterial: 'PET Plastic', icon: '🧴' },
  { category: 'METAL', label: 'Aluminum & Tins', defaultMaterial: 'Aluminum Can', icon: '🥫' },
  { category: 'PAPER', label: 'Cardboard & Paper', defaultMaterial: 'Corrugated Paper', icon: '📦' },
  { category: 'GLASS', label: 'Glass Bottles', defaultMaterial: 'Glass Beverage', icon: '🍾' },
  { category: 'E_WASTE', label: 'E-Waste & Scrap', defaultMaterial: 'Electronic Circuit', icon: '🔌' },
  { category: 'ORGANIC', label: 'Organic Compost', defaultMaterial: 'Organic Compost', icon: '🍌' },
];

export const RealTimeWasteCameraModal: React.FC<RealTimeWasteCameraModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
  rewardRules,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<'idle' | 'requesting' | 'active' | 'denied' | 'unsupported' | 'simulated'>('requesting');
  const [cameraErrorMessage, setCameraErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [torchSupported, setTorchSupported] = useState<boolean>(false);
  const [availableVideoDevices, setAvailableVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [simulatedSampleIndex, setSimulatedSampleIndex] = useState<number>(0);

  // Scanning & AI Vision States
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<WasteClassificationResult | null>(null);
  const [liveDetectionTip, setLiveDetectionTip] = useState<string>('Center waste item in optical reticle & tap Snap');
  const [customWeight, setCustomWeight] = useState<number>(0.25);
  const [activeTab, setActiveTab] = useState<'camera' | 'samples' | 'result'>('camera');
  const [customUserHint, setCustomUserHint] = useState<string>('');

  // Stop active hardware video stream tracks safely
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Enumerate available video hardware
  const refreshDevices = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        setAvailableVideoDevices(videoInputs);
      }
    } catch {
      // ignore
    }
  }, []);

  // Robust Device Camera Request with progressive fallback constraints
  const startDeviceCamera = useCallback(async (facing: 'environment' | 'user', specificDeviceId?: string) => {
    setCameraState('requesting');
    setCameraErrorMessage(null);
    stopStream();

    // 1. Check navigator.mediaDevices support
    const mediaDevices = navigator?.mediaDevices || (navigator as any)?.webkitGetUserMedia || (navigator as any)?.mozGetUserMedia ? navigator.mediaDevices : null;
    
    if (!mediaDevices || typeof mediaDevices.getUserMedia !== 'function') {
      // Direct getUserMedia legacy fallback check
      const legacyGetUserMedia = (navigator as any)?.getUserMedia || (navigator as any)?.webkitGetUserMedia || (navigator as any)?.mozGetUserMedia;
      if (!legacyGetUserMedia) {
        console.warn('getUserMedia not supported in this browser context');
        setCameraState('unsupported');
        setCameraErrorMessage('Your browser environment does not support direct media streams.');
        return;
      }
    }

    let activeStream: MediaStream | null = null;
    let lastError: any = null;

    // Constraint tier 1: Explicit Device ID if user selected one
    if (specificDeviceId) {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: specificDeviceId },
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
          },
          audio: false,
        });
      } catch (e) {
        lastError = e;
      }
    }

    // Constraint tier 2: Facing mode ideal (environment for rear camera, user for selfie)
    if (!activeStream) {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
          },
          audio: false,
        });
      } catch (e) {
        lastError = e;
      }
    }

    // Constraint tier 3: Facing mode plain
    if (!activeStream) {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing },
          audio: false,
        });
      } catch (e) {
        lastError = e;
      }
    }

    // Constraint tier 4: Simple generic video constraint (any webcam/sensor)
    if (!activeStream) {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      } catch (e) {
        lastError = e;
      }
    }

    // Process resulting stream
    if (activeStream) {
      streamRef.current = activeStream;
      setStream(activeStream);
      setCameraState('active');

      // Bind to video element if already in DOM
      if (videoRef.current) {
        try {
          videoRef.current.srcObject = activeStream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.setAttribute('autoplay', 'true');
          videoRef.current.muted = true;
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(err => {
              console.log('Video autoplay handled:', err);
            });
          }
        } catch (e) {
          console.warn('Error attaching video stream:', e);
        }
      }

      // Check for torch capability
      try {
        const track = activeStream.getVideoTracks()[0];
        const capabilities = (track && track.getCapabilities ? track.getCapabilities() : {}) as any;
        setTorchSupported(Boolean(capabilities?.torch));
      } catch {
        setTorchSupported(false);
      }

      refreshDevices();
    } else {
      console.warn('Camera stream activation failed:', lastError);
      if (lastError?.name === 'NotAllowedError' || lastError?.name === 'PermissionDeniedError') {
        setCameraState('denied');
        setCameraErrorMessage('Camera permission was blocked by the browser. Click "Allow" in your address bar or use the button below.');
      } else if (lastError?.name === 'NotFoundError' || lastError?.name === 'DevicesNotFoundError') {
        setCameraState('unsupported');
        setCameraErrorMessage('No physical video camera device was found connected.');
      } else {
        setCameraState('unsupported');
        setCameraErrorMessage(lastError?.message || 'Unable to access video stream hardware.');
      }
    }
  }, [stopStream, refreshDevices]);

  // Synchronize stream with video ref whenever component renders
  useEffect(() => {
    if (stream && videoRef.current && videoRef.current.srcObject !== stream) {
      try {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('autoplay', 'true');
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      } catch (e) {
        console.warn('Video ref sync error:', e);
      }
    }
  }, [stream]);

  // Lifecycle on modal open/close
  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setClassificationResult(null);
      setActiveTab('camera');
      startDeviceCamera(facingMode, selectedDeviceId);
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [isOpen, startDeviceCamera, facingMode, selectedDeviceId, stopStream]);

  // Callback ref for resilient video element attachment
  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node && streamRef.current) {
      try {
        node.srcObject = streamRef.current;
        node.setAttribute('playsinline', 'true');
        node.setAttribute('autoplay', 'true');
        node.muted = true;
        node.play().catch(() => {});
      } catch {
        // ignore
      }
    }
  }, []);

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    haptics.light();
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;
    try {
      const newTorchState = !torchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: newTorchState }],
      });
      setTorchOn(newTorchState);
    } catch (err) {
      console.warn('Torch constraint error:', err);
    }
  };

  // Flip Camera (Front / Back)
  const flipCamera = () => {
    haptics.light();
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startDeviceCamera(nextFacing);
  };

  // Capture High-Res Frame from Active Stream or Simulator
  const captureFrame = useCallback((): string | null => {
    if (cameraState === 'simulated') {
      const sample = SAMPLE_WASTE_GALLERY[simulatedSampleIndex % SAMPLE_WASTE_GALLERY.length];
      return sample ? sample.imageUrl : null;
    }

    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.90);
  }, [cameraState, simulatedSampleIndex]);

  // Run AI Classification on captured or provided frame
  const processImageWithAI = async (imageDataUrl: string, sampleHint?: string) => {
    setIsScanning(true);
    setCapturedImage(imageDataUrl);
    setLiveDetectionTip('Gemini Vision AI Analyzing Spectrum & Resin Code...');

    const combinedHint = customUserHint.trim() || sampleHint || '';

    try {
      const result = await WasteClassificationService.classify(imageDataUrl, rewardRules, combinedHint);
      haptics.medium();
      setClassificationResult(result);
      setCustomWeight(result.estimatedWeightKg);
      setActiveTab('result');
      setLiveDetectionTip(`Identified ${result.material} (${result.confidence}% match)`);
    } catch (err) {
      console.error('Classification error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Snapshot trigger button click
  const handleSnapAndClassify = () => {
    haptics.medium();
    const frame = captureFrame();
    if (frame) {
      if (cameraState === 'simulated') {
        const sample = SAMPLE_WASTE_GALLERY[simulatedSampleIndex % SAMPLE_WASTE_GALLERY.length];
        processImageWithAI(frame, sample?.name);
      } else {
        processImageWithAI(frame);
      }
    }
  };

  // Native file upload / camera capture fallback
  const handleNativeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    haptics.medium();
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        processImageWithAI(dataUrl, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  // 1-Click Ghana Sample selection for instant test
  const handleSelectSample = (sample: typeof SAMPLE_WASTE_GALLERY[0]) => {
    haptics.light();
    processImageWithAI(sample.imageUrl, sample.name);
  };

  // Allow user to manually switch/fine-tune classification category on the result card
  const handleManualCategorySwitch = (cat: WasteCategory, mat: WasteMaterial) => {
    haptics.light();
    if (!classificationResult) return;
    const rule = rewardRules.find(r => r.category === cat);
    const pointsPerKg = rule ? rule.pointsPerKg : 10;
    const newPoints = Math.max(1, Math.round(customWeight * pointsPerKg));

    setClassificationResult({
      ...classificationResult,
      category: cat,
      material: mat,
      resinCode: WasteClassificationService.getResinCode(mat, cat),
      epaSortingStandard: WasteClassificationService.getEpaBinStandard(cat),
      handlingInstructions: WasteClassificationService.getHandlingInstructions(cat),
      estimatedPoints: newPoints,
      co2ReductionPerKg: rule ? rule.co2SavingsPerKg : 1.6,
      itemDescription: `Verified ${mat} batch.`,
      confidence: 98.5
    });
  };

  // Accept Result and pass back to parent form
  const handleAcceptResult = () => {
    haptics.success();
    if (classificationResult && capturedImage) {
      const updatedResult: WasteClassificationResult = {
        ...classificationResult,
        estimatedWeightKg: customWeight,
        estimatedPoints: Math.max(
          1,
          Math.round(
            customWeight *
              (rewardRules.find(r => r.category === classificationResult.category)?.pointsPerKg || 10)
          )
        ),
      };
      onSelectResult(updatedResult, capturedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentRule = classificationResult
    ? rewardRules.find(r => r.category === classificationResult.category)
    : null;
  const pointsPerKg = currentRule ? currentRule.pointsPerKg : 10;
  const currentCalculatedPoints = Math.max(1, Math.round(customWeight * pointsPerKg));
  const currentSimSample = SAMPLE_WASTE_GALLERY[simulatedSampleIndex % SAMPLE_WASTE_GALLERY.length];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header HUD */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              cameraState === 'active' 
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
            }`}>
              <Camera className={`w-4 h-4 ${cameraState === 'active' ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Device AI Waste Camera</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                  cameraState === 'active'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                }`}>
                  {cameraState === 'active' ? '● LIVE OPTICAL FEED' : cameraState === 'requesting' ? 'CONNECTING...' : 'CAMERA CONTROL'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {cameraState === 'active' ? 'Hardware Camera Connected • Real-Time AI Sorting' : 'EPA Ghana Optical Recognition System'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('camera')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'camera'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Device Cam
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('samples')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'samples'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ghana Dataset
              </button>
              {classificationResult && (
                <button
                  type="button"
                  onClick={() => setActiveTab('result')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'result'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  AI Result
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: LIVE CAMERA VIEWFINDER */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              
              {/* Optional Item Hint / Descriptor input */}
              <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-1" />
                <input
                  type="text"
                  value={customUserHint}
                  onChange={(e) => setCustomUserHint(e.target.value)}
                  placeholder="Optional item hint (e.g. Voltic bottle, Pure water sachet, Indomie box, Malt can)..."
                  className="bg-transparent text-xs text-white placeholder-slate-500 w-full focus:outline-none"
                />
                {customUserHint && (
                  <button
                    type="button"
                    onClick={() => setCustomUserHint('')}
                    className="text-slate-500 hover:text-white text-xs px-1.5 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Main Viewfinder Canvas / Video View */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-[16/10] max-h-[52vh] flex items-center justify-center border-2 border-slate-800 shadow-2xl">
                
                {/* 1. Real Device Video Stream (Always present in DOM to allow continuous binding) */}
                <video
                  ref={setVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraState === 'active' ? 'block' : 'hidden'}`}
                />

                {/* 2. Permission Requesting Screen */}
                {cameraState === 'requesting' && (
                  <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-white space-y-3 p-6 text-center z-20">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Camera className="w-8 h-8 animate-bounce" />
                    </div>
                    <h4 className="font-bold text-sm text-white">Opening Device Camera...</h4>
                    <p className="text-xs text-slate-300 max-w-sm">
                      Please tap <strong>"Allow"</strong> if prompted by your browser to grant camera permission for optical waste scanning.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => startDeviceCamera(facingMode)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Prompt / Start Camera
                      </button>
                      <button
                        type="button"
                        onClick={() => setCameraState('simulated')}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl cursor-pointer"
                      >
                        Switch to Test Viewfinder
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Permission Denied / Blocked Screen */}
                {(cameraState === 'denied' || cameraState === 'unsupported') && (
                  <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-white space-y-3 p-6 text-center z-20">
                    <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-sm text-white">Camera Access Required</h4>
                    <p className="text-xs text-slate-300 max-w-md">
                      {cameraErrorMessage || 'Camera access was blocked or not detected. You can allow camera access or use photo upload.'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => startDeviceCamera(facingMode)}
                        className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" /> Grant / Turn On Device Camera
                      </button>
                      <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 border border-slate-700 cursor-pointer">
                        <Upload className="w-4 h-4 text-emerald-400" /> Upload from Camera Roll
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleNativeFileUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setCameraState('simulated')}
                        className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-800 text-amber-300 text-xs rounded-xl border border-amber-400/30 cursor-pointer"
                      >
                        Interactive Ghana Scanner
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Simulated Interactive Viewfinder */}
                {cameraState === 'simulated' && (
                  <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
                    <img
                      src={currentSimSample.imageUrl}
                      alt={currentSimSample.name}
                      className="w-full h-full object-cover opacity-90 transition-all duration-300"
                    />
                    
                    <div className="absolute top-4 left-4 z-20 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">Simulated Target</span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-0.5">{currentSimSample.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{currentSimSample.material}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSimulatedSampleIndex(prev => (prev > 0 ? prev - 1 : SAMPLE_WASTE_GALLERY.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700 transition-all shadow-lg cursor-pointer"
                      title="Previous sample"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulatedSampleIndex(prev => (prev + 1) % SAMPLE_WASTE_GALLERY.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700 transition-all shadow-lg cursor-pointer"
                      title="Next sample"
                    >
                      →
                    </button>
                  </div>
                )}
                
                {/* Hidden canvas for taking snapshot frame */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Laser & Reticle AR Overlay for active or simulated view */}
                {(cameraState === 'active' || cameraState === 'simulated') && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-10">
                    
                    {/* Top HUD Indicators */}
                    <div className="flex items-center justify-between">
                      <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-emerald-500/40 text-[11px] font-mono text-emerald-300 flex items-center gap-2 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        {cameraState === 'active' ? 'DEVICE CAMERA ACTIVE' : 'TEST SCANNER ACTIVE'}
                      </div>

                      <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-mono text-slate-300">
                        {cameraState === 'active' 
                          ? facingMode === 'environment' ? 'REAR OPTICAL LENS' : 'FRONT SENSOR'
                          : 'SIMULATED DATASET'}
                      </div>
                    </div>

                    {/* Central Target Reticle Box */}
                    <div className="relative mx-auto w-56 h-56 sm:w-68 sm:h-68 border border-emerald-400/40 rounded-2xl flex items-center justify-center">
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />

                      <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-bounce" />

                      <div className="w-4 h-4 border border-emerald-400/60 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                      </div>

                      {isScanning && (
                        <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white space-y-2 p-3 text-center">
                          <Sparkles className="w-8 h-8 text-emerald-400 animate-spin" />
                          <span className="font-mono text-xs text-emerald-300 font-bold">
                            Gemini Vision Analyzing Resin Profile...
                          </span>
                          <span className="text-[10px] text-slate-300">Classifying material & calculating EcoPoints</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Guidance Prompt */}
                    <div className="text-center">
                      <span className="inline-block bg-slate-950/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-slate-700 text-[11px] font-medium text-emerald-300 shadow-lg">
                        {liveDetectionTip}
                      </span>
                    </div>

                  </div>
                )}

              </div>

              {/* Viewfinder Controls & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  {cameraState === 'active' ? (
                    <>
                      <button
                        type="button"
                        onClick={flipCamera}
                        title="Switch Front/Rear Camera"
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <SwitchCamera className="w-4 h-4 text-emerald-400" />
                        <span className="hidden sm:inline">Flip Camera</span>
                      </button>

                      {torchSupported && (
                        <button
                          type="button"
                          onClick={toggleTorch}
                          title="Toggle Torch/Flash"
                          className={`p-2.5 rounded-xl transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                            torchOn
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          <Zap className="w-4 h-4" />
                          <span className="hidden sm:inline">{torchOn ? 'Torch On' : 'Torch Off'}</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startDeviceCamera(facingMode)}
                      className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Activate Device Cam</span>
                    </button>
                  )}

                  {/* Native Upload / Photo Picker Button */}
                  <label className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline">Photo Upload</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleNativeFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Primary Snap CTA */}
                <button
                  type="button"
                  disabled={isScanning || (cameraState !== 'active' && cameraState !== 'simulated')}
                  onClick={handleSnapAndClassify}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-slate-950" />
                  {isScanning ? 'Analyzing with AI...' : 'Snap & Classify with AI'}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('samples')}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Ghana Dataset</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GHANA REAL-LIFE TEST SAMPLES */}
          {activeTab === 'samples' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Ghana Real-Life Test Dataset (1-Click AI Classification)</h4>
                  <p className="text-xs text-slate-400">
                    Click any Ghanaian item below to run the AI model and test optical categorization instantly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('camera')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" /> Back to Camera
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SAMPLE_WASTE_GALLERY.map(sample => (
                  <button
                    key={sample.id}
                    type="button"
                    disabled={isScanning}
                    onClick={() => handleSelectSample(sample)}
                    className="p-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl text-left transition-all group flex items-center gap-3 relative overflow-hidden shadow-sm cursor-pointer"
                  >
                    <img
                      src={sample.imageUrl}
                      alt={sample.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700 flex-shrink-0 group-hover:scale-105 transition-all"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                          {sample.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{sample.weightKg} kg</span>
                      </div>
                      <h5 className="font-bold text-xs text-white truncate group-hover:text-emerald-400 transition-colors">
                        {sample.name}
                      </h5>
                      <p className="text-[11px] text-slate-400 truncate">{sample.material}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AI CLASSIFICATION RESULT CARD */}
          {activeTab === 'result' && classificationResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Left: Scanned Image Preview */}
                <div className="md:col-span-5 space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 aspect-square flex items-center justify-center shadow-lg">
                    {capturedImage ? (
                      <img
                        src={capturedImage}
                        alt="Captured scan"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-slate-500 text-xs">No image captured</div>
                    )}

                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/40 text-[10px] font-mono text-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      EPA GH AI Verified
                    </div>

                    <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/30 text-emerald-400 font-black text-xs font-mono">
                      {classificationResult.confidence}% Confidence
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('camera');
                      setClassificationResult(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Scan Another Waste Item
                  </button>
                </div>

                {/* Right: AI Intelligence Breakdown & Fast Switcher */}
                <div className="md:col-span-7 space-y-3">
                  
                  {/* Category & Material Banner */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs font-mono uppercase border border-emerald-500/30">
                          {classificationResult.category}
                        </span>
                        {classificationResult.resinCode && (
                          <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-bold text-xs font-mono border border-blue-500/30">
                            Resin {classificationResult.resinCode}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Recyclable Material
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-white">
                      {classificationResult.material}
                    </h3>

                    {classificationResult.itemDescription && (
                      <p className="text-xs text-slate-300">
                        {classificationResult.itemDescription}
                      </p>
                    )}
                  </div>

                  {/* 1-Click Category Override Selector */}
                  <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Confirm or Adjust Category:
                      </span>
                      <span className="text-[10px] text-slate-500">1-click correction</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {CATEGORY_OPTIONS.map((opt) => (
                        <button
                          key={opt.category}
                          type="button"
                          onClick={() => handleManualCategorySwitch(opt.category, opt.defaultMaterial)}
                          className={`p-2 rounded-xl text-left border transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
                            classificationResult.category === opt.category
                              ? 'bg-emerald-600/30 border-emerald-500 text-white font-bold'
                              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-sm">{opt.icon}</span>
                          <span className="truncate text-[11px]">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weight Adjuster & Live Points Calculation */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-emerald-400" />
                        Estimated Batch Weight:
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCustomWeight(prev => Math.max(0.02, Math.round((prev - 0.05) * 100) / 100))}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-500/30">
                          {customWeight} kg
                        </span>
                        <button
                          type="button"
                          onClick={() => setCustomWeight(prev => Math.round((prev + 0.05) * 100) / 100)}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block uppercase">Reward Rate</span>
                        <span className="font-bold text-slate-200">{pointsPerKg} Pts / kg</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-right">
                        <span className="text-[10px] text-slate-400 block uppercase">Reward Earnings</span>
                        <span className="font-black text-emerald-400 text-sm">+{currentCalculatedPoints} EcoPoints</span>
                      </div>
                    </div>
                  </div>

                  {/* EPA Ghana Bin Standard & Handling Instructions */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block font-mono">
                        Ghana EPA Protocol:
                      </span>
                      {classificationResult.epaSortingStandard && (
                        <span className="text-[10px] text-emerald-300 font-mono">
                          {classificationResult.epaSortingStandard}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {classificationResult.handlingInstructions}
                    </p>

                    {/* Detected Features Chips */}
                    {classificationResult.detectedFeatures && classificationResult.detectedFeatures.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                        {classificationResult.detectedFeatures.map((feat, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-900 text-slate-300 text-[10px] px-2 py-0.5 rounded-md border border-slate-800 font-mono"
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Accept & Populate Button */}
              <div className="pt-2 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAcceptResult}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Accept & Use Scan (+{currentCalculatedPoints} Pts)
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
