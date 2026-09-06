export type SwapCategory = 
  | 'UPCYCLED' 
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
  | 'UPCYCLED_HANDMADE' 
  | 'RAW_SORTED';

export type TradeType = 
  | 'FREE_SWAP' 
  | 'POINTS' 
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
  estimatedValueGhs: number;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerTrustScore: number;
  community: string;
  status: 'AVAILABLE' | 'PENDING_TRADE' | 'SWAPPED' | 'RESERVED';
  createdAt: string;
  swapPreferences: string;
  likesCount: number;
  isLiked?: boolean;
  viewCount: number;
}

export interface SwapTradeRequest {
  id: string;
  itemId: string;
  itemTitle: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  sellerId: string;
  sellerName: string;
  offerType: 'POINTS' | 'OFFER_ITEM' | 'FREE_PICKUP';
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
  date: string;
  time: string;
  location: string;
  community: string;
  organizer: string;
  organizerRole: string;
  organizerAvatar: string;
  bannerImage: string;
  targetWasteGoalKg: number;
  currentProgressKg: number;
  ecoPointsReward: number;
  maxVolunteers: number;
  registeredVolunteersCount: number;
  equipmentProvided: string[];
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
  category: 'TIPS_HACKS' | 'UPCYCLING_DIY' | 'POLICY_EPA' | 'QUESTIONS' | 'LOCAL_INITIATIVE';
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorBadge: string;
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
  description: string;
  targetCategory: string;
  goalKg: number;
  currentKg: number;
  activeParticipants: number;
  co2DivertedKg: number;
  daysRemaining: number;
  leadCoordinator: string;
  badgeIcon: string;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface CommunityAmbassador {
  id: string;
  name: string;
  title: string;
  location: string;
  avatar: string;
  wasteDivertedKg: number;
  swapsCompleted: number;
  eventsOrganized: number;
  kudosCount: number;
  hasCheered?: boolean;
  badges: string[];
}
