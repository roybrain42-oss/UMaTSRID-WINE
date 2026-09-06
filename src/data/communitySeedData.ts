import { 
  CommunitySwapItem, 
  CommunityEvent, 
  CommunityForumPost, 
  DistrictCollectiveQuest, 
  CommunityAmbassador 
} from '../types/community';

export const INITIAL_SWAP_ITEMS: CommunitySwapItem[] = [
  {
    id: 'swap-01',
    title: 'Upcycled Woven Pure Water Sachet Market Tote',
    description: 'Handwoven sturdy tote bag made entirely from 120 cleaned, sanitized LDPE water sachets. Waterproof, stylish, and perfect for shopping at Makola or Shoprite.',
    category: 'UPCYCLED',
    condition: 'UPCYCLED_HANDMADE',
    tradeType: 'POINTS_OR_BARTER',
    pointsValue: 120,
    estimatedValueGhs: 35,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80'
    ],
    sellerId: 'usr-naa-01',
    sellerName: 'Naa Lamiley',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    sellerTrustScore: 4.9,
    community: 'Jamestown, Accra',
    status: 'AVAILABLE',
    createdAt: '2026-08-24T10:30:00Z',
    swapPreferences: 'Looking for clean amber glass jars, bamboo seedling pots, or 120 EcoPoints.',
    likesCount: 34,
    viewCount: 182
  },
  {
    id: 'swap-02',
    title: 'Bokashi Organic Kitchen Compost Starter Bin',
    description: '20L airtight composting bucket fitted with a drain tap for Bokashi microbial tea. Comes with 1kg inoculated wheat bran fermenter for odorless kitchen composting.',
    category: 'GARDEN_COMPOST',
    condition: 'LIKE_NEW',
    tradeType: 'POINTS',
    pointsValue: 180,
    estimatedValueGhs: 55,
    images: [
      'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=600&auto=format&fit=crop&q=80'
    ],
    sellerId: 'usr-kofi-garden',
    sellerName: 'Kofi Boaten',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    sellerTrustScore: 5.0,
    community: 'East Legon, Accra',
    status: 'AVAILABLE',
    createdAt: '2026-08-25T14:15:00Z',
    swapPreferences: 'Points only for funding our community garden seedling nursery.',
    likesCount: 48,
    viewCount: 240
  },
  {
    id: 'swap-03',
    title: 'Recycled HDPE Planter Pots (Set of 6)',
    description: 'Durable, UV-resistant plant pots manufactured from melted down plastic bottle caps. Features built-in drainage mesh. Ideal for herbs, peppers, and succulents.',
    category: 'REUSABLE',
    condition: 'NEW',
    tradeType: 'FREE_SWAP',
    pointsValue: 0,
    estimatedValueGhs: 25,
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80'
    ],
    sellerId: 'usr-bright-01',
    sellerName: 'Bright Mensah',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    sellerTrustScore: 4.8,
    community: 'Legon Campus, Accra',
    status: 'AVAILABLE',
    createdAt: '2026-08-23T09:00:00Z',
    swapPreferences: 'Free community gift! Willing to swap for any vegetable seeds or garden soil.',
    likesCount: 27,
    viewCount: 145
  },
  {
    id: 'swap-04',
    title: 'Clean Sorted Amber Beverage Glass Bottles (Case of 24)',
    description: 'Sanitized, de-labeled amber 330ml bottles suitable for kombucha, hibiscus sobolo, cold brew, or zero-waste liquid bottling.',
    category: 'RAW_MATERIAL',
    condition: 'RAW_SORTED',
    tradeType: 'BARTER_ITEM',
    pointsValue: 60,
    estimatedValueGhs: 18,
    images: [
      'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600&auto=format&fit=crop&q=80'
    ],
    sellerId: 'usr-akosua-03',
    sellerName: 'Akosua Frimpong',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    sellerTrustScore: 4.9,
    community: 'Kumasi Central, Ashanti',
    status: 'AVAILABLE',
    createdAt: '2026-08-22T16:45:00Z',
    swapPreferences: 'Barter for corrugated cardboard boxes or 60 EcoPoints.',
    likesCount: 19,
    viewCount: 110
  },
  {
    id: 'swap-05',
    title: 'DIY Hand-Crank Plastic Shredder Blade Box',
    description: 'Precision laser-cut stainless steel shredder box (Precious Plastic blueprint v4) for shredding washed bottle caps into clean 4mm injection flakes.',
    category: 'TOOLS_REPAIR',
    condition: 'GENTLY_USED',
    tradeType: 'POINTS_OR_BARTER',
    pointsValue: 450,
    estimatedValueGhs: 160,
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
    ],
    sellerId: 'usr-yaw-maker',
    sellerName: 'Yaw Boateng',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    sellerTrustScore: 5.0,
    community: 'Tema Industrial, Greater Accra',
    status: 'AVAILABLE',
    createdAt: '2026-08-21T11:20:00Z',
    swapPreferences: 'Open to trading for an extrusion nozzle or 450 EcoPoints.',
    likesCount: 62,
    viewCount: 380
  },
  {
    id: 'swap-06',
    title: 'Zero-Waste Kitchen Starter Kit (Bamboo + Stainless Steel)',
    description: 'Includes 2 reusable silicone produce bags, 1 coconut fiber dish scrub, 1 stainless steel straw with cleaner brush, and 1 bamboo cutlery pouch.',
    category: 'REUSABLE',
    condition: 'NEW',
    tradeType: 'POINTS',
    pointsValue: 150,
    estimatedValueGhs: 45,
    images: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80'
    ],
    sellerId: 'usr-afia-eco',
    sellerName: 'Afia Serwaa',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    sellerTrustScore: 5.0,
    community: 'Osu, Accra',
    status: 'AVAILABLE',
    createdAt: '2026-08-25T17:30:00Z',
    swapPreferences: 'Points will support the Osu Community Seedling Nursery.',
    likesCount: 51,
    viewCount: 290
  }
];

