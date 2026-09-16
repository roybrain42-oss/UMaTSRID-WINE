import { 
  UserProfile, 
  WasteSubmission, 
  CollectionJob, 
  RewardItem, 
  RewardRedemption, 
  PointTransaction, 
  LeaderboardEntry, 
  Challenge, 
  RewardRateRule, 
  RecyclerInventory, 
  RecyclerOrder, 
  CashWithdrawalRecord,
  AdminAuditLog
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  role: 'USER',
  entityType: 'INDIVIDUAL',
  institutionName: '',
  memberCount: 1,
  leaderboardOptIn: true,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  location: '',
  ecoPoints: 0,
  totalWasteKg: 0,
  verifiedCollections: 0,
  co2SavedKg: 0,
  rankTitle: 'Citizen EcoSorter',
  createdAt: new Date().toISOString(),
  status: 'ACTIVE',
};

export const DEMO_AGENTS: UserProfile[] = [
  {
    id: 'agt-kwame-01',
    name: 'Kwame Asante',
    email: 'kwame.collector@ecosort.gh',
    phone: '+233 20 445 8891',
    role: 'COLLECTION_AGENT',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    organization: 'EcoSort Greater Accra Fleet',
    location: 'Madina & Legon Zone',
    ecoPoints: 0,
    totalWasteKg: 0,
    verifiedCollections: 0,
    co2SavedKg: 0,
    rankTitle: 'Collection Specialist 🛵',
    createdAt: '2026-05-01T08:00:00Z',
  },
  {
    id: 'agt-abena-02',
    name: 'Abena Osei',
    email: 'abena.collector@ecosort.gh',
    phone: '+233 55 123 9081',
    role: 'COLLECTION_AGENT',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    organization: 'EcoSort Ashanti Fleet',
    location: 'Kumasi Kejetia Hub',
    ecoPoints: 0,
    totalWasteKg: 0,
    verifiedCollections: 0,
    co2SavedKg: 0,
    rankTitle: 'Field Agent 🛵',
    createdAt: '2026-05-10T08:00:00Z',
  }
];

export const DEMO_RECYCLER: UserProfile = {
  id: 'rec-accra-circular',
  name: 'Accra Circular Plastics Ltd',
  email: 'procurement@accracircular.com',
  phone: '+233 30 223 9090',
  role: 'RECYCLER',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  organization: 'Accra Circular Plastics Ltd',
  location: 'Tema Heavy Industrial Area',
  ecoPoints: 0,
  totalWasteKg: 0,
  verifiedCollections: 0,
  co2SavedKg: 0,
  rankTitle: 'Industrial Recycler 🏭',
  createdAt: '2026-04-01T08:00:00Z',
};

export const DEMO_COMMUNITY_LEAD: UserProfile = {
  id: 'usr-achimota-lead',
  name: 'Achimota Eco Hub',
  email: 'ecoclub@achimotaschool.edu.gh',
  phone: '+233 24 556 7788',
  role: 'COMMUNITY_ADMIN',
  entityType: 'SCHOOL',
  institutionName: 'Achimota Senior High School',
  memberCount: 1,
  contactPerson: 'Lead Coordinator',
  leaderboardOptIn: true,
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  organization: 'Achimota Senior High School',
  location: 'Achimota, Greater Accra',
  ecoPoints: 0,
  totalWasteKg: 0,
  verifiedCollections: 0,
  co2SavedKg: 0,
  rankTitle: 'Community Coordinator 🏆',
  createdAt: '2026-03-01T08:00:00Z',
};

export const DEMO_ADMIN: UserProfile = {
  id: 'adm-umat-srid',
  name: 'UMaT SRID',
  email: 'srid@umat.edu.gh',
  phone: '+233 31 200 4567',
  role: 'ADMIN',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  organization: 'UMaT SRID - School of Railway & Infrastructure Development / EPA EcoSort',
  location: 'UMaT Campus, Tarkwa / Essikado, Western Region',
  community: 'UMaT SRID Campus',
  ecoPoints: 0,
  totalWasteKg: 0,
  verifiedCollections: 0,
  co2SavedKg: 0,
  rankTitle: 'EPA Command Officer (UMaT SRID) 🛡️',
  createdAt: '2026-01-01T08:00:00Z',
  status: 'ACTIVE',
};

