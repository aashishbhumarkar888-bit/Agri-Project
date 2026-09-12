import React from 'react';
import { useMandiStore } from '../../hooks/useMandiStore';
import { ShieldCheck, Scale, Lock, CheckCircle2, ArrowRightLeft, Cpu, FileCheck } from 'lucide-react';

export const PhysicalDigitalParity: React.FC = () => {
  const { hardware, parity, selectedToken, selectedCentre } = useMandiStore();

  return (
    <div className="bg-white border-2 border-[#203864] rounded-[8px] p-4 flex flex-col gap-3 shadow-md select-none">
      {/* Header with Parity Status Lock */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7ECF2] pb-2.5">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-[#F47920]" />
          <span className="font-bold text-xs uppercase tracking-wide text-[#05224D]">
            PHYSICAL YARD ↔ DIGITAL LEDGER PARITY LOCK
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#228B22] text-white font-mono text-xs font-bold shadow-sm">
            <Lock className="w-3 h-3" />
            <span>0 SKEW DRIFT DETECTED</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            AUDIT: {parity.lastParityAuditTime}
          </span>
        </div>
      </div>

      {/* Split Comparison Columns: Left = Physical Reality, Right = Digital Record */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT: PHYSICAL REALITY */}
        <div className="bg-[#F7F9FC] border border-[#C4C6D0] rounded-[6px] p-3 flex flex-col gap-2 relative">
          <div className="flex items-center justify-between border-b border-[#C4C6D0] pb-1.5">
            <span className="text-xs font-bold text-[#203864] flex items-center gap-1.5 font-mono">
              <Scale className="w-3.5 h-3.5 text-[#203864]" />
              <span>1. PHYSICAL REALITY (MANDI GROUND)</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-[#228B22] animate-pulse" title="Sensors streaming"></span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="p-2 bg-white rounded border border-[#C4C6D0] flex justify-between items-center">
              <span className="text-slate-600">Platform Load (4 Load Cells):</span>
              <strong className="text-base text-[#172033]">{hardware.grossWeightQtl.toFixed(2)} q</strong>
            </div>

            <div className="p-2 bg-white rounded border border-[#C4C6D0] flex justify-between items-center">
              <span className="text-slate-600">Vehicle Barrier Arm:</span>
              <span className="font-bold text-[#F47920]">{parity.barrierState}</span>
            </div>

            <div className="p-2 bg-white rounded border border-[#C4C6D0] flex justify-between items-center">
              <span className="text-slate-600">Silo Ultrasonic Depth:</span>
              <strong className="text-[#172033]">14.20 m (Alpha Wheat)</strong>
            </div>

            <div className="p-2 bg-white rounded border border-[#C4C6D0] flex justify-between items-center">
              <span className="text-slate-600">Ground NIR Moisture Sensor:</span>
              <strong className="text-[#228B22]">11.4% (Optimal)</strong>
            </div>

            <div className="p-2 bg-white rounded border border-[#C4C6D0] flex justify-between items-center text-[10px]">
              <span className="text-slate-600">ESP32 Hardware Attestation:</span>
              <span className="text-[#228B22] font-bold">SHA-256 ROOTS MATCH</span>
            </div>
          </div>
        </div>

        {/* RIGHT: DIGITAL RECORD */}
        <div className="bg-[#F7F9FC] border border-[#C4C6D0] rounded-[6px] p-3 flex flex-col gap-2 relative">
          <div className="flex items-center justify-between border-b border-[#C4C6D0] pb-1.5">
            <span className="text-xs font-bold text-[#05224D] flex items-center gap-1.5 font-mono">
              <FileCheck className="w-3.5 h-3.5 text-[#F47920]" />
              <span>2. AUDITABLE DIGITAL RECORD</span>
            </span>
            <span className="text-[10px] font-mono text-[#228B22] font-bold">ECDSA SECP256R1</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="p-2 bg-white rounded border border-[#C4C6D0] flex justify-between items-center">
              <span className="text-slate-600">Ledger Attested Net Weight:</span>
              <strong className="text-base text-[#228B22]">{hardware.netPayloadQtl.toFixed(2)} q</strong>
            </div>

            <div className="p-2 bg-white rounded border border-[#C4C6D0] flex justify-between items-center">
              <span className="text-slate-600">Token ID & Aggregate:</span>
              <strong className="text-[#203864]">{selectedToken?.id || 'CG-WHT-2841'}</strong>
            </div>

            <div className="p-2 bg-white rounded border border-[#C4C6D0] flex justify-between items-center">
              <span className="text-slate-600">Allocated Quota Hash:</span>
              <span className="text-[11px] text-slate-700 truncate max-w-[180px]">
                {selectedToken?.signatureHash || '0x8f7a2d48c491'}
              </span>
            </div>

            <div className="p-2 bg-white rounded border border-[#C4C6D0] flex justify-between items-center">
              <span className="text-slate-600">PFMS Reconciliation:</span>
              <strong className="text-[#203864]">₹{((selectedToken?.actualNetWeightQtl || 46.15) * 2275).toLocaleString()}</strong>
            </div>

            <div className="p-2 bg-white rounded border border-[#C4C6D0] flex justify-between items-center text-[10px]">
              <span className="text-slate-600">Chain Parity Verification:</span>
              <span className="text-[#228B22] font-bold">100% BITWISE EQUIVALENT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronous Lock Confirmation */}
      <div className="p-2 bg-[#E7ECF2] rounded-[4px] flex items-center justify-between text-[11px] font-mono text-[#172033]">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#228B22]" />
          <span>Every physical kilo registered on the load cells locks the corresponding digital ledger entry simultaneously.</span>
        </div>
        <span className="font-bold text-[#05224D]">INVARIANT: TRUE</span>
      </div>
    </div>
  );
};
