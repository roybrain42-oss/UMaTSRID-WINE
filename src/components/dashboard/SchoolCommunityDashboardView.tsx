import React, { useState } from 'react';
import {
  School,
  Users,
  Coins,
  Scale,
  TrendingUp,
  Award,
  Calendar,
  Truck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Download,
  PlusCircle,
  FileCheck,
  Building2,
  Trash2,
  Radio,
  Zap,
  Clock,
  ShieldCheck,
  HeartHandshake,
  Share2,
  MapPin
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { EcosystemRoleSwitcher } from './EcosystemRoleSwitcher';
import { NearbyDropOffMap } from '../user/NearbyDropOffMap';

export const SchoolCommunityDashboardView: React.FC = () => {
  const { 
    currentUser, 
    ecoPointsPerGhs, 
    submissions, 
    triggerCelebration,
    openShareImpactModal,
    addToast
  } = useEcoSort();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'INTER_HOUSE' | 'SMART_BINS' | 'BULK_SCHEDULE' | 'DROP_OFF_MAP'>('OVERVIEW');
  const [isSchedulingBulk, setIsSchedulingBulk] = useState<boolean>(false);
  const [bulkEstKg, setBulkEstKg] = useState<number>(350);
  const [bulkMaterialType, setBulkMaterialType] = useState<string>('Pure Water Sachets & PET Bottles');

  const institutionName = currentUser.institutionName || 'Achimota Senior High School';
  const memberCount = currentUser.memberCount || 1420;
  const treasuryGhs = (currentUser.ecoPoints / ecoPointsPerGhs).toFixed(2);

  // Simulated Inter-House Campus Tournament
  const houseLeaderboard = [
    { rank: 1, name: 'Livingstone House 🏆', kg: 420.5, points: 4205, activeStudents: 310, leadClass: 'Form 3 Science 1' },
    { rank: 2, name: 'Aggrey House 🥈', kg: 345.0, points: 3450, activeStudents: 285, leadClass: 'Form 2 Arts 2' },
    { rank: 3, name: 'Gyamfi House 🥉', kg: 290.0, points: 2900, activeStudents: 240, leadClass: 'Form 1 Business' },
    { rank: 4, name: 'Kingsley House', kg: 189.5, points: 1895, activeStudents: 180, leadClass: 'Form 3 Visual Arts' },
  ];

  // Simulated Smart Bin Telemetry on Campus
  const campusSmartBins = [
    { id: 'bin-01', location: 'Science Block Quadrangle', category: 'PLASTIC (PET & Sachet)', fillPercent: 94, status: 'NEEDS_EMPTYING', battery: '92%' },
    { id: 'bin-02', location: 'Dining Hall Entrance', category: 'PLASTIC (Pure Water LDPE)', fillPercent: 82, status: 'HIGH', battery: '88%' },
    { id: 'bin-03', location: 'Administration Block', category: 'PAPER & CARDBOARD', fillPercent: 35, status: 'NORMAL', battery: '95%' },
    { id: 'bin-04', location: 'Sports Complex & Canteen', category: 'METALS (Aluminum Cans)', fillPercent: 68, status: 'NORMAL', battery: '81%' },
  ];

  const handleBookBulkPickup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSchedulingBulk(false);
    triggerCelebration();
    addToast({
      title: 'Bulk Campus Dispatch Booked! 🚛',
      message: `Tricycle Fleet scheduled for ${institutionName} (${bulkEstKg}kg ${bulkMaterialType}).`,
      type: 'success',
      duration: 5000,
    });
  };

  const handleDownloadCertificate = () => {
    triggerCelebration();
    addToast({
      title: 'EPA Ghana Green Campus Certificate Generated 📜',
      message: `${institutionName} Level-1 Circular School Accreditation Certificate saved.`,
      type: 'success',
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Ecosystem Role Switcher Banner */}
      <EcosystemRoleSwitcher />

      {/* Campus / Community Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 md:p-8 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-400/30">
              <School className="w-3.5 h-3.5 text-emerald-400" />
              Ghana Green Schools & Community Initiative • EPA Accredited
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {institutionName} Campus Eco-Hub
            </h1>
            <p className="text-emerald-200/80 text-xs sm:text-sm max-w-2xl">
              Coordinating <strong className="text-white">{memberCount.toLocaleString()} students & staff</strong> in institutional waste segregation, inter-house plastic recovery tournaments, and solar garden treasury funding.
            </p>
          </div>

          {/* Treasury Card */}
          <div className="bg-slate-900/90 border border-emerald-500/40 p-5 rounded-2xl flex flex-col justify-between min-w-[240px] space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase">
              <span>Campus Treasury Fund</span>
              <Coins className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              GH₵ {treasuryGhs}
            </div>
            <span className="text-[11px] text-slate-300">
              {currentUser.ecoPoints.toLocaleString()} Group EcoPoints
            </span>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-bold">Target Project:</span>
              <span className="text-white font-medium">Campus Solar Lab #2</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Community Master KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Campus Waste Diverted</span>
            <Scale className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {currentUser.totalWasteKg.toLocaleString()} <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> ~1.25 Metric Tonnes
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Student Participation</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            84.6% <span className="text-xs font-normal text-slate-500">active</span>
          </div>
          <span className="text-[11px] text-slate-500">
            1,202 / {memberCount} students logging
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Sorting Purity Grade</span>
            <ShieldCheck className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
            97.9% <span className="text-xs font-normal text-slate-500">A+</span>
          </div>
          <span className="text-[11px] text-teal-600 font-medium">
            2.1% low contamination rate
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>National School Rank</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            #2 <span className="text-xs font-normal text-slate-500">in Greater Accra</span>
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            Behind Presec Legon (+45kg gap)
          </span>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'OVERVIEW'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Campus Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('INTER_HOUSE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'INTER_HOUSE'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Inter-House Tournament</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SMART_BINS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'SMART_BINS'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <span>Smart Bin Sensors ({campusSmartBins.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('BULK_SCHEDULE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'BULK_SCHEDULE'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Bulk Pickup Dispatch</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('DROP_OFF_MAP')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'DROP_OFF_MAP'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Nearby Drop-Off Map</span>
        </button>
      </div>

      {/* Tab Content 1: Campus Overview & Action Tools */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Institutional Progress & Clean-up Drives */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Active Campus Sustainability Projects & Drives
                </h3>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Term 2 Drive Active
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        "Zero-Sachet Wednesday" Pure Water Bag Recovery
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Every Wednesday, all dining hall and canteen LDPE sachets are rinsed and baled for recycling.
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block font-mono">
                      680 kg recovered
                    </span>
                    <span className="text-[10px] text-slate-400">85% of Term Goal</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        PET Bottle Library & Exam Hall Clean-up
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Targeted recovery of transparent Verna & Bel-Aqua #1 PET bottles during mock exam weeks.
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block font-mono">
                      390 kg recovered
                    </span>
                    <span className="text-[10px] text-slate-400">92% of Term Goal</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('BULK_SCHEDULE')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <Truck className="w-4 h-4" />
                  Schedule Bulk Campus Pickup
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCertificate}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4 text-emerald-500" />
                  EPA Accreditation Certificate (PDF)
                </button>

                <button
                  type="button"
                  onClick={() => openShareImpactModal()}
                  className="px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share Campus Impact
                </button>
              </div>
            </div>

          </div>

          {/* Right Col: Smart Bin Status & Quick Dispatch */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-emerald-500" />
                  Smart Bins Telemetry
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Live IoT</span>
              </div>

              <div className="space-y-3">
                {campusSmartBins.map(bin => (
                  <div 
                    key={bin.id}
                    className={`p-3 rounded-2xl border ${
                      bin.fillPercent >= 90 
                        ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800' 
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900 dark:text-white truncate max-w-[160px]">
                        {bin.location}
                      </span>
                      <span className={`font-mono font-bold ${bin.fillPercent >= 90 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {bin.fillPercent}% Full
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-1.5">
                      <div 
                        className={`h-full rounded-full ${bin.fillPercent >= 90 ? 'bg-rose-500' : bin.fillPercent >= 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${bin.fillPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{bin.category}</span>
                      <span>Battery {bin.battery}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('SMART_BINS')}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs text-center transition-all"
              >
                View Full Sensor Telemetry →
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Tab Content 2: Inter-House Tournament */}
      {activeTab === 'INTER_HOUSE' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Inter-House & Dormitory Recycling Tournament
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live rankings for the 2026 Achimota Environmental Championship Cup.
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3.5 py-1.5 rounded-xl text-amber-800 dark:text-amber-300 text-xs font-bold">
              Prize: GH₵ 2,000 House Sports Kit Sponsor
            </div>
          </div>

          <div className="space-y-3">
            {houseLeaderboard.map((house) => (
              <div 
                key={house.rank}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base ${
                    house.rank === 1 ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' :
                    house.rank === 2 ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white' :
                    house.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                  }`}>
                    #{house.rank}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {house.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Lead Class: <strong>{house.leadClass}</strong> • {house.activeStudents} contributing students
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono block">
                      {house.kg} kg
                    </span>
                    <span className="text-[10px] text-slate-400">Diverted Waste</span>
                  </div>

                  <div className="text-right bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 font-mono block">
                      {house.points} pts
                    </span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">House Points</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Smart Bin Sensors */}
      {activeTab === 'SMART_BINS' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-500" />
                Ultrasonic Bin Fill-Level IoT Sensors
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time optical & ultrasonic bin level monitoring across campus academic blocks.
              </p>
            </div>
            <span className="text-xs font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
              4 / 4 Nodes Online
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campusSmartBins.map((bin) => (
              <div
                key={bin.id}
                className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-400">{bin.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    bin.fillPercent >= 90 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {bin.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {bin.location}
                </h4>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Fill Level:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{bin.fillPercent}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${bin.fillPercent >= 90 ? 'bg-rose-500' : bin.fillPercent >= 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${bin.fillPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span>Stream: <strong>{bin.category}</strong></span>
                  <span>Battery: <strong>{bin.battery}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 4: Bulk Pickup Dispatch Scheduler */}
      {activeTab === 'BULK_SCHEDULE' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-500" />
              Schedule Institutional Bulk Waste Haul
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For campus accumulations exceeding 200kg. Directly dispatches the nearest certified tricycle or light truck fleet.
            </p>
          </div>

          <form onSubmit={handleBookBulkPickup} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Estimated Volume / Weight (kg)
              </label>
              <input
                type="number"
                min="100"
                max="5000"
                value={bulkEstKg}
                onChange={(e) => setBulkEstKg(+e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Primary Material Category
              </label>
              <select
                value={bulkMaterialType}
                onChange={(e) => setBulkMaterialType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium"
              >
                <option value="Pure Water Sachets & PET Bottles">Plastics: Pure Water Sachets (LDPE) & PET Bottles</option>
                <option value="Corrugated Cartons & Exam Paper">Paper: Corrugated Delivery Boxes & Clean Exam Sheets</option>
                <option value="Aluminum Beverage Cans">Metals: Aluminum Cans & Steel Tins</option>
                <option value="Mixed Segregated Streams">Multi-Stream Segregated Campus Haul</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Campus Loading Bay Location
              </label>
              <input
                type="text"
                defaultValue="Achimota School Main Dining Hall Service Gate #3"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                  Expected Treasury Addition
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Based on EPA Ghana guaranteed off-take rate
                </span>
              </div>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                +GH₵ {(bulkEstKg * 0.15).toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Confirm & Dispatch Municipal Fleet</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab Content 5: Nearby Drop-off Points & Community Collection Centers Map */}
      {activeTab === 'DROP_OFF_MAP' && (
        <div className="space-y-4">
          <NearbyDropOffMap />
        </div>
      )}

    </div>
  );
};
