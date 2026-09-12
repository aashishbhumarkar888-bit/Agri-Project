import React from 'react';
import { useMandiStore } from '../../hooks/useMandiStore';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  X, 
  Play, 
  ShieldCheck, 
  Cpu, 
  WifiOff, 
  Scale, 
  Database,
  Lock
} from 'lucide-react';

export const SihDemoPlaybook: React.FC = () => {
  const { 
    isDemoMode, 
    setDemoMode, 
    demoStep, 
    setDemoStep, 
    setRole, 
    advanceTokenState, 
    simulateOfflineCut, 
    isOffline,
    tokens
  } = useMandiStore();

  if (!isDemoMode) return null;

  const demoSteps = [
    {
      title: 'Step 1: Digital Booking to Physical Truth',
      targetRole: 'farmer',
      description: 'Farmer books 50q wheat. The system checks physical silo telemetry before confirming the reservation, guaranteeing zero-overshoot capacity.',
      actionLabel: 'Switch to Farmer View & Book Slot',
      onRun: () => {
        setRole('farmer');
      }
    },
    {
      title: 'Step 2: Gate Check-in & Barrier Activation',
      targetRole: 'staff',
      description: 'Vehicle CG-WHT-2841 arrives at gate. ANPR camera validates token, and the physical barrier arm opens.',
      actionLabel: 'Trigger Gate Pass Validation',
      onRun: () => {
        setRole('staff');
        advanceTokenState('CG-WHT-2841', 'GATE_CHECKIN');
      }
    },
    {
      title: 'Step 3: WDRR Anti-Starvation Scheduling',
      targetRole: 'staff',
      description: 'Inspect the 3 lanes (Q1 Normal, Q2 Exception, Q3 Assisted). Note non-preemptive lock on active semi-trailer, preventing starvation of smaller tractors.',
      actionLabel: 'Inspect WDRR Lanes',
      onRun: () => {
        setRole('staff');
        advanceTokenState('CG-WHT-2841', 'QUEUED');
      }
    },
    {
      title: 'Step 4: ESP32 Hardware Weighbridge Lock',
      targetRole: 'staff',
      description: 'Load cells capture Gross (62.30q) & Tare (16.15q) yielding Net Payload (46.15q). RS232-streamed weights lock cryptographically as Tier 1 Attested.',
      actionLabel: 'Simulate Weighbridge Telemetry',
      onRun: () => {
        setRole('staff');
        advanceTokenState('CG-WHT-2841', 'WEIGHING');
      }
    },
    {
      title: 'Step 5: Silo Capacity Invariant Enforcement',
      targetRole: 'admin',
      description: 'C_allocatable = C_max - C_occupied - C_reserved. Verify mathematical proof preventing Mandi gridlock and panic selling.',
      actionLabel: 'View Capacity Invariant Proof',
      onRun: () => {
        setRole('admin');
        advanceTokenState('CG-WHT-2841', 'UNLOADING');
      }
    },
    {
      title: 'Step 6: Network Severance & P2P Mesh Replay',
      targetRole: 'staff',
      description: 'Simulate total internet cut. Mandi operations continue uninterrupted in local IndexedDB. Quota transfers between local peers via cryptographic ratchets.',
      actionLabel: isOffline ? 'Cloud Severed — Reconnect' : 'Simulate Offline Cut Now',
      onRun: () => {
        setRole('staff');
        simulateOfflineCut(!isOffline);
      }
    },
    {
      title: 'Step 7: Immutable Ledger & DBT PFMS Settlement',
      targetRole: 'admin',
      description: 'Physical transfer confirmed. The event ledger appends SHA-256 block with 0 skew drift, and PFMS bank payment of ₹1,05,000 is settled.',
      actionLabel: 'Inspect Bitwise Ledger & Settle DBT',
      onRun: () => {
        setRole('admin');
        advanceTokenState('CG-WHT-2841', 'SETTLED');
      }
    }
  ];

  const currentStep = demoSteps[demoStep] || demoSteps[0];

  const handleNext = () => {
    if (demoStep < demoSteps.length - 1) {
      const nextStepIndex = demoStep + 1;
      setDemoStep(nextStepIndex);
      demoSteps[nextStepIndex].onRun();
    } else {
      setDemoMode(false);
    }
  };

  const handlePrev = () => {
    if (demoStep > 0) {
      const prevStepIndex = demoStep - 1;
      setDemoStep(prevStepIndex);
      demoSteps[prevStepIndex].onRun();
    }
  };

  return (
    <div className="fixed bottom-9 right-4 z-50 max-w-md w-full bg-[#05224D] text-white border-2 border-[#F47920] rounded-[8px] shadow-2xl p-4 select-none animate-fadeIn">
      {/* Playbook Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#F47920]" />
          <div>
            <span className="text-[10px] font-mono text-[#F47920] font-bold uppercase tracking-wider block">
              SIH 2026 • SIH26032 EVALUATOR PLAYBOOK
            </span>
            <h3 className="text-sm font-bold text-white tracking-tight">
              {currentStep.title}
            </h3>
          </div>
        </div>
        <button
          onClick={() => setDemoMode(false)}
          className="text-slate-400 hover:text-white p-1"
          title="Exit Playbook"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
        {currentStep.description}
      </p>

      {/* Action Trigger Button */}
      <button
        onClick={currentStep.onRun}
        className="btn-press w-full py-2 bg-[#F47920] hover:bg-[#e06b18] text-white font-mono font-bold text-xs rounded flex items-center justify-center gap-1.5 shadow"
      >
        <Play className="w-3.5 h-3.5" />
        <span>{currentStep.actionLabel}</span>
      </button>

      {/* Progress Footer */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10 text-[11px] font-mono text-slate-400">
        <div className="flex gap-1">
          {demoSteps.map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-1.5 rounded-full transition-all ${
                i === demoStep ? 'bg-[#F47920] w-5' : i < demoStep ? 'bg-[#228B22]' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={demoStep === 0}
            onClick={handlePrev}
            className="p-1 text-slate-300 hover:text-white disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span>
            {demoStep + 1} / {demoSteps.length}
          </span>
          <button
            onClick={handleNext}
            className="p-1 text-slate-300 hover:text-white"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