export const INITIAL_COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: 'event-01',
    title: 'Labadi Coastline & Beach Mega Cleanup',
    description: 'Join over 80 environmental champions to clear marine plastic waste and sachet drift along the 2.5km Labadi Beach stretch. All collected plastics will be sorted, weighed on digital scales, and credited instantly with EcoPoints.',
    category: 'BEACH_CLEANUP',
    date: 'Saturday, Aug 29, 2026',
    time: '06:30 AM - 10:30 AM GMT',
    location: 'Labadi Beach South Entrance, Accra',
    community: 'La / Osu Coast, Greater Accra',
    organizer: 'Osu Beach Protectors & EPA Ghana Youth',
    organizerRole: 'Certified Community Lead',
    organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80',
    targetWasteGoalKg: 1200,
    currentProgressKg: 0,
    ecoPointsReward: 300,
    maxVolunteers: 100,
    registeredVolunteersCount: 76,
    equipmentProvided: [
      'Heavy-duty puncture-proof gloves',
      'Color-coded sorting jute sacks (PET / LDPE / General)',
      'Digital hanging scale stations',
      'Fresh drinking water refill station',
      'EcoSort volunteer t-shirt'
    ],
    isJoined: false
  },
  {
    id: 'event-02',
    title: 'Kumasi Kejetia Market Zero-Organic Waste Drive',
    description: 'Community-wide initiative to separate compostable fruit and vegetable market trimmings from non-biodegradable packaging. All organic material will be channeled directly to the Kwadaso Agricultural Compost Facility.',
    category: 'NEIGHBORHOOD_SWEEP',
    date: 'Wednesday, Sep 02, 2026',
    time: '07:00 AM - 11:00 AM GMT',
    location: 'Kejetia Market North Gate, Kumasi',
    community: 'Kejetia / Central Kumasi, Ashanti',
    organizer: 'Kumasi Agro-Recycle Alliance',
    organizerRole: 'Market Women Association Lead',
    organizerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    targetWasteGoalKg: 2500,
    currentProgressKg: 0,
    ecoPointsReward: 250,
    maxVolunteers: 60,
    registeredVolunteersCount: 52,
    equipmentProvided: [
      'Heavy duty aprons & gumboots',
      'Compost aeration forks & sorting tubs',
      'MoMo airtime top-up vouchers'
    ],
    isJoined: true,
    selectedRole: 'Sorting Coordinator'
  },
  {
    id: 'event-03',
    title: 'Legon Campus E-Waste Drop-Off & Repair Clinic',
    description: 'Bring obsolete electronic motherboards, broken laptops, dead lithium phone batteries, and copper cables. Partner technicians will offer free diagnostics and repair advice, and unfixable parts receive instant scrap EcoPoints.',
    category: 'E_WASTE_DRIVE',
    date: 'Friday, Sep 04, 2026',
    time: '09:00 AM - 04:00 PM GMT',
    location: 'University of Ghana Balme Library Forecourt',
    community: 'Legon Campus, Accra',
    organizer: 'UG Green Society & Agbogbloshie Makers Hub',
    organizerRole: 'Campus Ambassador',
    organizerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    targetWasteGoalKg: 800,
    currentProgressKg: 0,
    ecoPointsReward: 350,
    maxVolunteers: 40,
    registeredVolunteersCount: 38,
    equipmentProvided: [
      'ESD anti-static safety mats',
      'Electronic precision toolsets & multimeters',
      'Certified e-waste containment drums'
    ],
    isJoined: false
  },
  {
    id: 'event-04',
    title: 'Tema Heavy Industrial Green Buffer Tree Planting',
    description: 'Planting 500 indigenous Acacia and Mahogany saplings to create a protective green carbon-sink buffer around the Tema industrial district.',
    category: 'TREE_PLANTING',
    date: 'Saturday, Sep 12, 2026',
    time: '07:30 AM - 12:00 PM GMT',
    location: 'Tema Community 12 Buffer Zone',
    community: 'Tema Industrial Area',
    organizer: 'Accra Circular Plastics & Forestry Commission',
    organizerRole: 'Industrial Partner',
    organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    targetWasteGoalKg: 500,
    currentProgressKg: 0,
    ecoPointsReward: 400,
    maxVolunteers: 120,
    registeredVolunteersCount: 94,
    equipmentProvided: [
      'Digging spades & garden hoes',
      'Organic compost fertilizer sacks',
      'Tree seedling tags & watering cans'
    ],
    isJoined: false
  }
];

