import React, { useState } from 'react';
import { SmartDustBin } from '../../types/smartBin';
import { generateArduinoSketch } from '../../data/smartBinSeedData';
import { 
  Cpu, 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  Layers, 
  Zap, 
  Download, 
  Globe, 
  ShieldCheck, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface SmartBinHardwareGuideProps {
  bin: SmartDustBin;
}

export const SmartBinHardwareGuide: React.FC<SmartBinHardwareGuideProps> = ({ bin }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'ARDUINO' | 'MICROPYTHON' | 'CURL'>('ARDUINO');
  const [copied, setCopied] = useState<boolean>(false);

  const serverUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-cnvpyq372ej6iomoqfulrz-380775989396.europe-west2.run.app';
  const arduinoSketch = generateArduinoSketch(bin, serverUrl);

  const micropythonScript = `# EcoSort Ghana - MicroPython Smart Dust Bin Client
# Target: Raspberry Pi Pico W / ESP32
import network, urequests, utime, machine, neopixel

WIFI_SSID = "${bin.wifiSsid || 'YOUR_WIFI'}"
WIFI_PASS = "YOUR_PASSWORD"
API_SERVER = "${serverUrl}"
BIN_ID = "${bin.id}"
API_KEY = "${bin.apiKey}"

# Setup NeoPixel on GPIO 13 (12 LEDs)
np = neopixel.NeoPixel(machine.Pin(13), 12)
def set_led(r, g, b):
    for i in range(12): np[i] = (r, g, b)
    np.write()

# Connect WiFi
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(WIFI_SSID, WIFI_PASS)
set_led(0, 0, 150) # Blue while connecting
while not wlan.isconnected():
    utime.sleep(0.5)

print("Connected to EcoSort Network! IP:", wlan.ifconfig()[0])
set_led(0, 150, 50) # Green Ready

# Periodic Telemetry Loop
while True:
    try:
        url = f"{API_SERVER}/api/smart-bins/{BIN_ID}/telemetry"
        payload = {
            "binId": BIN_ID,
            "apiKey": API_KEY,
            "ultrasonicDistanceCm": 25,
            "fillLevel": ${bin.overallFillLevel},
            "weightKg": ${bin.totalWeightKg}
        }
        res = urequests.post(url, json=payload)
        print("Telemetry synced:", res.text)
        res.close()
    except Exception as e:
        print("Sync error:", e)
    utime.sleep(10)
`;

  const curlCommand = `# 1. Send Ultrasonic & Load Cell Telemetry
curl -X POST ${serverUrl}/api/smart-bins/${bin.id}/telemetry \\
  -H "Content-Type: application/json" \\
  -d '{
    "binId": "${bin.id}",
    "apiKey": "${bin.apiKey}",
    "ultrasonicDistanceCm": 28,
    "fillLevel": 45,
    "weightKg": 18.5,
    "batteryPct": 95
  }'

# 2. Process Waste Item Deposit (Auto-Credit & Green LED)
curl -X POST ${serverUrl}/api/smart-bins/${bin.id}/deposit \\
  -H "Content-Type: application/json" \\
  -d '{
    "binId": "${bin.id}",
    "apiKey": "${bin.apiKey}",
    "itemName": "Voltic PET 1.5L Bottle",
    "category": "PLASTIC",
    "weightKg": 0.18
  }'
`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              Hardware Schematics & Wiring Pinout
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Connect any microcontroller (ESP32, ESP8266, Arduino GIGA, Raspberry Pi Pico W) to the EcoSort Ghana platform
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 font-bold">
              API Key: {bin.apiKey.substring(0, 16)}...
            </span>
          </div>
        </div>

        {/* Pinout Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Component / Module</th>
                <th className="py-2.5 px-3">Hardware Part</th>
                <th className="py-2.5 px-3">ESP32 Pinout</th>
                <th className="py-2.5 px-3">Arduino Pinout</th>
                <th className="py-2.5 px-3">Protocol / Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-sans font-bold text-emerald-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  RGB LED Indicator Ring
                </td>
                <td className="py-2.5 px-3">WS2812B NeoPixel 12-Ring</td>
                <td className="py-2.5 px-3 text-amber-300 font-bold">GPIO 13 (DIN)</td>
                <td className="py-2.5 px-3 text-amber-300 font-bold">Pin D6 (PWM)</td>
                <td className="py-2.5 px-3 font-sans text-[11px] text-slate-400">Single-Wire 800kHz RGB Control</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-sans font-bold text-blue-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                  Ultrasonic Range Sensor
                </td>
                <td className="py-2.5 px-3">HC-SR04 / JSN-SR04T (Waterproof)</td>
                <td className="py-2.5 px-3 font-bold text-amber-300">TRIG: GPIO 5, ECHO: GPIO 18</td>
                <td className="py-2.5 px-3 font-bold text-amber-300">TRIG: D9, ECHO: D10</td>
                <td className="py-2.5 px-3 font-sans text-[11px] text-slate-400">Continuous fill depth measurement</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-sans font-bold text-purple-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  Lid Servo Actuator
                </td>
                <td className="py-2.5 px-3">TowerPro SG90 / MG996R (High Torque)</td>
                <td className="py-2.5 px-3 font-bold text-amber-300">GPIO 14 (PWM)</td>
                <td className="py-2.5 px-3 font-bold text-amber-300">Pin D5 (PWM)</td>
                <td className="py-2.5 px-3 font-sans text-[11px] text-slate-400">Automatic lid opening & locking</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-sans font-bold text-amber-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  Load Cell Strain Gauge
                </td>
                <td className="py-2.5 px-3">50kg Load Cell + HX711 ADC</td>
                <td className="py-2.5 px-3 font-bold text-amber-300">DT: GPIO 21, SCK: GPIO 22</td>
                <td className="py-2.5 px-3 font-bold text-amber-300">DT: A1, SCK: A0</td>
                <td className="py-2.5 px-3 font-sans text-[11px] text-slate-400">Precision waste weight in kilograms</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-sans font-bold text-rose-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  Alert Chime Buzzer
                </td>
                <td className="py-2.5 px-3">Passive Piezo Buzzer 5V</td>
                <td className="py-2.5 px-3 font-bold text-amber-300">GPIO 27</td>
                <td className="py-2.5 px-3 font-bold text-amber-300">Pin D8</td>
                <td className="py-2.5 px-3 font-sans text-[11px] text-slate-400">Success tones & contaminant alarms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Firmware Code Generator Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCodeTab('ARDUINO')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeCodeTab === 'ARDUINO'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Arduino C++ (ESP32 Sketch)
            </button>
            <button
              onClick={() => setActiveCodeTab('MICROPYTHON')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeCodeTab === 'MICROPYTHON'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              MicroPython (Raspberry Pi Pico)
            </button>
            <button
              onClick={() => setActiveCodeTab('CURL')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeCodeTab === 'CURL'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              cURL / REST Webhook
            </button>
          </div>

          <button
            onClick={() => {
              const textToCopy = 
                activeCodeTab === 'ARDUINO' ? arduinoSketch :
                activeCodeTab === 'MICROPYTHON' ? micropythonScript : curlCommand;
              handleCopy(textToCopy);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Firmware Code
              </>
            )}
          </button>
        </div>

        {/* Code Content Block */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
          <pre>
            {activeCodeTab === 'ARDUINO' && arduinoSketch}
            {activeCodeTab === 'MICROPYTHON' && micropythonScript}
            {activeCodeTab === 'CURL' && curlCommand}
          </pre>
        </div>
      </div>
    </div>
  );
};
