import { FarmerProfile, FarmerCrop, NearbyCentreInfo, FarmerNotification, FarmerTab, FarmerJourneyStage } from '../types/farmer';
import { BookingToken, CropType, TokenStatus } from '../types';
import { MSP_RATES_2026 } from '../constants/designTokens';

type Listener = () => void;

const INITIAL_FARMER_PROFILE: FarmerProfile = {
  id: 'FARM-MP-8492',
  name: 'Ramesh Patel',
  mobile: '+91 98261 48291',
  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  village: 'Bilkisganj',
  block: 'Sehore',
  district: 'Sehore (Bhopal Region)',
  state: 'Madhya Pradesh',
  preferredLanguage: 'hi',
  maskedAadhaar: '•••• •••• 5821',
  virtualId: 'VID-9104-XXXX-4819',
  memberSince: 'October 2023',
  verificationScore: 92,
  isIdentityVerified: true,
  isKycComplete: true,
  isFarmVerified: true,
  isBankLinked: true,
  bankDetails: {
    bankName: 'State Bank of India',
    accountMasked: '•••• •••• 8842',
    ifsc: 'SBIN0001429',
    accountHolderName: 'Ramesh Patel',
    dbtStatus: 'ACTIVE'
  },
  farmDetails: {
    khasraNumber: 'Khasra 142/2 & 144/1',
    totalLandHectares: 4.8,
    cultivatedAreaHectares: 4.2,
    soilHealthCardNo: 'SHC-MP-2025-901',
    irrigationType: 'Tubewell + Canal Fed'
  }
};

const INITIAL_CROPS: FarmerCrop[] = [
  {
    id: 'crop-wht-1',
    crop: 'wheat',
    cropName: 'Sharbati Wheat (Grade FAQ)',
    season: 'Rabi 2026',
    variety: 'C-306 Gold',
    approxQuantityQtl: 50.0,
    mspRateInr: 2275,
    status: 'READY_FOR_PROCUREMENT',
    farmReference: 'North Plot (2.4 Ha)',
    lastUpdated: 'Today'
  },
  {
    id: 'crop-pdy-2',
    crop: 'paddy',
    cropName: 'Paddy / Dhan (Grade A)',
    season: 'Kharif 2025',
    variety: 'Kranti 1010',
    approxQuantityQtl: 75.0,
    mspRateInr: 2320,
    status: 'PROCURED',
    farmReference: 'Canal Basin (1.8 Ha)',
    lastUpdated: '12 Nov 2025'
  },
  {
    id: 'crop-soy-3',
    crop: 'soybean',
    cropName: 'Yellow Soybean',
    season: 'Kharif 2025',
    variety: 'JS-9560',
    approxQuantityQtl: 32.0,
    mspRateInr: 4892,
    status: 'PROCURED',
    farmReference: 'High Terrace (1.2 Ha)',
    lastUpdated: '28 Oct 2025'
  }
];

export const NEARBY_CENTRES: NearbyCentreInfo[] = [
  {
    id: 'centre_04',
    name: 'Bhopal Procurement Centre 04',
    code: 'BPL-CENTRE-04',
    distanceKm: 12,
    operatingCondition: 'OPERATING_SMOOTHLY',
    expectedWaitMins: '20–30 min',
    workingHours: '08:00 AM – 06:00 PM',
    supportedCrops: ['wheat', 'paddy', 'soybean', 'maize'],
    bookingCapacityStatus: 'SAFE',
    address: 'APMC Yard, Karond By-pass, Bhopal, MP',
    helpline: '1800-200-5196'
  },
  {
    id: 'centre_sehore',
    name: 'Sehore Agricultural Complex 01',
    code: 'SEH-CENTRE-01',
    distanceKm: 18,
    operatingCondition: 'OPERATING_SMOOTHLY',
    expectedWaitMins: '15–25 min',
    workingHours: '08:00 AM – 06:00 PM',
    supportedCrops: ['wheat', 'soybean', 'maize'],
    bookingCapacityStatus: 'SAFE',
    address: 'Mandi Road, Near Railway Siding, Sehore, MP',
    helpline: '1800-200-5196'
  },
  {
    id: 'centre_berasia',
    name: 'Berasia Mandi Sub-Yard',
    code: 'BRS-CENTRE-02',
    distanceKm: 28,
    operatingCondition: 'MODERATE_TRAFFIC',
    expectedWaitMins: '35–45 min',
    workingHours: '09:00 AM – 05:00 PM',
    supportedCrops: ['wheat', 'paddy'],
    bookingCapacityStatus: 'LIMITED',
    address: 'Narsinghgarh Road, Berasia, MP',
    helpline: '1800-200-5196'
  }
];

