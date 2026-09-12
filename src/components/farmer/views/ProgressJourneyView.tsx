import React from 'react';
import { useFarmerStore } from '../../../hooks/useFarmerStore';
import { FarmerJourney3D } from '../FarmerJourney3D';
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  Scale, 
  Sparkles, 
  Layers, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  QrCode, 
  RotateCw,
  Building2,
  FileCheck2,
  Receipt
} from 'lucide-react';

export const ProgressJourneyView: React.FC = () => {
  const { 
    activeToken, 
    profile, 
    advanceTokenState, 
    setShowQrModal,
    setSelectedMilestoneModal 
  } = useFarmerStore();

  const isGateDone = !!activeToken.checkInTime || activeToken.status !== 'BOOKED';
  const isWeighed = !!activeToken.actualNetWeightQtl && activeToken.status !== 'BOOKED' && activeToken.status !== 'GATE_CHECKIN' && activeToken.status !== 'QUEUED';
  const isQualityDone = activeToken.status === 'UNLOADING' || activeToken.status === 'PROCUREMENT_COMPLETE' || activeToken.status === 'SETTLED';
  const isComplete = activeToken.status === 'PROCUREMENT_COMPLETE' || activeToken.status === 'SETTLED';
  const isPaid = activeToken.paymentStatus === 'SETTLED';

  return (
    <div className="space-y-4 select-none font-sans">
      {/* 1. 3D Journey Pathway */}
      <FarmerJourney3D />

      {/* 2. Expected Turn Window Card */}
      <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7ECF2] pb-3">
          <div>
            <div className="text-[10px] font-mono text-[#F47920] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F47920]" />
              <span>LIVE QUEUE & WEIGHBRIDGE TURN</span>
            </div>
            <h2 className="text-xl font-bold text-[#05224D] tracking-tight">
              Expected Turn Window: {activeToken.expectedTurnWindow}
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-[#228B22] animate-pulse" />
            <span className="px-2.5 py-1 rounded bg-green-50 text-[#228B22] border border-green-200 text-xs font-mono font-bold">
              OPERATING SMOOTHLY
            </span>
          </div>
        </div>

        {/* Visual Queue Representation */}
        <div className="p-3 bg-[#F7F9FC] border border-[#E7ECF2] rounded-[6px] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>HOLDING YARD LANE Q1</span>
            <span className="text-[#228B22] font-bold">2 Vehicles Ahead</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-2">
            {/* Vehicle 1 ahead */}
            <div className="px-3 py-2 bg-slate-200 border border-slate-300 rounded text-center shrink-0 opacity-70">
              <Truck className="w-5 h-5 mx-auto text-slate-600 mb-1" />
              <div className="text-[10px] font-mono font-bold">MP-04-E-1049</div>
              <div className="text-[9px] text-slate-500">At Scales</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

            {/* Vehicle 2 ahead */}
            <div className="px-3 py-2 bg-slate-200 border border-slate-300 rounded text-center shrink-0 opacity-70">
              <Truck className="w-5 h-5 mx-auto text-slate-600 mb-1" />
              <div className="text-[10px] font-mono font-bold">MP-04-F-8812</div>
              <div className="text-[9px] text-slate-500">In Front</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

            {/* Farmer's Active Vehicle */}
            <div className="px-4 py-2.5 bg-[#203864] text-white rounded-[6px] text-center shrink-0 ring-2 ring-[#F47920] shadow-md">
              <Truck className="w-6 h-6 mx-auto text-[#F47920] mb-1" />
              <div className="text-xs font-mono font-bold">{activeToken.vehicleNumber}</div>
              <div className="text-[10px] text-[#77dd6a] font-bold">YOUR TURN NEXT</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic pt-1">
            "Your expected turn may adjust slightly as vehicles are processed at the platform."
          </div>
        </div>

        {/* 4 Clear Arrival Instructions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
          <div className="p-2 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
            <strong className="text-[#05224D] block font-mono">1. GATE ARRIVAL</strong>
            <span className="text-[11px] text-slate-500">Show QR pass at Gate 1</span>
          </div>
          <div className="p-2 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
            <strong className="text-[#05224D] block font-mono">2. FOLLOW LANE</strong>
            <span className="text-[11px] text-slate-500">Stay in holding Lane Q1</span>
          </div>
          <div className="p-2 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
            <strong className="text-[#05224D] block font-mono">3. READY WEIGH</strong>
            <span className="text-[11px] text-slate-500">Keep engine idle on scale</span>
          </div>
          <div className="p-2 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
            <strong className="text-[#05224D] block font-mono">4. DIRECT DBT</strong>
            <span className="text-[11px] text-slate-500">No cash or broker needed</span>
          </div>
        </div>
      </div>

      {/* 3. Physical Truth Verification Cards: Weighing, Quality & Silo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weighbridge Verification Card */}
        <div className={`p-4 rounded-[8px] border transition-all ${
          isWeighed ? 'bg-white border-[#228B22] shadow-sm' : 'bg-[#F7F9FC] border-[#C4C6D0]'
        }`}>
          <div className="flex items-center justify-between border-b border-[#E7ECF2] pb-2">
            <div className="flex items-center gap-1.5">
              <Scale className={`w-4 h-4 ${isWeighed ? 'text-[#228B22]' : 'text-slate-500'}`} />
              <h3 className="font-bold text-xs text-[#05224D]">WEIGHBRIDGE VERIFICATION</h3>
            </div>
            {isWeighed && <CheckCircle2 className="w-4 h-4 text-[#228B22]" />}
          </div>

          <div className="mt-3 space-y-2 text-xs font-mono">
            <div className="p-2 bg-[#F1F4F9] rounded">
              <span className="text-[10px] text-slate-500 block font-sans">VERIFIED NET WEIGHT</span>
              <strong className="text-xl text-[#05224D]">
                {activeToken.actualNetWeightQtl || 74.25} Quintals
              </strong>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 px-1">
              <span>Gross Weight:</span>
              <span>{activeToken.grossWeightQtl || 92.40} q</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600 px-1">
              <span>Tare (Empty Tractor):</span>
              <span>{activeToken.tareWeightQtl || 18.15} q</span>
            </div>
          </div>
        </div>

        {/* Quality Assay Card */}
        <div className={`p-4 rounded-[8px] border transition-all ${
          isQualityDone ? 'bg-white border-[#228B22] shadow-sm' : 'bg-[#F7F9FC] border-[#C4C6D0]'
        }`}>
          <div className="flex items-center justify-between border-b border-[#E7ECF2] pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-4 h-4 ${isQualityDone ? 'text-[#228B22]' : 'text-slate-500'}`} />
              <h3 className="font-bold text-xs text-[#05224D]">GRAIN QUALITY ASSAY</h3>
            </div>
            {isQualityDone && <CheckCircle2 className="w-4 h-4 text-[#228B22]" />}
          </div>

          <div className="mt-3 space-y-2 text-xs font-mono">
            <div className="p-2 bg-[#F1F4F9] rounded">
              <span className="text-[10px] text-slate-500 block font-sans">GRAIN MOISTURE</span>
              <strong className="text-xl text-[#228B22]">
                {activeToken.moisturePercent || 11.2}%
              </strong>
              <span className="text-[10px] text-slate-500 block font-sans">Safe official limit: &lt;12.0%</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 px-1">
              <span>Assay Grade:</span>
              <span className="font-bold text-[#05224D]">FAQ Grade Passed</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600 px-1">
              <span>Deductions:</span>
              <span className="text-[#228B22] font-bold">₹0.00 (Zero Penalty)</span>
            </div>
          </div>
        </div>

        {/* Silo Unloading Card */}
        <div className={`p-4 rounded-[8px] border transition-all ${
          isComplete ? 'bg-white border-[#228B22] shadow-sm' : 'bg-[#F7F9FC] border-[#C4C6D0]'
        }`}>
          <div className="flex items-center justify-between border-b border-[#E7ECF2] pb-2">
            <div className="flex items-center gap-1.5">
              <Layers className={`w-4 h-4 ${isComplete ? 'text-[#228B22]' : 'text-slate-500'}`} />
              <h3 className="font-bold text-xs text-[#05224D]">SILO INTAKE CUSTODY</h3>
            </div>
            {isComplete && <CheckCircle2 className="w-4 h-4 text-[#228B22]" />}
          </div>

          <div className="mt-3 space-y-2 text-xs font-mono">
            <div className="p-2 bg-[#F1F4F9] rounded">
              <span className="text-[10px] text-slate-500 block font-sans">DISCHARGE DOCK BAY</span>
              <strong className="text-xl text-[#05224D]">
                {activeToken.dockBay || 'Silo Bay 02'}
              </strong>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 px-1">
              <span>Physical Custody:</span>
              <span className="text-[#228B22] font-bold">Government Sealed</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600 px-1">
              <span>Receipt Issued:</span>
              <span className="font-bold text-[#05224D]">Digital Signed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Payment Journey Breakdown (Section 48) */}
      <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7ECF2] pb-3">
          <div>
            <div className="text-[10px] font-mono text-[#228B22] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#228B22]" />
              <span>DIRECT BENEFIT TRANSFER (DBT) PAYMENT JOURNEY</span>
            </div>
            <h2 className="text-lg font-bold text-[#05224D] tracking-tight">
              Total Procurement Dues: ₹{((activeToken.actualNetWeightQtl || 74.25) * 2275).toLocaleString()}
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              Net Weight {activeToken.actualNetWeightQtl || 74.25} q × MSP ₹2,275/q • 100% Direct to Bank
            </div>
          </div>

          <span className={`px-3 py-1 rounded text-xs font-mono font-bold ${
            isPaid ? 'bg-green-100 text-[#228B22]' : 'bg-blue-100 text-[#203864]'
          }`}>
            {isPaid ? 'PAYMENT CREDITED' : 'RECONCILIATION IN PROGRESS'}
          </span>
        </div>

        {/* 4-Step Payment Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded text-xs space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-[#228B22] font-mono">1. PROCURED</strong>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#228B22]" />
            </div>
            <p className="text-[11px] text-slate-600">Physical wheat verified on weighbridge & silo intake.</p>
          </div>

          <div className={`p-3 rounded text-xs space-y-1 border ${
            isComplete ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <strong className="text-[#203864] font-mono">2. RECONCILED</strong>
              {isComplete ? <CheckCircle2 className="w-3.5 h-3.5 text-[#228B22]" /> : <RotateCw className="w-3.5 h-3.5 text-slate-400 animate-spin" />}
            </div>
            <p className="text-[11px] text-slate-600">Weight & moisture reconciled with APMC central book.</p>
          </div>

          <div className={`p-3 rounded text-xs space-y-1 border ${
            isPaid ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <strong className="text-[#203864] font-mono">3. PFMS SENT</strong>
              {isPaid ? <CheckCircle2 className="w-3.5 h-3.5 text-[#228B22]" /> : <span className="text-slate-400">○</span>}
            </div>
            <p className="text-[11px] text-slate-600">Dispatched via Public Financial Management System.</p>
          </div>

          <div className={`p-3 rounded text-xs space-y-1 border ${
            isPaid ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <strong className="text-[#228B22] font-mono">4. DBT CREDITED</strong>
              {isPaid ? <CheckCircle2 className="w-3.5 h-3.5 text-[#228B22]" /> : <span className="text-slate-400">○</span>}
            </div>
            <p className="text-[11px] text-slate-600">
              State Bank of India •••• 8842 ({profile.name})
            </p>
          </div>
        </div>

        {/* Bank & Ref Information */}
        <div className="p-3 bg-[#F7F9FC] border border-[#E7ECF2] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-500 font-sans block">BANK ACCOUNT</span>
            <strong className="text-[#05224D]">State Bank of India •••• 8842 (IFSC: SBIN0001429)</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-sans block">GOVERNMENT DBT REF</span>
            <strong className="text-[#228B22]">{activeToken.paymentRef || 'DBT-PFMS-2026-MP-9841'}</strong>
          </div>
        </div>
      </div>

      {/* 5. Interactive Evaluator Simulation Triggers */}
      <div className="p-3 bg-[#F1F4F9] border border-[#C4C6D0] rounded-[8px] flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-mono text-slate-600 font-bold uppercase text-[10px]">
          INTERACTIVE STAGE CONTROLS (TEST PROGRESSION):
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => advanceTokenState('GATE_CHECKIN')}
            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-mono text-[11px] font-bold rounded border border-slate-300"
          >
            Gate Arrival
          </button>
          <button
            onClick={() => advanceTokenState('QUEUED')}
            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-mono text-[11px] font-bold rounded border border-slate-300"
          >
            In Queue
          </button>
          <button
            onClick={() => advanceTokenState('WEIGHING')}
            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-mono text-[11px] font-bold rounded border border-slate-300"
          >
            Weighbridge
          </button>
          <button
            onClick={() => advanceTokenState('QUALITY_CHECK')}
            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-mono text-[11px] font-bold rounded border border-slate-300"
          >
            Quality Assay
          </button>
          <button
            onClick={() => advanceTokenState('SETTLED')}
            className="px-2 py-1 bg-[#228B22] hover:bg-green-700 text-white font-mono text-[11px] font-bold rounded shadow-sm"
          >
            Settle DBT ₹1.68L
          </button>
        </div>
      </div>
    </div>
  );
};
