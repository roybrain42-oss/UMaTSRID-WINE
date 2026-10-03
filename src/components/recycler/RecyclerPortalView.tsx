import React, { useState } from 'react';
import { 
  Factory, 
  Package, 
  CheckCircle2, 
  Truck, 
  Layers, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  ArrowRight,
  TrendingUp,
  FileCheck,
  Scale,
  Sparkles,
  Award,
  LogOut,
  LogIn
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { WasteCategory } from '../../types';
import { EcosystemRoleSwitcher } from '../dashboard/EcosystemRoleSwitcher';

export const RecyclerPortalView: React.FC = () => {
  const { recyclerInventory, recyclerOrders, addRecyclerOrder, currentUser, logoutUser } = useEcoSort();

  const [selectedCategory, setSelectedCategory] = useState<WasteCategory>('PLASTIC');
  const [orderKg, setOrderKg] = useState<number>(500);
  const [facilityDestination, setFacilityDestination] = useState<string>('Tema Heavy Industrial Area Processing Plant #2');

  const currentItem = recyclerInventory.find(i => i.category === selectedCategory);
  const totalCostGhs = currentItem ? (orderKg * currentItem.pricePerKgGhs).toFixed(2) : '0.00';

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;

    addRecyclerOrder(selectedCategory, orderKg, facilityDestination);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Ecosystem Role Switcher Banner */}
      <EcosystemRoleSwitcher />

      {/* Recycler Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-purple-400/30">
              <Factory className="w-3.5 h-3.5 text-purple-400" />
              B2B Industrial Recycler Supply Chain Portal
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Verified Recyclable Raw Material Offtake
            </h1>
            <p className="text-purple-200/80 text-sm mt-1">
              Procure certified, optically-sorted recyclable streams collected from campuses & communities across Ghana.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-slate-900/90 border border-purple-500/40 p-4 rounded-2xl">
              <span className="text-[10px] text-purple-300 uppercase font-bold block">Company Account</span>
              <span className="text-sm font-bold text-white block">{currentUser.organization || 'Accra Circular Plastics Ltd'}</span>
              <span className="text-[10px] text-slate-400">Verified Industrial Offtaker • Tema Free Zones</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => logoutUser('SIGN_IN')}
                className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                title="Switch account or log in"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => logoutUser('SIGN_IN')}
                className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                title="Log out and return to first page"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Industrial Operational Plant Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-purple-800/60">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-purple-500/20">
            <span className="text-[10px] text-purple-300 block uppercase">Warehouse Inventory</span>
            <span className="text-base font-black text-white font-mono">12.48 Tonnes</span>
            <span className="text-[9px] text-slate-400 block">Baled polymer stock</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-purple-500/20">
            <span className="text-[10px] text-purple-300 block uppercase">Intake Throughput</span>
            <span className="text-base font-black text-emerald-400 font-mono">2.80 T / day</span>
            <span className="text-[9px] text-slate-400 block">Factory processing speed</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-purple-500/20">
            <span className="text-[10px] text-purple-300 block uppercase">Polymer Purity Yield</span>
            <span className="text-base font-black text-teal-400 font-mono">98.2%</span>
            <span className="text-[9px] text-slate-400 block">Optical sort standard</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-purple-500/20">
            <span className="text-[10px] text-purple-300 block uppercase">Offtake Expenditure</span>
            <span className="text-base font-black text-amber-400 font-mono">GH₵ 24,960</span>
            <span className="text-[9px] text-slate-400 block">Paid to local collectors</span>
          </div>
        </div>
      </div>

      {/* Available Inventory Grid (From Infographic & Seed Data) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {recyclerInventory.map((item) => (
          <div 
            key={item.category}
            className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
              selectedCategory === item.category 
                ? 'border-purple-500 shadow-md ring-2 ring-purple-500/20' 
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px] uppercase">
                  {item.category}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  GH₵ {item.pricePerKgGhs.toFixed(2)} / kg
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {item.material}
              </h3>
              
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Available Stock:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.availableKg.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Purity Standard:</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">{item.purityGrade}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Aggregation Hub:</span>
                  <span className="text-slate-700 dark:text-slate-300">{item.locationHub}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCategory(item.category);
                setOrderKg(Math.min(item.availableKg, 500));
              }}
              className="w-full py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-600 hover:text-white text-purple-700 dark:text-purple-300 font-bold text-xs transition-all border border-purple-200 dark:border-purple-800"
            >
              Select for Bulk Order
            </button>
          </div>
        ))}
      </div>

      {/* Bulk Procurement Order Dispatch Form & Order History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Procurement Form */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-600" />
              Dispatch Material Procurement Batch
            </h2>
            <span className="text-xs font-mono text-purple-600 font-bold">{selectedCategory}</span>
          </div>

          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Procurement Quantity (kg)
              </label>
              <input 
                type="number"
                min="50"
                max={currentItem?.availableKg || 2000}
                step="10"
                value={orderKg}
                onChange={(e) => setOrderKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold"
              />
              <span className="text-[10px] text-slate-400">
                Max available in storage: {currentItem?.availableKg} kg
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Delivery / Processing Plant Address
              </label>
              <input 
                type="text"
                value={facilityDestination}
                onChange={(e) => setFacilityDestination(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
              />
            </div>

            {/* Total Cost Card */}
            <div className="bg-purple-50 dark:bg-purple-950/40 p-4 rounded-2xl border border-purple-200 dark:border-purple-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Total Offtake Value:</span>
                <span className="text-[10px] text-slate-500">{orderKg} kg × GH₵ {currentItem?.pricePerKgGhs.toFixed(2)}/kg</span>
              </div>
              <span className="text-xl font-black text-purple-600 dark:text-purple-400">
                GH₵ {totalCostGhs}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              Confirm Procurement & Dispatch Logistics
            </button>
          </form>
        </div>

        {/* Right: Order Dispatch Stream */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-slate-400" />
            Active Offtake Orders & Shipments
          </h2>

          {recyclerOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Package className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-xs">No active offtake orders placed this cycle.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recyclerOrders.map(order => (
                <div key={order.id} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{order.quantityKg} kg {order.category}</span>
                    <span className="text-[10px] text-slate-400">{order.destinationFacility}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-purple-600 block">GH₵ {order.totalGhs.toFixed(2)}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-[9px] font-bold">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
