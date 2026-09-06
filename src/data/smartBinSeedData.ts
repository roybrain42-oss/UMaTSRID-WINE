import { SmartDustBin, SmartBinDepositEvent, LedColorName, LedPattern, LedMode } from '../types/smartBin';

export const INITIAL_SMART_BINS: SmartDustBin[] = [
  {
    id: 'ECO-BIN-ACCRA-01',
    name: 'Makola Central Smart EcoBin #01',
    model: 'EcoSort IoT SmartBin Pro V3',
    location: 'Makola Market Main Terminal, Accra',
    district: 'Accra Metropolitan (AMA)',
    coordinates: {
      lat: 5.5492,
      lng: -0.2056
    },
    status: 'ONLINE',
    overallFillLevel: 42,
    totalWeightKg: 18.6,
    maxCapacityKg: 50,
    batteryLevel: 94,
    isSolarPowered: true,
    isSolarCharging: true,
    solarWattsGenerated: 18.5,
    signalRssi: -58,
    wifiSsid: 'EcoSort-Ghana-IoT-Mesh',
    ipAddress: '192.168.1.104',
    apiKey: 'es_live_bin_accra_8f9301da28b7',
    firmwareVersion: 'v3.4.2-ESP32-S3',
    hardwareMcu: 'ESP32-S3',
    ultrasonicDistanceCm: 32,
    temperatureCelsius: 28.4,
    ledIndicator: {
      mode: 'IDLE_READY',
      colorHex: '#10B981', // Green
      colorName: 'GREEN',
      pattern: 'BREATHING',
      brightness: 85,
      statusMessage: '🟢 READY: Insert Clean Plastic Bottles or Sachets',
      ledRingHex: [
        '#10B981', '#10B981', '#10B981', '#10B981',
        '#10B981', '#10B981', '#10B981', '#10B981',
        '#10B981', '#10B981', '#10B981', '#10B981'
      ],
      autoRulesEnabled: true
    },
    chambers: [
      {
        id: 'ch-accra-plastic',
        name: 'Plastics & PET Bottles',
        category: 'PLASTIC',
        colorCode: '#3B82F6',
        fillLevel: 45,
        currentWeightKg: 12.4,
        capacityKg: 30,
        lidServoAngle: 0,
        sensorStatus: 'OK',
        acceptedMaterials: ['PET Bottles', 'HDPE Gallons', 'LDPE Pure Water Sachets']
      },
      {
        id: 'ch-accra-metal',
        name: 'Beverage Cans & Metals',
        category: 'METAL',
        colorCode: '#F59E0B',
        fillLevel: 36,
        currentWeightKg: 6.2,
        capacityKg: 20,
        lidServoAngle: 0,
        sensorStatus: 'OK',
        acceptedMaterials: ['Aluminum Drink Cans', 'Tin Cans']
      }
    ],
    recentDeposits: [
      {
        id: 'dep-accra-101',
        binId: 'ECO-BIN-ACCRA-01',
        binName: 'Makola Central Smart EcoBin #01',
        userId: 'u_user_01',
        userName: 'Kwame Mensah',
        timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
        itemName: 'Voltic 1.5L PET Mineral Water Bottle',
        category: 'PLASTIC',
        material: 'PET Plastic',
        weightKg: 0.18,
        pointsAwarded: 2,
        co2SavedKg: 0.29,
        ledColorTriggered: 'GREEN',
        status: 'ACCEPTED',
        chamberId: 'ch-accra-plastic',
        imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'dep-accra-102',
        binId: 'ECO-BIN-ACCRA-01',
        binName: 'Makola Central Smart EcoBin #01',
        userId: 'u_user_03',
        userName: 'Abena Osei',
        timestamp: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
        itemName: 'Awake Mineral Water Sachet Bundle (20 pcs)',
        category: 'PLASTIC',
        material: 'LDPE Sachet',
        weightKg: 0.65,
        pointsAwarded: 7,
        co2SavedKg: 1.04,
        ledColorTriggered: 'GREEN',
        status: 'ACCEPTED',
        chamberId: 'ch-accra-plastic',
        imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=400&q=80'
      }
    ],
    totalDeposits: 384,
    totalPointsRewarded: 3420,
    lastSyncTimestamp: new Date().toISOString(),
    collectionDispatched: false,
    notes: 'Equipped with dual HC-SR04 ultrasonic range sensors, HX711 strain load cells, and 12-LED WS2812B NeoPixel ring.'
  },
  {
    id: 'ECO-BIN-UMAT-02',
    name: 'UMaT SRID Smart Innovation Bin #02',
    model: 'EcoSort IoT SmartBin AI-Edge',
    location: 'UMaT SRID Campus Quad, Tarkwa / Accra',
    district: 'Tarkwa-Nsuaem / SRID Zone',
    coordinates: {
      lat: 5.3021,
      lng: -1.9934
    },
    status: 'ONLINE',
    overallFillLevel: 28,
    totalWeightKg: 9.4,
    maxCapacityKg: 45,
    batteryLevel: 100,
    isSolarPowered: true,
    isSolarCharging: true,
    solarWattsGenerated: 24.0,
    signalRssi: -52,
    wifiSsid: 'UMaT-Campus-WiFi',
    ipAddress: '192.168.10.82',
    apiKey: 'es_live_bin_umat_441c9a17e0b2',
    firmwareVersion: 'v3.4.2-ESP32-S3',
    hardwareMcu: 'ESP32-S3',
    ultrasonicDistanceCm: 48,
    temperatureCelsius: 26.8,
    ledIndicator: {
      mode: 'IDLE_READY',
      colorHex: '#10B981', // Green
      colorName: 'GREEN',
      pattern: 'BREATHING',
      brightness: 90,
      statusMessage: '🟢 READY: Multi-Chamber AI Sensor Active',
      ledRingHex: [
        '#10B981', '#10B981', '#10B981', '#10B981',
        '#10B981', '#10B981', '#10B981', '#10B981',
        '#10B981', '#10B981', '#10B981', '#10B981'
      ],
      autoRulesEnabled: true
    },
    chambers: [
      {
        id: 'ch-umat-plastic',
        name: 'Plastics & Polymers',
        category: 'PLASTIC',
        colorCode: '#3B82F6',
        fillLevel: 25,
        currentWeightKg: 5.1,
        capacityKg: 25,
        lidServoAngle: 0,
        sensorStatus: 'OK',
        acceptedMaterials: ['PET Bottles', 'Beverage Cups', 'Lab Plasticware']
      },
      {
        id: 'ch-umat-paper',
        name: 'Paper & Clean Cardboard',
        category: 'PAPER',
        colorCode: '#10B981',
        fillLevel: 32,
        currentWeightKg: 4.3,
        capacityKg: 20,
        lidServoAngle: 0,
        sensorStatus: 'OK',
        acceptedMaterials: ['Lecture Notes', 'Cardboard Packages', 'A4 Documents']
      }
    ],
    recentDeposits: [
      {
        id: 'dep-umat-201',
        binId: 'ECO-BIN-UMAT-02',
        binName: 'UMaT SRID Smart Innovation Bin #02',
        userId: 'u_user_02',
        userName: 'Kofi Boateng',
        timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
        itemName: 'Lecture Handout Scrap Paper Bundle',
        category: 'PAPER',
        material: 'Office Paper',
        weightKg: 1.2,
        pointsAwarded: 6,
        co2SavedKg: 1.32,
        ledColorTriggered: 'GREEN',
        status: 'ACCEPTED',
        chamberId: 'ch-umat-paper'
      }
    ],
    totalDeposits: 215,
    totalPointsRewarded: 2190,
    lastSyncTimestamp: new Date().toISOString(),
    collectionDispatched: false,
    notes: 'UMaT SRID engineering prototype with live telemetry streaming to EPA National Recycler Network.'
  },
  {
    id: 'ECO-BIN-OSU-03',
    name: 'Osu Oxford Street Solar Bin #03',
    model: 'EcoSort IoT SmartBin Solar Urban',
    location: 'Oxford Street Food Strip, Osu, Accra',
    district: 'Korle-Klottey Municipal',
    coordinates: {
      lat: 5.5562,
      lng: -0.1812
    },
    status: 'ONLINE',
    overallFillLevel: 86,
    totalWeightKg: 38.2,
    maxCapacityKg: 45,
    batteryLevel: 82,
    isSolarPowered: true,
    isSolarCharging: false,
    solarWattsGenerated: 4.2,
    signalRssi: -66,
    wifiSsid: 'EcoSort-Cellular-4G-Gateway',
    ipAddress: '10.24.12.91',
    apiKey: 'es_live_bin_osu_99a8b11cf742',
    firmwareVersion: 'v3.4.1-ESP32-S3',
    hardwareMcu: 'ESP32-S3',
    ultrasonicDistanceCm: 8,
    temperatureCelsius: 29.8,
    ledIndicator: {
      mode: 'BIN_FULL',
      colorHex: '#F59E0B', // Amber warning high capacity
      colorName: 'AMBER',
      pattern: 'PULSE',
      brightness: 100,
      statusMessage: '🟡 HIGH CAPACITY (86%): Collection Triggered',
      ledRingHex: [
        '#F59E0B', '#F59E0B', '#F59E0B', '#F59E0B',
        '#F59E0B', '#F59E0B', '#F59E0B', '#F59E0B',
        '#F59E0B', '#F59E0B', '#F59E0B', '#F59E0B'
      ],
      autoRulesEnabled: true
    },
    chambers: [
      {
        id: 'ch-osu-can',
        name: 'Soda & Beverage Cans',
        category: 'METAL',
        colorCode: '#F59E0B',
        fillLevel: 88,
        currentWeightKg: 18.5,
        capacityKg: 20,
        lidServoAngle: 0,
        sensorStatus: 'WARNING',
        acceptedMaterials: ['Soda Cans', 'Malt Cans', 'Energy Drink Cans']
      },
      {
        id: 'ch-osu-plastic',
        name: 'Plastics & Bottles',
        category: 'PLASTIC',
        colorCode: '#3B82F6',
        fillLevel: 84,
        currentWeightKg: 19.7,
        capacityKg: 25,
        lidServoAngle: 0,
        sensorStatus: 'OK',
        acceptedMaterials: ['PET Bottles', 'Plastic Cups']
      }
    ],
    recentDeposits: [
      {
        id: 'dep-osu-301',
        binId: 'ECO-BIN-OSU-03',
        binName: 'Osu Oxford Street Solar Bin #03',
        userId: 'u_user_04',
        userName: 'Esi Frimpong',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        itemName: 'Malta Guinness Aluminum Can 330ml (4 pcs)',
        category: 'METAL',
        material: 'Aluminum Can',
        weightKg: 0.28,
        pointsAwarded: 4,
        co2SavedKg: 0.62,
        ledColorTriggered: 'GREEN',
        status: 'ACCEPTED',
        chamberId: 'ch-osu-can'
      }
    ],
    totalDeposits: 512,
    totalPointsRewarded: 4890,
    lastSyncTimestamp: new Date().toISOString(),
    collectionDispatched: true,
    notes: 'Near capacity. EPA Waste Collection Agent dispatch has been alerted via automated webhook.'
  },
  {
    id: 'ECO-BIN-KUMASI-04',
    name: 'Kejetia Market Mega Smart Hub #04',
    model: 'EcoSort IoT Quad-Chamber V4',
    location: 'Kejetia Central Complex Gate 3, Kumasi',
    district: 'Kumasi Metropolitan (KMA)',
    coordinates: {
      lat: 6.6961,
      lng: -1.6244
    },
    status: 'ONLINE',
    overallFillLevel: 58,
    totalWeightKg: 46.5,
    maxCapacityKg: 80,
    batteryLevel: 91,
    isSolarPowered: true,
    isSolarCharging: true,
    solarWattsGenerated: 32.0,
    signalRssi: -50,
    wifiSsid: 'Kejetia-City-SmartGrid',
    ipAddress: '192.168.20.15',
    apiKey: 'es_live_bin_kumasi_33e198fa011a',
    firmwareVersion: 'v3.4.2-ESP32-S3',
    hardwareMcu: 'ESP32-S3',
    ultrasonicDistanceCm: 22,
    temperatureCelsius: 27.2,
    ledIndicator: {
      mode: 'IDLE_READY',
      colorHex: '#10B981',
      colorName: 'GREEN',
      pattern: 'BREATHING',
      brightness: 90,
      statusMessage: '🟢 READY: 4-Chamber Autonomous Sorting Hub',
      ledRingHex: [
        '#10B981', '#10B981', '#10B981', '#10B981',
        '#10B981', '#10B981', '#10B981', '#10B981',
        '#10B981', '#10B981', '#10B981', '#10B981'
      ],
      autoRulesEnabled: true
    },
    chambers: [
      {
        id: 'ch-kumasi-plastic',
        name: 'Plastics & PET',
        category: 'PLASTIC',
        colorCode: '#3B82F6',
        fillLevel: 62,
        currentWeightKg: 21.0,
        capacityKg: 35,
        lidServoAngle: 0,
        sensorStatus: 'OK',
        acceptedMaterials: ['PET Bottles', 'HDPE Jugs', 'Water Sachets']
      },
      {
        id: 'ch-kumasi-metal',
        name: 'Metals & Cans',
        category: 'METAL',
        colorCode: '#F59E0B',
        fillLevel: 54,
        currentWeightKg: 14.5,
        capacityKg: 25,
        lidServoAngle: 0,
        sensorStatus: 'OK',
        acceptedMaterials: ['Drink Cans', 'Tins', 'Scrap Copper/Brass']
      },
      {
        id: 'ch-kumasi-glass',
        name: 'Glass Bottles',
        category: 'GLASS',
        colorCode: '#06B6D4',
        fillLevel: 42,
        currentWeightKg: 11.0,
        capacityKg: 20,
        lidServoAngle: 0,
        sensorStatus: 'OK',
        acceptedMaterials: ['Club Beer Bottles', 'Soft Drink Bottles']
      }
    ],
    recentDeposits: [],
    totalDeposits: 670,
    totalPointsRewarded: 6240,
    lastSyncTimestamp: new Date().toISOString(),
    collectionDispatched: false,
    notes: 'Ashanti Region high-capacity hub with quad-compartment automated servo gates.'
  }
];

