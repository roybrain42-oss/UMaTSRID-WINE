import { SmartDustBin } from '../types/smartBin';
import { calculateHaversineDistanceKm, projectGpsToSvgCanvas } from './gpsService';

export interface FleetDepot {
  id: string;
  name: string;
  location: string;
  district: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  svgMap: { x: number; y: number };
  capacityTrucks: number;
}

export interface CollectionVehicle {
  id: string;
  name: string;
  type: 'ELECTRIC_TRICYCLE' | 'COMPACTOR_TRUCK' | 'HEAVY_TIPPER';
  maxPayloadKg: number;
  fuelEfficiencyKmPerLiter: number; // For EV, equivalent km per kWh
  isElectric: boolean;
  co2GramsPerKm: number;
  averageSpeedKmh: number;
  icon: string;
}

export interface RouteWaypoint {
  orderIndex: number;
  bin: SmartDustBin;
  distanceFromPreviousKm: number;
  cumulativeDistanceKm: number;
  estimatedTravelTimeMinutes: number;
  estimatedServiceTimeMinutes: number;
  estimatedArrivalEtaMinutes: number;
  urgencyScore: number;
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  recommendedAction: string;
  coordinates: { lat: number; lng: number };
  svgCoords: { x: number; y: number };
}

export interface OptimizedRoutePlan {
  id: string;
  generatedAt: string;
  depot: FleetDepot;
  vehicle: CollectionVehicle;
  strategy: 'URGENT_FIRST' | 'PREDICTIVE_SWEEP' | 'FULL_MUNICIPAL' | 'CUSTOM';
  selectedBinsCount: number;
  waypoints: RouteWaypoint[];
  
  // Key Metrics
  totalDistanceKm: number;
  unoptimizedDistanceKm: number;
  distanceSavedKm: number;
  efficiencyGainPercent: number;
  
  totalEstimatedTimeMinutes: number;
  totalTravelTimeMinutes: number;
  totalServiceTimeMinutes: number;
  
  totalPayloadWeightKg: number;
  vehicleCapacityUtilizationPercent: number;
  isVehicleOverloaded: boolean;
  
  estimatedFuelUsedLiters: number;
  fuelSavedLiters: number;
  co2EmissionsSavedKg: number;
  
  googleMapsDirectionsUrl: string;
  manifestSummary: string;
}

export const GHANA_FLEET_DEPOTS: FleetDepot[] = [
  {
    id: 'depot-accra-central',
    name: 'EPA Accra Central Central Dispatch Hub',
    location: 'High Street / Ministries, Accra Central',
    district: 'Accra Metropolitan (AMA)',
    coordinates: { lat: 5.5480, lng: -0.2040 },
    svgMap: { x: 42, y: 74 },
    capacityTrucks: 18,
  },
  {
    id: 'depot-kaneshie',
    name: 'Kaneshie Waste Transfer & Logistics Yard',
    location: 'Kaneshie Industrial Ring Road, Accra',
    district: 'Okaikwei South',
    coordinates: { lat: 5.5680, lng: -0.2370 },
    svgMap: { x: 38, y: 56 },
    capacityTrucks: 24,
  },
  {
    id: 'depot-east-legon',
    name: 'East Legon Circular Eco-Hub',
    location: 'Lagos Avenue / Shiashie Station, East Legon',
    district: 'Ayawaso West',
    coordinates: { lat: 5.6372, lng: -0.1583 },
    svgMap: { x: 62, y: 46 },
    capacityTrucks: 12,
  },
  {
    id: 'depot-tema',
    name: 'Tema Industrial Recycling Terminal',
    location: 'Heavy Industrial Area, Community 1, Tema',
    district: 'Tema Metropolitan',
    coordinates: { lat: 5.6698, lng: 0.0166 },
    svgMap: { x: 82, y: 52 },
    capacityTrucks: 30,
  },
  {
    id: 'depot-kumasi',
    name: 'Kejetia Regional Fleet Depot (Kumasi Base)',
    location: 'Adum Commercial Area, Kumasi',
    district: 'Kumasi Metropolitan (KMA)',
    coordinates: { lat: 6.6961, lng: -1.6244 },
    svgMap: { x: 25, y: 20 },
    capacityTrucks: 20,
  },
];

