import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  UserRole,
  EntityType,
  WasteSubmission, 
  CollectionJob, 
  RewardItem, 
  RewardRedemption, 
  PointTransaction, 
  LeaderboardEntry, 
  Challenge, 
  RewardRateRule, 
  RobotSortingEvent,
  RecyclerInventory,
  RecyclerOrder,
  WasteCategory,
  WasteMaterial,
  Toast,
  ToastType,
  CashWithdrawalRecord,
  AdminAuditLog,
  CommunitySwapItem,
  SwapTradeRequest,
  CommunityEvent,
  CommunityForumPost,
  ForumComment,
  DistrictCollectiveQuest,
  CommunityAmbassador,
  WasteClassificationResult,
  SmartDustBin,
  SmartBinLedIndicator,
  SmartBinMaintenanceLog,
  SmartBinMaintenanceAction
} from '../types';
import { INITIAL_SMART_BINS, INITIAL_MAINTENANCE_LOGS } from '../data/smartBinSeedData';
import { 
  INITIAL_USER, 
  DEMO_AGENTS, 
  DEMO_RECYCLER, 
  DEMO_COMMUNITY_LEAD, 
  DEMO_ADMIN, 
  INITIAL_ALL_USERS,
  INITIAL_ADMIN_AUDIT_LOGS,
  INITIAL_REWARD_RULES, 
  INITIAL_SUBMISSIONS, 
  INITIAL_COLLECTION_JOBS, 
  INITIAL_REWARDS, 
  INITIAL_LEADERBOARD, 
  INITIAL_CHALLENGE, 
  INITIAL_RECYCLER_INVENTORY, 
  INITIAL_POINT_TRANSACTIONS,
  INITIAL_CASH_WITHDRAWALS 
} from '../data/seedData';
import {
  INITIAL_SWAP_ITEMS,
  INITIAL_COMMUNITY_EVENTS,
  INITIAL_FORUM_POSTS,
  INITIAL_DISTRICT_QUESTS,
  INITIAL_AMBASSADORS
} from '../data/communitySeedData';
import { AppLanguage, TRANSLATIONS, SUPPORTED_LANGUAGES, LanguageInfo } from '../i18n/translations';
import { SimulatedPushAlert, PushNotificationSettings, PushCategory } from '../types/pushNotification';
import { PUSH_NOTIFICATION_SCENARIOS, DEFAULT_PUSH_SETTINGS } from '../data/pushNotificationScenarios';
import { soundEffects } from '../utils/audioChime';
import {
  sendRegistrationWelcomeSms,
  sendCashOutTransactionSms,
  sendRewardRedemptionSms,
  sendSmartBinDepositSms,
  sendSmsViaHttpSms,
  fetchSmsGatewayStatus,
  fetchSmsLogs,
  ClientSmsRecord,
  SmsGatewayStatus,
  SmsDispatchResponse
} from '../services/smsNotificationService';

export const ADMIN_AUTH_CONFIG = {
  username: 'UMaT SRID',
  password: 'wine2026',
  displayName: 'UMaT SRID',
  roleTitle: 'EPA Command Officer (UMaT SRID) 🛡️',
  organization: 'UMaT SRID - School of Railway & Infrastructure Development / EPA EcoSort',
  email: 'srid@umat.edu.gh'
};
import { haptics } from '../utils/haptics';
import { QueuedOfflineSubmission, OfflineCacheStats } from '../types/offline';
import { offlineQueueService, createOfflineThumbnail } from '../services/offlineQueue';
import { registerServiceWorker } from '../services/serviceWorkerRegistration';
import { ShareImpactStats } from '../types/shareImpact';
import { 
  BiometricDeviceCapability, 
  BiometricPromptOptions, 
  BiometricAuthResult, 
  BiometricActionType,
  BiometricCredentialRecord,
  BiometricAuthType
} from '../types/biometrics';
import { 
  getDeviceBiometricCapability, 
  registerBiometricPasskey, 
  removeCredentialsForUser, 
  getCredentialForUser, 
  getSavedCredentials,
  verifyBiometricAssertion
} from '../services/webAuthnService';
import { localDataCache, EcoSortCachedState, CachedDashboardMetrics } from '../services/localDataCache';
import { firestoreService } from '../services/firestoreService';
import { auth, signInWithGoogle, signOutUser } from '../services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export type AppView = 
  | 'infographic' 
  | 'virtual-robot' 
  | 'smart-bin'
  | 'user-app' 
  | 'collector-app' 
  | 'user-dashboard' 
  | 'leaderboard' 
  | 'rewards' 
  | 'recycler' 
  | 'admin' 
  | 'impact' 
  | 'community'
  | 'demo';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'POINTS';
  timestamp: string;
  read: boolean;
}

export const ECO_POINTS_PER_GHS = 10; // Rate: 10 EcoPoints = GH₵ 1.00 (1 Pt = GH₵ 0.10)