/**
 * Generates an animated array of 12 LED pixel hex colors for the live NeoPixel ring visualizer
 */
export function getLedRingPixels(
  mode: LedMode, 
  colorHex: string, 
  colorName: LedColorName, 
  pattern: LedPattern, 
  stepIndex: number = 0
): string[] {
  const pixelCount = 12;
  const pixels: string[] = [];

  if (mode === 'OFFLINE') {
    return Array(pixelCount).fill('#1E293B'); // Slate dark
  }

  if (colorName === 'RAINBOW' || mode === 'RAINBOW_REWARD' || pattern === 'RAINBOW_SWIRL') {
    const rainbowColors = [
      '#EF4444', '#F97316', '#F59E0B', '#10B981', 
      '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', 
      '#EC4899', '#EF4444', '#F59E0B', '#10B981'
    ];
    for (let i = 0; i < pixelCount; i++) {
      const idx = (i + stepIndex) % rainbowColors.length;
      pixels.push(rainbowColors[idx]);
    }
    return pixels;
  }

  if (pattern === 'CHASE') {
    // 3 bright leading pixels, rest dim
    for (let i = 0; i < pixelCount; i++) {
      const dist = (i - (stepIndex % pixelCount) + pixelCount) % pixelCount;
      if (dist === 0) {
        pixels.push(colorHex);
      } else if (dist === 1) {
        pixels.push(colorHex);
      } else if (dist === 2) {
        pixels.push(colorHex);
      } else {
        pixels.push('#0F172A'); // Off / dark
      }
    }
    return pixels;
  }

  if (pattern === 'RAPID_BLINK' || pattern === 'STROBE') {
    const isOn = stepIndex % 2 === 0;
    return Array(pixelCount).fill(isOn ? colorHex : '#0F172A');
  }

  if (pattern === 'PULSE' || pattern === 'BREATHING') {
    return Array(pixelCount).fill(colorHex);
  }

  // STEADY
  return Array(pixelCount).fill(colorHex);
}

