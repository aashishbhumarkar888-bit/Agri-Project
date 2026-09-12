import { 
  BookingToken, 
  MandiCentre, 
  QueueLaneInfo, 
  HardwareWeighbridgeTelemetry, 
  ParityMetric, 
  LedgerEvent, 
  P2PMeshState 
} from '../types';

export const INITIAL_CENTRES: MandiCentre[] = [
  {
    id: 'centre_04',
    name: 'Bhopal Mandi Complex — Yard 04',
    code: 'BPL-APMC-04',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    status: 'OPERATIONAL',
    distanceKm: 4.2,
    activeLanes: 3,
    avgWaitMins: 22,
    hardwareTier: 'TIER_1_ATTESTED',
    networkStatus: 'ONLINE_CLOUD',
    capacity: {
      cMaxQtl: 10000,
      physicalOccupiedQtl: 6200,
      futureReservedQtl: 2100,
      lastAuditTimestamp: new Date().toLocaleTimeString(),
      isBookingPaused: false,
      silos: [
        { id: 'silo_wht_1', name: 'Grain Silo Alpha (Wheat)', crop: 'wheat', capacityQtl: 4000, currentLoadQtl: 2850, sensorDepthMeters: 14.2, tempCelsius: 24.5, status: 'OPTIMAL' },
        { id: 'silo_wht_2', name: 'Grain Silo Beta (Wheat)', crop: 'wheat', capacityQtl: 3000, currentLoadQtl: 1900, sensorDepthMeters: 9.8, tempCelsius: 23.8, status: 'OPTIMAL' },
        { id: 'silo_soy_1', name: 'Grain Silo Gamma (Soybean)', crop: 'soybean', capacityQtl: 3000, currentLoadQtl: 1450, sensorDepthMeters: 7.1, tempCelsius: 25.1, status: 'OPTIMAL' },
      ]
    }
  },
  {
    id: 'centre_02',
    name: 'Sehore Sub-Mandi Hub',
    code: 'SEH-APMC-02',
    district: 'Sehore',
    state: 'Madhya Pradesh',
    status: 'HIGH_PRESSURE',
    distanceKm: 18.5,
    activeLanes: 2,
    avgWaitMins: 48,
    hardwareTier: 'TIER_1_ATTESTED',
    networkStatus: 'ONLINE_CLOUD',
    capacity: {
      cMaxQtl: 8000,
      physicalOccupiedQtl: 5600,
      futureReservedQtl: 1900,
      lastAuditTimestamp: new Date().toLocaleTimeString(),
      isBookingPaused: false,
      silos: [
        { id: 'silo_seh_1', name: 'Primary Warehouse 01', crop: 'wheat', capacityQtl: 5000, currentLoadQtl: 3600, sensorDepthMeters: 11.0, tempCelsius: 26.0, status: 'NEAR_THRESHOLD' },
        { id: 'silo_seh_2', name: 'Primary Warehouse 02', crop: 'paddy', capacityQtl: 3000, currentLoadQtl: 2000, sensorDepthMeters: 8.5, tempCelsius: 25.4, status: 'OPTIMAL' }
      ]
    }
  },
  {
    id: 'centre_09',
    name: 'Vidisha Outer Grain Depot',
    code: 'VID-APMC-09',
    district: 'Vidisha',
    state: 'Madhya Pradesh',
    status: 'CAPACITY_PAUSED',
    distanceKm: 34.0,
    activeLanes: 1,
    avgWaitMins: 90,
    hardwareTier: 'TIER_2_OBSERVED',
    networkStatus: 'P2P_MESH_ONLY',
    capacity: {
      cMaxQtl: 5000,
      physicalOccupiedQtl: 4200,
      futureReservedQtl: 800,
      lastAuditTimestamp: new Date().toLocaleTimeString(),
      isBookingPaused: true,
      silos: [
        { id: 'silo_vid_1', name: 'Storage Vault A', crop: 'wheat', capacityQtl: 5000, currentLoadQtl: 4200, sensorDepthMeters: 16.8, tempCelsius: 28.0, status: 'CRITICAL' }
      ]
    }
  }
];

