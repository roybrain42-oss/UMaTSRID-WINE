import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { classifyWasteImageWithGemini } from './src/server/geminiClassifier';
import { fetchGroundedWeatherForLocation } from './src/server/geminiWeather';
import { sendHttpSmsMessage, getSmsLedger, getHttpSmsGatewayStatus } from './src/server/httpSmsService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// API endpoint for Real-Time Gemini AI Waste Vision Classification
app.post('/api/classify-waste', async (req, res) => {
  try {
    const { image, hint } = req.body || {};
    if (!image) {
      return res.status(400).json({ error: 'Missing image data' });
    }

    const result = await classifyWasteImageWithGemini(image, hint);
    return res.json({ success: !!result, data: result });
  } catch (error: any) {
    console.error('Error in /api/classify-waste:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Classification failed' });
  }
});

// API endpoint for Real-Time Google Search Grounded Weather & Waste Collection Advisor
app.post('/api/weather-grounding', async (req, res) => {
  try {
    const { location, latitude, longitude } = req.body || {};
    const result = await fetchGroundedWeatherForLocation(location || 'Accra, Ghana', latitude, longitude);
    return res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in /api/weather-grounding:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Weather fetch failed' });
  }
});

// --- httpSMS API Endpoints (https://httpsms.com) ---

// 1. Send SMS message after registration or transaction
app.post('/api/sms/send', async (req, res) => {
  try {
    const { to, content, type, metadata } = req.body || {};
    if (!to || !content) {
      return res.status(400).json({ success: false, error: 'Missing "to" (phone number) or "content" (message body).' });
    }

    const result = await sendHttpSmsMessage({
      to,
      content,
      type: type || 'SYSTEM',
      metadata
    });

    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/sms/send:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Failed to dispatch SMS' });
  }
});

// 2. Query httpSMS Gateway Status
app.get('/api/sms/status', (req, res) => {
  const status = getHttpSmsGatewayStatus();
  return res.json({ success: true, ...status });
});

// 3. Query httpSMS Dispatched Messages Ledger
app.get('/api/sms/logs', (req, res) => {
  const logs = getSmsLedger();
  return res.json({ success: true, logs });
});

// --- Smart Dust Bin IoT & LED Indicator Telemetry Endpoints ---

// Store runtime in-memory smart bin states on the backend
const runtimeSmartBins: Record<string, any> = {
  'ECO-BIN-ACCRA-01': {
    id: 'ECO-BIN-ACCRA-01',
    name: 'Makola Central Smart EcoBin #01',
    fillLevel: 42,
    weightKg: 18.6,
    led: {
      color: 'GREEN',
      hex: '#10B981',
      pattern: 'BREATHING',
      message: '🟢 READY: Insert Clean Plastic Bottles or Sachets'
    },
    batteryPct: 94,
    lastSeen: new Date().toISOString()
  },
  'ECO-BIN-UMAT-02': {
    id: 'ECO-BIN-UMAT-02',
    name: 'UMaT SRID Smart Innovation Bin #02',
    fillLevel: 28,
    weightKg: 9.4,
    led: {
      color: 'GREEN',
      hex: '#10B981',
      pattern: 'BREATHING',
      message: '🟢 READY: Multi-Chamber AI Sensor Active'
    },
    batteryPct: 100,
    lastSeen: new Date().toISOString()
  }
};

// 1. Get all connected Smart Bins
app.get('/api/smart-bins', (req, res) => {
  return res.json({ success: true, bins: Object.values(runtimeSmartBins) });
});

