export type ShareCardTheme = 'EMERALD_GHANA' | 'KENTE_GOLD' | 'CYBER_DARK' | 'COASTAL_BLUE';
export type ShareCardFormat = 'POST_SQUARE' | 'STORY_PORTRAIT' | 'LANDSCAPE_BANNER';

export interface ShareImpactStats {
  userName: string;
  avatarUrl?: string;
  rankTitle: string;
  community: string;
  totalWasteKg: number;
  ecoPoints: number;
  momoGhs: number;
  co2OffsetKg: number;
  treesEquivalent: number;
  verifiedCollections: number;
  plasticBottlesCount: number;
  waterSavedLiters: number;
  energySavedKwh: number;
  streakDays: number;
  accuracyScore: number;
  verificationBadge: string;
  timeframe: string;
}

export interface ShareChannelOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}