// All registered members are cleared by default - clean state ready for new sign-ups
export const INITIAL_ALL_USERS: UserProfile[] = [];

export const INITIAL_ADMIN_AUDIT_LOGS: AdminAuditLog[] = [];

export const INITIAL_REWARD_RULES: RewardRateRule[] = [
  { category: 'PLASTIC', label: 'Plastics (PET Bottles, HDPE, Sachet LDPE)', pointsPerKg: 10, minWeightKg: 0.1, active: true, co2SavingsPerKg: 1.6 },
  { category: 'METAL', label: 'Metals (Aluminum Cans, Steel Cans, Copper)', pointsPerKg: 15, minWeightKg: 0.1, active: true, co2SavingsPerKg: 2.4 },
  { category: 'PAPER', label: 'Paper & Cardboard (Cartons, Mixed Sheets)', pointsPerKg: 5, minWeightKg: 0.2, active: true, co2SavingsPerKg: 0.9 },
  { category: 'GLASS', label: 'Glass (Beverage Bottles, Jars)', pointsPerKg: 8, minWeightKg: 0.5, active: true, co2SavingsPerKg: 0.5 },
  { category: 'E_WASTE', label: 'E-Waste (Circuits, Old Phones, Batteries)', pointsPerKg: 20, minWeightKg: 0.05, active: true, co2SavingsPerKg: 3.5 },
  { category: 'ORGANIC', label: 'Organic Compostables (Food scraps)', pointsPerKg: 3, minWeightKg: 1.0, active: true, co2SavingsPerKg: 0.4 },
];

export const INITIAL_SUBMISSIONS: WasteSubmission[] = [];

