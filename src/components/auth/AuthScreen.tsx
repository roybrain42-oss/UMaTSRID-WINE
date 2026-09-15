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
  CheckCircle2, 
  ArrowRight, 
  Coins, 
  CreditCard,
  Zap,
  Fingerprint,
  ScanFace,
  Lock,
  Eye,
  EyeOff,
  School,
  Users,
  LogIn,
  UserPlus,
  AlertCircle,
  HelpCircle,
  Smartphone,
  Check
} from 'lucide-react';
import { useEcoSort, ADMIN_AUTH_CONFIG } from '../../context/EcoSortContext';
import { UserRole, EntityType } from '../../types';
import { LanguageSwitcher } from '../layout/LanguageSwitcher';

// Curated Ghana Cultural Avatars
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

export const AuthScreen: React.FC<{ initialTab?: 'SIGN_IN' | 'SIGN_UP' }> = ({ initialTab = 'SIGN_UP' }) => {
  const { 
    registerUser, 
    loginWithDemoUser,
    loginWithGoogle,
    isGoogleAuthLoading,
    loginWithIdentifier,
    loginAsAdminWithCredentials,
    authenticateWithBiometrics,
    registerUserBiometrics,
    biometricCapability
  } = useEcoSort();

  // Primary mode defaults to 'SIGN_UP' so the first screen is the Sign Up page
  const [primaryTab, setPrimaryTab] = useState<'SIGN_IN' | 'SIGN_UP'>(initialTab);

  // Sign in sub-method
  const [signInMethod, setSignInMethod] = useState<'PHONE_EMAIL' | 'GOOGLE' | 'PASSKEY' | 'ADMIN'>('PHONE_EMAIL');

  // Sign In inputs
  const [loginIdentifier, setLoginIdentifier] = useState<string>('024 892 4110');
  const [loginPassword, setLoginPassword] = useState<string>('••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Admin inputs
  const [adminUser, setAdminUser] = useState<string>('UMaT SRID');
  const [adminPass, setAdminPass] = useState<string>('wine2026');
  const [adminError, setAdminError] = useState<string>('');

  // Google sign in role
  const [googleSelectedRole, setGoogleSelectedRole] = useState<UserRole>('USER');

  // Registration Form inputs
  const [entityType, setEntityType] = useState<EntityType>('INDIVIDUAL');
  const [role, setRole] = useState<UserRole>('USER');
  const [name, setName] = useState<string>('');
  const [institutionName, setInstitutionName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [community, setCommunity] = useState<string>('University of Ghana (Legon Campus)');
  const [customCommunity, setCustomCommunity] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [ghanaCardNumber, setGhanaCardNumber] = useState<string>('');
  const [avatar, setAvatar] = useState<string>(GHANA_AVATARS[0].url);
  const [enrollBiometricsOnRegister, setEnrollBiometricsOnRegister] = useState<boolean>(true);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(true);
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFace = biometricCapability?.biometricIconName === 'ScanFace';

  // Detect Ghana Network Carrier
  const getNetwork = (num: string): 'MTN' | 'Telecel' | 'AT' | 'Other' => {
    const clean = num.replace(/\D/g, '');
    if (/^(024|054|055|059|23324|23354|23355|23359)/.test(clean)) return 'MTN';
    if (/^(020|050|23320|23350)/.test(clean)) return 'Telecel';
    if (/^(027|057|026|056|23327|23357|23326|23356)/.test(clean)) return 'AT';
    return 'Other';
  };

  const detectedNetwork = getNetwork(primaryTab === 'SIGN_IN' ? loginIdentifier : phone);

  // Handle Phone / Email Login Submit
  const handlePhoneEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your Ghana phone number or email address');
      return;
    }

    setIsLoggingIn(true);
    setTimeout(() => {
      const res = loginWithIdentifier(loginIdentifier.trim(), loginPassword);
      if (!res.success) {
        setLoginError(res.message || 'Login failed. Try a demo role or sign up below.');
      }
      setIsLoggingIn(false);
    }, 400);
  };

  // Handle Admin Command Login Submit
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    const res = loginAsAdminWithCredentials(adminUser, adminPass);
    if (!res.success) {
      setAdminError(res.error || 'Invalid admin credentials.');
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    await loginWithGoogle(googleSelectedRole);
  };

  // Handle Biometric Login
  const handleBiometricLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await authenticateWithBiometrics('LOGIN', '1-Touch EcoSort Passkey Login');
      const authUser = (res as any)?.user;
      if (res.success && authUser) {
        loginWithIdentifier(authUser.phone || authUser.email);
      }
    } catch {
      // ignore
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Validate Registration Form
  const validateRegForm = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = entityType === 'INDIVIDUAL' ? 'Full name is required' : 'Representative name is required';
    if (entityType !== 'INDIVIDUAL' && !institutionName.trim()) {
      errs.institutionName = entityType === 'SCHOOL' ? 'School / University name is required' :
                             entityType === 'COMMUNITY' ? 'Community name is required' :
                             'Organization name is required';
    }
    if (!phone.trim()) {
      errs.phone = 'Ghana phone number is required';
    } else if (phone.replace(/\D/g, '').length < 9) {
      errs.phone = 'Please enter a valid 10-digit Ghana phone number';
    }
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email address is required';
    if (community === 'Other / Custom Community' && !customCommunity.trim()) {
      errs.community = 'Please specify your location';
    }
    if (!agreedTerms) {
      errs.terms = 'Please accept the EPA Ghana circular terms';
    }
    setRegErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle Registration Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegForm()) return;

    setIsRegistering(true);
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
        memberCount: entityType === 'INDIVIDUAL' ? 1 : 10,
        contactPerson: name.trim(),
        leaderboardOptIn: true,
        avatar,
        ghanaCardNumber: ghanaCardNumber.trim(),
        ghanaTelecomNetwork: detectedNetwork
      });

      if (enrollBiometricsOnRegister && newUser) {
        try {
          await registerUserBiometrics(newUser);
        } catch {
          // ignore
        }
      }

      setIsRegistering(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#0B132B] to-[#020617] text-slate-100 flex flex-col justify-between py-4 sm:py-8 px-3 sm:px-6 relative overflow-x-hidden">
      
      {/* Background Decorative Ambient Circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Bar: National Badge & Language Selector */}
      <header className="max-w-xl sm:max-w-2xl w-full mx-auto flex items-center justify-between gap-2 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg">🇬🇭</span>
          <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
            EPA Ghana Verified Grid
          </span>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Center Main Auth Card */}
      <main className="max-w-xl sm:max-w-2xl w-full mx-auto my-auto">
        <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10 text-slate-100">
          
          {/* Card Hero Header */}
          <div className="relative bg-gradient-to-r from-emerald-900/80 via-slate-900 to-blue-950/80 p-5 sm:p-6 border-b border-slate-800 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative group">
                <img 
                  src="/logo.png" 
                  alt="EcoSort" 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-contain bg-white p-1.5 shadow-xl ring-2 ring-emerald-400/30"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0F172A] flex items-center justify-center text-[8px] font-black text-slate-950">
                  ✓
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    EcoSort
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 uppercase tracking-widest border border-emerald-400/30">
                    GHANA
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                  AI-Powered Waste Sorting, Virtual Twin & Instant MoMo Cash
                </p>
                <p className="text-[11px] text-emerald-400/90 font-mono mt-0.5">
                  Recycle Today • Earn Tomorrow • Build a Cleaner Ghana 🌿
                </p>
              </div>
            </div>

            {/* Segmented Primary Tab Switcher - Sign Up First */}
            <div className="grid grid-cols-2 gap-2 mt-5 p-1 bg-slate-950/70 rounded-2xl border border-slate-800/90">
              <button
                type="button"
                onClick={() => {
                  setPrimaryTab('SIGN_UP');
                  setRegErrors({});
                }}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  primaryTab === 'SIGN_UP'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
                <span className="hidden sm:inline-block text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-mono">
                  +50 Pts
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPrimaryTab('SIGN_IN');
                  setLoginError('');
                }}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  primaryTab === 'SIGN_IN'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </div>
          </div>

          {/* Tab 1: SIGN IN VIEW */}
          {primaryTab === 'SIGN_IN' && (
            <div className="p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
              
              {/* Method Switcher Pills */}
              <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSignInMethod('PHONE_EMAIL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    signInMethod === 'PHONE_EMAIL'
                      ? 'bg-slate-100 text-slate-900 shadow-md font-black'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Phone / Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignInMethod('GOOGLE')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    signInMethod === 'GOOGLE'
                      ? 'bg-white text-slate-900 shadow-md font-black'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignInMethod('PASSKEY')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    signInMethod === 'PASSKEY'
                      ? 'bg-emerald-400 text-emerald-950 font-black shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {isFace ? <ScanFace className="w-3.5 h-3.5" /> : <Fingerprint className="w-3.5 h-3.5" />}
                  <span>Passkey</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignInMethod('ADMIN')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    signInMethod === 'ADMIN'
                      ? 'bg-purple-500 text-white font-black shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>EPA Admin</span>
                </button>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 animate-in shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Sub-Method: Phone / Email Login */}
              {signInMethod === 'PHONE_EMAIL' && (
                <form onSubmit={handlePhoneEmailLogin} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-300">
                        Ghana Mobile Number or Email
                      </label>
                      {detectedNetwork !== 'Other' && (
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                          detectedNetwork === 'MTN' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' :
                          detectedNetwork === 'Telecel' ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30' :
                          'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                        }`}>
                          {detectedNetwork} MoMo
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => {
                          setLoginIdentifier(e.target.value);
                          setLoginError('');
                        }}
                        placeholder="e.g. 024 892 4110 or bright.mensah@ug.edu.gh"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-300">
                        Password or 4-Digit Security PIN
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showPassword ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password or PIN"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isLoggingIn ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Sign In to EcoSort</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Sub-Method: Google Sign In */}
              {signInMethod === 'GOOGLE' && (
                <div className="space-y-4 text-center py-2">
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-white">
                      Sign In with Google Account
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Synchronize your recycling submissions and MoMo earnings in real time with Cloud Firestore.
                    </p>
                  </div>

                  {/* Role Selection for Google */}
                  <div className="max-w-md mx-auto text-left space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Choose Your Account Role
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setGoogleSelectedRole('USER')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          googleSelectedRole === 'USER'
                            ? 'bg-emerald-500/20 border-emerald-400 text-white ring-1 ring-emerald-400/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <User className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                        <span className="text-[11px] font-bold block">Citizen</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setGoogleSelectedRole('COLLECTION_AGENT')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          googleSelectedRole === 'COLLECTION_AGENT'
                            ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Truck className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                        <span className="text-[11px] font-bold block">Collector</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setGoogleSelectedRole('RECYCLER')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          googleSelectedRole === 'RECYCLER'
                            ? 'bg-teal-500/20 border-teal-400 text-white ring-1 ring-teal-400/50'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Factory className="w-4 h-4 mx-auto mb-1 text-teal-400" />
                        <span className="text-[11px] font-bold block">Recycler</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleAuthLoading}
                    className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer"
                  >
                    {isGoogleAuthLoading ? (
                      <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    ) : (
                      <>
                        <GoogleIcon className="w-5 h-5" />
                        <span>Continue with Google (+50 EcoPoints)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Sub-Method: Passkey (Biometric) */}
              {signInMethod === 'PASSKEY' && (
                <div className="space-y-4 text-center py-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                    {isFace ? <ScanFace className="w-7 h-7" /> : <Fingerprint className="w-7 h-7" />}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-white">
                      1-Touch Biometric Sign-In
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Authenticate in milliseconds using Touch ID, Face ID, or Windows Hello WebAuthn passkey.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBiometricLogin}
                    disabled={isLoggingIn}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isLoggingIn ? (
                      <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    ) : (
                      <>
                        {isFace ? <ScanFace className="w-4 h-4" /> : <Fingerprint className="w-4 h-4" />}
                        <span>Authenticate with Device Passkey</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Sub-Method: Admin Login */}
              {signInMethod === 'ADMIN' && (
                <form onSubmit={handleAdminSubmit} className="space-y-4 py-1">
                  <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/80 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">EPA Administrative Command Grid</span>
                      <span className="text-[11px] text-purple-300">Authorized Agency Personnel Only</span>
                    </div>
                  </div>

                  {adminError && (
                    <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs">
                      {adminError}
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Admin Username
                    </label>
                    <input
                      type="text"
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      placeholder="UMaT SRID"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Admin Password
                    </label>
                    <input
                      type="password"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder="wine2026"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Access Command Console</span>
                  </button>
                </form>
              )}

              {/* Instant Test Drive / Quick Demo Role Section */}
              <div className="pt-4 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    1-Click Test Drive (Demo Roles)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Instant Entry</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => loginWithDemoUser('USER')}
                    className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-mono text-blue-400 block font-bold">CITIZEN</span>
                    <span className="text-xs font-bold text-white block truncate group-hover:text-blue-300">
                      Bright Mensah
                    </span>
                    <span className="text-[10px] text-slate-400">425 EcoPoints</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => loginWithDemoUser('COLLECTION_AGENT')}
                    className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-mono text-amber-400 block font-bold">COLLECTOR</span>
                    <span className="text-xs font-bold text-white block truncate group-hover:text-amber-300">
                      Kofi Mensah
                    </span>
                    <span className="text-[10px] text-slate-400">Fleet Agent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => loginWithDemoUser('RECYCLER')}
                    className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-mono text-teal-400 block font-bold">RECYCLER</span>
                    <span className="text-xs font-bold text-white block truncate group-hover:text-teal-300">
                      GreenPlast Ltd
                    </span>
                    <span className="text-[10px] text-slate-400">Recovery Plant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => loginWithDemoUser('COMMUNITY_ADMIN')}
                    className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-mono text-purple-400 block font-bold">LEAD</span>
                    <span className="text-xs font-bold text-white block truncate group-hover:text-purple-300">
                      Ama Serwaa
                    </span>
                    <span className="text-[10px] text-slate-400">KNUST Hub</span>
                  </button>
                </div>
              </div>

              {/* Link to Switch to Sign Up */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPrimaryTab('SIGN_UP');
                    setRegErrors({});
                  }}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  New to EcoSort? <span className="text-emerald-400 font-bold underline">Create an Account (+50 EcoPoints)</span>
                </button>
              </div>

            </div>
          )}

          {/* Tab 2: SIGN UP VIEW */}
          {primaryTab === 'SIGN_UP' && (
            <form onSubmit={handleRegisterSubmit} className="p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
              
              {/* Entity Type Picker */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Select Account Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEntityType('INDIVIDUAL');
                      setRole('USER');
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      entityType === 'INDIVIDUAL'
                        ? 'bg-emerald-500/20 border-emerald-400 text-white ring-1 ring-emerald-400/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <User className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <span className="text-xs font-bold block">Individual</span>
                    <span className="text-[9px] text-slate-400">Citizen / Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEntityType('SCHOOL');
                      setRole('COMMUNITY_ADMIN');
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      entityType === 'SCHOOL'
                        ? 'bg-blue-500/20 border-blue-400 text-white ring-1 ring-blue-400/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <School className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                    <span className="text-xs font-bold block">School / Uni</span>
                    <span className="text-[9px] text-slate-400">Campus chapter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEntityType('BUSINESS');
                      setRole('USER');
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      entityType === 'BUSINESS'
                        ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                    <span className="text-xs font-bold block">Business</span>
                    <span className="text-[9px] text-slate-400">SME / Corporate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEntityType('COMMUNITY');
                      setRole('COMMUNITY_ADMIN');
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      entityType === 'COMMUNITY'
                        ? 'bg-purple-500/20 border-purple-400 text-white ring-1 ring-purple-400/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Users className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                    <span className="text-xs font-bold block">Community</span>
                    <span className="text-[9px] text-slate-400">Market / Group</span>
                  </button>
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {entityType === 'INDIVIDUAL' ? 'Full Name' : 'Lead Contact Name'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kwesi Appiah"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
                  {regErrors.name && <p className="text-rose-400 text-[10px] mt-1">{regErrors.name}</p>}
                </div>

                {entityType !== 'INDIVIDUAL' && (
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Organization / School Name
                    </label>
                    <input
                      type="text"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="e.g. University of Ghana Legon"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm"
                    />
                    {regErrors.institutionName && <p className="text-rose-400 text-[10px] mt-1">{regErrors.institutionName}</p>}
                  </div>
                )}
              </div>

              {/* Contact info: Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-300">
                      Ghana Phone Number
                    </label>
                    {detectedNetwork !== 'Other' && (
                      <span className="text-[10px] font-bold text-emerald-400">
                        {detectedNetwork}
                      </span>
                    )}
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 024 892 4110"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
                  {regErrors.phone && <p className="text-rose-400 text-[10px] mt-1">{regErrors.phone}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kwesi@gmail.com"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm"
                  />
                  {regErrors.email && <p className="text-rose-400 text-[10px] mt-1">{regErrors.email}</p>}
                </div>
              </div>

              {/* Location & Drop Point */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Community / Operational Zone
                  </label>
                  <select
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    {GHANA_COMMUNITIES.map(c => (
                      <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Ghana Card PIN <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={ghanaCardNumber}
                    onChange={(e) => setGhanaCardNumber(e.target.value)}
                    placeholder="GHA-729103847-1"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Choose Profile Avatar
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {GHANA_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setAvatar(av.url)}
                      className={`relative rounded-2xl p-0.5 shrink-0 transition-transform cursor-pointer ${
                        avatar === av.url ? 'scale-110 ring-2 ring-emerald-400' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av.url} alt={av.name} className="w-10 h-10 rounded-xl object-cover" />
                      {avatar === av.url && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] text-slate-950 font-black">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Biometrics & Terms */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enrollBiometricsOnRegister}
                    onChange={(e) => setEnrollBiometricsOnRegister(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Enroll device biometric passkey (Face ID / Fingerprint) for 1-touch login</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>I agree to EPA Ghana circular recycling guidelines & data privacy terms</span>
                </label>
                {regErrors.terms && <p className="text-rose-400 text-[10px]">{regErrors.terms}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
              >
                {isRegistering ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Create Account & Claim +50 EcoPoints</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Link to Switch to Sign In */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPrimaryTab('SIGN_IN');
                    setLoginError('');
                  }}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Already registered? <span className="text-blue-400 font-bold underline">Sign In with Phone, Google, or Passkey</span>
                </button>
              </div>

              {/* Instant Test Drive / Quick Demo Role Section */}
              <div className="pt-4 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    1-Click Test Drive (Demo Roles)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Instant Entry</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => loginWithDemoUser('USER')}
                    className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-mono text-blue-400 block font-bold">CITIZEN</span>
                    <span className="text-xs font-bold text-white block truncate group-hover:text-blue-300">
                      Bright Mensah
                    </span>
                    <span className="text-[10px] text-slate-400">425 EcoPoints</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => loginWithDemoUser('COLLECTION_AGENT')}
                    className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-mono text-amber-400 block font-bold">COLLECTOR</span>
                    <span className="text-xs font-bold text-white block truncate group-hover:text-amber-300">
                      Kofi Mensah
                    </span>
                    <span className="text-[10px] text-slate-400">Fleet Agent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => loginWithDemoUser('RECYCLER')}
                    className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-mono text-teal-400 block font-bold">RECYCLER</span>
                    <span className="text-xs font-bold text-white block truncate group-hover:text-teal-300">
                      GreenPlast Ltd
                    </span>
                    <span className="text-[10px] text-slate-400">Recovery Plant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => loginWithDemoUser('COMMUNITY_ADMIN')}
                    className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-mono text-purple-400 block font-bold">LEAD</span>
                    <span className="text-xs font-bold text-white block truncate group-hover:text-purple-300">
                      Ama Serwaa
                    </span>
                    <span className="text-[10px] text-slate-400">KNUST Hub</span>
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>
      </main>

      {/* Footer Security Strip */}
      <footer className="max-w-xl sm:max-w-2xl w-full mx-auto text-center pt-4 text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-center gap-2 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted EPA Ghana Circular Registry • Official Release v2.4.1</span>
        </div>
        <p className="text-[10px] text-slate-400 font-mono">
          SMS Support Hotline: 024 892 4110 • Accra, Republic of Ghana
        </p>
      </footer>

    </div>
  );
};
