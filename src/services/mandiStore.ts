import { 
  AppRole, 
  BookingToken, 
  CapacityState, 
  HardwareWeighbridgeTelemetry, 
  LedgerEvent, 
  MandiCentre, 
  P2PMeshState, 
  ParityMetric, 
  QueueLaneInfo, 
  TokenStatus,
  TrustTier
} from '../types';
import { 
  INITIAL_CENTRES, 
  INITIAL_HARDWARE, 
  INITIAL_LANES, 
  INITIAL_LEDGER_EVENTS, 
  INITIAL_P2P_STATE, 
  INITIAL_PARITY, 
  INITIAL_TOKENS 
} from '../data/mockData';

type Listener = () => void;

class MandiStore {
  private role: AppRole = 'staff'; // default view to Yard Staff / Digital Twin
  private selectedCentreId: string = 'centre_04';
  private centres: MandiCentre[] = [...INITIAL_CENTRES];
  private tokens: BookingToken[] = [...INITIAL_TOKENS];
  private lanes: QueueLaneInfo[] = [...INITIAL_LANES];
  private hardware: HardwareWeighbridgeTelemetry = { ...INITIAL_HARDWARE };
  private parity: ParityMetric = { ...INITIAL_PARITY };
  private ledgerEvents: LedgerEvent[] = [...INITIAL_LEDGER_EVENTS];
  private p2pState: P2PMeshState = { ...INITIAL_P2P_STATE };
  private isOfflineSimulated: boolean = false;
  private isDemoMode: boolean = false;
  private demoStep: number = 1;
  private selectedTokenId: string = 'CG-WHT-2841';
  private selected3DVehicleId: string | null = 'CG-WHT-2841';
  private notifications: { id: string; title: string; body: string; type: 'info' | 'warn' | 'success'; time: string }[] = [
    { id: 'notif-1', title: 'Hardware Attestation Active', body: 'ESP32 Tier 1 crypto-signature validated on Yard 04 weighbridge.', type: 'success', time: '10:14 AM' },
    { id: 'notif-2', title: 'WDRR Deficit Balancing', body: 'Q2 Exception Lane debt compensated by +24m Normal Lane credit.', type: 'info', time: '10:18 AM' }
  ];

  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // Getters
  getRole() { return this.role; }
  getSelectedCentreId() { return this.selectedCentreId; }
  getCentres() { return this.centres; }
  getSelectedCentre() { return this.centres.find(c => c.id === this.selectedCentreId) || this.centres[0]; }
  getTokens() { return this.tokens; }
  getSelectedToken() { return this.tokens.find(t => t.id === this.selectedTokenId) || this.tokens[0]; }
  getLanes() { return this.lanes; }
  getHardware() { return this.hardware; }
  getParity() { return this.parity; }
  getLedgerEvents() { return this.ledgerEvents; }
  getP2PState() { return this.p2pState; }
  isOffline() { return this.isOfflineSimulated; }
  isDemoActive() { return this.isDemoMode; }
  getDemoStep() { return this.demoStep; }
  getSelected3DVehicle() { return this.selected3DVehicleId; }
  getNotifications() { return this.notifications; }

  // Setters & Actions
  setRole(newRole: AppRole) {
    this.role = newRole;
    this.notify();
  }

  setSelectedCentre(id: string) {
    this.selectedCentreId = id;
    this.notify();
  }

  setSelectedToken(id: string) {
    this.selectedTokenId = id;
    this.notify();
  }

  setSelected3DVehicle(id: string | null) {
    this.selected3DVehicleId = id;
    this.notify();
  }

  addNotification(title: string, body: string, type: 'info' | 'warn' | 'success' = 'info') {
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title,
      body,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.notify();
  }

