import React from 'react';
import { useFarmerStore } from '../../../hooks/useFarmerStore';
import { FarmerJourney3D } from '../FarmerJourney3D';
import { 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Clock, 
  MapPin, 
  Truck, 
  QrCode, 
  ShieldCheck, 
  AlertCircle, 
  Sprout, 
  Phone, 
  MessageSquare, 
  Building2, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const FarmerHomeView: React.FC = () => {
  const { 
    profile, 
    activeToken, 
    crops, 
    selectedCentre, 
    setActiveTab, 
    setShowQrModal,
    setSelectedMilestoneModal
  } = useFarmerStore();

  const activeCrop = crops.find(c => c.status === 'READY_FOR_PROCUREMENT') || crops[0];

  // Derive dominant next action based on activeToken status
  const getNextAction = () => {
    if (!activeToken) {
      return {
        title: 'Prepare Your Harvest Procurement',
        desc: 'Reserve a guaranteed arrival slot for your Sharbati Wheat at Bhopal Centre 04.',
        buttonText: 'PREPARE PROCUREMENT SLOT',
        tab: 'booking' as const
      };
    }

    switch (activeToken.status) {
      case 'BOOKED':
        return {
          title: 'Your Arrival Window is Reserved',
          desc: `Arrive between ${activeToken.slotWindow} at ${activeToken.centreName}. Keep gate token ready.`,
          buttonText: 'VIEW TOKEN PASS & QR',
          action: () => setShowQrModal(true)
        };
      case 'GATE_CHECKIN':
        return {
          title: 'Gate Pass Validated — Enter Lane Q1',
          desc: 'Your vehicle is authorized for entry. Proceed to holding queue.',
          buttonText: 'FOLLOW QUEUE PROGRESS',
          tab: 'progress' as const
        };
      case 'QUEUED':
        return {
          title: 'Expected Turn: 10:20 AM – 10:50 AM',
          desc: 'You are 2nd in queue. Weighbridge platform is operating smoothly.',
          buttonText: 'TRACK WEIGHBRIDGE TURN',
          tab: 'progress' as const
        };
      case 'WEIGHING':
        return {
          title: 'Your Vehicle is at Weighbridge',
          desc: 'Gross tare weigh scales are recording your harvest. 74.25 q net payload.',
          buttonText: 'VIEW WEIGHING VERIFICATION',
          tab: 'progress' as const
        };
      case 'QUALITY_CHECK':
        return {
          title: 'Moisture Assay in Progress',
          desc: '11.2% moisture content within official limits (<12.0%). FAQ grade passing.',
          buttonText: 'CHECK QUALITY ASSAY',
          tab: 'progress' as const
        };
      case 'UNLOADING':
        return {
          title: 'Harvest Unloading into Silo Bay 02',
          desc: 'Discharging wheat into government silo custody.',
          buttonText: 'VIEW UNLOADING STATUS',
          tab: 'progress' as const
        };
      case 'PROCUREMENT_COMPLETE':
      case 'PAYMENT_RECONCILIATION':
      case 'SETTLED':
        return {
          title: 'Harvest Procured — Payment Credited',
          desc: 'PFMS Direct Benefit Transfer of ₹1,68,918 processed to your SBI bank account.',
          buttonText: 'CHECK PAYMENT DETAILS',
          tab: 'progress' as const
        };
      default:
        return {
          title: 'Prepare Procurement Booking',
          desc: 'Select your crop and nearby procurement centre.',
          buttonText: 'PREPARE BOOKING',
          tab: 'booking' as const
        };
    }
  };

  const nextAction = getNextAction();

  return (
    <div className="space-y-4 select-none">
      {/* 1. Personal Farmer Greeting Header */}
      <div className="bg-[#203864] text-white rounded-[8px] p-4 sm:p-5 shadow-md border-b-4 border-[#F47920] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={profile.avatarUrl} 
              alt={profile.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#F47920] shadow"
            />
            {profile.isIdentityVerified && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#228B22] rounded-full border-2 border-white flex items-center justify-center text-white" title="Identity Verified">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div>
            <div className="text-[10px] font-mono text-[#F47920] font-bold uppercase tracking-wider">
              YOUR HARVEST JOURNEY AT A GLANCE
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Good Morning, {profile.name}
            </h1>
            <div className="text-xs text-slate-200 mt-0.5 flex items-center gap-2">
              <span>{profile.village}, {profile.district}</span>
              <span>•</span>
              <span>Khasra {profile.farmDetails.khasraNumber.split('&')[0]}</span>
            </div>
          </div>
        </div>

        {/* Readiness Badge */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="bg-white/10 hover:bg-white/15 p-2.5 rounded-[8px] border border-white/20 flex items-center gap-3 cursor-pointer transition-all self-start sm:self-auto"
        >
          {/* Progress Ring */}
          <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/20"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#77dd6a]"
                strokeDasharray={`${profile.verificationScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-mono font-bold text-xs text-white">
              {profile.verificationScore}%
            </span>
          </div>

          <div>
            <div className="text-[10px] text-slate-300 font-mono font-bold uppercase">PROFILE STATUS</div>
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>Almost Ready</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <div className="text-[10px] text-[#77dd6a]">Land & Bank Linked</div>
          </div>
        </div>
      </div>

      {/* 2. Dominant Adaptive Next Action Card */}
      <div className="bg-gradient-to-r from-[#05224D] to-[#203864] text-white p-4 sm:p-5 rounded-[8px] border-l-8 border-[#F47920] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-[#F47920] font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>WHAT SHOULD I DO NEXT?</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            {nextAction.title}
          </h2>
          <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
            {nextAction.desc}
          </p>
        </div>

        <button
          onClick={() => {
            if (nextAction.action) {
              nextAction.action();
            } else if (nextAction.tab) {
              setActiveTab(nextAction.tab);
            }
          }}
          className="btn-press px-5 py-2.5 bg-[#F47920] hover:bg-[#e06b18] text-white text-xs font-mono font-bold rounded flex items-center justify-center gap-2 shadow-md shrink-0"
        >
          <span>{nextAction.buttonText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. My Harvest Journey Visual 3D Metaphor */}
      <FarmerJourney3D />

      {/* 4. Two-Column Information Layout: Active Procurement & My Crops */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Active Booking Pass Card (7 Cols) */}
        <div className="md:col-span-7 bg-white border border-[#C4C6D0] rounded-[8px] p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#E7ECF2] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#228B22] animate-pulse" />
              <h3 className="font-bold text-sm text-[#05224D]">
                MY ACTIVE PROCUREMENT
              </h3>
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-green-100 text-[#228B22]">
              {activeToken.status.replace('_', ' ')}
            </span>
          </div>

          <div className="p-3 bg-[#F7F9FC] border border-[#E7ECF2] rounded-[6px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">TOKEN PASS ID</div>
              <div className="text-xl font-extrabold font-mono text-[#05224D]">
                {activeToken.id}
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                {activeToken.crop.toUpperCase()} • Approx {activeToken.estimatedQuantityQtl} q • Tractor {activeToken.vehicleNumber}
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(true)}
              className="btn-press px-3 py-1.5 bg-[#203864] text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 shrink-0"
            >
              <QrCode className="w-4 h-4 text-[#F47920]" />
              <span>SHOW GATE QR</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
              <span className="text-[10px] text-slate-500 block font-sans">PROCUREMENT CENTRE</span>
              <strong className="text-[#172033] font-sans truncate block">{activeToken.centreName}</strong>
              <span className="text-[10px] text-slate-400 font-sans">Distance: 12 km</span>
            </div>

            <div className="p-2.5 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
              <span className="text-[10px] text-slate-500 block font-sans">ARRIVAL WINDOW</span>
              <strong className="text-[#F47920] block">{activeToken.slotWindow}</strong>
              <span className="text-[10px] text-[#228B22] font-sans">Expected turn: {activeToken.expectedTurnWindow}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Operating smoothly with 2 vehicles ahead
            </span>
            <button
              onClick={() => setActiveTab('progress')}
              className="text-xs font-bold text-[#203864] hover:underline flex items-center gap-1"
            >
              <span>TRACK LIVE PROGRESS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: My Crops & Readiness (5 Cols) */}
        <div className="md:col-span-5 bg-white border border-[#C4C6D0] rounded-[8px] p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E7ECF2] pb-2">
              <h3 className="font-bold text-sm text-[#05224D] flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-[#228B22]" />
                <span>MY HARVEST CROPS</span>
              </h3>
              <button
                onClick={() => setActiveTab('harvest')}
                className="text-xs font-bold text-[#203864] hover:underline"
              >
                VIEW ALL ({crops.length})
              </button>
            </div>

            <div className="mt-2.5 space-y-2">
              {crops.slice(0, 2).map((c) => (
                <div key={c.id} className="p-2.5 bg-[#F7F9FC] border border-[#E7ECF2] rounded-[6px] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#172033]">{c.cropName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {c.season} • Approx {c.approxQuantityQtl} q • MSP ₹{c.mspRateInr}/q
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    c.status === 'READY_FOR_PROCUREMENT'
                      ? 'bg-green-100 text-[#228B22]'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {c.status === 'READY_FOR_PROCUREMENT' ? 'READY' : 'LOGGED'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('booking')}
            className="btn-press w-full py-2 bg-[#203864] text-white font-mono text-xs font-bold rounded flex items-center justify-center gap-1.5 shadow"
          >
            <Calendar className="w-3.5 h-3.5 text-[#F47920]" />
            <span>PREPARE ANOTHER SLOT</span>
          </button>
        </div>
      </div>

      {/* 5. Rural Multi-Channel Assistance (Section 52: No Smartphone Dependency) */}
      <div className="bg-[#FFF9F0] border border-[#FFE4BA] rounded-[8px] p-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase tracking-wider block">
              MULTI-CHANNEL ACCESSIBILITY • SMARTPHONE NOT REQUIRED
            </span>
            <h4 className="font-bold text-[#172033] text-sm mt-0.5">
              Need assistance or poor mobile connectivity?
            </h4>
            <p className="text-slate-600 text-[11px] mt-0.5">
              Bookings, tokens and turn notifications work smoothly via feature phone SMS, toll-free voice IVR, or local village CSC kiosks.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 bg-white border border-[#FFE4BA] rounded text-center">
              <span className="text-[9px] text-slate-500 block font-mono">SMS GATEWAY</span>
              <strong className="text-[#05224D] font-mono">51969</strong>
            </div>
            <div className="px-3 py-1.5 bg-white border border-[#FFE4BA] rounded text-center">
              <span className="text-[9px] text-slate-500 block font-mono">TOLL-FREE IVR</span>
              <strong className="text-[#228B22] font-mono">1800-200-5196</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
