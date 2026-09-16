export type UserRole = 'USER' | 'COLLECTION_AGENT' | 'RECYCLER' | 'ADMIN' | 'COMMUNITY_ADMIN';

export type EntityType = 'INDIVIDUAL' | 'SCHOOL' | 'COMMUNITY' | 'ORGANIZATION' | 'BUSINESS';

export type WasteCategory = 'PLASTIC' | 'METAL' | 'PAPER' | 'GLASS' | 'ORGANIC' | 'E_WASTE' | 'OTHER';

export type WasteMaterial = 
  | 'PET Plastic' 
  | 'HDPE Plastic' 
  | 'LDPE Sachet' 
  | 'Water Sachet (LDPE)'
  | 'Pure Water Sachet'
  | 'Aluminum Can' 
  | 'Tin Steel' 
  | 'Corrugated Paper' 
  | 'Mixed Office Paper' 
  | 'Glass Beverage' 
  | 'Electronic Circuit' 
  | 'Organic Compost' 
  | 'Other Mixed'
  | (string & {});

export type CollectionStatus = 
  | 'REQUESTED' 
  | 'AVAILABLE'
  | 'ASSIGNED'
  | 'ACCEPTED' 
  | 'EN_ROUTE' 
  | 'COLLECTED' 
  | 'VERIFIED' 
  | 'POINTS_AWARDED' 
  | 'CANCELLED';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  entityType?: EntityType;
  institutionName?: string;
  memberCount?: number;
  contactPerson?: string;
  leaderboardOptIn?: boolean;
  avatar?: string;
  organization?: string;
  location: string;
  community?: string;
  address?: string;
  ghanaCardNumber?: string;
  ghanaTelecomNetwork?: 'MTN' | 'Telecel' | 'AT' | 'Other';
  ecoPoints: number;
  totalWasteKg: number;
  verifiedCollections: number;
  co2SavedKg: number;
  rankTitle: string;
  createdAt: string;
  // Auth Provider
  authProvider?: 'google' | 'email' | 'demo' | 'biometric';
  googleId?: string;
  // Biometrics & WebAuthn
  biometricsEnabled?: boolean;
  biometricCredentialId?: string;
  biometricDeviceName?: string;
  biometricRegisteredAt?: string;
  biometricType?: 'FACE_ID' | 'FINGERPRINT' | 'PASSKEY' | 'SECURITY_KEY' | 'GENERIC_BIOMETRIC';
  requireBiometricForMoMo?: boolean;
  momoBiometricPolicy?: 'ALWAYS' | 'THRESHOLD_ONLY' | 'NEVER';
  momoBiometricThresholdGhs?: number;
  completedSubmissionsCount?: number;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: 'USER_CREATED' | 'USER_UPDATED' | 'USER_DELETED' | 'POINTS_ADJUSTED' | 'USER_STATUS_CHANGED' | 'RATE_UPDATED' | 'REWARD_CREATED' | 'REWARD_UPDATED' | 'REWARD_DELETED' | 'JOB_DISPATCHED' | 'JOB_VERIFIED' | 'JOB_CANCELLED' | 'CHALLENGE_CREATED' | 'STATE_RESET';
  targetType: 'USER' | 'REWARD' | 'JOB' | 'CHALLENGE' | 'RATE' | 'SYSTEM';
  targetId?: string;
  targetName?: string;
  details: string;
  timestamp: string;
}

export interface WasteClassificationResult {
  category: WasteCategory;
  material: WasteMaterial;
  confidence: number;
  recyclable: boolean;
  estimatedWeightKg: number;
  estimatedPoints: number;
  handlingInstructions: string;
  co2ReductionPerKg: number;
  detectedFeatures: string[];
  resinCode?: string;
  cleanlinessRating?: 'CLEAN' | 'NEEDS_RINSING' | 'CONTAMINATED' | 'SOILED';
  epaSortingStandard?: string;
  ghanaLocalContext?: string;
  itemDescription?: string;
}

export interface WasteSubmission {
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  imageThumbnail?: string;
  classification: WasteClassificationResult;
  userWeightEstimateKg: number;
  actualWeightKg?: number;
  status: CollectionStatus;
  pickupAddress: string;
  community: string;
  preferredPickupTime: string;
  notes?: string;
  pointsAwarded: number;
  createdAt: string;
  isOfflineQueued?: boolean;
  offlineSyncedAt?: string;
  verifiedAt?: string;
  verifiedByAgentId?: string;
  verifiedByAgentName?: string;
  verificationPhotoUrl?: string;
}