export const INITIAL_COLLECTION_JOBS: CollectionJob[] = [];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rew-airtime-10',
    title: '₵10 Airtime / Data',
    description: 'Instant recharge voucher for MTN, Telecel, or AT networks across Ghana.',
    category: 'AIRTIME',
    costPoints: 100,
    valueGhs: 10.0,
    originalPriceGhs: 10.0,
    vendor: 'MTN & Telecel Ghana',
    icon: '📱',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80',
    sponsorName: 'EcoSort Ghana Telecommunications Partner',
    inStock: true,
    stockCount: 450,
    popular: true,
  },
  {
    id: 'rew-tshirt',
    title: 'EcoSort Green T-Shirt',
    description: '100% organic cotton branded eco-champion apparel with Ghana recycling motif.',
    category: 'MERCHANDISE',
    costPoints: 500,
    valueGhs: 65.0,
    originalPriceGhs: 65.0,
    vendor: 'EcoSort Apparel Lab',
    icon: '👕',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80',
    sponsorName: 'EcoSort Apparel Lab',
    inStock: true,
    stockCount: 120,
    popular: true,
  },
  {
    id: 'rew-school-supplies',
    title: 'School Supplies Kit',
    description: 'Stationery set: 5 notebooks, pens, geometry set, eco pencil case, and ruler.',
    category: 'EDUCATION',
    costPoints: 300,
    valueGhs: 40.0,
    originalPriceGhs: 40.0,
    vendor: 'Ghana Green Education Trust',
    icon: '📚',
    imageUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=300&auto=format&fit=crop&q=80',
    sponsorName: 'Ghana Green Education Trust',
    inStock: true,
    stockCount: 85,
  },
  {
    id: 'rew-voucher-50',
    title: '₵50 Shopping Voucher',
    description: 'Redeemable at Melcom, Shoprite, and major retail supermarkets across Ghana.',
    category: 'VOUCHER',
    costPoints: 1000,
    valueGhs: 50.0,
    originalPriceGhs: 50.0,
    vendor: 'Melcom Ghana',
    icon: '🛒',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&auto=format&fit=crop&q=80',
    sponsorName: 'Retail Sustainability Alliance',
    inStock: true,
    stockCount: 30,
    popular: true,
  },
  {
    id: 'rew-water-credit',
    title: '₵25 Ghana Water Credit',
    description: 'Bill deduction voucher for Ghana Water Company Limited utility accounts.',
    category: 'UTILITY',
    costPoints: 450,
    valueGhs: 25.0,
    originalPriceGhs: 25.0,
    vendor: 'Ghana Water Co. (GWCL)',
    icon: '💧',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=300&auto=format&fit=crop&q=80',
    sponsorName: 'GWCL Green Credit Scheme',
    inStock: true,
    stockCount: 60,
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    id: 'inst-ug-legon',
    name: 'University of Ghana (Legon)',
    type: 'UNIVERSITY',
    entityType: 'SCHOOL',
    location: 'Legon, Accra',
    wasteCollectedKg: 2450,
    pointsEarned: 24500,
    participantsCount: 412,
    badge: '🥇 National Champion',
    institutionName: 'University of Ghana',
    contactPerson: 'Dean of Student Affairs'
  },
  {
    rank: 2,
    id: 'inst-knust',
    name: 'KNUST Green Campus',
    type: 'UNIVERSITY',
    entityType: 'SCHOOL',
    location: 'Kumasi, Ashanti Region',
    wasteCollectedKg: 1980,
    pointsEarned: 19800,
    participantsCount: 340,
    badge: '🥈 Innovation Leader',
    institutionName: 'KNUST',
    contactPerson: 'Environmental Science Dept'
  },
  {
    rank: 3,
    id: 'org-mtn-ghana',
    name: 'MTN Ghana Sustainability Club',
    type: 'ORGANIZATION',
    entityType: 'ORGANIZATION',
    location: 'Ridge Head Office, Accra',
    wasteCollectedKg: 1650,
    pointsEarned: 16500,
    participantsCount: 185,
    badge: '🏢 Top Corporate Eco-Hero',
    institutionName: 'MTN Ghana Foundation',
    contactPerson: 'Corporate Social Responsibility Lead'
  },
  {
    rank: 4,
    id: 'inst-ucc',
    name: 'University of Cape Coast (UCC)',
    type: 'UNIVERSITY',
    entityType: 'SCHOOL',
    location: 'Cape Coast, Central Region',
    wasteCollectedKg: 1420,
    pointsEarned: 14200,
    participantsCount: 220,
    badge: '🥉 Coastal Pioneer',
    institutionName: 'UCC Campus',
    contactPerson: 'Marine & Coastal Studies'
  },
  {
    rank: 5,
    id: 'comm-madina-taskforce',
    name: 'Madina Zongo Eco Taskforce',
    type: 'COMMUNITY',
    entityType: 'COMMUNITY',
    location: 'Madina, Greater Accra',
    wasteCollectedKg: 1210,
    pointsEarned: 12100,
    participantsCount: 175,
    badge: '🏘️ Clean City Vanguard',
    institutionName: 'Madina Municipal Assembly',
    contactPerson: 'Youth Organizer Al-Hassan'
  },
  {
    rank: 6,
    id: 'inst-achimota',
    name: 'Achimota Senior High School',
    type: 'SCHOOL',
    entityType: 'SCHOOL',
    location: 'Achimota, Accra',
    wasteCollectedKg: 1100,
    pointsEarned: 11000,
    participantsCount: 280,
    badge: '🏫 Top High School Recycler',
    institutionName: 'Achimota SHS Green Club',
    contactPerson: 'Senior House Master'
  },
  {
    rank: 7,
    id: 'inst-ug-hall',
    name: 'UG - Commonwealth & Legon Halls',
    type: 'SCHOOL',
    entityType: 'SCHOOL',
    location: 'Legon, Accra',
    wasteCollectedKg: 980,
    pointsEarned: 9800,
    participantsCount: 165,
    badge: '⭐ Top Hall of Residence',
    institutionName: 'UG Student Halls Council',
    contactPerson: 'Hall President'
  },
  {
    rank: 8,
    id: 'org-stanbic-green',
    name: 'Stanbic Bank Ghana Green Guild',
    type: 'ORGANIZATION',
    entityType: 'ORGANIZATION',
    location: 'Airport City, Accra',
    wasteCollectedKg: 890,
    pointsEarned: 8900,
    participantsCount: 95,
    badge: '💳 Sustainable Banking Award',
    institutionName: 'Stanbic Bank Ghana',
    contactPerson: 'ESG & Compliance Unit'
  },
  {
    rank: 9,
    id: 'inst-ashesi',
    name: 'Ashesi University Eco Hub',
    type: 'UNIVERSITY',
    entityType: 'SCHOOL',
    location: 'Berekuso, Eastern Region',
    wasteCollectedKg: 760,
    pointsEarned: 7600,
    participantsCount: 118,
    badge: '🌿 Green Campus',
    institutionName: 'Ashesi University',
    contactPerson: 'Sustainability Committee'
  },
  {
    rank: 10,
    id: 'comm-abeka-comm',
    name: 'Abeka Community Green Hub',
    type: 'COMMUNITY',
    entityType: 'COMMUNITY',
    location: 'Abeka, Accra',
    wasteCollectedKg: 640,
    pointsEarned: 6400,
    participantsCount: 95,
    badge: '🏘️ Community Hero',
    institutionName: 'Abeka Residents Association',
    contactPerson: 'Assembly Member'
  },
  {
    rank: 11,
    id: 'comm-osu-coastal',
    name: 'Osu Coastal Clean Beach Coalition',
    type: 'COMMUNITY',
    entityType: 'COMMUNITY',
    location: 'Osu Klottey, Accra',
    wasteCollectedKg: 580,
    pointsEarned: 5800,
    participantsCount: 82,
    badge: '🌊 Blue Ocean Shield',
    institutionName: 'Osu Beachfront Committee',
    contactPerson: 'Chief Fisherman'
  },
  {
    rank: 12,
    id: 'org-circular-plastics',
    name: 'Accra Circular Plastics Guild',
    type: 'ORGANIZATION',
    entityType: 'ORGANIZATION',
    location: 'Tema Industrial Area',
    wasteCollectedKg: 520,
    pointsEarned: 5200,
    participantsCount: 45,
    badge: '🏭 Zero Waste Factory',
    institutionName: 'Circular Plastics Guild',
    contactPerson: 'Operations Director'
  }
];