export const INITIAL_TOKENS: BookingToken[] = [
  {
    id: 'CG-WHT-2841',
    farmerId: 'FARM-MP-7721',
    farmerName: 'Ramesh Patel',
    maskedId: 'VID-XXXX-4819',
    crop: 'wheat',
    cropGrade: 'FAQ (Fair Average Quality)',
    estimatedQuantityQtl: 50.00,
    actualNetWeightQtl: 46.15,
    grossWeightQtl: 74.25,
    tareWeightQtl: 28.10,
    centreId: 'centre_04',
    centreName: 'Bhopal Mandi Complex — Yard 04',
    slotWindow: '10:00 AM - 11:00 AM',
    expectedTurnWindow: '10:20 AM - 10:50 AM',
    status: 'WEIGHING',
    vehicleType: 'tractor',
    vehicleNumber: 'MP-04-AB-9842',
    laneId: 'lane_normal',
    createdAt: '2026-09-12 08:30:14',
    checkInTime: '2026-09-12 09:48:22',
    weighTime: '2026-09-12 10:14:05',
    moisturePercent: 11.4,
    dockBay: 'Bay-02',
    paymentStatus: 'RECONCILING',
    paymentRef: 'DBT-SBIN-20260912-9842',
    bankReconciliationCode: 'PFMS-REC-OK-0941',
    amountInr: 104991.25,
    mspRateInrPerQtl: 2275,
    trustTier: 'TIER_1_ATTESTED',
    signatureHash: '0x8f7a2d48...c491'
  },
  {
    id: 'CG-SOY-2842',
    farmerId: 'FARM-MP-9012',
    farmerName: 'Baldev Singh Dhillon',
    maskedId: 'VID-XXXX-7104',
    crop: 'soybean',
    cropGrade: 'Grade-A',
    estimatedQuantityQtl: 140.00,
    centreId: 'centre_04',
    centreName: 'Bhopal Mandi Complex — Yard 04',
    slotWindow: '10:30 AM - 11:30 AM',
    expectedTurnWindow: '10:50 AM - 11:35 AM',
    status: 'QUEUED',
    vehicleType: 'semi_trailer',
    vehicleNumber: 'MP-09-CD-3108',
    laneId: 'lane_exception',
    createdAt: '2026-09-12 08:45:00',
    checkInTime: '2026-09-12 10:02:11',
    moisturePercent: 9.8,
    paymentStatus: 'NOT_INITIATED',
    mspRateInrPerQtl: 4892,
    trustTier: 'TIER_1_ATTESTED'
  },
  {
    id: 'CG-WHT-2843',
    farmerId: 'FARM-MP-3310',
    farmerName: 'Kamla Bai Sharma',
    maskedId: 'VID-XXXX-3391',
    crop: 'wheat',
    cropGrade: 'Standard',
    estimatedQuantityQtl: 25.00,
    centreId: 'centre_04',
    centreName: 'Bhopal Mandi Complex — Yard 04',
    slotWindow: '11:00 AM - 12:00 PM',
    expectedTurnWindow: '11:15 AM - 11:40 AM',
    status: 'GATE_CHECKIN',
    vehicleType: 'small_commercial',
    vehicleNumber: 'MP-04-E-5520',
    laneId: 'lane_assisted',
    createdAt: '2026-09-12 09:10:44',
    moisturePercent: 11.9,
    paymentStatus: 'NOT_INITIATED',
    mspRateInrPerQtl: 2275,
    trustTier: 'TIER_1_ATTESTED'
  },
  {
    id: 'CG-PDY-2840',
    farmerId: 'FARM-MP-1189',
    farmerName: 'Shivraj Singh Chouhan',
    maskedId: 'VID-XXXX-9920',
    crop: 'paddy',
    cropGrade: 'Grade-A',
    estimatedQuantityQtl: 80.00,
    actualNetWeightQtl: 82.40,
    grossWeightQtl: 112.50,
    tareWeightQtl: 30.10,
    centreId: 'centre_04',
    centreName: 'Bhopal Mandi Complex — Yard 04',
    slotWindow: '09:00 AM - 10:00 AM',
    expectedTurnWindow: '09:15 AM - 09:45 AM',
    status: 'PROCUREMENT_COMPLETE',
    vehicleType: 'tractor',
    vehicleNumber: 'MP-04-ZA-1102',
    laneId: 'lane_normal',
    createdAt: '2026-09-12 07:40:19',
    checkInTime: '2026-09-12 08:55:00',
    weighTime: '2026-09-12 09:20:15',
    qualityPassedTime: '2026-09-12 09:35:40',
    moisturePercent: 13.2,
    dockBay: 'Bay-01',
    paymentStatus: 'PROCESSING',
    paymentRef: 'DBT-SBIN-20260912-1102',
    bankReconciliationCode: 'PFMS-STG-2-RUNNING',
    amountInr: 189520.00,
    mspRateInrPerQtl: 2300,
    trustTier: 'TIER_1_ATTESTED',
    signatureHash: '0x3c990bfa...77a1'
  }
];

