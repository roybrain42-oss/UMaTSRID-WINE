export type BiometricAuthType = 'FACE_ID' | 'FINGERPRINT' | 'PASSKEY' | 'SECURITY_KEY' | 'GENERIC_BIOMETRIC';

export type BiometricActionType = 'LOGIN' | 'MOMO_TRANSFER' | 'PROFILE_SECURITY' | 'VERIFY_IDENTITY' | 'TEST_PROMPT';

export interface BiometricCredentialRecord {
  id: string; // Base64URL credential ID
  rawId?: string;
  userId: string;
  userEmail: string;
  userName: string;
  deviceName: string;
  biometricType: BiometricAuthType;
  authenticatorAttachment: 'platform' | 'cross-platform';
  createdAt: string;
  lastUsedAt: string;
  counter: number;
  publicKey?: string;
  aaguid?: string;
  backedUp?: boolean;
}

export interface BiometricDeviceCapability {
  isWebAuthnSupported: boolean;
  isPlatformAuthenticatorAvailable: boolean;
  isConditionalMediationAvailable: boolean;
  biometricTypeLabel: string;
  biometricIconName: 'Fingerprint' | 'ScanFace' | 'Key' | 'ShieldCheck';
  platformName: string;
  securityChipLevel: string; // e.g. "Apple Secure Enclave", "Android StrongBox / TEE", "Windows Hello TPM 2.0"
}

export interface BiometricAuthResult {
  success: boolean;
  message: string;
  credentialId?: string;
  verifiedAt?: string;
  biometricType?: BiometricAuthType;
  authRef?: string;
  errorType?: 'USER_CANCELLED' | 'NOT_SUPPORTED' | 'NOT_ALLOWED' | 'INVALID_CREDENTIAL' | 'UNKNOWN' | 'TIMEOUT';
}

export interface BiometricPromptOptions {
  title?: string;
  subtitle?: string;
  actionType: BiometricActionType;
  amountGhs?: number;
  recipientPhone?: string;
  network?: 'MTN' | 'Telecel' | 'AT' | 'Other';
  accountHolderName?: string;
  challengePayload?: string;
  allowPinFallback?: boolean;
  onSuccess?: (result: BiometricAuthResult) => void;
  onCancel?: () => void;
}