export const INITIAL_CHALLENGE: Challenge = {
  id: 'ch-aug-2026',
  title: 'EcoSort August 2026 Inter-University Cup',
  subtitle: 'Clean campuses, zero plastic pollution across Ghana',
  targetCategory: 'PLASTIC',
  startDate: '2026-08-01',
  endDate: '2026-08-31',
  goalKg: 10000,
  currentKg: 7590,
  participantsCount: 1350,
  prizePoolGhs: 15000,
  status: 'ACTIVE',
  bannerImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
  rules: [
    'Only verified collections completed between Aug 1 and Aug 31 qualify.',
    'Bonus 100 EcoPoints for every 5kg batch of clean PET bottles.',
    'Top 3 educational institutions receive funded green lab grants.'
  ]
};

export const INITIAL_RECYCLER_INVENTORY: RecyclerInventory[] = [
  { category: 'PLASTIC', material: 'PET Plastic', availableKg: 1240, pricePerKgGhs: 4.5, purityGrade: 'Grade A (Optical Sorted 98%)', locationHub: 'Tema Processing Facility' },
  { category: 'METAL', material: 'Aluminum Can', availableKg: 420, pricePerKgGhs: 9.8, purityGrade: 'Pure Baled Aluminum (99%)', locationHub: 'Accra Industrial Station' },
  { category: 'PAPER', material: 'Corrugated Paper', availableKg: 850, pricePerKgGhs: 2.2, purityGrade: 'Clean Baled Pulp Paper', locationHub: 'Kumasi Central Hub' },
  { category: 'GLASS', material: 'Glass Beverage', availableKg: 310, pricePerKgGhs: 1.8, purityGrade: 'Sorted Cullet (Flint/Amber)', locationHub: 'Tema Glass Depot' },
  { category: 'E_WASTE', material: 'Electronic Circuit', availableKg: 180, pricePerKgGhs: 18.0, purityGrade: 'Circuit Boards & Precious Metals', locationHub: 'Accra Tech Recovery Yard' },
];