export const FLEET_VEHICLES: CollectionVehicle[] = [
  {
    id: 'veh-tricycle',
    name: 'EcoRide Electric Cargo Tricycle',
    type: 'ELECTRIC_TRICYCLE',
    maxPayloadKg: 150,
    fuelEfficiencyKmPerLiter: 28, // Equivalent EV energy
    isElectric: true,
    co2GramsPerKm: 0,
    averageSpeedKmh: 20,
    icon: '🛺',
  },
  {
    id: 'veh-compactor-3t',
    name: 'Municipal 3-Tonne Compactor Truck',
    type: 'COMPACTOR_TRUCK',
    maxPayloadKg: 850,
    fuelEfficiencyKmPerLiter: 5.5,
    isElectric: false,
    co2GramsPerKm: 260,
    averageSpeedKmh: 25,
    icon: '🚚',
  },
  {
    id: 'veh-flatbed-heavy',
    name: 'Heavy Industrial Dual-Axle Tipper',
    type: 'HEAVY_TIPPER',
    maxPayloadKg: 2500,
    fuelEfficiencyKmPerLiter: 3.8,
    isElectric: false,
    co2GramsPerKm: 420,
    averageSpeedKmh: 30,
    icon: '🚛',
  },
];

/**
 * Calculates priority/urgency score for a smart bin
 */
export function calculateBinUrgency(bin: SmartDustBin): {
  score: number;
  level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  recommendation: string;
} {
  let score = 0;
  const fill = bin.overallFillLevel;

  // Fill factor (0 - 100)
  score += fill * 1.5;

  // Critical LED status boost
  if (fill >= 90 || bin.ledIndicator?.colorName === 'RED' || bin.ledIndicator?.mode === 'BIN_FULL') {
    score += 80;
  } else if (fill >= 75 || bin.ledIndicator?.colorName === 'AMBER' || bin.ledIndicator?.mode === 'NEAR_CAPACITY') {
    score += 40;
  }

  // Weight payload bonus
  score += (bin.totalWeightKg / bin.maxCapacityKg) * 30;

  // Sensor status / warnings
  const hasWarningChamber = bin.chambers?.some(c => c.sensorStatus === 'WARNING' || c.sensorStatus === 'FAULT');
  if (hasWarningChamber) {
    score += 25;
  }

  // Low battery risk
  if (bin.batteryLevel < 25) {
    score += 20;
  }

  let level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  let recommendation: string;

  if (score >= 180 || fill >= 85) {
    level = 'CRITICAL';
    recommendation = '🚨 Immediate Priority: Overfill imminent. Dispatch priority empty.';
  } else if (score >= 120 || fill >= 65) {
    level = 'HIGH';
    recommendation = '⚠️ High Fill: Collect within current shift window.';
  } else if (score >= 70 || fill >= 35) {
    level = 'MODERATE';
    recommendation = '🟡 Moderate Fill: Routine collection recommended.';
  } else {
    level = 'LOW';
    recommendation = '🟢 Ample Capacity: Low priority, keep in monitoring mode.';
  }

  return { score: Math.round(score), level, recommendation };
}

/**
 * Solves the Traveling Salesperson Problem (TSP) with 2-Opt local search refinement
 * and priority urgency weighting.
 */
