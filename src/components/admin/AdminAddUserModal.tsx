import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Truck, 
  Factory, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Coins,
  Sparkles
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { UserRole, EntityType } from '../../types';

interface AdminAddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAddUserModal: React.FC<AdminAddUserModalProps> = ({ isOpen, onClose }) => {
  const { addUser } = useEcoSort();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+233 ');
  const [role, setRole] = useState<UserRole>('USER');
  const [entityType, setEntityType] = useState<EntityType>('INDIVIDUAL');
  const [institutionName, setInstitutionName] = useState('');
  const [memberCount, setMemberCount] = useState<number>(1);
  const [location, setLocation] = useState('Accra, Greater Accra');
  const [community, setCommunity] = useState('Legon Campus');
  const [address, setAddress] = useState('');
  const [ghanaCardNumber, setGhanaCardNumber] = useState('');
  const [ghanaTelecomNetwork, setGhanaTelecomNetwork] = useState<'MTN' | 'Telecel' | 'AT' | 'Other'>('MTN');
  const [initialEcoPoints, setInitialEcoPoints] = useState<number>(50);
  const [status, setStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION'>('ACTIVE');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      entityType,
      institutionName: institutionName.trim() || undefined,
      memberCount: memberCount > 0 ? memberCount : 1,
      location: location.trim(),
      community: community.trim() || location.trim(),
      address: address.trim(),
      ghanaCardNumber: ghanaCardNumber.trim() || undefined,
      ghanaTelecomNetwork,
      initialEcoPoints,
      status,
      leaderboardOptIn: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 p-6 text-white flex items-center justify-between border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-400/30 text-emerald-400">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Provision New User</h2>
              <p className="text-xs text-slate-300">
                Register citizen, collection agent, recycler or institution node
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Role & Entity Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              System Role & Access Tier
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { r: 'USER' as UserRole, label: 'Citizen', icon: User, desc: 'Sorts waste & earns rewards' },
                { r: 'COLLECTION_AGENT' as UserRole, label: 'Collector Agent', icon: Truck, desc: 'Field pickup & scale verification' },
                { r: 'RECYCLER' as UserRole, label: 'Recycler Offtaker', icon: Factory, desc: 'Industrial feedstock buyer' },
                { r: 'COMMUNITY_ADMIN' as UserRole, label: 'Community / School', icon: GraduationCap, desc: 'Hub & institution manager' },
                { r: 'ADMIN' as UserRole, label: 'EPA Administrator', icon: ShieldCheck, desc: 'National platform supervisor' },
              ].map(({ r, label, icon: Icon, desc }) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => {
                    setRole(r);
                    if (r === 'COMMUNITY_ADMIN') setEntityType('SCHOOL');
                    else if (r === 'RECYCLER') setEntityType('ORGANIZATION');
                    else if (r === 'USER') setEntityType('INDIVIDUAL');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    role === r 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20' 
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1.5 ${role === r ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <div className="font-bold text-xs">{label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Entity Type (if Community/School/Org) */}
          {(role === 'COMMUNITY_ADMIN' || role === 'USER' || role === 'RECYCLER') && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Entity Category
              </label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { type: 'INDIVIDUAL' as EntityType, label: 'Individual Citizen' },
                  { type: 'SCHOOL' as EntityType, label: 'School / University' },
                  { type: 'COMMUNITY' as EntityType, label: 'Community Group' },
                  { type: 'ORGANIZATION' as EntityType, label: 'Commercial Enterprise' },
                ].map(({ type, label }) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setEntityType(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      entityType === type 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Basic User Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name / Contact Person *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Kwame Antwi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number (MoMo / WhatsApp) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="+233 24 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Network Provider
              </label>
              <select
                value={ghanaTelecomNetwork}
                onChange={(e) => setGhanaTelecomNetwork(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="MTN">MTN MoMo</option>
                <option value="Telecel">Telecel Cash</option>
                <option value="AT">AT Money (AirtelTigo)</option>
                <option value="Other">Other / Bank</option>
              </select>
            </div>
          </div>

          {/* Institution or Organization Details */}
          {entityType !== 'INDIVIDUAL' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Institution / Business / Hub Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Achimota Senior High or Accra Circular"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Members / Students
                </label>
                <input
                  type="number"
                  min="1"
                  value={memberCount}
                  onChange={(e) => setMemberCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Location & Ghana Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Region / City *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Accra, Greater Accra"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Community / Suburb / Zone
              </label>
              <input
                type="text"
                placeholder="e.g. Madina Market, Legon"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ghana Card Pin (Optional)
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="GHA-123456789-0"
                  value={ghanaCardNumber}
                  onChange={(e) => setGhanaCardNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Starting EcoPoints & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Initial Welcome EcoPoints Grant
              </label>
              <div className="relative">
                <Coins className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={initialEcoPoints}
                  onChange={(e) => setInitialEcoPoints(parseInt(e.target.value) || 0)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Default 50 EcoPoints onboarding subsidy.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="ACTIVE">Active & Verified 🟢</option>
                <option value="PENDING_VERIFICATION">Pending Identity Verification 🟡</option>
                <option value="SUSPENDED">Suspended / Frozen 🔴</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Provision Account
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