export const SAMPLE_WASTE_GALLERY = [
  {
    id: 'sample-pet-bottle',
    name: 'Voltic Water PET Bottle',
    category: 'PLASTIC' as const,
    material: 'PET Plastic' as const,
    confidence: 96.8,
    weightKg: 0.18,
    points: 2,
    imageUrl: 'https://images.unsplash.com/photo-1528190336454-13cd56b45b5a?w=400&auto=format&fit=crop&q=80',
    description: 'Transparent polyethylene terephthalate beverage bottle. Highest recycling value.',
    features: ['Polymer #1', 'Transparent', 'Recyclable cap', 'Crushable']
  },
  {
    id: 'sample-aluminum-can',
    name: 'Guinness / Malt Drink Aluminum Can',
    category: 'METAL' as const,
    material: 'Aluminum Can' as const,
    confidence: 98.4,
    weightKg: 0.15,
    points: 3,
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&auto=format&fit=crop&q=80',
    description: 'High purity lightweight aluminum alloy with zero degradation during smelting.',
    features: ['Metallic resonance', 'Pull-tab closure', 'Infinite recyclability']
  },
  {
    id: 'sample-carton-box',
    name: 'Corrugated Cardboard Carton',
    category: 'PAPER' as const,
    material: 'Corrugated Paper' as const,
    confidence: 95.1,
    weightKg: 0.45,
    points: 3,
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&auto=format&fit=crop&q=80',
    description: 'Unbleached kraft fiber shipping carton. Excellent for recycled pulp production.',
    features: ['Fluted middle layer', 'Biodegradable', 'Dry cellulose']
  },
  {
    id: 'sample-glass-bottle',
    name: 'Beverage Glass Bottle (Club / Star)',
    category: 'GLASS' as const,
    material: 'Glass Beverage' as const,
    confidence: 97.2,
    weightKg: 0.40,
    points: 4,
    imageUrl: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400&auto=format&fit=crop&q=80',
    description: 'Amber beverage glass cullet. Infinite lifecycle with 0 toxic byproducts.',
    features: ['Vitreous silica', 'Rigid form', 'Washable']
  },
  {
    id: 'sample-ewaste-pcb',
    name: 'Electronic PCB & Battery Pack',
    category: 'E_WASTE' as const,
    material: 'Electronic Circuit' as const,
    confidence: 99.1,
    weightKg: 0.25,
    points: 5,
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&auto=format&fit=crop&q=80',
    description: 'Printed circuit board containing precious metals, copper leads and capacitors.',
    features: ['FR4 substrate', 'Copper traces', 'Hazardous landfill prevention']
  },
  {
    id: 'sample-sachet-water',
    name: 'Pure Water Sachet (LDPE Rubber)',
    category: 'PLASTIC' as const,
    material: 'LDPE Sachet' as const,
    confidence: 95.9,
    weightKg: 0.05,
    points: 1,
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400&auto=format&fit=crop&q=80',
    description: 'Low-density polyethylene water sachet. High volume urban waste stream in Ghana.',
    features: ['LDPE #4', 'Flexible film', 'Pelletization candidate']
  }
];

export const INITIAL_POINT_TRANSACTIONS: PointTransaction[] = [];

export const INITIAL_CASH_WITHDRAWALS: CashWithdrawalRecord[] = [];


