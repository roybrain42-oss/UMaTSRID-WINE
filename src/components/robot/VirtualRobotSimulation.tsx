import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Play, 
  Pause, 
  RotateCcw, 
  Scan, 
  Volume2, 
  VolumeX, 
  Zap, 
  CheckCircle2, 
  Radio, 
  ArrowRight, 
  TrendingUp, 
  Box, 
  Plus, 
  Trash2, 
  Sparkles, 
  RefreshCw, 
  Scale, 
  Crosshair, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Layers, 
  Award, 
  AlertTriangle, 
  Flame, 
  AlertCircle, 
  ShieldAlert, 
  X, 
  Target, 
  History, 
  Clock 
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { WasteCategory, WasteMaterial } from '../../types';
import { SAMPLE_WASTE_GALLERY } from '../../data/seedData';

export type SimPhase = 
  | 'AWAITING_OBJECT' 
  | 'OBJECT_PLACED' 
  | 'CONVEYING' 
  | 'SCANNING' 
  | 'GRIPPING' 
  | 'MOVING_TO_BIN' 
  | 'DROPPING' 
  | 'SORT_COMPLETE';

export interface SimWasteItem {
  id: string;
  name: string;
  category: WasteCategory;
  material: WasteMaterial;
  resinCode?: string;
  confidence: number;
  weightKg: number;
  points: number;
  bin: 'PLASTIC' | 'METAL' | 'PAPER' | 'GLASS' | 'E_WASTE';
  icon: string;
  description?: string;
  imageUrl?: string;
}

// Expanded catalog of authentic Ghanaian recyclables
const WASTE_ITEMS_CATALOG: SimWasteItem[] = [
  {
    id: 'w-voltic',
    name: 'Voltic PET Mineral Bottle',
    category: 'PLASTIC',
    material: 'PET Plastic',
    resinCode: 'PET #1',
    confidence: 97.4,
    weightKg: 0.18,
    points: 2,
    bin: 'PLASTIC',
    icon: '🥤',
    description: 'Clean transparent PET bottle. Highest market value in Ghana circular stream.'
  },
  {
    id: 'w-sachet',
    name: 'Pure Water Sachet (Rubber)',
    category: 'PLASTIC',
    material: 'LDPE Sachet',
    resinCode: 'LDPE #4',
    confidence: 96.1,
    weightKg: 0.05,
    points: 1,
    bin: 'PLASTIC',
    icon: '💧',
    description: 'Low-density polyethylene film. High volume urban collection candidate.'
  },
  {
    id: 'w-oil-gallon',
    name: 'Frytol Cooking Oil Gallon',
    category: 'PLASTIC',
    material: 'HDPE Plastic',
    resinCode: 'HDPE #2',
    confidence: 98.2,
    weightKg: 0.32,
    points: 3,
    bin: 'PLASTIC',
    icon: '🛢️',
    description: 'Rigid high-density polyethylene container with high durability.'
  },
  {
    id: 'w-malta-can',
    name: 'Malta Guinness Aluminum Can',
    category: 'METAL',
    material: 'Aluminum Can',
    resinCode: 'ALU #41',
    confidence: 98.9,
    weightKg: 0.15,
    points: 3,
    bin: 'METAL',
    icon: '🥫',
    description: '100% recyclable beverage can. Infinite smelting lifecycle with 0 quality loss.'
  },
  {
    id: 'w-milo-tin',
    name: 'Milo Cocoa Steel Tin',
    category: 'METAL',
    material: 'Tin Steel',
    resinCode: 'FE #40',
    confidence: 97.8,
    weightKg: 0.35,
    points: 4,
    bin: 'METAL',
    icon: '🥫',
    description: 'Magnetic tinplate food container. Strong recycling demand at Tema steel mills.'
  },
  {
    id: 'w-carton',
    name: 'Indomie Shipping Carton',
    category: 'PAPER',
    material: 'Corrugated Paper',
    resinCode: 'PAP #20',
    confidence: 95.8,
    weightKg: 0.45,
    points: 3,
    bin: 'PAPER',
    icon: '📦',
    description: 'Corrugated kraft paper box. High grade pulp for Ghanaian paper mills.'
  },
  {
    id: 'w-newspaper',
    name: 'Daily Graphic Newspaper',
    category: 'PAPER',
    material: 'Mixed Office Paper',
    resinCode: 'PAP #22',
    confidence: 94.6,
    weightKg: 0.20,
    points: 2,
    bin: 'PAPER',
    icon: '📰',
    description: 'De-inkable cellulose print paper for molded egg trays and packaging.'
  },
  {
    id: 'w-club-bottle',
    name: 'Club Shandy Glass Bottle',
    category: 'GLASS',
    material: 'Glass Beverage',
    resinCode: 'GL #71',
    confidence: 98.5,
    weightKg: 0.42,
    points: 4,
    bin: 'GLASS',
    icon: '🍾',
    description: 'Amber silica beverage bottle. Infinitely recyclable with zero toxic leaching.'
  },
  {
    id: 'w-phone-pcb',
    name: 'Obsolete Smartphone / PCB',
    category: 'E_WASTE',
    material: 'Electronic Circuit',
    resinCode: 'E-WASTE',
    confidence: 99.2,
    weightKg: 0.22,
    points: 6,
    bin: 'E_WASTE',
    icon: '📱',
    description: 'FR-4 circuit board containing copper traces, gold pins, and capacitors.'
  },
  {
    id: 'w-fanmilk-bottle',
    name: 'FanYogo Yogurt Bottle',
    category: 'PLASTIC',
    material: 'HDPE Plastic',
    resinCode: 'HDPE #2',
    confidence: 96.8,
    weightKg: 0.12,
    points: 2,
    bin: 'PLASTIC',
    icon: '🥛',
    description: 'High-density opaque plastic bottle widely collected across Accra schools.'
  },
  {
    id: 'w-star-bottle',
    name: 'Star Beer 625ml Glass',
    category: 'GLASS',
    material: 'Glass Beverage',
    resinCode: 'GL #71',
    confidence: 99.1,
    weightKg: 0.55,
    points: 5,
    bin: 'GLASS',
    icon: '🍺',
    description: 'Standard brewery returnable glass bottle for crushing into industrial cullet.'
  },
  {
    id: 'w-laptop-battery',
    name: 'Li-ion Laptop Battery Pack',
    category: 'E_WASTE',
    material: 'Electronic Circuit',
    resinCode: 'E-WASTE',
    confidence: 98.7,
    weightKg: 0.38,
    points: 7,
    bin: 'E_WASTE',
    icon: '🔋',
    description: 'Rechargeable cells requiring specialized segregation to prevent thermal hazards.'
  },
  {
    id: 'w-copper-wire',
    name: 'Scrap Copper Wiring Coil',
    category: 'METAL',
    material: 'Aluminum Can',
    resinCode: 'NON-FERROUS',
    confidence: 97.9,
    weightKg: 0.40,
    points: 5,
    bin: 'METAL',
    icon: '🪢',
    description: 'Clean stripped red copper wires for electrical component remanufacturing.'
  },
  {
    id: 'w-cement-bag',
    name: 'Ghacem Cement Multiwall Sack',
    category: 'PAPER',
    material: 'Corrugated Paper',
    resinCode: 'PAP #22',
    confidence: 95.2,
    weightKg: 0.28,
    points: 3,
    bin: 'PAPER',
    icon: '📜',
    description: 'Heavy multi-layer unbleached kraft sack fiber with high tensile recycling value.'
  }
];