  // Booking Service Actions
  createBooking(booking: Omit<BookingToken, 'id' | 'status' | 'createdAt' | 'trustTier' | 'laneId'>): BookingToken {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = booking.crop.toUpperCase().slice(0, 3);
    const id = `CG-${prefix}-${randomNum}`;
    
    // Choose appropriate lane
    let laneId: any = 'lane_normal';
    if (booking.vehicleType === 'semi_trailer') {
      laneId = 'lane_exception';
    }

    const newToken: BookingToken = {
      ...booking,
      id,
      status: 'BOOKED',
      laneId,
      createdAt: new Date().toLocaleString(),
      trustTier: 'TIER_1_ATTESTED',
      signatureHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
    };

    this.tokens.unshift(newToken);
    this.selectedTokenId = id;

    // Update centre future reserved capacity invariant
    const centre = this.getSelectedCentre();
    centre.capacity.futureReservedQtl += booking.estimatedQuantityQtl;
    this.checkCapacitySafety(centre);

    // Record Immutable Ledger Event
    this.recordLedgerEvent({
      aggregateId: `AGG-${newToken.id}`,
      eventType: 'GATE_CHECKIN_REGISTERED',
      trustTier: 'TIER_1_ATTESTED',
      operator: 'Web Booking Gateway',
      payloadSummary: `New digital booking created for ${booking.farmerName} (${booking.crop}, ${booking.estimatedQuantityQtl} q). Token: ${id}`,
      deviceOrigin: 'CLOUD-PORTAL-IN'
    });

    this.addNotification('Procurement Token Issued', `Token ${id} confirmed for ${booking.estimatedQuantityQtl} quintals of ${booking.crop.toUpperCase()}.`, 'success');

    this.notify();
    return newToken;
  }

  advanceTokenState(tokenId: string, nextStatus: TokenStatus) {
    const token = this.tokens.find(t => t.id === tokenId);
    if (!token) return;

    token.status = nextStatus;

    if (nextStatus === 'GATE_CHECKIN') {
      token.checkInTime = new Date().toLocaleTimeString();
      this.recordLedgerEvent({
        aggregateId: `AGG-${token.id}`,
        eventType: 'GATE_CHECKIN_REGISTERED',
        trustTier: token.trustTier,
        operator: 'Physical Gate ANPR-04',
        payloadSummary: `Vehicle ${token.vehicleNumber} checked in at physical gate. Barrier opened.`,
        deviceOrigin: 'GATE-ANPR-04'
      });
      this.parity.barrierState = 'OPEN' as any;
    } else if (nextStatus === 'WEIGHING') {
      token.weighTime = new Date().toLocaleTimeString();
      token.grossWeightQtl = this.hardware.grossWeightQtl;
      token.tareWeightQtl = this.hardware.tareWeightQtl;
      token.actualNetWeightQtl = this.hardware.netPayloadQtl;
      this.recordLedgerEvent({
        aggregateId: `AGG-${token.id}`,
        eventType: 'LOAD_CELL_GROSS_LOCKED',
        trustTier: this.hardware.trustTier,
        operator: 'Weighbridge Staff OP-41',
        payloadSummary: `Physical gross weight ${token.grossWeightQtl} q captured. Tare: ${token.tareWeightQtl} q. Net: ${token.actualNetWeightQtl} q.`,
        deviceOrigin: this.hardware.deviceId
      });
    } else if (nextStatus === 'QUALITY_CHECK') {
      token.qualityPassedTime = new Date().toLocaleTimeString();
      this.recordLedgerEvent({
        aggregateId: `AGG-${token.id}`,
        eventType: 'QUALITY_ASSAY_SIGNED',
        trustTier: 'TIER_1_ATTESTED',
        operator: 'Assay Lab In-Charge',
        payloadSummary: `Quality grading approved. Moisture: ${token.moisturePercent}%. Grade: ${token.cropGrade}.`,
        deviceOrigin: 'NIR-GRAIN-ASSAY-02'
      });
    } else if (nextStatus === 'UNLOADING') {
      token.dockBay = 'Bay-02';
      const centre = this.getSelectedCentre();
      const weight = token.actualNetWeightQtl || token.estimatedQuantityQtl;
      centre.capacity.physicalOccupiedQtl += weight;
      centre.capacity.futureReservedQtl = Math.max(0, centre.capacity.futureReservedQtl - token.estimatedQuantityQtl);
      this.checkCapacitySafety(centre);

      this.recordLedgerEvent({
        aggregateId: `AGG-${token.id}`,
        eventType: 'SILO_DISCHARGE_CONFIRMED',
        trustTier: 'TIER_1_ATTESTED',
        operator: 'Yard Unloading Crane Bay-02',
        payloadSummary: `Material discharged into Silo Alpha. Load increased by ${weight} q.`,
        deviceOrigin: 'SILO-ALPHA-SCALE'
      });
    } else if (nextStatus === 'PROCUREMENT_COMPLETE') {
      token.paymentStatus = 'RECONCILING';
      token.amountInr = Math.round((token.actualNetWeightQtl || token.estimatedQuantityQtl) * token.mspRateInrPerQtl);
      token.paymentRef = `DBT-SBIN-${Date.now().toString().slice(-8)}`;
      token.bankReconciliationCode = `PFMS-STG-RECON-${Math.floor(1000 + Math.random() * 9000)}`;
      this.addNotification('Procurement Completed', `Physical handover completed for ${token.id}. Reconciling PFMS DBT payment of ₹${token.amountInr.toLocaleString()}.`, 'success');
    } else if (nextStatus === 'PAYMENT_RECONCILIATION') {
      token.paymentStatus = 'PROCESSING';
    } else if (nextStatus === 'SETTLED') {
      token.paymentStatus = 'SETTLED';
      this.recordLedgerEvent({
        aggregateId: `AGG-${token.id}`,
        eventType: 'PAYMENT_SETTLED',
        trustTier: 'TIER_1_ATTESTED',
        operator: 'PFMS Direct Benefit Transfer',
        payloadSummary: `Direct Benefit Transfer of ₹${token.amountInr?.toLocaleString()} settled to farmer bank account. Ref: ${token.paymentRef}`,
        deviceOrigin: 'PFMS-GATEWAY'
      });
      this.addNotification('DBT Payment Settled', `Payment of ₹${token.amountInr?.toLocaleString()} credited successfully.`, 'success');
    }

    this.notify();
  }

