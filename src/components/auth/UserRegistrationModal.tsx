import React, { useState, useRef } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  Factory, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Coins, 
  Info,
  CreditCard,
  Zap,
  Globe,
  Upload,
  Camera,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Fingerprint,
  ScanFace,
  Lock,
  School,
  Users,
  Trophy,
  Award
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { UserRole, EntityType } from '../../types';
import { LanguageSwitcher } from '../layout/LanguageSwitcher';
import { AdminLoginForm } from './AdminLoginForm';

// Curated Ghana Avatars
const GHANA_AVATARS = [
  { id: 'av-1', name: 'Bright (UG Student)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', tag: 'Citizen' },
  { id: 'av-2', name: 'Ama (KNUST Eco Club)', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=250', tag: 'Citizen' },
  { id: 'av-3', name: 'Kwame (Fleet Agent)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', tag: 'Collector' },
  { id: 'av-4', name: 'Kofi (Logistics Pro)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250', tag: 'Collector' },
  { id: 'av-5', name: 'UMaT SRID (EPA Admin)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250', tag: 'Admin' },
  { id: 'av-6', name: 'Abena (Circular Ops)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250', tag: 'Recycler' },
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

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export const UserRegistrationModal: React.FC = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    registerUser, 
    loginWithDemoUser,
    loginWithGoogle,
    isGoogleAuthLoading,
    isRegistered,
    authenticateWithBiometrics,
    registerUserBiometrics,
    biometricCapability,
    isBiometricsEnrolled
  } = useEcoSort();

  const [mode, setMode] = useState<'GOOGLE' | 'REGISTER' | 'DEMO_LOGIN' | 'BIOMETRIC' | 'ADMIN_LOGIN'>('GOOGLE');
  const [googleSelectedRole, setGoogleSelectedRole] = useState<UserRole>('USER');
  
  // Registration form state
  const [role, setRole] = useState<UserRole>('USER');
  const [entityType, setEntityType] = useState<EntityType>('INDIVIDUAL');
  const [name, setName] = useState<string>('');
  const [institutionName, setInstitutionName] = useState<string>('');
  const [memberCount, setMemberCount] = useState<number>(1);
  const [contactPerson, setContactPerson] = useState<string>('');
  const [schoolLevel, setSchoolLevel] = useState<'TERTIARY' | 'SHS' | 'BASIC' | 'HALL'>('TERTIARY');
  const [orgSector, setOrgSector] = useState<'CORPORATE' | 'NGO' | 'FAITH' | 'HOSPITALITY' | 'SME'>('CORPORATE');
  const [leaderboardOptIn, setLeaderboardOptIn] = useState<boolean>(true);
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [community, setCommunity] = useState<string>('University of Ghana (Legon Campus)');
  const [customCommunity, setCustomCommunity] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [organization, setOrganization] = useState<string>('University of Ghana');
  const [ghanaCardNumber, setGhanaCardNumber] = useState<string>('');
  const [avatar, setAvatar] = useState<string>(GHANA_AVATARS[0].url);
  const [customAvatarUploaded, setCustomAvatarUploaded] = useState<boolean>(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [enrollBiometricsOnRegister, setEnrollBiometricsOnRegister] = useState<boolean>(true);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isBiometricLoggingIn, setIsBiometricLoggingIn] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFace = biometricCapability?.biometricIconName === 'ScanFace';

  const handleGoogleSignIn = async (roleToUse?: UserRole) => {
    const targetRole = roleToUse || googleSelectedRole || 'USER';
    const profile = await loginWithGoogle(targetRole);
    if (profile) {
      setShowAuthModal(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, avatar: 'Please select an image file (PNG, JPG, JPEG, WEBP).' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: 'Photo size should be less than 5MB.' }));
      return;
    }

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatar(dataUrl);
        setCustomAvatarUploaded(true);
        setErrors(prev => ({ ...prev, avatar: '' }));
      }
      setIsUploadingPhoto(false);
    };
    reader.onerror = () => {
      setErrors(prev => ({ ...prev, avatar: 'Failed to read the selected image.' }));
      setIsUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomAvatar = () => {
    setAvatar(GHANA_AVATARS[0].url);
    setCustomAvatarUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!showAuthModal) return null;

  // Detect Ghana Network Carrier
  const getNetwork = (num: string): 'MTN' | 'Telecel' | 'AT' | 'Other' => {
    const clean = num.replace(/\D/g, '');
    if (/^(024|054|055|059|23324|23354|23355|23359)/.test(clean)) return 'MTN';
    if (/^(020|050|23320|23350)/.test(clean)) return 'Telecel';
    if (/^(027|057|026|056|23327|23357|23326|23356)/.test(clean)) return 'AT';
    return 'Other';
  };

  const detectedNetwork = getNetwork(phone);

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = entityType === 'INDIVIDUAL' ? 'Contact name is required' : 'Lead contact / representative name is required';
    if (entityType !== 'INDIVIDUAL' && !institutionName.trim()) {
      errs.institutionName = entityType === 'SCHOOL' ? 'School / University name is required' :
                             entityType === 'COMMUNITY' ? 'Community name is required' :
                             'Organization name is required';
    }
    if (!phone.trim()) {
      errs.phone = 'Ghana phone number is required';
    } else if (phone.replace(/\D/g, '').length < 9) {
      errs.phone = 'Please enter a valid 10-digit Ghana number';
    }
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email address is required';
    if (community === 'Other / Custom Community' && !customCommunity.trim()) {
      errs.community = 'Please specify your community';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!agreedTerms) {
      setErrors(prev => ({ ...prev, terms: 'Please agree to terms and EPA data privacy' }));
      return;
    }

    setIsSubmitting(true);

    setTimeout(async () => {
      const finalLocation = community === 'Other / Custom Community' ? customCommunity : community;
      const finalInstitution = entityType === 'INDIVIDUAL'
        ? (organization.trim() || 'Independent Citizen')
        : (institutionName.trim() || organization.trim() || name.trim());

      const newUser = registerUser({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        location: finalLocation,
        community: finalLocation,
        address: address.trim() || `${finalLocation} Drop Point`,
        organization: finalInstitution,
        role,
        entityType,
        institutionName: finalInstitution,
        memberCount: entityType === 'INDIVIDUAL' ? 1 : Math.max(1, memberCount),
        contactPerson: contactPerson.trim() || name.trim(),
        leaderboardOptIn,
        avatar,
        ghanaCardNumber: ghanaCardNumber.trim(),
        ghanaTelecomNetwork: detectedNetwork
      });

      if (enrollBiometricsOnRegister && newUser) {
        try {
          await registerUserBiometrics(newUser);
        } catch {
          // ignore if user cancelled prompt
        }
      }

      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl max-w-3xl lg:max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[94vh] text-slate-800">
        
        {/* Top Header Banner (Sticky) */}
        <div className="shrink-0 relative bg-gradient-to-r from-emerald-700 via-teal-700 to-blue-700 px-4 sm:px-6 py-4 sm:py-5 border-b border-emerald-800/40 text-white">
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-3.5 right-3.5 text-white/80 hover:text-white p-2 rounded-xl bg-black/20 hover:bg-black/30 border border-white/20 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <img 
              src="/logo.png" 
              alt="EcoSort" 
              className="w-7 h-7 rounded-lg object-contain bg-white p-0.5 shadow-sm ring-1 ring-white/20"
              referrerPolicy="no-referrer"
            />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-emerald-100 uppercase px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25">
              EPA GHANA DIGITAL CITIZEN REGISTRY
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {mode === 'GOOGLE' 
                  ? 'Sign In with Google' 
                  : mode === 'REGISTER' 
                  ? 'Register for EcoSort Ghana' 
                  : mode === 'BIOMETRIC' 
                  ? '1-Touch Biometric Sign-In' 
                  : mode === 'ADMIN_LOGIN'
                  ? 'EPA Admin Command Login'
                  : 'Select Demo Persona'}
              </h2>
              <p className="text-emerald-50/90 text-xs mt-0.5 max-w-xl font-medium">
                {mode === 'GOOGLE'
                  ? 'Authenticate securely with your Google Account for real-time Cloud Firestore synchronization & +50 EcoPoints.'
                  : mode === 'REGISTER' 
                  ? 'Join Ghana’s national smart recycling grid. Upload waste, earn EcoPoints, and request instant MoMo payouts.' 
                  : mode === 'BIOMETRIC'
                  ? 'Zero-password authentication with device-bound WebAuthn passkey.'
                  : mode === 'ADMIN_LOGIN'
                  ? 'Authorized administrator login with username "UMaT SRID" and password "wine2026".'
                  : 'Explore the platform instantly using a pre-configured Ghanaian pilot role.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => setMode('GOOGLE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  mode === 'GOOGLE' 
                    ? 'bg-white text-slate-900 shadow-md ring-2 ring-white/60 font-extrabold' 
                    : 'bg-black/25 text-white/90 hover:text-white hover:bg-black/35 border border-white/20'
                }`}
              >
                <GoogleIcon className="w-3.5 h-3.5" />
                <span>Google Sign-In</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('REGISTER')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  mode === 'REGISTER' 
                    ? 'bg-white text-emerald-800 shadow-md ring-2 ring-white/60 font-extrabold' 
                    : 'bg-black/25 text-white/90 hover:text-white hover:bg-black/35 border border-white/20'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Manual Form</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('BIOMETRIC')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  mode === 'BIOMETRIC' 
                    ? 'bg-emerald-400 text-emerald-950 font-black shadow-md ring-2 ring-white/60' 
                    : 'bg-black/25 text-white/90 hover:text-white hover:bg-black/35 border border-white/20'
                }`}
              >
                {isFace ? <ScanFace className="w-3.5 h-3.5" /> : <Fingerprint className="w-3.5 h-3.5" />}
                <span>Passkey</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('ADMIN_LOGIN')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  mode === 'ADMIN_LOGIN' 
                    ? 'bg-purple-400 text-purple-950 font-black shadow-md ring-2 ring-white/60' 
                    : 'bg-black/25 text-white/90 hover:text-white hover:bg-black/35 border border-white/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('DEMO_LOGIN')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  mode === 'DEMO_LOGIN' 
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-2 ring-white/60' 
                    : 'bg-black/25 text-white/90 hover:text-white hover:bg-black/35 border border-white/20'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Demo Roles</span>
              </button>
            </div>
          </div>
        </div>

        {/* Google Authentication View */}
        {mode === 'GOOGLE' ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-center animate-in fade-in bg-white">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center mx-auto shadow-xs">
              <GoogleIcon className="w-8 h-8" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg font-black text-slate-900">
                Sign In with your Google Account
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect seamlessly with Google for instant cloud-synced recycling receipts, automated MoMo payouts, and global leaderboard rankings.
              </p>
            </div>

            {/* Select Role for Google Sign-In */}
            <div className="max-w-md mx-auto text-left space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Select Your EcoSort Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGoogleSelectedRole('USER')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    googleSelectedRole === 'USER'
                      ? 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-xs ring-1 ring-emerald-500/50'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">Citizen / Student</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Sort & earn MoMo points</p>
                </button>

                <button
                  type="button"
                  onClick={() => setGoogleSelectedRole('COLLECTION_AGENT')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    googleSelectedRole === 'COLLECTION_AGENT'
                      ? 'bg-amber-50 border-amber-500 text-slate-900 shadow-xs ring-1 ring-amber-500/50'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900">Fleet Collector</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Accept pickup routes</p>
                </button>

                <button
                  type="button"
                  onClick={() => setGoogleSelectedRole('RECYCLER')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    googleSelectedRole === 'RECYCLER'
                      ? 'bg-teal-50 border-teal-500 text-slate-900 shadow-xs ring-1 ring-teal-500/50'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Factory className="w-3.5 h-3.5 text-teal-600" />
                    <span className="text-xs font-bold text-slate-900">Industrial Recycler</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Source bulk materials</p>
                </button>

                <button
                  type="button"
                  onClick={() => setGoogleSelectedRole('ADMIN')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    googleSelectedRole === 'ADMIN'
                      ? 'bg-purple-50 border-purple-500 text-slate-900 shadow-xs ring-1 ring-purple-500/50'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-xs font-bold text-slate-900">EPA Officer</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Municipal monitoring</p>
                </button>
              </div>
            </div>

            {/* Cloud Firestore & Security Assurance */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Database Layer:</span>
                <span className="font-semibold text-emerald-700">Firebase Firestore (Cloud Synced)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Sign-In Bonus:</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-500" />
                  +50 Welcome EcoPoints
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Identity Security:</span>
                <span className="font-semibold text-slate-800">OAuth 2.0 / Google Identity Services</span>
              </div>
            </div>

            {/* Google Sign-In Action Button */}
            <div className="max-w-md mx-auto space-y-3">
              <button
                type="button"
                id="modal-google-signin-btn"
                onClick={() => handleGoogleSignIn(googleSelectedRole)}
                disabled={isGoogleAuthLoading}
                className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border-2 border-slate-300 hover:border-slate-400 shadow-md flex items-center justify-center gap-3 cursor-pointer transition-all disabled:opacity-50"
              >
                {isGoogleAuthLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Signing in with Google...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-5 h-5" />
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => setMode('REGISTER')}
                  className="hover:text-emerald-700 underline cursor-pointer font-medium"
                >
                  Manual Registration Form
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setMode('DEMO_LOGIN')}
                  className="hover:text-amber-700 underline cursor-pointer font-medium"
                >
                  Explore Demo Personas
                </button>
              </div>
            </div>
          </div>
        ) : mode === 'BIOMETRIC' ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-center animate-in fade-in bg-white">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              {isFace ? <ScanFace className="w-8 h-8 animate-pulse" /> : <Fingerprint className="w-8 h-8 animate-pulse" />}
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg font-black text-slate-900">
                Fast Biometric Sign-In
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scan your Face ID, Touch ID, or Windows Hello passkey registered on this device for instant zero-password authentication.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Device Hardware:</span>
                <span className="font-semibold text-emerald-700">{biometricCapability?.biometricTypeLabel || (biometricCapability as any)?.biometricLabel || 'Biometric Sensor'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Security Standard:</span>
                <span className="font-mono text-slate-700 font-semibold">FIDO2 / WebAuthn L2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Passkey Enclave:</span>
                <span className="font-bold text-slate-800">
                  {isBiometricsEnrolled ? 'Credentials Enrolled' : 'Ready for Instant Scan'}
                </span>
              </div>
            </div>

            <div className="max-w-md mx-auto space-y-3">
              <button
                type="button"
                onClick={async () => {
                  setIsBiometricLoggingIn(true);
                  try {
                    const res = await authenticateWithBiometrics('LOGIN', '1-Touch EcoSort Ghana Sign-In');
                    if (res.success) {
                      setShowAuthModal(false);
                    }
                  } finally {
                    setIsBiometricLoggingIn(false);
                  }
                }}
                disabled={isBiometricLoggingIn}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isBiometricLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Biometric Assertion...</span>
                  </>
                ) : (
                  <>
                    {isFace ? <ScanFace className="w-4 h-4" /> : <Fingerprint className="w-4 h-4" />}
                    <span>Scan {isFace ? 'Face ID' : 'Fingerprint'} to Sign In</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMode('REGISTER')}
                className="text-xs text-slate-500 hover:text-emerald-700 underline block mx-auto cursor-pointer font-medium"
              >
                Don&apos;t have a passkey yet? Create an account
              </button>
            </div>
          </div>
        ) : mode === 'DEMO_LOGIN' ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 bg-white">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700">
                <p className="font-bold text-amber-900 mb-0.5">Instant Role Testing</p>
                Select an established Ghanaian persona to test the respective workflow without filling out registration.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => loginWithDemoUser('USER')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-500/60 text-left transition-all group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img src={GHANA_AVATARS[0].url} alt="Bright" className="w-11 h-11 rounded-xl object-cover border border-slate-200" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">Bright Mensah</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">Citizen • UG Student</span>
                    <span className="text-[10px] text-slate-500 block">425 EcoPoints • Legon</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => loginWithDemoUser('COLLECTION_AGENT')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-500/60 text-left transition-all group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img src={GHANA_AVATARS[2].url} alt="Kwame" className="w-11 h-11 rounded-xl object-cover border border-slate-200" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-700">Kwame Asante</span>
                    <span className="text-[10px] text-amber-700 font-semibold block">Field Logistics Agent</span>
                    <span className="text-[10px] text-slate-500 block">Madina & Legon Route</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => loginWithDemoUser('RECYCLER')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-500/60 text-left transition-all group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img src={GHANA_AVATARS[5].url} alt="EcoPlast" className="w-11 h-11 rounded-xl object-cover border border-slate-200" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">Accra Circular Plastics</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">Industrial Recycler</span>
                    <span className="text-[10px] text-slate-500 block">Tema Industrial Area</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setMode('ADMIN_LOGIN')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-500/60 text-left transition-all group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img src={GHANA_AVATARS[4].url} alt="UMaT SRID" className="w-11 h-11 rounded-xl object-cover border border-slate-200" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-700">UMaT SRID</span>
                    <span className="text-[10px] text-purple-700 font-semibold block">EPA Command Officer</span>
                    <span className="text-[10px] text-slate-500 block font-mono">User: UMaT SRID • Pass: wine2026</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Quick Google Sign In from Demo Tab */}
            <div className="pt-2">
              <button
                type="button"
                id="demo-google-signin-btn"
                onClick={() => handleGoogleSignIn('USER')}
                disabled={isGoogleAuthLoading}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-xs flex items-center justify-center gap-2.5 cursor-pointer transition-all disabled:opacity-50"
              >
                {isGoogleAuthLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>Signing in with Google...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-4 h-4" />
                    <span>Or Sign in with your real Google Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : mode === 'ADMIN_LOGIN' ? (
          /* EPA Ghana Official Admin Authentication View */
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white flex flex-col items-center justify-center animate-in fade-in">
            <AdminLoginForm 
              inline
              onSuccess={() => setShowAuthModal(false)}
              onCancel={() => setMode('DEMO_LOGIN')}
            />
          </div>
        ) : (
          /* User Registration Form with Scrollable Content + Sticky Action Footer */
          <form onSubmit={handleRegister} className="flex-1 flex flex-col overflow-hidden bg-white">
            
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-5">
              
              {/* Quick Google Sign-In Option */}
              <div className="bg-gradient-to-r from-slate-50 via-emerald-50/40 to-slate-50 border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs shrink-0">
                      <GoogleIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Skip manual entry with Google</h4>
                      <p className="text-[11px] text-slate-500">1-Click sign in with your Google Account & auto-claim 50 EcoPoints</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="form-google-signin-btn"
                    onClick={() => handleGoogleSignIn(role)}
                    disabled={isGoogleAuthLoading}
                    className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-sm shrink-0 disabled:opacity-50"
                  >
                    {isGoogleAuthLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <GoogleIcon className="w-3.5 h-3.5" />
                        <span>Sign in with Google</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute">
                  or register manually below
                </span>
              </div>

              {/* Step 1: Select Registration Entity Type */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    1. Register As (Entity Type)
                  </label>
                  <span className="text-[10px] sm:text-[11px] text-amber-600 font-bold flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    Leaderboard Eligible
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  
                  {/* Individual */}
                  <button
                    type="button"
                    onClick={() => {
                      setEntityType('INDIVIDUAL');
                      setRole('USER');
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                      entityType === 'INDIVIDUAL'
                        ? 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-xs ring-1 ring-emerald-500/50'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${entityType === 'INDIVIDUAL' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900">Individual</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">Citizens & students</p>
                  </button>

                  {/* School */}
                  <button
                    type="button"
                    onClick={() => {
                      setEntityType('SCHOOL');
                      setRole('USER');
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                      entityType === 'SCHOOL'
                        ? 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-xs ring-1 ring-emerald-500/50'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${entityType === 'SCHOOL' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <School className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900">School / Campus</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">Basic, SHS & Uni</p>
                  </button>

                  {/* Community */}
                  <button
                    type="button"
                    onClick={() => {
                      setEntityType('COMMUNITY');
                      setRole('USER');
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                      entityType === 'COMMUNITY'
                        ? 'bg-purple-50 border-purple-500 text-slate-900 shadow-xs ring-1 ring-purple-500/50'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${entityType === 'COMMUNITY' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900">Community</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">Towns & clubs</p>
                  </button>

                  {/* Organisation */}
                  <button
                    type="button"
                    onClick={() => {
                      setEntityType('ORGANIZATION');
                      setRole('USER');
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                      entityType === 'ORGANIZATION'
                        ? 'bg-amber-50 border-amber-500 text-slate-900 shadow-xs ring-1 ring-amber-500/50'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${entityType === 'ORGANIZATION' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900">Organisation</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">Corporates & NGOs</p>
                  </button>

                </div>
              </div>

              {/* Step 2: Ecosystem Operational Role */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  2. Operational Ecosystem Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  
                  <button
                    type="button"
                    onClick={() => setRole('USER')}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      role === 'USER'
                        ? 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-xs ring-1 ring-emerald-500/60'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <GraduationCap className={`w-4 h-4 ${role === 'USER' ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-900">
                        {entityType === 'SCHOOL' ? 'Campus Recycler' :
                         entityType === 'COMMUNITY' ? 'Community Hub' :
                         entityType === 'ORGANIZATION' ? 'ESG Node' : 'Citizen / Student'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">Upload waste & earn MoMo</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('COLLECTION_AGENT')}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      role === 'COLLECTION_AGENT'
                        ? 'bg-amber-50 border-amber-500 text-slate-900 shadow-xs ring-1 ring-amber-500/60'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <Truck className={`w-4 h-4 ${role === 'COLLECTION_AGENT' ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-900">Field Agent</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Doorstep pickup & verification</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('RECYCLER')}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      role === 'RECYCLER'
                        ? 'bg-teal-50 border-teal-500 text-slate-900 shadow-xs ring-1 ring-teal-500/60'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <Factory className={`w-4 h-4 ${role === 'RECYCLER' ? 'text-teal-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-900">Recycling Partner</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Bulk factory feedstock batches</p>
                  </button>

                </div>
              </div>

              {/* Step 3: Entity Information & Contact Details */}
              <div className="space-y-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  3. {entityType === 'INDIVIDUAL' ? 'User Info & Ghana Contact Details' : `${entityType} Details & Focal Person`}
                </label>

                {/* Dynamic Entity Name Fields for School/Community/Org */}
                {entityType !== 'INDIVIDUAL' && (
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {entityType === 'SCHOOL' ? 'School / University / Campus Name' :
                           entityType === 'COMMUNITY' ? 'Community / Electoral Area Name' :
                           'Organisation / Company / Church Name'} <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          {entityType === 'SCHOOL' ? <School className="w-4 h-4 absolute left-3 top-2.5 text-emerald-600" /> :
                           entityType === 'COMMUNITY' ? <Users className="w-4 h-4 absolute left-3 top-2.5 text-purple-600" /> :
                           <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-amber-600" />}
                          <input
                            type="text"
                            value={institutionName}
                            onChange={(e) => {
                              setInstitutionName(e.target.value);
                              if (errors.institutionName) setErrors(prev => ({ ...prev, institutionName: '' }));
                            }}
                            placeholder={
                              entityType === 'SCHOOL' ? 'e.g. Achimota School or Ashesi University' :
                              entityType === 'COMMUNITY' ? 'e.g. Madina Zongo Clean Taskforce' :
                              'e.g. MTN Ghana Foundation or Stanbic Green Club'
                            }
                            className={`w-full pl-9 pr-3 py-2 rounded-xl bg-white border text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                              errors.institutionName ? 'border-rose-400' : 'border-slate-300'
                            }`}
                          />
                        </div>
                        {errors.institutionName && <p className="text-[10px] text-rose-500 mt-1">{errors.institutionName}</p>}
                      </div>

                      {/* Member Count / Size */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {entityType === 'SCHOOL' ? 'Estimated Student / Member Count' :
                           entityType === 'COMMUNITY' ? 'Estimated Active Residents / Volunteers' :
                           'Staff / Congregation / Member Size'}
                        </label>
                        <div className="relative">
                          <Users className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                          <input
                            type="number"
                            min="1"
                            value={memberCount}
                            onChange={(e) => setMemberCount(Math.max(1, parseInt(e.target.value) || 1))}
                            placeholder="e.g. 150"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                    </div>

                    {/* Subcategory selectors */}
                    {entityType === 'SCHOOL' && (
                      <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                        <span className="text-[10px] text-slate-500 shrink-0 font-medium">Level:</span>
                        {(['TERTIARY', 'SHS', 'BASIC', 'HALL'] as const).map(lvl => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setSchoolLevel(lvl)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              schoolLevel === lvl ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-300'
                            }`}
                          >
                            {lvl === 'TERTIARY' ? 'Tertiary' :
                             lvl === 'SHS' ? 'Senior High (SHS)' :
                             lvl === 'BASIC' ? 'Basic School' : 'Campus Hall'}
                          </button>
                        ))}
                      </div>
                    )}

                    {entityType === 'ORGANIZATION' && (
                      <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                        <span className="text-[10px] text-slate-500 shrink-0 font-medium">Sector:</span>
                        {(['CORPORATE', 'NGO', 'FAITH', 'HOSPITALITY', 'SME'] as const).map(sec => (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => setOrgSector(sec)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              orgSector === sec ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-300'
                            }`}
                          >
                            {sec === 'CORPORATE' ? 'Corporate' :
                             sec === 'NGO' ? 'NGO' :
                             sec === 'FAITH' ? 'Religious' :
                             sec === 'HOSPITALITY' ? 'Hospitality' : 'SME'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Full Name / Lead Representative */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {entityType === 'INDIVIDUAL' ? 'Full Name' : 'Lead Representative / Focal Person'} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                        }}
                        placeholder={entityType === 'INDIVIDUAL' ? "e.g. Ama Serwaa Frimpong" : "e.g. Dr. Kwame Mensah (Lead)"}
                        className={`w-full pl-9 pr-3 py-2 rounded-xl bg-white border text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          errors.name ? 'border-rose-400' : 'border-slate-300'
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone Number + Carrier Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        Ghana Phone / MoMo <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1">
                          📲 httpSMS Alert
                        </span>
                        {phone.length >= 3 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                            {detectedNetwork === 'MTN' ? '🟡 MTN MoMo' : detectedNetwork === 'Telecel' ? '🔴 Telecel Cash' : detectedNetwork === 'AT' ? '🔵 AT Money' : 'Ghana Mobile'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                        }}
                        placeholder="024 123 4567 or +233 24..."
                        className={`w-full pl-9 pr-3 py-2 rounded-xl bg-white border text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          errors.phone ? 'border-rose-400' : 'border-slate-300'
                        }`}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Instant Akwaaba SMS & MoMo transaction receipts sent via httpSMS.
                    </p>
                    {errors.phone && <p className="text-[10px] text-rose-500 mt-0.5">{errors.phone}</p>}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                        }}
                        placeholder={entityType === 'INDIVIDUAL' ? "user@gmail.com" : "sustainability@domain.gh"}
                        className={`w-full pl-9 pr-3 py-2 rounded-xl bg-white border text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          errors.email ? 'border-rose-400' : 'border-slate-300'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Location & Community Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Community / City Zone <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <select
                        value={community}
                        onChange={(e) => setCommunity(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                      >
                        {GHANA_COMMUNITIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>

                {/* Detailed Address or Custom Location */}
                {community === 'Other / Custom Community' ? (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Specify Custom Location <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customCommunity}
                      onChange={(e) => setCustomCommunity(e.target.value)}
                      placeholder="e.g. Ashaiman, Kasoa, Sunyani..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Detailed Address / Hall / Campus Landmark
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Commonwealth Hall, Room B12 / Head Office Block C, Accra"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                {/* Ghana Card ID (Optional) */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Ghana Card PIN / Institutional Reg ID <span className="text-slate-400 font-normal">(Optional for Gold tier)</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={ghanaCardNumber}
                      onChange={(e) => setGhanaCardNumber(e.target.value)}
                      placeholder="GHA-7XXXXXXXX-X or REG-XXXXXX"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

              </div>

              {/* Step 4: Profile Picture & Avatar */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    4. Profile Photo & Avatar
                  </label>
                  <span className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold">
                    {customAvatarUploaded ? '✨ Custom photo uploaded' : 'Upload photo or choose avatar'}
                  </span>
                </div>

                {/* Upload & Preview Card */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                  
                  {/* Active Photo Preview */}
                  <div className="relative shrink-0 group">
                    <img 
                      src={avatar} 
                      alt="Selected Profile" 
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                    />
                    {customAvatarUploaded && (
                      <div className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white p-0.5 rounded-full shadow-xs">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Upload Action Controls */}
                  <div className="flex-1 space-y-1.5 text-center sm:text-left">
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
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingPhoto ? 'Uploading...' : 'Upload Picture'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.setAttribute('capture', 'user');
                            fileInputRef.current.click();
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Take a photo using camera"
                      >
                        <Camera className="w-3.5 h-3.5 text-slate-700" />
                        <span>Take Photo</span>
                      </button>

                      {customAvatarUploaded && (
                        <button
                          type="button"
                          onClick={handleRemoveCustomAvatar}
                          className="px-2 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          title="Remove uploaded photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-500">
                      JPG, PNG or WEBP up to 5MB.
                    </p>

                    {errors.avatar && (
                      <p className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
                        <X className="w-3 h-3" /> {errors.avatar}
                      </p>
                    )}
                  </div>
                </div>

                {/* Or Select from Curated Ghana Avatars */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {GHANA_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        setAvatar(av.url);
                        setCustomAvatarUploaded(false);
                        if (errors.avatar) setErrors(prev => ({ ...prev, avatar: '' }));
                      }}
                      className={`relative rounded-xl p-0.5 shrink-0 border-2 transition-all cursor-pointer ${
                        avatar === av.url && !customAvatarUploaded
                          ? 'border-emerald-600 bg-emerald-50 scale-105 shadow-sm' 
                          : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                      }`}
                      title={av.name}
                    >
                      <img src={av.url} alt={av.name} className="w-9 h-9 rounded-lg object-cover" />
                      {avatar === av.url && !customAvatarUploaded && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ghanaian Dialect & Language Selection */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <LanguageSwitcher variant="inline" />
              </div>

              {/* Two Column Feature Badges: Welcome Grant + Biometric Passkey */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                
                {/* Welcome Grant Banner */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        +50 EcoPoints Bonus
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        Credited instantly on registration
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300 shrink-0">
                    FREE
                  </span>
                </div>

                {/* Biometric Passkey Opt-In */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-emerald-300/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center font-bold shrink-0">
                      {isFace ? <ScanFace className="w-4 h-4" /> : <Fingerprint className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 truncate block">
                        Enroll {isFace ? 'Face ID' : 'Biometrics'}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate block">
                        1-touch MoMo payouts
                      </span>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={enrollBiometricsOnRegister}
                      onChange={(e) => setEnrollBiometricsOnRegister(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

              </div>

              {/* National Leaderboard Championship Opt-In */}
              <div className="bg-gradient-to-r from-amber-50 via-slate-50 to-slate-50 rounded-2xl p-3 border border-amber-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center font-bold shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                      Ghana Leaderboard Championship
                    </span>
                    <span className="text-[10px] text-slate-500 truncate block">
                      Participate for quarterly EPA green grants & awards.
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={leaderboardOptIn}
                    onChange={(e) => setLeaderboardOptIn(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

            </div>

            {/* Sticky Action Footer (Always Visible on Screen) */}
            <div className="shrink-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="space-y-0.5 w-full sm:w-auto">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => {
                      setAgreedTerms(e.target.checked);
                      if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                    }}
                    className="mt-0.5 rounded bg-white border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-[11px] leading-tight font-medium">
                    I consent to EPA Ghana Environmental Protection Act waste recycling protocol.
                  </span>
                </label>
                {errors.terms && <p className="text-[10px] text-rose-500 font-semibold">{errors.terms}</p>}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
                >
                  Close
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Provisioning ID...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

