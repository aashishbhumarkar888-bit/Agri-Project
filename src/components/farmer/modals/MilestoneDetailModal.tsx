import React from 'react';
import { useFarmerStore } from '../../../hooks/useFarmerStore';
import { FarmerJourneyStage } from '../../../types/farmer';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Scale, 
  Sparkles, 
  CreditCard,
  Truck,
  Sprout
} from 'lucide-react';

export const MilestoneDetailModal: React.FC = () => {
  const { 
    selectedMilestoneModal, 
    setSelectedMilestoneModal, 
    activeToken, 
    profile, 
    advanceTokenState,
    setActiveTab 
  } = useFarmerStore();

  if (!selectedMilestoneModal) return null;

  const getMilestoneDetails = (stage: FarmerJourneyStage) => {
    switch (stage) {
      case 'REGISTER':
        return {
          title: 'Personal Registration & Identity',
          status: 'COMPLETED',
          whatHappened: `Farmer profile created for ${profile.name}, mobile ${profile.mobile}, registered in Bilkisganj village.`,
          whatItMeans: 'You have an official verified farmer account in the State APMC digital procurement network.',
          whatToDo: 'Keep your mobile number active for SMS arrival alerts.',
          actionLabel: 'VIEW MY PROFILE',
          onAction: () => {
            setSelectedMilestoneModal(null);
            setActiveTab('profile');
          }
        };
      case 'VERIFY':
        return {
          title: 'KYC & Farm Land Record Linking',
          status: 'COMPLETED',
          whatHappened: `MP Bhulekh Land Record Khasra 142/2 (4.8 Ha) and Masked Virtual ID ${profile.virtualId} linked.`,
          whatItMeans: 'Your identity and land rights are verified for MSP procurement payments.',
          whatToDo: 'Ensure your Aadhaar-linked DBT bank account remains active.',
          actionLabel: 'CHECK KYC STATUS',
          onAction: () => {
            setSelectedMilestoneModal(null);
            setActiveTab('profile');
          }
        };
      case 'CROP':
        return {
          title: 'Harvest & Crop Readiness',
          status: 'COMPLETED',
          whatHappened: '50.00 quintals Sharbati Wheat (Rabi 2026) logged from Bilkisganj North Plot.',
          whatItMeans: 'Your harvest is declared and ready for government MSP procurement booking.',
          whatToDo: 'Prepare your tractor trailer and ensure grain moisture is clean and dry.',
          actionLabel: 'MANAGE MY CROPS',
          onAction: () => {
            setSelectedMilestoneModal(null);
            setActiveTab('harvest');
          }
        };
      case 'SLOT':
        return {
          title: 'Arrival Window Reservation',
          status: activeToken?.status ? 'COMPLETED' : 'ACTIVE',
          whatHappened: `Arrival window reserved for ${activeToken?.slotWindow || '10:00 AM – 11:00 AM'} at ${activeToken?.centreName || 'Bhopal Centre 04'}.`,
          whatItMeans: 'A physical yard intake buffer is locked for you so you do not wait in chaos.',
          whatToDo: 'Plan your travel to reach the gate 10 minutes before your slot window.',
          actionLabel: 'BOOK ANOTHER SLOT',
          onAction: () => {
            setSelectedMilestoneModal(null);
            setActiveTab('booking');
          }
        };
      case 'GATE':
        return {
          title: 'Gate Check-in & ANPR Verification',
          status: activeToken?.checkInTime ? 'COMPLETED' : 'ACTIVE',
          whatHappened: `Tractor ${activeToken?.vehicleNumber || 'MP-04-AB-9842'} checked in at Gate 1 at ${activeToken?.checkInTime || '10:04 AM'}.`,
          whatItMeans: 'Token QR pass validated. Physical entry into Mandi premises authorized.',
          whatToDo: 'Follow Lane Q1 traffic light to enter the weighbridge holding queue.',
          actionLabel: 'SIMULATE GATE ARRIVAL',
          onAction: () => {
            advanceTokenState('GATE_CHECKIN');
            setSelectedMilestoneModal(null);
          }
        };
      case 'QUEUE':
        return {
          title: 'Mandi Yard Anti-Starvation Queue',
          status: activeToken?.status === 'QUEUED' || activeToken?.status === 'WEIGHING' ? 'COMPLETED' : 'PENDING',
          whatHappened: `Vehicle in Lane Q1. Expected Turn Window: ${activeToken?.expectedTurnWindow || '10:20 AM – 10:50 AM'}.`,
          whatItMeans: 'You are protected against unfair queue jumping. Vehicles are processed systematically.',
          whatToDo: 'Keep your engine idle and stay near your vehicle until your turn is called.',
          actionLabel: 'PROCEED TO WEIGHING',
          onAction: () => {
            advanceTokenState('WEIGHING');
            setSelectedMilestoneModal(null);
          }
        };
      case 'WEIGH':
        return {
          title: 'Gross & Tare Weighing Verification',
          status: activeToken?.actualNetWeightQtl ? 'COMPLETED' : 'ACTIVE',
          whatHappened: `Gross: 92.40 q • Tare: 18.15 q • Verified Net Payload: ${activeToken?.actualNetWeightQtl || 74.25} q recorded.`,
          whatItMeans: 'Physical weight is locked on the weighbridge scale with tamper-proof accuracy.',
          whatToDo: 'Proceed to Quality Assay Booth 1 for grain moisture reading.',
          actionLabel: 'APPROVE QUALITY CHECK',
          onAction: () => {
            advanceTokenState('QUALITY_CHECK');
            setSelectedMilestoneModal(null);
          }
        };
      case 'QUALITY':
        return {
          title: 'Grain Quality & Moisture Assay',
          status: activeToken?.moisturePercent ? 'COMPLETED' : 'ACTIVE',
          whatHappened: `Moisture assayed at ${activeToken?.moisturePercent || 11.2}% (Safe Limit: <12.0%). Quality: Fair Average Quality (FAQ).`,
          whatItMeans: 'Your wheat meets all official state procurement procurement standards without deduction.',
          whatToDo: 'Drive tractor to Silo Intake Bay 02 for unloading.',
          actionLabel: 'START UNLOADING',
          onAction: () => {
            advanceTokenState('UNLOADING');
            setSelectedMilestoneModal(null);
          }
        };
      case 'UNLOAD':
        return {
          title: 'Harvest Discharge into Mandi Silo',
          status: activeToken?.status === 'PROCUREMENT_COMPLETE' || activeToken?.status === 'SETTLED' ? 'COMPLETED' : 'ACTIVE',
          whatHappened: 'Grain discharged into Mandi Silo Intake Hopper Bay 02.',
          whatItMeans: 'Physical custody of your harvest is transferred to the State APMC board.',
          whatToDo: 'Wait 2 minutes for empty tractor tare check.',
          actionLabel: 'COMPLETE PROCUREMENT',
          onAction: () => {
            advanceTokenState('PROCUREMENT_COMPLETE');
            setSelectedMilestoneModal(null);
          }
        };
      case 'PAYMENT':
        return {
          title: 'PFMS Direct Benefit Transfer (DBT)',
          status: activeToken?.paymentStatus === 'SETTLED' ? 'COMPLETED' : 'ACTIVE',
          whatHappened: `Total MSP Value ₹${((activeToken?.actualNetWeightQtl || 74.25) * 2275).toLocaleString()} processed via PFMS DBT.`,
          whatItMeans: 'Direct transfer to State Bank of India •••• 8842 with 0 middlemen or commissions.',
          whatToDo: 'Verify bank SMS confirmation. Reference: DBT-PFMS-2026-MP-9841.',
          actionLabel: 'VIEW PAYMENT SUMMARY',
          onAction: () => {
            advanceTokenState('SETTLED');
            setSelectedMilestoneModal(null);
            setActiveTab('progress');
          }
        };
      default:
        return {
          title: 'Harvest Milestone',
          status: 'ACTIVE',
          whatHappened: 'Procurement milestone in progress.',
          whatItMeans: 'Track your personal progress here.',
          whatToDo: 'Follow staff directions.',
          actionLabel: 'CLOSE',
          onAction: () => setSelectedMilestoneModal(null)
        };
    }
  };

  const details = getMilestoneDetails(selectedMilestoneModal);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-[8px] max-w-lg w-full border border-[#C4C6D0] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#203864] text-white p-4 flex items-center justify-between border-b-2 border-[#F47920]">
          <div>
            <div className="text-[10px] font-mono text-[#F47920] uppercase font-bold tracking-wider">
              HARVEST JOURNEY STAGE EXPLANATION
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {details.title}
            </h3>
          </div>
          <button
            onClick={() => setSelectedMilestoneModal(null)}
            className="text-slate-300 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* 3 Clear Answers */}
          <div className="space-y-3 font-sans">
            <div className="p-3 bg-[#F7F9FC] border border-[#E7ECF2] rounded-[6px]">
              <div className="font-bold text-[#203864] uppercase font-mono text-[10px] mb-1">
                1. WHAT HAPPENED?
              </div>
              <p className="text-slate-700 leading-relaxed">
                {details.whatHappened}
              </p>
            </div>

            <div className="p-3 bg-[#F7F9FC] border border-[#E7ECF2] rounded-[6px]">
              <div className="font-bold text-[#228B22] uppercase font-mono text-[10px] mb-1">
                2. WHAT IT MEANS FOR YOU?
              </div>
              <p className="text-slate-700 leading-relaxed">
                {details.whatItMeans}
              </p>
            </div>

            <div className="p-3 bg-[#FFF9F0] border border-[#FFE4BA] rounded-[6px]">
              <div className="font-bold text-[#D97706] uppercase font-mono text-[10px] mb-1">
                3. WHAT SHOULD YOU DO NEXT?
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {details.whatToDo}
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#E7ECF2]">
            <button
              onClick={() => setSelectedMilestoneModal(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded"
            >
              DISMISS
            </button>
            <button
              onClick={details.onAction}
              className="btn-press px-4 py-2 bg-[#203864] hover:bg-[#172033] text-white font-bold rounded flex items-center gap-1.5 shadow"
            >
              <span>{details.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