export const INITIAL_FORUM_POSTS: CommunityForumPost[] = [
  {
    id: 'post-01',
    title: 'Pro-Tip: How to flatten and pack 100+ pure water sachets into a single compact bag',
    content: 'When collecting pure water (voltic/ice cool) LDPE sachets, don’t just ball them up. After drying, fold them into stacks of 20 and slide them into a 5L oil gallon with the top cut off. You can fit over 150 sachets in one small footprint! When the collection agent arrives, weighing takes less than 15 seconds and gets the maximum cleanliness grade!',
    category: 'TIPS_HACKS',
    authorId: 'usr-afia-eco',
    authorName: 'Afia Serwaa',
    authorRole: 'Zero-Waste Lead',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorBadge: 'Master Sorter 🏆',
    authorLocation: 'East Legon, Accra',
    createdAt: '2026-08-25T08:15:00Z',
    upvotes: 68,
    hasUpvoted: true,
    isPinned: true,
    tags: ['PureWaterSachets', 'SortingTips', 'FastWeighing', 'EcoPoints'],
    reactions: {
      '🌱': 34,
      '💡': 28,
      '🔥': 15,
      '👏': 19,
      '❤️': 12,
      '♻️': 22
    },
    userReactions: ['🌱', '💡'],
    viewsCount: 342,
    commentsCount: 3,
    comments: [
      {
        id: 'comm-01',
        authorId: 'agt-kwame-01',
        authorName: 'Kwame Asante',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        authorRole: 'COLLECTION_AGENT',
        authorBadge: 'Verified Route Agent 🚚',
        content: 'As a collection agent on the Madina & Legon route, I can confirm this saves us so much time! Bins sorted this way always get the instant +20% bonus points for clean presentation.',
        createdAt: '2026-08-25T09:30:00Z',
        upvotes: 24,
        hasUpvoted: true,
        isVerifiedSolution: true,
        reactions: { '👏': 14, '🌱': 10 },
        userReactions: ['👏'],
        replies: [
          {
            id: 'comm-01-reply-01',
            authorId: 'usr-afia-eco',
            authorName: 'Afia Serwaa',
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            authorRole: 'Zero-Waste Lead',
            authorBadge: 'Master Sorter 🏆',
            content: '@Kwame Asante Thanks Kwame! Appreciate all the route agents keeping our neighborhoods spotless.',
            createdAt: '2026-08-25T10:15:00Z',
            upvotes: 8,
            reactions: { '❤️': 6 },
            parentId: 'comm-01'
          }
        ]
      },
      {
        id: 'comm-02',
        authorId: 'usr-bright-01',
        authorName: 'Bright Mensah',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        authorRole: 'USER',
        authorBadge: 'Eco Pioneer 🌿',
        content: 'Tried this yesterday with 80 sachets in Legon hall. Worked like a charm! Cut down my sorting time by half.',
        createdAt: '2026-08-25T11:45:00Z',
        upvotes: 9,
        reactions: { '🔥': 5, '💡': 3 }
      }
    ]
  },
  {
    id: 'post-02',
    title: 'Upcycling Project: Turning HDPE bottle caps into terrazzo-style coasters and tile tops',
    content: 'We set up a small silicone mold and heat-press station in our maker space in Jamestown. By mixing red Coca-Cola caps, green Sprite caps, and white milk caps at 180°C, we produced waterproof marble-pattern coasters. No toxic fumes when heated under controlled temp with proper ventilation. Sharing the exact mold dimensions below for anyone who wants to try!',
    category: 'UPCYCLING_DIY',
    authorId: 'usr-naa-01',
    authorName: 'Naa Lamiley',
    authorRole: 'Circular Maker',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    authorBadge: 'Maker Pioneer 🎨',
    authorLocation: 'Jamestown, Accra',
    createdAt: '2026-08-24T14:20:00Z',
    upvotes: 94,
    hasUpvoted: false,
    tags: ['HDPE', 'Upcycling', 'MakerCommunity', 'JamestownArt'],
    reactions: {
      '🌱': 45,
      '🎨': 38,
      '🔥': 26,
      '👏': 31,
      '❤️': 29,
      '♻️': 40
    },
    userReactions: ['♻️'],
    viewsCount: 512,
    commentsCount: 2,
    comments: [
      {
        id: 'comm-03',
        authorId: 'usr-kofi-garden',
        authorName: 'Kofi Boaten',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        authorRole: 'USER',
        authorBadge: 'Soil Guardian 🪴',
        content: 'Would love to buy 4 of these or swap for our Bokashi compost tea! Can you list them in the Swap Spot tab?',
        createdAt: '2026-08-24T16:00:00Z',
        upvotes: 12,
        reactions: { '💡': 4, '👏': 5 }
      }
    ]
  },
  {
    id: 'post-03',
    title: 'EPA Ghana Carbon Credit Verification: What does 1.6kg CO2 per kg PET actually mean?',
    content: 'A lot of new community members ask why recycling 1kg of plastic bottles saves 1.6kg of CO2. When you recycle PET, you prevent virgin crude oil extraction, thermal polymerization, and open-air burning (which produces toxic methane and black carbon). Every kg you log on EcoSort has an auditable carbon ledger backed by ISO 14064 standards.',
    category: 'POLICY_EPA',
    authorId: 'usr-dr-arhin',
    authorName: 'Dr. Joseph Arhin',
    authorRole: 'ADMIN',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    authorBadge: 'EPA Officer 🛡️',
    authorLocation: 'Ministries District, Accra',
    createdAt: '2026-08-23T10:00:00Z',
    upvotes: 112,
    hasUpvoted: true,
    tags: ['CarbonOffset', 'EPAGhana', 'Science', 'IPCCStandards'],
    reactions: {
      '🌱': 62,
      '💡': 54,
      '👏': 41,
      '❤️': 25,
      '♻️': 38
    },
    userReactions: ['💡', '👏'],
    viewsCount: 780,
    commentsCount: 2,
    comments: [
      {
        id: 'comm-04',
        authorId: 'usr-bright-01',
        authorName: 'Bright Mensah',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        authorRole: 'USER',
        authorBadge: 'Eco Pioneer 🌿',
        content: 'This transparency is what makes EcoSort so special. Great to see the direct calculation referenced to Ghana EPA and IPCC baselines!',
        createdAt: '2026-08-23T11:15:00Z',
        upvotes: 18,
        hasUpvoted: true,
        reactions: { '👏': 12, '💡': 8 }
      }
    ]
  }
];