  // Capacity calculations & invariant enforcement
  private checkCapacitySafety(centre: MandiCentre) {
    const physicalAvailable = centre.capacity.cMaxQtl - centre.capacity.physicalOccupiedQtl;
    const safeAllocatable = physicalAvailable - centre.capacity.futureReservedQtl;
    if (safeAllocatable <= 0) {
      centre.capacity.isBookingPaused = true;
      centre.status = 'CAPACITY_PAUSED';
      this.addNotification('Capacity Limit Triggered', 'Safe allocatable capacity reached 0 quintals. New booking intake paused automatically.', 'warn');
    } else {
      centre.capacity.isBookingPaused = false;
      if (centre.status === 'CAPACITY_PAUSED') {
        centre.status = 'OPERATIONAL';
      }
    }
  }

  // Hardware Console updates
  updateWeighbridgeWeights(gross: number, tare: number) {
    const net = Math.max(0, +(gross - tare).toFixed(2));
    this.hardware.grossWeightQtl = gross;
    this.hardware.tareWeightQtl = tare;
    this.hardware.netPayloadQtl = net;
    this.hardware.lastHeartbeat = 'Just now';

    // Balance 4 load cells proportionally
    const perCell = +(gross / 4).toFixed(2);
    this.hardware.loadCells = [perCell, +(perCell + 0.02).toFixed(2), +(perCell - 0.01).toFixed(2), perCell];

    // Update parity
    this.parity.sensorPlatformLoadQtl = gross;
    this.parity.digitalAllocatedQtl = gross;
    this.parity.skewDriftQtl = 0.00;
    this.parity.lastParityAuditTime = new Date().toLocaleTimeString();

    this.notify();
  }

