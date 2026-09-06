import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Scale, 
  Camera, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  Navigation,
  Radio
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { CollectionJob, WasteClassificationResult } from '../../types';
import { RealTimeWasteCameraModal } from '../camera/RealTimeWasteCameraModal';
import { CameraPermissionExplanationModal } from '../camera/CameraPermissionExplanationModal';
import { EcosystemRoleSwitcher } from '../dashboard/EcosystemRoleSwitcher';
import { CollectorGpsRouteMap } from './CollectorGpsRouteMap';
import { haptics } from '../../utils/haptics';

export const CollectorAppView: React.FC = () => {
  const { 
    collectionJobs, 
    acceptJob, 
    verifyAndCollectJob, 
    currentUser, 
    rewardRules,
    addToast
  } = useEcoSort();

  const [activeTab, setActiveTab] = useState<'GPS_MAP' | 'NEW' | 'ACCEPTED' | 'COMPLETED'>('GPS_MAP');
  const [selectedJobForVerification, setSelectedJobForVerification] = useState<CollectionJob | null>(null);
  const [isAgentPermissionModalOpen, setIsAgentPermissionModalOpen] = useState<boolean>(false);
  const [isAgentCameraOpen, setIsAgentCameraOpen] = useState<boolean>(false);
  
  // Verification modal state
  const [actualWeightKg, setActualWeightKg] = useState<number>(0);
  const [verificationNotes, setVerificationNotes] = useState<string>('Certified scale verified. Clean sorted batch.');
  const [verificationPhoto, setVerificationPhoto] = useState<string>('');

  const newJobs = collectionJobs.filter(j => j.status === 'REQUESTED');
  const acceptedJobs = collectionJobs.filter(j => j.status === 'ACCEPTED' || j.status === 'EN_ROUTE');
  const completedJobs = collectionJobs.filter(j => j.status === 'POINTS_AWARDED' || j.status === 'VERIFIED');

  const handleAcceptJobWithToast = (job: CollectionJob) => {
    haptics.medium();
    acceptJob(job.id);
    addToast({
      title: 'Pickup Route Accepted 🛵',
      message: `Navigating to ${job.location} (${job.estimatedWeightKg} kg ${job.material}).`,
      type: 'info',
      duration: 3500
    });
    setActiveTab('ACCEPTED');
  };

  const handleOpenVerification = (job: CollectionJob) => {
    haptics.light();
    setSelectedJobForVerification(job);
    setActualWeightKg(job.estimatedWeightKg);
    setVerificationPhoto(job.photoUrl);
  };

  const handleConfirmVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForVerification) return;

    haptics.collectionConfirmed();

    verifyAndCollectJob(
      selectedJobForVerification.id,
      actualWeightKg,
      verificationNotes,
      verificationPhoto
    );

    setSelectedJobForVerification(null);
  };

  const getJobCategoryColor = (cat: string) => {
    switch (cat) {
      case 'PLASTIC': return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200';
      case 'METAL': return 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200';
      case 'PAPER': return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200';
      case 'GLASS': return 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border-cyan-200';
      case 'E_WASTE': return 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Ecosystem Role Switcher Banner */}
      <EcosystemRoleSwitcher />

      {/* Agent Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-400/30">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              EcoSort Field Agent • Logistics & Verification Portal
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Collection Operations & Weight Verification
            </h1>
            <p className="text-amber-200/80 text-sm mt-1">
              Active Agent: <span className="font-bold text-white">{currentUser.name}</span> • Fleet Zone: <span className="font-bold text-amber-400">{currentUser.location || 'Madina & Legon'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Pending Pickups</span>
              <span className="text-xl font-bold text-amber-400">{newJobs.length + acceptedJobs.length}</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Completed</span>
              <span className="text-xl font-bold text-emerald-400">{completedJobs.length}</span>
            </div>
          </div>
        </div>

        {/* Operational Agent Telemetry Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase">Today's Route Haul</span>
            <span className="text-base font-black text-amber-400 font-mono">342.5 kg</span>
            <span className="text-[9px] text-slate-500 block">Target: 400 kg</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase">Agent Commission</span>
            <span className="text-base font-black text-emerald-400 font-mono">GH₵ 171.25</span>
            <span className="text-[9px] text-slate-500 block">MoMo auto-payout</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase">Scale Verification</span>
            <span className="text-base font-black text-teal-400 font-mono">99.4%</span>
            <span className="text-[9px] text-slate-500 block">Digital tare certified</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase">Tricycle Battery</span>
            <span className="text-base font-black text-cyan-400 font-mono">78% • 34km</span>
            <span className="text-[9px] text-slate-500 block">EcoBike Fleet #04</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 flex-wrap">
          <button
            onClick={() => setActiveTab('GPS_MAP')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'GPS_MAP'
                ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            GPS Fleet Radar ({newJobs.length + acceptedJobs.length})
          </button>

          <button
            onClick={() => setActiveTab('NEW')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'NEW'
                ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Available Jobs ({newJobs.length})
          </button>
          
          <button
            onClick={() => setActiveTab('ACCEPTED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ACCEPTED'
                ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            My Active Route ({acceptedJobs.length})
          </button>

          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'COMPLETED'
                ? 'bg-emerald-500 text-slate-950 shadow-lg font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Verified History ({completedJobs.length})
          </button>
        </div>
      </div>

      {/* GPS Route Map View */}
      {activeTab === 'GPS_MAP' && (
        <CollectorGpsRouteMap
          jobs={[...acceptedJobs, ...newJobs]}
          onAcceptJob={handleAcceptJobWithToast}
          onOpenVerification={handleOpenVerification}
        />
      )}

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeTab === 'NEW' && newJobs.map(job => (
          <div key={job.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getJobCategoryColor(job.wasteCategory)}`}>
                  {job.wasteCategory} • {job.material}
                </span>
                <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                  {job.distanceKm} km away
                </span>
              </div>

              <div className="flex items-start gap-3">
                <img src={job.photoUrl} alt="waste" className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{job.community}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{job.location}</p>
                  <span className="text-xs font-bold text-emerald-600 block mt-1">Est. {job.estimatedWeightKg} kg</span>
                </div>
              </div>

              {job.notes && (
                <div className="mt-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Note:</span> {job.notes}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {job.scheduledTime}
              </span>
              <button
                onClick={() => handleAcceptJobWithToast(job)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" /> Accept Job
              </button>
            </div>
          </div>
        ))}

        {activeTab === 'ACCEPTED' && acceptedJobs.map(job => (
          <div key={job.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border-2 border-amber-500/50 shadow-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getJobCategoryColor(job.wasteCategory)}`}>
                  {job.wasteCategory} • {job.material}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-bold text-[10px] uppercase">
                  In Progress
                </span>
              </div>

              <div className="flex items-start gap-3">
                <img src={job.photoUrl} alt="waste" className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{job.userName}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{job.location}</p>
                  <a href={`tel:${job.userPhone}`} className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
                    <Phone className="w-3 h-3" /> {job.userPhone}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Est. {job.estimatedWeightKg} kg
              </span>
              <button
                onClick={() => handleOpenVerification(job)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Scale className="w-3.5 h-3.5" /> Verify & Weigh
              </button>
            </div>
          </div>
        ))}

        {activeTab === 'COMPLETED' && completedJobs.map(job => (
          <div key={job.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm opacity-90 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getJobCategoryColor(job.wasteCategory)}`}>
                {job.wasteCategory}
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">{job.community}</span>
                <span className="text-slate-400 text-[10px]">{job.material}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 dark:text-white text-sm block">{job.actualWeightKg || job.estimatedWeightKg} kg</span>
                <span className="text-emerald-600 text-[10px] font-bold">Points Issued</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Verification & Weighing Modal Simulator */}
      {selectedJobForVerification && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Field Weight Verification</h3>
                  <span className="text-[10px] text-slate-400">Citizen: {selectedJobForVerification.userName}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedJobForVerification(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmVerification} className="space-y-4">
              
              {/* Actual Scale Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Certified Hanging Scale Weight (kg)
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    step="0.05"
                    min="0.05"
                    value={actualWeightKg}
                    onChange={(e) => setActualWeightKg(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full pl-3.5 pr-12 py-3 rounded-xl border-2 border-emerald-500 bg-slate-50 dark:bg-slate-950 text-base font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                    KG
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Original citizen estimate was {selectedJobForVerification.estimatedWeightKg} kg.
                </span>
              </div>

              {/* Live EcoPoints Reward Calculation */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Points to Award Citizen:
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Category: {selectedJobForVerification.wasteCategory} (10 pts/kg)
                  </span>
                </div>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  +{Math.max(1, Math.round(actualWeightKg * 10))} EcoPoints
                </span>
              </div>

              {/* Field Verification Inspection Photo & AI Camera Audit */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Field Inspection Photo
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAgentPermissionModalOpen(true)}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" /> Launch AI Camera Audit
                  </button>
                </div>

                {verificationPhoto && (
                  <div className="h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center relative">
                    <img src={verificationPhoto} alt="Verification" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-2 bg-slate-900/80 text-[10px] text-emerald-400 px-2 py-0.5 rounded font-mono">
                      AI Verified
                    </span>
                  </div>
                )}
              </div>

              {/* Inspection Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Field Quality Inspection Notes
                </label>
                <input 
                  type="text"
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJobForVerification(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Weight & Award Points
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Collector Camera Permission Explanation Modal */}
      <CameraPermissionExplanationModal
        isOpen={isAgentPermissionModalOpen}
        onClose={() => setIsAgentPermissionModalOpen(false)}
        onGrantAccess={() => {
          setIsAgentPermissionModalOpen(false);
          setIsAgentCameraOpen(true);
        }}
      />

      {/* Collector Real-Time AI Camera Modal */}
      <RealTimeWasteCameraModal
        isOpen={isAgentCameraOpen}
        onClose={() => setIsAgentCameraOpen(false)}
        onSelectResult={(result, imgUrl) => {
          setVerificationPhoto(imgUrl);
          setActualWeightKg(result.estimatedWeightKg);
          setVerificationNotes(`AI Verified ${result.material} (${result.resinCode || result.category}). ${result.confidence}% confidence. Purity: Clean.`);
          addToast({
            title: `AI Audit: ${result.material} Verified! 🔍`,
            message: `Optical match ${result.confidence}%. Weight calibrated to ${result.estimatedWeightKg} kg.`,
            type: 'success',
            duration: 3500
          });
        }}
        rewardRules={rewardRules}
      />
    </div>
  );
};