const INITIAL_NOTIFICATIONS: FarmerNotification[] = [
  {
    id: 'notif-1',
    category: 'Booking',
    title: 'Arrival Window Confirmed',
    message: 'Your slot at Bhopal Procurement Centre 04 is confirmed for 10:00–11:00 AM.',
    whatItMeans: 'A safe physical capacity buffer is reserved for your vehicle.',
    whatToDo: 'Arrive at Gate 1 with vehicle MP-04-AB-9842 and your Token CG-WHT-2841.',
    timestamp: '10:00 AM',
    read: false,
    type: 'success'
  },
  {
    id: 'notif-2',
    category: 'Queue',
    title: 'Expected Turn Window: 10:20–10:50 AM',
    message: 'Weighbridge processing is operating smoothly with 2 vehicles ahead.',
    whatItMeans: 'Your turn is scheduled without starvation delay.',
    whatToDo: 'Keep your vehicle in Lane Q1 and ensure driver is near the tractor.',
    timestamp: '10:15 AM',
    read: false,
    type: 'info'
  },
  {
    id: 'notif-3',
    category: 'Verification',
    title: 'Identity & Farm Land Verified',
    message: 'Land record Khasra 142/2 successfully verified with MP Bhulekh portal.',
    whatItMeans: 'Your profile is authorized for MSP Direct Benefit Transfer.',
    whatToDo: 'No action required. Your bank DBT account is linked.',
    timestamp: 'Yesterday',
    read: true,
    type: 'info'
  }
];

class FarmerStore {
  private activeTab: FarmerTab = 'home';
  private profile: FarmerProfile = { ...INITIAL_FARMER_PROFILE };
  private crops: FarmerCrop[] = [...INITIAL_CROPS];
  private notifications: FarmerNotification[] = [...INITIAL_NOTIFICATIONS];
  private selectedCentreId: string = 'centre_04';
  private isOffline: boolean = false;
  private hasSeenOnboarding: boolean = true;
  private showOnboardingModal: boolean = false;
  private showQrModal: boolean = false;
  private selectedMilestoneModal: FarmerJourneyStage | null = null;
  private demoStepIndex: number = 3; // Default at "Slot Booked" so user sees active state immediately

  // Active Token Model
  private activeToken: BookingToken = {
    id: 'CG-WHT-2841',
    farmerId: 'FARM-MP-8492',
    farmerName: 'Ramesh Patel',
    maskedId: 'VID-XXXX-4819',
    crop: 'wheat',
    cropGrade: 'FAQ (Fair Average Quality)',
    estimatedQuantityQtl: 50.0,
    actualNetWeightQtl: 74.25,
    grossWeightQtl: 92.40,
    tareWeightQtl: 18.15,
    centreId: 'centre_04',
    centreName: 'Bhopal Procurement Centre 04',
    slotWindow: '10:00 AM – 11:00 AM',
    expectedTurnWindow: '10:20 AM – 10:50 AM',
    status: 'WEIGHING', // Currently active at weighbridge
    vehicleType: 'tractor',
    vehicleNumber: 'MP-04-AB-9842',
    laneId: 'lane_normal',
    createdAt: 'Today, 08:30 AM',
    checkInTime: '10:04 AM',
    weighTime: '10:22 AM',
    moisturePercent: 11.2,
    dockBay: 'Silo Bay 02',
    paymentStatus: 'RECONCILING',
    paymentRef: 'DBT-PFMS-2026-MP-9841',
    mspRateInrPerQtl: 2275,
    amountInr: 168918,
    trustTier: 'TIER_1_ATTESTED'
  };

  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // Getters
  getActiveTab(): FarmerTab { return this.activeTab; }
  getProfile(): FarmerProfile { return this.profile; }
  getCrops(): FarmerCrop[] { return this.crops; }
  getNotifications(): FarmerNotification[] { return this.notifications; }
  getActiveToken(): BookingToken { return this.activeToken; }
  getSelectedCentreId(): string { return this.selectedCentreId; }
  getSelectedCentre(): NearbyCentreInfo {
    return NEARBY_CENTRES.find(c => c.id === this.selectedCentreId) || NEARBY_CENTRES[0];
  }
  isOfflineMode(): boolean { return this.isOffline; }
  getShowOnboardingModal(): boolean { return this.showOnboardingModal; }
  getShowQrModal(): boolean { return this.showQrModal; }
  getSelectedMilestoneModal(): FarmerJourneyStage | null { return this.selectedMilestoneModal; }
  getDemoStepIndex(): number { return this.demoStepIndex; }