export const INITIAL_LANES: QueueLaneInfo[] = [
  {
    id: 'lane_normal',
    name: 'Normal Standard Queue',
    code: 'Q1 Normal',
    count: 6,
    creditDeficitMin: 24, // +24 min credit
    activeVehicleId: 'CG-WHT-2841',
    activeVehicleEptMin: 14,
    isNonPreemptiveLocked: false,
    color: '#203864'
  },
  {
    id: 'lane_exception',
    name: 'Heavy / Oversized Logistics Lane',
    code: 'Q2 Exception',
    count: 2,
    creditDeficitMin: -18, // -18 min deficit
    activeVehicleId: 'CG-SOY-2842',
    activeVehicleEptMin: 26,
    isNonPreemptiveLocked: true, // Semi-trailer non-preemptive lock
    color: '#F47920'
  },
  {
    id: 'lane_assisted',
    name: 'Walk-in & CSC Assisted Lane',
    code: 'Q3 Assisted',
    count: 3,
    creditDeficitMin: 11, // +11 min credit
    activeVehicleId: null,
    activeVehicleEptMin: 0,
    isNonPreemptiveLocked: false,
    color: '#228B22'
  }
];

export const INITIAL_HARDWARE: HardwareWeighbridgeTelemetry = {
  deviceId: 'ESP32-WB-04A',
  macAddress: 'A4:CF:12:88:9B:4E',
  firmwareVersion: 'v2.8.4-secure-boot-t1',
  trustTier: 'TIER_1_ATTESTED',
  isLocked: true,
  grossWeightQtl: 74.25,
  tareWeightQtl: 28.10,
  netPayloadQtl: 46.15,
  loadCells: [18.55, 18.57, 18.56, 18.57], // balanced 4-cell platform in quintals
  connectionPipeline: {
    rs232: true,
    esp32Core: true,
    mqttBus: true,
    stateEngine: true,
    physicalLock: true
  },
  latencyMs: 14,
  driftSkewKg: 0.2,
  calibrationCertifiedDate: '2026-08-15',
  supervisorBypassActive: false,
  lastHeartbeat: 'Just now'
};

export const INITIAL_PARITY: ParityMetric = {
  sensorPlatformLoadQtl: 74.25,
  digitalAllocatedQtl: 74.25,
  skewDriftQtl: 0.00,
  barrierState: 'LOCKED' as any,
  loadCellHealthPct: 99.8,
  ecdsaAttestationStatus: 'VALID_ECDSA_SECP256R1',
  lastParityAuditTime: '10:39:12'
};