  toggleSupervisorBypass(active: boolean, reason?: string) {
    this.hardware.supervisorBypassActive = active;
    if (active) {
      this.hardware.trustTier = 'TIER_3_MANUAL';
      this.hardware.bypassReason = reason || 'Load cell cable jitter — manual optical tare verified';
      this.hardware.supervisorBypassAuthBy = 'SUPERVISOR-BPL-04';
      this.recordLedgerEvent({
        aggregateId: 'AGG-HW-BYPASS-04',
        eventType: 'HARDWARE_BYPASS_AUDIT',
        trustTier: 'TIER_3_MANUAL',
        operator: 'Supervisor S. Deshmukh',
        payloadSummary: `HARDWARE BYPASS FLAG RAISED. Reason: ${this.hardware.bypassReason}`,
        deviceOrigin: 'SUPERVISOR-CONSOLE-KEY'
      });
      this.addNotification('Hardware Bypass Warning', 'Weighbridge degraded to Tier 3 Manual Fallback. Audit logged.', 'warn');
    } else {
      this.hardware.trustTier = 'TIER_1_ATTESTED';
      this.hardware.supervisorBypassActive = false;
      this.hardware.bypassReason = undefined;
      this.hardware.supervisorBypassAuthBy = undefined;
      this.addNotification('Hardware Attested Restored', 'ESP32 secure boot attestation verified. Tier 1 restored.', 'success');
    }
    this.notify();
  }

  // Offline and P2P Mesh
  simulateOfflineCut(cut: boolean) {
    this.isOfflineSimulated = cut;
    this.p2pState.isMeshOnline = true; // Local mesh still works!
    if (cut) {
      this.getSelectedCentre().networkStatus = 'P2P_MESH_ONLY';
      this.addNotification('Network Disconnected', 'Cloud link severed. Local P2P mesh and IndexedDB offline buffer engaged.', 'warn');
    } else {
      this.getSelectedCentre().networkStatus = 'ONLINE_CLOUD';
      // Sync pending events
      const syncedCount = this.p2pState.localEventsCount;
      this.p2pState.localEventsCount = 0;
      this.addNotification('Cloud Link Reconnected', `Synced ${syncedCount} offline buffered events to APMC cloud ledger.`, 'success');
    }
    this.notify();
  }

  transferP2PQuota(source: string, target: string, quantityQtl: number) {
    if (this.p2pState.localQuotaQtl < quantityQtl) return false;
    
    this.p2pState.localQuotaQtl -= quantityQtl;
    this.p2pState.cryptographicRatchetStep += 1;
    this.p2pState.localEventsCount += 1;

    const transferId = `P2P-TX-${Math.floor(100 + Math.random() * 900)}`;
    this.p2pState.transfers.unshift({
      id: transferId,
      sourceDevice: source,
      targetDevice: target,
      quantityQtl,
      stage: 'ACKNOWLEDGE',
      timestamp: new Date().toLocaleTimeString(),
      certificateId: `CERT-RATCHET-${Math.floor(10000 + Math.random() * 90000)}-Q`
    });

    this.recordLedgerEvent({
      aggregateId: `AGG-${transferId}`,
      eventType: 'P2P_QUOTA_LEASE_GRANTED',
      trustTier: 'TIER_1_ATTESTED',
      operator: `Local P2P Ratchet (${source})`,
      payloadSummary: `P2P lease: Transferred ${quantityQtl} q capacity from ${source} to ${target}. Ratchet step: ${this.p2pState.cryptographicRatchetStep}`,
      deviceOrigin: source
    });

    this.addNotification('P2P Quota Transferred', `Successfully transferred ${quantityQtl} q to ${target} via local mesh.`, 'success');
    this.notify();
    return true;
  }