// 2. Microcontroller Telemetry heartbeat (Ultrasonic distance, weight, battery)
app.post('/api/smart-bins/:id/telemetry', (req, res) => {
  const { id } = req.params;
  const { ultrasonicDistanceCm, fillLevel, weightKg, batteryPct, temperatureC } = req.body || {};

  const current = runtimeSmartBins[id] || {
    id,
    name: `Smart Bin ${id}`,
    fillLevel: 0,
    weightKg: 0,
    led: { color: 'GREEN', hex: '#10B981', pattern: 'STEADY', message: '🟢 READY' },
    batteryPct: 100,
  };

  const calculatedFill = typeof fillLevel === 'number' ? fillLevel : Math.max(0, Math.min(100, Math.round(100 - (ultrasonicDistanceCm || 30) * 2)));
  const updatedWeight = typeof weightKg === 'number' ? weightKg : current.weightKg;

  // Compute LED state based on capacity rules
  let ledColor = 'GREEN';
  let ledHex = '#10B981';
  let pattern = 'BREATHING';
  let message = '🟢 READY: Insert Recyclable Waste';

  if (calculatedFill >= 90) {
    ledColor = 'RED';
    ledHex = '#EF4444';
    pattern = 'RAPID_BLINK';
    message = '🔴 FULL (90%+): Lid Locked - Collection Agent Dispatched';
  } else if (calculatedFill >= 75) {
    ledColor = 'AMBER';
    ledHex = '#F59E0B';
    pattern = 'PULSE';
    message = `🟡 HIGH CAPACITY (${calculatedFill}%): Near Threshold`;
  }

  const updatedBin = {
    ...current,
    fillLevel: calculatedFill,
    weightKg: updatedWeight,
    batteryPct: batteryPct ?? current.batteryPct,
    temperatureC: temperatureC ?? 28,
    led: { color: ledColor, hex: ledHex, pattern, message },
    lastSeen: new Date().toISOString()
  };

  runtimeSmartBins[id] = updatedBin;

  return res.json({
    success: true,
    binId: id,
    fillLevel: calculatedFill,
    ledCommand: {
      color: ledColor,
      hex: ledHex,
      pattern,
      servoLocked: calculatedFill >= 90
    },
    message: 'Telemetry acknowledged'
  });
});

// 3. Process item deposit from Smart Bin (Barcode, RFID, Optical Sensor, or Manual)
app.post('/api/smart-bins/:id/deposit', async (req, res) => {
  const { id } = req.params;
  const { itemName, category, weightKg, userId, barcode, image } = req.body || {};

  const weight = Math.max(0.05, +(weightKg || 0.25).toFixed(2));
  const isContaminant = category === 'HAZARDOUS' || (itemName && /battery|chemical|toxic|e-waste-broken/i.test(itemName));

  if (isContaminant) {
    return res.json({
      success: false,
      status: 'REJECTED',
      pointsAwarded: 0,
      ledColor: 'RED',
      ledHex: '#EF4444',
      ledPattern: 'RAPID_BLINK',
      servoCommand: 'LOCK_LID',
      audioFeedback: 'REJECT_BUZZER',
      message: '🔴 Contaminant detected! Please remove non-recyclable item.'
    });
  }

  // Calculate points (Plastics/Metals: ~10 pts/kg)
  const points = Math.max(1, Math.round(weight * 10));
  const current = runtimeSmartBins[id] || { id, fillLevel: 40, weightKg: 10 };
  const newFill = Math.min(100, (current.fillLevel || 0) + 2);
  const newWeight = +((current.weightKg || 0) + weight).toFixed(2);

  runtimeSmartBins[id] = {
    ...current,
    fillLevel: newFill,
    weightKg: newWeight,
    lastSeen: new Date().toISOString()
  };

  return res.json({
    success: true,
    status: 'ACCEPTED',
    depositId: `dep-${Date.now()}`,
    pointsAwarded: points,
    newBalanceBonus: points,
    category: category || 'PLASTIC',
    ledColor: 'GREEN',
    ledHex: '#10B981',
    ledPattern: 'CHASE',
    servoCommand: 'OPEN_LID',
    audioFeedback: 'SUCCESS_CHIME',
    message: `🟢 Accepted! +${points} EcoPoints awarded. Lid unlocked.`
  });
});

// 4. Remote LED control command
app.post('/api/smart-bins/:id/led-command', (req, res) => {
  const { id } = req.params;
  const { color, pattern, brightness, message } = req.body || {};

  const colorMap: Record<string, string> = {
    GREEN: '#10B981',
    AMBER: '#F59E0B',
    RED: '#EF4444',
    BLUE: '#3B82F6',
    PURPLE: '#8B5CF6',
    RAINBOW: '#EC4899'
  };

  const selectedColor = color?.toUpperCase() || 'GREEN';
  const hex = colorMap[selectedColor] || '#10B981';

  if (runtimeSmartBins[id]) {
    runtimeSmartBins[id].led = {
      color: selectedColor,
      hex,
      pattern: pattern || 'STEADY',
      brightness: brightness || 100,
      message: message || `LED forced to ${selectedColor}`
    };
  }

  return res.json({
    success: true,
    binId: id,
    appliedLed: {
      color: selectedColor,
      hex,
      pattern: pattern || 'STEADY',
      brightness: brightness || 100
    }
  });
});

// Serve static assets in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`EcoSort Ghana full-stack server running on http://localhost:${PORT}`);
});
