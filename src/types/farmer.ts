import { CropType, TokenStatus, VehicleType } from './index';

export type FarmerTab = 'home' | 'harvest' | 'booking' | 'progress' | 'profile';

export type FarmerJourneyStage =
  | 'REGISTER'
  | 'VERIFY'
  | 'CROP'
  | 'SLOT'
  | 'GATE'
  | 'QUEUE'
  | 'WEIGH'
  | 'QUALITY'
  | 'UNLOAD'
  | 'COMPLETE'
  | 'PAYMENT';

export interface FarmerProfile {
  id: string;
  name: string;
  mobile: string;
  avatarUrl: string;
  village: string;
  block: string;
  district: string;
  state: string;
  preferredLanguage: string;
  maskedAadhaar: string; // e.g. "•••• •••• 5821"
  virtualId: string; // e.g. "VID-9104-XXXX-4819"
  memberSince: string;
  verificationScore: number; // e.g. 92
  isIdentityVerified: boolean;
  isKycComplete: boolean;
  isFarmVerified: boolean;
  isBankLinked: boolean;
  bankDetails: {
    bankName: string;
    accountMasked: string;
    ifsc: string;
    accountHolderName: string;
    dbtStatus: 'ACTIVE' | 'PENDING' | 'REJECTED';
  };
  farmDetails: {
    khasraNumber: string;
    totalLandHectares: number;
    cultivatedAreaHectares: number;
    soilHealthCardNo: string;
    irrigationType: string;
  };
}

export interface FarmerCrop {
  id: string;
  crop: CropType;
  cropName: string;
  season: 'Rabi 2026' | 'Kharif 2025' | 'Zaid 2026';
  variety: string;
  approxQuantityQtl: number;
  mspRateInr: number;
  status: 'READY_FOR_PROCUREMENT' | 'HARVESTING' | 'BOOKED' | 'PROCURED';
  farmReference: string;
  lastUpdated: string;
}

export interface NearbyCentreInfo {
  id: string;
  name: string;
  code: string;
  distanceKm: number;
  operatingCondition: 'OPERATING_SMOOTHLY' | 'MODERATE_TRAFFIC' | 'HIGH_VOLUME';
  expectedWaitMins: string;
  workingHours: string;
  supportedCrops: CropType[];
  bookingCapacityStatus: 'SAFE' | 'LIMITED' | 'FULL';
  address: string;
  helpline: string;
}

export interface FarmerNotification {
  id: string;
  category: 'Booking' | 'Queue' | 'Centre' | 'Verification' | 'Payment';
  title: string;
  message: string;
  whatItMeans: string;
  whatToDo: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface JourneyMilestone {
  id: FarmerJourneyStage;
  label: string;
  shortName: string;
  description: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
  shape: 'circle' | 'square' | 'ring';
  estimatedTime?: string;
  iconName: string;
}
