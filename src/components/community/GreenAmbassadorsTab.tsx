import React, { useState } from 'react';
import { 
  Award, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  Users, 
  Leaf, 
  TrendingUp,
  CheckCircle2,
  Send,
  Zap,
  User
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';

export const GreenAmbassadorsTab: React.FC = () => {
  const { ambassadors, cheerAmbassador, currentUser, addToast } = useEcoSort();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [motivationText, setMotivationText] = useState('');
  const [districtInput, setDistrictInput] = useState(currentUser.community || 'Ayawaso West');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setShowApplyModal(false);
    addToast({
      title: 'Ambassador Application Submitted! 🌟',
      message: 'The EPA Ghana & EcoSort District Board will review your profile. You earned +25 EcoPoints for applying!',
      type: 'success',
      duration: 5000
    });
  };

  return (
    <div className="space-y-6" id="green-ambassadors-tab">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-xl space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-widest border border-amber-400/30">
                Community Leaders & Role Models
              </span>
              <span className="text-xs text-slate-300">EPA Certified Sustainability Champions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Green Ambassadors & Neighborhood Changemakers
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Meet the grassroots organizers leading neighborhood cleanups, campus sorting drives, and upcycling workshops across Ghana. Send cheers to boost their community standing!
            </p>
          </div>

          <button
            onClick={() => setShowApplyModal(true)}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 flex items-center gap-2 transition-all transform hover:scale-105"
            id="apply-ambassador-btn"
          >
            <Sparkles className="w-4 h-4" />
            Apply to Become Ambassador
          </button>
        </div>
      </div>

      {/* Ambassadors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ambassadors.map((amb) => {
          return (
            <div
              key={amb.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              id={`ambassador-card-${amb.id}`}
            >
              <div className="space-y-4">
                {/* Header Profile Info */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                      <User className="w-8 h-8" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[11px] shadow-xs">
                      ★
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <h3 className="text-base font-black text-slate-900 dark:text-white truncate">
                        {amb.name}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    </div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                      {amb.title}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{amb.district}, {amb.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  "{amb.bio}"
                </p>

                {/* Metrics 3-Col Block */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Drives</span>
                    <strong className="text-xs font-black text-slate-900 dark:text-white">
                      {amb.cleanupsOrganized}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Recycled</span>
                    <strong className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {amb.kgWasteRecycled} kg
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">People</span>
                    <strong className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                      {amb.communityMembersCount}+
                    </strong>
                  </div>
                </div>

                {/* Badges */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                    Distinctions & Badges:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {amb.badges.map((b, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-200/50 dark:border-amber-800/40"
                      >
                        🏅 {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Cheer Button */}
              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                  <span>{amb.cheersCount} Community Cheers</span>
                </span>

                <button
                  onClick={() => cheerAmbassador(amb.id)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all transform active:scale-95"
                  id={`cheer-btn-${amb.id}`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cheer (+5 Pts)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply to become an ambassador modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Apply for Green Ambassador</h3>
                  <p className="text-xs text-slate-500">Lead neighborhood clean initiatives in Ghana</p>
                </div>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Your Target District / Campus *
                </label>
                <input
                  type="text"
                  required
                  value={districtInput}
                  onChange={(e) => setDistrictInput(e.target.value)}
                  placeholder="e.g., Legon Campus / Osu Klottey / Kumasi Metro"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Why would you make a great Green Ambassador? *
                </label>
                <textarea
                  rows={4}
                  required
                  value={motivationText}
                  onChange={(e) => setMotivationText(e.target.value)}
                  placeholder="Describe your passion for waste diversion, prior community organizing, or ideas for local cleanups..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Ambassadors receive EPA digital certification, customized QR drop badges, and +500 EcoPoints stipend monthly!</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Application (+25 Pts)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