export interface CollectionJob {
  id: string;
  submissionId: string;
  userId: string;
  userName: string;
  userPhone: string;
  wasteCategory: WasteCategory;
  material: WasteMaterial;
  estimatedWeightKg: number;
  actualWeightKg?: number;
  location: string;
  community: string;
  distanceKm: number;
  status: CollectionStatus;
  assignedAgentId?: string;
  agentName?: string;
  collectorId?: string;
  collectorName?: string;
  dynamicDistanceKm?: number;
  jobLat?: number;
  jobLng?: number;
  mapX?: number;
  mapY?: number;
  photoUrl: string;
  scheduledTime: string;
  notes?: string;
  createdAt: string;
  category?: WasteCategory;
  pickupAddress?: string;
  estimatedPoints?: number;
  pointsEarned?: number;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  category: 'AIRTIME' | 'MERCHANDISE' | 'EDUCATION' | 'VOUCHER' | 'UTILITY' | 'MOMO_CASH' | 'GROCERY' | 'TRANSPORT' | 'ECO_MERCH' | 'OTHER';
  costPoints: number;
  originalPriceGhs: number;
  valueGhs?: number;
  imageUrl: string;
  icon?: string;
  sponsorName?: string;
  vendor?: string;
  inStock: boolean;
  stockCount?: number;
  popular?: boolean;
}

export interface RewardRedemption {
  id: string;
  userId: string;
  userName: string;
  rewardId: string;
  rewardTitle: string;
  pointsSpent: number;
  redemptionCode: string;
  status: 'PENDING' | 'FULFILLED' | 'CANCELLED';
  recipientPhoneOrAddress: string;
  createdAt: string;
  fulfilledAt?: string;
}

export interface CashWithdrawalRecord {
  id: string;
  userId: string;
  userName: string;
  pointsConverted: number;
  amountGhs: number;
  feeGhs: number;
  netPayoutGhs: number;
  network: 'MTN' | 'Telecel' | 'AT' | 'Other';
  recipientPhone: string;
  accountHolderName: string;
  ghanaCardNumber?: string;
  transactionRef: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  payoutGateway: string;
  createdAt: string;
  completedAt: string;
  authorizedViaBiometrics?: boolean;
  biometricAuthRef?: string;
  biometricType?: 'FACE_ID' | 'FINGERPRINT' | 'PASSKEY' | 'SECURITY_KEY' | 'GENERIC_BIOMETRIC';
}

export * from './biometrics';
export * from './community';

export interface PointTransaction {
  id: string;
  userId: string;
  type: 'EARNED' | 'EARNED_WASTE' | 'EARNED_CHALLENGE' | 'EARNED_BONUS' | 'REDEEMED_REWARD' | 'SIMULATION_GRANT' | 'CASH_WITHDRAWAL_MOMO' | 'INSTANT_SCAN_EARN' | (string & {});
  amount: number;
  description: string;
  referenceId?: string;
  source?: string;
  timestamp?: string;
  createdAt?: string;
  balanceAfter?: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  type: 'INDIVIDUAL' | 'SCHOOL' | 'COMMUNITY' | 'ORGANIZATION' | 'UNIVERSITY' | (string & {});
  location: string;
  wasteCollectedKg: number;
  pointsEarned: number;
  participantsCount: number;
  badge: string;
  avatar?: string;
  entityType?: EntityType;
  institutionName?: string;
  isCurrentUser?: boolean;
  contactPerson?: string;
}

export interface Challenge {
  id: string;
  title: string;
  subtitle: string;
  targetCategory: WasteCategory | 'ALL';
  startDate: string;
  endDate: string;
  goalKg: number;
  currentKg: number;
  participantsCount: number;
  prizePoolGhs: number;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
  bannerImage: string;
  rules: string[];
}

export interface RobotSortingEvent {
  id: string;
  timestamp: string;
  itemName: string;
  category: WasteCategory;
  material: WasteMaterial;
  confidence: number;
  weightKg: number;
  destinationBin: 'PLASTIC' | 'METAL' | 'PAPER' | 'GLASS' | 'E_WASTE';
  pointsGenerated: number;
  status: 'SUCCESS' | 'MISCLASSIFIED' | 'REJECTED';
}

export interface RobotSensorState {
  camera: 'ONLINE' | 'STANDBY' | 'CALIBRATING';
  irSensor: 'ONLINE' | 'TRIGGERED' | 'STANDBY';
  weightSensor: 'ONLINE' | 'MEASURING' | 'STANDBY';
  proximity: 'ONLINE' | 'DETECTED' | 'CLEAR';
  conveyorMotor: 'ACTIVE' | 'PAUSED' | 'IDLE';
  robotArm: 'ACTIVE' | 'SORTING' | 'HOMING' | 'IDLE';
}

export interface RecyclerInventory {
  category: WasteCategory;
  material: WasteMaterial;
  availableKg: number;
  pricePerKgGhs: number;
  purityGrade: string;
  locationHub: string;
}

export interface RecyclerOrder {
  id: string;
  recyclerId: string;
  companyName: string;
  category: WasteCategory;
  quantityKg: number;
  totalGhs: number;
  status: 'REQUESTED' | 'APPROVED' | 'IN_TRANSIT' | 'DELIVERED';
  destinationFacility: string;
  createdAt: string;
}

export interface RewardRateRule {
  category: WasteCategory;
  label: string;
  pointsPerKg: number;
  minWeightKg: number;
  active: boolean;
  co2SavingsPerKg: number;
}

export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'sync' | 'points';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
  timestamp?: string;
  syncState?: 'syncing' | 'synced' | 'failed';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export * from './community';
export * from './smartBin';

