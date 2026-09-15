export type SwapCategory = 
  | 'UPCYCLED' 
  | 'UPCYCLED_CRAFT'
  | 'REUSABLE' 
  | 'GARDEN_COMPOST' 
  | 'TOOLS_REPAIR' 
  | 'RAW_MATERIAL' 
  | 'BOOKS_EDUCATION' 
  | 'OTHER';

export type SwapItemCategory = SwapCategory;

export type ItemCondition = 
  | 'NEW' 
  | 'LIKE_NEW' 
  | 'GENTLY_USED' 
  | 'GOOD'
  | 'FAIR'
  | 'UPCYCLED_HANDMADE' 
  | 'UPCYCLED_ART'
  | 'RAW_SORTED';

export type TradeType = 
  | 'FREE_SWAP' 
  | 'FREE_GIFT'
  | 'POINTS' 
  | 'BARTER'
  | 'BARTER_ITEM' 
  | 'POINTS_OR_BARTER';

export type SwapTradeType = TradeType;

export type CommunityEventType = 
  | 'BEACH_CLEANUP' 
  | 'NEIGHBORHOOD_SWEEP' 
  | 'TREE_PLANTING' 
  | 'WORKSHOP' 
  | 'E_WASTE_DRIVE';

export type ForumPostCategory = 
  | 'TIPS_HACKS' 
  | 'TIPS_AND_HACKS'
  | 'UPCYCLING_DIY' 
  | 'POLICY_EPA' 
  | 'QUESTIONS' 
  | 'LOCAL_INITIATIVE';

export interface CommunitySwapItem {
  id: string;
  title: string;
  description: string;
  category: SwapCategory;
  condition: ItemCondition;
  tradeType: TradeType;
  pointsValue: number;
  pointsPrice?: number;
  estimatedValueGhs: number;
  images: string[];
  imageUrl?: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerTrustScore: number;
  sellerRating?: number;
  sellerBadges?: string[];
  community: string;
  location?: string;
  district?: string;
  status: 'AVAILABLE' | 'PENDING_TRADE' | 'SWAPPED' | 'RESERVED';
  createdAt: string;
  swapPreferences: string;
  barterPreferences?: string[];
  likesCount: number;
  isLiked?: boolean;
  viewCount: number;
}

export interface SwapTradeRequest {
  id: string;
  itemId: string;
  swapItemId?: string;
  itemTitle: string;
  requesterId: string;
  buyerId?: string;
  requesterName: string;
  buyerName?: string;
  requesterAvatar: string;
  sellerId: string;
  sellerName: string;
  offerType: 'POINTS' | 'OFFER_ITEM' | 'FREE_PICKUP';
  tradeType?: string;
  offeredPoints?: number;
  offeredItemTitle?: string;
  message: string;
  meetupLocation: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED';
  createdAt: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  category: 'BEACH_CLEANUP' | 'NEIGHBORHOOD_SWEEP' | 'TREE_PLANTING' | 'WORKSHOP' | 'E_WASTE_DRIVE';
  eventType?: string;
  date: string;
  time: string;
  location: string;
  district?: string;
  community: string;
  organizer: string;
  organizerName?: string;
  organizerRole: string;
  organizerAvatar: string;
  bannerImage: string;
  bannerUrl?: string;
  targetWasteGoalKg: number;
  targetCollectionKg?: number;
  currentProgressKg: number;
  ecoPointsReward: number;
  maxVolunteers: number;
  registeredVolunteersCount: number;
  equipmentProvided: string[];
  availableRoles?: string[];
  isJoined?: boolean;
  selectedRole?: string;
}

export type ForumReactionEmoji = '🌱' | '💡' | '🔥' | '👏' | '❤️' | '♻️';

export interface ReactionSummary {
  emoji: string;
  label: string;
  count: number;
  hasReacted: boolean;
}

export interface ForumComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  authorBadge?: string;
  content: string;
  createdAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
  isVerifiedSolution?: boolean;
  isPinned?: boolean;
  parentId?: string;
  replies?: ForumComment[];
  reactions?: Record<string, number>;
  userReactions?: string[];
}

export interface CommunityForumPost {
  id: string;
  title: string;
  content: string;
  category: 'TIPS_HACKS' | 'TIPS_AND_HACKS' | 'UPCYCLING_DIY' | 'POLICY_EPA' | 'QUESTIONS' | 'LOCAL_INITIATIVE';
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorBadge?: string;
  authorLocation?: string;
  createdAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
  isPinned?: boolean;
  tags: string[];
  imageUrls?: string[];
  commentsCount: number;
  comments: ForumComment[];
  reactions?: Record<string, number>;
  userReactions?: string[];
  viewsCount?: number;
  isBookmarked?: boolean;
}

export interface DistrictCollectiveQuest {
  id: string;
  districtName: string;
  region: string;
  questTitle: string;
  title?: string;
  description: string;
  targetCategory: string;
  goalKg: number;
  targetWeightKg?: number;
  currentKg: number;
  currentCollectedKg?: number;
  activeParticipants: number;
  contributorsCount?: number;
  co2DivertedKg: number;
  co2SavedKg?: number;
  daysRemaining: number;
  daysLeft?: number;
  communityPrizePoolPts?: number;
  leadCoordinator: string;
  badgeIcon: string;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface CommunityAmbassador {
  id: string;
  name: string;
  title: string;
  location: string;
  district?: string;
  bio?: string;
  avatar: string;
  wasteDivertedKg: number;
  kgWasteRecycled?: number;
  swapsCompleted: number;
  eventsOrganized: number;
  cleanupsOrganized?: number;
  communityMembersCount?: number;
  kudosCount: number;
  cheersCount?: number;
  hasCheered?: boolean;
  badges: string[];
}