  // Setters & Actions
  setActiveTab(tab: FarmerTab) {
    this.activeTab = tab;
    this.notify();
  }

  setSelectedCentre(id: string) {
    this.selectedCentreId = id;
    this.notify();
  }

  setShowOnboardingModal(show: boolean) {
    this.showOnboardingModal = show;
    this.notify();
  }

  setShowQrModal(show: boolean) {
    this.showQrModal = show;
    this.notify();
  }

  setSelectedMilestoneModal(stage: FarmerJourneyStage | null) {
    this.selectedMilestoneModal = stage;
    this.notify();
  }

  toggleOfflineMode() {
    this.isOffline = !this.isOffline;
    this.notify();
  }

  updateProfile(partial: Partial<FarmerProfile>) {
    this.profile = { ...this.profile, ...partial };
    this.notify();
  }

  addCrop(newCrop: Omit<FarmerCrop, 'id' | 'lastUpdated'>) {
    const crop: FarmerCrop = {
      ...newCrop,
      id: `crop-${Date.now()}`,
      lastUpdated: 'Just now'
    };
    this.crops.unshift(crop);
    this.addNotification({
      category: 'Booking',
      title: `${crop.cropName} Added`,
      message: `Approx. ${crop.approxQuantityQtl} q added to your harvest list.`,
      whatItMeans: 'You can now prepare a procurement booking slot for this crop.',
      whatToDo: 'Tap "Prepare Slot" whenever you are ready to deliver.',
      type: 'success'
    });
    this.notify();
  }

