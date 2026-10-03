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
    registerWithFirebaseEmail,
    sendPasswordReset,
    loginWithDemoUser,
    loginWithGoogle,
    isGoogleAuthLoading,
    loginWithIdentifier,
    loginAsAdminWithCredentials,
    authenticateWithBiometrics,
    registerUserBiometrics,
    biometricCapability
  } = useEcoSort();

  // Primary mode defaults to initialTab
  const [primaryTab, setPrimaryTab] = useState<'SIGN_IN' | 'SIGN_UP'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setPrimaryTab(initialTab);
    }
  }, [initialTab]);

  // Sign in sub-method
  const [signInMethod, setSignInMethod] = useState<'PHONE_EMAIL' | 'GOOGLE' | 'PASSKEY' | 'ADMIN'>('PHONE_EMAIL');

  // Sign In inputs
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Registration Password state for Firebase Auth
  const [regPassword, setRegPassword] = useState<string>('');
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);
  const [resetSentMessage, setResetSentMessage] = useState<string>('');
  const [isResetting, setIsResetting] = useState<boolean>(false);

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
  const handlePhoneEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your Ghana phone number or email address');
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await loginWithIdentifier(loginIdentifier.trim(), loginPassword);
      if (!res.success) {
        setLoginError(res.message || 'Login failed. Check your password or sign up below.');
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Password Reset via Firebase
  const handleForgotPassword = async () => {
    setLoginError('');
    setResetSentMessage('');
    if (!loginIdentifier.trim() || !loginIdentifier.includes('@')) {
      setLoginError('Please enter your email address in the field above to receive a password reset link.');
      return;
    }
    setIsResetting(true);
    try {
      const res = await sendPasswordReset(loginIdentifier.trim());
      if (res.success) {
        setResetSentMessage(`Password reset link sent to ${loginIdentifier.trim()} via Firebase.`);
      } else {
        setLoginError(res.message || 'Could not send password reset email.');
      }
    } catch (e: any) {
      setLoginError(e?.message || 'Error sending password reset email.');
    } finally {
      setIsResetting(false);
    }
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
    if (regPassword.trim() && regPassword.trim().length < 6) {
      errs.password = 'Password must be at least 6 characters for Firebase security';
    }
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
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegForm()) return;

    setIsRegistering(true);
    setRegErrors({});

    try {
      const finalLocation = community === 'Other / Custom Community' ? customCommunity : community;
      const finalInstitution = entityType === 'INDIVIDUAL'
        ? (organization.trim() || 'Independent Citizen')
        : (institutionName.trim() || organization.trim() || name.trim());

      // If user specified password, register directly via Firebase Authentication
      if (regPassword.trim().length >= 6) {
        const fbRes = await registerWithFirebaseEmail({
          name: name.trim(),
          email: email.trim(),
          password: regPassword.trim(),
          phone: phone.trim(),
          role,
          location: finalLocation,
          community: finalLocation,
          entityType,
          institutionName: finalInstitution
        });

        if (!fbRes.success) {
          setRegErrors({ form: fbRes.message || 'Firebase account creation failed.' });
          setIsRegistering(false);
          return;
        }

        if (enrollBiometricsOnRegister && fbRes.user) {
          try {
            await registerUserBiometrics(fbRes.user);
          } catch {}
        }
        setIsRegistering(false);
        return;
      }

      // Default registration flow
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
    } catch (err: any) {
      setRegErrors({ form: err?.message || 'Registration failed. Please check your credentials.' });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#0B132B] to-[#020617] text-slate-100 flex flex-col justify-between py-4 sm:py-8 px-3 sm:px-6 relative overflow-x-hidden">
      
      {/* Background Decorative Ambient Circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Bar: National Badge & Language Selector */}
      <header className="max-w-xl sm:max-w-2xl w-full mx-auto flex items-center justify-between gap-2 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-lg sm:text-xl">🇬🇭</span>
          <span className="text-xs sm:text-sm font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
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
          <div className="relative bg-gradient-to-r from-emerald-900/80 via-slate-900 to-blue-950/80 p-6 sm:p-7 border-b border-slate-800 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative group">
                <img 
                  src="/logo.png" 
                  alt="EcoSort" 
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-contain bg-white p-2 shadow-xl ring-2 ring-emerald-400/30"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0F172A] flex items-center justify-center text-[9px] font-black text-slate-950">
                  ✓
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    EcoSort Ghana
                  </h1>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Official
                  </span>
                </div>
                <p className="text-sm sm:text-base text-slate-200 font-normal mt-1 leading-relaxed">
                  Smart waste sorting, recycling collection & instant Mobile Money rewards.
                </p>
                <p className="text-xs sm:text-sm text-emerald-400 font-medium mt-1">
                  Recycle Today • Earn Tomorrow • Build a Cleaner Ghana 🌿
                </p>
              </div>
            </div>

            {/* Segmented Primary Tab Switcher - Sign Up First */}
            <div className="grid grid-cols-2 gap-2 mt-6 p-1.5 bg-slate-950/70 rounded-2xl border border-slate-800/90">
              <button
                type="button"
                onClick={() => {
                  setPrimaryTab('SIGN_UP');
                  setRegErrors({});
                }}
                className={`py-3 px-4 rounded-xl text-sm sm:text-base font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  primaryTab === 'SIGN_UP'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
                <span className="hidden sm:inline-block text-xs bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                  +50 Pts
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPrimaryTab('SIGN_IN');
                  setLoginError('');
                }}
                className={`py-3 px-4 rounded-xl text-sm sm:text-base font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  primaryTab === 'SIGN_IN'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </div>
          </div>

          {/* Tab 1: SIGN IN VIEW */}
          {primaryTab === 'SIGN_IN' && (
            <div className="p-6 sm:p-7 space-y-5 animate-in fade-in duration-200">
              
              {/* Method Switcher Pills */}
              <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSignInMethod('PHONE_EMAIL')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    signInMethod === 'PHONE_EMAIL'
                      ? 'bg-slate-100 text-slate-900 shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Phone / Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignInMethod('GOOGLE')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    signInMethod === 'GOOGLE'
                      ? 'bg-white text-slate-900 shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignInMethod('PASSKEY')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    signInMethod === 'PASSKEY'
                      ? 'bg-emerald-400 text-emerald-950 font-bold shadow-md'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {isFace ? <ScanFace className="w-4 h-4" /> : <Fingerprint className="w-4 h-4" />}
                  <span>Passkey</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignInMethod('ADMIN')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    signInMethod === 'ADMIN'
                      ? 'bg-purple-500 text-white shadow-md font-semibold'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>EPA Admin</span>
                </button>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-200 text-sm flex items-center gap-2 animate-in shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Sub-Method: Phone / Email Login */}
              {signInMethod === 'PHONE_EMAIL' && (
                <form onSubmit={handlePhoneEmailLogin} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-semibold text-slate-200">
                        Ghana Mobile Number or Email
                      </label>
                      {detectedNetwork !== 'Other' && (
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
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
                        placeholder="e.g. 024 892 4110 or kwesi.mensah@gmail.com"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-semibold text-slate-200">
                        Password or 4-Digit Security PIN
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showPassword ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password or PIN"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono placeholder:text-slate-500"
                    />
                    
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400">Firebase Auth & Session Encrypted</span>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={isResetting}
                        className="text-blue-400 hover:text-blue-300 font-semibold hover:underline cursor-pointer"
                      >
                        {isResetting ? 'Sending reset link...' : 'Forgot password?'}
                      </button>
                    </div>
                  </div>

                  {resetSentMessage && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{resetSentMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-base shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
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
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white">
                      Sign In with Google Account
                    </h3>
                    <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                      Synchronize your recycling submissions and MoMo earnings in real time.
                    </p>
                  </div>

                  {/* Role Selection for Google */}
                  <div className="max-w-md mx-auto text-left space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Choose Account Role
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setGoogleSelectedRole('USER')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          googleSelectedRole === 'USER'
                            ? 'bg-emerald-500/20 border-emerald-400 text-white ring-1 ring-emerald-400/50'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <User className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                        <span className="text-xs sm:text-sm font-semibold block">Citizen</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setGoogleSelectedRole('COLLECTION_AGENT')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          googleSelectedRole === 'COLLECTION_AGENT'
                            ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400/50'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <Truck className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                        <span className="text-xs sm:text-sm font-semibold block">Collector</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setGoogleSelectedRole('RECYCLER')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          googleSelectedRole === 'RECYCLER'
                            ? 'bg-teal-500/20 border-teal-400 text-white ring-1 ring-teal-400/50'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <Factory className="w-4 h-4 mx-auto mb-1 text-teal-400" />
                        <span className="text-xs sm:text-sm font-semibold block">Recycler</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleAuthLoading}
                    className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-base shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer"
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
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-white">
                      1-Touch Biometric Sign-In
                    </h3>
                    <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                      Instant biometric passkey verification via your device's built-in {isFace ? 'Face ID' : 'fingerprint sensor'}.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleBiometricLogin}
                    disabled={isLoggingIn}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-base shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isLoggingIn ? (
                      <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    ) : (
                      <>
                        {isFace ? <ScanFace className="w-5 h-5" /> : <Fingerprint className="w-5 h-5" />}
                        <span>Authenticate with Device Passkey</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Sub-Method: Admin Login */}
              {signInMethod === 'ADMIN' && (
                <form onSubmit={handleAdminSubmit} className="space-y-4 py-1">
                  <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/80 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <span className="text-sm font-bold text-white block">EPA Administrative Command Grid</span>
                      <span className="text-xs text-purple-300">Authorized Agency Personnel Only</span>
                    </div>
                  </div>

                  {adminError && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-sm">
                      {adminError}
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-semibold text-slate-200 block mb-1.5">
                      Admin Username
                    </label>
                    <input
                      type="text"
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      placeholder="UMaT SRID"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-base"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-200 block mb-1.5">
                      Admin Password
                    </label>
                    <input
                      type="password"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder="wine2026"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-base font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Access Command Console</span>
                  </button>
                </form>
              )}

              {/* Link to Switch to Sign Up */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPrimaryTab('SIGN_UP');
                    setRegErrors({});
                  }}
                  className="text-sm text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  New to EcoSort? <span className="text-emerald-400 font-semibold underline">Create an Account (+50 EcoPoints)</span>
                </button>
              </div>

            </div>
          )}

          {/* Tab 2: SIGN UP VIEW */}
          {primaryTab === 'SIGN_UP' && (
            <form onSubmit={handleRegisterSubmit} className="p-6 sm:p-7 space-y-5 animate-in fade-in duration-200">
              
              {/* Error Banner */}
              {regErrors.form && (
                <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-200 text-sm flex items-center gap-2 animate-in shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{regErrors.form}</span>
                </div>
              )}

              {/* Entity Type Picker */}
              <div>
                <label className="text-sm font-semibold text-slate-200 block mb-2">
                  Select Account Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEntityType('INDIVIDUAL');
                      setRole('USER');
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      entityType === 'INDIVIDUAL'
                        ? 'bg-emerald-500/20 border-emerald-400 text-white ring-1 ring-emerald-400/50'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <User className="w-5 h-5 mx-auto mb-1.5 text-emerald-400" />
                    <span className="text-sm font-bold block">Individual</span>
                    <span className="text-xs text-slate-400">Citizen / Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEntityType('SCHOOL');
                      setRole('COMMUNITY_ADMIN');
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      entityType === 'SCHOOL'
                        ? 'bg-blue-500/20 border-blue-400 text-white ring-1 ring-blue-400/50'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <School className="w-5 h-5 mx-auto mb-1.5 text-blue-400" />
                    <span className="text-sm font-bold block">School / Uni</span>
                    <span className="text-xs text-slate-400">Campus chapter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEntityType('BUSINESS');
                      setRole('USER');
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      entityType === 'BUSINESS'
                        ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400/50'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mx-auto mb-1.5 text-amber-400" />
                    <span className="text-sm font-bold block">Business</span>
                    <span className="text-xs text-slate-400">SME / Company</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEntityType('COMMUNITY');
                      setRole('COMMUNITY_ADMIN');
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      entityType === 'COMMUNITY'
                        ? 'bg-purple-500/20 border-purple-400 text-white ring-1 ring-purple-400/50'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Users className="w-5 h-5 mx-auto mb-1.5 text-purple-400" />
                    <span className="text-sm font-bold block">Community</span>
                    <span className="text-xs text-slate-400">Market / Group</span>
                  </button>
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-sm font-semibold text-slate-200 block mb-1.5">
                    {entityType === 'INDIVIDUAL' ? 'Full Name' : 'Lead Contact Name'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kwesi Mensah"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-base focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
                  />
                  {regErrors.name && <p className="text-rose-400 text-xs mt-1.5">{regErrors.name}</p>}
                </div>

                {entityType !== 'INDIVIDUAL' && (
                  <div>
                    <label className="text-sm font-semibold text-slate-200 block mb-1.5">
                      Organization / School Name
                    </label>
                    <input
                      type="text"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="e.g. University of Ghana Legon"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-base focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
                    />
                    {regErrors.institutionName && <p className="text-rose-400 text-xs mt-1.5">{regErrors.institutionName}</p>}
                  </div>
                )}
              </div>

              {/* Contact info: Phone, Email, Password, Ghana Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-slate-200">
                      Ghana Phone Number
                    </label>
                    {detectedNetwork !== 'Other' && (
                      <span className="text-xs font-semibold text-emerald-400">
                        {detectedNetwork} MoMo
                      </span>
                    )}
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 024 892 4110"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-base focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
                  />
                  {regErrors.phone && <p className="text-rose-400 text-xs mt-1.5">{regErrors.phone}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-200 block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kwesi.mensah@gmail.com"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-base focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
                  />
                  {regErrors.email && <p className="text-rose-400 text-xs mt-1.5">{regErrors.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-slate-200">
                      Password <span className="text-xs text-emerald-400 font-normal">(Firebase Secure)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showRegPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-base focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500 font-mono"
                  />
                  {regErrors.password && <p className="text-rose-400 text-xs mt-1.5">{regErrors.password}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-200 block mb-1.5">
                    Ghana Card PIN <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={ghanaCardNumber}
                    onChange={(e) => setGhanaCardNumber(e.target.value)}
                    placeholder="GHA-729103847-1"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-base font-mono focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Location & Drop Point */}
              <div>
                <label className="text-sm font-semibold text-slate-200 block mb-1.5">
                  Community / Operational Zone
                </label>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-base focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {GHANA_COMMUNITIES.map(c => (
                    <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
                  ))}
                </select>
              </div>

              {/* Biometrics & Terms */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enrollBiometricsOnRegister}
                    onChange={(e) => setEnrollBiometricsOnRegister(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 w-5 h-5 shrink-0"
                  />
                  <span>Enroll device biometric passkey (Face ID / Fingerprint) for 1-touch login</span>
                </label>

                <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 w-5 h-5 shrink-0"
                  />
                  <span>I agree to EPA Ghana circular recycling guidelines & privacy terms</span>
                </label>
                {regErrors.terms && <p className="text-rose-400 text-xs">{regErrors.terms}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-base shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-3"
              >
                {isRegistering ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-emerald-200" />
                    <span>Create Account & Claim +50 EcoPoints</span>
                    <ArrowRight className="w-5 h-5" />
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
                  className="text-sm text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Already registered? <span className="text-blue-400 font-semibold underline">Sign In with Phone, Google, or Passkey</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </main>

      {/* Footer Security Strip */}
      <footer className="max-w-xl sm:max-w-2xl w-full mx-auto text-center pt-5 text-xs sm:text-sm text-slate-400 space-y-1.5">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted EPA Ghana Circular Registry • Official Release</span>
        </div>
        <p className="text-xs text-slate-400">
          SMS Support Hotline: 024 892 4110 • Accra, Republic of Ghana
        </p>
      </footer>

    </div>
  );
};