  // WDRR scheduler adjustments
  rebalanceWdrrLanes(normalDeltaMin: number, exceptionDeltaMin: number) {
    const normal = this.lanes.find(l => l.id === 'lane_normal');
    const exception = this.lanes.find(l => l.id === 'lane_exception');
    if (normal && exception) {
      normal.creditDeficitMin += normalDeltaMin;
      exception.creditDeficitMin += exceptionDeltaMin;
      this.notify();
    }
  }

  // Ledger
  private recordLedgerEvent(event: Omit<LedgerEvent, 'id' | 'timestamp' | 'sequence' | 'signature' | 'currentHash' | 'prevHash'>) {
    const prev = this.ledgerEvents[0];
    const prevHash = prev ? prev.currentHash : '0000000000000000000000000000000000000000';
    const sequence = prev ? prev.sequence + 1 : 1001;
    const randomHash = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const randomSig = `3045022100${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...${Math.floor(1000 + Math.random() * 9000)}`;

    const newEvent: LedgerEvent = {
      ...event,
      id: `EV-${Math.floor(849110 + Math.random() * 10000)}`,
      timestamp: new Date().toLocaleString(),
      sequence,
      signature: randomSig,
      currentHash: randomHash,
      prevHash
    };

    this.ledgerEvents.unshift(newEvent);
    if (this.isOfflineSimulated) {
      this.p2pState.localEventsCount += 1;
    }
  }

  // Demo Mode Playbook Controller
  setDemoMode(active: boolean) {
    this.isDemoMode = active;
    if (active) {
      this.demoStep = 1;
      this.addNotification('SIH 2026 Demo Mode Active', 'Interactive judge playbook initialized. Follow the 12-step guided walk-through.', 'info');
    }
    this.notify();
  }

  setDemoStep(step: number) {
    this.demoStep = step;
    // Execute corresponding action in the playbook
    this.executePlaybookStep(step);
    this.notify();
  }

  private executePlaybookStep(step: number) {
    switch (step) {
      case 1: // Create farmer booking
        this.setRole('farmer');
        break;
      case 2: // Show physical capacity
        this.setRole('staff');
        break;
      case 3: // Trigger large vehicle
        const tokenSemi = this.tokens.find(t => t.vehicleType === 'semi_trailer');
        if (tokenSemi) this.setSelectedToken(tokenSemi.id);
        break;
      case 4: // Show WDRR Exception lane
        const excLane = this.lanes.find(l => l.id === 'lane_exception');
        if (excLane) excLane.isNonPreemptiveLocked = true;
        break;
      case 5: // Change weighbridge value
        this.updateWeighbridgeWeights(88.50, 32.20);
        break;
      case 6: // Watch physical/digital parity update
        this.parity.sensorPlatformLoadQtl = 88.50;
        this.parity.digitalAllocatedQtl = 88.50;
        this.parity.skewDriftQtl = 0.00;
        break;
      case 7: // Cut network
        this.simulateOfflineCut(true);
        break;
      case 8: // Perform offline event
        this.recordLedgerEvent({
          aggregateId: 'AGG-OFFLINE-TEST',
          eventType: 'LOAD_CELL_TARE_CAPTURED',
          trustTier: 'TIER_1_ATTESTED',
          operator: 'Mobile Staff Device MT-01',
          payloadSummary: 'Captured local offline tare weight 28.10 q into browser IndexedDB buffer',
          deviceOrigin: 'TABLET-OFFLINE-01'
        });
        break;
      case 9: // Transfer local quota
        this.transferP2PQuota('ESP32-MASTER-04', 'TERMINAL-ROUGH-01', 120);
        break;
      case 10: // Reconnect
        this.simulateOfflineCut(false);
        break;
      case 11: // Replay event ledger
        this.setRole('supervisor');
        break;
      case 12: // Show payment reconciliation
        const pToken = this.tokens[0];
        if (pToken) {
          pToken.status = 'SETTLED';
          pToken.paymentStatus = 'SETTLED';
        }
        break;
    }
  }
}

export const mandiStore = new MandiStore();
