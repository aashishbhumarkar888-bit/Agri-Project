import React, { useState } from 'react';
import { useFarmerStore } from '../../../hooks/useFarmerStore';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Sprout, 
  Calendar, 
  Compass, 
  Sparkles,
  Phone
} from 'lucide-react';

export const FarmerOnboardingModal: React.FC = () => {
  const { showOnboardingModal, setShowOnboardingModal, setActiveTab } = useFarmerStore();
  const [step, setStep] = useState(0);

  if (!showOnboardingModal) return null;

  const screens = [
    {
      title: 'Welcome to Your Harvest Journey',
      subtitle: 'Digital booking backed by physical truth at the Mandi',
      icon: Sparkles,
      iconColor: 'text-[#F47920]',
      description: 'CODERGALAXY connects your farm directly to government MSP procurement centres. No middlemen, no panic queues, and zero unaccounted deductions.',
      benefit: 'Guaranteed yard arrival slot with fair turn scheduling'
    },
    {
      title: 'Complete Your Farmer Profile',
      subtitle: 'Land records and identity linked safely',
      icon: ShieldCheck,
      iconColor: 'text-[#228B22]',
      description: 'Link your land Khasra record and masked Aadhaar identity once. Your profile achieves 100% verification so your MSP payments are deposited directly into your bank.',
      benefit: 'Privacy protected: Your sensitive numbers are never exposed'
    },
    {
      title: 'Declare Your Harvest Crops',
      subtitle: 'Wheat, Paddy, Soybean and more',
      icon: Sprout,
      iconColor: 'text-[#228B22]',
      description: 'Log your standing or harvested crops with approximate quintals. View live official MSP rates and track crop readiness for procurement.',
      benefit: 'Official MSP 2026 guaranteed price protection'
    },
    {
      title: 'Reserve a Verified Arrival Window',
      subtitle: 'Choose your preferred date and time slot',
      icon: Calendar,
      iconColor: 'text-[#203864]',
      description: 'Pick an arrival window that suits your harvesting schedule. Physical yard capacity is reserved specifically for your vehicle to prevent road congestion.',
      benefit: 'Receive instant digital token pass with gate QR code'
    },
    {
      title: 'Follow Live Harvest Progress',
      subtitle: 'From gate check-in to bank credit',
      icon: Compass,
      iconColor: 'text-[#F47920]',
      description: 'Track your vehicle in real-time through the gate, weighing scales, quality moisture assay, and direct DBT bank settlement.',
      benefit: 'Works even without a smartphone via SMS 51969 & IVR'
    }
  ];

  const current = screens[step];
  const Icon = current.icon;

  const handleNext = () => {
    if (step < screens.length - 1) {
      setStep(step + 1);
    } else {
      setShowOnboardingModal(false);
      setActiveTab('home');
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-[10px] max-w-md w-full border border-[#C4C6D0] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#203864] text-white flex items-center justify-between border-b-2 border-[#F47920]">
          <div className="text-xs font-mono font-bold text-[#F47920] uppercase tracking-wider">
            FARMER ONBOARDING GUIDE • STEP {step + 1} OF {screens.length}
          </div>
          <button
            onClick={() => setShowOnboardingModal(false)}
            className="text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F1F4F9] border-2 border-[#C4C6D0] flex items-center justify-center mx-auto shadow-inner">
            <Icon className={`w-8 h-8 ${current.iconColor}`} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#05224D] tracking-tight">
              {current.title}
            </h3>
            <div className="text-xs text-[#F47920] font-semibold mt-0.5">
              {current.subtitle}
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-sans px-2">
            {current.description}
          </p>

          <div className="p-3 bg-green-50 border border-green-200 rounded-[6px] text-xs text-[#228B22] font-medium flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{current.benefit}</span>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {screens.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-[#F47920]' : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Nav Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              disabled={step === 0}
              onClick={handlePrev}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 disabled:opacity-30 flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK</span>
            </button>

            <button
              onClick={handleNext}
              className="btn-press px-5 py-2 bg-[#203864] hover:bg-[#172033] text-white text-xs font-bold rounded flex items-center gap-1.5 shadow"
            >
              <span>{step === screens.length - 1 ? 'GET STARTED' : 'CONTINUE'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
