import { AppView } from '../context/EcoSortContext';

export type PushCategory = 
  | 'HUB_SURGE' 
  | 'COMPETITION_MILESTONE' 
  | 'COMMUNITY_DRIVE' 
  | 'REWARD_BOOST' 
  | 'AGENT_PICKUP'
  | 'DAILY_TIP'
  | 'BIN_CAPACITY_ALERT';

export interface SimulatedPushAlert {
  id: string;
  category: PushCategory;
  title: string;
  body: string;
  timestamp: string;
  timestampMs: number;
  read?: boolean;
  claimed?: boolean;
  
  // Specific data for Hub Surges
  hubId?: string;
  hubName?: string;
  hubLocation?: string;
  surgeCapacityPercent?: number;
  bonusEcoPointsPercent?: number;

  // Specific data for Competition Milestones & Daily Tips
  competitionTitle?: string;
  milestoneAchieved?: string;
  bonusPointsReward?: number;
  leadingCampus?: string;
  tipId?: string;

  // Navigation and Action targets
  actionLabel?: string;
  actionTargetView?: AppView;
  actionTab?: 'NEARBY_MAP' | 'WEEKLY_SUMMARY' | 'OVERVIEW';
  actionData?: Record<string, any>;
  iconType?: 'surge' | 'trophy' | 'flame' | 'truck' | 'sparkle' | 'gift' | 'lightbulb';
}

export interface PushNotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  nativeBrowserPush: boolean;
  autoIntervalSeconds: number; // 0 = disabled (manual only), 180, 300, 600 (10 mins default), 900
  hubSurgeAlerts: boolean;
  competitionMilestoneAlerts: boolean;
  bonusRewardAlerts: boolean;
  agentPickupAlerts: boolean;
  dailyTipAlerts?: boolean;
  adminBinCapacityAlerts?: boolean; // Push alert when smart bin reaches 90% capacity
  adminBinCapacityThreshold?: number; // Default 90 (%)
}