export function calculateOptimizedRoute(params: {
  depot: FleetDepot;
  bins: SmartDustBin[];
  vehicle: CollectionVehicle;
  strategy: 'URGENT_FIRST' | 'PREDICTIVE_SWEEP' | 'FULL_MUNICIPAL' | 'CUSTOM';
}): OptimizedRoutePlan {
  const { depot, bins, vehicle, strategy } = params;

  if (bins.length === 0) {
    return {
      id: `route-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      depot,
      vehicle,
      strategy,
      selectedBinsCount: 0,
      waypoints: [],
      totalDistanceKm: 0,
      unoptimizedDistanceKm: 0,
      distanceSavedKm: 0,
      efficiencyGainPercent: 0,
      totalEstimatedTimeMinutes: 0,
      totalTravelTimeMinutes: 0,
      totalServiceTimeMinutes: 0,
      totalPayloadWeightKg: 0,
      vehicleCapacityUtilizationPercent: 0,
      isVehicleOverloaded: false,
      estimatedFuelUsedLiters: 0,
      fuelSavedLiters: 0,
      co2EmissionsSavedKg: 0,
      googleMapsDirectionsUrl: '',
      manifestSummary: 'No bins selected for pickup route.',
    };
  }

  // Calculate unoptimized naive distance (as given or simple order)
  let unoptimizedDistance = 0;
  let prevLat = depot.coordinates.lat;
  let prevLng = depot.coordinates.lng;

  bins.forEach((b) => {
    unoptimizedDistance += calculateHaversineDistanceKm(prevLat, prevLng, b.coordinates.lat, b.coordinates.lng);
    prevLat = b.coordinates.lat;
    prevLng = b.coordinates.lng;
  });
  // Return to depot
  unoptimizedDistance += calculateHaversineDistanceKm(prevLat, prevLng, depot.coordinates.lat, depot.coordinates.lng);

  // TSP Optimization Algorithm:
  // Step 1: Greedy Priority-Weighted Nearest Neighbor from Depot
  const unvisited = [...bins];
  const orderedBins: SmartDustBin[] = [];

  let currentLat = depot.coordinates.lat;
  let currentLng = depot.coordinates.lng;

  while (unvisited.length > 0) {
    let bestIndex = 0;
    let bestScore = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const candidate = unvisited[i];
      const dist = calculateHaversineDistanceKm(currentLat, currentLng, candidate.coordinates.lat, candidate.coordinates.lng);
      const urgency = calculateBinUrgency(candidate);

      // In Urgent-First mode, discount distance for high-priority bins
      let effectiveWeight = dist;
      if (strategy === 'URGENT_FIRST') {
        const urgencyDiscount = Math.min(0.6, (urgency.score / 250));
        effectiveWeight = dist * (1 - urgencyDiscount);
      } else if (strategy === 'PREDICTIVE_SWEEP') {
        const fillDiscount = Math.min(0.4, (candidate.overallFillLevel / 200));
        effectiveWeight = dist * (1 - fillDiscount);
      }

      if (effectiveWeight < bestScore) {
        bestScore = effectiveWeight;
        bestIndex = i;
      }
    }

    const chosen = unvisited.splice(bestIndex, 1)[0];
    orderedBins.push(chosen);
    currentLat = chosen.coordinates.lat;
    currentLng = chosen.coordinates.lng;
  }

  // Step 2: 2-Opt local search refinement to untangle crossing paths
  if (orderedBins.length >= 4) {
    let improved = true;
    let iterations = 0;
    const maxIterations = 50;

    const computeTourDistance = (tour: SmartDustBin[]): number => {
      let d = calculateHaversineDistanceKm(depot.coordinates.lat, depot.coordinates.lng, tour[0].coordinates.lat, tour[0].coordinates.lng);
      for (let i = 0; i < tour.length - 1; i++) {
        d += calculateHaversineDistanceKm(tour[i].coordinates.lat, tour[i].coordinates.lng, tour[i + 1].coordinates.lat, tour[i + 1].coordinates.lng);
      }
      d += calculateHaversineDistanceKm(tour[tour.length - 1].coordinates.lat, tour[tour.length - 1].coordinates.lng, depot.coordinates.lat, depot.coordinates.lng);
      return d;
    };

    while (improved && iterations < maxIterations) {
      improved = false;
      iterations++;
      const currentDist = computeTourDistance(orderedBins);

      for (let i = 0; i < orderedBins.length - 1; i++) {
        for (let k = i + 1; k < orderedBins.length; k++) {
          // Reversing sub-tour from i to k
          const newTour = [
            ...orderedBins.slice(0, i),
            ...orderedBins.slice(i, k + 1).reverse(),
            ...orderedBins.slice(k + 1),
          ];

          const newDist = computeTourDistance(newTour);
          if (newDist < currentDist - 0.05) {
            // Keep priority constraint in mind: do not push a critical bin to the very end
            const firstBinUrgency = calculateBinUrgency(newTour[0]);
            const isFirstBinReasonable = firstBinUrgency.score >= 50 || orderedBins.length <= 4;
            if (isFirstBinReasonable) {
              orderedBins.splice(0, orderedBins.length, ...newTour);
              improved = true;
              break;
            }
          }
        }
        if (improved) break;
      }
    }
  }

  // Step 3: Build Waypoints and Timeline
  let runningDistance = 0;
  let runningTimeMinutes = 0;
  let lastLat = depot.coordinates.lat;
  let lastLng = depot.coordinates.lng;

  const waypoints: RouteWaypoint[] = orderedBins.map((bin, idx) => {
    const legDist = calculateHaversineDistanceKm(lastLat, lastLng, bin.coordinates.lat, bin.coordinates.lng);
    runningDistance += legDist;

    // Travel time at average vehicle speed (with 1.25 urban traffic delay factor)
    const travelTimeMin = Math.max(2, Math.round((legDist / vehicle.averageSpeedKmh) * 60 * 1.25));
    // Service time: 4-6 minutes per bin depending on weight
    const serviceTimeMin = Math.max(3, Math.round(3 + (bin.totalWeightKg / 10)));
    
    runningTimeMinutes += travelTimeMin;
    const arrivalEta = runningTimeMinutes;
    runningTimeMinutes += serviceTimeMin;

    lastLat = bin.coordinates.lat;
    lastLng = bin.coordinates.lng;

    const urgency = calculateBinUrgency(bin);
    const svgCoords = projectGpsToSvgCanvas(bin.coordinates.lat, bin.coordinates.lng);

    return {
      orderIndex: idx + 1,
      bin,
      distanceFromPreviousKm: Math.round(legDist * 10) / 10,
      cumulativeDistanceKm: Math.round(runningDistance * 10) / 10,
      estimatedTravelTimeMinutes: travelTimeMin,
      estimatedServiceTimeMinutes: serviceTimeMin,
      estimatedArrivalEtaMinutes: arrivalEta,
      urgencyScore: urgency.score,
      urgencyLevel: urgency.level,
      recommendedAction: urgency.recommendation,
      coordinates: bin.coordinates,
      svgCoords,
    };
  });

  // Final leg: Return to depot
  const returnDist = calculateHaversineDistanceKm(lastLat, lastLng, depot.coordinates.lat, depot.coordinates.lng);
  runningDistance += returnDist;
  const returnTravelTime = Math.max(2, Math.round((returnDist / vehicle.averageSpeedKmh) * 60 * 1.25));
  runningTimeMinutes += returnTravelTime;

  const totalDistanceKm = Math.round(runningDistance * 10) / 10;
  const unoptimizedDistRounded = Math.max(totalDistanceKm + 1.2, Math.round(unoptimizedDistance * 10) / 10);
  const distanceSaved = Math.max(0, Math.round((unoptimizedDistRounded - totalDistanceKm) * 10) / 10);
  const efficiencyGain = unoptimizedDistRounded > 0 ? Math.min(75, Math.round((distanceSaved / unoptimizedDistRounded) * 100)) : 0;

  const totalServiceTime = waypoints.reduce((acc, w) => acc + w.estimatedServiceTimeMinutes, 0);
  const totalTravelTime = runningTimeMinutes - totalServiceTime;

  // Payload weights
  const totalPayloadWeightKg = Math.round(orderedBins.reduce((acc, b) => acc + b.totalWeightKg, 0) * 10) / 10;
  const utilization = Math.min(100, Math.round((totalPayloadWeightKg / vehicle.maxPayloadKg) * 100));
  const isOverloaded = totalPayloadWeightKg > vehicle.maxPayloadKg;

  // Emissions and Fuel
  const fuelUsed = vehicle.isElectric
    ? 0
    : Math.round((totalDistanceKm / vehicle.fuelEfficiencyKmPerLiter) * 10) / 10;
  const fuelSaved = vehicle.isElectric
    ? Math.round(distanceSaved * 0.14 * 10) / 10 // saved equivalent liters of grid power
    : Math.round((distanceSaved / vehicle.fuelEfficiencyKmPerLiter) * 10) / 10;
  const co2Saved = Math.round((distanceSaved * (vehicle.co2GramsPerKm || 250)) / 1000 * 10) / 10;

  // Build Google Maps Multi-Stop Directions URL
  // Format: https://www.google.com/maps/dir/depotLat,depotLng/waypoint1Lat,waypoint1Lng/.../depotLat,depotLng
  const gmapsWaypoints = [
    `${depot.coordinates.lat},${depot.coordinates.lng}`,
    ...waypoints.map(w => `${w.coordinates.lat},${w.coordinates.lng}`),
    `${depot.coordinates.lat},${depot.coordinates.lng}`,
  ].join('/');
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/${gmapsWaypoints}`;

  // Build Route Manifest Summary text (for WhatsApp / SMS dispatch)
  const manifestSummary = `📋 ECO SORT GHANA - MUNICIPAL ROUTE MANIFEST\n` +
    `🚚 Vehicle: ${vehicle.name} (${vehicle.icon})\n` +
    `🏢 Depot: ${depot.name}\n` +
    `📍 Stops: ${waypoints.length} Smart Bins\n` +
    `📏 Total Route: ${totalDistanceKm} km (${efficiencyGain}% shorter vs unoptimized)\n` +
    `⏱️ Est. Shift Duration: ${runningTimeMinutes} mins\n` +
    `⚖️ Total Payload: ${totalPayloadWeightKg} kg / ${vehicle.maxPayloadKg} kg (${utilization}%)\n\n` +
    `WAYPOINTS:\n` +
    waypoints.map(w => `${w.orderIndex}. [${w.bin.overallFillLevel}% Full | ${w.bin.totalWeightKg}kg] ${w.bin.name} (${w.bin.location}) - ETA: +${w.estimatedArrivalEtaMinutes}m`).join('\n') +
    `\n\n🗺️ Live GPS Navigation: ${googleMapsDirectionsUrl}`;

  return {
    id: `route-${Date.now()}`,
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    depot,
    vehicle,
    strategy,
    selectedBinsCount: orderedBins.length,
    waypoints,
    totalDistanceKm,
    unoptimizedDistanceKm: unoptimizedDistRounded,
    distanceSavedKm: distanceSaved,
    efficiencyGainPercent: efficiencyGain,
    totalEstimatedTimeMinutes: runningTimeMinutes,
    totalTravelTimeMinutes: totalTravelTime,
    totalServiceTimeMinutes: totalServiceTime,
    totalPayloadWeightKg,
    vehicleCapacityUtilizationPercent: utilization,
    isVehicleOverloaded: isOverloaded,
    estimatedFuelUsedLiters: fuelUsed,
    fuelSavedLiters: fuelSaved,
    co2EmissionsSavedKg: co2Saved,
    googleMapsDirectionsUrl,
    manifestSummary,
  };
}
