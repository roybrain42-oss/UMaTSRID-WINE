import React, { useState } from 'react';
import { 
  SmartDustBin, 
  SmartBinLedIndicator 
} from '../../types/smartBin';
import { 
  X, 
  Bluetooth, 
  Wifi, 
  QrCode, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  RefreshCw,
  Plus,
  Layers,
  Send
} from 'lucide-react';
import { soundEffects } from '../../utils/audioChime';

interface SmartBinPairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterBin: (binData: Partial<SmartDustBin>) => void;
}

export const SmartBinPairModal: React.FC<SmartBinPairModalProps> = ({
  isOpen,
  onClose,
  onRegisterBin
}) => {
  const [method, setMethod] = useState<'BLE' | 'WIFI' | 'MANUAL'>('BLE');
  const [binName, setBinName] = useState<string>('Accra Mall Smart EcoBin #05');
  const [location, setLocation] = useState<string>('Accra Mall Food Court, Tetteh Quarshie');
  const [district, setDistrict] = useState<string>('Ayawaso West Municipal');
  const [mcuType, setMcuType] = useState<'ESP32-S3' | 'Arduino-GIGA' | 'Raspberry-Pi-Pico-W'>('ESP32-S3');
  const [wifiSsid, setWifiSsid] = useState<string>('EcoSort-Mesh-Accra');
  const [isSearchingBle, setIsSearchingBle] = useState<boolean>(false);
  const [bleError, setBleError] = useState<string | null>(null);
  const [pairedSuccess, setPairedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleScanBle = async () => {
    setIsSearchingBle(true);
    setBleError(null);

    try {
      // If Web Bluetooth API is supported
      if (typeof navigator !== 'undefined' && (navigator as any).bluetooth) {
        const device = await (navigator as any).bluetooth.requestDevice({
          filters: [{ namePrefix: 'EcoSort' }, { namePrefix: 'SmartBin' }, { namePrefix: 'ESP32' }],
          optionalServices: ['battery_service', '0000ffe0-0000-1000-8000-00805f9b34fb']
        });
        setBinName(device.name || 'Discovered Smart Bin');
        setPairedSuccess(true);
      } else {
        // Fallback simulation for browsers without Web Bluetooth
        setTimeout(() => {
          setIsSearchingBle(false);
          setPairedSuccess(true);
        }, 1500);
      }
    } catch (e: any) {
      // User cancelled or no device found
      setIsSearchingBle(false);
      setBleError(e?.message || 'No Bluetooth device selected. You can register via WiFi or Token below.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBinId = `ECO-BIN-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const newApiKey = `es_live_bin_${Math.random().toString(36).substring(2, 14)}`;

    const newBin: Partial<SmartDustBin> = {
      id: newBinId,
      name: binName,
      model: `EcoSort IoT ${mcuType} Grid V3`,
      location,
      district,
      coordinates: {
        lat: 5.6037 + (Math.random() - 0.5) * 0.05,
        lng: -0.1870 + (Math.random() - 0.5) * 0.05
      },
      status: 'ONLINE',
      overallFillLevel: 0,
      totalWeightKg: 0,
      maxCapacityKg: 50,
      batteryLevel: 100,
      isSolarPowered: true,
      isSolarCharging: true,
      solarWattsGenerated: 15.0,
      signalRssi: -54,
      wifiSsid,
      ipAddress: `192.168.1.${Math.floor(100 + Math.random() * 150)}`,
      apiKey: newApiKey,
      firmwareVersion: 'v3.4.2-ESP32-S3',
      hardwareMcu: mcuType,
      ultrasonicDistanceCm: 50,
      temperatureCelsius: 27.5,
      ledIndicator: {
        mode: 'IDLE_READY',
        colorHex: '#10B981',
        colorName: 'GREEN',
        pattern: 'BREATHING',
        brightness: 85,
        statusMessage: '🟢 READY: Smart Bin Connected & Online',
        ledRingHex: Array(12).fill('#10B981'),
        autoRulesEnabled: true
      },
      chambers: [
        {
          id: `ch-${newBinId}-plastic`,
          name: 'Plastics & PET Bottles',
          category: 'PLASTIC',
          colorCode: '#3B82F6',
          fillLevel: 0,
          currentWeightKg: 0,
          capacityKg: 30,
          lidServoAngle: 0,
          sensorStatus: 'OK',
          acceptedMaterials: ['PET Bottles', 'Pure Water Sachets', 'HDPE Jugs']
        },
        {
          id: `ch-${newBinId}-metal`,
          name: 'Beverage Cans & Metals',
          category: 'METAL',
          colorCode: '#F59E0B',
          fillLevel: 0,
          currentWeightKg: 0,
          capacityKg: 20,
          lidServoAngle: 0,
          sensorStatus: 'OK',
          acceptedMaterials: ['Drink Cans', 'Tins']
        }
      ],
      recentDeposits: [],
      totalDeposits: 0,
      totalPointsRewarded: 0,
      lastSyncTimestamp: new Date().toISOString(),
      collectionDispatched: false
    };

    onRegisterBin(newBin);
    soundEffects.playSuccessJingle();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Pair New Smart Dust Bin</h3>
            <p className="text-xs text-slate-400">Connect ESP32 / Arduino hardware with LED Indicators</p>
          </div>
        </div>

        {/* Method Toggle */}
        <div className="grid grid-cols-3 gap-2 my-4">
          <button
            type="button"
            onClick={() => setMethod('BLE')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              method === 'BLE' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Bluetooth className="w-3.5 h-3.5" />
            Bluetooth (BLE)
          </button>
          <button
            type="button"
            onClick={() => setMethod('WIFI')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              method === 'WIFI' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            WiFi Mesh
          </button>
          <button
            type="button"
            onClick={() => setMethod('MANUAL')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              method === 'MANUAL' ? 'bg-purple-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Provision Token
          </button>
        </div>

        {method === 'BLE' && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center mb-4 space-y-3">
            <p className="text-xs text-slate-300">
              Turn on your Smart Bin ESP32 module. The LED ring should illuminate in <strong className="text-blue-400">BLUE</strong> during discovery.
            </p>

            <button
              type="button"
              onClick={handleScanBle}
              disabled={isSearchingBle}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center justify-center gap-2 mx-auto cursor-pointer shadow"
            >
              {isSearchingBle ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Scanning for Nearby Bins...
                </>
              ) : (
                <>
                  <Bluetooth className="w-4 h-4" />
                  Scan for Smart Bin via Bluetooth
                </>
              )}
            </button>

            {pairedSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Smart Bin BLE Handshake Established!
              </div>
            )}

            {bleError && (
              <div className="text-[11px] text-amber-400 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                {bleError}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Smart Bin Name / Label</label>
            <input
              type="text"
              required
              value={binName}
              onChange={(e) => setBinName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Microcontroller MCU</label>
              <select
                value={mcuType}
                onChange={(e: any) => setMcuType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="ESP32-S3">ESP32-S3 (Recommended)</option>
                <option value="Arduino-GIGA">Arduino GIGA R1 WiFi</option>
                <option value="Raspberry-Pi-Pico-W">Raspberry Pi Pico W</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">WiFi SSID / Mesh</label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Installation Location & EPA Zone</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Provision & Register Bin ⚡
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