export const VirtualRobotSimulation: React.FC = () => {
  const { recordRobotSortingEvent, robotEvents, triggerCelebration, addToast } = useEcoSort();

  // Reference for horizontal scrolling gallery
  const galleryScrollRef = useRef<HTMLDivElement>(null);

  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryScrollRef.current) {
      const scrollAmount = 340;
      galleryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Primary user interaction state: An object must be placed on the robot platform
  const [placedObject, setPlacedObject] = useState<SimWasteItem | null>(null);
  const [phase, setPhase] = useState<SimPhase>('AWAITING_OBJECT');
  
  // Settings & Toggles
  const [autoRunOnPlacement, setAutoRunOnPlacement] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 0.5x, 1x, 2x
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Custom Object Creator Modal State
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<WasteCategory>('PLASTIC');
  const [customMaterial, setCustomMaterial] = useState<WasteMaterial>('PET Plastic');
  const [customWeight, setCustomWeight] = useState<number>(0.25);
  const [customIcon, setCustomIcon] = useState<string>('🥤');

  // Conveyor & Robotic Manipulator Animation States
  const [conveyorProgress, setConveyorProgress] = useState<number>(0); // 0% (Platform) to 48% (Scanner) to 75% (Pickup)
  const [armX, setArmX] = useState<number>(50); // percentage along bins gantry
  const [armZ, setArmZ] = useState<number>(0); // vertical extension (0=up, 100=down)
  const [gripperClosed, setGripperClosed] = useState<boolean>(false);
  const [laserScanActive, setLaserScanActive] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);

  // Cumulative & Session Statistics
  const BIN_MAX_CAPACITY = 10;
  const [totalSorted, setTotalSorted] = useState<number>(8);
  const [sessionSortedCount, setSessionSortedCount] = useState<number>(0);
  const [sessionSortedItems, setSessionSortedItems] = useState<SimWasteItem[]>([]);
  const [justIncremented, setJustIncremented] = useState<boolean>(false);
  const [totalWeight, setTotalWeight] = useState<number>(2.35);
  const [totalPoints, setTotalPoints] = useState<number>(24);
  const [lastSortedItem, setLastSortedItem] = useState<SimWasteItem | null>(null);
  const [binCounts, setBinCounts] = useState<{
    PLASTIC: number;
    METAL: number;
    PAPER: number;
    GLASS: number;
    E_WASTE: number;
  }>({
    PLASTIC: 4,
    METAL: 2,
    PAPER: 1,
    GLASS: 1,
    E_WASTE: 0
  });

  // Modal overlay state when a bin reaches 10 items (or when sorting into a full bin is attempted)
  const [fullBinModal, setFullBinModal] = useState<'PLASTIC' | 'METAL' | 'PAPER' | 'GLASS' | 'E_WASTE' | null>(null);

  // Action to empty an individual bin
  const handleEmptyBin = (binKey: 'PLASTIC' | 'METAL' | 'PAPER' | 'GLASS' | 'E_WASTE', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isBusySorting) {
      addToast({
        title: '⚠️ Robot in Motion',
        message: 'Please wait until the robotic arm finishes sorting before emptying bins.',
        type: 'warning',
        duration: 3000
      });
      return;
    }

    const previousCount = binCounts[binKey];
    setBinCounts(prev => ({
      ...prev,
      [binKey]: 0
    }));

    if (fullBinModal === binKey) {
      setFullBinModal(null);
    }

    playSoundEffect(400, 0.12, 'square');

    addToast({
      title: `🗑️ ${binKey} Bin Emptied!`,
      message: `Cleared ${previousCount} items. ${binKey} bin capacity reset to 0/10. Ready to continue sorting!`,
      type: 'success',
      duration: 4000
    });
  };

  // Action to empty all bins at once
  const handleEmptyAllBins = () => {
    if (isBusySorting) return;
    setBinCounts({
      PLASTIC: 0,
      METAL: 0,
      PAPER: 0,
      GLASS: 0,
      E_WASTE: 0
    });
    setFullBinModal(null);
    playSoundEffect(450, 0.15, 'triangle');
    addToast({
      title: '✨ All Recycling Bins Emptied!',
      message: 'All sorting chambers are cleared and ready at 0/10 capacity.',
      type: 'info',
      duration: 3500
    });
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Target X gantry position for each bin
  const getBinXPosition = (bin: 'PLASTIC' | 'METAL' | 'PAPER' | 'GLASS' | 'E_WASTE'): number => {
    switch (bin) {
      case 'PLASTIC': return 10;
      case 'METAL': return 30;
      case 'PAPER': return 50;
      case 'GLASS': return 70;
      case 'E_WASTE': return 90;
    }
  };

  // Sound generator
  const getAudioContext = (): AudioContext | null => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          audioCtxRef.current = new AudioCtxClass();
        }
      }
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      return ctx;
    } catch {
      return null;
    }
  };

  // Subtle placement beep (pleasant dual micro-tone)
  const playPlacementBeep = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      
      // First tone (580 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.06, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      // Second micro-tone (880 Hz) for a crisp, high-tech confirmation click/beep
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.04); // A5
      gain2.gain.setValueAtTime(0.05, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.04);
      osc2.stop(now + 0.12);
    } catch {
      // Audio autoplay restrictions
    }
  };

  // Harmonious Success Chime on correct sort completion (C5 -> E5 -> G5 -> C6)
  const playSuccessChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [
        { freq: 523.25, delay: 0.00, duration: 0.25 }, // C5
        { freq: 659.25, delay: 0.09, duration: 0.28 }, // E5
        { freq: 783.99, delay: 0.18, duration: 0.32 }, // G5
        { freq: 1046.50, delay: 0.27, duration: 0.50 }  // C6 (Bright finish)
      ];

      notes.forEach(({ freq, delay, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + delay);

        // Soft attack & exponential decay
        gain.gain.setValueAtTime(0.001, now + delay);
        gain.gain.linearRampToValueAtTime(0.07, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + duration);
      });
    } catch {
      // Audio autoplay restrictions
    }
  };

  const playSoundEffect = (freq: number = 800, duration: number = 0.08, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay restrictions
    }
  };

  // User places an object on the robot loading tray
  const handlePlaceObject = (item: SimWasteItem) => {
    if (phase !== 'AWAITING_OBJECT' && phase !== 'OBJECT_PLACED' && phase !== 'SORT_COMPLETE') {
      addToast({
        title: '⚠️ Robot In Motion',
        message: 'Please wait until the current sorting cycle completes before placing another object.',
        type: 'warning',
        duration: 3000
      });
      return;
    }

    const newItem: SimWasteItem = {
      ...item,
      id: `sim-${Date.now()}`,
      confidence: +(item.confidence + (Math.random() * 1.5 - 0.75)).toFixed(1)
    };

    setPlacedObject(newItem);
    setPhase('OBJECT_PLACED');
    setConveyorProgress(0);
    setArmX(50);
    setArmZ(0);
    setGripperClosed(false);
    setLaserScanActive(false);
    setScanProgress(0);

    // Audio feedback: subtle placement beep
    playPlacementBeep();

    addToast({
      title: '📦 Waste Object Placed on Robot!',
      message: `${newItem.name} (${newItem.weightKg} kg) detected by platform load sensor.`,
      type: 'info',
      duration: 3000
    });

    if (autoRunOnPlacement) {
      setTimeout(() => {
        startSortingSequence(newItem);
      }, 400);
    }
  };

  // User removes placed object
  const handleRemoveObject = () => {
    if (phase !== 'OBJECT_PLACED' && phase !== 'SORT_COMPLETE') return;
    setPlacedObject(null);
    setPhase('AWAITING_OBJECT');
    setConveyorProgress(0);
    playSoundEffect(300, 0.08);
  };

  // Initiate the physical simulation sequence
  const startSortingSequence = (overrideItem?: SimWasteItem) => {
    const itemToSort = overrideItem || placedObject;
    if (!itemToSort) {
      addToast({
        title: '⚠️ No Object on Tray',
        message: 'Please select and place a waste object on the robot platform first.',
        type: 'warning',
        duration: 3000
      });
      return;
    }

    // Check if the destination bin is already full (10 items)
    if (binCounts[itemToSort.bin] >= BIN_MAX_CAPACITY) {
      playSoundEffect(220, 0.25, 'sawtooth');
      setFullBinModal(itemToSort.bin);
      addToast({
        title: `🛑 ${itemToSort.bin} Bin is FULL (${BIN_MAX_CAPACITY}/${BIN_MAX_CAPACITY})!`,
        message: `Please empty the ${itemToSort.bin} bin before sorting this ${itemToSort.name}. Click 'Empty Bin' in the overlay to continue.`,
        type: 'error',
        duration: 6000
      });
      return;
    }

    const stepDuration = Math.max(300, 1200 / speed);

    // Step 1: Conveyor transports object from platform to optical scanner
    setPhase('CONVEYING');
    setConveyorProgress(15);
    playSoundEffect(520, 0.1);

    setTimeout(() => {
      // Step 2: Under Scanner
      setConveyorProgress(48);
      setPhase('SCANNING');
      setLaserScanActive(true);
      playSoundEffect(900, 0.15, 'sawtooth');

      // Animate optical scan telemetry
      let p = 0;
      const scanInterval = setInterval(() => {
        p += 20;
        setScanProgress(Math.min(100, p));
        if (p >= 100) {
          clearInterval(scanInterval);
          setLaserScanActive(false);

          // Step 3: Transport to Robotic Arm Pickup Zone
          setConveyorProgress(75);
          setArmX(75);
          setPhase('GRIPPING');
          playSoundEffect(650, 0.1);

          setTimeout(() => {
            // Lower arm & close claws
            setArmZ(82);
            setTimeout(() => {
              setGripperClosed(true);
              playSoundEffect(1200, 0.08, 'square');

              setTimeout(() => {
                // Lift arm
                setArmZ(20);
                setPhase('MOVING_TO_BIN');

                setTimeout(() => {
                  // Step 4: Travel along gantry to designated Ghana EPA recycling bin
                  const targetX = getBinXPosition(itemToSort.bin);
                  setArmX(targetX);
                  playSoundEffect(700, 0.12);

                  setTimeout(() => {
                    // Step 5: Lower into bin & drop
                    setArmZ(85);
                    setPhase('DROPPING');

                    setTimeout(() => {
                      setGripperClosed(false); // Drop item into bin

                      // Audio feedback: success chime on correct sort
                      playSuccessChime();

                      const updatedBinCount = binCounts[itemToSort.bin] + 1;

                      // Update statistics & record event
                      setTotalSorted(prev => prev + 1);
                      setSessionSortedCount(prev => prev + 1);
                      setSessionSortedItems(prev => [itemToSort, ...prev.slice(0, 7)]);
                      setJustIncremented(true);
                      setTimeout(() => setJustIncremented(false), 2000);

                      setTotalWeight(prev => +(prev + itemToSort.weightKg).toFixed(2));
                      setTotalPoints(prev => prev + itemToSort.points);
                      setBinCounts(prev => ({
                        ...prev,
                        [itemToSort.bin]: updatedBinCount
                      }));
                      setLastSortedItem(itemToSort);

                      recordRobotSortingEvent({
                        itemName: itemToSort.name,
                        category: itemToSort.category,
                        material: itemToSort.material,
                        confidence: itemToSort.confidence,
                        weightKg: itemToSort.weightKg,
                        destinationBin: itemToSort.bin,
                        pointsGenerated: itemToSort.points,
                        status: 'SUCCESS'
                      });

                      triggerCelebration();

                      addToast({
                        title: `✅ Successfully Sorted into ${itemToSort.bin} Bin!`,
                        message: `+${itemToSort.points} EcoPoints awarded for ${itemToSort.name} (${itemToSort.confidence}% AI match).`,
                        type: 'success',
                        duration: 4000
                      });

                      // When a bin reaches 10 items, trigger modal overlay and high-visibility alert
                      if (updatedBinCount >= BIN_MAX_CAPACITY) {
                        setTimeout(() => {
                          playSoundEffect(300, 0.3, 'sawtooth');
                          setFullBinModal(itemToSort.bin);
                          addToast({
                            title: `⚠️ Bin Capacity Alert: ${itemToSort.bin} Bin is FULL!`,
                            message: `The ${itemToSort.bin} bin has reached maximum capacity (${BIN_MAX_CAPACITY}/${BIN_MAX_CAPACITY} items). Please empty this bin to continue sorting ${itemToSort.bin.toLowerCase()} objects.`,
                            type: 'warning',
                            duration: 7000
                          });
                        }, 800);
                      }

                      setTimeout(() => {
                        // Reset Arm to Home
                        setArmZ(0);
                        setArmX(50);
                        setPhase('SORT_COMPLETE');
                      }, stepDuration * 0.4);

                    }, stepDuration * 0.4);

                  }, stepDuration * 0.5);

                }, stepDuration * 0.4);

              }, stepDuration * 0.3);

            }, stepDuration * 0.3);

          }, stepDuration * 0.4);
        }
      }, stepDuration * 0.15);

    }, stepDuration * 0.6);
  };

  // Reset only session counter
  const handleResetSessionCounter = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSessionSortedCount(0);
    setSessionSortedItems([]);
    setJustIncremented(false);
    playSoundEffect(350, 0.08, 'triangle');
    addToast({
      title: '🔄 Session Counter Reset',
      message: 'Your current robot sorting session counter has been reset to 0 items.',
      type: 'info',
      duration: 3000
    });
  };

  // Reset entire simulator
  const handleResetSimulator = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPlacedObject(null);
    setPhase('AWAITING_OBJECT');
    setConveyorProgress(0);
    setArmX(50);
    setArmZ(0);
    setGripperClosed(false);
    setLaserScanActive(false);
    setScanProgress(0);
    setTotalSorted(0);
    setSessionSortedCount(0);
    setSessionSortedItems([]);
    setJustIncremented(false);
    setTotalWeight(0);
    setTotalPoints(0);
    setLastSortedItem(null);
    setBinCounts({ PLASTIC: 0, METAL: 0, PAPER: 0, GLASS: 0, E_WASTE: 0 });
    playSoundEffect(300, 0.1);
  };

  // Create custom waste item
  const handleCreateCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    let targetBin: 'PLASTIC' | 'METAL' | 'PAPER' | 'GLASS' | 'E_WASTE' = 'PLASTIC';
    if (customCategory === 'METAL') targetBin = 'METAL';
    else if (customCategory === 'PAPER') targetBin = 'PAPER';
    else if (customCategory === 'GLASS') targetBin = 'GLASS';
    else if (customCategory === 'E_WASTE') targetBin = 'E_WASTE';

    const points = Math.max(1, Math.round(customWeight * 10));

    const newItem: SimWasteItem = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      category: customCategory,
      material: customMaterial,
      confidence: 96.5,
      weightKg: +customWeight.toFixed(2),
      points,
      bin: targetBin,
      icon: customIcon,
      description: 'Custom user-defined waste object for robotic classification.'
    };

    setShowCustomModal(false);
    setCustomName('');
    handlePlaceObject(newItem);
  };

  // Filter catalog items
  const filteredCatalog = WASTE_ITEMS_CATALOG.filter(item => {
    if (selectedCategoryFilter === 'ALL') return true;
    return item.category === selectedCategoryFilter;
  });

  const isBusySorting = ['CONVEYING', 'SCANNING', 'GRIPPING', 'MOVING_TO_BIN', 'DROPPING'].includes(phase);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Overview Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden text-slate-900 dark:text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200 dark:border-emerald-800">
              <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Interactive Hardware Prototype • Autonomous Sorting
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              AI Waste-Sorting Robot
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-2xl font-medium">
              Place any waste object onto the loading tray to trigger optical spectral recognition and automated 3-axis robotic bin segregation.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Speed Control */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 text-xs">
              <span className="text-[10px] text-slate-500 font-bold px-2">Speed:</span>
              {[0.5, 1, 2].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  disabled={isBusySorting}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    speed === s 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Auto-Sort on Placement Toggle */}
            <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoRunOnPlacement}
                onChange={(e) => setAutoRunOnPlacement(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
              />
              <span className="text-[11px]">Auto-Sort on Place</span>
            </label>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-all cursor-pointer"
              title={soundEnabled ? 'Mute audio' : 'Enable audio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Reset Stats */}
            <button
              onClick={handleResetSimulator}
              disabled={isBusySorting}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              title="Reset simulation statistics"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Reset
            </button>
          </div>
        </div>

        {/* Real-time KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-700 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Objects Sorted</span>
            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              {totalSorted} <span className="text-xs text-emerald-600 font-bold">items</span>
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-700 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Weight Processed</span>
            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              {totalWeight.toFixed(2)} <span className="text-xs text-blue-600 font-bold">kg</span>
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-700 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">EcoPoints Awarded</span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-0.5">
              +{totalPoints} <span className="text-xs text-amber-700 dark:text-amber-500 font-bold">pts</span>
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-700 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Optical AI Accuracy</span>
            <span className="text-xl font-black text-teal-700 dark:text-teal-400 flex items-center gap-1.5 mt-0.5">
              98.2% <span className="text-xs text-slate-500 font-bold">certified</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Simulation View & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Interactive Robot Stage with Physical Placement Hopper & Conveyor */}
        <div className="lg:col-span-8 space-y-6">

          {/* Visual Session Counter Ribbon directly above the robot simulation */}
          <div className={`bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-blue-950/40 rounded-2xl p-3.5 sm:p-4 border transition-all duration-300 ${
            justIncremented 
              ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-md scale-[1.005]' 
              : 'border-emerald-200/80 dark:border-emerald-800/60 shadow-xs'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform duration-300 ${
                  justIncremented 
                    ? 'bg-emerald-600 text-white scale-110 shadow-sm animate-bounce' 
                    : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                }`}>
                  {justIncremented ? '✨' : '🎯'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Current Session Sorted Counter
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Session
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                    Waste objects placed, AI-classified, and deposited into EPA bins this session
                  </p>
                </div>
              </div>

              {/* Counter Display with Live Pill & Recent Sorted Items */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {sessionSortedItems.length > 0 && (
                  <div className="hidden md:flex items-center -space-x-1.5 overflow-hidden py-0.5">
                    {sessionSortedItems.slice(0, 4).map((item, idx) => (
                      <div 
                        key={`${item.id}-${idx}`}
                        title={`${item.name} (${item.bin} Bin)`}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs shadow-xs hover:z-10 hover:scale-110 transition-transform cursor-default"
                      >
                        {item.icon}
                      </div>
                    ))}
                  </div>
                )}

                <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border bg-white dark:bg-slate-900 transition-all ${
                  justIncremented 
                    ? 'border-emerald-500 shadow-emerald-500/20 shadow-md ring-2 ring-emerald-400/40' 
                    : 'border-emerald-200 dark:border-emerald-800/80 shadow-xs'
                }`}>
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 font-mono">
                    Session Sorted:
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl font-black font-mono transition-transform duration-300 ${
                      justIncremented 
                        ? 'text-emerald-500 scale-125' 
                        : 'text-emerald-700 dark:text-emerald-400 scale-100'
                    }`}>
                      {sessionSortedCount}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {sessionSortedCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

                {/* Reset Counter Button */}
                <button
                  type="button"
                  onClick={handleResetSessionCounter}
                  disabled={isBusySorting || sessionSortedCount === 0}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none border ${
                    sessionSortedCount === 0
                      ? 'bg-slate-100/80 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border-slate-200/50 dark:border-slate-800 cursor-not-allowed opacity-60'
                      : 'bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800 shadow-xs'
                  }`}
                  title={sessionSortedCount === 0 ? 'Session counter is already zero' : 'Reset session counter to 0'}
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${sessionSortedCount > 0 ? 'text-slate-500 group-hover:text-rose-500' : 'text-slate-400'}`} />
                  <span className="text-[11px] font-bold hidden sm:inline">Reset Counter</span>
                </button>
              </div>

            </div>
          </div>

          {/* Interactive Mechanical Chamber Stage */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white flex flex-col justify-between min-h-[500px] relative overflow-hidden">
            
            {/* Top Chamber Header & Status Telemetry */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 font-mono text-xs gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isBusySorting ? 'bg-amber-400' : placedObject ? 'bg-emerald-400' : 'bg-slate-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isBusySorting ? 'bg-amber-500' : placedObject ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}></span>
                </span>
                <span className={`px-2.5 py-0.5 rounded-full border uppercase font-bold text-[11px] ${
                  isBusySorting 
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    : placedObject 
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>
                  ROBOT PHASE: {phase.replace('_', ' ')}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold text-[11px]">
                <span className="hidden sm:inline bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  SESSION SORTED: <strong className="font-mono text-slate-900 dark:text-white">{sessionSortedCount}</strong>
                </span>
                <span>SCALE: <strong className="text-slate-800 dark:text-slate-200 font-mono">{placedObject ? `${placedObject.weightKg} kg` : '0.00 kg (Empty)'}</strong></span>
                <span>OPTICAL GANTRY: <strong className="text-slate-800 dark:text-slate-200 font-mono">ONLINE</strong></span>
              </div>
            </div>

            {/* Graphic Simulation Chamber Stage */}
            <div className="relative my-4 py-4 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 h-96 flex flex-col justify-between px-4 sm:px-6 overflow-hidden shadow-inner">
              
              {/* Top Gantry & Overhead Optical Scanner */}
              <div className="relative flex justify-between items-center z-10">
                {/* Optical Spectral Rig */}
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                    <Scan className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-800 dark:text-cyan-400 block font-black">AI SPECTRAL SCANNER</span>
                    <span className="text-[9px] text-slate-500 font-mono">4K Optical + NIR Spectral</span>
                  </div>
                </div>

                {/* Live Gantry Cycle Badge */}
                <div className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300 font-bold shadow-xs">
                  CYCLE: #{totalSorted + 1}
                </div>
              </div>

              {/* Laser Scanning Grid overlay (triggers during SCANNING phase) */}
              {laserScanActive && (
                <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none flex flex-col justify-center items-center z-20">
                  <div className="w-full h-0.5 bg-cyan-500 shadow-[0_0_15px_#06b6d4] animate-pulse" />
                  <div className="text-cyan-900 dark:text-cyan-200 font-mono text-[11px] mt-2 font-black bg-white/95 dark:bg-slate-900/95 px-3 py-1.5 rounded-xl border border-cyan-400 shadow-lg flex items-center gap-2">
                    <Crosshair className="w-3.5 h-3.5 text-cyan-600 animate-spin" />
                    <span>AI CLASSIFYING: {placedObject?.material} ({placedObject?.confidence}%)</span>
                    <span className="bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-300 px-1.5 py-0.5 rounded text-[10px]">
                      {scanProgress}%
                    </span>
                  </div>
                </div>
              )}

              {/* Robotic Manipulator Arm Visualizer */}
              <div className="relative h-24 w-full">
                {/* Arm Gantry Rail */}
                <div className="w-full h-2.5 bg-slate-300 dark:bg-slate-700 rounded-full relative">
                  {/* Sliding Carriage */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 ease-out"
                    style={{ left: `${armX}%` }}
                  >
                    {/* Robotic Arm Base */}
                    <div className="w-11 h-7 bg-slate-800 dark:bg-slate-700 border-2 border-emerald-400 rounded-lg shadow-lg flex items-center justify-center text-xs text-emerald-300">
                      🦾
                    </div>

                    {/* Extending Piston Arm */}
                    <div 
                      className="w-1.5 bg-emerald-600 mx-auto transition-all duration-200"
                      style={{ height: `${20 + armZ * 0.45}px` }}
                    />

                    {/* Gripper Claw */}
                    <div className={`w-9 h-5 border-2 rounded-b flex items-center justify-between px-1 transition-all ${
                      gripperClosed 
                        ? 'border-amber-500 bg-amber-200 dark:bg-amber-900/80 shadow-md' 
                        : 'border-slate-500 bg-white dark:bg-slate-800'
                    }`}>
                      <span className="text-[9px] font-black text-slate-700 dark:text-slate-200">⟨</span>
                      {gripperClosed && placedObject && (
                        <span className="text-xs scale-110">{placedObject.icon}</span>
                      )}
                      <span className="text-[9px] font-black text-slate-700 dark:text-slate-200">⟩</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conveyor Belt & Intake Loading Tray Platform */}
              <div className="relative flex items-center gap-2">
                
                {/* 1. Physical Loading Platform / Intake Station (Left) */}
                <div className={`w-28 h-18 rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center relative transition-all duration-300 ${
                  placedObject && phase === 'OBJECT_PLACED'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-4 ring-emerald-500/20 shadow-md'
                    : 'border-dashed border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:border-emerald-400'
                }`}>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                    INTAKE TRAY
                  </span>

                  {placedObject && (phase === 'OBJECT_PLACED' || phase === 'AWAITING_OBJECT') ? (
                    <div className="flex flex-col items-center">
                      <span className="text-2xl animate-bounce">{placedObject.icon}</span>
                      <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[90px] block">
                        {placedObject.name.split(' ')[0]}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <Scale className="w-5 h-5 text-slate-400 mb-0.5" />
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Tray Empty</span>
                    </div>
                  )}

                  {/* Load Sensor Pin indicator */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-slate-800 text-[7px] text-emerald-400 font-mono rounded">
                    LOAD CELL
                  </div>
                </div>

                {/* 2. Motorized Conveyor Belt */}
                <div className="relative flex-1 bg-slate-200 dark:bg-slate-800 h-16 rounded-xl border-2 border-slate-300 dark:border-slate-700 flex items-center px-4 overflow-hidden shadow-inner">
                  
                  {/* Conveyor Tread Pattern */}
                  <div className={`absolute inset-0 bg-[repeating-linear-gradient(90deg,#cbd5e1_0px,#cbd5e1_10px,#e2e8f0_10px,#e2e8f0_20px)] dark:bg-[repeating-linear-gradient(90deg,#334155_0px,#334155_10px,#1e293b_10px,#1e293b_20px)] opacity-70 ${
                    isBusySorting ? 'animate-pulse' : ''
                  }`} />

                  {/* Moving Waste Object on Belt (Visible during transit until gripped) */}
                  {!gripperClosed && isBusySorting && placedObject && (
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-linear flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-full shadow-md z-10"
                      style={{ left: `${conveyorProgress}%` }}
                    >
                      <span className="text-base">{placedObject.icon}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-800 dark:text-slate-200">
                        {placedObject.name.split(' ')[0]}
                      </span>
                    </div>
                  )}

                  {/* Optical Laser Trigger Point Marker */}
                  <div className="absolute left-[48%] top-0 bottom-0 w-0.5 bg-cyan-500 border-r border-dashed border-cyan-400 z-10" />
                </div>

              </div>

              {/* Bottom 5 Color-Coded Recycling Bins (EPA Ghana Standard) with Capacity Indicators */}
              <div className="grid grid-cols-5 gap-2 pt-2 z-10">
                {(
                  [
                    { 
                      key: 'PLASTIC', 
                      name: 'PLASTIC', 
                      icon: '🥤', 
                      border: 'border-blue-400 dark:border-blue-700', 
                      glow: 'border-blue-500 bg-blue-100/90 dark:bg-blue-950/80 ring-2 ring-blue-400 shadow-[0_0_22px_rgba(59,130,246,0.65)] scale-[1.04]', 
                      bg: 'bg-blue-50/90 dark:bg-blue-950/40', 
                      text: 'text-blue-700 dark:text-blue-400', 
                      countText: 'text-blue-900 dark:text-blue-300', 
                      barBg: 'bg-blue-600 dark:bg-blue-500',
                      badgeBg: 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.8)]'
                    },
                    { 
                      key: 'METAL', 
                      name: 'METAL', 
                      icon: '🥫', 
                      border: 'border-amber-400 dark:border-amber-700', 
                      glow: 'border-amber-500 bg-amber-100/90 dark:bg-amber-950/80 ring-2 ring-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.65)] scale-[1.04]', 
                      bg: 'bg-amber-50/90 dark:bg-amber-950/40', 
                      text: 'text-amber-700 dark:text-amber-400', 
                      countText: 'text-amber-900 dark:text-amber-300', 
                      barBg: 'bg-amber-500 dark:bg-amber-400',
                      badgeBg: 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                    },
                    { 
                      key: 'PAPER', 
                      name: 'PAPER', 
                      icon: '📦', 
                      border: 'border-emerald-400 dark:border-emerald-700', 
                      glow: 'border-emerald-500 bg-emerald-100/90 dark:bg-emerald-950/80 ring-2 ring-emerald-400 shadow-[0_0_22px_rgba(16,185,129,0.65)] scale-[1.04]', 
                      bg: 'bg-emerald-50/90 dark:bg-emerald-950/40', 
                      text: 'text-emerald-700 dark:text-emerald-400', 
                      countText: 'text-emerald-900 dark:text-emerald-300', 
                      barBg: 'bg-emerald-600 dark:bg-emerald-500',
                      badgeBg: 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                    },
                    { 
                      key: 'GLASS', 
                      name: 'GLASS', 
                      icon: '🍾', 
                      border: 'border-cyan-400 dark:border-cyan-700', 
                      glow: 'border-cyan-500 bg-cyan-100/90 dark:bg-cyan-950/80 ring-2 ring-cyan-400 shadow-[0_0_22px_rgba(6,182,212,0.65)] scale-[1.04]', 
                      bg: 'bg-cyan-50/90 dark:bg-cyan-950/40', 
                      text: 'text-cyan-700 dark:text-cyan-400', 
                      countText: 'text-cyan-900 dark:text-cyan-300', 
                      barBg: 'bg-cyan-600 dark:bg-cyan-500',
                      badgeBg: 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                    },
                    { 
                      key: 'E_WASTE', 
                      name: 'E-WASTE', 
                      icon: '📱', 
                      border: 'border-purple-400 dark:border-purple-700', 
                      glow: 'border-purple-500 bg-purple-100/90 dark:bg-purple-950/80 ring-2 ring-purple-400 shadow-[0_0_22px_rgba(168,85,247,0.65)] scale-[1.04]', 
                      bg: 'bg-purple-50/90 dark:bg-purple-950/40', 
                      text: 'text-purple-700 dark:text-purple-400', 
                      countText: 'text-purple-900 dark:text-purple-300', 
                      barBg: 'bg-purple-600 dark:bg-purple-500',
                      badgeBg: 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                    }
                  ] as const
                ).map((binDef) => {
                  const count = binCounts[binDef.key];
                  const percent = Math.min(100, Math.round((count / BIN_MAX_CAPACITY) * 100));
                  const isFull = count >= BIN_MAX_CAPACITY;
                  // Color-coded glow is active whenever an object of this category is placed on the robot
                  const isTarget = placedObject?.bin === binDef.key;

                  return (
                    <div 
                      key={binDef.key}
                      className={`rounded-xl p-1.5 sm:p-2 text-center border-2 transition-all duration-300 relative flex flex-col justify-between group ${
                        isFull 
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 ring-2 ring-rose-500/50 shadow-[0_0_18px_rgba(244,63,94,0.5)] animate-pulse'
                          : isTarget
                            ? `${binDef.glow}`
                            : `${binDef.border} ${binDef.bg}`
                      }`}
                    >
                      {/* Full Warning Pill or Destination Target Indicator */}
                      {isFull ? (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow-xs whitespace-nowrap z-20 animate-bounce">
                          FULL (10/10)
                        </div>
                      ) : isTarget ? (
                        <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-black px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap z-20 flex items-center gap-1 animate-bounce ${binDef.badgeBg}`}>
                          <Target className="w-2.5 h-2.5" />
                          <span>DESTINATION</span>
                        </div>
                      ) : null}

                      <div className="mt-1">
                        <span className={`text-sm sm:text-base block transition-transform ${isTarget ? 'scale-110' : ''}`}>{binDef.icon}</span>
                        <span className={`font-black text-[9px] sm:text-[10px] uppercase tracking-wider block ${isFull ? 'text-rose-600 dark:text-rose-400' : binDef.text}`}>
                          {binDef.name}
                        </span>
                      </div>

                      {/* Visual Bin Capacity Progress Bar */}
                      <div className="my-1 sm:my-1.5 space-y-0.5">
                        <div className="w-full bg-slate-200 dark:bg-slate-700/80 rounded-full h-1.5 sm:h-2 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              isFull 
                                ? 'bg-rose-600' 
                                : count >= 8 
                                  ? 'bg-amber-500' 
                                  : binDef.barBg
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono px-0.5 font-bold">
                          <span className={isFull ? 'text-rose-600 dark:text-rose-400 font-black' : binDef.countText}>
                            {count}/{BIN_MAX_CAPACITY}
                          </span>
                          <span className={isFull ? 'text-rose-600 dark:text-rose-400 font-black' : 'text-slate-500'}>
                            {percent}%
                          </span>
                        </div>
                      </div>

                      {/* Empty Bin Quick Action Button */}
                      {count > 0 ? (
                        <button
                          type="button"
                          onClick={(e) => handleEmptyBin(binDef.key, e)}
                          disabled={isBusySorting}
                          className={`w-full py-0.5 sm:py-1 px-1 rounded-md text-[8px] sm:text-[9px] font-bold tracking-tight transition-all cursor-pointer flex items-center justify-center gap-0.5 ${
                            isFull 
                              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs font-black' 
                              : 'bg-white/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                          }`}
                          title={`Empty ${binDef.name} bin (${count}/${BIN_MAX_CAPACITY})`}
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Empty</span>
                        </button>
                      ) : (
                        <div className="text-[8px] text-slate-400 font-mono uppercase tracking-tight py-0.5">
                          Empty
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Bottom Action Trigger Bar: Place Object / Run Simulation */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Placement Status Text */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-xs border ${
                  placedObject
                    ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}>
                  {placedObject ? placedObject.icon : '📥'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {placedObject ? placedObject.name : 'No Waste Object on Robot Tray'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {placedObject 
                      ? `${placedObject.weightKg} kg • Ready for Optical Scanning & Arm Placement`
                      : 'Select or drag an item below to place on the loading platform.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {placedObject && (
                  <button
                    onClick={handleRemoveObject}
                    disabled={isBusySorting}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
                  >
                    Remove Object
                  </button>
                )}

                <button
                  onClick={() => startSortingSequence()}
                  disabled={!placedObject || isBusySorting}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs shadow-md transition-all cursor-pointer ${
                    placedObject && !isBusySorting
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 scale-102 animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isBusySorting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Sorting In Progress...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-white" />
                      <span>Run Sorting Simulation</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

          {/* Horizontal Scrolling Gallery: Tap to Load Recyclable Items onto Robot */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white space-y-4">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Recyclable Objects Gallery</span>
                    <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Tap to Load
                    </span>
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Tap any pre-defined Ghanaian recyclable below to load it directly onto the robot intake platform (no camera required).
                </p>
              </div>

              {/* Controls: Filter Chips + Scroll Navigation Arrows */}
              <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
                {/* Category Pills */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs overflow-x-auto max-w-full">
                  {['ALL', 'PLASTIC', 'METAL', 'PAPER', 'GLASS', 'E_WASTE'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] whitespace-nowrap cursor-pointer ${
                        selectedCategoryFilter === cat
                          ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat === 'ALL' ? 'All Items' : cat}
                    </button>
                  ))}
                </div>

                {/* Left/Right Scroll Arrows */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => scrollGallery('left')}
                    aria-label="Scroll Left"
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                    title="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollGallery('right')}
                    aria-label="Scroll Right"
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                    title="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  
                  {/* Custom Modal Button */}
                  <button
                    onClick={() => setShowCustomModal(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold transition-all cursor-pointer shrink-0 ml-1"
                    title="Create custom object"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Custom</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Scrolling Gallery Strip */}
            <div 
              ref={galleryScrollRef}
              className="flex items-stretch gap-3.5 overflow-x-auto pb-2 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
            >
              {filteredCatalog.map(item => {
                const isSelected = placedObject?.name === item.name;
                const isBinFull = binCounts[item.bin] >= BIN_MAX_CAPACITY;

                const categoryColorTheme = 
                  item.bin === 'PLASTIC' ? 'border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400' :
                  item.bin === 'METAL' ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400' :
                  item.bin === 'PAPER' ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' :
                  item.bin === 'GLASS' ? 'border-cyan-200 dark:border-cyan-900/60 bg-cyan-50/40 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-400' :
                  'border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400';

                const destinationTagColor = 
                  item.bin === 'PLASTIC' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800' :
                  item.bin === 'METAL' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800' :
                  item.bin === 'PAPER' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' :
                  item.bin === 'GLASS' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800' :
                  'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-800';

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (isBinFull) {
                        playSoundEffect(260, 0.15, 'sawtooth');
                        setFullBinModal(item.bin);
                      } else {
                        handlePlaceObject(item);
                      }
                    }}
                    className={`snap-start shrink-0 w-60 sm:w-64 p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between group cursor-pointer relative select-none ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 shadow-md ring-2 ring-emerald-400/40 scale-[1.02]'
                        : isBinFull
                          ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 opacity-80'
                          : `hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md ${categoryColorTheme}`
                    }`}
                  >
                    {/* Top Row: Category Pill & Resin/Material Badge */}
                    <div className="flex items-center justify-between gap-1.5 mb-2.5">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border font-mono ${destinationTagColor}`}>
                        {item.bin}
                      </span>

                      {item.resinCode && (
                        <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                          {item.resinCode}
                        </span>
                      )}
                    </div>

                    {/* Center: Emoji Icon & Name */}
                    <div className="flex items-center gap-3 my-1">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform shrink-0">
                        {item.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                          {item.material}
                        </p>
                      </div>
                    </div>

                    {/* Metadata Strip: Weight, AI Confidence, EcoPoints */}
                    <div className="grid grid-cols-3 gap-1 py-2 my-2 border-y border-slate-200/60 dark:border-slate-700/60 text-center font-mono text-[10px]">
                      <div>
                        <span className="text-slate-400 block text-[9px]">WEIGHT</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{item.weightKg} kg</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">MATCH</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">{item.confidence}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">POINTS</span>
                        <span className="font-bold text-amber-700 dark:text-amber-400">+{item.points}</span>
                      </div>
                    </div>

                    {/* Action Button: Load on Robot */}
                    <button
                      type="button"
                      disabled={isBusySorting}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isBinFull) {
                          playSoundEffect(260, 0.15, 'sawtooth');
                          setFullBinModal(item.bin);
                        } else {
                          handlePlaceObject(item);
                        }
                      }}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isBinFull
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-emerald-600 hover:text-white group-hover:border-emerald-500'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Loaded on Robot</span>
                        </>
                      ) : isBinFull ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Bin Full (10/10)</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-500 group-hover:text-white" />
                          <span>Tap to Load</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Gallery Info Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 gap-2">
              <span className="flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Showing <strong>{filteredCatalog.length}</strong> items in <strong>{selectedCategoryFilter}</strong> catalog</span>
              </span>
              <span className="text-slate-400 text-xs">
                💡 Tip: Tap any card to immediately load it onto the robot intake tray
              </span>
            </div>

          </div>

          {/* Recent Activity Panel: Last 5 Sorted Items with Timestamps */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Recent Activity</span>
                    <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Last 5 Items
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Live chronological audit of waste successfully segregated by the robotic arm.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{robotEvents.filter(e => e.status === 'SUCCESS').length} Sorted Today</span>
                </span>
              </div>
            </div>

            {/* List of last 5 successfully sorted items with timestamp badges */}
            {robotEvents.filter(e => e.status === 'SUCCESS').length > 0 ? (
              <div className="space-y-2.5">
                {robotEvents
                  .filter(e => e.status === 'SUCCESS')
                  .slice(0, 5)
                  .map((activity, index) => {
                    const categoryIcon = 
                      activity.category === 'PLASTIC' ? '🥤' :
                      activity.category === 'METAL' ? '🥫' :
                      activity.category === 'PAPER' ? '📦' :
                      activity.category === 'GLASS' ? '🍾' : '📱';

                    const binBadgeColor = 
                      activity.destinationBin === 'PLASTIC' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
                      activity.destinationBin === 'METAL' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                      activity.destinationBin === 'PAPER' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                      activity.destinationBin === 'GLASS' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800';

                    return (
                      <div 
                        key={activity.id || `act-${index}`}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        {/* Item Icon and Metadata */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform shrink-0">
                            {categoryIcon}
                          </div>
                          
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                {activity.itemName}
                              </h4>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border font-mono ${binBadgeColor}`}>
                                {activity.destinationBin}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 flex items-center gap-2">
                              <span>{activity.material}</span>
                              <span>•</span>
                              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">{activity.confidence}% match</span>
                              <span>•</span>
                              <span className="font-mono">{activity.weightKg} kg</span>
                            </p>
                          </div>
                        </div>

                        {/* Timestamp & Points Awarded */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50 dark:border-slate-700/50">
                          <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900/90 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{activity.timestamp || 'Just now'}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-xl text-xs font-black font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-xs">
                              +{activity.pointsGenerated} pts
                            </span>
                            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-xs" title="Sorted Successfully">
                              ✓
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl mx-auto text-slate-400">
                  📥
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  No Sorting Activity Recorded Yet
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Select any waste object from the repository below, place it on the robot tray, and run the simulation to log activity.
                </p>
              </div>
            )}

          </div>

          {/* Waste Object Repository: Place on Tray */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Box className="w-4 h-4 text-emerald-600" />
                  Select Waste Object to Place on Robot
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click any Ghanaian recyclable item to load it onto the intake platform.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Category Filters */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                  {['ALL', 'PLASTIC', 'METAL', 'PAPER', 'GLASS', 'E_WASTE'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] cursor-pointer ${
                        selectedCategoryFilter === cat
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat === 'ALL' ? 'All' : cat}
                    </button>
                  ))}
                </div>

                {/* Custom Object Creator Button */}
                <button
                  onClick={() => setShowCustomModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Custom Item</span>
                </button>
              </div>
            </div>

            {/* Object Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
              {filteredCatalog.map(item => {
                const isSelected = placedObject?.name === item.name;
                const isBinFull = binCounts[item.bin] >= BIN_MAX_CAPACITY;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (isBinFull) {
                        playSoundEffect(260, 0.15, 'sawtooth');
                        setFullBinModal(item.bin);
                      } else {
                        handlePlaceObject(item);
                      }
                    }}
                    disabled={isBusySorting}
                    className={`text-left p-3.5 rounded-2xl border transition-all relative group cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20'
                        : isBinFull
                          ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 hover:border-rose-400'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-400 hover:shadow-sm'
                    } disabled:opacity-50`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full font-mono ${
                          item.category === 'PLASTIC' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          item.category === 'METAL' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          item.category === 'PAPER' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          item.category === 'GLASS' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300' :
                          'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        }`}>
                          {item.category}
                        </span>
                        {isBinFull && (
                          <span className="text-[8px] font-black text-rose-600 dark:text-rose-400 uppercase bg-rose-100 dark:bg-rose-950 px-1.5 py-0.2 rounded border border-rose-300 dark:border-rose-800">
                            Bin Full (10/10)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-emerald-600 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {item.material} • {item.weightKg} kg
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                      <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                        +{item.points} pts
                      </span>
                      <span className={`font-bold transition-transform flex items-center gap-0.5 ${
                        isBinFull 
                          ? 'text-rose-600 dark:text-rose-400' 
                          : 'text-emerald-700 dark:text-emerald-400 group-hover:translate-x-0.5'
                      }`}>
                        {isBinFull ? 'Empty Bin First' : 'Place on Tray →'}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* Right 4 Cols: Live Telemetry HUD, Diagnostics & Event Stream */}
        <div className="lg:col-span-4 space-y-6">

          {/* Live Telemetry & AI Sensor Diagnostics Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white font-mono space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" /> Robot Telemetry
              </span>
              <span className="text-[10px] text-slate-500 font-sans font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                Node: GH-ACC-ROBOT-01
              </span>
            </div>

            {/* Currently Detected Item Card */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">ACTIVE OBJECT ON PLATFORM</span>
              {placedObject ? (
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-2xl">
                      {placedObject.icon}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white block truncate">
                        {placedObject.name}
                      </span>
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                        {placedObject.material} {placedObject.resinCode ? `(${placedObject.resinCode})` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[9px] text-slate-500 block uppercase">Confidence</span>
                      <span className="text-base font-black text-emerald-700 dark:text-emerald-400">{placedObject.confidence}%</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[9px] text-slate-500 block uppercase">Weigh Cell</span>
                      <span className="text-base font-black text-slate-900 dark:text-white">{placedObject.weightKg} kg</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
                  Tray is empty. Place a waste object on the loading hopper to view live telemetry.
                </div>
              )}
            </div>

            {/* Destination Bin Indicator */}
            {placedObject && (
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[9px] text-slate-500 block uppercase font-bold">TARGET RECYCLING DESTINATION</span>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  {placedObject.bin} Recycling Bin (Ghana EPA Color Standard)
                </span>
              </div>
            )}

            {/* EcoPoints Reward Preview */}
            {placedObject && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 rounded-2xl flex items-center justify-between">
                <span className="text-xs text-emerald-900 dark:text-emerald-300 font-sans font-bold">Simulated EcoPoints:</span>
                <span className="text-base font-black text-emerald-700 dark:text-emerald-400">+{placedObject.points} pts</span>
              </div>
            )}

            {/* Live Sensor Hardware Diagnostics */}
            <div className="pt-2 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Robot Hardware Sensors</span>
              
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Camera</span>
                  <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">IR Beam</span>
                  <span className={`flex items-center gap-1 font-bold text-[10px] px-1.5 py-0.5 rounded ${
                    placedObject 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                  }`}>
                    {placedObject ? 'TRIGGERED' : 'CLEAR'}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Load Cell</span>
                  <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> READY
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Conveyor</span>
                  <span className={`flex items-center gap-1 font-bold text-[10px] px-1.5 py-0.5 rounded ${
                    phase === 'CONVEYING'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {phase === 'CONVEYING' ? 'MOTOR ON' : 'STANDBY'}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Pneumatics</span>
                  <span className={`flex items-center gap-1 font-bold text-[10px] px-1.5 py-0.5 rounded ${
                    gripperClosed
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                  }`}>
                    {gripperClosed ? 'CLAMPED' : 'OPEN'}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">3-Axis Arm</span>
                  <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Bin Capacity & Fill Levels Status HUD Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white font-mono space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Box className="w-3.5 h-3.5 text-blue-600" /> Bin Fill Capacity
              </span>
              <button
                type="button"
                onClick={handleEmptyAllBins}
                disabled={isBusySorting || Object.values(binCounts).every(v => v === 0)}
                className="text-[10px] font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                title="Empty all 5 sorting bins"
              >
                <Trash2 className="w-3 h-3" /> Empty All
              </button>
            </div>

            <div className="space-y-2.5">
              {(
                [
                  { key: 'PLASTIC', name: 'Plastic', icon: '🥤', color: 'bg-blue-500', barBg: 'bg-blue-500', glow: 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-700/60 shadow-[0_0_12px_rgba(59,130,246,0.3)]', badge: 'bg-blue-600 text-white' },
                  { key: 'METAL', name: 'Metal', icon: '🥫', color: 'bg-amber-500', barBg: 'bg-amber-500', glow: 'bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]', badge: 'bg-amber-500 text-slate-950' },
                  { key: 'PAPER', name: 'Paper', icon: '📦', color: 'bg-emerald-500', barBg: 'bg-emerald-500', glow: 'bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]', badge: 'bg-emerald-600 text-white' },
                  { key: 'GLASS', name: 'Glass', icon: '🍾', color: 'bg-cyan-500', barBg: 'bg-cyan-500', glow: 'bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-300 dark:border-cyan-700/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]', badge: 'bg-cyan-600 text-white' },
                  { key: 'E_WASTE', name: 'E-Waste', icon: '📱', color: 'bg-purple-500', barBg: 'bg-purple-500', glow: 'bg-purple-50/80 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-700/60 shadow-[0_0_12px_rgba(168,85,247,0.3)]', badge: 'bg-purple-600 text-white' }
                ] as const
              ).map(bin => {
                const count = binCounts[bin.key];
                const pct = Math.min(100, Math.round((count / BIN_MAX_CAPACITY) * 100));
                const isFull = count >= BIN_MAX_CAPACITY;
                const isTarget = placedObject?.bin === bin.key;

                return (
                  <div key={bin.key} className={`p-2 rounded-xl transition-all duration-300 space-y-1 ${isTarget && !isFull ? bin.glow : 'border border-transparent'}`}>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span>{bin.icon}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{bin.name}</span>
                        {isFull ? (
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-rose-600 text-white animate-pulse">
                            FULL
                          </span>
                        ) : isTarget ? (
                          <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase flex items-center gap-0.5 animate-pulse ${bin.badge}`}>
                            <Target className="w-2.5 h-2.5" /> Target
                          </span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold ${isFull ? 'text-rose-600 dark:text-rose-400 font-black' : isTarget ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-600 dark:text-slate-400'}`}>
                          {count}/{BIN_MAX_CAPACITY} ({pct}%)
                        </span>
                        {count > 0 && (
                          <button
                            type="button"
                            onClick={(e) => handleEmptyBin(bin.key, e)}
                            disabled={isBusySorting}
                            className="text-[9px] text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors cursor-pointer"
                            title={`Empty ${bin.name} bin`}
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isFull 
                            ? 'bg-rose-600' 
                            : count >= 8 
                              ? 'bg-amber-500' 
                              : bin.barBg
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {(Object.values(binCounts) as number[]).some(count => count >= BIN_MAX_CAPACITY) && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-[11px] text-rose-700 dark:text-rose-300 flex items-center gap-2 font-sans font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>One or more bins are at 10 items. Empty to continue sorting.</span>
              </div>
            )}
          </div>

          {/* Live Robot Sorting Event Stream */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Live Sorting Stream
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-bold">Realtime Telemetry</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {robotEvents.length > 0 ? (
                robotEvents.slice(0, 6).map((evt) => (
                  <div key={evt.id} className="bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-mono hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-[11px]">{evt.itemName}</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">{evt.material} • {evt.confidence}% match</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-700 dark:text-emerald-400 text-xs">+{evt.pointsGenerated} pts</span>
                      <span className="text-[8px] text-slate-400 block">{evt.timestamp}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No objects sorted yet. Place an object to begin!
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Custom Object Creator Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Add Custom Waste Object to Robot
              </h3>
              <button 
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomItem} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bel-Aqua Mineral Bottle, Indomie Box"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Waste Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => {
                      const cat = e.target.value as WasteCategory;
                      setCustomCategory(cat);
                      if (cat === 'PLASTIC') {
                        setCustomMaterial('PET Plastic');
                        setCustomIcon('🥤');
                      } else if (cat === 'METAL') {
                        setCustomMaterial('Aluminum Can');
                        setCustomIcon('🥫');
                      } else if (cat === 'PAPER') {
                        setCustomMaterial('Corrugated Paper');
                        setCustomIcon('📦');
                      } else if (cat === 'GLASS') {
                        setCustomMaterial('Glass Beverage');
                        setCustomIcon('🍾');
                      } else {
                        setCustomMaterial('Electronic Circuit');
                        setCustomIcon('📱');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="PLASTIC">Plastic</option>
                    <option value="METAL">Metal</option>
                    <option value="PAPER">Paper / Cardboard</option>
                    <option value="GLASS">Glass</option>
                    <option value="E_WASTE">E-Waste</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Estimated Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="5.0"
                    value={customWeight}
                    onChange={(e) => setCustomWeight(parseFloat(e.target.value) || 0.1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Item Icon Emoji
                </label>
                <div className="flex gap-2">
                  {['🥤', '💧', '🛢️', '🥫', '📦', '📰', '🍾', '📱', '🔋', '⚙️'].map(emoji => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setCustomIcon(emoji)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all cursor-pointer ${
                        customIcon === emoji
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md cursor-pointer"
                >
                  Place on Robot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visual Modal Overlay: Triggered when a bin reaches Maximum Capacity (10 items) */}
      {fullBinModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setFullBinModal(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border-2 border-rose-500/80 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden text-slate-900 dark:text-white transform animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Background Glow matching category */}
            <div className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-30 pointer-events-none ${
              fullBinModal === 'PLASTIC' ? 'bg-blue-500' :
              fullBinModal === 'METAL' ? 'bg-amber-500' :
              fullBinModal === 'PAPER' ? 'bg-emerald-500' :
              fullBinModal === 'GLASS' ? 'bg-cyan-500' :
              'bg-purple-500'
            }`} />

            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setFullBinModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Dismiss alert"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Icon and Alert Badge */}
            <div className="flex items-start gap-4 mb-4">
              <div className="relative shrink-0">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md border ${
                  fullBinModal === 'PLASTIC' ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800' :
                  fullBinModal === 'METAL' ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800' :
                  fullBinModal === 'PAPER' ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800' :
                  fullBinModal === 'GLASS' ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-800' :
                  'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800'
                }`}>
                  {fullBinModal === 'PLASTIC' ? '🥤' :
                   fullBinModal === 'METAL' ? '🥫' :
                   fullBinModal === 'PAPER' ? '📦' :
                   fullBinModal === 'GLASS' ? '🍾' : '📱'}
                </div>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 mb-1.5 animate-pulse">
                  <Flame className="w-3 h-3 text-rose-600" />
                  Maximum Bin Capacity Reached
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                  {fullBinModal} Bin is FULL (10/10 Items)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Sorting into this category is locked to prevent chamber overflow and cross-contamination.
                </p>
              </div>
            </div>

            {/* Capacity Status Card */}
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 my-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-rose-500" /> Holding Chamber Fill Level:
                </span>
                <span className="font-black text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-md border border-rose-300 dark:border-rose-800">
                  {binCounts[fullBinModal]}/{BIN_MAX_CAPACITY} (100% FULL)
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden p-0.5">
                <div className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full w-full animate-pulse" />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <span>EPA Ghana Segregation Standard</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">Decanting Required</span>
              </div>
            </div>

            {/* Explanatory Note */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2 mb-5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                To continue sorting <strong>{fullBinModal.toLowerCase()}</strong> items, please empty this bin. You can empty this bin or clear all receptacles at once.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleEmptyBin(fullBinModal)}
                disabled={isBusySorting}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Trash2 className="w-4 h-4" />
                <span>Empty {fullBinModal} Bin</span>
              </button>

              <button
                type="button"
                onClick={handleEmptyAllBins}
                disabled={isBusySorting}
                className="w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Empty All Bins
              </button>

              <button
                type="button"
                onClick={() => setFullBinModal(null)}
                className="w-full sm:w-auto py-3 px-3 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
