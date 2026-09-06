import React, { useState, useRef } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Building2, 
  CreditCard, 
  X, 
  CheckCircle2, 
  Save, 
  ShieldCheck,
  Upload,
  Camera,
  Trash2,
  Fingerprint,
  ScanFace,
  Lock,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Zap,
  School,
  Users,
  Trophy
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { LanguageSwitcher } from '../layout/LanguageSwitcher';
import { EntityType } from '../../types';

const GHANA_AVATARS = [
  { id: 'av-1', name: 'Bright (UG Student)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
  { id: 'av-2', name: 'Ama (KNUST Eco Club)', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=250' },
  { id: 'av-3', name: 'Kwame (Fleet Agent)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250' },
  { id: 'av-4', name: 'Kofi (Logistics Pro)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250' },
  { id: 'av-5', name: 'UMaT SRID (EPA Admin)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250' },
  { id: 'av-6', name: 'Abena (Circular Ops)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250' },
];

const GHANA_COMMUNITIES = [
  'University of Ghana (Legon Campus)',
  'KNUST Campus (Kumasi)',
  'Ashesi University (Berekuso)',
  'Madina & Zongo Junction',
  'East Legon & Shiashie',
  'Osu & Oxford Street',
  'Airport Residential Area',
  'Tema (Community 1 - 12)',
  'Dansoman & Exhibition',
  'Spintex & Coastal Road',
  'Takoradi Central Hub',
  'Cape Coast (UCC Zone)',
  'Tamale Metropolitan Hub',
  'Koforidua Central',
  'Other / Custom Community'
];

export const EditProfileModal: React.FC = () => {
  const { 
    showEditProfileModal, 
    setShowEditProfileModal, 
    currentUser, 
    updateUserProfile,
    addToast,
    biometricCapability,
    isBiometricsEnrolled,
    registerUserBiometrics,
    removeUserBiometrics,
    authenticateWithBiometrics
  } = useEcoSort();

  const [entityType, setEntityType] = useState<EntityType>(currentUser.entityType || 'INDIVIDUAL');
  const [institutionName, setInstitutionName] = useState<string>(currentUser.institutionName || currentUser.organization || '');
  const [memberCount, setMemberCount] = useState<number>(currentUser.memberCount || 1);
  const [contactPerson, setContactPerson] = useState<string>(currentUser.contactPerson || currentUser.name);
  const [leaderboardOptIn, setLeaderboardOptIn] = useState<boolean>(currentUser.leaderboardOptIn ?? true);
  const [name, setName] = useState<string>(currentUser.name);
  const [phone, setPhone] = useState<string>(currentUser.phone);
  const [email, setEmail] = useState<string>(currentUser.email);
  const [community, setCommunity] = useState<string>(currentUser.community || currentUser.location || GHANA_COMMUNITIES[0]);
  const [customCommunity, setCustomCommunity] = useState<string>('');
  const [address, setAddress] = useState<string>(currentUser.address || '');
  const [organization, setOrganization] = useState<string>(currentUser.organization || '');
  const [ghanaCardNumber, setGhanaCardNumber] = useState<string>(currentUser.ghanaCardNumber || '');
  const [avatar, setAvatar] = useState<string>(currentUser.avatar);
  const [requireBiometricForMoMo, setRequireBiometricForMoMo] = useState<boolean>(currentUser.requireBiometricForMoMo ?? true);
  const [momoBiometricPolicy, setMomoBiometricPolicy] = useState<'ALWAYS' | 'THRESHOLD_ONLY' | 'NEVER'>(
    currentUser.momoBiometricPolicy || (currentUser.requireBiometricForMoMo === false ? 'NEVER' : 'THRESHOLD_ONLY')
  );
  const [momoBiometricThresholdGhs, setMomoBiometricThresholdGhs] = useState<number>(
    currentUser.momoBiometricThresholdGhs ?? 20
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [isEnrollingBio, setIsEnrollingBio] = useState<boolean>(false);
  const [isTestingSensor, setIsTestingSensor] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEnabled = isBiometricsEnrolled || !!currentUser?.biometricsEnabled;
  const isFace = biometricCapability?.biometricIconName === 'ScanFace' || currentUser?.biometricType === 'FACE_ID';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast({
        title: 'Invalid File',
        message: 'Please choose an image file (PNG, JPG, WEBP).',
        type: 'warning'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast({
        title: 'File Too Large',
        message: 'Profile image size must be under 5MB.',
        type: 'warning'
      });
      return;
    }

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatar(dataUrl);
      }
      setIsUploadingPhoto(false);
    };
    reader.onerror = () => {
      setIsUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  if (!showEditProfileModal) return null;

  // Detect Ghana Network Carrier
  const getNetwork = (num: string): 'MTN' | 'Telecel' | 'AT' | 'Other' => {
    const clean = num.replace(/\D/g, '');
    if (/^(024|054|055|059|23324|23354|23355|23359)/.test(clean)) return 'MTN';
    if (/^(020|050|23320|23350)/.test(clean)) return 'Telecel';
    if (/^(027|057|026|056|23327|23357|23326|23356)/.test(clean)) return 'AT';
    return 'Other';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const finalLocation = community === 'Other / Custom Community' ? customCommunity : community;
    const finalInstitution = entityType === 'INDIVIDUAL' 
      ? (organization.trim() || 'Independent Citizen')
      : (institutionName.trim() || organization.trim() || name.trim());

    setTimeout(() => {
      updateUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        location: finalLocation,
        community: finalLocation,
        address: address.trim(),
        organization: finalInstitution,
        entityType,
        institutionName: finalInstitution,
        memberCount: entityType === 'INDIVIDUAL' ? 1 : Math.max(1, memberCount),
        contactPerson: contactPerson.trim() || name.trim(),
        leaderboardOptIn,
        ghanaCardNumber: ghanaCardNumber.trim(),
        avatar,
        ghanaTelecomNetwork: getNetwork(phone),
        requireBiometricForMoMo: momoBiometricPolicy !== 'NEVER',
        momoBiometricPolicy,
        momoBiometricThresholdGhs: Math.max(1, Number(momoBiometricThresholdGhs) || 20)
      });
      setIsSaving(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl max-w-2xl lg:max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-200">
        
        {/* Top Header */}
        <div className="shrink-0 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-5 py-4 border-b border-slate-700/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
              Digital Profile & Node Settings
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Edit Account Details
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Account ID: <span className="font-mono text-slate-300 font-semibold">{currentUser.id}</span>
            </p>
          </div>

          <button
            onClick={() => setShowEditProfileModal(false)}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          
          {/* Avatar Upload & Chooser */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Profile Photo & Avatar
            </label>
            
            <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700 flex flex-col sm:flex-row items-center gap-3.5">
              <img 
                src={avatar} 
                alt={name} 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md shadow-blue-500/20 shrink-0"
              />

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingPhoto ? 'Uploading...' : 'Upload New Photo'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.setAttribute('capture', 'user');
                        fileInputRef.current.click();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold border border-slate-600 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-slate-300" />
                    <span>Camera</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">JPG, PNG, or WEBP up to 5MB.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Presets:</span>
              {GHANA_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setAvatar(av.url)}
                  className={`relative rounded-xl p-0.5 shrink-0 border-2 transition-all cursor-pointer ${
                    avatar === av.url 
                      ? 'border-blue-500 bg-blue-500/20 scale-105' 
                      : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                  title={av.name}
                >
                  <img src={av.url} alt={av.name} className="w-9 h-9 rounded-lg object-cover" />
                  {avatar === av.url && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-2 h-2" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Entity Type / Registration Category */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Registration Category & Leaderboard Tier
              </label>
              <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                Live Sync with National Leaderboard
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setEntityType('INDIVIDUAL')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  entityType === 'INDIVIDUAL'
                    ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs">Individual</span>
                </div>
                <span className="text-[9px] text-slate-400 block">Solo Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => setEntityType('SCHOOL')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  entityType === 'SCHOOL'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white font-bold'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <School className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs">School</span>
                </div>
                <span className="text-[9px] text-slate-400 block">Campus Hub</span>
              </button>

              <button
                type="button"
                onClick={() => setEntityType('COMMUNITY')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  entityType === 'COMMUNITY'
                    ? 'bg-purple-600/20 border-purple-500 text-white font-bold'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs">Community</span>
                </div>
                <span className="text-[9px] text-slate-400 block">Electoral Area</span>
              </button>

              <button
                type="button"
                onClick={() => setEntityType('ORGANIZATION')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  entityType === 'ORGANIZATION'
                    ? 'bg-amber-600/20 border-amber-500 text-white font-bold'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs">Organisation</span>
                </div>
                <span className="text-[9px] text-slate-400 block">Corporate/NGO</span>
              </button>
            </div>
          </div>

          {/* Dynamic Entity Institution Name & Size */}
          {entityType !== 'INDIVIDUAL' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {entityType === 'SCHOOL' ? 'School / University Name' :
                   entityType === 'COMMUNITY' ? 'Community Name' : 'Organisation Name'}
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. Ashesi University or Madina Clean Hub"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {entityType === 'SCHOOL' ? 'Estimated Students / Members' :
                   entityType === 'COMMUNITY' ? 'Estimated Residents / Volunteers' : 'Staff / Member Size'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={memberCount}
                  onChange={(e) => setMemberCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                {entityType === 'INDIVIDUAL' ? 'Full Name' : 'Lead Representative / Contact Person'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Ghana Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email & Organization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Affiliated Institution / Sub-Division
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Dept of Physics / Sustainability Unit"
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Leaderboard Opt-in toggle */}
          <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-white block">Leaderboard Championship Participation</span>
                <span className="text-[10px] text-slate-400 block">Include profile in public national ranking and award leagues</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={leaderboardOptIn}
                onChange={(e) => setLeaderboardOptIn(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Community & Detailed Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Community / City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  {GHANA_COMMUNITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {community === 'Other / Custom Community' ? (
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Custom Location
                </label>
                <input
                  type="text"
                  value={customCommunity}
                  onChange={(e) => setCustomCommunity(e.target.value)}
                  placeholder="e.g. Kasoa, Ashaiman..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Address / Pickup Point
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Commonwealth Hall Room B12"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Ghana Card ID (Optional) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Ghana Card PIN / Student ID (Optional)
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                value={ghanaCardNumber}
                onChange={(e) => setGhanaCardNumber(e.target.value)}
                placeholder="GHA-7XXXXXXXX-X"
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Biometric WebAuthn Security & MoMo Shield Settings */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                }`}>
                  {isFace ? <ScanFace className="w-4 h-4" /> : <Fingerprint className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    Biometric Authentication (WebAuthn / Passkeys)
                    {isEnabled ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.2 rounded-full border border-emerald-500/30">
                        {isFace ? 'Face ID Active' : 'Active'}
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.2 rounded-full border border-amber-500/30">
                        Setup Required
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isEnabled 
                      ? `${currentUser.biometricDeviceName || 'Platform Authenticator'} • Level 2 Hardware Security`
                      : 'Enroll Face ID, Windows Hello, or Fingerprint for 1-touch MoMo payouts'}
                  </p>
                </div>
              </div>

              {/* Action: Enroll or Remove */}
              <div>
                {isEnabled ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        setIsTestingSensor(true);
                        try {
                          await authenticateWithBiometrics('TEST_PROMPT', 'Testing Biometric Hardware Sensor');
                        } finally {
                          setIsTestingSensor(false);
                        }
                      }}
                      disabled={isTestingSensor}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-bold transition-all flex items-center gap-1"
                    >
                      {isTestingSensor ? <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" /> : <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                      <span>Test Sensor</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => removeUserBiometrics(currentUser.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-bold border border-rose-500/30 transition-all flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      setIsEnrollingBio(true);
                      try {
                        await registerUserBiometrics(currentUser);
                      } finally {
                        setIsEnrollingBio(false);
                      }
                    }}
                    disabled={isEnrollingBio}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
                  >
                    {isEnrollingBio ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        {isFace ? <ScanFace className="w-3.5 h-3.5" /> : <Fingerprint className="w-3.5 h-3.5" />}
                        <span>Enroll Passkey</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* MoMo Biometric Transaction Security Configuration */}
            {isEnabled && (
              <div className="pt-3 border-t border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      MoMo Payout Security Policy
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Choose when the {isFace ? 'Face ID' : 'Biometric'} sensor is required for Mobile Money withdrawals.
                    </span>
                  </div>
                </div>

                {/* 3 Policy Radio Choices */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  
                  {/* Option 1: ALWAYS */}
                  <button
                    type="button"
                    onClick={() => {
                      setMomoBiometricPolicy('ALWAYS');
                      setRequireBiometricForMoMo(true);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      momoBiometricPolicy === 'ALWAYS'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1 text-emerald-300">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Every Transfer
                      </span>
                      {momoBiometricPolicy === 'ALWAYS' && (
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Always require biometric scan for 100% of cash-outs.
                    </p>
                  </button>

                  {/* Option 2: THRESHOLD_ONLY */}
                  <button
                    type="button"
                    onClick={() => {
                      setMomoBiometricPolicy('THRESHOLD_ONLY');
                      setRequireBiometricForMoMo(true);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      momoBiometricPolicy === 'THRESHOLD_ONLY'
                        ? 'bg-blue-500/15 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/50'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1 text-blue-300">
                        <Sparkles className="w-3.5 h-3.5" />
                        Above Threshold
                      </span>
                      {momoBiometricPolicy === 'THRESHOLD_ONLY' && (
                        <div className="w-2 h-2 rounded-full bg-blue-400 shadow-xs" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Only prompt when transfer exceeds a specific GH₵ limit.
                    </p>
                  </button>

                  {/* Option 3: NEVER */}
                  <button
                    type="button"
                    onClick={() => {
                      setMomoBiometricPolicy('NEVER');
                      setRequireBiometricForMoMo(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      momoBiometricPolicy === 'NEVER'
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/50'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1 text-amber-300">
                        <Zap className="w-3.5 h-3.5" />
                        No Biometrics
                      </span>
                      {momoBiometricPolicy === 'NEVER' && (
                        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-xs" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Skip sensor prompt and cash out instantly.
                    </p>
                  </button>

                </div>

                {/* Threshold Configuration Controls (if THRESHOLD_ONLY) */}
                {momoBiometricPolicy === 'THRESHOLD_ONLY' && (
                  <div className="bg-slate-900/90 rounded-xl p-3.5 border border-blue-500/30 space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                        <span>Biometric Trigger Threshold Amount (GH₵):</span>
                      </label>
                      <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 font-mono text-xs font-black text-blue-400">
                        <span>GH₵</span>
                        <span>{Number(momoBiometricThresholdGhs).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Numeric Input & Presets */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">GH₵</span>
                        <input
                          type="number"
                          min="1"
                          max="500"
                          step="1"
                          value={momoBiometricThresholdGhs || ''}
                          onChange={(e) => setMomoBiometricThresholdGhs(Math.max(1, parseFloat(e.target.value) || 1))}
                          className="w-full pl-10 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                        />
                      </div>

                      {/* Preset Chips */}
                      <div className="flex items-center gap-1">
                        {[5, 10, 20, 50, 100].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setMomoBiometricThresholdGhs(val)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              momoBiometricThresholdGhs === val
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                            }`}
                          >
                            GH₵ {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-[10px] text-blue-300/90 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20 leading-relaxed">
                      💡 <strong>Smart Policy:</strong> Transfers below <strong>GH₵ {Number(momoBiometricThresholdGhs).toFixed(2)}</strong> will execute with 1-click fast checkout. Payouts of <strong>GH₵ {Number(momoBiometricThresholdGhs).toFixed(2)} or higher</strong> will mandate {isFace ? 'Face ID' : 'Fingerprint'} authentication.
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Ghanaian Dialect & Language Selection */}
          <div className="bg-slate-850 p-4 rounded-2xl border border-slate-700/80">
            <LanguageSwitcher variant="inline" />
          </div>

          </div>

          {/* Sticky Save Button Footer */}
          <div className="shrink-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 px-5 py-3.5 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowEditProfileModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
