/**
 * EcoSort Ghana httpSMS Client Service (https://httpsms.com)
 * 
 * Proxies SMS dispatch requests to the server-side /api/sms endpoints, keeping API keys secure.
 * Automatically handles registration welcomes, MoMo cash-out alerts, voucher redemptions,
 * and smart dust bin deposit notifications.
 */

export interface SmsDispatchResponse {
  success: boolean;
  status: 'DELIVERED' | 'SIMULATED' | 'FAILED';
  gateway: 'HTTPSMS_LIVE' | 'HTTPSMS_SIMULATED';
  messageId?: string;
  recipient?: string;
  content?: string;
  error?: string;
}

export interface ClientSmsRecord {
  id: string;
  to: string;
  from: string;
  content: string;
  type: 'REGISTRATION' | 'TRANSACTION' | 'CASH_OUT' | 'REWARD' | 'DEPOSIT' | 'SYSTEM';
  status: 'DELIVERED' | 'SIMULATED' | 'FAILED' | 'PENDING';
  httpSmsMessageId?: string;
  gateway: 'HTTPSMS_LIVE' | 'HTTPSMS_SIMULATED';
  createdAt: string;
  deliveredAt?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface SmsGatewayStatus {
  isConfigured: boolean;
  provider: string;
  fromNumber: string;
  totalDispatched: number;
  lastMessageAt?: string | null;
}

/**
 * Dispatch an SMS message via server-side httpSMS gateway.
 */
export async function sendSmsViaHttpSms(payload: {
  to: string;
  content: string;
  type?: 'REGISTRATION' | 'TRANSACTION' | 'CASH_OUT' | 'REWARD' | 'DEPOSIT' | 'SYSTEM';
  metadata?: Record<string, any>;
}): Promise<SmsDispatchResponse> {
  if (!payload.to || !payload.to.trim()) {
    return {
      success: false,
      status: 'FAILED',
      gateway: 'HTTPSMS_SIMULATED',
      error: 'Recipient phone number is missing'
    };
  }

  try {
    const response = await fetch('/api/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.warn('[httpSMS Client Error] Could not reach SMS endpoint:', err);
    return {
      success: false,
      status: 'FAILED',
      gateway: 'HTTPSMS_SIMULATED',
      error: err?.message || 'Network error dispatching SMS'
    };
  }
}

/**
 * Sends a welcome SMS message to a newly registered Ghanaian user.
 */
export async function sendRegistrationWelcomeSms(params: {
  name: string;
  phone: string;
  userId?: string;
  ecoPoints?: number;
  entityType?: string;
  location?: string;
}): Promise<SmsDispatchResponse> {
  const points = params.ecoPoints ?? 50;
  const content = `Akwaaba to EcoSort Ghana, ${params.name}! 🇬🇭 Your account (${params.userId || 'GH-USER'}) is active with +${points} Welcome EcoPoints. Recycle smartly, save CO2, and earn instant MoMo cash payouts!`;

  return sendSmsViaHttpSms({
    to: params.phone,
    content,
    type: 'REGISTRATION',
    metadata: {
      userName: params.name,
      userId: params.userId,
      entityType: params.entityType,
      location: params.location,
      trigger: 'USER_REGISTRATION'
    }
  });
}

/**
 * Sends a transaction SMS alert when a user requests a MoMo cash withdrawal.
 */
export async function sendCashOutTransactionSms(params: {
  recipientPhone: string;
  accountHolderName: string;
  network: string;
  amountGhs: number;
  pointsConverted: number;
  remainingPoints: number;
  txRef: string;
}): Promise<SmsDispatchResponse> {
  const content = `EcoSort Ghana Alert: MoMo cash-out of GH₵${params.amountGhs.toFixed(2)} to ${params.network} (${params.recipientPhone}) was successfully sent. Ref: ${params.txRef}. Remaining balance: ${params.remainingPoints} EcoPoints. Clean Ghana, Earn Daily!`;

  return sendSmsViaHttpSms({
    to: params.recipientPhone,
    content,
    type: 'CASH_OUT',
    metadata: {
      accountHolderName: params.accountHolderName,
      network: params.network,
      amountGhs: params.amountGhs,
      pointsConverted: params.pointsConverted,
      remainingPoints: params.remainingPoints,
      txRef: params.txRef,
      trigger: 'MOMO_CASH_WITHDRAWAL'
    }
  });
}

/**
 * Sends a transaction SMS alert when a user redeems a voucher or reward.
 */
export async function sendRewardRedemptionSms(params: {
  phone: string;
  userName: string;
  rewardTitle: string;
  redemptionCode: string;
  pointsSpent: number;
  remainingPoints: number;
}): Promise<SmsDispatchResponse> {
  const content = `EcoSort Ghana: Voucher redeemed! "${params.rewardTitle}". Voucher Code: ${params.redemptionCode}. Points used: ${params.pointsSpent}. New balance: ${params.remainingPoints} EcoPoints. Thank you for sorting!`;

  return sendSmsViaHttpSms({
    to: params.phone,
    content,
    type: 'REWARD',
    metadata: {
      userName: params.userName,
      rewardTitle: params.rewardTitle,
      redemptionCode: params.redemptionCode,
      pointsSpent: params.pointsSpent,
      remainingPoints: params.remainingPoints,
      trigger: 'REWARD_REDEMPTION'
    }
  });
}

/**
 * Sends a transaction SMS alert when a user deposits recyclable waste at a smart bin.
 */
export async function sendSmartBinDepositSms(params: {
  phone: string;
  userName: string;
  binName: string;
  category: string;
  weightKg: number;
  pointsAwarded: number;
  remainingPoints: number;
}): Promise<SmsDispatchResponse> {
  const content = `EcoSort Ghana: Smart Bin Deposit Confirmed! +${params.pointsAwarded} EcoPoints earned from ${params.binName} (${params.weightKg}kg ${params.category}). Current balance: ${params.remainingPoints} EcoPoints.`;

  return sendSmsViaHttpSms({
    to: params.phone,
    content,
    type: 'DEPOSIT',
    metadata: {
      userName: params.userName,
      binName: params.binName,
      category: params.category,
      weightKg: params.weightKg,
      pointsAwarded: params.pointsAwarded,
      remainingPoints: params.remainingPoints,
      trigger: 'SMART_BIN_DEPOSIT'
    }
  });
}

/**
 * Fetches the current live status of the httpSMS gateway.
 */
export async function fetchSmsGatewayStatus(): Promise<SmsGatewayStatus | null> {
  try {
    const res = await fetch('/api/sms/status');
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

/**
 * Fetches the audit log of all SMS messages sent.
 */
export async function fetchSmsLogs(): Promise<ClientSmsRecord[]> {
  try {
    const res = await fetch('/api/sms/logs');
    if (!res.ok) return [];
    const data = await res.json();
    return data.logs || [];
  } catch {
    return [];
  }
}