export const INITIAL_DISTRICT_QUESTS: DistrictCollectiveQuest[] = [
  {
    id: 'quest-accra-coastal',
    districtName: 'Greater Accra Metropolitan',
    region: 'Greater Accra',
    questTitle: 'Coastal Plastic & Sachet Elimination Sprint',
    description: 'Unified campaign across Osu, La, Jamestown, and Dansoman to divert 15 Tons of coastal plastics from the Gulf of Guinea into licensed circular pelletizers.',
    targetCategory: 'PLASTIC (PET & LDPE)',
    goalKg: 15000,
    currentKg: 11840,
    activeParticipants: 432,
    co2DivertedKg: 18944,
    daysRemaining: 6,
    leadCoordinator: 'Emmanuel Kwarteng (Osu Hub)',
    badgeIcon: '🌊',
    status: 'ACTIVE'
  },
  {
    id: 'quest-ashanti-agro',
    districtName: 'Kumasi Metropolitan District',
    region: 'Ashanti',
    questTitle: 'Kejetia Market Circular Bio & Scrap Quest',
    description: 'Empowering central Ashanti market vendors and schools to redirect organic bio-waste and aluminum scrap away from the Dompoase landfill.',
    targetCategory: 'ORGANIC & ALUMINUM',
    goalKg: 8000,
    currentKg: 6420,
    activeParticipants: 285,
    co2DivertedKg: 10272,
    daysRemaining: 12,
    leadCoordinator: 'Mrs. Joyce Darko (Achimota)',
    badgeIcon: '🌾',
    status: 'ACTIVE'
  },
  {
    id: 'quest-western-marine',
    districtName: 'Sekondi-Takoradi Maritime',
    region: 'Western Region',
    questTitle: 'Harbor Net & Industrial Scrap Recovery',
    description: 'Partnering with local artisanal fishers and Tema harbor recyclers to reclaim discarded nylon nets and marine engine scrap metals.',
    targetCategory: 'METAL & RIGID PLASTICS',
    goalKg: 6000,
    currentKg: 3900,
    activeParticipants: 164,
    co2DivertedKg: 6240,
    daysRemaining: 18,
    leadCoordinator: 'Kofi Boakye (Accra Circular)',
    badgeIcon: '⚓',
    status: 'ACTIVE'
  }
];

