import React, { useState } from 'react';
import { useMandiStore } from '../../hooks/useMandiStore';
import { TrustBadge } from '../ui/TrustBadge';
import { 
  Scale, 
  Cpu, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Sliders, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const WeighbridgeConsole: React.FC = () => {
  const { hardware, updateWeighbridgeWeights, toggleSupervisorBypass, selectedToken } = useMandiStore();

  const [grossInput, setGrossInput] = useState(hardware.grossWeightQtl.toString());
  const [tareInput, setTareInput] = useState(hardware.tareWeightQtl.toString());
  const [showBypassModal, setShowBypassModal] = useState(false);
  const [bypassReason, setBypassReason] = useState('Optical tare confirmed — junction box terminal inspection pending');

  const handleApplyWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const g = parseFloat(grossInput) || 0;
    const t = parseFloat(tareInput) || 0;
    updateWeighbridgeWeights(g, t);
  };

  const handleToggleBypass = () => {
    if (!hardware.supervisorBypassActive) {
      setShowBypassModal(true);
    } else {
      toggleSupervisorBypass(false);
    }
  };

  const confirmBypass = () => {
    toggleSupervisorBypass(true, bypassReason);
    setShowBypassModal(false);
  };

  return (
    <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-4 flex flex-col gap-3 shadow-sm select-none">
      {/* Module Header */}
      <div className="flex items-center justify-between border-b border-[#E7ECF2] pb-2">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#203864]" />
          <span className="font-bold text-xs uppercase tracking-wide text-[#172033]">
            WEIGHBRIDGE HARDWARE CONSOLE
          </span>
        </div>
        <TrustBadge tier={hardware.trustTier} />
      </div>

      {/* Primary Recessed Instrument Gauge (Obsidian Well) */}
      <div className="bg-[#172033] border border-[#05224D] rounded-[6px] p-3 text-white flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#228B22]" />
            <span>DEV: {hardware.deviceId}</span>
          </span>
          <span className="text-[#77dd6a] flex items-center gap-1">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>LATENCY: {hardware.latencyMs}ms</span>
          </span>
        </div>

        {/* 3-Column Metric Display: Gross, Tare, Net */}
        <div className="grid grid-cols-3 gap-2 py-1 text-center divide-x divide-slate-700 font-mono">
          <div>
            <div className="text-[10px] text-slate-400 font-sans tracking-wide">GROSS WEIGHT</div>
            <div className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {hardware.grossWeightQtl.toFixed(2)}
              <span className="text-xs font-normal text-slate-400 ml-1">q</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-sans tracking-wide">TARE WEIGHT</div>
            <div className="text-xl md:text-2xl font-bold text-slate-300 tracking-tight">
              {hardware.tareWeightQtl.toFixed(2)}
              <span className="text-xs font-normal text-slate-400 ml-1">q</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[#77dd6a] font-sans tracking-wide font-bold">NET PAYLOAD</div>
            <div className="text-xl md:text-2xl font-bold text-[#228B22] tracking-tight">
              {hardware.netPayloadQtl.toFixed(2)}
              <span className="text-xs font-normal text-[#77dd6a] ml-1">q</span>
            </div>
          </div>
        </div>

        {/* 4 Load Cells Individual Sensor Balance */}
        <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-[10px] font-mono text-slate-300">
          <span className="text-slate-400">LOAD CELLS (LC1–4):</span>
          <div className="flex gap-2">
            {hardware.loadCells.map((val, idx) => (
              <span key={idx} className="bg-slate-800 px-1.5 py-0.5 rounded text-[9px] border border-slate-700">
                LC{idx + 1}: <strong className="text-white">{val}q</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hardware Telemetry Pipeline Chain: RS232 -> ESP32 -> MQTT -> STATE ENGINE -> LOCKED */}
      <div className="p-2.5 bg-[#F7F9FC] border border-[#C4C6D0] rounded-[6px] text-[10px] font-mono">
        <div className="text-slate-500 mb-1.5 flex items-center justify-between">
          <span className="font-semibold text-[#172033]">HARDWARE ATTESTATION PIPELINE:</span>
          <span className="text-[#228B22] flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            STATE LOCKED
          </span>
        </div>

        <div className="flex items-center justify-between gap-1 overflow-x-auto text-center font-bold">
          <span className="px-1.5 py-1 bg-white border border-[#C4C6D0] rounded text-[#203864]">RS232</span>
          <span className="text-slate-400">→</span>
          <span className="px-1.5 py-1 bg-white border border-[#C4C6D0] rounded text-[#203864]">ESP32</span>
          <span className="text-slate-400">→</span>
          <span className="px-1.5 py-1 bg-white border border-[#C4C6D0] rounded text-[#203864]">MQTT</span>
          <span className="text-slate-400">→</span>
          <span className="px-1.5 py-1 bg-white border border-[#C4C6D0] rounded text-[#203864]">STATE ENGINE</span>
          <span className="text-slate-400">→</span>
          <span className="px-1.5 py-1 bg-[#228B22] text-white rounded">LOCKED</span>
        </div>
      </div>

      {/* Interactive Weight Simulator (For Staff Weighbridge Calibration & Demo) */}
      <form onSubmit={handleApplyWeight} className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="block text-[10px] font-semibold text-[#44474F] mb-0.5">
            SIMULATE GROSS (q)
          </label>
          <input
            type="number"
            step="0.05"
            value={grossInput}
            onChange={(e) => setGrossInput(e.target.value)}
            className="w-full bg-white border border-[#C4C6D0] rounded-[4px] px-2 py-1 font-mono text-xs text-[#172033] focus:border-[#203864] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-[#44474F] mb-0.5">
            SIMULATE TARE (q)
          </label>
          <input
            type="number"
            step="0.05"
            value={tareInput}
            onChange={(e) => setTareInput(e.target.value)}
            className="w-full bg-white border border-[#C4C6D0] rounded-[4px] px-2 py-1 font-mono text-xs text-[#172033] focus:border-[#203864] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="btn-press col-span-2 bg-[#203864] hover:bg-[#1a2d52] text-white py-1.5 rounded-[4px] font-semibold text-xs flex items-center justify-center gap-1 transition-all"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>COMMIT TELEMETRIC WEIGHT TO SENSORS</span>
        </button>
      </form>

      {/* Manual Fallback Warning & Supervisor Trigger */}
      {hardware.supervisorBypassActive ? (
        <div className="p-2.5 bg-amber-50 border border-[#D97706] rounded-[6px] text-xs">
          <div className="flex items-center gap-1.5 text-[#D97706] font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>SUPERVISOR AUTHORIZATION ACTIVE (TIER 3)</span>
          </div>
          <p className="text-[11px] text-amber-900 mt-1 leading-tight">
            Reason: {hardware.bypassReason}. Authorized by: {hardware.supervisorBypassAuthBy}
          </p>
          <button
            onClick={handleToggleBypass}
            className="btn-press mt-2 text-[10px] font-bold text-white bg-[#228B22] px-2.5 py-1 rounded"
          >
            RESTORE HARDWARE ATTESTED TIER 1
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-slate-500 font-mono">
            CALIBRATION CERTIFIED: {hardware.calibrationCertifiedDate}
          </span>
          <button
            onClick={handleToggleBypass}
            className="text-[10px] text-[#D97706] hover:underline font-mono font-medium flex items-center gap-1"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>TRIGGER MANUAL FALLBACK</span>
          </button>
        </div>
      )}

      {/* Modal for Supervisor Bypass Reason */}
      {showBypassModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#203864] rounded-[8px] max-w-md w-full p-4 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-[#D97706] font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>HARDWARE BYPASS AUTHORIZATION (TIER 3)</span>
            </div>
            <p className="text-xs text-[#44474F] leading-normal">
              Manual fallback requires physical supervisor justification. This action is permanently recorded in the immutable cryptographic ledger.
            </p>
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1">
                Audit Justification:
              </label>
              <textarea
                value={bypassReason}
                onChange={(e) => setBypassReason(e.target.value)}
                rows={3}
                className="w-full border border-[#C4C6D0] rounded p-2 text-xs font-mono focus:outline-none focus:border-[#203864]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBypassModal(false)}
                className="px-3 py-1.5 rounded text-xs text-[#44474F] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmBypass}
                className="btn-press px-3 py-1.5 rounded text-xs bg-[#D97706] text-white font-bold hover:bg-amber-600"
              >
                AUTHORIZE HARDWARE BYPASS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