export const INITIAL_LEDGER_EVENTS: LedgerEvent[] = [
  {
    id: 'EV-849109',
    aggregateId: 'AGG-CG-WHT-2841',
    eventType: 'LOAD_CELL_GROSS_LOCKED',
    trustTier: 'TIER_1_ATTESTED',
    timestamp: '2026-09-12 10:14:05',
    operator: 'R. K. Sharma (OP-41)',
    sequence: 1042,
    payloadSummary: 'Gross load cell stabilization at 74.25 q with ECDSA attestation key WB04-01',
    signature: '3045022100e4ab891c9f4...77a8',
    currentHash: 'b4a8e2193dc587a892b19283fcc401829e1',
    prevHash: '8910fbc281e4a8109d78e71bca4912002e4',
    deviceOrigin: 'ESP32-WB-04A'
  },
  {
    id: 'EV-849108',
    aggregateId: 'AGG-CG-WHT-2841',
    eventType: 'LOAD_CELL_TARE_CAPTURED',
    trustTier: 'TIER_1_ATTESTED',
    timestamp: '2026-09-12 09:55:18',
    operator: 'R. K. Sharma (OP-41)',
    sequence: 1041,
    payloadSummary: 'Tractor tare baseline captured at 28.10 q; barrier cycle check passed',
    signature: '304402207a99f1c08d...391b',
    currentHash: '8910fbc281e4a8109d78e71bca4912002e4',
    prevHash: '19a8427fcd8109e2b109c48192ab470129a',
    deviceOrigin: 'ESP32-WB-04A'
  },
  {
    id: 'EV-849107',
    aggregateId: 'AGG-CG-WHT-2841',
    eventType: 'GATE_CHECKIN_REGISTERED',
    trustTier: 'TIER_1_ATTESTED',
    timestamp: '2026-09-12 09:48:22',
    operator: 'Gate Sensor ANPR-04',
    sequence: 1040,
    payloadSummary: 'ANPR MP-04-AB-9842 verified against Token CG-WHT-2841; barrier unlocked',
    signature: '3045022100fa8819c9...4912',
    currentHash: '19a8427fcd8109e2b109c48192ab470129a',
    prevHash: '7291afb49102c8172901bca910293847192',
    deviceOrigin: 'GATE-ANPR-04'
  },
  {
    id: 'EV-849106',
    aggregateId: 'AGG-CG-PDY-2840',
    eventType: 'SILO_DISCHARGE_CONFIRMED',
    trustTier: 'TIER_1_ATTESTED',
    timestamp: '2026-09-12 09:35:40',
    operator: 'M. Verma (OP-09)',
    sequence: 1039,
    payloadSummary: 'Discharged 82.40 q Paddy into Silo Beta; Auger feeder sensor verified flow',
    signature: '30440220c81920ac...9941',
    currentHash: '7291afb49102c8172901bca910293847192',
    prevHash: '481920fcbad81029c719283f01928471920',
    deviceOrigin: 'AUGER-SILO-02'
  },
  {
    id: 'EV-849105',
    aggregateId: 'AGG-P2P-LEASE-09',
    eventType: 'P2P_QUOTA_LEASE_GRANTED',
    trustTier: 'TIER_1_ATTESTED',
    timestamp: '2026-09-12 09:12:00',
    operator: 'P2P Ratchet Controller',
    sequence: 1038,
    payloadSummary: 'Leased 300 q buffer quota to Mobile Terminal MT-02 under offline condition',
    signature: '30450221008891ac...2201',
    currentHash: '481920fcbad81029c719283f01928471920',
    prevHash: '992019fabc81029c7192847192038102938',
    deviceOrigin: 'P2P-NODE-MASTER'
  }
];

export const INITIAL_P2P_STATE: P2PMeshState = {
  isMeshOnline: true,
  peerCount: 4,
  localEventsCount: 0,
  localQuotaQtl: 850,
  indexedDbHealthy: true,
  cryptographicRatchetStep: 14,
  quorumConsensus: 'REACHED',
  transfers: [
    {
      id: 'P2P-TX-984',
      sourceDevice: 'ESP32-MASTER-04',
      targetDevice: 'ROUGH-TERMINAL-02',
      quantityQtl: 150,
      stage: 'ACKNOWLEDGE',
      timestamp: '2026-09-12 09:12:15',
      certificateId: 'CERT-RATCHET-88190-Q'
    }
  ]
};
