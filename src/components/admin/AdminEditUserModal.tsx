import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserCheck, 
  Building2, 
  Truck, 
  Factory, 
  User, 
  GraduationCap, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Coins, 
  Save
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { UserProfile, UserRole, EntityType } from '../../types';

interface AdminEditUserModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminEditUserModal: React.FC<AdminEditUserModalProps> = ({ user, isOpen, onClose }) => {
  const { updateUser } = useEcoSort();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [entityType, setEntityType] = useState<EntityType>('INDIVIDUAL');
  const [institutionName, setInstitutionName] = useState('');
  const [memberCount, setMemberCount] = useState<number>(1);
  const [location, setLocation] = useState('');
  const [community, setCommunity] = useState('');
  const [address, setAddress] = useState('');
  const [ghanaCardNumber, setGhanaCardNumber] = useState('');
  const [ghanaTelecomNetwork, setGhanaTelecomNetwork] = useState<'MTN' | 'Telecel' | 'AT' | 'Other'>('MTN');
  const [status, setStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION'>('ACTIVE');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setRole(user.role || 'USER');
      setEntityType(user.entityType || 'INDIVIDUAL');
      setInstitutionName(user.institutionName || user.organization || '');
      setMemberCount(user.memberCount || 1);
      setLocation(user.location || '');
      setCommunity(user.community || '');
      setAddress(user.address || '');
      setGhanaCardNumber(user.ghanaCardNumber || '');
      setGhanaTelecomNetwork(user.ghanaTelecomNetwork || 'MTN');
      setStatus(user.status || 'ACTIVE');
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    updateUser(user.id, {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      entityType,
      institutionName: institutionName.trim() || undefined,
      organization: institutionName.trim() || undefined,
      memberCount: memberCount > 0 ? memberCount : 1,
      location: location.trim(),
      community: community.trim() || location.trim(),
      address: address.trim(),
      ghanaCardNumber: ghanaCardNumber.trim() || undefined,
      ghanaTelecomNetwork,
      status
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
              alt={user.name} 
              className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400"
            />
            <div>
              <h2 className="text-lg font-black tracking-tight">Edit Profile: {user.name}</h2>
              <p className="text-xs text-slate-300">
                User ID: <span className="font-mono text-emerald-400">{user.id}</span> • Balance: {user.ecoPoints} EcoPoints
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
          
          {/* Role & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="USER">Citizen / Household EcoSorter</option>
                <option value="COLLECTION_AGENT">Collection Agent / Fleet Officer</option>
                <option value="RECYCLER">Certified Industrial Recycler</option>
                <option value="COMMUNITY_ADMIN">School / Community Coordinator</option>
                <option value="ADMIN">EPA Platform Administrator</option>
              </select>
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
                <option value="PENDING_VERIFICATION">Pending Verification 🟡</option>
                <option value="SUSPENDED">Suspended / Frozen 🔴</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone (MoMo)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Telecom Network
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

          {/* Location & Organization */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Community / Neighborhood
              </label>
              <input
                type="text"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Institution / School
              </label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g. Achimota School"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Ghana Card Identification
            </label>
            <input
              type="text"
              value={ghanaCardNumber}
              onChange={(e) => setGhanaCardNumber(e.target.value)}
              placeholder="GHA-123456789-0"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
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
              <Save className="w-4 h-4" /> Save Profile Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
