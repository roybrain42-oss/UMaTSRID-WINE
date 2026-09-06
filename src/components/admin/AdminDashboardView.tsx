import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Scale, 
  Truck, 
  Factory, 
  Settings, 
  Download, 
  TrendingUp, 
  BarChart3, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  FileSpreadsheet,
  Coins,
  RefreshCw,
  Leaf,
  Gift,
  History,
  Cpu,
  Navigation,
  Route,
  Wrench,
  Smartphone
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { WasteCategory } from '../../types';
import { EcosystemRoleSwitcher } from '../dashboard/EcosystemRoleSwitcher';
import { AdminUserManagement } from './AdminUserManagement';
import { AdminRewardManager } from './AdminRewardManager';
import { AdminFleetManager } from './AdminFleetManager';
import { AdminAuditFeed } from './AdminAuditFeed';
import { AdminSmartBinMonitor } from './AdminSmartBinMonitor';
import { AdminBinRouteOptimizer } from './AdminBinRouteOptimizer';
import { AdminBinMaintenanceLogs } from './AdminBinMaintenanceLogs';
import { AdminHttpSmsMonitor } from './AdminHttpSmsMonitor';
import { SmartBinStatus } from '../smartbin/SmartBinStatus';

export const AdminDashboardView: React.FC = () => {
  const { 
    currentUser, 
    allUsers,
    rewardRules, 
    updateRewardRule, 
    submissions, 
    collectionJobs, 
    rewards,
    adminAuditLogs,
    smartBins,
    maintenanceLogs,
    smsLogs,
    addToast,
    resetToDefaults,
    setCurrentView,
    triggerCelebration 
  } = useEcoSort();

  const [activeTab, setActiveTab] = useState<'USERS' | 'SMART_BINS' | 'ROUTES' | 'MAINTENANCE' | 'FLEET' | 'REWARDS' | 'RULES' | 'OVERVIEW' | 'AUDIT' | 'SMS_GATEWAY'>('USERS');
  const [editingCategory, setEditingCategory] = useState<WasteCategory | null>(null);
  const [editRate, setEditRate] = useState<number>(10);

  const totalWasteAll = 12480 + submissions.reduce((acc, s) => acc + (s.actualWeightKg || s.userWeightEstimateKg), 0);
  const activeFleetCount = allUsers.filter(u => u.role === 'COLLECTION_AGENT').length;
  const recyclersCount = allUsers.filter(u => u.role === 'RECYCLER').length;

  const handleSaveRate = (cat: WasteCategory) => {
    updateRewardRule(cat, editRate);
    setEditingCategory(null);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Citizen,Category,Material,Weight_kg,Status,Points_Awarded,Location,Date\n"
      + submissions.map(s => `"${s.id}","${s.userName}","${s.classification.category}","${s.classification.material}",${s.actualWeightKg || s.userWeightEstimateKg},"${s.status}",${s.pointsAwarded},"${s.community}","${s.createdAt}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EcoSort_Ghana_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerCelebration();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Ecosystem Role Switcher Banner */}
      <EcosystemRoleSwitcher />

      {/* Admin Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 md:p-8 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              EPA Ghana & EcoSort National Command Center
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Platform Administration & User Governance
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Officer: <span className="font-bold text-white">{currentUser.name}</span> • Ghana Waste Stream & User Permissions
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab('ROUTES')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-slate-950" /> AI Route Optimizer
            </button>
            <button
              onClick={() => setCurrentView('infographic')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Leaf className="w-4 h-4" /> System Blueprint
            </button>
            <button
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export CSV Report
            </button>
            <button
              onClick={resetToDefaults}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reset state to initial Ghana seed data"
            >
              <RefreshCw className="w-4 h-4" /> Reset Demo State
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Registered Users</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white font-mono">{allUsers.length}</span>
              <span className="text-xs font-bold text-emerald-400">Active Node</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Waste Diverted</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">{totalWasteAll.toLocaleString()} kg</span>
              <span className="text-xs font-bold text-emerald-400">+18%</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Fleet Agents</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-400 font-mono">{activeFleetCount}</span>
              <span className="text-xs font-bold text-amber-400">Dispatched</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Recycling Plants</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-purple-400 font-mono">{recyclersCount}</span>
              <span className="text-xs font-bold text-purple-400">Offtakers</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 flex-wrap">
          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'USERS' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Manage Users ({allUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('SMART_BINS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'SMART_BINS' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Smart Bins & LED Status ({smartBins.length})
          </button>
          <button
            onClick={() => setActiveTab('ROUTES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ROUTES' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            AI Route Planner (Optimized)
          </button>
          <button
            onClick={() => setActiveTab('MAINTENANCE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'MAINTENANCE' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Maintenance Logs ({maintenanceLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('FLEET')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'FLEET' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Fleet & Dispatch ({collectionJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('REWARDS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'REWARDS' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            Reward Catalog ({rewards.length})
          </button>
          <button
            onClick={() => setActiveTab('RULES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'RULES' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Reward Rates ({rewardRules.length})
          </button>
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'OVERVIEW' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics & Charts
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'AUDIT' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Audit Ledger ({adminAuditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('SMS_GATEWAY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'SMS_GATEWAY' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            httpSMS Gateway ({smsLogs.length})
          </button>
        </div>
      </div>

      {/* Tab: Manage Users */}
      {activeTab === 'USERS' && (
        <AdminUserManagement />
      )}

      {/* Tab: Smart Dust Bins & LED Status Monitor */}
      {activeTab === 'SMART_BINS' && (
        <div className="space-y-6">
          <SmartBinStatus />
          <AdminSmartBinMonitor />
        </div>
      )}

      {/* Tab: AI Route Planner & Fleet Route Optimizer */}
      {activeTab === 'ROUTES' && (
        <AdminBinRouteOptimizer />
      )}

      {/* Tab: Smart Bin Maintenance Logs & Hardware Certification */}
      {activeTab === 'MAINTENANCE' && (
        <AdminBinMaintenanceLogs />
      )}

      {/* Tab: Fleet & Dispatch */}
      {activeTab === 'FLEET' && (
        <AdminFleetManager />
      )}

      {/* Tab: Rewards Catalog */}
      {activeTab === 'REWARDS' && (
        <AdminRewardManager />
      )}

      {/* Tab: Reward Rate Rules */}
      {activeTab === 'RULES' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Dynamic Reward Engine Rate Rules (Points per kg)
            </h3>
            <p className="text-xs text-slate-500">
              Configure incentive point multipliers for citizens based on commodity market value.
            </p>
          </div>

          <div className="space-y-3">
            {rewardRules.map((rule) => (
              <div 
                key={rule.category}
                className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">{rule.label}</span>
                  <span className="text-[11px] text-slate-400">
                    Category: {rule.category} • CO₂ Savings: {rule.co2SavingsPerKg} kg/kg
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {editingCategory === rule.category ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        min="1"
                        max="100"
                        value={editRate}
                        onChange={(e) => setEditRate(parseInt(e.target.value) || 1)}
                        className="w-20 px-2.5 py-1.5 rounded-lg border-2 border-emerald-500 bg-white dark:bg-slate-900 font-bold text-xs"
                      />
                      <button
                        onClick={() => handleSaveRate(rule.category)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {rule.pointsPerKg} Pts / kg
                      </span>
                      <button
                        onClick={() => {
                          setEditingCategory(rule.category);
                          setEditRate(rule.pointsPerKg);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                      >
                        Edit Rate
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Analytics & Charts Overview */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Waste Collected Bar Chart */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Waste Collected (kg) Trend
                </h3>
                <p className="text-xs text-slate-500">Weekly intake across Greater Accra & Ashanti hubs</p>
              </div>
              <span className="text-xs font-bold text-blue-600 font-mono">12,480 kg total</span>
            </div>

            {/* Custom Bar Chart Graphic */}
            <div className="h-52 flex items-end justify-between gap-3 pt-6 px-4 border-b border-slate-200 dark:border-slate-800">
              {[
                { label: 'Aug 1', val: 1100, height: '40%' },
                { label: 'Aug 8', val: 1950, height: '70%' },
                { label: 'Aug 15', val: 1400, height: '52%' },
                { label: 'Aug 22', val: 2400, height: '88%' },
                { label: 'Aug 29', val: 2800, height: '100%' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.val} kg
                  </span>
                  <div 
                    style={{ height: bar.height }}
                    className="w-full max-w-[48px] bg-gradient-to-t from-blue-600 to-teal-400 rounded-t-xl transition-all duration-500 group-hover:brightness-110 shadow-md"
                  />
                  <span className="text-[11px] font-mono text-slate-500 pb-2">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Waste Category Breakdown & Status Doughnut */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Waste by Stream Category
              </h3>
              <p className="text-xs text-slate-500">Resource distribution across Ghanaian recovery bins</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-blue-600">Plastic (PET / HDPE / Sachet)</span>
                  <span>45% (5,616 kg)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-emerald-600">Paper & Cardboard Cartons</span>
                  <span>22% (2,745 kg)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '22%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-amber-600">Metal & Aluminum Beverage Cans</span>
                  <span>17% (2,121 kg)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '17%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-cyan-600">Glass Bottles & Cullet</span>
                  <span>10% (1,248 kg)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '10%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-purple-600">E-Waste & Batteries</span>
                  <span>6% (748 kg)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: '6%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Smart Bin LED Status Indicators on Admin Overview */}
          <div className="lg:col-span-12">
            <SmartBinStatus onViewAll={() => setActiveTab('SMART_BINS')} />
          </div>
        </div>
      )}

      {/* Tab: Audit & Compliance Ledger */}
      {activeTab === 'AUDIT' && (
        <AdminAuditFeed />
      )}

      {/* Tab: httpSMS Gateway & Delivery Ledger */}
      {activeTab === 'SMS_GATEWAY' && (
        <AdminHttpSmsMonitor />
      )}

    </div>
  );
};
