import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Scale, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Bot, 
  Coins, 
  RotateCcw, 
  AlertCircle,
  FileText,
  Truck,
  Leaf,
  WifiOff,
  Wifi,
  HardDrive,
  Database,
  Crosshair,
  Radio
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { WasteClassificationService } from '../../services/wasteClassifier';
import { WasteClassificationResult } from '../../types';
import { SAMPLE_WASTE_GALLERY } from '../../data/seedData';
import { RealTimeWasteCameraModal } from '../camera/RealTimeWasteCameraModal';
import { CameraPermissionExplanationModal } from '../camera/CameraPermissionExplanationModal';
import { useGpsLocation } from '../../hooks/useGpsLocation';
import { haptics } from '../../utils/haptics';

export const UserUploadEarn: React.FC = () => {
  const { 
    rewardRules, 
    submitWaste, 
    setCurrentView, 
    currentUser, 
    triggerCelebration, 
    addToast,
    effectiveIsOnline,
    pendingOfflineCount,
    setShowOfflineQueueModal,
    setIsSimulatedOffline,
    isSimulatedOffline
  } = useEcoSort();

  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_WASTE_GALLERY[0].imageUrl);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SAMPLE_WASTE_GALLERY[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState<boolean>(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [classification, setClassification] = useState<WasteClassificationResult | null>({
    category: 'PLASTIC',
    material: 'PET Plastic',
    confidence: 98.2,
    recyclable: true,
    estimatedWeightKg: 2.4,
    estimatedPoints: 24,
    handlingInstructions: 'Rinse cleanly, flatten bottle and leave cap attached for optical separation.',
    co2ReductionPerKg: 1.6,
    detectedFeatures: ['Polymer spectrum #1 verified', 'Transparent cylindrical body', 'PET recycling resin code #1'],
    resinCode: '#1 PET',
    cleanlinessRating: 'CLEAN',
    epaSortingStandard: 'Blue Bin (Plastics & Polymers - EPA GH Standard)',
    ghanaLocalContext: 'High demand recycling material across Greater Accra & Tema recycling aggregators.'
  });

  // User input fields
  const [weightKg, setWeightKg] = useState<number>(2.4);
  const [community, setCommunity] = useState<string>(() => currentUser.community || currentUser.location || 'Legon Campus');
  const [pickupAddress, setPickupAddress] = useState<string>(() => currentUser.address || 'Commonwealth Hall, Block B Room 14, University of Ghana');
  const [pickupTime, setPickupTime] = useState<string>('Today, 2:00 PM - 4:00 PM');
  const [notes, setNotes] = useState<string>('Collected from clean sorted batch.');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string>('');

  // Real-time GPS location with IndexedDB offline fallback
  const { coords: userGpsCoords, telemetry: gpsTelemetry, requestCurrentLocation } = useGpsLocation();

  const handleAutofillGpsLocation = async () => {
    haptics.light();
    const loc = await requestCurrentLocation();
    if (loc) {
      haptics.medium();
      if (gpsTelemetry.closestZoneName.includes('Legon')) {
        setCommunity('Legon Campus');
      } else if (gpsTelemetry.closestZoneName.includes('Madina')) {
        setCommunity('Madina Market');
      } else if (gpsTelemetry.closestZoneName.includes('East Legon')) {
        setCommunity('East Legon');
      } else if (gpsTelemetry.closestZoneName.includes('Osu')) {
        setCommunity('Osu');
      } else if (gpsTelemetry.closestZoneName.includes('KNUST')) {
        setCommunity('KNUST Campus');
      }

      setPickupAddress(`${gpsTelemetry.closestZoneName} (GPS: ${loc.latitude.toFixed(4)}°N, ${loc.longitude.toFixed(4)}°W ±${loc.accuracyMeters}m)`);
      addToast({
        title: 'GPS Location Tagged 📍',
        message: `Pickup pinned at ${gpsTelemetry.closestZoneName} with ${loc.accuracyMeters}m precision.`,
        type: 'success'
      });
    }
  };

  // Calculate live points based on current weight and rule rate
  const currentRule = classification ? rewardRules.find(r => r.category === classification.category) : null;
  const pointsPerKg = currentRule ? currentRule.pointsPerKg : 10;
  const estimatedPoints = Math.max(1, Math.round(weightKg * pointsPerKg));

  const handleCameraScanSelect = (result: WasteClassificationResult, imageDataUrl: string) => {
    haptics.success();
    setSelectedImage(imageDataUrl);
    setSelectedSampleId('');
    setClassification(result);
    setWeightKg(result.estimatedWeightKg);

    addToast({
      title: `AI Camera: ${result.material} Identified! 📸`,
      message: `${result.confidence}% match (${result.resinCode || result.category}). Estimated: +${result.estimatedPoints} EcoPoints.`,
      type: 'success',
      duration: 4000
    });
  };

  const handleSelectSample = async (sampleId: string) => {
    haptics.light();
    setSelectedSampleId(sampleId);
    const sample = SAMPLE_WASTE_GALLERY.find(s => s.id === sampleId);
    if (!sample) return;

    setSelectedImage(sample.imageUrl);
    setIsAnalyzing(true);
    
    addToast({
      title: 'AI Optical Vision Initialized 👁️',
      message: `Analyzing resin profile for "${sample.name}"...`,
      type: 'info',
      duration: 2200
    });

    const result = await WasteClassificationService.classify(sample.imageUrl, rewardRules, sample.name);
    haptics.medium();
    setClassification(result);
    setWeightKg(result.estimatedWeightKg);
    setIsAnalyzing(false);

    addToast({
      title: `${result.confidence}% Match: ${result.material}`,
      message: `Categorized under ${result.category}. Estimated reward: +${result.estimatedPoints} EcoPoints.`,
      type: 'success',
      duration: 3500
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    haptics.medium();
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedImage(dataUrl);
      setSelectedSampleId('');
      setIsAnalyzing(true);

      addToast({
        title: 'Analyzing Uploaded Photo 📸',
        message: `Running Gemini optical classification on ${file.name}...`,
        type: 'info',
        duration: 2500
      });

      const result = await WasteClassificationService.classify(dataUrl, rewardRules, file.name);
      haptics.medium();
      setClassification(result);
      setWeightKg(result.estimatedWeightKg);
      setIsAnalyzing(false);

      addToast({
        title: `AI Classification Ready: ${result.material}`,
        message: `${result.confidence}% confidence. Recyclable: ${result.recyclable ? 'Yes ✅' : 'No ❌'}.`,
        type: 'success',
        duration: 3500
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classification) return;

    haptics.submitWaste();

    const created = submitWaste({
      imageUrl: selectedImage,
      classification: {
        ...classification,
        estimatedWeightKg: weightKg,
        estimatedPoints,
      },
      userWeightEstimateKg: weightKg,
      pickupAddress,
      community,
      preferredPickupTime: pickupTime,
      notes,
    });

    setLastSubmittedId(created.id);
    setIsSubmitted(true);
    triggerCelebration();
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    handleSelectSample(SAMPLE_WASTE_GALLERY[0].id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-400/30">
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              AI Optical Classification & Smart Dispatch
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Upload Waste & Earn EcoPoints
            </h1>
            <p className="text-emerald-200/80 text-sm mt-1">
              Snap a photo of your recyclables. Our AI identifies material resin and dispatches a collection agent.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-950/80 border border-emerald-500/30 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg">
                ₵
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 block font-bold uppercase">Your Balance</span>
                <span className="text-lg font-bold text-white">{currentUser.ecoPoints} EcoPoints</span>
              </div>
            </div>

            {pendingOfflineCount > 0 && (
              <button
                type="button"
                onClick={() => setShowOfflineQueueModal(true)}
                className="px-3.5 py-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 hover:bg-amber-500/30 text-amber-200 text-xs font-bold flex flex-col items-center justify-center transition-all"
              >
                <div className="flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                    {pendingOfflineCount}
                  </span>
                </div>
                <span className="text-[10px] mt-0.5 text-amber-300">Offline Queue</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Offline Storage Notice */}
      {!effectiveIsOnline && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold">Offline Mode Active — Local Storage Enabled</h4>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                Your photo & weight records will be encrypted into device IndexedDB and dispatched to EPA Ghana once reconnected.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowOfflineQueueModal(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-xs font-bold text-amber-900 dark:text-amber-200 border border-amber-400/30 flex-shrink-0"
          >
            Queue Manager ({pendingOfflineCount})
          </button>
        </div>
      )}

      {isSubmitted ? (
        /* Submission Success Screen */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-emerald-500/40 shadow-xl text-center space-y-6">
          <div className={`w-20 h-20 ${effectiveIsOnline ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
            {effectiveIsOnline ? <CheckCircle2 className="w-10 h-10" /> : <HardDrive className="w-10 h-10" />}
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {effectiveIsOnline ? 'Collection Request Dispatched! 🚀' : 'Cached in Offline Storage! 📦'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {effectiveIsOnline ? (
                <>
                  Your <span className="font-bold text-slate-800 dark:text-slate-200">{weightKg} kg</span> of{' '}
                  <span className="font-bold text-emerald-600">{classification?.material}</span> in{' '}
                  <span className="font-bold text-slate-800 dark:text-slate-200">{community}</span> has been broadcast to nearby collection agents.
                </>
              ) : (
                <>
                  Your <span className="font-bold text-slate-800 dark:text-slate-200">{weightKg} kg</span> of{' '}
                  <span className="font-bold text-amber-600 dark:text-amber-400">{classification?.material}</span> has been securely stored in IndexedDB on this device. It will automatically upload to the EPA Ghana Node when you reconnect.
                </>
              )}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto grid grid-cols-2 gap-3 text-left text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Estimated Reward</span>
              <span className="font-bold text-emerald-600 text-base">+{estimatedPoints} EcoPoints</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Scheduled Time</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{pickupTime}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Pickup Address</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{pickupAddress}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentView('user-dashboard')}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
            {!effectiveIsOnline && (
              <button
                onClick={() => setShowOfflineQueueModal(true)}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
              >
                <Database className="w-4 h-4" />
                View Offline Queue
              </button>
            )}
            <button
              onClick={() => setCurrentView('collector-app')}
              className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <Truck className="w-4 h-4" />
              Switch to Agent View
            </button>
            <button
              onClick={handleResetForm}
              className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
            >
              Submit Another Batch
            </button>
          </div>
        </div>
      ) : (
        /* Main Submission Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Camera / Image Upload & Preset Test Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-500" /> Step 1: Capture or Scan Waste
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                  Gemini 3.7 Vision Core
                </span>
              </div>

              {/* Main Image Preview Box */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-950 h-64 flex items-center justify-center group shadow-inner">
                <img 
                  src={selectedImage} 
                  alt="Waste item preview" 
                  className="w-full h-full object-cover"
                />

                {/* Overlay Laser Scan HUD effect */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                    <Sparkles className="w-8 h-8 text-emerald-400 animate-spin" />
                    <span className="font-mono text-xs text-emerald-300 font-bold animate-pulse">
                      Optical Spectral AI Analyzing...
                    </span>
                  </div>
                )}

                {/* Live Camera Launch & Upload Action Bar */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCameraModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl backdrop-blur-md border border-emerald-400/50 cursor-pointer flex items-center gap-1.5 shadow-xl transition-all transform active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Open Real-Time AI Camera
                  </button>

                  <label className="bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl backdrop-blur-md border border-white/20 cursor-pointer flex items-center gap-1.5 shadow-lg transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    Upload File
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Quick Pick Samples for Instant Testing during presentation */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Ghana Real-Life Test Samples (1-Click Test):
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCameraModalOpen(true)}
                    className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    Live Cam Scanner →
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_WASTE_GALLERY.map(sample => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample.id)}
                      className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                        selectedSampleId === sample.id
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <img src={sample.imageUrl} alt={sample.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div className="truncate">
                        <span className="font-bold text-[10px] text-slate-800 dark:text-slate-200 block truncate">{sample.name.split(' ')[0]}</span>
                        <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-semibold">{sample.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Classification Insights Card */}
            {classification && (
              <div className="bg-slate-950 text-white rounded-3xl p-6 border border-emerald-500/30 shadow-xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Optical Classification HUD
                  </span>
                  <div className="flex items-center gap-2">
                    {classification.resinCode && (
                      <span className="text-blue-300 font-bold text-[10px] bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30">
                        {classification.resinCode}
                      </span>
                    )}
                    <span className="text-emerald-400 font-bold text-xs bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      {classification.confidence}% Match
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block uppercase">Category</span>
                    <span className="font-bold text-blue-400 text-xs">{classification.category}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block uppercase">Material</span>
                    <span className="font-bold text-white text-xs">{classification.material}</span>
                  </div>
                </div>

                {classification.epaSortingStandard && (
                  <div className="bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/30 text-[10px] text-emerald-300">
                    <span className="font-bold uppercase text-[9px] block text-emerald-400">EPA GH Bin Standard:</span>
                    {classification.epaSortingStandard}
                  </div>
                )}

                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-[10px] font-sans text-slate-300">
                  <span className="font-bold text-emerald-400 block font-mono uppercase text-[9px] mb-1">Handling Protocol:</span>
                  {classification.handlingInstructions}
                </div>

                {classification.detectedFeatures && classification.detectedFeatures.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1">
                    {classification.detectedFeatures.slice(0, 3).map((feat, idx) => (
                      <span key={idx} className="bg-slate-900 text-slate-400 text-[9px] px-2 py-0.5 rounded border border-slate-800 font-mono">
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Quantity Estimator & Doorstep Collection Dispatch Form */}
          <div className="lg:col-span-6">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-500" /> Step 2: Weight & Pickup Details
                </span>
                <span className="text-[10px] text-slate-400">Step 2 of 2</span>
              </div>

              {/* Weight Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Estimated Batch Weight (kg)
                  </label>
                  <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {weightKg} kg
                  </span>
                </div>

                <input 
                  type="range" 
                  min="0.1" 
                  max="30" 
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.1 kg (Small)</span>
                  <span>10 kg (Bag)</span>
                  <span>30 kg (Bulk)</span>
                </div>
              </div>

              {/* Estimated Reward Preview Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-slate-900 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Estimated EcoPoints to Earn:
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Rate: {pointsPerKg} pts/kg × {weightKg} kg
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    +{estimatedPoints}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 block">
                    EcoPoints 🌿
                  </span>
                </div>
              </div>

              {/* Community Location Selection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Community / Campus Area
                  </label>
                  <button
                    type="button"
                    onClick={handleAutofillGpsLocation}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                  >
                    <Crosshair className="w-3 h-3 text-emerald-500" />
                    Auto-Tag GPS
                  </button>
                </div>
                <select 
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Legon Campus">University of Ghana (Legon Campus)</option>
                  <option value="Abeka Community">Abeka Community / Lapaz</option>
                  <option value="Madina Market">Madina Market Zone</option>
                  <option value="East Legon">East Legon / American House</option>
                  <option value="Osu">Osu Oxford Street Area</option>
                  <option value="KNUST Campus">KNUST Campus (Kumasi)</option>
                  <option value="UCC Campus">UCC Old/New Site (Cape Coast)</option>
                  <option value="Kejetia Market">Kejetia Central (Kumasi)</option>
                </select>
              </div>

              {/* Pickup Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Exact Pickup Spot / Dorm / Landmark
                </label>
                <input 
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="e.g. Commonwealth Hall Block B, Legon"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Preferred Collection Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Preferred Pickup Window
                </label>
                <input 
                  type="text"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  placeholder="e.g. Today, 2:00 PM - 4:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Notes for Collection Agent (Optional)
                </label>
                <input 
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Pre-bagged plastic bottles"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 ${
                  effectiveIsOnline
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20'
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-600/20'
                }`}
              >
                {effectiveIsOnline ? (
                  <>
                    <Truck className="w-4 h-4" />
                    Submit & Request Collection Agent (+{estimatedPoints} Pts)
                  </>
                ) : (
                  <>
                    <HardDrive className="w-4 h-4" />
                    Save & Queue Offline (+{estimatedPoints} Pts)
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      )}

      {/* Camera Permission Explanation Modal */}
      <CameraPermissionExplanationModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        onGrantAccess={() => {
          setIsPermissionModalOpen(false);
          setIsCameraModalOpen(true);
        }}
        onUsePresetsInstead={() => {
          setIsPermissionModalOpen(false);
          // Highlight samples area
        }}
      />

      {/* Real-Time AI Camera Modal */}
      <RealTimeWasteCameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onSelectResult={handleCameraScanSelect}
        rewardRules={rewardRules}
      />
    </div>
  );
};
