import { WasteCategory } from './index';

export type LedColorName = 'GREEN' | 'AMBER' | 'RED' | 'BLUE' | 'PURPLE' | 'RAINBOW' | 'CYAN';

export type LedPattern = 
  | 'STEADY' 
  | 'PULSE' 
  | 'RAPID_BLINK' 
  | 'CHASE' 
  | 'BREATHING' 
  | 'STROBE'
  | 'RAINBOW_SWIRL';

export type LedMode = 
  | 'IDLE_READY' 
  | 'SCANNING' 
  | 'ACCEPTED_RECYCLABLE'
  | 'ITEM_ACCEPTED'
  | 'REJECTED_CONTAMINANT'
  | 'CONTAMINANT_ALERT'
  | 'NEAR_CAPACITY'
  | 'BIN_FULL' 
  | 'RAINBOW_REWARD' 
  | 'OFFLINE' 
  | 'MANUAL_TEST'
  | 'COLLECTION_IN_PROGRESS';

export interface SmartBinLedIndicator {
  mode: LedMode;
  colorHex: string;
  colorName: LedColorName;
  pattern: LedPattern;
  brightness: number; // 0 - 100
  statusMessage: string;
  ledRingHex: string[]; // 12-16 NeoPixel pixel colors for live visual rendering
  autoRulesEnabled: boolean;
}

export interface SmartBinChamber {
  id: string;
  name: string;
  category: WasteCategory;
  colorCode: string;
  fillLevel: number; // 0 - 100%
  currentWeightKg: number;
  capacityKg: number;
  lidServoAngle: number; // 0 (closed) - 90 (open)
  sensorStatus: 'OK' | 'WARNING' | 'FAULT';
  acceptedMaterials: string[];
}

export interface SmartBinDepositEvent {
  id: string;
  binId: string;
  binName: string;
  userId: string;
  userName: string;
  timestamp: string;
  itemName: string;
  category: WasteCategory;
  material: string;
  weightKg: number;
  pointsAwarded: number;
  co2SavedKg: number;
  ledColorTriggered: LedColorName;
  status: 'ACCEPTED' | 'REJECTED' | 'FLAGGED';
  chamberId?: string;
  imageUrl?: string;
  rejectionReason?: string;
}

export interface SmartDustBin {
  id: string;
  name: string;
  model: string;
  location: string;
  district: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'FULL' | 'LID_JAMMED';
  overallFillLevel: number; // 0 - 100%
  totalWeightKg: number;
  maxCapacityKg: number;
  batteryLevel: number; // 0 - 100%
  isSolarPowered: boolean;
  isSolarCharging: boolean;
  solarWattsGenerated?: number;
  signalRssi: number; // dBm e.g. -62 dBm
  wifiSsid: string;
  ipAddress: string;
  apiKey: string;
  firmwareVersion: string;
  hardwareMcu: 'ESP32-S3' | 'Arduino-GIGA' | 'Raspberry-Pi-Pico-W' | 'STM32-IoT' | 'ESP8266';
  ledIndicator: SmartBinLedIndicator;
  chambers: SmartBinChamber[];
  recentDeposits: SmartBinDepositEvent[];
  totalDeposits: number;
  totalPointsRewarded: number;
  lastSyncTimestamp: string;
  collectionDispatched: boolean;
  notes?: string;
  qrCodeToken?: string;
  ultrasonicDistanceCm?: number;
  temperatureCelsius?: number;
}

export interface SmartBinTelemetryPayload {
  binId: string;
  apiKey: string;
  ultrasonicDistanceCm: number;
  weightKg: number;
  batteryPct: number;
  solarWatts?: number;
  temperatureC?: number;
  humidityPct?: number;
  lidStatus?: 'OPEN' | 'CLOSED';
}

export interface SmartBinDepositPayload {
  binId: string;
  apiKey: string;
  userId?: string;
  userName?: string;
  itemName?: string;
  category?: WasteCategory;
  material?: string;
  weightKg?: number;
  imageUrl?: string;
  barcode?: string;
  rfidCardUid?: string;
}

export interface SmartBinDepositResponse {
  success: boolean;
  pointsAwarded: number;
  newBalance: number;
  category: WasteCategory;
  ledColor: LedColorName;
  ledPattern: LedPattern;
  ledHex: string;
  servoCommand: 'OPEN_LID' | 'CLOSE_LID' | 'ROTATE_CHAMBER_PLASTIC' | 'ROTATE_CHAMBER_METAL' | 'LOCK_FULL';
  audioFeedback: 'SUCCESS_CHIME' | 'REJECT_BUZZER' | 'FULL_ALARM';
  message: string;
  depositId: string;
}

export type SmartBinMaintenanceAction = 
  | 'UNDER_REPAIR' 
  | 'SERVICED' 
  | 'INSPECTION' 
  | 'PARTS_REPLACED' 
  | 'SENSOR_CALIBRATION'
  | 'DECONTAMINATION';

export interface SmartBinMaintenanceLog {
  id: string;
  binId: string;
  binName: string;
  binLocation: string;
  action: SmartBinMaintenanceAction;
  previousStatus: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'FULL' | 'LID_JAMMED';
  newStatus: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'FULL' | 'LID_JAMMED';
  timestamp: string;
  timestampMs: number;
  performedBy: string;
  technicianName?: string;
  issueDescription?: string;
  resolutionNotes?: string;
  componentsServiced?: string[];
  costGhs?: number;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