  createBooking(bookingData: {
    crop: CropType;
    cropName: string;
    quantityQtl: number;
    centreId: string;
    slotWindow: string;
    vehicleNumber: string;
  }) {
    const centre = NEARBY_CENTRES.find(c => c.id === bookingData.centreId) || NEARBY_CENTRES[0];
    const mspRate = MSP_RATES_2026[bookingData.crop] || 2275;
    const bookingId = `CG-${bookingData.crop.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;

    this.activeToken = {
      id: bookingId,
      farmerId: this.profile.id,
      farmerName: this.profile.name,
      maskedId: this.profile.virtualId,
      crop: bookingData.crop,
      cropGrade: 'FAQ (Fair Average Quality)',
      estimatedQuantityQtl: bookingData.quantityQtl,
      centreId: centre.id,
      centreName: centre.name,
      slotWindow: bookingData.slotWindow,
      expectedTurnWindow: '10:20 AM – 10:50 AM',
      status: 'BOOKED',
      vehicleType: 'tractor',
      vehicleNumber: bookingData.vehicleNumber,
      laneId: 'lane_normal',
      createdAt: 'Just now',
      moisturePercent: 11.2,
      paymentStatus: 'NOT_INITIATED',
      mspRateInrPerQtl: mspRate,
      amountInr: bookingData.quantityQtl * mspRate,
      trustTier: 'TIER_1_ATTESTED'
    };

    this.addNotification({
      category: 'Booking',
      title: `Booking Confirmed: ${bookingId}`,
      message: `Your arrival slot at ${centre.name} is confirmed for ${bookingData.slotWindow}.`,
      whatItMeans: 'A yard space has been reserved for your vehicle.',
      whatToDo: 'Bring your tractor to the gate with this digital token pass.',
      type: 'success'
    });

    this.activeTab = 'progress';
    this.showQrModal = true;
    this.notify();
  }

  advanceTokenState(status: TokenStatus) {
    this.activeToken = {
      ...this.activeToken,
      status
    };

    if (status === 'GATE_CHECKIN') {
      this.activeToken.checkInTime = '10:04 AM';
      this.addNotification({
        category: 'Queue',
        title: 'Gate Check-in Complete',
        message: 'Your gate pass has been validated. Enter Lane Q1.',
        whatItMeans: 'Your vehicle is now physically logged in the yard.',
        whatToDo: 'Follow the green light signal to the queue area.',
        type: 'success'
      });
    } else if (status === 'WEIGHING') {
      this.activeToken.actualNetWeightQtl = 74.25;
      this.activeToken.grossWeightQtl = 92.40;
      this.activeToken.tareWeightQtl = 18.15;
      this.activeToken.amountInr = 74.25 * (this.activeToken.mspRateInrPerQtl || 2275);
      this.addNotification({
        category: 'Queue',
        title: 'Weighing Verified: 74.25 q',
        message: 'Your net payload weight has been verified on the weighbridge scale.',
        whatItMeans: 'Net weight = Gross (92.40 q) - Tare (18.15 q) = 74.25 q recorded.',
        whatToDo: 'Proceed to Quality Check Booth 1 for grain moisture sampling.',
        type: 'info'
      });
    } else if (status === 'QUALITY_CHECK') {
      this.addNotification({
        category: 'Queue',
        title: 'Quality Assay Approved',
        message: 'Grain moisture 11.2% is within safe limits (<12.0%). Grade FAQ.',
        whatItMeans: 'Your harvest meets all APMC procurement quality standards.',
        whatToDo: 'Move vehicle forward to Silo Discharge Bay 02 for unloading.',
        type: 'success'
      });
    } else if (status === 'UNLOADING') {
      this.addNotification({
        category: 'Queue',
        title: 'Unloading into Silo Bay 02',
        message: 'Harvest is being discharged into the silo intake hopper.',
        whatItMeans: 'Transfer of physical crop into government custody in progress.',
        whatToDo: 'Wait for unloading staff to signal tare re-weighing.',
        type: 'info'
      });
    } else if (status === 'PROCUREMENT_COMPLETE') {
      this.activeToken.paymentStatus = 'RECONCILING';
      this.addNotification({
        category: 'Payment',
        title: 'Harvest Procured Successfully',
        message: `Total 74.25 q wheat procured. Net value ₹${(74.25 * 2275).toLocaleString()}.`,
        whatItMeans: 'Physical custody confirmed. DBT PFMS bank reconciliation started.',
        whatToDo: 'You may depart the Mandi yard. Digital receipt has been generated.',
        type: 'success'
      });
    } else if (status === 'SETTLED') {
      this.activeToken.paymentStatus = 'SETTLED';
      this.addNotification({
        category: 'Payment',
        title: 'DBT Bank Payment Credited: ₹1,68,918',
        message: 'Direct Benefit Transfer credited to State Bank of India •••• 8842.',
        whatItMeans: '100% of procurement dues settled directly via PFMS DBT.',
        whatToDo: 'Check your bank SMS. Transaction ref: DBT-PFMS-2026-MP-9841.',
        type: 'success'
      });
    }

    this.notify();
  }

  setDemoStep(stepIndex: number) {
    this.demoStepIndex = stepIndex;
    
    // Map demo step to state
    switch (stepIndex) {
      case 0: // Welcome
        this.activeTab = 'home';
        break;
      case 1: // Profile & KYC
        this.activeTab = 'profile';
        break;
      case 2: // My Crops
        this.activeTab = 'harvest';
        break;
      case 3: // Book Procurement
        this.activeTab = 'booking';
        break;
      case 4: // Token & Gate Arrival
        this.advanceTokenState('GATE_CHECKIN');
        this.activeTab = 'progress';
        break;
      case 5: // In Queue
        this.advanceTokenState('QUEUED');
        this.activeTab = 'progress';
        break;
      case 6: // Weighing
        this.advanceTokenState('WEIGHING');
        this.activeTab = 'progress';
        break;
      case 7: // Quality & Unloading
        this.advanceTokenState('QUALITY_CHECK');
        this.activeTab = 'progress';
        break;
      case 8: // Procurement Complete & Payment
        this.advanceTokenState('SETTLED');
        this.activeTab = 'progress';
        break;
      default:
        break;
    }
    this.notify();
  }

  addNotification(n: Omit<FarmerNotification, 'id' | 'timestamp' | 'read'>) {
    const newN: FarmerNotification = {
      ...n,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    this.notifications.unshift(newN);
    this.notify();
  }

  markAllNotificationsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.notify();
  }
}

export const farmerStore = new FarmerStore();