interface EcoSortContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  isRegistered: boolean;
  setIsRegistered: (registered: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showEditProfileModal: boolean;
  setShowEditProfileModal: (show: boolean) => void;
  showCashOutModal: boolean;
  setShowCashOutModal: (show: boolean) => void;
  showApkModal: boolean;
  setShowApkModal: (show: boolean) => void;
  showPushSimulationModal: boolean;
  setShowPushSimulationModal: (show: boolean) => void;
  isDeviceFrameMode: boolean;
  setIsDeviceFrameMode: (enabled: boolean) => void;
  canInstallPwa: boolean;
  triggerNativeInstall: () => void;
  switchRole: (roleName: UserRole) => void;
  
  // Ghanaian Language Localization
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  currentLanguageInfo: LanguageInfo;
  t: (key: string, fallback?: string) => string;

  // Simulated Push Notification System
  pushAlerts: SimulatedPushAlert[];
  activePushBanner: SimulatedPushAlert | null;
  pushSettings: PushNotificationSettings;
  updatePushSettings: (updates: Partial<PushNotificationSettings>) => void;
  triggerSimulatedPush: (scenarioOrAlert?: SimulatedPushAlert | string) => void;
  dismissActivePushBanner: () => void;
  claimPushReward: (alertId: string, bonusPointsAmount: number) => void;

  // Offline Local Persistence & Sync
  isOnline: boolean;
  isSimulatedOffline: boolean;
  setIsSimulatedOffline: React.Dispatch<React.SetStateAction<boolean>>;
  effectiveIsOnline: boolean;
  pendingOfflineQueue: QueuedOfflineSubmission[];
  pendingOfflineCount: number;
  offlineStats: OfflineCacheStats | null;
  showOfflineQueueModal: boolean;
  setShowOfflineQueueModal: (show: boolean) => void;
  syncOfflineQueueNow: () => Promise<{ successCount: number; failedCount: number }>;
  removeQueuedOfflineSubmission: (id: string) => Promise<void>;
  clearOfflineQueue: () => Promise<void>;
  addTestOfflineSubmission: () => Promise<void>;
  
  // IndexedDB Local-First Data Cache
  lastCachedAt: string | null;
  isHydratedFromCache: boolean;
  cachedMetrics: CachedDashboardMetrics | null;
  saveToLocalCacheNow: () => Promise<void>;
  clearLocalCacheData: () => Promise<void>;

  // Share My Impact
  showShareImpactModal: boolean;
  setShowShareImpactModal: (show: boolean) => void;
  shareImpactCustomStats?: Partial<ShareImpactStats>;
  openShareImpactModal: (customStats?: Partial<ShareImpactStats>) => void;
  closeShareImpactModal: () => void;

  // Instant Camera AI Scan & Immediate Point Credit
  showInstantScanModal: boolean;
  setShowInstantScanModal: (show: boolean) => void;
  openInstantScanModal: () => void;
  closeInstantScanModal: () => void;
  instantScanAndCreditWaste: (data: {
    imageUrl: string;
    classification: WasteClassificationResult;
    measuredWeightKg?: number;
    notes?: string;
  }) => {
    submission: WasteSubmission;
    pointsAwarded: number;
    co2Saved: number;
    newBalance: number;
  };

  // Biometric Authentication (WebAuthn / Passkeys)
  biometricCapability: BiometricDeviceCapability | null;
  isBiometricsEnrolled: boolean;
  showBiometricModal: boolean;
  biometricPromptOptions: BiometricPromptOptions | null;
  openBiometricPrompt: (options: BiometricPromptOptions) => Promise<BiometricAuthResult>;
  closeBiometricPrompt: () => void;
  registerUserBiometrics: (user?: UserProfile) => Promise<{ success: boolean; message: string; credential?: BiometricCredentialRecord }>;
  removeUserBiometrics: (userId?: string) => Promise<void>;
  authenticateWithBiometrics: (actionType?: BiometricActionType, customTitle?: string) => Promise<BiometricAuthResult>;

  // Registration & User Management
  firebaseUser: FirebaseUser | null;
  isGoogleAuthLoading: boolean;
  loginWithGoogle: (preferredRole?: UserRole) => Promise<UserProfile | null>;
  registerUser: (data: {
    name: string;
    phone: string;
    email: string;
    location: string;
    community?: string;
    address?: string;
    organization?: string;
    role: UserRole;
    entityType?: EntityType;
    institutionName?: string;
    memberCount?: number;
    contactPerson?: string;
    leaderboardOptIn?: boolean;
    avatar?: string;
    ghanaCardNumber?: string;
    ghanaTelecomNetwork?: 'MTN' | 'Telecel' | 'AT' | 'Other';
  }) => UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  logoutUser: () => void;
  loginWithDemoUser: (roleName: UserRole) => void;
  loginAsAdminWithCredentials: (username: string, password: string) => { success: boolean; error?: string };
  isAdminAuthenticated: boolean;
  showAdminAuthModal: boolean;
  setShowAdminAuthModal: (show: boolean) => void;
  openAdminAuthModal: () => void;
  
  // Data
  allUsers: UserProfile[];
  adminAuditLogs: AdminAuditLog[];
  submissions: WasteSubmission[];
  collectionJobs: CollectionJob[];
  rewardRules: RewardRateRule[];
  rewards: RewardItem[];
  redemptions: RewardRedemption[];
  transactions: PointTransaction[];
  cashWithdrawals: CashWithdrawalRecord[];
  leaderboard: LeaderboardEntry[];
  challenge: Challenge;
  recyclerInventory: RecyclerInventory[];
  recyclerOrders: RecyclerOrder[];
  robotEvents: RobotSortingEvent[];
  notifications: AppNotification[];
  toasts: Toast[];
  ecoPointsPerGhs: number;
  
  // Admin & User Management Actions
  addUser: (userData: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    location: string;
    community?: string;
    address?: string;
    organization?: string;
    entityType?: EntityType;
    institutionName?: string;
    memberCount?: number;
    contactPerson?: string;
    leaderboardOptIn?: boolean;
    avatar?: string;
    ghanaCardNumber?: string;
    ghanaTelecomNetwork?: 'MTN' | 'Telecel' | 'AT' | 'Other';
    initialEcoPoints?: number;
    status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  }) => UserProfile;
  updateUser: (userId: string, updates: Partial<UserProfile>) => void;
  deleteUser: (userId: string) => boolean;
  adjustUserPoints: (userId: string, pointsDelta: number, reason: string) => void;
  toggleUserStatus: (userId: string, status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION') => void;
  addReward: (newReward: Omit<RewardItem, 'id'>) => RewardItem;
  updateReward: (rewardId: string, updates: Partial<RewardItem>) => void;
  deleteReward: (rewardId: string) => boolean;
  assignJobAgent: (jobId: string, agentId: string, agentName: string) => void;
  cancelJobAdmin: (jobId: string, reason: string) => void;
  forceVerifyJobAdmin: (jobId: string, actualWeightKg: number, notes?: string) => void;
  createChallenge: (newChallenge: Omit<Challenge, 'id'>) => Challenge;
  updateChallenge: (challengeId: string, updates: Partial<Challenge>) => void;
  addAdminAuditLog: (log: Omit<AdminAuditLog, 'id' | 'timestamp' | 'adminId' | 'adminName'>) => void;

  // Actions
  submitWaste: (data: {
    imageUrl: string;
    classification: WasteSubmission['classification'];
    userWeightEstimateKg: number;
    pickupAddress: string;
    community: string;
    preferredPickupTime: string;
    notes?: string;
  }) => WasteSubmission;
  
  acceptJob: (jobId: string) => void;
  verifyAndCollectJob: (jobId: string, actualWeightKg: number, notes?: string, photoUrl?: string) => void;
  redeemReward: (rewardId: string, recipientPhoneOrAddress: string) => { success: boolean; code?: string; message: string };
  requestCashWithdrawal: (params: {
    pointsToConvert: number;
    network: 'MTN' | 'Telecel' | 'AT' | 'Other';
    recipientPhone: string;
    accountHolderName: string;
    ghanaCardNumber?: string;
    authorizedViaBiometrics?: boolean;
    biometricAuthRef?: string;
    biometricType?: BiometricAuthType;
  }) => Promise<{ success: boolean; message: string; withdrawal?: CashWithdrawalRecord }>;
  recordRobotSortingEvent: (event: Omit<RobotSortingEvent, 'id' | 'timestamp'>) => void;
  updateRewardRule: (category: WasteCategory, pointsPerKg: number) => void;
  addRecyclerOrder: (category: WasteCategory, quantityKg: number, destination: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetToDefaults: () => void;
  triggerCelebration: () => void;
  
  // Toast helpers
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  showSyncToast: (title: string, message: string, syncDurationMs?: number) => void;

  // Community & Eco-Trade Hub
  swapItems: CommunitySwapItem[];
  swapTradeRequests: SwapTradeRequest[];
  communityEvents: CommunityEvent[];
  forumPosts: CommunityForumPost[];
  districtQuests: DistrictCollectiveQuest[];
  ambassadors: CommunityAmbassador[];
  
  addSwapItem: (item: Omit<CommunitySwapItem, 'id' | 'createdAt' | 'likesCount' | 'viewCount'>) => CommunitySwapItem;
  toggleLikeSwapItem: (itemId: string) => void;
  proposeSwapTrade: (tradeRequest: Omit<SwapTradeRequest, 'id' | 'createdAt' | 'status'>) => SwapTradeRequest;
  joinCommunityEvent: (eventId: string, volunteerRole?: string) => void;
  createCommunityEvent: (event: Omit<CommunityEvent, 'id' | 'registeredVolunteersCount' | 'currentProgressKg'>) => CommunityEvent;
  addForumPost: (post: Omit<CommunityForumPost, 'id' | 'createdAt' | 'upvotes' | 'commentsCount' | 'comments'>) => CommunityForumPost;
  toggleUpvoteForumPost: (postId: string) => void;
  reactToForumPost: (postId: string, emoji: string) => void;
  toggleBookmarkForumPost: (postId: string) => void;
  addForumComment: (postId: string, commentText: string, parentId?: string) => void;
  reactToForumComment: (postId: string, commentId: string, emoji: string) => void;
  toggleUpvoteForumComment: (postId: string, commentId: string) => void;
  toggleVerifyCommentSolution: (postId: string, commentId: string) => void;
  deleteForumComment: (postId: string, commentId: string) => void;
  cheerAmbassador: (ambassadorId: string) => void;

  // Smart Dust Bin & LED Indicator IoT Grid
  smartBins: SmartDustBin[];
  selectedSmartBin: SmartDustBin | null;
  setSelectedSmartBin: (bin: SmartDustBin | null) => void;
  updateSmartBinLed: (binId: string, ledConfig: Partial<SmartBinLedIndicator>) => void;
  depositToSmartBin: (binId: string, depositData: {
    itemName: string;
    category: WasteCategory;
    material: string;
    weightKg: number;
    imageUrl?: string;
    chamberId?: string;
  }) => Promise<{ success: boolean; pointsAwarded: number; newLedState?: SmartBinLedIndicator; message?: string }>;
  registerNewSmartBin: (binData: Partial<SmartDustBin>) => SmartDustBin;
  triggerSmartBinEmptying: (binId: string) => void;
  showSmartBinPairModal: boolean;
  setShowSmartBinPairModal: (show: boolean) => void;
  // Smart Dust Bin Maintenance Logs
  maintenanceLogs: SmartBinMaintenanceLog[];
  addBinMaintenanceLog: (log: Omit<SmartBinMaintenanceLog, 'id' | 'timestampMs'>) => void;
  markBinStatusWithLog: (params: {
    binId: string;
    action: SmartBinMaintenanceAction;
    issueDescription?: string;
    resolutionNotes?: string;
    technicianName?: string;
    componentsServiced?: string[];
    costGhs?: number;
    customTimestamp?: string;
    resetCapacityIfServiced?: boolean;
  }) => void;
  // httpSMS API Service (https://httpsms.com)
  smsLogs: ClientSmsRecord[];
  smsGatewayStatus: SmsGatewayStatus | null;
  refreshSmsLogs: () => Promise<void>;
  sendCustomSms: (to: string, content: string, type?: 'REGISTRATION' | 'TRANSACTION' | 'CASH_OUT' | 'REWARD' | 'DEPOSIT' | 'SYSTEM') => Promise<SmsDispatchResponse>;
}

const EcoSortContext = createContext<EcoSortContextType | undefined>(undefined);

const STORAGE_KEY = 'ecosort_ghana_state_v2';

export const EcoSortProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isGoogleAuthLoading, setIsGoogleAuthLoading] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppView>('user-dashboard');
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('ecosort_ghana_language_v1');
      if (saved && ['en', 'tw', 'ga', 'ee', 'gur', 'dag', 'ha'].includes(saved)) {
        return saved as AppLanguage;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = useCallback((newLang: AppLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('ecosort_ghana_language_v1', newLang);
    } catch {
      // ignore
    }
  }, []);

  const currentLanguageInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = useCallback((key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const defaultDict = TRANSLATIONS.en;
    if (defaultDict && defaultDict[key]) {
      return defaultDict[key];
    }
    return fallback || key;
  }, [language]);

  const [isRegistered, setIsRegistered] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ecosort_ghana_registered_v2');
      return saved === 'true';
    } catch {
      return true;
    }
  });
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState<boolean>(false);
  
  const openAdminAuthModal = useCallback(() => {
    setShowAdminAuthModal(true);
  }, []);
  const [showEditProfileModal, setShowEditProfileModal] = useState<boolean>(false);
  const [showCashOutModal, setShowCashOutModal] = useState<boolean>(false);
  const [showApkModal, setShowApkModal] = useState<boolean>(false);
  const [showPushSimulationModal, setShowPushSimulationModal] = useState<boolean>(false);
  const [showShareImpactModal, setShowShareImpactModal] = useState<boolean>(false);
  const [shareImpactCustomStats, setShareImpactCustomStats] = useState<Partial<ShareImpactStats> | undefined>(undefined);

  // httpSMS API State & Handlers
  const [smsLogs, setSmsLogs] = useState<ClientSmsRecord[]>([]);
  const [smsGatewayStatus, setSmsGatewayStatus] = useState<SmsGatewayStatus | null>(null);

  const refreshSmsLogs = useCallback(async () => {
    try {
      const [logs, status] = await Promise.all([
        fetchSmsLogs(),
        fetchSmsGatewayStatus()
      ]);
      if (Array.isArray(logs)) {
        setSmsLogs(logs);
      }
      if (status) {
        setSmsGatewayStatus(status);
      }
    } catch {
      // ignore
    }
  }, []);

  const sendCustomSms = useCallback(async (
    to: string, 
    content: string, 
    type: 'REGISTRATION' | 'TRANSACTION' | 'CASH_OUT' | 'REWARD' | 'DEPOSIT' | 'SYSTEM' = 'SYSTEM'
  ): Promise<SmsDispatchResponse> => {
    const res = await sendSmsViaHttpSms({ to, content, type });
    refreshSmsLogs();
    return res;
  }, [refreshSmsLogs]);

  useEffect(() => {
    refreshSmsLogs();
  }, [refreshSmsLogs]);

  // Biometric WebAuthn State
  const [biometricCapability, setBiometricCapability] = useState<BiometricDeviceCapability | null>(null);
  const [showBiometricModal, setShowBiometricModal] = useState<boolean>(false);
  const [biometricPromptOptions, setBiometricPromptOptions] = useState<BiometricPromptOptions | null>(null);
  const [biometricAuthResolver, setBiometricAuthResolver] = useState<((result: BiometricAuthResult) => void) | null>(null);

  useEffect(() => {
    getDeviceBiometricCapability().then(cap => {
      setBiometricCapability(cap);
    });
  }, []);

  const isBiometricsEnrolled = !!(currentUser?.biometricsEnabled && currentUser?.biometricCredentialId) || !!getCredentialForUser(currentUser?.id);

  const openBiometricPrompt = useCallback((options: BiometricPromptOptions): Promise<BiometricAuthResult> => {
    return new Promise((resolve) => {
      setBiometricPromptOptions(options);
      setBiometricAuthResolver(() => resolve);
      setShowBiometricModal(true);
    });
  }, []);

  const closeBiometricPrompt = useCallback(() => {
    setShowBiometricModal(false);
    if (biometricAuthResolver) {
      biometricAuthResolver({
        success: false,
        errorType: 'USER_CANCELLED',
        message: 'Biometric authorization was cancelled.'
      });
      setBiometricAuthResolver(null);
    }
    setBiometricPromptOptions(null);
  }, [biometricAuthResolver]);

  const handleBiometricModalSuccess = useCallback((result: BiometricAuthResult) => {
    setShowBiometricModal(false);
    if (biometricAuthResolver) {
      biometricAuthResolver(result);
      setBiometricAuthResolver(null);
    }
    setBiometricPromptOptions(null);
  }, [biometricAuthResolver]);

  const registerUserBiometrics = useCallback(async (userToEnroll?: UserProfile) => {
    const targetUser = userToEnroll || currentUser;
    const res = await registerBiometricPasskey(targetUser);
    if (res.success && res.credential) {
      const updatedUser: UserProfile = {
        ...targetUser,
        biometricsEnabled: true,
        biometricCredentialId: res.credential.id,
        biometricDeviceName: res.credential.deviceName,
        biometricRegisteredAt: res.credential.createdAt,
        biometricType: res.credential.biometricType,
        requireBiometricForMoMo: targetUser.requireBiometricForMoMo ?? true
      };
      setCurrentUser(updatedUser);
      saveState({ currentUser: updatedUser });
      addToast({
        title: 'Biometrics Enrolled! 🛡️',
        message: `${res.credential.deviceName} registered for fast 1-touch login & secure MoMo transfers.`,
        type: 'success'
      });
      return { success: true, message: res.message, credential: res.credential };
    } else {
      addToast({
        title: 'Biometrics Registration',
        message: res.message,
        type: 'warning'
      });
      return { success: false, message: res.message };
    }
  }, [currentUser]);

  const removeUserBiometrics = useCallback(async (userId?: string) => {
    const id = userId || currentUser.id;
    removeCredentialsForUser(id);
    const updatedUser: UserProfile = {
      ...currentUser,
      biometricsEnabled: false,
      biometricCredentialId: undefined,
      biometricDeviceName: undefined,
      biometricRegisteredAt: undefined
    };
    setCurrentUser(updatedUser);
    saveState({ currentUser: updatedUser });
    addToast({
      title: 'Biometrics Removed',
      message: 'Biometric passkey has been removed from this device.',
      type: 'info'
    });
  }, [currentUser]);

  const authenticateWithBiometrics = useCallback(async (actionType: BiometricActionType = 'LOGIN', customTitle?: string) => {
    return openBiometricPrompt({
      actionType,
      title: customTitle,
      subtitle: actionType === 'LOGIN' ? '1-Touch Face ID / Fingerprint Login' : 'Verify Biometric Identity'
    });
  }, [openBiometricPrompt]);

  const openShareImpactModal = useCallback((customStats?: Partial<ShareImpactStats>) => {
    setShareImpactCustomStats(customStats);
    setShowShareImpactModal(true);
  }, []);

  const closeShareImpactModal = useCallback(() => {
    setShowShareImpactModal(false);
    setShareImpactCustomStats(undefined);
  }, []);

  // Instant Camera Waste Scanner State
  const [showInstantScanModal, setShowInstantScanModal] = useState<boolean>(false);
  const openInstantScanModal = useCallback(() => setShowInstantScanModal(true), []);
  const closeInstantScanModal = useCallback(() => setShowInstantScanModal(false), []);

  const [isDeviceFrameMode, setIsDeviceFrameMode] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Push Notification State
  const [pushSettings, setPushSettings] = useState<PushNotificationSettings>(() => {
    try {
      const saved = localStorage.getItem('ecosort_push_settings_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If legacy 60s interval was saved, upgrade to the new 10-minute (600s) default
        if (parsed.autoIntervalSeconds === 60) {
          parsed.autoIntervalSeconds = 600;
        }
        return { ...DEFAULT_PUSH_SETTINGS, ...parsed };
      }
    } catch {
      // ignore
    }
    return DEFAULT_PUSH_SETTINGS;
  });

  const [pushAlerts, setPushAlerts] = useState<SimulatedPushAlert[]>(() => {
    try {
      const saved = localStorage.getItem('ecosort_push_alerts_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return PUSH_NOTIFICATION_SCENARIOS;
  });

  const [activePushBanner, setActivePushBanner] = useState<SimulatedPushAlert | null>(null);

  // Offline Local Persistence & Network State
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const effectiveIsOnline = isOnline && !isSimulatedOffline;

  const [pendingOfflineQueue, setPendingOfflineQueue] = useState<QueuedOfflineSubmission[]>([]);
  const [offlineStats, setOfflineStats] = useState<OfflineCacheStats | null>(null);
  const [showOfflineQueueModal, setShowOfflineQueueModal] = useState<boolean>(false);

  // IndexedDB Local-First Data Cache State
  const [lastCachedAt, setLastCachedAt] = useState<string | null>(null);
  const [isHydratedFromCache, setIsHydratedFromCache] = useState<boolean>(false);
  const [cachedMetrics, setCachedMetrics] = useState<CachedDashboardMetrics | null>(null);

  const updatePushSettings = useCallback((updates: Partial<PushNotificationSettings>) => {
    setPushSettings(prev => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('ecosort_push_settings_v1', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const dismissActivePushBanner = useCallback(() => {
    setActivePushBanner(null);
  }, []);

  const [allUsers, setAllUsers] = useState<UserProfile[]>(INITIAL_ALL_USERS);
  const [adminAuditLogs, setAdminAuditLogs] = useState<AdminAuditLog[]>(INITIAL_ADMIN_AUDIT_LOGS);
  const [submissions, setSubmissions] = useState<WasteSubmission[]>(INITIAL_SUBMISSIONS);
  const [collectionJobs, setCollectionJobs] = useState<CollectionJob[]>(INITIAL_COLLECTION_JOBS);
  const [rewardRules, setRewardRules] = useState<RewardRateRule[]>(INITIAL_REWARD_RULES);
  const [rewards, setRewards] = useState<RewardItem[]>(INITIAL_REWARDS);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [transactions, setTransactions] = useState<PointTransaction[]>(INITIAL_POINT_TRANSACTIONS);
  const [cashWithdrawals, setCashWithdrawals] = useState<CashWithdrawalRecord[]>(INITIAL_CASH_WITHDRAWALS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [challenge, setChallenge] = useState<Challenge>(INITIAL_CHALLENGE);
  const [recyclerInventory, setRecyclerInventory] = useState<RecyclerInventory[]>(INITIAL_RECYCLER_INVENTORY);
  const [recyclerOrders, setRecyclerOrders] = useState<RecyclerOrder[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Community & Eco-Trade State
  const [swapItems, setSwapItems] = useState<CommunitySwapItem[]>(INITIAL_SWAP_ITEMS);
  const [swapTradeRequests, setSwapTradeRequests] = useState<SwapTradeRequest[]>([]);
  const [communityEvents, setCommunityEvents] = useState<CommunityEvent[]>(INITIAL_COMMUNITY_EVENTS);
  const [forumPosts, setForumPosts] = useState<CommunityForumPost[]>(INITIAL_FORUM_POSTS);
  const [districtQuests, setDistrictQuests] = useState<DistrictCollectiveQuest[]>(INITIAL_DISTRICT_QUESTS);
  const [ambassadors, setAmbassadors] = useState<CommunityAmbassador[]>(INITIAL_AMBASSADORS);

  // Smart Dust Bin & LED Indicator IoT Grid State
  const [smartBins, setSmartBins] = useState<SmartDustBin[]>(() => {
    try {
      const saved = localStorage.getItem('ecosort_smart_bins_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SMART_BINS;
  });
  const [selectedSmartBin, setSelectedSmartBin] = useState<SmartDustBin | null>(() => INITIAL_SMART_BINS[0] || null);
  const [showSmartBinPairModal, setShowSmartBinPairModal] = useState<boolean>(false);
  const [maintenanceLogs, setMaintenanceLogs] = useState<SmartBinMaintenanceLog[]>(() => {
    try {
      const saved = localStorage.getItem('ecosort_maintenance_logs_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MAINTENANCE_LOGS;
  });
  const [robotEvents, setRobotEvents] = useState<RobotSortingEvent[]>([
    {
      id: 'rob-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString(),
      itemName: 'Voltic PET Water Bottle',
      category: 'PLASTIC',
      material: 'PET Plastic',
      confidence: 96.8,
      weightKg: 0.18,
      destinationBin: 'PLASTIC',
      pointsGenerated: 2,
      status: 'SUCCESS'
    },
    {
      id: 'rob-002',
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toLocaleTimeString(),
      itemName: 'Malt Drink Aluminum Can',
      category: 'METAL',
      material: 'Aluminum Can',
      confidence: 98.4,
      weightKg: 0.15,
      destinationBin: 'METAL',
      pointsGenerated: 3,
      status: 'SUCCESS'
    }
  ]);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Welcome to EcoSort Ghana! 🇬🇭',
      message: 'Turn waste into value. Upload your recyclables or explore the virtual sorting robot.',
      type: 'INFO',
      timestamp: 'Just now',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Points Credited: +24 EcoPoints',
      message: 'Collector Kwame Asante verified your 2.4 kg PET plastic collection at Commonwealth Hall.',
      type: 'POINTS',
      timestamp: '2 hours ago',
      read: false
    }
  ]);

  // Sync Haptics Engine with user push/device settings
  useEffect(() => {
    haptics.setEnabled(pushSettings.hapticEnabled !== false);
  }, [pushSettings.hapticEnabled]);

  // Listen for native PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Register ServiceWorker and Online/Offline Listeners
  useEffect(() => {
    registerServiceWorker({
      onSyncTrigger: () => {
        syncOfflineQueueNow();
      },
      onSuccess: () => {
        addToast({
          title: 'Offline Storage Active 📦',
          message: 'EcoSort Ghana service worker cached the app for offline recycling.',
          type: 'info',
          duration: 3500
        });
      }
    });

    const handleOnline = () => {
      setIsOnline(true);
      addToast({
        title: 'Network Restored 🟢',
        message: 'Connected to EPA Ghana Node. Preparing to sync offline records.',
        type: 'success',
        duration: 3000
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      addToast({
        title: 'Offline Mode Activated 🟠',
        message: 'No active connection. Recycling uploads will be queued locally in IndexedDB.',
        type: 'warning',
        duration: 4000
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load from offline store
    offlineQueueService.getAllQueued().then(items => {
      setPendingOfflineQueue(items);
      offlineQueueService.getStats().then(stats => setOfflineStats(stats));
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshOfflineStats = useCallback(async () => {
    const all = await offlineQueueService.getAllQueued();
    setPendingOfflineQueue(all);
    const stats = await offlineQueueService.getStats();
    setOfflineStats(stats);
  }, []);

  const syncOfflineQueueNow = useCallback(async (): Promise<{ successCount: number; failedCount: number }> => {
    const pending = await offlineQueueService.getPendingItems();
    if (pending.length === 0) {
      return { successCount: 0, failedCount: 0 };
    }

    let successCount = 0;
    let failedCount = 0;

    for (const item of pending) {
      try {
        await offlineQueueService.updateSubmission(item.id, { status: 'SYNCING' });

        const liveSubmissionId = item.id.startsWith('sub-') ? item.id : `sub-${item.id}`;
        const newSubmission: WasteSubmission = {
          id: liveSubmissionId,
          userId: item.userId || currentUser.id,
          userName: item.userName || currentUser.name,
          imageUrl: item.imageUrl,
          classification: item.classification,
          userWeightEstimateKg: item.userWeightEstimateKg,
          status: 'REQUESTED',
          pickupAddress: item.pickupAddress,
          community: item.community,
          preferredPickupTime: item.preferredPickupTime,
          notes: item.notes,
          pointsAwarded: 0,
          isOfflineQueued: false,
          offlineSyncedAt: new Date().toISOString(),
          createdAt: item.queuedAt || new Date().toISOString(),
        };

        const newJob: CollectionJob = {
          id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          submissionId: liveSubmissionId,
          userId: item.userId || currentUser.id,
          userName: item.userName || currentUser.name,
          userPhone: currentUser.phone,
          wasteCategory: item.classification.category,
          material: item.classification.material,
          estimatedWeightKg: item.userWeightEstimateKg,
          location: item.pickupAddress,
          community: item.community,
          distanceKm: +(1.2 + Math.random() * 2.0).toFixed(1),
          status: 'REQUESTED',
          photoUrl: item.imageUrl,
          scheduledTime: item.preferredPickupTime,
          notes: item.notes ? `[Synced from Offline Queue] ${item.notes}` : '[Synced from Offline Queue]',
          createdAt: item.queuedAt || new Date().toISOString(),
        };

        setSubmissions(prev => [newSubmission, ...prev.filter(s => s.id !== liveSubmissionId)]);
        setCollectionJobs(prev => [newJob, ...prev.filter(j => j.submissionId !== liveSubmissionId)]);

        await offlineQueueService.updateSubmission(item.id, { 
          status: 'SYNCED', 
          syncedAt: new Date().toISOString() 
        });

        successCount++;
      } catch (err: any) {
        failedCount++;
        await offlineQueueService.updateSubmission(item.id, { 
          status: 'FAILED', 
          lastError: err?.message || 'Sync error',
          retryCount: (item.retryCount || 0) + 1 
        });
      }
    }

    await refreshOfflineStats();

    if (successCount > 0) {
      soundEffects.playSyncCompleteChime();
      triggerCelebration();

      addToast({
        title: `⚡ ${successCount} Offline Upload${successCount > 1 ? 's' : ''} Synced!`,
        message: `Successfully broadcast to EPA Ghana Node and collection fleet.`,
        type: 'success',
        syncState: 'synced',
        duration: 4500
      });
    }

    return { successCount, failedCount };
  }, [currentUser, refreshOfflineStats]);

  const removeQueuedOfflineSubmission = useCallback(async (id: string) => {
    await offlineQueueService.removeSubmission(id);
    await refreshOfflineStats();
    addToast({
      title: 'Item Removed',
      message: 'Submission removed from offline queue.',
      type: 'info'
    });
  }, [refreshOfflineStats]);

  const clearOfflineQueue = useCallback(async () => {
    await offlineQueueService.clearAll();
    await refreshOfflineStats();
    addToast({
      title: 'Queue Cleared',
      message: 'All cached offline submissions cleared.',
      type: 'info'
    });
  }, [refreshOfflineStats]);

  const addTestOfflineSubmission = useCallback(async () => {
    const testId = `offline-sub-${Date.now()}`;
    const testSubmission: QueuedOfflineSubmission = {
      id: testId,
      userId: currentUser.id,
      userName: currentUser.name,
      imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400',
      classification: {
        category: 'PLASTIC',
        material: 'PET Plastic',
        confidence: 97.4,
        recyclable: true,
        estimatedWeightKg: 3.2,
        estimatedPoints: 32,
        handlingInstructions: 'Rinse cleanly, flatten bottles, and tie bundle.',
        co2ReductionPerKg: 1.6,
        detectedFeatures: ['Offline On-Device Heuristic Classifier', 'Clear PET Resin #1']
      },
      userWeightEstimateKg: 3.2,
      pickupAddress: currentUser.address || 'Commonwealth Hall, Room 14, Legon',
      community: currentUser.community || 'Legon Campus',
      preferredPickupTime: 'Today, 3:00 PM - 5:00 PM',
      notes: 'Clean sorted PET bottles cached while offline.',
      status: 'QUEUED',
      queuedAt: new Date().toLocaleTimeString(),
      queuedTimestamp: Date.now(),
      retryCount: 0,
      offlineHeuristicUsed: true
    };

    await offlineQueueService.addSubmission(testSubmission);
    soundEffects.playOfflineQueuedChime();
    await refreshOfflineStats();

    addToast({
      title: 'Test Offline Item Queued 📦',
      message: 'Stored in IndexedDB / LocalStorage. Reconnect or click Sync to upload.',
      type: 'info'
    });
  }, [currentUser, refreshOfflineStats]);

  // Auto-sync when effectiveIsOnline becomes true and there are pending items
  useEffect(() => {
    if (effectiveIsOnline) {
      offlineQueueService.getPendingItems().then(pending => {
        if (pending.length > 0) {
          syncOfflineQueueNow();
        }
      });
    }
  }, [effectiveIsOnline, syncOfflineQueueNow]);

  const triggerNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        addToast({
          title: 'EcoSort App Installed! 📱',
          message: 'Shortcut added to your home screen. Launch anytime offline!',
          type: 'success',
          syncState: 'synced'
        });
      }
      setDeferredPrompt(null);
    } else {
      setShowApkModal(true);
    }
  };
  // 1. Initial State Hydration from IndexedDB (with LocalStorage fast-path)
  useEffect(() => {
    // Fast synchronous recovery
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.allUsers) && parsed.allUsers.length > 0) setAllUsers(parsed.allUsers);
        if (Array.isArray(parsed.adminAuditLogs) && parsed.adminAuditLogs.length > 0) setAdminAuditLogs(parsed.adminAuditLogs);
        if (Array.isArray(parsed.submissions) && parsed.submissions.length > 0) setSubmissions(parsed.submissions);
        if (Array.isArray(parsed.collectionJobs) && parsed.collectionJobs.length > 0) setCollectionJobs(parsed.collectionJobs);
        if (parsed.currentUser && typeof parsed.currentUser.ecoPoints === 'number') setCurrentUser(parsed.currentUser);
        if (Array.isArray(parsed.transactions) && parsed.transactions.length > 0) setTransactions(parsed.transactions);
        if (Array.isArray(parsed.cashWithdrawals) && parsed.cashWithdrawals.length > 0) setCashWithdrawals(parsed.cashWithdrawals);
        if (Array.isArray(parsed.redemptions)) setRedemptions(parsed.redemptions);
        if (Array.isArray(parsed.rewardRules) && parsed.rewardRules.length > 0) setRewardRules(parsed.rewardRules);
        if (Array.isArray(parsed.robotEvents) && parsed.robotEvents.length > 0) setRobotEvents(parsed.robotEvents);
      }
    } catch (e) {
      console.warn('Recovered baseline EcoSort state:', e);
    }

    // Comprehensive Async Hydration from IndexedDB Local Cache
    localDataCache.loadCachedState().then(cached => {
      if (cached) {
        if (cached.currentUser) setCurrentUser(cached.currentUser);
        if (Array.isArray(cached.allUsers) && cached.allUsers.length > 0) setAllUsers(cached.allUsers);
        if (Array.isArray(cached.adminAuditLogs) && cached.adminAuditLogs.length > 0) setAdminAuditLogs(cached.adminAuditLogs);
        if (Array.isArray(cached.submissions) && cached.submissions.length > 0) setSubmissions(cached.submissions);
        if (Array.isArray(cached.collectionJobs) && cached.collectionJobs.length > 0) setCollectionJobs(cached.collectionJobs);
        if (Array.isArray(cached.transactions) && cached.transactions.length > 0) setTransactions(cached.transactions);
        if (Array.isArray(cached.cashWithdrawals) && cached.cashWithdrawals.length > 0) setCashWithdrawals(cached.cashWithdrawals);
        if (Array.isArray(cached.redemptions) && cached.redemptions.length > 0) setRedemptions(cached.redemptions);
        if (Array.isArray(cached.rewardRules) && cached.rewardRules.length > 0) setRewardRules(cached.rewardRules);
        if (Array.isArray(cached.robotEvents) && cached.robotEvents.length > 0) setRobotEvents(cached.robotEvents);
        if (Array.isArray(cached.leaderboard) && cached.leaderboard.length > 0) setLeaderboard(cached.leaderboard);
        if (cached.challenge) setChallenge(cached.challenge);
        if (Array.isArray(cached.recyclerInventory) && cached.recyclerInventory.length > 0) setRecyclerInventory(cached.recyclerInventory);
        if (Array.isArray(cached.recyclerOrders) && cached.recyclerOrders.length > 0) setRecyclerOrders(cached.recyclerOrders);
        if (Array.isArray(cached.notifications) && cached.notifications.length > 0) setNotifications(cached.notifications);
        if (cached.lastCachedTimestamp) {
          setLastCachedAt(new Date(cached.lastCachedTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
        setIsHydratedFromCache(true);
      }
    }).catch(err => {
      console.warn('[EcoSortContext] IndexedDB hydration note:', err);
    });

    localDataCache.getCachedMetrics().then(metrics => {
      if (metrics) setCachedMetrics(metrics);
    });

    // 3. Initialize Cloud Firestore seed & real-time synchronization
    firestoreService.seedInitialCloudData(INITIAL_SUBMISSIONS, INITIAL_COLLECTION_JOBS, INITIAL_USER);

    const unsubUsers = firestoreService.subscribeToUsers((cloudUsers) => {
      if (cloudUsers && cloudUsers.length > 0) {
        setAllUsers(prev => {
          const cloudIds = new Set(cloudUsers.map(u => u.id));
          const localOnly = prev.filter(u => !cloudIds.has(u.id));
          return [...localOnly, ...cloudUsers];
        });
      }
    });

    const unsubSubmissions = firestoreService.subscribeToSubmissions((cloudSubs) => {
      if (cloudSubs && cloudSubs.length > 0) {
        setSubmissions(prev => {
          // Merge cloud submissions with locally pending offline queue items
          const offlinePending = prev.filter(s => s.isOfflineQueued);
          const cloudIds = new Set(cloudSubs.map(s => s.id));
          const uniqueOffline = offlinePending.filter(s => !cloudIds.has(s.id));
          return [...uniqueOffline, ...cloudSubs];
        });
      }
    });

    const unsubJobs = firestoreService.subscribeToCollectionJobs((cloudJobs) => {
      if (cloudJobs && cloudJobs.length > 0) {
        setCollectionJobs(cloudJobs);
      }
    });

    return () => {
      unsubUsers();
      unsubSubmissions();
      unsubJobs();
    };
  }, []);

  // Synchronize Firebase Authentication state with Firestore User Profiles
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        try {
          // Look up user profile from Firestore by UID or email
          let profile = await firestoreService.getUserProfile(fbUser.uid);
          if (!profile && fbUser.email) {
            profile = await firestoreService.getUserProfileByEmail(fbUser.email);
          }

          if (profile) {
            const updatedProfile: UserProfile = {
              ...profile,
              authProvider: 'google',
              googleId: fbUser.uid
            };
            setCurrentUser(updatedProfile);
            setIsRegistered(true);
            try {
              localStorage.setItem('ecosort_ghana_registered_v2', 'true');
            } catch {}
          }
        } catch (err) {
          console.warn('[Firebase Auth] Profile sync note:', err);
        }
      } else {
        setFirebaseUser(null);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // 2. Automatic Debounced Persistence to IndexedDB Local-First Cache
  useEffect(() => {
    const timer = setTimeout(() => {
      const stateToCache: EcoSortCachedState = {
        currentUser,
        allUsers,
        adminAuditLogs,
        submissions,
        collectionJobs,
        rewardRules,
        rewards,
        redemptions,
        transactions,
        cashWithdrawals,
        leaderboard,
        challenge,
        recyclerInventory,
        recyclerOrders,
        robotEvents,
        notifications
      };

      localDataCache.saveStateToCache(stateToCache).then(() => {
        setLastCachedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }).catch(err => {
        console.warn('[EcoSortContext] Auto-cache to IndexedDB note:', err);
      });

      // Synchronous LocalStorage baseline fallback
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToCache));
      } catch {
        // ignore
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    currentUser,
    allUsers,
    adminAuditLogs,
    submissions,
    collectionJobs,
    rewardRules,
    rewards,
    redemptions,
    transactions,
    cashWithdrawals,
    leaderboard,
    challenge,
    recyclerInventory,
    recyclerOrders,
    robotEvents,
    notifications
  ]);

  // Sync to local storage & IndexedDB manually
  const saveState = (updatedState: Partial<{
    currentUser: UserProfile;
    submissions: WasteSubmission[];
    collectionJobs: CollectionJob[];
    transactions: PointTransaction[];
    cashWithdrawals: CashWithdrawalRecord[];
    redemptions: RewardRedemption[];
    rewardRules: RewardRateRule[];
    robotEvents: RobotSortingEvent[];
  }>) => {
    const current: EcoSortCachedState = {
      currentUser: updatedState.currentUser || currentUser,
      submissions: updatedState.submissions || submissions,
      collectionJobs: updatedState.collectionJobs || collectionJobs,
      transactions: updatedState.transactions || transactions,
      cashWithdrawals: updatedState.cashWithdrawals || cashWithdrawals,
      redemptions: updatedState.redemptions || redemptions,
      rewardRules: updatedState.rewardRules || rewardRules,
      robotEvents: updatedState.robotEvents || robotEvents,
      rewards,
      leaderboard,
      challenge,
      recyclerInventory,
      recyclerOrders,
      notifications
    };
    
    localDataCache.saveStateToCache(current).catch(() => {});
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.error('Failed to save EcoSort state:', e);
    }
  };

  const saveToLocalCacheNow = useCallback(async () => {
    const stateToCache: EcoSortCachedState = {
      currentUser,
      submissions,
      collectionJobs,
      rewardRules,
      rewards,
      redemptions,
      transactions,
      cashWithdrawals,
      leaderboard,
      challenge,
      recyclerInventory,
      recyclerOrders,
      robotEvents,
      notifications
    };
    await localDataCache.saveStateToCache(stateToCache);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastCachedAt(nowTime);
    addToast({
      title: 'Local Cache Refreshed 💾',
      message: `All dashboard stats and submissions saved locally to IndexedDB at ${nowTime}.`,
      type: 'success',
      syncState: 'synced',
      duration: 3500
    });
  }, [
    currentUser,
    submissions,
    collectionJobs,
    rewardRules,
    rewards,
    redemptions,
    transactions,
    cashWithdrawals,
    leaderboard,
    challenge,
    recyclerInventory,
    recyclerOrders,
    robotEvents,
    notifications
  ]);

  const clearLocalCacheData = useCallback(async () => {
    await localDataCache.clearCache();
    setLastCachedAt(null);
    addToast({
      title: 'Local Cache Cleared',
      message: 'IndexedDB cache has been emptied.',
      type: 'info'
    });
  }, []);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#2563eb', '#f59e0b', '#059669', '#16a34a']
    });
  };

  const addToast = useCallback((toastData: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: Toast = {
      ...toastData,
      id,
      timestamp: toastData.timestamp || 'Just now',
    };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]); // Stack max 5 toasts
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<Toast>) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const showSyncToast = useCallback((title: string, message: string, syncDurationMs = 1200) => {
    const id = addToast({
      title,
      message,
      type: 'sync',
      syncState: 'syncing',
      duration: syncDurationMs + 3000
    });

    setTimeout(() => {
      updateToast(id, {
        title: 'Synchronized! ⚡',
        message: 'Changes verified and written to Ghana Circular Ledger.',
        type: 'success',
        syncState: 'synced',
      });
    }, syncDurationMs);
  }, [addToast, updateToast]);

  const switchRole = (roleName: 'USER' | 'COLLECTION_AGENT' | 'RECYCLER' | 'ADMIN') => {
    switch (roleName) {
      case 'USER':
        setIsAdminAuthenticated(false);
        setCurrentUser(INITIAL_USER);
        setCurrentView('user-dashboard');
        break;
      case 'COLLECTION_AGENT':
        setIsAdminAuthenticated(false);
        setCurrentUser(DEMO_AGENTS[0]);
        setCurrentView('collector-app');
        break;
      case 'RECYCLER':
        setIsAdminAuthenticated(false);
        setCurrentUser(DEMO_RECYCLER);
        setCurrentView('recycler');
        break;
      case 'ADMIN':
        if (isAdminAuthenticated) {
          setCurrentUser(DEMO_ADMIN);
          setCurrentView('admin');
        } else {
          setShowAdminAuthModal(true);
        }
        break;
    }
  };

  const registerUser = (data: {
    name: string;
    phone: string;
    email: string;
    location: string;
    community?: string;
    address?: string;
    organization?: string;
    role: UserRole;
    entityType?: EntityType;
    institutionName?: string;
    memberCount?: number;
    contactPerson?: string;
    leaderboardOptIn?: boolean;
    avatar?: string;
    ghanaCardNumber?: string;
    ghanaTelecomNetwork?: 'MTN' | 'Telecel' | 'AT' | 'Other';
  }): UserProfile => {
    const roleTitles: Record<UserRole, string> = {
      USER: 'Citizen EcoSorter',
      COLLECTION_AGENT: 'Certified Fleet Agent',
      RECYCLER: 'Industrial Offtaker',
      ADMIN: 'EPA Municipal Officer',
      COMMUNITY_ADMIN: 'Community Coordinator'
    };

    const assignedEntityType: EntityType = data.entityType || 'INDIVIDUAL';
    const assignedInstitution = data.institutionName || data.organization || (assignedEntityType === 'INDIVIDUAL' ? 'Independent EcoSorter' : data.name);
    const assignedMembers = data.memberCount && data.memberCount > 0 ? data.memberCount : 1;

    const newUser: UserProfile = {
      id: `GH-USER-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      entityType: assignedEntityType,
      institutionName: assignedInstitution,
      memberCount: assignedMembers,
      contactPerson: data.contactPerson || data.name,
      leaderboardOptIn: data.leaderboardOptIn !== false,
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      organization: assignedInstitution,
      location: data.location || 'Accra, Ghana',
      community: data.community || data.location,
      address: data.address || '',
      ghanaCardNumber: data.ghanaCardNumber || '',
      ghanaTelecomNetwork: data.ghanaTelecomNetwork || 'MTN',
      ecoPoints: 50, // 50 Welcome EcoPoints grant!
      totalWasteKg: 0,
      verifiedCollections: 0,
      co2SavedKg: 0,
      rankTitle: roleTitles[data.role] || 'Novice EcoSorter',
      createdAt: new Date().toISOString(),
      requireBiometricForMoMo: true,
      momoBiometricPolicy: 'THRESHOLD_ONLY',
      momoBiometricThresholdGhs: 20,
    };

    // Welcome transaction
    const welcomeTx: PointTransaction = {
      id: `tx-welcome-${Date.now()}`,
      userId: newUser.id,
      type: 'SIMULATION_GRANT',
      amount: 50,
      description: 'Welcome Bonus: EPA Ghana Digital Citizen Onboarding Grant',
      createdAt: new Date().toISOString(),
      balanceAfter: 50
    };

    const updatedTxs = [welcomeTx, ...transactions];

    // Add / Sync entry on national leaderboard if opted in
    if (newUser.leaderboardOptIn) {
      const leaderType = assignedEntityType === 'SCHOOL' ? 'SCHOOL' :
                         assignedEntityType === 'COMMUNITY' ? 'COMMUNITY' :
                         assignedEntityType === 'ORGANIZATION' ? 'ORGANIZATION' : 'INDIVIDUAL';
      
      const leaderBadge = assignedEntityType === 'SCHOOL' ? '🏫 High-Impact Green School' :
                          assignedEntityType === 'COMMUNITY' ? '🏘️ Active Community Hub' :
                          assignedEntityType === 'ORGANIZATION' ? '🏢 Eco Enterprise Vanguard' : '🌟 Verified Eco Champion';

      const entryName = assignedEntityType === 'INDIVIDUAL'
        ? `${data.name} (You)`
        : `${assignedInstitution} (${data.name})`;

      const newEntry: LeaderboardEntry = {
        rank: leaderboard.length + 1,
        id: newUser.id,
        name: entryName,
        type: leaderType,
        entityType: assignedEntityType,
        location: newUser.community || newUser.location,
        wasteCollectedKg: 0,
        pointsEarned: 50,
        participantsCount: assignedMembers,
        badge: leaderBadge,
        avatar: newUser.avatar,
        institutionName: assignedInstitution,
        isCurrentUser: true,
        contactPerson: data.contactPerson || data.name
      };

      // Filter out old self entry if any and append new
      const cleaned = leaderboard.filter(e => !e.isCurrentUser && e.id !== newUser.id);
      const combined = [...cleaned, newEntry];
      combined.sort((a, b) => (b.pointsEarned - a.pointsEarned) || (b.wasteCollectedKg - a.wasteCollectedKg));
      const reRanked = combined.map((item, idx) => ({ ...item, rank: idx + 1 }));
      setLeaderboard(reRanked);
    }

    // Welcome notification
    const welcomeNotif: AppNotification = {
      id: `notif-welcome-${Date.now()}`,
      title: `Akwaaba, ${data.name}! 🇬🇭`,
      message: `Account activated as ${assignedEntityType} with +50 Welcome EcoPoints. ID: ${newUser.id} registered under ${newUser.community || newUser.location}.`,
      type: 'SUCCESS',
      timestamp: 'Just now',
      read: false
    };

    setCurrentUser(newUser);
    setTransactions(updatedTxs);
    setNotifications(prev => [welcomeNotif, ...prev]);
    setIsRegistered(true);
    setShowAuthModal(false);

    // Set appropriate view
    switch (data.role) {
      case 'USER': setCurrentView('user-dashboard'); break;
      case 'COLLECTION_AGENT': setCurrentView('collector-app'); break;
      case 'RECYCLER': setCurrentView('recycler'); break;
      case 'ADMIN': setCurrentView('admin'); break;
      default: setCurrentView('user-dashboard'); break;
    }

    try {
      localStorage.setItem('ecosort_ghana_registered_v2', 'true');
    } catch (e) {}

    saveState({ currentUser: newUser, transactions: updatedTxs });

    // Sync new profile to Cloud Firestore
    firestoreService.saveUserProfile(newUser);

    // Dispatch Registration Welcome SMS via httpSMS API (https://httpsms.com)
    if (data.phone) {
      sendRegistrationWelcomeSms({
        name: data.name,
        phone: data.phone,
        userId: newUser.id,
        ecoPoints: 50,
        entityType: assignedEntityType,
        location: newUser.community || newUser.location
      }).then((res) => {
        refreshSmsLogs();
        if (res.success) {
          addToast({
            title: 'Welcome SMS Dispatched 📲',
            message: `httpSMS sent Akwaaba confirmation to ${data.phone}`,
            type: 'info',
            duration: 4500
          });
        }
      }).catch((err) => {
        console.warn('httpSMS welcome dispatch error:', err);
      });
    }

    triggerCelebration();

    addToast({
      title: `Digital Citizen Provisioned: ${newUser.id}`,
      message: `Akwaaba ${data.name}! Registered as ${assignedEntityType}. +50 EcoPoints credited to your leaderboard account.`,
      type: 'success',
      syncState: 'synced',
      duration: 5000
    });

    return newUser;
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    const updated: UserProfile = { ...currentUser, ...updates };
    setCurrentUser(updated);

    // Synchronize Leaderboard Entry if name, entityType, or points updated
    setLeaderboard(prev => {
      let updatedBoard = prev.map(entry => {
        if (entry.id === currentUser.id || entry.isCurrentUser) {
          const eType = updated.entityType || 'INDIVIDUAL';
          const leaderType = eType === 'SCHOOL' ? 'SCHOOL' :
                             eType === 'COMMUNITY' ? 'COMMUNITY' :
                             eType === 'ORGANIZATION' ? 'ORGANIZATION' : 'INDIVIDUAL';
          const inst = updated.institutionName || updated.organization || updated.name;
          const display = eType === 'INDIVIDUAL' ? `${updated.name} (You)` : `${inst} (${updated.name})`;

          return {
            ...entry,
            name: display,
            type: leaderType,
            entityType: eType,
            location: updated.community || updated.location,
            pointsEarned: updated.ecoPoints,
            wasteCollectedKg: updated.totalWasteKg,
            participantsCount: updated.memberCount || 1,
            avatar: updated.avatar,
            institutionName: inst,
            contactPerson: updated.contactPerson || updated.name,
            isCurrentUser: true
          };
        }
        return entry;
      });

      // If user wasn't in leaderboard but is now opted in, add them
      const exists = updatedBoard.some(e => e.id === currentUser.id || e.isCurrentUser);
      if (!exists && updated.leaderboardOptIn !== false) {
        const eType = updated.entityType || 'INDIVIDUAL';
        const leaderType = eType === 'SCHOOL' ? 'SCHOOL' :
                           eType === 'COMMUNITY' ? 'COMMUNITY' :
                           eType === 'ORGANIZATION' ? 'ORGANIZATION' : 'INDIVIDUAL';
        const inst = updated.institutionName || updated.organization || updated.name;
        const display = eType === 'INDIVIDUAL' ? `${updated.name} (You)` : `${inst} (${updated.name})`;

        updatedBoard.push({
          rank: updatedBoard.length + 1,
          id: updated.id,
          name: display,
          type: leaderType,
          entityType: eType,
          location: updated.community || updated.location,
          pointsEarned: updated.ecoPoints,
          wasteCollectedKg: updated.totalWasteKg,
          participantsCount: updated.memberCount || 1,
          badge: eType === 'SCHOOL' ? '🏫 High-Impact Green School' :
                 eType === 'COMMUNITY' ? '🏘️ Active Community Hub' :
                 eType === 'ORGANIZATION' ? '🏢 Eco Enterprise Vanguard' : '🌟 Verified Eco Champion',
          avatar: updated.avatar,
          institutionName: inst,
          contactPerson: updated.contactPerson || updated.name,
          isCurrentUser: true
        });
      }

      // Re-sort and rank
      updatedBoard.sort((a, b) => (b.pointsEarned - a.pointsEarned) || (b.wasteCollectedKg - a.wasteCollectedKg));
      return updatedBoard.map((item, idx) => ({ ...item, rank: idx + 1 }));
    });

    saveState({ currentUser: updated });
    firestoreService.saveUserProfile(updated);
    setShowEditProfileModal(false);

    addToast({
      title: 'Profile Updated 📝',
      message: 'User details & contact info updated across EPA Ghana node.',
      type: 'success',
      duration: 3500
    });
  };

  const loginWithGoogle = async (preferredRole: UserRole = 'USER'): Promise<UserProfile | null> => {
    setIsGoogleAuthLoading(true);
    try {
      const fbUser = await signInWithGoogle();
      if (!fbUser) {
        // User closed or cancelled the popup window
        return null;
      }

      setFirebaseUser(fbUser);

      // 1. Try to fetch existing user profile by UID or email from Firestore
      let profile = await firestoreService.getUserProfile(fbUser.uid);
      if (!profile && fbUser.email) {
        profile = await firestoreService.getUserProfileByEmail(fbUser.email);
      }

      // 2. If existing profile found, load it
      if (profile) {
        const updatedProfile: UserProfile = {
          ...profile,
          name: profile.name || fbUser.displayName || 'EcoSorter',
          email: profile.email || fbUser.email || '',
          avatar: profile.avatar || fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          authProvider: 'google',
          googleId: fbUser.uid
        };

        setCurrentUser(updatedProfile);
        setIsRegistered(true);
        setShowAuthModal(false);

        // Switch to the appropriate view for role
        switch (updatedProfile.role) {
          case 'USER': setCurrentView('user-dashboard'); break;
          case 'COMMUNITY_ADMIN': setCurrentView('user-dashboard'); break;
          case 'COLLECTION_AGENT': setCurrentView('collector-app'); break;
          case 'RECYCLER': setCurrentView('recycler'); break;
          case 'ADMIN': setCurrentView('admin'); break;
          default: setCurrentView('user-dashboard'); break;
        }

        try {
          localStorage.setItem('ecosort_ghana_registered_v2', 'true');
        } catch {}

        await firestoreService.saveUserProfile(updatedProfile);
        saveState({ currentUser: updatedProfile });

        addToast({
          title: `Signed in with Google ✅`,
          message: `Welcome back, ${updatedProfile.name}! Connected to Google account ${fbUser.email}.`,
          type: 'success',
          syncState: 'synced',
          duration: 4000
        });

        return updatedProfile;
      }

      // 3. New Google User - Provision standard profile
      const assignedName = fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Citizen EcoSorter');
      const assignedEmail = fbUser.email || '';
      const assignedAvatar = fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';
      
      const roleTitles: Record<UserRole, string> = {
        USER: 'Citizen EcoSorter',
        COLLECTION_AGENT: 'Certified Fleet Agent',
        RECYCLER: 'Industrial Offtaker',
        ADMIN: 'EPA Municipal Officer',
        COMMUNITY_ADMIN: 'Community Coordinator'
      };

      const newGoogleUser: UserProfile = {
        id: fbUser.uid,
        name: assignedName,
        email: assignedEmail,
        phone: fbUser.phoneNumber || '',
        role: preferredRole,
        entityType: 'INDIVIDUAL',
        institutionName: 'Independent EcoSorter',
        memberCount: 1,
        contactPerson: assignedName,
        leaderboardOptIn: true,
        avatar: assignedAvatar,
        organization: 'Independent EcoSorter',
        location: 'Accra Metropolitan',
        community: 'University of Ghana (Legon Campus)',
        address: 'Accra Smart Grid Drop Point',
        ghanaCardNumber: '',
        ghanaTelecomNetwork: 'MTN',
        ecoPoints: 50, // Welcome points
        totalWasteKg: 0,
        verifiedCollections: 0,
        co2SavedKg: 0,
        rankTitle: roleTitles[preferredRole] || 'Citizen EcoSorter',
        createdAt: new Date().toISOString(),
        authProvider: 'google',
        googleId: fbUser.uid
      };

      // Welcome transaction
      const welcomeTx: PointTransaction = {
        id: `tx-google-welcome-${Date.now()}`,
        userId: newGoogleUser.id,
        amount: 50,
        type: 'EARNED_BONUS',
        description: 'Google Authentication Welcome Bonus - EPA Smart Grid 🇬🇭',
        createdAt: new Date().toISOString(),
        balanceAfter: newGoogleUser.ecoPoints
      };

      const updatedTxs = [welcomeTx, ...transactions];

      setCurrentUser(newGoogleUser);
      setTransactions(updatedTxs);
      setAllUsers(prev => {
        const exists = prev.some(u => u.id === newGoogleUser.id || (newGoogleUser.email && u.email === newGoogleUser.email));
        return exists 
          ? prev.map(u => (u.id === newGoogleUser.id || (newGoogleUser.email && u.email === newGoogleUser.email) ? newGoogleUser : u))
          : [newGoogleUser, ...prev];
      });

      setIsRegistered(true);
      setShowAuthModal(false);

      switch (preferredRole) {
        case 'USER': setCurrentView('user-dashboard'); break;
        case 'COLLECTION_AGENT': setCurrentView('collector-app'); break;
        case 'RECYCLER': setCurrentView('recycler'); break;
        case 'ADMIN': setCurrentView('admin'); break;
        default: setCurrentView('user-dashboard'); break;
      }

      try {
        localStorage.setItem('ecosort_ghana_registered_v2', 'true');
      } catch (e) {}

      saveState({ currentUser: newGoogleUser, transactions: updatedTxs });
      await firestoreService.saveUserProfile(newGoogleUser);

      triggerCelebration();

      addToast({
        title: 'Google Sign-In Successful! 🇬🇭',
        message: `Akwaaba, ${newGoogleUser.name}! Account registered with Google (${assignedEmail}). +50 EcoPoints credited!`,
        type: 'success',
        syncState: 'synced',
        duration: 5000
      });

      return newGoogleUser;
    } catch (error: any) {
      const errorStr = String(error?.code || '') + ' ' + String(error?.message || '') + ' ' + String(error || '');
      const isCancellation = 
        error?.code === 'auth/popup-closed-by-user' || 
        error?.code === 'auth/cancelled-popup-request' ||
        error?.code === 'auth/user-cancelled' ||
        errorStr.includes('popup-closed-by-user') ||
        errorStr.includes('cancelled-popup-request') ||
        errorStr.includes('user-cancelled');

      if (isCancellation) {
        console.info('[Google Auth] Sign-in window closed by user.');
        return null;
      }

      console.error('[Google Auth] Sign-In error:', error);
      let errorMsg = 'Failed to sign in with Google.';
      if (error?.code === 'auth/popup-blocked') {
        errorMsg = 'Sign-in popup was blocked by browser. Please allow popups or open the app in a new browser tab.';
      } else if (error?.message) {
        errorMsg = error.message;
      }
      
      addToast({
        title: 'Google Sign-In',
        message: errorMsg,
        type: 'error',
        duration: 4500
      });
      return null;
    } finally {
      setIsGoogleAuthLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.warn('[Firebase Auth] Sign-out error:', err);
    }
    setIsAdminAuthenticated(false);
    setFirebaseUser(null);
    setIsRegistered(false);
    setShowAuthModal(true);
    try {
      localStorage.setItem('ecosort_ghana_registered_v2', 'false');
    } catch (e) {}
    addToast({
      title: 'Signed Out',
      message: 'You have been logged out. Sign in with Google, register, or choose a demo persona.',
      type: 'info',
      duration: 3000
    });
  };

  const loginWithDemoUser = (roleName: UserRole) => {
    switch (roleName) {
      case 'USER':
        setIsAdminAuthenticated(false);
        setCurrentUser(INITIAL_USER);
        setCurrentView('user-dashboard');
        break;
      case 'COMMUNITY_ADMIN':
        setIsAdminAuthenticated(false);
        setCurrentUser(DEMO_COMMUNITY_LEAD);
        setCurrentView('user-dashboard');
        break;
      case 'COLLECTION_AGENT':
        setIsAdminAuthenticated(false);
        setCurrentUser(DEMO_AGENTS[0]);
        setCurrentView('collector-app');
        break;
      case 'RECYCLER':
        setIsAdminAuthenticated(false);
        setCurrentUser(DEMO_RECYCLER);
        setCurrentView('recycler');
        break;
      case 'ADMIN':
        setShowAuthModal(false);
        setShowAdminAuthModal(true);
        return;
    }
    setIsRegistered(true);
    setShowAuthModal(false);
    try {
      localStorage.setItem('ecosort_ghana_registered_v2', 'true');
    } catch (e) {}
    addToast({
      title: 'Demo Session Active ⚡',
      message: `Signed in as ${roleName} mode.`,
      type: 'info',
      duration: 3000
    });
  };

  const loginAsAdminWithCredentials = (username: string, password: string): { success: boolean; error?: string } => {
    const normalizedUsername = (username || '').trim();
    const normalizedPassword = (password || '').trim();

    if (
      normalizedUsername.toLowerCase() === ADMIN_AUTH_CONFIG.username.toLowerCase() &&
      normalizedPassword === ADMIN_AUTH_CONFIG.password
    ) {
      setIsAdminAuthenticated(true);
      setCurrentUser(DEMO_ADMIN);
      setCurrentView('admin');
      setIsRegistered(true);
      setShowAuthModal(false);
      setShowAdminAuthModal(false);
      try {
        localStorage.setItem('ecosort_ghana_registered_v2', 'true');
      } catch (e) {}

      soundEffects.playRewardChime();
      addToast({
        title: 'EPA Ghana Admin Authenticated 🛡️',
        message: `Welcome, ${ADMIN_AUTH_CONFIG.displayName}! Full administrative command and national telemetry grid unlocked.`,
        type: 'success',
        syncState: 'synced',
        duration: 4000
      });

      return { success: true };
    }

    soundEffects.play('scan');
    return {
      success: false,
      error: 'Invalid administrator credentials. Authorized username is "UMaT SRID" and password is "wine2026".'
    };
  };

  const submitWaste = (data: {
    imageUrl: string;
    classification: WasteSubmission['classification'];
    userWeightEstimateKg: number;
    pickupAddress: string;
    community: string;
    preferredPickupTime: string;
    notes?: string;
  }): WasteSubmission => {
    // If offline (or simulating offline mode), safely cache in device persistence queue
    if (!effectiveIsOnline) {
      const offlineId = `sub-off-${Date.now()}`;
      const queuedSubmission: QueuedOfflineSubmission = {
        id: offlineId,
        userId: currentUser.id,
        userName: currentUser.name,
        imageUrl: data.imageUrl,
        classification: data.classification,
        userWeightEstimateKg: data.userWeightEstimateKg,
        pickupAddress: data.pickupAddress,
        community: data.community,
        preferredPickupTime: data.preferredPickupTime,
        notes: data.notes,
        status: 'QUEUED',
        queuedAt: new Date().toLocaleTimeString(),
        queuedTimestamp: Date.now(),
        retryCount: 0,
        offlineHeuristicUsed: !isOnline
      };

      // Add to IndexedDB & local mirror
      offlineQueueService.addSubmission(queuedSubmission).then(() => {
        refreshOfflineStats();
      });

      // Play soft confirmation sound & haptic vibration
      soundEffects.playOfflineQueuedChime();
      haptics.medium();

      // Create local submission entry with isOfflineQueued
      const newSubmission: WasteSubmission = {
        id: offlineId,
        userId: currentUser.id,
        userName: currentUser.name,
        imageUrl: data.imageUrl,
        classification: data.classification,
        userWeightEstimateKg: data.userWeightEstimateKg,
        status: 'REQUESTED',
        pickupAddress: data.pickupAddress,
        community: data.community,
        preferredPickupTime: data.preferredPickupTime,
        notes: data.notes,
        pointsAwarded: 0,
        isOfflineQueued: true,
        createdAt: new Date().toISOString(),
      };

      setSubmissions(prev => [newSubmission, ...prev]);

      addToast({
        title: '📦 Saved to Device Offline Queue',
        message: `Offline upload cached locally in IndexedDB. Will sync automatically once connection is restored.`,
        type: 'info',
        syncState: 'syncing',
        duration: 5000,
        action: {
          label: 'View Offline Queue',
          onClick: () => setShowOfflineQueueModal(true)
        }
      });

      return newSubmission;
    }

    const newId = `sub-${Date.now()}`;
    const newSubmission: WasteSubmission = {
      id: newId,
      userId: currentUser.id,
      userName: currentUser.name,
      imageUrl: data.imageUrl,
      classification: data.classification,
      userWeightEstimateKg: data.userWeightEstimateKg,
      status: 'REQUESTED',
      pickupAddress: data.pickupAddress,
      community: data.community,
      preferredPickupTime: data.preferredPickupTime,
      notes: data.notes,
      pointsAwarded: 0,
      createdAt: new Date().toISOString(),
    };

    const newJob: CollectionJob = {
      id: `job-${Date.now()}`,
      submissionId: newId,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      wasteCategory: data.classification.category,
      material: data.classification.material,
      estimatedWeightKg: data.userWeightEstimateKg,
      location: data.pickupAddress,
      community: data.community,
      distanceKm: +(1.0 + Math.random() * 2.5).toFixed(1),
      status: 'REQUESTED',
      photoUrl: data.imageUrl,
      scheduledTime: data.preferredPickupTime,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    const updatedSubmissions = [newSubmission, ...submissions];
    const updatedJobs = [newJob, ...collectionJobs];

    setSubmissions(updatedSubmissions);
    setCollectionJobs(updatedJobs);

    // Notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Collection Request Submitted 📦',
      message: `Your ${data.userWeightEstimateKg}kg ${data.classification.material} request has been dispatched to nearby EcoSort agents in ${data.community}.`,
      type: 'INFO',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    saveState({ submissions: updatedSubmissions, collectionJobs: updatedJobs });

    // Sync with Cloud Firestore
    firestoreService.saveSubmission(newSubmission);
    firestoreService.saveCollectionJob(newJob);

    // Haptic feedback on submission confirmation
    haptics.submitWaste();

    // Toast real-time sync feedback
    const toastId = `sync-toast-${Date.now()}`;
    addToast({
      title: 'Syncing Waste Submission...',
      message: `Encrypting receipt & syncing ${data.userWeightEstimateKg} kg ${data.classification.material} with EPA Ghana Ledger.`,
      type: 'sync',
      syncState: 'syncing',
      duration: 3800
    });

    setTimeout(() => {
      updateToast(toastId, {
        title: 'Collection Broadcast Dispatched! 🚀',
        message: `Synced with EPA Ghana Node. Dispatched to vetted agents in ${data.community}.`,
        type: 'success',
        syncState: 'synced',
        action: {
          label: 'View in My Dashboard',
          onClick: () => setCurrentView('user-dashboard')
        }
      });
      triggerCelebration();
    }, 1200);

    return newSubmission;
  };

  /**
   * Instant Scan & Immediate Point Credit Engine
   * Uses Camera AI Vision to classify and instantly credit points to user's balance with ZERO manual entry.
   */
  const instantScanAndCreditWaste = useCallback((data: {
    imageUrl: string;
    classification: WasteClassificationResult;
    measuredWeightKg?: number;
    notes?: string;
  }) => {
    const weight = Math.max(0.02, +(data.measuredWeightKg || data.classification.estimatedWeightKg || 0.25).toFixed(2));
    const rule = rewardRules.find(r => r.category === data.classification.category);
    const pointsPerKg = rule ? rule.pointsPerKg : 10;
    const co2PerKg = rule ? rule.co2SavingsPerKg : 1.6;
    
    // Calculate points with minimum 1 point
    const pointsAwarded = Math.max(1, Math.round(weight * pointsPerKg));
    const co2Saved = +(weight * co2PerKg).toFixed(2);
    const subId = `sub-instant-${Date.now()}`;
    const nowStr = new Date().toISOString();

    // 1. Create verified submission record directly with status POINTS_AWARDED
    const newSubmission: WasteSubmission = {
      id: subId,
      userId: currentUser.id,
      userName: currentUser.name,
      imageUrl: data.imageUrl,
      classification: {
        ...data.classification,
        estimatedPoints: pointsAwarded,
        estimatedWeightKg: weight
      },
      userWeightEstimateKg: weight,
      actualWeightKg: weight,
      status: 'POINTS_AWARDED',
      pickupAddress: currentUser.address || currentUser.location || 'Instant Optical Scan Hub (EPA GH Live)',
      community: currentUser.community || currentUser.location || 'Accra Central',
      preferredPickupTime: 'Verified Instantly via AI Camera Vision',
      notes: data.notes || `Direct verification via Real-Time Optical AI Scanner (${data.classification.resinCode || data.classification.material})`,
      pointsAwarded,
      createdAt: nowStr,
      verifiedAt: nowStr,
      verifiedByAgentId: 'EPA-AI-OPTICAL-NODE',
      verifiedByAgentName: 'EPA Ghana AI Optical Verification Node',
      verificationPhotoUrl: data.imageUrl,
    };

    // 2. Create point transaction record with INSTANT_SCAN_EARN
    const newBalance = currentUser.ecoPoints + pointsAwarded;
    const newTx: PointTransaction = {
      id: `tx-instant-${Date.now()}`,
      userId: currentUser.id,
      type: 'INSTANT_SCAN_EARN',
      amount: pointsAwarded,
      description: `Instant Camera AI Scan: ${weight} kg ${data.classification.material} (${data.classification.resinCode || data.classification.category})`,
      referenceId: subId,
      createdAt: nowStr,
      balanceAfter: newBalance,
    };

    // 3. Update User Profile
    const updatedUser: UserProfile = {
      ...currentUser,
      ecoPoints: newBalance,
      totalWasteKg: +(currentUser.totalWasteKg + weight).toFixed(2),
      verifiedCollections: (currentUser.verifiedCollections || 0) + 1,
      co2SavedKg: +(currentUser.co2SavedKg + co2Saved).toFixed(2),
    };

    // 4. Update recycler inventory with newly verified waste
    const updatedInventory = recyclerInventory.map(inv => {
      if (inv.category === data.classification.category) {
        return {
          ...inv,
          availableKg: +(inv.availableKg + weight).toFixed(2),
        };
      }
      return inv;
    });

    // 5. Update Leaderboard Entry
    const updatedLeaderboard = leaderboard.map(lead => {
      if (lead.id === currentUser.id || (lead.isCurrentUser && currentUser.id === lead.id)) {
        return {
          ...lead,
          wasteCollectedKg: +(lead.wasteCollectedKg + weight).toFixed(2),
          pointsEarned: lead.pointsEarned + pointsAwarded,
        };
      }
      return lead;
    });

    // 6. Push notification / in-app notification
    const cashEquivalent = (pointsAwarded / ECO_POINTS_PER_GHS).toFixed(2);
    const newNotif: AppNotification = {
      id: `notif-instant-${Date.now()}`,
      title: `⚡ Instant Scan: +${pointsAwarded} EcoPoints (GH₵ ${cashEquivalent})`,
      message: `Camera verified ${weight} kg of ${data.classification.material}. Points credited directly to your balance.`,
      type: 'POINTS',
      timestamp: 'Just now',
      read: false,
    };

    // 7. Save State & Sync
    const updatedSubmissions = [newSubmission, ...submissions];
    const updatedTransactions = [newTx, ...transactions];

    setCurrentUser(updatedUser);
    setSubmissions(updatedSubmissions);
    setTransactions(updatedTransactions);
    setRecyclerInventory(updatedInventory);
    setLeaderboard(updatedLeaderboard);
    setNotifications(prev => [newNotif, ...prev]);

    saveState({
      currentUser: updatedUser,
      submissions: updatedSubmissions,
      transactions: updatedTransactions
    });

    // Sync to Cloud Firestore in background
    firestoreService.saveUserProfile(updatedUser);
    firestoreService.saveSubmission(newSubmission);
    firestoreService.saveTransaction(newTx);

    // Audio chime & celebration
    soundEffects.playRewardChime();
    haptics.success();
    triggerCelebration();

    // Toast confirmation
    addToast({
      title: `⚡ Instant Verified: +${pointsAwarded} EcoPoints!`,
      message: `Directly credited to ${currentUser.name}'s balance (GH₵ ${cashEquivalent} MoMo value).`,
      type: 'success',
      syncState: 'synced',
      duration: 4500,
    });

    return {
      submission: newSubmission,
      pointsAwarded,
      co2Saved,
      newBalance
    };
  }, [currentUser, rewardRules, submissions, transactions, recyclerInventory, leaderboard, saveState, triggerCelebration, addToast]);

  const acceptJob = (jobId: string) => {
    const updatedJobs = collectionJobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'ACCEPTED' as const,
          assignedAgentId: currentUser.id,
          agentName: currentUser.name,
        };
      }
      return job;
    });

    const targetJob = collectionJobs.find(j => j.id === jobId);
    const updatedSubmissions = submissions.map(sub => {
      if (targetJob && sub.id === targetJob.submissionId) {
        return {
          ...sub,
          status: 'ACCEPTED' as const,
        };
      }
      return sub;
    });

    setCollectionJobs(updatedJobs);
    setSubmissions(updatedSubmissions);
    saveState({ collectionJobs: updatedJobs, submissions: updatedSubmissions });

    // Sync acceptJob with Firestore
    const targetUpdatedJob = updatedJobs.find(j => j.id === jobId);
    if (targetUpdatedJob) {
      firestoreService.saveCollectionJob(targetUpdatedJob);
    }

    // Haptic feedback on accepting collection route
    haptics.medium();

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Job Accepted 🛵',
      message: `You accepted collection job ${jobId} at ${targetJob?.community || 'location'}.`,
      type: 'SUCCESS',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const verifyAndCollectJob = (
    jobId: string, 
    actualWeightKg: number, 
    notes?: string, 
    photoUrl?: string
  ) => {
    const job = collectionJobs.find(j => j.id === jobId);
    if (!job) return;

    const rule = rewardRules.find(r => r.category === job.wasteCategory);
    const pointsPerKg = rule ? rule.pointsPerKg : 10;
    const co2PerKg = rule ? rule.co2SavingsPerKg : 1.6;
    const pointsAwarded = Math.max(1, Math.round(actualWeightKg * pointsPerKg));
    const co2Saved = +(actualWeightKg * co2PerKg).toFixed(1);

    // Update job
    const updatedJobs = collectionJobs.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          status: 'POINTS_AWARDED' as const,
          actualWeightKg,
        };
      }
      return j;
    });

    // Update submission
    const updatedSubmissions = submissions.map(s => {
      if (s.id === job.submissionId) {
        return {
          ...s,
          status: 'POINTS_AWARDED' as const,
          actualWeightKg,
          pointsAwarded,
          verifiedAt: new Date().toISOString(),
          verifiedByAgentId: currentUser.id,
          verifiedByAgentName: currentUser.name,
          verificationPhotoUrl: photoUrl || s.imageUrl,
          notes: notes || s.notes,
        };
      }
      return s;
    });

    // Award points to citizen user (if currently Bright Mensah or user)
    const newTx: PointTransaction = {
      id: `tx-${Date.now()}`,
      userId: job.userId,
      type: 'EARNED_WASTE',
      amount: pointsAwarded,
      description: `Verified collection: ${actualWeightKg} kg ${job.material}`,
      referenceId: job.submissionId,
      createdAt: new Date().toISOString(),
      balanceAfter: currentUser.id === job.userId ? currentUser.ecoPoints + pointsAwarded : 425 + pointsAwarded,
    };

    const updatedTransactions = [newTx, ...transactions];

    let updatedUser = currentUser;
    if (currentUser.id === job.userId) {
      updatedUser = {
        ...currentUser,
        ecoPoints: currentUser.ecoPoints + pointsAwarded,
        totalWasteKg: +(currentUser.totalWasteKg + actualWeightKg).toFixed(1),
        verifiedCollections: currentUser.verifiedCollections + 1,
        co2SavedKg: +(currentUser.co2SavedKg + co2Saved).toFixed(1),
      };
      setCurrentUser(updatedUser);
    }

    // Update recycler inventory with newly verified waste
    const updatedInventory = recyclerInventory.map(inv => {
      if (inv.category === job.wasteCategory) {
        return {
          ...inv,
          availableKg: +(inv.availableKg + actualWeightKg).toFixed(1),
        };
      }
      return inv;
    });

    // Update leaderboard entry for this user or entity
    const updatedLeaderboard = leaderboard.map(lead => {
      if (lead.id === job.userId || (currentUser.id === job.userId && (lead.isCurrentUser || lead.id === currentUser.id))) {
        return {
          ...lead,
          wasteCollectedKg: +(lead.wasteCollectedKg + actualWeightKg).toFixed(1),
          pointsEarned: lead.pointsEarned + pointsAwarded,
        };
      }
      return lead;
    });

    // Also update national challenge total kg
    setChallenge(prev => ({
      ...prev,
      currentKg: +(prev.currentKg + actualWeightKg).toFixed(1)
    }));

    // Sort leaderboard by points desc then kg desc, and update ranks
    updatedLeaderboard.sort((a, b) => (b.pointsEarned - a.pointsEarned) || (b.wasteCollectedKg - a.wasteCollectedKg));
    const reRankedLeaderboard = updatedLeaderboard.map((item, idx) => ({ ...item, rank: idx + 1 }));

    setCollectionJobs(updatedJobs);
    setSubmissions(updatedSubmissions);
    setTransactions(updatedTransactions);
    setRecyclerInventory(updatedInventory);
    setLeaderboard(reRankedLeaderboard);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Waste Verified & Points Credited! 🎉',
      message: `Verified ${actualWeightKg}kg of ${job.material}. +${pointsAwarded} EcoPoints awarded.`,
      type: 'POINTS',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Toast real-time verified sync
    addToast({
      title: `Scale Verified: +${pointsAwarded} EcoPoints`,
      message: `Agent calibrated scale weight (${actualWeightKg} kg ${job.material}) synced to user balance.`,
      type: 'success',
      syncState: 'synced',
      duration: 4500
    });

    triggerCelebration();
    haptics.collectionConfirmed();
    saveState({
      currentUser: updatedUser,
      collectionJobs: updatedJobs,
      submissions: updatedSubmissions,
      transactions: updatedTransactions,
    });

    // Sync verified job, submission, transaction & user profile with Cloud Firestore
    const verifiedJob = updatedJobs.find(j => j.id === jobId);
    const verifiedSub = updatedSubmissions.find(s => s.id === job.submissionId);
    if (verifiedJob) firestoreService.saveCollectionJob(verifiedJob);
    if (verifiedSub) firestoreService.saveSubmission(verifiedSub);
    firestoreService.saveTransaction(newTx);
    firestoreService.saveUserProfile(updatedUser);

    // Dispatch Verification SMS via httpSMS API (https://httpsms.com)
    if (job.userPhone) {
      sendSmsViaHttpSms({
        to: job.userPhone,
        content: `EcoSort Ghana: Collection Verified! ${actualWeightKg}kg of ${job.material} verified by ${currentUser.name}. +${pointsAwarded} EcoPoints credited. Ref: ${job.id}. Thank you for sorting!`,
        type: 'TRANSACTION',
        metadata: {
          jobId: job.id,
          material: job.material,
          weightKg: actualWeightKg,
          pointsAwarded
        }
      }).then(() => refreshSmsLogs()).catch(() => {});
    }
  };

  const redeemReward = (rewardId: string, recipientPhoneOrAddress: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) {
      addToast({
        title: 'Redemption Failed',
        message: 'The requested reward item could not be found.',
        type: 'error',
      });
      return { success: false, message: 'Reward not found.' };
    }

    if (currentUser.ecoPoints < reward.costPoints) {
      addToast({
        title: 'Insufficient EcoPoints',
        message: `You need ${reward.costPoints} points, but have ${currentUser.ecoPoints}.`,
        type: 'warning',
      });
      return { 
        success: false, 
        message: `Insufficient EcoPoints. You need ${reward.costPoints} points, but have ${currentUser.ecoPoints}.` 
      };
    }

    const code = `GH-ECO-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRedemption: RewardRedemption = {
      id: `red-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      rewardId: reward.id,
      rewardTitle: reward.title,
      pointsSpent: reward.costPoints,
      redemptionCode: code,
      status: 'FULFILLED',
      recipientPhoneOrAddress,
      createdAt: new Date().toISOString(),
      fulfilledAt: new Date().toISOString(),
    };

    const newBalance = currentUser.ecoPoints - reward.costPoints;
    const updatedUser: UserProfile = {
      ...currentUser,
      ecoPoints: newBalance,
    };

    const newTx: PointTransaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      type: 'REDEEMED_REWARD',
      amount: -reward.costPoints,
      description: `Redeemed: ${reward.title} (Code: ${code})`,
      referenceId: reward.id,
      createdAt: new Date().toISOString(),
      balanceAfter: newBalance,
    };

    const updatedRewards = rewards.map(r => {
      if (r.id === rewardId) {
        return { ...r, stockCount: Math.max(0, r.stockCount - 1) };
      }
      return r;
    });

    const updatedRedemptions = [newRedemption, ...redemptions];
    const updatedTransactions = [newTx, ...transactions];

    setCurrentUser(updatedUser);
    setRewards(updatedRewards);
    setRedemptions(updatedRedemptions);
    setTransactions(updatedTransactions);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Reward Redeemed Successfully! 🎁',
      message: `Your ${reward.title} voucher (${code}) is active. Details sent to ${recipientPhoneOrAddress}.`,
      type: 'SUCCESS',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    addToast({
      title: `Voucher Generated: ${code}`,
      message: `Successfully redeemed ${reward.title}. Synced to digital wallet and SMS gateway.`,
      type: 'success',
      syncState: 'synced',
      duration: 5000
    });

    triggerCelebration();
    haptics.success();
    saveState({
      currentUser: updatedUser,
      redemptions: updatedRedemptions,
      transactions: updatedTransactions,
    });

    // Cloud Firestore sync
    firestoreService.saveRedemption(newRedemption);
    firestoreService.saveTransaction(newTx);
    firestoreService.saveUserProfile(updatedUser);

    // Dispatch Reward Voucher SMS via httpSMS API (https://httpsms.com)
    const targetPhone = recipientPhoneOrAddress && !recipientPhoneOrAddress.includes('@')
      ? recipientPhoneOrAddress 
      : currentUser.phone;
    if (targetPhone) {
      sendRewardRedemptionSms({
        phone: targetPhone,
        userName: currentUser.name,
        rewardTitle: reward.title,
        redemptionCode: code,
        pointsSpent: reward.costPoints,
        remainingPoints: newBalance
      }).then((res) => {
        refreshSmsLogs();
        if (res.success) {
          addToast({
            title: 'Voucher SMS Dispatched 📲',
            message: `httpSMS delivered voucher code to ${targetPhone}`,
            type: 'info',
            duration: 4500
          });
        }
      }).catch((err) => {
        console.warn('httpSMS reward redemption dispatch error:', err);
      });
    }

    return { 
      success: true, 
      code, 
      message: `Successfully redeemed ${reward.title}! Voucher Code: ${code}` 
    };
  };

  const requestCashWithdrawal = async (params: {
    pointsToConvert: number;
    network: 'MTN' | 'Telecel' | 'AT' | 'Other';
    recipientPhone: string;
    accountHolderName: string;
    ghanaCardNumber?: string;
    authorizedViaBiometrics?: boolean;
    biometricAuthRef?: string;
    biometricType?: BiometricAuthType;
  }): Promise<{ success: boolean; message: string; withdrawal?: CashWithdrawalRecord }> => {
    if (params.pointsToConvert <= 0) {
      addToast({
        title: 'Invalid Points',
        message: 'Please enter a valid amount of EcoPoints to convert.',
        type: 'warning',
      });
      return { success: false, message: 'Please enter a valid amount of EcoPoints to convert.' };
    }

    if (currentUser.ecoPoints < params.pointsToConvert) {
      addToast({
        title: 'Insufficient Balance',
        message: `You have ${currentUser.ecoPoints} points, cannot convert ${params.pointsToConvert}.`,
        type: 'error',
      });
      return { 
        success: false, 
        message: `Insufficient balance. You currently have ${currentUser.ecoPoints} EcoPoints.` 
      };
    }

    const grossGhs = +(params.pointsToConvert / ECO_POINTS_PER_GHS).toFixed(2);
    const feeGhs = 0.00; // Zero fee subsidized by EPA Ghana Circular Economy Grant
    const netPayoutGhs = grossGhs;
    const newBalance = currentUser.ecoPoints - params.pointsToConvert;

    const txRef = `MOMO-GH-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const gatewayMap = {
      MTN: 'MTN MoMo API v2.1 (GhIPSS Switch)',
      Telecel: 'Telecel Cash Direct Gateway (Instant Pay)',
      AT: 'AT Money Switch v1.4 (GhIPSS)',
      Other: 'Ghana Interbank GhIPSS Instant Transfer'
    };

    const newWithdrawal: CashWithdrawalRecord = {
      id: `wdr-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      pointsConverted: params.pointsToConvert,
      amountGhs: grossGhs,
      feeGhs,
      netPayoutGhs,
      network: params.network,
      recipientPhone: params.recipientPhone,
      accountHolderName: params.accountHolderName,
      ghanaCardNumber: params.ghanaCardNumber,
      transactionRef: txRef,
      status: 'COMPLETED',
      payoutGateway: gatewayMap[params.network] || gatewayMap.MTN,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      authorizedViaBiometrics: params.authorizedViaBiometrics ?? isBiometricsEnrolled,
      biometricAuthRef: params.biometricAuthRef || (isBiometricsEnrolled ? `BIO-MOMO-${Math.floor(100000 + Math.random() * 900000)}` : undefined),
      biometricType: params.biometricType || (currentUser.biometricType || 'FINGERPRINT')
    };

    const newTx: PointTransaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      type: 'CASH_WITHDRAWAL_MOMO',
      amount: -params.pointsToConvert,
      description: `MoMo Cash Out: GH₵ ${netPayoutGhs.toFixed(2)} to ${params.network} (${params.recipientPhone})`,
      referenceId: newWithdrawal.id,
      createdAt: new Date().toISOString(),
      balanceAfter: newBalance,
    };

    const updatedWithdrawals = [newWithdrawal, ...cashWithdrawals];
    const updatedTransactions = [newTx, ...transactions];

    const updatedUser: UserProfile = {
      ...currentUser,
      ecoPoints: newBalance,
    };

    setCurrentUser(updatedUser);
    setCashWithdrawals(updatedWithdrawals);
    setTransactions(updatedTransactions);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `MoMo Cash Payout Sent: GH₵ ${netPayoutGhs.toFixed(2)} 📲`,
      message: `Credited to ${params.network} number ${params.recipientPhone} (${params.accountHolderName}). Ref: ${txRef}.`,
      type: 'SUCCESS',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    addToast({
      title: `MoMo Dispatched: GH₵ ${netPayoutGhs.toFixed(2)}`,
      message: `Directly transferred via ${params.network} Mobile Money to ${params.recipientPhone}.`,
      type: 'success',
      syncState: 'synced',
      duration: 6000
    });

    triggerCelebration();
    haptics.cashOut();

    saveState({
      currentUser: updatedUser,
      transactions: updatedTransactions,
      cashWithdrawals: updatedWithdrawals,
    });

    // Sync with Cloud Firestore
    firestoreService.saveCashWithdrawal(newWithdrawal);
    firestoreService.saveTransaction(newTx);
    firestoreService.saveUserProfile(updatedUser);

    // Dispatch Transaction Confirmation SMS via httpSMS API (https://httpsms.com)
    if (params.recipientPhone) {
      sendCashOutTransactionSms({
        recipientPhone: params.recipientPhone,
        accountHolderName: params.accountHolderName,
        network: params.network,
        amountGhs: netPayoutGhs,
        pointsConverted: params.pointsToConvert,
        remainingPoints: newBalance,
        txRef
      }).then((res) => {
        refreshSmsLogs();
        if (res.success) {
          addToast({
            title: 'SMS Transaction Alert Dispatched 📲',
            message: `httpSMS confirmation receipt delivered to ${params.recipientPhone}`,
            type: 'info',
            duration: 4500
          });
        }
      }).catch((err) => {
        console.warn('httpSMS transaction dispatch error:', err);
      });
    }

    return {
      success: true,
      message: `Successfully paid out GH₵ ${netPayoutGhs.toFixed(2)} to ${params.recipientPhone} via ${params.network} Mobile Money.`,
      withdrawal: newWithdrawal
    };
  };

  const recordRobotSortingEvent = (event: Omit<RobotSortingEvent, 'id' | 'timestamp'>) => {
    const newEvent: RobotSortingEvent = {
      ...event,
      id: `rob-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString(),
    };

    setRobotEvents(prev => [newEvent, ...prev.slice(0, 19)]);
    firestoreService.saveRobotEvent(newEvent);
  };

  const updateRewardRule = (category: WasteCategory, pointsPerKg: number) => {
    const updatedRules = rewardRules.map(r => {
      if (r.category === category) {
        return { ...r, pointsPerKg };
      }
      return r;
    });
    setRewardRules(updatedRules);
    saveState({ rewardRules: updatedRules });

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Reward Rule Updated ⚙️',
      message: `${category} rate adjusted to ${pointsPerKg} EcoPoints / kg.`,
      type: 'INFO',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addRecyclerOrder = (category: WasteCategory, quantityKg: number, destination: string) => {
    const inv = recyclerInventory.find(i => i.category === category);
    const unitPrice = inv ? inv.pricePerKgGhs : 4.5;
    const totalGhs = +(quantityKg * unitPrice).toFixed(2);

    const newOrder: RecyclerOrder = {
      id: `ord-${Date.now()}`,
      recyclerId: currentUser.id,
      companyName: currentUser.organization || 'Accra Circular Plastics',
      category,
      quantityKg,
      totalGhs,
      status: 'APPROVED',
      destinationFacility: destination,
      createdAt: new Date().toISOString(),
    };

    setRecyclerOrders(prev => [newOrder, ...prev]);
    firestoreService.saveRecyclerOrder(newOrder);

    // Deduct available inventory
    setRecyclerInventory(prev => prev.map(item => {
      if (item.category === category) {
        return { ...item, availableKg: Math.max(0, +(item.availableKg - quantityKg).toFixed(1)) };
      }
      return item;
    }));

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Recycling Bulk Procurement Placed 🏭',
      message: `Batch order for ${quantityKg}kg ${category} (GH₵ ${totalGhs}) dispatched to ${destination}.`,
      type: 'SUCCESS',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    triggerCelebration();
  };

  // --- ADMIN & USER MANAGEMENT CAPABILITIES ---
  const addAdminAuditLog = useCallback((log: Omit<AdminAuditLog, 'id' | 'timestamp' | 'adminId' | 'adminName'>) => {
    const newLog: AdminAuditLog = {
      ...log,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      timestamp: new Date().toISOString()
    };
    setAdminAuditLogs(prev => [newLog, ...prev]);
    firestoreService.saveAuditLog(newLog);
  }, [currentUser.id, currentUser.name]);

  const addUser = useCallback((userData: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    location: string;
    community?: string;
    address?: string;
    organization?: string;
    entityType?: EntityType;
    institutionName?: string;
    memberCount?: number;
    contactPerson?: string;
    leaderboardOptIn?: boolean;
    avatar?: string;
    ghanaCardNumber?: string;
    ghanaTelecomNetwork?: 'MTN' | 'Telecel' | 'AT' | 'Other';
    initialEcoPoints?: number;
    status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  }): UserProfile => {
    const roleTitles: Record<UserRole, string> = {
      USER: 'Citizen EcoSorter',
      COLLECTION_AGENT: 'Certified Fleet Agent',
      RECYCLER: 'Industrial Offtaker',
      ADMIN: 'EPA Municipal Officer',
      COMMUNITY_ADMIN: 'Community Coordinator'
    };

    const assignedEntityType: EntityType = userData.entityType || 'INDIVIDUAL';
    const assignedInstitution = userData.institutionName || userData.organization || (assignedEntityType === 'INDIVIDUAL' ? 'Independent EcoSorter' : userData.name);
    const assignedPoints = typeof userData.initialEcoPoints === 'number' ? userData.initialEcoPoints : 50;

    const defaultAvatar = userData.role === 'ADMIN'
      ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
      : userData.role === 'COLLECTION_AGENT'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      : userData.role === 'RECYCLER'
      ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    const newUser: UserProfile = {
      id: `GH-USER-${Math.floor(1000 + Math.random() * 9000)}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      status: userData.status || 'ACTIVE',
      entityType: assignedEntityType,
      institutionName: assignedInstitution,
      memberCount: userData.memberCount || 1,
      contactPerson: userData.contactPerson || userData.name,
      leaderboardOptIn: userData.leaderboardOptIn !== false,
      avatar: userData.avatar || defaultAvatar,
      organization: assignedInstitution,
      location: userData.location || 'Accra, Ghana',
      community: userData.community || userData.location,
      address: userData.address || '',
      ghanaCardNumber: userData.ghanaCardNumber || '',
      ghanaTelecomNetwork: userData.ghanaTelecomNetwork || 'MTN',
      ecoPoints: assignedPoints,
      totalWasteKg: 0,
      verifiedCollections: 0,
      co2SavedKg: 0,
      rankTitle: roleTitles[userData.role] || 'Novice EcoSorter',
      createdAt: new Date().toISOString(),
    };

    setAllUsers(prev => [newUser, ...prev]);
    firestoreService.saveUserProfile(newUser);

    if (assignedPoints > 0) {
      const grantTx: PointTransaction = {
        id: `tx-admin-grant-${Date.now()}`,
        userId: newUser.id,
        type: 'SIMULATION_GRANT',
        amount: assignedPoints,
        description: `EPA Admin Onboarding Grant: Initial balance provision`,
        createdAt: new Date().toISOString(),
        balanceAfter: assignedPoints
      };
      setTransactions(prev => [grantTx, ...prev]);
      firestoreService.saveTransaction(grantTx);
    }

    if (newUser.leaderboardOptIn) {
      setLeaderboard(prev => [
        ...prev,
        {
          rank: prev.length + 1,
          id: newUser.id,
          name: newUser.name,
          type: assignedEntityType === 'SCHOOL' ? 'SCHOOL' : assignedEntityType === 'COMMUNITY' ? 'COMMUNITY' : assignedEntityType === 'ORGANIZATION' ? 'ORGANIZATION' : 'INDIVIDUAL',
          entityType: assignedEntityType,
          location: newUser.community || newUser.location,
          wasteCollectedKg: 0,
          pointsEarned: assignedPoints,
          participantsCount: newUser.memberCount || 1,
          badge: '🌟 Verified Member',
          avatar: newUser.avatar,
          institutionName: assignedInstitution,
          isCurrentUser: false,
          contactPerson: newUser.contactPerson
        }
      ]);
    }

    addAdminAuditLog({
      action: 'USER_CREATED',
      targetType: 'USER',
      targetId: newUser.id,
      targetName: newUser.name,
      details: `Admin provisioned ${newUser.role} profile for ${newUser.name} (${newUser.email}) with ${assignedPoints} EcoPoints grant.`
    });

    addToast({
      title: 'User Profile Created 👤',
      message: `${newUser.name} successfully registered as ${newUser.role}.`,
      type: 'success',
      syncState: 'synced',
      duration: 4500
    });

    return newUser;
  }, [addAdminAuditLog, addToast]);

  const updateUser = useCallback((userId: string, updates: Partial<UserProfile>) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }

    const target = allUsers.find(u => u.id === userId);
    if (target) {
      const merged = { ...target, ...updates };
      firestoreService.saveUserProfile(merged);
    }

    addAdminAuditLog({
      action: 'USER_UPDATED',
      targetType: 'USER',
      targetId: userId,
      targetName: updates.name || (target ? target.name : userId),
      details: `Admin updated attributes: ${Object.keys(updates).join(', ')}`
    });

    addToast({
      title: 'User Profile Saved 📝',
      message: `Changes saved for ${updates.name || (target ? target.name : 'user')}.`,
      type: 'success',
      duration: 3500
    });
  }, [allUsers, currentUser.id, addAdminAuditLog, addToast]);

  const deleteUser = useCallback((userId: string): boolean => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return false;

    setAllUsers(prev => prev.filter(u => u.id !== userId));
    setLeaderboard(prev => prev.filter(e => e.id !== userId));
    firestoreService.deleteUserProfile(userId);

    // Re-assign or detach jobs assigned to this user if agent
    setCollectionJobs(prev => prev.map(j => {
      if (j.collectorId === userId) {
        return { ...j, status: 'AVAILABLE', collectorId: undefined, collectorName: undefined };
      }
      return j;
    }));

    addAdminAuditLog({
      action: 'USER_DELETED',
      targetType: 'USER',
      targetId: userId,
      targetName: targetUser.name,
      details: `Permanently deleted user account: ${targetUser.name} (${targetUser.email}, ${targetUser.role}).`
    });

    addToast({
      title: 'User Account Deleted 🗑️',
      message: `${targetUser.name} has been removed from the platform registry.`,
      type: 'info',
      duration: 4000
    });

    return true;
  }, [allUsers, addAdminAuditLog, addToast]);

  const adjustUserPoints = useCallback((userId: string, pointsDelta: number, reason: string) => {
    let targetName = userId;
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        targetName = u.name;
        const newBalance = Math.max(0, u.ecoPoints + pointsDelta);
        const updated = { ...u, ecoPoints: newBalance };
        firestoreService.saveUserProfile(updated);
        return updated;
      }
      return u;
    }));

    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ecoPoints: Math.max(0, prev.ecoPoints + pointsDelta) }));
    }

    const tx: PointTransaction = {
      id: `tx-adj-${Date.now()}`,
      userId,
      type: pointsDelta >= 0 ? 'SIMULATION_GRANT' : 'REDEEMED_REWARD',
      amount: pointsDelta,
      description: `Admin Point Adjustment: ${reason}`,
      createdAt: new Date().toISOString(),
      balanceAfter: 0
    };
    setTransactions(prev => [tx, ...prev]);
    firestoreService.saveTransaction(tx);

    addAdminAuditLog({
      action: 'POINTS_ADJUSTED',
      targetType: 'USER',
      targetId: userId,
      targetName,
      details: `${pointsDelta >= 0 ? 'Credited +' : 'Debited '}${pointsDelta} EcoPoints. Reason: ${reason}`
    });

    addToast({
      title: 'EcoPoints Adjusted 🪙',
      message: `${pointsDelta >= 0 ? '+' : ''}${pointsDelta} EcoPoints adjusted for ${targetName}.`,
      type: pointsDelta >= 0 ? 'success' : 'warning',
      duration: 4000
    });
  }, [currentUser.id, addAdminAuditLog, addToast]);

  const toggleUserStatus = useCallback((userId: string, status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION') => {
    const target = allUsers.find(u => u.id === userId);
    if (!target) return;
    const newStatus = status || (target.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    firestoreService.saveUserProfile({ ...target, status: newStatus });

    addAdminAuditLog({
      action: 'USER_STATUS_CHANGED',
      targetType: 'USER',
      targetId: userId,
      targetName: target.name,
      details: `Changed account status from ${target.status || 'ACTIVE'} to ${newStatus}.`
    });

    addToast({
      title: `Account Status: ${newStatus}`,
      message: `${target.name} is now set to ${newStatus}.`,
      type: newStatus === 'ACTIVE' ? 'success' : 'warning'
    });
  }, [allUsers, addAdminAuditLog, addToast]);

  const addReward = useCallback((newReward: Omit<RewardItem, 'id'>): RewardItem => {
    const item: RewardItem = {
      ...newReward,
      id: `rew-${Date.now()}`
    };
    setRewards(prev => [item, ...prev]);
    firestoreService.saveRewardItem(item);

    addAdminAuditLog({
      action: 'REWARD_CREATED',
      targetType: 'REWARD',
      targetId: item.id,
      targetName: item.title,
      details: `Added new reward item "${item.title}" (${item.costPoints} points, GH₵ ${item.valueGhs || item.originalPriceGhs}).`
    });

    addToast({
      title: 'Reward Created 🎁',
      message: `"${item.title}" is now available in the marketplace.`,
      type: 'success'
    });

    return item;
  }, [addAdminAuditLog, addToast]);

  const updateReward = useCallback((rewardId: string, updates: Partial<RewardItem>) => {
    setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, ...updates } : r));
    const target = rewards.find(r => r.id === rewardId);
    if (target) {
      firestoreService.saveRewardItem({ ...target, ...updates });
    }

    addAdminAuditLog({
      action: 'REWARD_UPDATED',
      targetType: 'REWARD',
      targetId: rewardId,
      targetName: updates.title || (target ? target.title : rewardId),
      details: `Admin updated reward attributes: ${Object.keys(updates).join(', ')}`
    });

    addToast({
      title: 'Reward Updated ✏️',
      message: `Reward item updated successfully.`,
      type: 'success'
    });
  }, [rewards, addAdminAuditLog, addToast]);

  const deleteReward = useCallback((rewardId: string): boolean => {
    const target = rewards.find(r => r.id === rewardId);
    if (!target) return false;

    setRewards(prev => prev.filter(r => r.id !== rewardId));
    firestoreService.deleteRewardItem(rewardId);

    addAdminAuditLog({
      action: 'REWARD_DELETED',
      targetType: 'REWARD',
      targetId: rewardId,
      targetName: target.title,
      details: `Removed reward "${target.title}" from catalog.`
    });

    addToast({
      title: 'Reward Removed 🗑️',
      message: `"${target.title}" removed from catalog.`,
      type: 'info'
    });

    return true;
  }, [rewards, addAdminAuditLog, addToast]);

  const assignJobAgent = useCallback((jobId: string, agentId: string, agentName: string) => {
    setCollectionJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        const updatedJob: CollectionJob = {
          ...j,
          collectorId: agentId,
          collectorName: agentName,
          status: 'ASSIGNED'
        };
        firestoreService.saveCollectionJob(updatedJob);
        return updatedJob;
      }
      return j;
    }));

    addAdminAuditLog({
      action: 'JOB_DISPATCHED',
      targetType: 'JOB',
      targetId: jobId,
      targetName: `Job #${jobId}`,
      details: `Admin assigned collection job ${jobId} to agent ${agentName}.`
    });

    addToast({
      title: 'Job Dispatched 🛵',
      message: `Job ${jobId} assigned to ${agentName}.`,
      type: 'success'
    });
  }, [addAdminAuditLog, addToast]);

  const cancelJobAdmin = useCallback((jobId: string, reason: string) => {
    setCollectionJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        const updatedJob: CollectionJob = {
          ...j,
          status: 'CANCELLED'
        };
        firestoreService.saveCollectionJob(updatedJob);
        return updatedJob;
      }
      return j;
    }));

    addAdminAuditLog({
      action: 'JOB_CANCELLED',
      targetType: 'JOB',
      targetId: jobId,
      targetName: `Job #${jobId}`,
      details: `Admin cancelled job ${jobId}. Reason: ${reason}`
    });

    addToast({
      title: 'Job Cancelled 🚫',
      message: `Job ${jobId} cancelled: ${reason}`,
      type: 'warning'
    });
  }, [addAdminAuditLog, addToast]);

  const forceVerifyJobAdmin = useCallback((jobId: string, actualWeightKg: number, notes?: string) => {
    const job = collectionJobs.find(j => j.id === jobId);
    if (!job) return;

    verifyAndCollectJob(jobId, actualWeightKg, notes || 'Direct administrative scale verification');

    addAdminAuditLog({
      action: 'JOB_VERIFIED',
      targetType: 'JOB',
      targetId: jobId,
      targetName: `Job #${jobId}`,
      details: `Admin direct override verification (${actualWeightKg} kg). Notes: ${notes || 'Admin override'}`
    });
  }, [collectionJobs, verifyAndCollectJob, addAdminAuditLog]);

  const createChallenge = useCallback((newChallenge: Omit<Challenge, 'id'>): Challenge => {
    const ch: Challenge = {
      ...newChallenge,
      id: `chal-${Date.now()}`
    };
    setChallenge(ch);

    addAdminAuditLog({
      action: 'CHALLENGE_CREATED',
      targetType: 'CHALLENGE',
      targetId: ch.id,
      targetName: ch.title,
      details: `Created new national sustainability campaign: "${ch.title}" with target ${ch.goalKg}kg and GH₵ ${ch.prizePoolGhs} prize pool.`
    });

    addToast({
      title: 'Campaign Launched 🏆',
      message: `"${ch.title}" is now active nationwide!`,
      type: 'success'
    });

    return ch;
  }, [addAdminAuditLog, addToast]);

  const updateChallenge = useCallback((challengeId: string, updates: Partial<Challenge>) => {
    setChallenge(prev => ({ ...prev, ...updates }));

    addAdminAuditLog({
      action: 'CHALLENGE_CREATED',
      targetType: 'CHALLENGE',
      targetId: challengeId,
      targetName: updates.title || challenge.title,
      details: `Updated campaign parameters for "${updates.title || challenge.title}".`
    });

    addToast({
      title: 'Campaign Updated 🎯',
      message: 'Challenge settings and targets updated.',
      type: 'success'
    });
  }, [challenge.title, addAdminAuditLog, addToast]);

  const triggerSimulatedPush = useCallback((scenarioOrAlert?: SimulatedPushAlert | string) => {
    let alertToFire: SimulatedPushAlert;

    if (typeof scenarioOrAlert === 'string') {
      const found = PUSH_NOTIFICATION_SCENARIOS.find(s => s.id === scenarioOrAlert);
      alertToFire = found ? { ...found, id: `push-${Date.now()}`, timestamp: 'Just now', timestampMs: Date.now() } : PUSH_NOTIFICATION_SCENARIOS[0];
    } else if (scenarioOrAlert) {
      alertToFire = { ...scenarioOrAlert, timestamp: 'Just now', timestampMs: Date.now() };
    } else {
      // Pick random scenario from predefined list
      const randomIdx = Math.floor(Math.random() * PUSH_NOTIFICATION_SCENARIOS.length);
      const template = PUSH_NOTIFICATION_SCENARIOS[randomIdx];
      alertToFire = { ...template, id: `push-auto-${Date.now()}`, timestamp: 'Just now', timestampMs: Date.now() };
    }

    // Play sound if enabled
    if (pushSettings.soundEnabled) {
      if (alertToFire.category === 'COMPETITION_MILESTONE') {
        soundEffects.playMilestoneFanfare();
      } else {
        soundEffects.playPushChime();
      }
    }

    // Show top floating banner
    setActivePushBanner(alertToFire);

    // Record into push history
    setPushAlerts(prev => [alertToFire, ...prev.filter(p => p.id !== alertToFire.id)].slice(0, 40));

    // Also record into app notification feed
    setNotifications(prev => [
      {
        id: `notif-push-${Date.now()}`,
        title: alertToFire.title,
        message: alertToFire.body,
        type: alertToFire.category === 'COMPETITION_MILESTONE' ? 'POINTS' : alertToFire.category === 'HUB_SURGE' ? 'WARNING' : 'INFO',
        timestamp: 'Just now',
        read: false
      },
      ...prev
    ]);

    // If native browser push enabled, fire OS notification
    if (pushSettings.nativeBrowserPush && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(alertToFire.title, {
          body: alertToFire.body,
          icon: '/favicon.ico'
        });
      } catch {
        // ignore
      }
    }
  }, [pushSettings]);

  const claimPushReward = useCallback((alertId: string, bonusPointsAmount: number) => {
    setCurrentUser(prev => ({
      ...prev,
      ecoPoints: prev.ecoPoints + bonusPointsAmount
    }));

    setTransactions(prev => [
      {
        id: `tx-push-${Date.now()}`,
        userId: currentUser.id,
        amount: bonusPointsAmount,
        type: 'EARNED',
        source: 'PROMOTION',
        description: 'Push Alert Milestone Bonus Claimed',
        timestamp: new Date().toLocaleString()
      },
      ...prev
    ]);

    setPushAlerts(prev => prev.map(a => a.id === alertId ? { ...a, claimed: true } : a));

    addToast({
      title: `🎉 +${bonusPointsAmount} EcoPoints Awarded!`,
      message: 'Milestone bonus reward successfully added to your balance.',
      type: 'points'
    });
  }, [currentUser.id]);

  // Periodic Auto-Simulation Interval Engine
  useEffect(() => {
    if (!pushSettings.enabled || pushSettings.autoIntervalSeconds <= 0) return;

    const timer = setInterval(() => {
      // Trigger if there's no active banner currently being displayed
      setActivePushBanner(current => {
        if (!current) {
          // Trigger a random scenario
          const randomIdx = Math.floor(Math.random() * PUSH_NOTIFICATION_SCENARIOS.length);
          const template = PUSH_NOTIFICATION_SCENARIOS[randomIdx];
          const newAlert: SimulatedPushAlert = {
            ...template,
            id: `push-auto-${Date.now()}`,
            timestamp: 'Just now',
            timestampMs: Date.now()
          };

          if (pushSettings.soundEnabled) {
            if (newAlert.category === 'COMPETITION_MILESTONE') {
              soundEffects.playMilestoneFanfare();
            } else {
              soundEffects.playPushChime();
            }
          }

          setPushAlerts(prev => [newAlert, ...prev.filter(p => p.id !== newAlert.id)].slice(0, 40));
          
          setNotifications(prev => [
            {
              id: `notif-push-${Date.now()}`,
              title: newAlert.title,
              message: newAlert.body,
              type: newAlert.category === 'COMPETITION_MILESTONE' ? 'POINTS' : 'INFO',
              timestamp: 'Just now',
              read: false
            },
            ...prev
          ]);

          return newAlert;
        }
        return current;
      });
    }, pushSettings.autoIntervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [pushSettings.enabled, pushSettings.autoIntervalSeconds, pushSettings.soundEnabled]);

  // Community & Eco-Trade Handlers
  const addSwapItem = useCallback((itemData: Omit<CommunitySwapItem, 'id' | 'createdAt' | 'likesCount' | 'viewCount'>): CommunitySwapItem => {
    const newItem: CommunitySwapItem = {
      ...itemData,
      id: `swap-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      viewCount: 1,
      isLiked: false
    };

    setSwapItems(prev => [newItem, ...prev]);

    // Award user 10 EcoPoints bonus for listing a circular item
    setCurrentUser(prev => ({
      ...prev,
      ecoPoints: prev.ecoPoints + 10
    }));

    addToast({
      title: 'Item Listed on Swap Spot! 🔄',
      message: `"${newItem.title}" is now visible to the local community. +10 EcoPoints bonus earned!`,
      type: 'points',
      duration: 4500
    });

    triggerCelebration();
    return newItem;
  }, [addToast, triggerCelebration]);

  const toggleLikeSwapItem = useCallback((itemId: string) => {
    setSwapItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const currentlyLiked = !!item.isLiked;
        return {
          ...item,
          isLiked: !currentlyLiked,
          likesCount: currentlyLiked ? Math.max(0, item.likesCount - 1) : item.likesCount + 1
        };
      }
      return item;
    }));
  }, []);

  const proposeSwapTrade = useCallback((tradeData: Omit<SwapTradeRequest, 'id' | 'createdAt' | 'status'>): SwapTradeRequest => {
    const newRequest: SwapTradeRequest = {
      ...tradeData,
      id: `req-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    setSwapTradeRequests(prev => [newRequest, ...prev]);

    addToast({
      title: 'Trade Request Sent! 🤝',
      message: `Your trade proposal for "${tradeData.itemTitle}" was sent to ${tradeData.sellerName}.`,
      type: 'success',
      duration: 4000
    });

    triggerCelebration();
    return newRequest;
  }, [addToast, triggerCelebration]);

  const joinCommunityEvent = useCallback((eventId: string, volunteerRole: string = 'General Volunteer') => {
    setCommunityEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const alreadyJoined = !!ev.isJoined;
        if (!alreadyJoined) {
          addToast({
            title: 'RSVP Confirmed! 🎉',
            message: `You are registered as "${volunteerRole}" for "${ev.title}". Earn +${ev.ecoPointsReward} EcoPoints on check-in!`,
            type: 'points',
            duration: 5000
          });
          triggerCelebration();
          soundEffects.playRewardChime();
          return {
            ...ev,
            isJoined: true,
            selectedRole: volunteerRole,
            registeredVolunteersCount: ev.registeredVolunteersCount + 1
          };
        } else {
          addToast({
            title: 'RSVP Cancelled',
            message: `You have unregistered from "${ev.title}".`,
            type: 'info',
            duration: 3000
          });
          return {
            ...ev,
            isJoined: false,
            selectedRole: undefined,
            registeredVolunteersCount: Math.max(0, ev.registeredVolunteersCount - 1)
          };
        }
      }
      return ev;
    }));
  }, [addToast, triggerCelebration]);

  const createCommunityEvent = useCallback((eventData: Omit<CommunityEvent, 'id' | 'registeredVolunteersCount' | 'currentProgressKg'>): CommunityEvent => {
    const newEvent: CommunityEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      registeredVolunteersCount: 1,
      currentProgressKg: 0,
      isJoined: true,
      selectedRole: 'Lead Organizer'
    };

    setCommunityEvents(prev => [newEvent, ...prev]);

    addToast({
      title: 'Community Drive Scheduled! 🧹',
      message: `"${newEvent.title}" is now open for volunteers. EPA Ghana & community notified.`,
      type: 'success',
      duration: 5000
    });

    triggerCelebration();
    return newEvent;
  }, [addToast, triggerCelebration]);

  const addForumPost = useCallback((postData: Omit<CommunityForumPost, 'id' | 'createdAt' | 'upvotes' | 'commentsCount' | 'comments'>): CommunityForumPost => {
    const newPost: CommunityForumPost = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      upvotes: 1,
      hasUpvoted: true,
      commentsCount: 0,
      comments: []
    };

    setForumPosts(prev => [newPost, ...prev]);

    setCurrentUser(prev => ({
      ...prev,
      ecoPoints: prev.ecoPoints + 5
    }));

    addToast({
      title: 'Discussion Published! 💬',
      message: `Your thread "${newPost.title.slice(0, 35)}..." is live. +5 EcoPoints awarded!`,
      type: 'points',
      duration: 4000
    });

    return newPost;
  }, [addToast]);

  const toggleUpvoteForumPost = useCallback((postId: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const currentlyUpvoted = !!post.hasUpvoted;
        return {
          ...post,
          hasUpvoted: !currentlyUpvoted,
          upvotes: currentlyUpvoted ? Math.max(0, post.upvotes - 1) : post.upvotes + 1
        };
      }
      return post;
    }));
  }, []);

  const reactToForumPost = useCallback((postId: string, emoji: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      const userReactions = post.userReactions || [];
      const hasReacted = userReactions.includes(emoji);
      const reactions = { ...(post.reactions || {}) };

      if (hasReacted) {
        reactions[emoji] = Math.max(0, (reactions[emoji] || 1) - 1);
        if (reactions[emoji] === 0) delete reactions[emoji];
        return {
          ...post,
          userReactions: userReactions.filter(e => e !== emoji),
          reactions
        };
      } else {
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        soundEffects.playRewardChime();
        return {
          ...post,
          userReactions: [...userReactions, emoji],
          reactions
        };
      }
    }));
  }, []);

  const toggleBookmarkForumPost = useCallback((postId: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const nextState = !post.isBookmarked;
        addToast({
          title: nextState ? 'Discussion Saved 🔖' : 'Bookmark Removed',
          message: nextState ? 'Post saved to your bookmarked discussions.' : 'Removed from saved discussions.',
          type: 'info',
          duration: 2500
        });
        return {
          ...post,
          isBookmarked: nextState
        };
      }
      return post;
    }));
  }, [addToast]);

  const addForumComment = useCallback((postId: string, commentText: string, parentId?: string) => {
    if (!commentText.trim()) return;

    const roleBadgeMap: Record<string, string> = {
      ADMIN: 'EPA Officer 🛡️',
      COLLECTION_AGENT: 'Verified Route Agent 🚚',
      RECYCLER: 'Industrial Recycler 🏭',
      COMMUNITY_LEADER: 'Chapter Leader 🌟',
      USER: 'Eco Citizen 🌿'
    };

    const newComment: ForumComment = {
      id: `comm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      authorRole: currentUser.role,
      authorBadge: roleBadgeMap[currentUser.role] || 'Community Member',
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
      upvotes: 1,
      hasUpvoted: true,
      reactions: { '🌱': 1 },
      userReactions: ['🌱'],
      parentId: parentId || undefined
    };

    setForumPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      
      if (!parentId) {
        return {
          ...post,
          commentsCount: (post.commentsCount || 0) + 1,
          comments: [...(post.comments || []), newComment]
        };
      } else {
        const updatedComments = (post.comments || []).map(comm => {
          if (comm.id === parentId) {
            return {
              ...comm,
              replies: [...(comm.replies || []), newComment]
            };
          }
          return comm;
        });
        return {
          ...post,
          commentsCount: (post.commentsCount || 0) + 1,
          comments: updatedComments
        };
      }
    }));

    setCurrentUser(prev => ({
      ...prev,
      ecoPoints: prev.ecoPoints + 2
    }));

    soundEffects.playRewardChime();

    addToast({
      title: 'Reply Posted! 💬 (+2 EcoPoints)',
      message: 'Your insight was added to the discussion thread.',
      type: 'points',
      duration: 3500
    });
  }, [currentUser, addToast]);

  const reactToForumComment = useCallback((postId: string, commentId: string, emoji: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;

      const updateCommentReaction = (comm: ForumComment): ForumComment => {
        if (comm.id === commentId) {
          const userReactions = comm.userReactions || [];
          const hasReacted = userReactions.includes(emoji);
          const reactions = { ...(comm.reactions || {}) };

          if (hasReacted) {
            reactions[emoji] = Math.max(0, (reactions[emoji] || 1) - 1);
            if (reactions[emoji] === 0) delete reactions[emoji];
            return {
              ...comm,
              userReactions: userReactions.filter(e => e !== emoji),
              reactions
            };
          } else {
            reactions[emoji] = (reactions[emoji] || 0) + 1;
            soundEffects.playRewardChime();
            return {
              ...comm,
              userReactions: [...userReactions, emoji],
              reactions
            };
          }
        }

        if (comm.replies && comm.replies.length > 0) {
          return {
            ...comm,
            replies: comm.replies.map(updateCommentReaction)
          };
        }

        return comm;
      };

      return {
        ...post,
        comments: (post.comments || []).map(updateCommentReaction)
      };
    }));
  }, []);

  const toggleUpvoteForumComment = useCallback((postId: string, commentId: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;

      const updateCommentUpvote = (comm: ForumComment): ForumComment => {
        if (comm.id === commentId) {
          const isUpvoted = !!comm.hasUpvoted;
          return {
            ...comm,
            hasUpvoted: !isUpvoted,
            upvotes: isUpvoted ? Math.max(0, comm.upvotes - 1) : comm.upvotes + 1
          };
        }
        if (comm.replies && comm.replies.length > 0) {
          return {
            ...comm,
            replies: comm.replies.map(updateCommentUpvote)
          };
        }
        return comm;
      };

      return {
        ...post,
        comments: (post.comments || []).map(updateCommentUpvote)
      };
    }));
  }, []);

  const toggleVerifyCommentSolution = useCallback((postId: string, commentId: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;

      const updateCommentVerified = (comm: ForumComment): ForumComment => {
        if (comm.id === commentId) {
          const newState = !comm.isVerifiedSolution;
          return {
            ...comm,
            isVerifiedSolution: newState
          };
        }
        if (comm.replies && comm.replies.length > 0) {
          return {
            ...comm,
            replies: comm.replies.map(updateCommentVerified)
          };
        }
        return comm;
      };

      return {
        ...post,
        comments: (post.comments || []).map(updateCommentVerified)
      };
    }));

    addToast({
      title: 'Verified Solution Updated 🏆',
      message: 'Comment verification badge toggled.',
      type: 'success',
      duration: 3000
    });
  }, [addToast]);

  const deleteForumComment = useCallback((postId: string, commentId: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;

      const filterComment = (comments: ForumComment[]): ForumComment[] => {
        return comments
          .filter(c => c.id !== commentId)
          .map(c => ({
            ...c,
            replies: c.replies ? filterComment(c.replies) : []
          }));
      };

      const newComments = filterComment(post.comments || []);
      return {
        ...post,
        commentsCount: Math.max(0, post.commentsCount - 1),
        comments: newComments
      };
    }));

    addToast({
      title: 'Comment Removed 🗑️',
      message: 'The comment has been removed from this discussion.',
      type: 'info',
      duration: 2500
    });
  }, [addToast]);

  const cheerAmbassador = useCallback((ambassadorId: string) => {
    setAmbassadors(prev => prev.map(amb => {
      if (amb.id === ambassadorId) {
        const alreadyCheered = !!amb.hasCheered;
        if (!alreadyCheered) {
          soundEffects.playLevelUp();
          triggerCelebration();
          addToast({
            title: `Kudos Sent to ${amb.name}! 🌟`,
            message: `You celebrated ${amb.name}'s green leadership in ${amb.location}!`,
            type: 'points',
            duration: 3500
          });
          return {
            ...amb,
            kudosCount: amb.kudosCount + 1,
            hasCheered: true
          };
        } else {
          return {
            ...amb,
            kudosCount: Math.max(0, amb.kudosCount - 1),
            hasCheered: false
          };
        }
      }
      return amb;
    }));
  }, [addToast, triggerCelebration]);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Smart Dust Bin & LED Indicator Handlers
  const updateSmartBinLed = useCallback((binId: string, ledConfig: Partial<SmartBinLedIndicator>) => {
    setSmartBins(prev => {
      const updated = prev.map(bin => {
        if (bin.id === binId) {
          const newLed: SmartBinLedIndicator = {
            ...bin.ledIndicator,
            ...ledConfig
          };
          return {
            ...bin,
            ledIndicator: newLed,
            lastSyncTimestamp: new Date().toISOString()
          };
        }
        return bin;
      });
      try {
        localStorage.setItem('ecosort_smart_bins_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const depositToSmartBin = useCallback(async (binId: string, depositData: {
    itemName: string;
    category: WasteCategory;
    material: string;
    weightKg: number;
    imageUrl?: string;
    chamberId?: string;
  }) => {
    const targetBin = smartBins.find(b => b.id === binId);
    if (!targetBin) return { success: false, pointsAwarded: 0, message: 'Smart Bin not found' };

    // Check if contaminant or non-recyclable
    const isContaminant = (depositData.category as any) === 'HAZARDOUS' || depositData.category === 'ORGANIC';
    
    if (isContaminant) {
      // Trigger Red Strobe alert LED
      const rejectedLed: SmartBinLedIndicator = {
        mode: 'CONTAMINANT_ALERT',
        colorHex: '#EF4444',
        colorName: 'RED',
        pattern: 'RAPID_BLINK',
        brightness: 100,
        statusMessage: '🔴 REJECTED: Hazardous / Contaminant Detected!',
        ledRingHex: Array(12).fill('#EF4444'),
        autoRulesEnabled: true
      };

      setSmartBins(prev => {
        const nextBins = prev.map(b => b.id === binId ? {
          ...b,
          ledIndicator: rejectedLed
        } : b);
        try {
          localStorage.setItem('ecosort_smart_bins_v1', JSON.stringify(nextBins));
        } catch {}
        return nextBins;
      });

      addToast({
        title: 'Waste Item Rejected ⚠️',
        message: 'Non-recyclable or hazardous material detected by Smart Bin optical sensor. LED flashing RED.',
        type: 'error',
        duration: 5000
      });

      return { success: false, pointsAwarded: 0, newLedState: rejectedLed, message: 'Contaminant rejected' };
    }

    // Standard accepted recyclable
    const rate = rewardRules.find(r => r.category === depositData.category)?.pointsPerKg || 10;
    const basePts = Math.round(depositData.weightKg * rate);
    const pointsAwarded = Math.max(1, basePts);

    const newWeight = Number((targetBin.totalWeightKg + depositData.weightKg).toFixed(2));
    const newFill = Math.min(100, Math.round((newWeight / targetBin.maxCapacityKg) * 100));

    // LED State depending on capacity
    const isNowFull = newFill >= 90;
    const isNearFull = newFill >= 75;

    const newLed: SmartBinLedIndicator = isNowFull ? {
      mode: 'BIN_FULL',
      colorHex: '#EF4444',
      colorName: 'RED',
      pattern: 'RAPID_BLINK',
      brightness: 100,
      statusMessage: `🔴 FULL (${newFill}%): Capacity reached. Collection job dispatched.`,
      ledRingHex: Array(12).fill('#EF4444'),
      autoRulesEnabled: true
    } : isNearFull ? {
      mode: 'NEAR_CAPACITY',
      colorHex: '#F59E0B',
      colorName: 'AMBER',
      pattern: 'PULSE',
      brightness: 90,
      statusMessage: `🟡 CAPACITY WARNING (${newFill}%): High volume recorded.`,
      ledRingHex: Array(12).fill('#F59E0B'),
      autoRulesEnabled: true
    } : {
      mode: 'ITEM_ACCEPTED',
      colorHex: '#10B981',
      colorName: 'GREEN',
      pattern: 'BREATHING',
      brightness: 95,
      statusMessage: `🟢 ACCEPTED: +${pointsAwarded} EcoPoints Credited to ${currentUser.name}!`,
      ledRingHex: Array(12).fill('#10B981'),
      autoRulesEnabled: true
    };

    const newDepositRecord = {
      id: `dep-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      userId: currentUser.id,
      userName: currentUser.name,
      itemName: depositData.itemName,
      category: depositData.category,
      material: depositData.material,
      weightKg: depositData.weightKg,
      pointsAwarded,
      chamberId: depositData.chamberId || 'ch-default',
      ledColorTriggered: newLed.colorName
    };

    // Update Chambers
    const updatedChambers = targetBin.chambers.map(ch => {
      if (ch.id === depositData.chamberId || ch.category === depositData.category) {
        const chWeight = Number((ch.currentWeightKg + depositData.weightKg).toFixed(2));
        const chFill = Math.min(100, Math.round((chWeight / ch.capacityKg) * 100));
        return {
          ...ch,
          currentWeightKg: chWeight,
          fillLevel: chFill,
          lidServoAngle: 90
        };
      }
      return ch;
    });

    const updatedBin: SmartDustBin = {
      ...targetBin,
      totalWeightKg: newWeight,
      overallFillLevel: newFill,
      ledIndicator: newLed,
      chambers: updatedChambers,
      recentDeposits: [newDepositRecord, ...targetBin.recentDeposits.slice(0, 19)],
      totalDeposits: targetBin.totalDeposits + 1,
      totalPointsRewarded: targetBin.totalPointsRewarded + pointsAwarded,
      lastSyncTimestamp: new Date().toISOString()
    };

    setSmartBins(prev => {
      const nextBins = prev.map(b => b.id === binId ? updatedBin : b);
      try {
        localStorage.setItem('ecosort_smart_bins_v1', JSON.stringify(nextBins));
      } catch {}
      return nextBins;
    });

    // Credit User Account
    const newTx: PointTransaction = {
      id: `tx-bin-${Date.now()}`,
      userId: currentUser.id,
      amount: pointsAwarded,
      type: 'EARNED_WASTE',
      description: `Smart Dust Bin (${targetBin.name}) - ${depositData.itemName}`,
      createdAt: 'Just now',
      balanceAfter: currentUser.ecoPoints + pointsAwarded
    };

    const updatedUser: UserProfile = {
      ...currentUser,
      ecoPoints: currentUser.ecoPoints + pointsAwarded,
      totalWasteKg: Number((currentUser.totalWasteKg + depositData.weightKg).toFixed(2)),
      completedSubmissionsCount: (currentUser.completedSubmissionsCount || 0) + 1
    };

    setCurrentUser(updatedUser);
    setTransactions(prev => [newTx, ...prev]);

    // Dispatch Deposit Receipt SMS via httpSMS API (https://httpsms.com)
    if (currentUser.phone) {
      sendSmartBinDepositSms({
        phone: currentUser.phone,
        userName: currentUser.name,
        binName: targetBin.name,
        category: depositData.category,
        weightKg: depositData.weightKg,
        pointsAwarded,
        remainingPoints: updatedUser.ecoPoints
      }).then(() => refreshSmsLogs()).catch(() => {});
    }

    addToast({
      title: `Smart Bin Deposit Verified! 🟢 +${pointsAwarded} EcoPoints`,
      message: `${depositData.itemName} deposited at ${targetBin.name}. LED Ring confirmed green.`,
      type: 'points',
      duration: 4500
    });

    // If full, auto-dispatch collection job to local fleet
    if (isNowFull && !targetBin.collectionDispatched) {
      const newJob: CollectionJob = {
        id: `JOB-BIN-${Date.now()}`,
        submissionId: `SMART-BIN-${targetBin.id}`,
        userId: 'iot-smart-bin',
        userName: `Smart IoT Bin: ${targetBin.name}`,
        userPhone: '+233 24 000 9999',
        wasteCategory: depositData.category,
        material: (depositData.material as any) || 'Other Mixed',
        estimatedWeightKg: targetBin.totalWeightKg,
        location: targetBin.location,
        community: targetBin.district || 'Greater Accra',
        distanceKm: 1.2,
        status: 'REQUESTED',
        photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80',
        scheduledTime: 'Immediate IoT Dispatch',
        notes: `Automatic IoT dispatch triggered: Smart Bin ${targetBin.name} reached ${newFill}% capacity.`,
        createdAt: 'Just now'
      };

      setCollectionJobs(prev => [newJob, ...prev]);

      addToast({
        title: 'Collection Fleet Dispatched 🚛',
        message: `${targetBin.name} reached ${newFill}% capacity. Priority collection job created.`,
        type: 'warning',
        duration: 5000
      });

      // Trigger admin push notification alert if 90% capacity alerts enabled
      if (pushSettings.adminBinCapacityAlerts !== false) {
        triggerSimulatedPush({
          id: `push-bin-${Date.now()}`,
          category: 'BIN_CAPACITY_ALERT',
          title: `🚨 Bin Capacity Alert: ${targetBin.name} is ${newFill}% Full!`,
          body: `Smart Dust Bin at ${targetBin.location} (${targetBin.district}) has reached critical threshold (${newFill}%). Red LED flashing; collection job dispatched.`,
          timestamp: 'Just now',
          timestampMs: Date.now(),
          actionLabel: 'Inspect Smart Bins',
          actionTargetView: 'admin',
          iconType: 'surge'
        });
      }
    }

    return { success: true, pointsAwarded, newLedState: newLed, message: 'Deposit successful' };
  }, [smartBins, currentUser, rewardRules, pushSettings, triggerSimulatedPush, addToast]);

  const registerNewSmartBin = useCallback((binData: Partial<SmartDustBin>): SmartDustBin => {
    const newBin: SmartDustBin = {
      id: binData.id || `ECO-BIN-${Date.now()}`,
      name: binData.name || 'Accra Smart Bin',
      model: binData.model || 'EcoSort IoT ESP32 Grid V3',
      location: binData.location || 'Accra, Ghana',
      district: binData.district || 'Greater Accra',
      coordinates: binData.coordinates || { lat: 5.6037, lng: -0.1870 },
      status: 'ONLINE',
      overallFillLevel: 0,
      totalWeightKg: 0,
      maxCapacityKg: binData.maxCapacityKg || 50,
      batteryLevel: 100,
      isSolarPowered: true,
      isSolarCharging: true,
      solarWattsGenerated: 14.5,
      signalRssi: -55,
      wifiSsid: binData.wifiSsid || 'EcoSort-Mesh',
      ipAddress: binData.ipAddress || '192.168.1.100',
      apiKey: binData.apiKey || `es_key_${Date.now()}`,
      firmwareVersion: 'v3.4.2-ESP32-S3',
      hardwareMcu: binData.hardwareMcu || 'ESP32-S3',
      ultrasonicDistanceCm: 50,
      temperatureCelsius: 28,
      ledIndicator: binData.ledIndicator || {
        mode: 'IDLE_READY',
        colorHex: '#10B981',
        colorName: 'GREEN',
        pattern: 'BREATHING',
        brightness: 85,
        statusMessage: '🟢 READY: Smart Bin Online & Active',
        ledRingHex: Array(12).fill('#10B981'),
        autoRulesEnabled: true
      },
      chambers: binData.chambers || [],
      recentDeposits: [],
      totalDeposits: 0,
      totalPointsRewarded: 0,
      lastSyncTimestamp: new Date().toISOString(),
      collectionDispatched: false
    };

    setSmartBins(prev => {
      const updated = [newBin, ...prev];
      try {
        localStorage.setItem('ecosort_smart_bins_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setSelectedSmartBin(newBin);

    addToast({
      title: 'Smart Dust Bin Provisioned! ⚡',
      message: `${newBin.name} paired successfully with LED indicators.`,
      type: 'success'
    });

    return newBin;
  }, [addToast]);

  const triggerSmartBinEmptying = useCallback((binId: string) => {
    setSmartBins(prev => {
      const updated = prev.map(bin => {
        if (bin.id === binId) {
          const resetChambers = bin.chambers.map(ch => ({
            ...ch,
            currentWeightKg: 0,
            fillLevel: 0,
            lidServoAngle: 0
          }));

          const readyLed: SmartBinLedIndicator = {
            mode: 'IDLE_READY',
            colorHex: '#10B981',
            colorName: 'GREEN',
            pattern: 'BREATHING',
            brightness: 85,
            statusMessage: '🟢 READY: Emptied by Collector. Ready for Deposits.',
            ledRingHex: Array(12).fill('#10B981'),
            autoRulesEnabled: true
          };

          return {
            ...bin,
            overallFillLevel: 0,
            totalWeightKg: 0,
            chambers: resetChambers,
            ledIndicator: readyLed,
            collectionDispatched: false,
            lastSyncTimestamp: new Date().toISOString()
          };
        }
        return bin;
      });

      try {
        localStorage.setItem('ecosort_smart_bins_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    addToast({
      title: 'Smart Bin Emptied! 🧹',
      message: 'Bin capacity reset to 0%. LED returned to Green (Ready).',
      type: 'info'
    });
  }, [addToast]);

  const addBinMaintenanceLog = useCallback((logData: Omit<SmartBinMaintenanceLog, 'id' | 'timestampMs'>) => {
    const newLog: SmartBinMaintenanceLog = {
      ...logData,
      id: `maint-log-${Date.now()}`,
      timestampMs: Date.now()
    };
    setMaintenanceLogs(prev => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem('ecosort_maintenance_logs_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const markBinStatusWithLog = useCallback((params: {
    binId: string;
    action: SmartBinMaintenanceAction;
    issueDescription?: string;
    resolutionNotes?: string;
    technicianName?: string;
    componentsServiced?: string[];
    costGhs?: number;
    customTimestamp?: string;
    resetCapacityIfServiced?: boolean;
  }) => {
    const targetBin = smartBins.find(b => b.id === params.binId);
    if (!targetBin) {
      addToast({
        title: 'Smart Bin Not Found',
        message: `Could not locate Smart Bin with ID: ${params.binId}`,
        type: 'error'
      });
      return;
    }

    const prevStatus = targetBin.status;
    let newStatus: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'FULL' | 'LID_JAMMED' = targetBin.status;
    let newLed: SmartBinLedIndicator = { ...targetBin.ledIndicator };

    const timeStr = params.customTimestamp || new Date().toLocaleString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const nowMs = Date.now();

    let updatedChambers = [...targetBin.chambers];
    let newFill = targetBin.overallFillLevel;
    let newWeight = targetBin.totalWeightKg;

    if (params.action === 'UNDER_REPAIR') {
      newStatus = 'MAINTENANCE';
      newLed = {
        ...targetBin.ledIndicator,
        mode: 'MANUAL_TEST',
        colorHex: '#F59E0B',
        colorName: 'AMBER',
        pattern: 'RAPID_BLINK',
        brightness: 90,
        statusMessage: `🟡 UNDER REPAIR: ${params.issueDescription || 'Hardware / Sensor Maintenance Active'}`,
        ledRingHex: Array(12).fill('#F59E0B'),
        autoRulesEnabled: false
      };
    } else if (params.action === 'SERVICED') {
      newStatus = 'ONLINE';
      if (params.resetCapacityIfServiced !== false) {
        newFill = 0;
        newWeight = 0;
        updatedChambers = targetBin.chambers.map(ch => ({
          ...ch,
          currentWeightKg: 0,
          fillLevel: 0,
          lidServoAngle: 0,
          sensorStatus: 'OK'
        }));
      }
      newLed = {
        ...targetBin.ledIndicator,
        mode: 'IDLE_READY',
        colorHex: '#10B981',
        colorName: 'GREEN',
        pattern: 'BREATHING',
        brightness: 85,
        statusMessage: '🟢 READY: Serviced & Certified. Online for Deposits.',
        ledRingHex: Array(12).fill('#10B981'),
        autoRulesEnabled: true
      };
    } else if (params.action === 'INSPECTION' || params.action === 'SENSOR_CALIBRATION') {
      if (prevStatus === 'MAINTENANCE' || prevStatus === 'OFFLINE') {
        newStatus = 'ONLINE';
        newLed = {
          ...targetBin.ledIndicator,
          mode: 'IDLE_READY',
          colorHex: '#10B981',
          colorName: 'GREEN',
          pattern: 'BREATHING',
          statusMessage: '🟢 READY: Inspection & Calibration Passed.',
          autoRulesEnabled: true
        };
      }
    }

    const updatedBin: SmartDustBin = {
      ...targetBin,
      status: newStatus,
      overallFillLevel: newFill,
      totalWeightKg: newWeight,
      chambers: updatedChambers,
      ledIndicator: newLed,
      collectionDispatched: params.action === 'SERVICED' ? false : targetBin.collectionDispatched,
      lastSyncTimestamp: new Date().toISOString()
    };

    setSmartBins(prev => {
      const updated = prev.map(b => b.id === params.binId ? updatedBin : b);
      try {
        localStorage.setItem('ecosort_smart_bins_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    const newLog: SmartBinMaintenanceLog = {
      id: `maint-log-${Date.now()}`,
      binId: targetBin.id,
      binName: targetBin.name,
      binLocation: targetBin.location,
      action: params.action,
      previousStatus: prevStatus,
      newStatus,
      timestamp: timeStr,
      timestampMs: nowMs,
      performedBy: currentUser.name || 'Admin',
      technicianName: params.technicianName || currentUser.name || 'EPA Field Engineering',
      issueDescription: params.issueDescription || (params.action === 'UNDER_REPAIR' ? 'Flagged for urgent component repair' : 'Routine servicing & recalibration'),
      resolutionNotes: params.resolutionNotes || (params.action === 'SERVICED' ? 'All sensors calibrated, chambers sanitized, certified operational.' : 'Maintenance ongoing.'),
      componentsServiced: params.componentsServiced && params.componentsServiced.length > 0 ? params.componentsServiced : ['Ultrasonic Sensor', 'Servo Lid Motor'],
      costGhs: params.costGhs ?? 0,
      severity: params.action === 'UNDER_REPAIR' ? 'HIGH' : 'LOW'
    };

    setMaintenanceLogs(prev => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem('ecosort_maintenance_logs_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Admin Audit Log entry
    addAdminAuditLog(
      'SYSTEM',
      params.action === 'UNDER_REPAIR' ? 'USER_STATUS_CHANGED' : 'STATE_RESET',
      `Smart Bin ${targetBin.name} marked as ${params.action === 'UNDER_REPAIR' ? 'UNDER REPAIR (Maintenance)' : 'SERVICED (Online)'} by ${currentUser.name} at ${timeStr}. Notes: ${newLog.issueDescription}`,
      targetBin.id,
      targetBin.name
    );

    soundEffects.play('pop');
    if (params.action === 'SERVICED') {
      soundEffects.playMilestoneFanfare();
      triggerCelebration();
    }

    addToast({
      title: params.action === 'UNDER_REPAIR' 
        ? `🛠️ ${targetBin.name} Marked Under Repair`
        : `✅ ${targetBin.name} Marked Serviced & Online`,
      message: `Timestamp: ${timeStr}. LED ring switched to ${params.action === 'UNDER_REPAIR' ? 'Amber Pulse' : 'Green Breathing'}.`,
      type: params.action === 'UNDER_REPAIR' ? 'warning' : 'success',
      duration: 5000
    });
  }, [smartBins, currentUser, addAdminAuditLog, addToast, triggerCelebration]);

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    localDataCache.clearCache().catch(() => {});
    setLastCachedAt(null);
    setCurrentUser(INITIAL_USER);
    setSubmissions(INITIAL_SUBMISSIONS);
    setCollectionJobs(INITIAL_COLLECTION_JOBS);
    setRewardRules(INITIAL_REWARD_RULES);
    setRewards(INITIAL_REWARDS);
    setRedemptions([]);
    setTransactions(INITIAL_POINT_TRANSACTIONS);
    setCashWithdrawals(INITIAL_CASH_WITHDRAWALS);
    setLeaderboard(INITIAL_LEADERBOARD);
    setChallenge(INITIAL_CHALLENGE);
    setRecyclerInventory(INITIAL_RECYCLER_INVENTORY);
    setRecyclerOrders([]);
    setRobotEvents([]);
    setSwapItems(INITIAL_SWAP_ITEMS);
    setSwapTradeRequests([]);
    setCommunityEvents(INITIAL_COMMUNITY_EVENTS);
    setForumPosts(INITIAL_FORUM_POSTS);
    setDistrictQuests(INITIAL_DISTRICT_QUESTS);
    setAmbassadors(INITIAL_AMBASSADORS);
    setCurrentView('user-dashboard');
    
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Demo Environment Reset 🔄',
      message: 'State has been refreshed to clean Ghana pilot baseline data.',
      type: 'INFO',
      timestamp: 'Just now',
      read: false
    };
    setNotifications([newNotif]);
  };

  return (
    <EcoSortContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentUser,
        setCurrentUser,
        isRegistered,
        setIsRegistered,
        showAuthModal,
        setShowAuthModal,
        showEditProfileModal,
        setShowEditProfileModal,
        showCashOutModal,
        setShowCashOutModal,
        showApkModal,
        setShowApkModal,
        showPushSimulationModal,
        setShowPushSimulationModal,
        isDeviceFrameMode,
        setIsDeviceFrameMode,
        canInstallPwa: !!deferredPrompt,
        triggerNativeInstall,
        switchRole,
        language,
        setLanguage,
        currentLanguageInfo,
        t,
        pushAlerts,
        activePushBanner,
        pushSettings,
        updatePushSettings,
        triggerSimulatedPush,
        dismissActivePushBanner,
        claimPushReward,
        // Offline Local Persistence & Sync
        isOnline,
        isSimulatedOffline,
        setIsSimulatedOffline,
        effectiveIsOnline,
        pendingOfflineQueue,
        pendingOfflineCount: pendingOfflineQueue.filter(i => i.status === 'QUEUED' || i.status === 'FAILED').length,
        offlineStats,
        showOfflineQueueModal,
        setShowOfflineQueueModal,
        syncOfflineQueueNow,
        removeQueuedOfflineSubmission,
        clearOfflineQueue,
        addTestOfflineSubmission,
        // IndexedDB Local-First Data Cache
        lastCachedAt,
        isHydratedFromCache,
        cachedMetrics,
        saveToLocalCacheNow,
        clearLocalCacheData,
        // Share My Impact
        showShareImpactModal,
        setShowShareImpactModal,
        shareImpactCustomStats,
        openShareImpactModal,
        closeShareImpactModal,
        // Instant Camera Waste Scanner
        showInstantScanModal,
        setShowInstantScanModal,
        openInstantScanModal,
        closeInstantScanModal,
        instantScanAndCreditWaste,
        // Biometric Authentication
        biometricCapability,
        isBiometricsEnrolled,
        showBiometricModal,
        biometricPromptOptions,
        openBiometricPrompt,
        closeBiometricPrompt,
        registerUserBiometrics,
        removeUserBiometrics,
        authenticateWithBiometrics,
        firebaseUser,
        isGoogleAuthLoading,
        loginWithGoogle,
        registerUser,
        updateUserProfile,
        logoutUser,
        loginWithDemoUser,
        loginAsAdminWithCredentials,
        isAdminAuthenticated,
        showAdminAuthModal,
        setShowAdminAuthModal,
        openAdminAuthModal,
        allUsers,
        adminAuditLogs,
        addUser,
        updateUser,
        deleteUser,
        adjustUserPoints,
        toggleUserStatus,
        addReward,
        updateReward,
        deleteReward,
        assignJobAgent,
        cancelJobAdmin,
        forceVerifyJobAdmin,
        createChallenge,
        updateChallenge,
        addAdminAuditLog,
        submissions,
        collectionJobs,
        rewardRules,
        rewards,
        redemptions,
        transactions,
        cashWithdrawals,
        leaderboard,
        challenge,
        recyclerInventory,
        recyclerOrders,
        robotEvents,
        notifications,
        toasts,
        ecoPointsPerGhs: ECO_POINTS_PER_GHS,
        // Smart Dust Bin & LED Indicator IoT Grid
        smartBins,
        selectedSmartBin,
        setSelectedSmartBin,
        updateSmartBinLed,
        depositToSmartBin,
        registerNewSmartBin,
        triggerSmartBinEmptying,
        showSmartBinPairModal,
        setShowSmartBinPairModal,
        // Smart Dust Bin Maintenance Logs
        maintenanceLogs,
        addBinMaintenanceLog,
        markBinStatusWithLog,
        // httpSMS API Service (https://httpsms.com)
        smsLogs,
        smsGatewayStatus,
        refreshSmsLogs,
        sendCustomSms,
        // Community & Eco-Trade Hub
        swapItems,
        swapTradeRequests,
        communityEvents,
        forumPosts,
        districtQuests,
        ambassadors,
        addSwapItem,
        toggleLikeSwapItem,
        proposeSwapTrade,
        joinCommunityEvent,
        createCommunityEvent,
        addForumPost,
        toggleUpvoteForumPost,
        reactToForumPost,
        toggleBookmarkForumPost,
        addForumComment,
        reactToForumComment,
        toggleUpvoteForumComment,
        toggleVerifyCommentSolution,
        deleteForumComment,
        cheerAmbassador,
        submitWaste,
        acceptJob,
        verifyAndCollectJob,
        redeemReward,
        requestCashWithdrawal,
        recordRobotSortingEvent,
        updateRewardRule,
        addRecyclerOrder,
        markNotificationRead,
        clearAllNotifications,
        resetToDefaults,
        triggerCelebration,
        addToast,
        removeToast,
        updateToast,
        showSyncToast,
      }}
    >
      {children}
    </EcoSortContext.Provider>
  );
};

export const useEcoSort = () => {
  const context = useContext(EcoSortContext);
  if (!context) {
    throw new Error('useEcoSort must be used within an EcoSortProvider');
  }
  return context;
};
