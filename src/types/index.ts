export type AppRole = 'farmer' | 'csc' | 'staff' | 'supervisor' | 'admin';

export type CropType = 'wheat' | 'paddy' | 'soybean' | 'maize' | 'mustard';

export type TokenStatus = 
  | 'BOOKED'
  | 'GATE_CHECKIN'
  | 'QUEUED'
  | 'WEIGHING'
  | 'QUALITY_CHECK'
  | 'UNLOADING'
  | 'PROCUREMENT_COMPLETE'
  | 'PAYMENT_RECONCILIATION'
  | 'SETTLED';

export type VehicleType = 'tractor' | 'small_commercial' | 'semi_trailer';

export type QueueLaneId = 'lane_normal' | 'lane_exception' | 'lane_assisted';

export type TrustTier = 'TIER_1_ATTESTED' | 'TIER_2_OBSERVED' | 'TIER_3_MANUAL';

export interface BookingToken {
  id: string; // e.g. CG-WHT-2841
  farmerId: string;
  farmerName: string;
  maskedId: string; // e.g. "VID-XXXX-4819"
  crop: CropType;
  cropGrade: 'FAQ (Fair Average Quality)' | 'Grade-A' | 'Standard';
  estimatedQuantityQtl: number;
  actualNetWeightQtl?: number;
  grossWeightQtl?: number;
  tareWeightQtl?: number;
  centreId: string;
  centreName: string;
  slotWindow: string; // "10:00 AM - 11:00 AM"
  expectedTurnWindow: string; // "10:20 AM - 10:50 AM"
  status: TokenStatus;
  vehicleType: VehicleType;
  vehicleNumber: string; // e.g. "MP-04-AB-9842"
  laneId: QueueLaneId;
  createdAt: string;
  checkInTime?: string;
  weighTime?: string;
  qualityPassedTime?: string;
  moisturePercent: number; // e.g. 11.4%
  dockBay?: string;
  paymentStatus: 'NOT_INITIATED' | 'RECONCILING' | 'PROCESSING' | 'SETTLED';
  paymentRef?: string;
  bankReconciliationCode?: string;
  amountInr?: number;
  mspRateInrPerQtl: number;
  trustTier: TrustTier;
  signatureHash?: string;
}

export interface QueueLaneInfo {
  id: QueueLaneId;
  name: string;
  code: string; // Q1, Q2, Q3
  count: number;
  creditDeficitMin: number; // e.g. +24 min or -18 min
  activeVehicleId: string | null;
  activeVehicleEptMin: number;
  isNonPreemptiveLocked: boolean;
  color: string;
}

export interface CapacityState {
  cMaxQtl: number; // 10,000 q
  physicalOccupiedQtl: number; // 6,200 q
  futureReservedQtl: number; // 2,100 q
  // Computed invariants:
  // physicalAvailable = cMax - physicalOccupied (3,800 q)
  // safeAllocatable = physicalAvailable - futureReserved (1,700 q)
  lastAuditTimestamp: string;
  isBookingPaused: boolean;
  silos: {
    id: string;
    name: string;
    crop: CropType;
    capacityQtl: number;
    currentLoadQtl: number;
    sensorDepthMeters: number;
    tempCelsius: number;
    status: 'OPTIMAL' | 'NEAR_THRESHOLD' | 'CRITICAL';
  }[];
}

export interface HardwareWeighbridgeTelemetry {
  deviceId: string; // e.g. "ESP32-WB-04A"
  macAddress: string;
  firmwareVersion: string;
  trustTier: TrustTier;
  isLocked: boolean;
  grossWeightQtl: number;
  tareWeightQtl: number;
  netPayloadQtl: number;
  loadCells: [number, number, number, number]; // [LC1, LC2, LC3, LC4] kg balance
  connectionPipeline: {
    rs232: boolean;
    esp32Core: boolean;
    mqttBus: boolean;
    stateEngine: boolean;
    physicalLock: boolean;
  };
  latencyMs: number;
  driftSkewKg: number;
  calibrationCertifiedDate: string;
  supervisorBypassActive: boolean;
  supervisorBypassAuthBy?: string;
  bypassReason?: string;
  lastHeartbeat: string;
}

export interface ParityMetric {
  sensorPlatformLoadQtl: number;
  digitalAllocatedQtl: number;
  skewDriftQtl: number;
  barrierState: 'CLOSED' | 'OPEN' | 'TRANSIT';
  loadCellHealthPct: number;
  ecdsaAttestationStatus: 'VALID_ECDSA_SECP256R1' | 'DEGRADED_LOCAL' | 'INVALID_HASH';
  lastParityAuditTime: string;
}

export interface LedgerEvent {
  id: string; // e.g. "EV-849102"
  aggregateId: string; // e.g. "AGG-TRUCK-MP04-9842"
  eventType: 
    | 'GATE_CHECKIN_REGISTERED'
    | 'LOAD_CELL_TARE_CAPTURED'
    | 'LOAD_CELL_GROSS_LOCKED'
    | 'QUALITY_ASSAY_SIGNED'
    | 'SILO_DISCHARGE_CONFIRMED'
    | 'P2P_QUOTA_LEASE_GRANTED'
    | 'HARDWARE_BYPASS_AUDIT'
    | 'PAYMENT_SETTLED';
  trustTier: TrustTier;
  timestamp: string;
  operator: string;
  sequence: number;
  payloadSummary: string;
  signature: string;
  currentHash: string;
  prevHash: string;
  deviceOrigin: string;
}

export interface P2PMeshState {
  isMeshOnline: boolean;
  peerCount: number;
  localEventsCount: number;
  localQuotaQtl: number;
  indexedDbHealthy: boolean;
  cryptographicRatchetStep: number;
  quorumConsensus: 'REACHED' | 'SYNCING' | 'ISOLATED';
  transfers: {
    id: string;
    sourceDevice: string;
    targetDevice: string;
    quantityQtl: number;
    stage: 'REQUEST' | 'GRANT' | 'COMMIT' | 'ACKNOWLEDGE';
    timestamp: string;
    certificateId: string;
  }[];
}

export interface MandiCentre {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  status: 'OPERATIONAL' | 'HIGH_PRESSURE' | 'CAPACITY_PAUSED';
  distanceKm: number;
  capacity: CapacityState;
  activeLanes: number;
  avgWaitMins: number;
  hardwareTier: TrustTier;
  networkStatus: 'ONLINE_CLOUD' | 'P2P_MESH_ONLY' | 'ISOLATED';
}