/**
 * Complete ready-to-flash Arduino / ESP32 C++ firmware sketch for connecting the Smart Dust Bin
 */
export function generateArduinoSketch(bin: SmartDustBin, serverOrigin: string): string {
  const hostUrl = serverOrigin || 'https://ais-dev-cnvpyq372ej6iomoqfulrz-380775989396.europe-west2.run.app';

  return `/*
 * =========================================================================
 *  EcoSort Ghana - IoT Smart Dust Bin Firmware (ESP32 / Arduino / C++)
 *  Device: ${bin.name} (${bin.id})
 *  Hardware: ESP32-S3 / ESP8266 + HC-SR04 + WS2812B NeoPixel + SG90 Servo
 * =========================================================================
 *
 * Pin Connections:
 *   - WS2812B RGB LED Data Pin   -> GPIO 13 (12-Pixel Ring / Strip)
 *   - HC-SR04 Ultrasonic TRIG    -> GPIO 5
 *   - HC-SR04 Ultrasonic ECHO    -> GPIO 18
 *   - Servo Motor (Lid / Flap)    -> GPIO 14
 *   - HX711 Load Cell DT/SCK     -> GPIO 21 / GPIO 22
 *   - Status Buzzer              -> GPIO 27
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#include <ESP32Servo.h>

// --- Configuration ---
const char* WIFI_SSID     = "${bin.wifiSsid || 'YOUR_WIFI_SSID'}";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

const char* API_SERVER    = "${hostUrl}";
const char* BIN_ID        = "${bin.id}";
const char* API_KEY       = "${bin.apiKey}";

// --- Hardware Pins ---
#define LED_PIN        13
#define NUM_LEDS       12
#define TRIG_PIN       5
#define ECHO_PIN       18
#define SERVO_PIN      14
#define BUZZER_PIN     27

Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);
Servo lidServo;

// --- State Variables ---
int fillPercentage = ${bin.overallFillLevel};
float currentWeightKg = ${bin.totalWeightKg};
unsigned long lastTelemetryMillis = 0;
const unsigned long TELEMETRY_INTERVAL = 10000; // Send telemetry every 10s

// LED Color definitions
uint32_t COLOR_GREEN  = strip.Color(16, 185, 129);  // Ready / Recyclable
uint32_t COLOR_AMBER  = strip.Color(245, 158, 11);  // Warning / 80%+ Full
uint32_t COLOR_RED    = strip.Color(239, 68, 68);   // Full / Contaminant
uint32_t COLOR_BLUE   = strip.Color(59, 130, 246);  // Scanning / WiFi
uint32_t COLOR_PURPLE = strip.Color(139, 92, 246);  // Points Rewarded

void setLedColorAll(uint32_t color) {
  for(int i = 0; i < NUM_LEDS; i++) {
    strip.setPixelColor(i, color);
  }
  strip.show();
}

void flashLed(uint32_t color, int count, int delayMs) {
  for(int c = 0; c < count; c++) {
    setLedColorAll(color);
    delay(delayMs);
    setLedColorAll(strip.Color(0, 0, 0));
    delay(delayMs);
  }
}

long readUltrasonicDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return 50; // default max distance
  return duration * 0.034 / 2;
}

void setup() {
  Serial.begin(115200);
  strip.begin();
  strip.setBrightness(180);
  setLedColorAll(COLOR_BLUE); // Blue while connecting to WiFi

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  lidServo.attach(SERVO_PIN);
  lidServo.write(0); // Lid closed

  Serial.println("[EcoSort SmartBin] Booting up...");
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\\nWiFi Connected! IP: " + WiFi.localIP().toString());
    setLedColorAll(COLOR_GREEN); // Ready state
  } else {
    Serial.println("\\nWiFi Connection Failed - Operating in Offline Autonomous Mode");
    setLedColorAll(COLOR_AMBER);
  }
}

void sendTelemetry() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String url = String(API_SERVER) + "/api/smart-bins/" + BIN_ID + "/telemetry";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  long dist = readUltrasonicDistanceCm();
  // Example: 50cm = 0% full, 5cm = 100% full
  int calculatedFill = constrain(map(dist, 50, 5, 0, 100), 0, 100);

  StaticJsonDocument<256> doc;
  doc["binId"] = BIN_ID;
  doc["apiKey"] = API_KEY;
  doc["ultrasonicDistanceCm"] = dist;
  doc["fillLevel"] = calculatedFill;
  doc["weightKg"] = currentWeightKg;
  doc["batteryPct"] = 95;

  String requestBody;
  serializeJson(doc, requestBody);

  int httpCode = http.POST(requestBody);
  if (httpCode == 200) {
    String response = http.getString();
    Serial.println("[Telemetry Synced]: " + response);

    // Apply LED indicator color based on fill level
    if (calculatedFill >= 90) {
      setLedColorAll(COLOR_RED); // RED: Bin Full
      tone(BUZZER_PIN, 1000, 200);
    } else if (calculatedFill >= 75) {
      setLedColorAll(COLOR_AMBER); // AMBER: Warning
    } else {
      setLedColorAll(COLOR_GREEN); // GREEN: Ready
    }
  }
  http.end();
}

/**
 * Call this function when an item is deposited into the bin
 */
void handleItemDeposit(String itemName, String category, float weight) {
  if (WiFi.status() != WL_CONNECTED) return;

  // Blue LED while verifying with EcoSort EPA Server
  setLedColorAll(COLOR_BLUE);

  HTTPClient http;
  String url = String(API_SERVER) + "/api/smart-bins/" + BIN_ID + "/deposit";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<256> doc;
  doc["binId"] = BIN_ID;
  doc["apiKey"] = API_KEY;
  doc["itemName"] = itemName;
  doc["category"] = category;
  doc["weightKg"] = weight;

  String payload;
  serializeJson(doc, payload);
  int httpResponse = http.POST(payload);

  if (httpResponse == 200) {
    String res = http.getString();
    Serial.println("[Deposit Accepted]: " + res);

    // Flash Green LED ring & chime buzzer
    flashLed(COLOR_GREEN, 3, 150);
    tone(BUZZER_PIN, 2000, 300);

    // Open servo lid for deposit
    lidServo.write(90);
    delay(2500);
    lidServo.write(0);

    setLedColorAll(COLOR_GREEN);
  } else {
    // Flash Red LED for contaminant
    flashLed(COLOR_RED, 4, 100);
    tone(BUZZER_PIN, 500, 500);
  }
  http.end();
}

void loop() {
  // 1. Check Telemetry Interval
  if (millis() - lastTelemetryMillis >= TELEMETRY_INTERVAL) {
    lastTelemetryMillis = millis();
    sendTelemetry();
  }

  // 2. Local Proximity Check (Simulated Trigger)
  long distance = readUltrasonicDistanceCm();
  if (distance < 10) {
    Serial.println("Object detected close to Smart Bin opening!");
  }

  delay(50);
}
`;
}

