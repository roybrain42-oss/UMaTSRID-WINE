/**
 * httpSMS API Service for EcoSort Ghana (https://httpsms.com)
 * 
 * Provides server-side SMS delivery for user registration and transaction confirmations.
 * Uses process.env.HTTPSMS_API_KEY and process.env.HTTPSMS_FROM_NUMBER.
 * If HTTPSMS_API_KEY is not configured in the environment, provides an audit-logged simulation
 * so users can test immediately while keeping the codebase 100% production-ready for live dispatch.
 */

export interface SmsRecord {
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

// In-memory ledger of dispatched SMS messages for diagnostics & audit tracking
const dispatchedSmsLedger: SmsRecord[] = [];

/**
 * Normalizes phone numbers (especially Ghanaian telco formats) to E.164 format.
 * Examples:
 *   "024 123 4567" -> "+233241234567"
 *   "233541234567" -> "+233541234567"
 *   "+233201234567" -> "+233201234567"
 *   "0559876543" -> "+233559876543"
 */
export function normalizeGhanaPhoneNumber(phone: string): string {
  if (!phone) return '+233240000000';
  
  // Remove spaces, hyphens, parentheses
  const cleaned = phone.replace(/[^\d+]/g, '');

  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  if (cleaned.startsWith('233') && cleaned.length >= 12) {
    return `+${cleaned}`;
  }

  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `+233${cleaned.slice(1)}`;
  }

  if (cleaned.length === 9) {
    return `+233${cleaned}`;
  }

  // Fallback: if already looks international without +, add +
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

/**
 * Sends an SMS message via httpSMS API (https://api.httpsms.com/v1/messages/send).
 */
export async function sendHttpSmsMessage(params: {
  to: string;
  content: string;
  type?: 'REGISTRATION' | 'TRANSACTION' | 'CASH_OUT' | 'REWARD' | 'DEPOSIT' | 'SYSTEM';
  from?: string;
  metadata?: Record<string, any>;
}): Promise<{
  success: boolean;
  status: 'DELIVERED' | 'SIMULATED' | 'FAILED';
  gateway: 'HTTPSMS_LIVE' | 'HTTPSMS_SIMULATED';
  messageId: string;
  recipient: string;
  content: string;
  error?: string;
  record: SmsRecord;
}> {
  const { to, content, type = 'SYSTEM', metadata } = params;
  const formattedTo = normalizeGhanaPhoneNumber(to);
  const recordId = `sms-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const apiKey = process.env.HTTPSMS_API_KEY;
  const fromNumber = params.from || process.env.HTTPSMS_FROM_NUMBER || '+233241002026';

  // Check if live API key is present
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_HTTPSMS_API_KEY') {
    // Graceful audit log simulation mode when key is yet to be set in Settings
    const simulatedRecord: SmsRecord = {
      id: recordId,
      to: formattedTo,
      from: fromNumber,
      content,
      type,
      status: 'SIMULATED',
      gateway: 'HTTPSMS_SIMULATED',
      httpSmsMessageId: `sim-${Date.now()}`,
      createdAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      metadata: {
        ...metadata,
        note: 'Live httpSMS key not yet configured in environment. Message logged in SMS gateway audit ledger.'
      }
    };

    dispatchedSmsLedger.unshift(simulatedRecord);
    // Keep max 200 records in memory
    if (dispatchedSmsLedger.length > 200) dispatchedSmsLedger.pop();

    console.log(`[httpSMS Simulation] Type: ${type} | To: ${formattedTo} | Content: "${content}"`);

    return {
      success: true,
      status: 'SIMULATED',
      gateway: 'HTTPSMS_SIMULATED',
      messageId: simulatedRecord.id,
      recipient: formattedTo,
      content,
      record: simulatedRecord
    };
  }

  // Live call to httpSMS API
  try {
    const payload = {
      content,
      from: fromNumber,
      to: formattedTo
    };

    console.log(`[httpSMS Live Dispatch] Sending to ${formattedTo} via httpSMS API...`);

    const response = await fetch('https://api.httpsms.com/v1/messages/send', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey.trim(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = responseData?.message || responseData?.error || `HTTP ${response.status}: ${response.statusText}`;
      console.error('[httpSMS API Error]', errorMessage);

      const failedRecord: SmsRecord = {
        id: recordId,
        to: formattedTo,
        from: fromNumber,
        content,
        type,
        status: 'FAILED',
        gateway: 'HTTPSMS_LIVE',
        createdAt: new Date().toISOString(),
        error: errorMessage,
        metadata
      };

      dispatchedSmsLedger.unshift(failedRecord);
      if (dispatchedSmsLedger.length > 200) dispatchedSmsLedger.pop();

      return {
        success: false,
        status: 'FAILED',
        gateway: 'HTTPSMS_LIVE',
        messageId: recordId,
        recipient: formattedTo,
        content,
        error: errorMessage,
        record: failedRecord
      };
    }

    const liveMessageId = responseData?.data?.id || responseData?.id || `httpsms-${Date.now()}`;
    const successRecord: SmsRecord = {
      id: recordId,
      to: formattedTo,
      from: fromNumber,
      content,
      type,
      status: 'DELIVERED',
      gateway: 'HTTPSMS_LIVE',
      httpSmsMessageId: liveMessageId,
      createdAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      metadata: {
        ...metadata,
        httpSmsResponse: responseData
      }
    };

    dispatchedSmsLedger.unshift(successRecord);
    if (dispatchedSmsLedger.length > 200) dispatchedSmsLedger.pop();

    console.log(`[httpSMS Success] Message dispatched! ID: ${liveMessageId} to ${formattedTo}`);

    return {
      success: true,
      status: 'DELIVERED',
      gateway: 'HTTPSMS_LIVE',
      messageId: liveMessageId,
      recipient: formattedTo,
      content,
      record: successRecord
    };
  } catch (err: any) {
    console.error('[httpSMS Network Error]', err);
    const errorRecord: SmsRecord = {
      id: recordId,
      to: formattedTo,
      from: fromNumber,
      content,
      type,
      status: 'FAILED',
      gateway: 'HTTPSMS_LIVE',
      createdAt: new Date().toISOString(),
      error: err?.message || 'Network exception calling httpSMS endpoint',
      metadata
    };

    dispatchedSmsLedger.unshift(errorRecord);
    if (dispatchedSmsLedger.length > 200) dispatchedSmsLedger.pop();

    return {
      success: false,
      status: 'FAILED',
      gateway: 'HTTPSMS_LIVE',
      messageId: recordId,
      recipient: formattedTo,
      content,
      error: err?.message || 'Failed to dispatch via httpSMS',
      record: errorRecord
    };
  }
}

/**
 * Returns all logged SMS records for auditing and frontend status views.
 */
export function getSmsLedger(): SmsRecord[] {
  return [...dispatchedSmsLedger];
}

/**
 * Returns current status of httpSMS gateway.
 */
export function getHttpSmsGatewayStatus() {
  const apiKey = process.env.HTTPSMS_API_KEY;
  const isConfigured = !!apiKey && apiKey.trim() !== '' && apiKey !== 'MY_HTTPSMS_API_KEY';
  const fromNumber = process.env.HTTPSMS_FROM_NUMBER || '+233241002026';

  return {
    isConfigured,
    provider: 'httpSMS (httpsms.com)',
    fromNumber,
    totalDispatched: dispatchedSmsLedger.length,
    recentMessages: dispatchedSmsLedger.slice(0, 10),
    lastMessageAt: dispatchedSmsLedger[0]?.createdAt || null
  };
}
