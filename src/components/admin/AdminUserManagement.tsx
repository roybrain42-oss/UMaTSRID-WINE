import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Coins, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  GraduationCap, 
  Truck, 
  Factory, 
  User, 
  LogIn, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard,
  Download,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { UserProfile, UserRole } from '../../types';
import { AdminAddUserModal } from './AdminAddUserModal';
import { AdminEditUserModal } from './AdminEditUserModal';
import { AdminAdjustPointsModal } from './AdminAdjustPointsModal';

export const AdminUserManagement: React.FC = () => {
  const { 
    allUsers, 
    deleteUser, 
    toggleUserStatus, 
    setCurrentUser, 
    setCurrentView,
    triggerCelebration 
  } = useEcoSort();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [adjustingUser, setAdjustingUser] = useState<UserProfile | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q) ||
        (u.community && u.community.toLowerCase().includes(q)) ||
        (u.ghanaCardNumber && u.ghanaCardNumber.toLowerCase().includes(q)) ||
        (u.institutionName && u.institutionName.toLowerCase().includes(q));

      const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
      const matchesStatus = selectedStatus === 'ALL' || (u.status || 'ACTIVE') === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [allUsers, searchQuery, selectedRole, selectedStatus]);

  // Metric counts
  const totalEcoPointsCirculating = allUsers.reduce((sum, u) => sum + (u.ecoPoints || 0), 0);
  const totalWasteAllUsers = allUsers.reduce((sum, u) => sum + (u.totalWasteKg || 0), 0);
  const countCollectors = allUsers.filter(u => u.role === 'COLLECTION_AGENT').length;
  const countRecyclers = allUsers.filter(u => u.role === 'RECYCLER').length;
  const countSchools = allUsers.filter(u => u.entityType === 'SCHOOL' || u.role === 'COMMUNITY_ADMIN').length;
  const countSuspended = allUsers.filter(u => u.status === 'SUSPENDED').length;

  const handleImpersonate = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'USER') setCurrentView('user-dashboard');
    else if (user.role === 'COLLECTION_AGENT') setCurrentView('collector-jobs');
    else if (user.role === 'RECYCLER') setCurrentView('recycler-portal');
    else if (user.role === 'COMMUNITY_ADMIN') setCurrentView('community-hub');
    else setCurrentView('admin-dashboard');
  };

  const exportUsersCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Name,Email,Phone,Role,Status,Entity_Type,Institution,EcoPoints,Total_Waste_kg,Location,Community,GhanaCard\n"
      + allUsers.map(u => `"${u.id}","${u.name}","${u.email}","${u.phone}","${u.role}","${u.status || 'ACTIVE'}","${u.entityType || 'INDIVIDUAL'}","${u.institutionName || ''}",${u.ecoPoints},${u.totalWasteKg || 0},"${u.location}","${u.community || ''}","${u.ghanaCardNumber || ''}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EcoSort_Ghana_Users_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerCelebration();
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-slate-700 text-[10px] font-bold">🛡️ EPA Admin</span>;
      case 'COLLECTION_AGENT':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold">🛵 Fleet Agent</span>;
      case 'RECYCLER':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[10px] font-bold">🏭 Industrial Recycler</span>;
      case 'COMMUNITY_ADMIN':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-bold">🎓 School / Hub</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">👤 Citizen</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {allUsers.length}
          </div>
          <span className="text-[10px] text-emerald-500 font-semibold">Registered in system</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Fleet</span>
          <div className="text-2xl font-black text-amber-500 mt-1 font-mono">
            {countCollectors}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Collection Agents</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recyclers</span>
          <div className="text-2xl font-black text-purple-500 mt-1 font-mono">
            {countRecyclers}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Industrial plants</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Schools & Hubs</span>
          <div className="text-2xl font-black text-blue-500 mt-1 font-mono">
            {countSchools}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Community nodes</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">EcoPoints Total</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {totalEcoPointsCirculating.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">In circulation</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Suspended</span>
          <div className={`text-2xl font-black mt-1 font-mono ${countSuspended > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
            {countSuspended}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Frozen accounts</span>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Add User Button */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search user by name, email, phone, Ghana Card, community..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={exportUsersCSV}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> Provision New User
            </button>
          </div>
        </div>

        {/* Role & Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Role:</span>
          {[
            { id: 'ALL', label: 'All Roles' },
            { id: 'USER', label: 'Citizens' },
            { id: 'COLLECTION_AGENT', label: 'Fleet Agents' },
            { id: 'RECYCLER', label: 'Recyclers' },
            { id: 'COMMUNITY_ADMIN', label: 'Schools / Hubs' },
            { id: 'ADMIN', label: 'EPA Admins' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedRole(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRole === tab.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Status:</span>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'ACTIVE', label: 'Active 🟢' },
            { id: 'SUSPENDED', label: 'Suspended 🔴' },
            { id: 'PENDING_VERIFICATION', label: 'Pending 🟡' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="font-bold text-xs text-slate-700 dark:text-slate-300">
            Showing <span className="font-mono text-emerald-600 font-bold">{filteredUsers.length}</span> of {allUsers.length} registered accounts
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')} 
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300">No users match your criteria</h4>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or role filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredUsers.map((user) => (
              <div 
                key={user.id} 
                className="p-4 sm:p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: User Identity & Badges */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-[280px]">
                  <div className="relative shrink-0">
                    <img 
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                      alt={user.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <span 
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                        (user.status || 'ACTIVE') === 'ACTIVE' 
                          ? 'bg-emerald-500' 
                          : user.status === 'SUSPENDED' 
                          ? 'bg-rose-500' 
                          : 'bg-amber-500'
                      }`} 
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {user.name}
                      </span>
                      {getRoleBadge(user.role)}
                      {user.entityType && user.entityType !== 'INDIVIDUAL' && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                          {user.entityType}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {user.phone} ({user.ghanaTelecomNetwork || 'MTN'})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {user.community || user.location}
                      </span>
                    </div>

                    {user.institutionName && (
                      <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {user.institutionName} {user.memberCount ? `(${user.memberCount} members)` : ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Center: Key Waste & EcoPoints Metrics */}
                <div className="flex items-center gap-6 sm:gap-8 text-xs border-y lg:border-y-0 lg:border-x border-slate-100 dark:border-slate-800 py-3 lg:py-0 lg:px-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">EcoPoints</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {user.ecoPoints.toLocaleString()} Pts
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Waste</span>
                    <span className="text-base font-black text-slate-800 dark:text-slate-200 font-mono">
                      {user.totalWasteKg || 0} kg
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Jobs</span>
                    <span className="text-base font-black text-amber-500 font-mono">
                      {user.verifiedCollections || 0}
                    </span>
                  </div>

                  {user.ghanaCardNumber && (
                    <div className="hidden sm:block">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Ghana Card</span>
                      <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                        {user.ghanaCardNumber}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {/* Impersonate / Switch */}
                  <button
                    onClick={() => handleImpersonate(user)}
                    title="Switch view to this user"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                  </button>

                  {/* Adjust Points */}
                  <button
                    onClick={() => setAdjustingUser(user)}
                    title="Grant or debit EcoPoints"
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-xs border border-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Coins className="w-3.5 h-3.5" /> Adjust Points
                  </button>

                  {/* Edit User */}
                  <button
                    onClick={() => setEditingUser(user)}
                    title="Edit profile information"
                    className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Toggle Status (Active / Suspended) */}
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    title={user.status === 'SUSPENDED' ? 'Activate Account' : 'Suspend Account'}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      user.status === 'SUSPENDED'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20'
                    }`}
                  >
                    {user.status === 'SUSPENDED' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                  </button>

                  {/* Delete User */}
                  <button
                    onClick={() => setDeletingUser(user)}
                    title="Permanently remove user"
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-500/20 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl w-fit border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Delete User Account?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently delete <span className="font-bold text-slate-900 dark:text-white">{deletingUser.name}</span> ({deletingUser.email})?
              </p>
            </div>

            <div className="bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900/50 text-[11px] text-rose-700 dark:text-rose-300 space-y-1">
              <p className="font-bold">⚠️ Irreversible Administrative Action:</p>
              <p>• Account credentials and profile will be deleted from Cloud Firestore.</p>
              <p>• Assigned collection jobs will be unassigned back to open pool.</p>
              <p>• {deletingUser.ecoPoints} unused EcoPoints balance will be forfeited.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteUser(deletingUser.id);
                  setDeletingUser(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <AdminAddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit User Modal */}
      <AdminEditUserModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
      />

      {/* Adjust Points Modal */}
      <AdminAdjustPointsModal
        user={adjustingUser}
        isOpen={!!adjustingUser}
        onClose={() => setAdjustingUser(null)}
      />

    </div>
  );
};