export const INITIAL_AMBASSADORS: CommunityAmbassador[] = [
  {
    id: 'amb-01',
    name: 'Emmanuel Kwarteng',
    title: 'Osu Beach Guardian & Clean Coast Captain',
    location: 'Osu & La, Accra',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    wasteDivertedKg: 2140,
    swapsCompleted: 28,
    eventsOrganized: 16,
    kudosCount: 142,
    hasCheered: false,
    badges: ['Beach Hero 🌊', '1,000kg Club 🥇', 'Community Pillar 🏛️']
  },
  {
    id: 'amb-02',
    name: 'Afia Serwaa',
    title: 'Zero-Waste Educator & Community Composter',
    location: 'East Legon & Madina',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    wasteDivertedKg: 1450,
    swapsCompleted: 42,
    eventsOrganized: 11,
    kudosCount: 198,
    hasCheered: true,
    badges: ['Master Upcycler 🎨', 'Soil Whisperer 🌱', 'Top Swap Trader 🔄']
  },
  {
    id: 'amb-03',
    name: 'Naa Lamiley',
    title: 'Jamestown Artisan & Plastic Craft Innovator',
    location: 'Jamestown Old Town',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    wasteDivertedKg: 980,
    swapsCompleted: 56,
    eventsOrganized: 8,
    kudosCount: 165,
    hasCheered: false,
    badges: ['Eco-Artisan ✨', 'Youth Mentor 🎓', 'Circular Pioneer ♻️']
  },
  {
    id: 'amb-04',
    name: 'Kofi Boaten',
    title: 'Ashanti Agro-Ecology Leader',
    location: 'Kumasi Kejetia Hub',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    wasteDivertedKg: 1820,
    swapsCompleted: 19,
    eventsOrganized: 14,
    kudosCount: 120,
    hasCheered: false,
    badges: ['Agro Hero 🌾', 'Compost Master 🍂', '2-Ton Achiever 🥈']
  }
];
