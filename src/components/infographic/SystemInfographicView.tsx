import React from 'react';
import { 
  Bot, 
  Upload, 
  Truck, 
  LayoutDashboard, 
  Trophy, 
  Gift, 
  Factory, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  Layers, 
  Database, 
  Bell, 
  Wallet, 
  BarChart3, 
  Scan,
  RefreshCw,
  Zap,
  Globe,
  Leaf,
  Lock,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { useEcoSort, AppView } from '../../context/EcoSortContext';

export const SystemInfographicView: React.FC = () => {
  const { 
    setCurrentView, 
    currentUser, 
    isAdminAuthenticated,
    openAdminAuthModal,
    submissions, 
    collectionJobs, 
    rewards, 
    leaderboard, 
    recyclerInventory,
    robotEvents,
    switchRole
  } = useEcoSort();

  // ACCESS CONTROL: The system's blueprint is restricted to Administrator role only
  if (currentUser.role !== 'ADMIN') {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 space-y-6 animate-in fade-in zoom-in-95">
        <div className="bg-[#0F172A] border-2 border-rose-500/30 rounded-3xl p-8 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

          <div className="relative z-10 space-y-5">
            {/* Lock Icon */}
            <div className="w-20 h-20 bg-rose-500/10 border-2 border-rose-500/40 rounded-3xl flex items-center justify-center mx-auto text-rose-400 shadow-xl">
              <Lock className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                EPA Ghana Admin Clearance Required
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                System Blueprint is Restricted to Administrators
              </h1>
              <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
                The comprehensive architectural blueprint, national robotics topology, edge inference pipeline, and regulatory audit matrices are accessible to <strong>EPA Administrators</strong> only.
              </p>
            </div>

            {/* Current Persona Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 max-w-md mx-auto flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-11 h-11 rounded-xl object-cover border border-slate-700" />
                <div>
                  <span className="font-bold text-xs text-white block">{currentUser.name}</span>
                  <span className="text-[11px] text-amber-400 font-mono block">Current Role: {currentUser.role}</span>
                </div>
              </div>
              <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-lg border border-slate-700">
                Standard Access
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <button
                onClick={() => {
                  switchRole('ADMIN');
                  setCurrentView('infographic');
                }}
                className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                Switch to EPA Admin (UMaT SRID)
              </button>

              <button
                onClick={() => setCurrentView('user-dashboard')}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const totalWasteAll = 12480 + submissions.reduce((acc, s) => acc + (s.actualWeightKg || s.userWeightEstimateKg), 0);
  const totalVerifiedPoints = submissions.reduce((acc, s) => acc + (s.pointsAwarded || 0), 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Admin Verified Clearance Banner */}
      <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs text-purple-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span><strong>Administrator Clearance Verified:</strong> You are viewing confidential system infrastructure schematics as <strong>{currentUser.name}</strong>.</span>
        </div>
        <button
          onClick={() => {
            if (!isAdminAuthenticated) {
              openAdminAuthModal();
            } else {
              setCurrentView('admin');
            }
          }}
          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
        >
          Open Admin Command
        </button>
      </div>

      {/* Top Hero Executive Brand Banner */}
      <div className="bg-[#0F172A] rounded-2xl p-6 md:p-10 text-white shadow-md border border-slate-800 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              EPA Ghana Circular Innovation Framework
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <img 
                src="/logo.png" 
                alt="EcoSort" 
                className="w-14 h-14 rounded-2xl object-contain bg-white p-1 shadow-md ring-1 ring-white/20"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                  EcoSort <span className="text-emerald-400">Enterprise</span>
                </h1>
                <p className="text-slate-300 text-sm md:text-base font-medium mt-1">
                  AI-Powered Waste Collection, Virtual Sorting Digital Twin & Incentive Marketplace
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-sm font-medium">
              “Automating national resource recovery with real-time verification, robotics, and circular incentives.”
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setCurrentView('virtual-robot')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs transition-colors"
            >
              <Bot className="w-4 h-4" />
              Virtual Robot Simulation
            </button>
            <button
              onClick={() => setCurrentView('demo')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              3-Min Demo Tour
            </button>
          </div>
        </div>

        {/* System Overview Metric Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Active Users</span>
            <span className="text-xl font-bold text-white mt-1 block">1,245+</span>
          </div>
          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Waste Diverted</span>
            <span className="text-xl font-bold text-white mt-1 block">{totalWasteAll.toLocaleString()} kg</span>
          </div>
          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Fleet Agents</span>
            <span className="text-xl font-bold text-white mt-1 block">28 Fleets</span>
          </div>
          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Recyclers</span>
            <span className="text-xl font-bold text-white mt-1 block">12 Plants</span>
          </div>
          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">CO₂ Mitigated</span>
            <span className="text-xl font-bold text-white mt-1 block">{(totalWasteAll * 1.6 / 1000).toFixed(1)} Tons</span>
          </div>
          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Model Accuracy</span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">97.4%</span>
          </div>
        </div>
      </div>

      {/* Interactive System Blueprint Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: System Overview Circular Diagram & Architecture */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* System Overview Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider border border-blue-200">
                  System Overview
                </span>
                <span className="text-xs text-slate-500 font-medium">Circular Ecosystem</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              EcoSort Ghana is an enterprise platform that incentivizes recycling through AI waste identification, virtual sorting digital twin, smart collection fleet dispatch, and an audited reward wallet.
            </p>

            {/* Interactive Circular Hub */}
            <div className="relative py-8 px-4 flex items-center justify-center">
              {/* Center Node */}
              <div className="w-28 h-28 rounded-full bg-[#0F172A] text-white shadow-md flex flex-col items-center justify-center z-10 text-center p-2 border-4 border-white">
                <Leaf className="w-6 h-6 text-blue-400 mb-1" />
                <span className="font-bold text-xs tracking-tight leading-none text-white">ECOSORT</span>
                <span className="font-bold text-[10px] text-blue-300">GHANA</span>
              </div>

              {/* Orbital Connected Nodes */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 rounded-full border-2 border-dashed border-slate-300" />
              </div>

              {/* Node 1: Users (Top Left) */}
              <button
                onClick={() => setCurrentView('user-app')}
                className="absolute top-2 left-6 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-xs flex items-center gap-2 text-xs font-semibold transition-all hover:scale-105"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-[11px] font-bold text-slate-900">Users</span>
                  <span className="block text-[9px] text-slate-500">Generate Waste</span>
                </div>
              </button>

              {/* Node 2: AI & Virtual Sorting (Top Right) */}
              <button
                onClick={() => setCurrentView('virtual-robot')}
                className="absolute top-2 right-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-xs flex items-center gap-2 text-xs font-semibold transition-all hover:scale-105"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-[11px] font-bold text-slate-900">AI Robotics</span>
                  <span className="block text-[9px] text-slate-500">Virtual Sorting</span>
                </div>
              </button>

              {/* Node 3: Collection Agents (Right) */}
              <button
                onClick={() => setCurrentView('collector-app')}
                className="absolute bottom-4 right-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-xs flex items-center gap-2 text-xs font-semibold transition-all hover:scale-105"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-[11px] font-bold text-slate-900">Collection</span>
                  <span className="block text-[9px] text-slate-500">Agents & Fleet</span>
                </div>
              </button>

              {/* Node 4: Recycling Partners (Bottom Center) */}
              <button
                onClick={() => setCurrentView('recycler')}
                className="absolute -bottom-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-xs flex items-center gap-2 text-xs font-semibold transition-all hover:scale-105"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Factory className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-[11px] font-bold text-slate-900">Recyclers</span>
                  <span className="block text-[9px] text-slate-500">Processing Plants</span>
                </div>
              </button>

              {/* Node 5: Rewards & Impact (Bottom Left) */}
              <button
                onClick={() => setCurrentView('rewards')}
                className="absolute bottom-4 left-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-xs flex items-center gap-2 text-xs font-semibold transition-all hover:scale-105"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-[11px] font-bold text-slate-900">Rewards</span>
                  <span className="block text-[9px] text-slate-500">& EcoPoints</span>
                </div>
              </button>
            </div>
          </div>

          {/* System Architecture Block Diagram */}
          <div className="bg-[#0F172A] text-slate-200 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-blue-900/60 text-blue-300 font-bold text-xs uppercase tracking-wider border border-blue-700/60">
                System Architecture
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Enterprise Pipeline</span>
            </div>

            {/* Top Layer: Client Interfaces */}
            <div className="grid grid-cols-4 gap-2">
              <button 
                onClick={() => setCurrentView('user-app')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-2 text-center transition-all"
              >
                <Upload className="w-4 h-4 mx-auto text-blue-400 mb-1" />
                <span className="text-[10px] font-medium block">User App</span>
              </button>
              <button 
                onClick={() => setCurrentView('user-dashboard')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-2 text-center transition-all"
              >
                <LayoutDashboard className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
                <span className="text-[10px] font-medium block">Web Portal</span>
              </button>
              <button 
                onClick={() => setCurrentView('collector-app')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-2 text-center transition-all"
              >
                <Truck className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                <span className="text-[10px] font-medium block">Agent App</span>
              </button>
              <button 
                onClick={() => setCurrentView('recycler')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-2 text-center transition-all"
              >
                <Factory className="w-4 h-4 mx-auto text-purple-400 mb-1" />
                <span className="text-[10px] font-medium block">Recycler</span>
              </button>
            </div>

            {/* Connecting Arrow */}
            <div className="flex justify-center">
              <div className="w-0.5 h-3 bg-blue-500/50" />
            </div>

            {/* Middle Services Layer */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-center">
                <Cpu className="w-3.5 h-3.5 mx-auto text-emerald-400 mb-1" />
                <span className="text-[9px] font-bold text-emerald-300 block">AI Vision</span>
                <span className="text-[8px] text-slate-400">Classification</span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-center">
                <Layers className="w-3.5 h-3.5 mx-auto text-blue-400 mb-1" />
                <span className="text-[9px] font-bold text-white block">Backend API</span>
                <span className="text-[8px] text-slate-400">Node / REST</span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-center">
                <Bell className="w-3.5 h-3.5 mx-auto text-amber-400 mb-1" />
                <span className="text-[9px] font-bold text-amber-300 block">Notification</span>
                <span className="text-[8px] text-slate-400">In-App / SMS</span>
              </div>
            </div>

            {/* Database Node */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-2.5 flex items-center justify-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span className="text-[11px] font-semibold text-slate-200">PostgreSQL Cloud Database (Auth, RLS, Realtime)</span>
            </div>

            {/* Bottom Engines Layer */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-slate-900 border border-slate-800 rounded p-1.5 text-center">
                <Wallet className="w-3 h-3 mx-auto text-amber-400 mb-0.5" />
                <span className="text-[8px] text-slate-300 block">Reward Engine</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded p-1.5 text-center">
                <Globe className="w-3 h-3 mx-auto text-cyan-400 mb-0.5" />
                <span className="text-[8px] text-slate-300 block">Telco API</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded p-1.5 text-center">
                <BarChart3 className="w-3 h-3 mx-auto text-emerald-400 mb-0.5" />
                <span className="text-[8px] text-slate-300 block">Analytics</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded p-1.5 text-center">
                <Database className="w-3 h-3 mx-auto text-purple-400 mb-0.5" />
                <span className="text-[8px] text-slate-300 block">Cloud Storage</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Virtual Waste-Sorting Robot Card Preview (Top Right of Infographic) */}
        <div className="lg:col-span-7">
          <div className="bg-slate-950 rounded-2xl p-6 border border-emerald-500/30 shadow-2xl text-white relative overflow-hidden flex flex-col justify-between h-full">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Bot className="w-4 h-4" />
                  Virtual Waste-Sorting Robot (Simulation)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono text-emerald-400 uppercase">Live Digital Twin</span>
              </div>
            </div>

            {/* Robot Simulation Live Telemetry & Visual Preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6">
              
              {/* Telemetry Display (Left) */}
              <div className="md:col-span-5 space-y-3 bg-slate-900/80 rounded-xl p-4 border border-slate-800 font-mono text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">ROBOT STATUS</span>
                  <span className="text-emerald-400 font-bold">Autonomous Sorting...</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400">OBJECT DETECTED</span>
                  <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                      🥤
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 block text-xs">Plastic Bottle</span>
                      <span className="text-[10px] text-emerald-400">PET Plastic #1</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">CONFIDENCE</span>
                    <span className="text-sm font-bold text-emerald-400">96.8%</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">EST. WEIGHT</span>
                    <span className="text-sm font-bold text-white">0.18 kg</span>
                  </div>
                </div>

                <div className="bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-emerald-300 text-[11px] font-sans">Points Generated:</span>
                  <span className="font-bold text-emerald-400 text-sm font-sans">+2 EcoPoints</span>
                </div>

                {/* Sensors Status */}
                <div className="pt-2 space-y-1 text-[10px]">
                  <span className="text-slate-400 font-sans font-bold uppercase text-[9px] block">Sensors Live Status</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Camera (ONLINE)
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> IR Sensor (ONLINE)
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Weight Sensor (ONLINE)
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Proximity (ONLINE)
                    </div>
                  </div>
                </div>
              </div>

              {/* Sorting Machine Visual & Bins (Right) */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                
                {/* Conveyor Belt & Robotic Arm Graphic */}
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 relative overflow-hidden h-44 flex flex-col justify-center items-center">
                  
                  {/* Camera Scanner Laser */}
                  <div className="absolute top-2 left-6 flex items-center gap-1 text-[10px] text-cyan-400 font-mono">
                    <Scan className="w-3.5 h-3.5 animate-pulse" /> OPTICAL SCANNER ACTIVE
                  </div>

                  {/* Animated Conveyor Track */}
                  <div className="w-full bg-slate-800 h-10 rounded-lg border-2 border-slate-700 relative flex items-center px-4 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(16,185,129,0.1)_50%,transparent_100%)] animate-pulse" />
                    
                    {/* Item on conveyor */}
                    <div className="flex items-center justify-between w-full z-10">
                      <div className="flex items-center gap-2 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                        <span>🥤</span> PET Bottle (96.8%)
                      </div>
                      
                      <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                        <span>→ Moving to Arm →</span>
                      </div>

                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 text-xs font-bold">
                        🦾
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-4 text-center">
                    Dual-axis robotic arm with pneumatic gripper sorting at 45 items/min.
                  </p>
                </div>

                {/* 3 Color-coded Bins from Infographic */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-950/80 border-2 border-blue-500 rounded-xl p-3 text-center shadow-lg shadow-blue-500/10">
                    <span className="text-2xl block mb-1">♻️</span>
                    <span className="font-extrabold text-blue-400 text-xs uppercase tracking-wider block">PLASTIC</span>
                    <span className="text-[10px] text-blue-300/80">Bin #1 (Blue)</span>
                  </div>

                  <div className="bg-amber-950/80 border-2 border-amber-500 rounded-xl p-3 text-center shadow-lg shadow-amber-500/10">
                    <span className="text-2xl block mb-1">🥫</span>
                    <span className="font-extrabold text-amber-400 text-xs uppercase tracking-wider block">METAL</span>
                    <span className="text-[10px] text-amber-300/80">Bin #2 (Gold)</span>
                  </div>

                  <div className="bg-emerald-950/80 border-2 border-emerald-500 rounded-xl p-3 text-center shadow-lg shadow-emerald-500/10">
                    <span className="text-2xl block mb-1">📦</span>
                    <span className="font-extrabold text-emerald-400 text-xs uppercase tracking-wider block">PAPER</span>
                    <span className="text-[10px] text-emerald-300/80">Bin #3 (Green)</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Launch Button */}
            <button
              onClick={() => setCurrentView('virtual-robot')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              Open Full Interactive Digital Twin Simulation
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Middle Section: User App & Collection Agent & User Web Dashboard & Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: User App - Upload & Earn */}
        <div 
          onClick={() => setCurrentView('user-app')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] uppercase border border-blue-200">
                User App — Upload & Earn
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>

            {/* Mobile App Screen Mock */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1528190336454-13cd56b45b5a?w=120&auto=format&fit=crop&q=80" 
                  alt="Waste scan" 
                  className="w-12 h-12 object-cover rounded-lg"
                />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block">Plastic (PET)</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Confidence: 96%</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200 text-xs shadow-xs">
                <span className="text-slate-500 text-[10px] block">Estimated: 2.4 kg</span>
                <span className="font-bold text-emerald-600">+24 EcoPoints</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 text-center group-hover:text-blue-600 font-semibold">
            Test AI Waste Scanner →
          </p>
        </div>

        {/* Card 2: Collection Agent App */}
        <div 
          onClick={() => setCurrentView('collector-app')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-amber-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-[10px] uppercase border border-amber-200">
                Collection Agent Console
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </div>

            {/* Collector Job List Mock */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
              <div className="flex justify-between items-center text-[10px] text-slate-500 pb-1 border-b border-slate-200 font-bold">
                <span className="text-amber-600">New ({collectionJobs.filter(j => j.status === 'REQUESTED').length})</span>
                <span>Accepted ({collectionJobs.filter(j => j.status === 'ACCEPTED').length})</span>
                <span>Done</span>
              </div>
              
              <div className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between items-center text-xs shadow-xs">
                <div>
                  <span className="font-semibold text-slate-900 block text-[11px]">Abeka Community</span>
                  <span className="text-[10px] text-slate-500">Plastic • 5.2 kg • 1.2 km</span>
                </div>
                <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">Accept</span>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between items-center text-xs shadow-xs">
                <div>
                  <span className="font-semibold text-slate-900 block text-[11px]">Madina Market</span>
                  <span className="text-[10px] text-slate-500">Metal • 3.8 kg • 2.5 km</span>
                </div>
                <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">Accept</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 text-center group-hover:text-amber-600 font-semibold">
            Open Fleet Scale Modal →
          </p>
        </div>

        {/* Card 3: User Dashboard (Web) */}
        <div 
          onClick={() => setCurrentView('user-dashboard')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] uppercase border border-emerald-200">
                User Dashboard (Web)
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>

            {/* User Dashboard Snapshot Mock */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
              <span className="text-[11px] font-bold text-slate-900 block">
                Bright Mensah 🌿
              </span>
              
              <div className="grid grid-cols-2 gap-1.5 text-center">
                <div className="bg-white p-1.5 rounded border border-slate-200 shadow-xs">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold block">Points</span>
                  <span className="font-bold text-blue-600 text-xs">{currentUser.ecoPoints}</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200 shadow-xs">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold block">Waste</span>
                  <span className="font-bold text-slate-900 text-xs">{currentUser.totalWasteKg} kg</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200 shadow-xs">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold block">Pickups</span>
                  <span className="font-bold text-slate-900 text-xs">{currentUser.verifiedCollections}</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200 shadow-xs">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold block">CO₂ Saved</span>
                  <span className="font-bold text-emerald-600 text-xs">{currentUser.co2SavedKg} kg</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 text-center group-hover:text-emerald-600 font-semibold">
            View Activity & Analytics →
          </p>
        </div>

        {/* Card 4: Leaderboard */}
        <div 
          onClick={() => setCurrentView('leaderboard')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-yellow-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-[10px] uppercase border border-amber-200">
                National Cup Rankings
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-yellow-600 group-hover:translate-x-1 transition-all" />
            </div>

            {/* Leaderboard Mock */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5">
              <span className="text-[10px] font-bold text-amber-700 block flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-500" /> Inter-University Cup 2026
              </span>

              {leaderboard.slice(0, 4).map((entry, idx) => (
                <div key={entry.id} className="flex items-center justify-between bg-white p-1.5 rounded border border-slate-200 text-[11px] shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      idx === 0 ? 'bg-amber-400 text-slate-950' :
                      idx === 1 ? 'bg-slate-300 text-slate-900' :
                      'bg-amber-700 text-white'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800 truncate max-w-[90px]">{entry.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{entry.wasteCollectedKg} kg</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 text-center group-hover:text-yellow-600 font-semibold">
            View Prizes & Standings →
          </p>
        </div>

      </div>

      {/* Bottom Section: Admin Dashboard + Reward Marketplace + Impact Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Admin Dashboard (Overview) */}
        <div 
          onClick={() => {
            if (!isAdminAuthenticated) {
              openAdminAuthModal();
            } else {
              setCurrentView('admin');
            }
          }}
          className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-blue-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-xs uppercase border border-slate-200">
              Admin Governance & Rates
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4 text-center">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="text-[9px] text-slate-500 uppercase font-semibold block">Users</span>
              <span className="font-bold text-xs text-slate-900">1,245</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="text-[9px] text-slate-500 uppercase font-semibold block">Waste</span>
              <span className="font-bold text-xs text-blue-600">12,480 kg</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="text-[9px] text-slate-500 uppercase font-semibold block">Agents</span>
              <span className="font-bold text-xs text-amber-600">28</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="text-[9px] text-slate-500 uppercase font-semibold block">Plants</span>
              <span className="font-bold text-xs text-purple-600">12</span>
            </div>
          </div>

          {/* Waste by category bars */}
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
              <span>National Stream Balance</span>
              <span>Distribution</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
              <div style={{ width: '45%' }} className="bg-blue-500 h-full" title="Plastic 45%" />
              <div style={{ width: '22%' }} className="bg-emerald-500 h-full" title="Paper 22%" />
              <div style={{ width: '17%' }} className="bg-amber-500 h-full" title="Metal 17%" />
              <div style={{ width: '10%' }} className="bg-cyan-500 h-full" title="Glass 10%" />
              <div style={{ width: '6%' }} className="bg-purple-500 h-full" title="E-Waste 6%" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 font-medium">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Plastic 45%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Paper 22%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Metal 17%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Glass 10%</span>
            </div>
          </div>
        </div>

        {/* Reward Marketplace */}
        <div 
          onClick={() => setCurrentView('rewards')}
          className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-blue-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 font-bold text-xs uppercase border border-rose-200">
              Redemption Marketplace
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            {rewards.slice(0, 4).map(reward => (
              <div key={reward.id} className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-between">
                <img src={reward.imageUrl} alt={reward.title} className="w-full h-12 object-cover rounded-lg mb-1" />
                <span className="text-[10px] font-semibold text-slate-900 truncate block">{reward.title}</span>
                <span className="text-[9px] text-blue-600 font-bold">{reward.costPoints} Pts</span>
                <span className="mt-1 px-1.5 py-0.5 bg-blue-600 text-white rounded-md text-[8px] font-bold">Redeem</span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Tracker */}
        <div 
          onClick={() => setCurrentView('impact')}
          className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-teal-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 font-bold text-xs uppercase border border-teal-200">
                Audited Carbon Ledger
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Waste Collected</span>
                <span className="font-semibold text-slate-900">42.5 kg</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Plastic Diverted</span>
                <span className="font-bold text-blue-600">38.2 kg</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">CO₂ Mitigated</span>
                <span className="font-bold text-emerald-600">68.2 kg</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Trees Equivalent</span>
                <span className="font-bold text-teal-600">1.8 Trees</span>
              </div>
            </div>
          </div>

          <span className="text-[10px] text-slate-400 text-center block pt-2">
            EPA Ghana & IPCC conversion standard
          </span>
        </div>

      </div>

      {/* Bottom Footer Bar */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4 text-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs shadow-sm">
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <span className="flex items-center gap-2 font-medium text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400" /> Less Landfill Waste
          </span>
          <span className="flex items-center gap-2 font-medium text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified Traceability
          </span>
          <span className="flex items-center gap-2 font-medium text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-amber-400" /> Instant Mobile Rewards
          </span>
          <span className="flex items-center gap-2 font-medium text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-teal-400" /> Sustainable Future
          </span>
        </div>

        <div className="text-slate-400 text-center md:text-right font-medium">
          Ghana Environmental Protection Agency (EPA) • Verified Node
        </div>
      </div>
    </div>
  );
};
