import React, { useState } from 'react';
import { useFarmerStore } from '../../../hooks/useFarmerStore';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  X,
  Layers
} from 'lucide-react';

export const FarmerDemoWalkthrough: React.FC = () => {
  const { demoStepIndex, setDemoStep } = useFarmerStore();
  const [isMinimized, setIsMinimized] = useState(false);

  const demoSteps = [
    {
      title: '1. Farmer Welcome & Personal Dashboard',
      subtitle: 'Home Overview & Readiness Ring',
      highlight: 'Personal summary, 92% readiness progress, and dominant next action card.'
    },
    {
      title: '2. Identity & KYC Verification',
      subtitle: 'Masked Aadhaar & MP Bhulekh Land Records',
      highlight: 'Full privacy protection: VID-9104-XXXX-4819, Khasra 142/2 & bank linked.'
    },
    {
      title: '3. My Agricultural Crops & Harvest',
      subtitle: 'Crop List & MSP Price Rates 2026',
      highlight: '50.00 q Sharbati Wheat logged at ₹2,275/q official government MSP.'
    },
    {
      title: '4. Reserve Guaranteed Arrival Window',
      subtitle: '6-Step Guided Procurement Booking',
      highlight: 'Safe physical buffer allocated at Bhopal Centre 04 for 10:00–11:00 AM.'
    },
    {
      title: '5. Mandi Gate Arrival & Check-in',
      subtitle: 'Token CG-WHT-2841 QR Validated',
      highlight: 'Gate pass logged at 10:04 AM. Tractor MP-04-AB-9842 authorized for entry.'
    },
    {
      title: '6. Anti-Starvation Mandi Queue',
      subtitle: 'Expected Turn Window 10:20–10:50 AM',
      highlight: 'Transparent queue position with 2 vehicles ahead in Lane Q1.'
    },
    {
      title: '7. Weighbridge Physical Scale Truth',
      subtitle: '74.25 Quintals Net Payload Locked',
      highlight: 'Gross: 92.40 q, Tare: 18.15 q = Verified Net: 74.25 q recorded.'
    },
    {
      title: '8. Grain Quality Assay & Silo Custody',
      subtitle: 'Moisture 11.2% • Grade FAQ Passed',
      highlight: 'Zero penalty deductions. Grain discharged into Silo Intake Bay 02.'
    },
    {
      title: '9. Direct Benefit Transfer (DBT) Credited',
      subtitle: '₹1,68,918 Deposited into SBI Bank',
      highlight: '100% MSP dues settled directly via PFMS DBT to Ramesh Patel.'
    }
  ];

  const currentStep = demoSteps[demoStepIndex] || demoSteps[0];

  const handleNext = () => {
    if (demoStepIndex < demoSteps.length - 1) {
      setDemoStep(demoStepIndex + 1);
    } else {
      setDemoStep(0);
    }
  };

  const handlePrev = () => {
    if (demoStepIndex > 0) {
      setDemoStep(demoStepIndex - 1);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed top-14 right-3 z-30 animate-fadeIn">
        <button
          onClick={() => setIsMinimized(false)}
          className="px-3 py-1.5 bg-[#05224D] text-white text-xs font-mono font-bold rounded-full border-2 border-[#F47920] shadow-lg flex items-center gap-1.5 hover:bg-[#203864]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F47920]" />
          <span>SIH EVALUATOR GUIDE ({demoStepIndex + 1}/9)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#05224D] text-white border-y-2 border-[#F47920] px-3 sm:px-5 py-2 shadow-md animate-fadeIn text-xs select-none">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Left: Step Information */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 rounded-full bg-[#F47920] text-white font-mono font-bold flex items-center justify-center shrink-0">
            {demoStepIndex + 1}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#F47920] font-bold uppercase tracking-wider">
                SIH26032 EVALUATOR JOURNEY WALKTHROUGH
              </span>
              <span className="text-[10px] text-slate-300">
                ({demoStepIndex + 1} of {demoSteps.length})
              </span>
            </div>
            <div className="font-bold text-white tracking-tight sm:text-sm">
              {currentStep.title}
            </div>
            <div className="text-[11px] text-slate-200 hidden md:block">
              {currentStep.highlight}
            </div>
          </div>
        </div>

        {/* Right: Next / Prev Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
          <button
            disabled={demoStepIndex === 0}
            onClick={handlePrev}
            className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
            title="Previous Demo Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            className="btn-press px-3 py-1 bg-[#F47920] hover:bg-[#e06b18] text-white font-mono font-bold text-xs rounded flex items-center gap-1 shadow"
          >
            <span>{demoStepIndex === demoSteps.length - 1 ? 'RESTART GUIDE' : 'NEXT STEP'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded hover:bg-white/10 text-slate-300 ml-1"
            title="Minimize guide banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