export const INITIAL_MAINTENANCE_LOGS = [
  {
    id: 'maint-log-01',
    binId: 'ECO-BIN-ACCRA-01',
    binName: 'Makola Central Smart EcoBin #01',
    binLocation: 'Makola Market Main Terminal, Accra',
    action: 'SERVICED' as const,
    previousStatus: 'MAINTENANCE' as const,
    newStatus: 'ONLINE' as const,
    timestamp: '2026-08-30 14:15',
    timestampMs: Date.now() - (48 * 3600 * 1000),
    performedBy: 'EPA Ghana Lead Tech Kwame Asante',
    technicianName: 'Kwame Asante (EPA Field Engineering)',
    issueDescription: 'Scheduled bi-weekly IoT maintenance and ultrasonic depth sensor calibration.',
    resolutionNotes: 'Cleaned optical lens on HC-SR04 sensor, lubricated SG90 lid servo motor gears, verified solar MPPT regulator output at 18.5W. All NeoPixel ring LEDs verified 100% operational.',
    componentsServiced: ['Ultrasonic Distance Sensor', 'Servo Lid Motor', 'Solar MPPT Charger', 'Chamber Sanitization'],
    costGhs: 45.00,
    severity: 'LOW' as const
  },
  {
    id: 'maint-log-02',
    binId: 'ECO-BIN-KUMASI-03',
    binName: 'Kejetia Market EcoHub #03',
    binLocation: 'Kejetia Terminal Gate 4, Adum, Kumasi',
    action: 'UNDER_REPAIR' as const,
    previousStatus: 'ONLINE' as const,
    newStatus: 'MAINTENANCE' as const,
    timestamp: '2026-08-31 09:40',
    timestampMs: Date.now() - (24 * 3600 * 1000),
    performedBy: 'EPA Regional Inspector Kofi Mensah',
    technicianName: 'Kofi Mensah (KMA Field Tech)',
    issueDescription: 'Lid servo mechanism jammed by oversized commercial HDPE container. Metal chamber flap restricted.',
    resolutionNotes: 'Flagged for mechanical servo arm replacement and chamber barrier alignment. Offline safe lock mode activated with amber flashing beacon.',
    componentsServiced: ['Servo Lid Motor', 'Metal Flap Actuator'],
    costGhs: 120.00,
    severity: 'HIGH' as const
  },
  {
    id: 'maint-log-03',
    binId: 'ECO-BIN-LEGON-02',
    binName: 'East Legon Shiashie Station #02',
    binLocation: 'Shiashie Underpass / Lagos Ave, East Legon',
    action: 'SERVICED' as const,
    previousStatus: 'MAINTENANCE' as const,
    newStatus: 'ONLINE' as const,
    timestamp: '2026-08-28 11:20',
    timestampMs: Date.now() - (96 * 3600 * 1000),
    performedBy: 'System Administrator (EPA Ghana)',
    technicianName: 'Ama Serwaa (IoT Mesh Engineer)',
    issueDescription: 'Firmware upgrade from v3.3.0 to v3.4.2-ESP32-S3 and Wi-Fi mesh signal antenna optimization.',
    resolutionNotes: 'Successfully flashed OTA update. Wi-Fi signal improved from -78 dBm to -55 dBm. Calibrated load cell tare offset to zero.',
    componentsServiced: ['ESP32-S3 MCU Firmware', 'External Dipole Antenna', 'HX711 Load Cell'],
    costGhs: 0.00,
    severity: 'LOW' as const
  },
  {
    id: 'maint-log-04',
    binId: 'ECO-BIN-TEMA-04',
    binName: 'Tema Community 1 Industrial Terminal #04',
    binLocation: 'Tema Heavy Industrial Area, Community 1',
    action: 'SERVICED' as const,
    previousStatus: 'MAINTENANCE' as const,
    newStatus: 'ONLINE' as const,
    timestamp: '2026-08-25 16:50',
    timestampMs: Date.now() - (160 * 3600 * 1000),
    performedBy: 'TMA Maintenance Directorate',
    technicianName: 'Emmanuel Osei (District Technician)',
    issueDescription: 'Dust and marine salt accumulation on photovoltaic panel reducing charging efficiency.',
    resolutionNotes: 'Applied hydrophobic nano-coating on solar glass, replaced 18650 LiFePO4 battery pack cell balance cable. Restored 100% daily charge rate.',
    componentsServiced: ['Monocrystalline Solar Panel', 'LiFePO4 Battery Pack'],
    costGhs: 85.00,
    severity: 'MEDIUM' as const
  }
];
