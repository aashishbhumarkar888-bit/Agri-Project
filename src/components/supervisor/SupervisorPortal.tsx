import React, { useState } from 'react';
import { useMandiStore } from '../../hooks/useMandiStore';
import { TrustBadge } from '../ui/TrustBadge';
import { StatusBadge } from '../ui/StatusBadge';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Scale, 
  Sliders, 
  Unlock, 
  Lock,
  RotateCcw
} from 'lucide-react';

export const SupervisorPortal: React.FC = () => {
  const { hardware, toggleSupervisorBypass, tokens, advanceTokenState, selectedCentre } = useMandiStore();

  const [disputeNotes, setDisputeNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'exceptions' | 'bypass' | 'calibration'>('exceptions');

  const exceptionTokens = tokens.filter(t => t.laneId === 'lane_exception' || t.status === 'QUALITY_CHECK' || t.moisturePercent > 12.0);

  return (
    <div className="max-w-5xl mx-auto space-y-4 select-none">
      {/* Supervisor Header */}
      <div className="bg-[#172033] text-white p-4 rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border-b-4 border-[#D97706]">
        <div>
          <div className="text-[10px] font-mono text-[#F47920] uppercase font-bold tracking-wider">
            CENTRE SUPERVISOR OPERATIONS CONSOLE
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Yard Audit & Physical Override Authority
          </h2>
          <div className="text-xs text-slate-300 mt-0.5">
            Centre: {selectedCentre.name} • Station: SUP-BPL-01
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TrustBadge tier={hardware.trustTier} />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#C4C6D0] rounded-[6px] p-1 flex text-xs font-semibold">
        <button
          onClick={() => setActiveTab('exceptions')}
          className={`flex-1 py-2 rounded text-center transition-all ${
            activeTab === 'exceptions' ? 'bg-[#203864] text-white' : 'text-[#172033] hover:bg-slate-100'
          }`}
        >
          ACTIVE EXCEPTIONS & DISPUTES ({exceptionTokens.length})
        </button>
        <button
          onClick={() => setActiveTab('bypass')}
          className={`flex-1 py-2 rounded text-center transition-all ${
            activeTab === 'bypass' ? 'bg-[#203864] text-white' : 'text-[#172033] hover:bg-slate-100'
          }`}
        >
          HARDWARE BYPASS CONTROLS (TIER 3)
        </button>
        <button
          onClick={() => setActiveTab('calibration')}
          className={`flex-1 py-2 rounded text-center transition-all ${
            activeTab === 'calibration' ? 'bg-[#203864] text-white' : 'text-[#172033] hover:bg-slate-100'
          }`}
        >
          CALIBRATION & SENSOR HEALTH
        </button>
      </div>

      {/* Tab 1: Exceptions & Disputes */}
      {activeTab === 'exceptions' && (
        <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#E7ECF2] pb-2 text-xs font-bold text-[#203864] uppercase font-mono">
            <span>PENDING EXCEPTION TOKENS REQUIRING SUPERVISORY ACTION</span>
            <span className="text-slate-500 font-normal">Lane Q2 Dedicated</span>
          </div>

          <div className="space-y-3">
            {exceptionTokens.map((t) => (
              <div key={t.id} className="p-3.5 bg-[#F7F9FC] border border-[#C4C6D0] rounded-[6px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-[#05224D]">{t.id}</span>
                    <span className="text-slate-600 font-semibold">{t.farmerName}</span>
                    <span className="text-slate-400 font-mono text-[10px]">({t.vehicleNumber})</span>
                    <StatusBadge status={t.status} />
                  </div>
                  <div className="text-[11px] text-slate-600 flex gap-3 font-mono">
                    <span>Crop: <strong className="uppercase">{t.crop}</strong></span>
                    <span>•</span>
                    <span>Moisture: <strong className={t.moisturePercent > 12 ? 'text-[#DC2626]' : 'text-[#228B22]'}>{t.moisturePercent}%</strong> (Threshold: 12.0%)</span>
                    <span>•</span>
                    <span>Est: {t.estimatedQuantityQtl} q</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => advanceTokenState(t.id, 'WEIGHING')}
                    className="btn-press px-3 py-1.5 bg-[#228B22] text-white rounded font-semibold text-xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>AUTHORIZE WEIGHBRIDGE</span>
                  </button>

                  <button
                    onClick={() => advanceTokenState(t.id, 'QUALITY_CHECK')}
                    className="btn-press px-3 py-1.5 bg-[#203864] text-white rounded font-semibold text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>RE-SAMPLE NIR</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Bypass Controls */}
      {activeTab === 'bypass' && (
        <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#D97706] uppercase font-mono border-b border-[#E7ECF2] pb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>EMERGENCY MANUAL FALLBACK (SUPERVISOR ECDSA KEY ACTIVATION)</span>
          </div>

          <p className="text-xs text-[#44474F] leading-relaxed">
            In the event of hardware load-cell terminal damage, rodent severed RS-232 cable, or severe power interruption, the supervisor may authorize Tier 3 Manual Fallback. All entries will be marked as Tier 3 with permanent digital audit trails.
          </p>

          <div className="p-4 bg-[#F7F9FC] border border-[#C4C6D0] rounded-[6px] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#172033]">
                Current Operational Mode: {hardware.supervisorBypassActive ? 'MANUAL FALLBACK ACTIVE (TIER 3)' : 'HARDWARE ATTESTED (TIER 1)'}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                {hardware.supervisorBypassActive 
                  ? `Authorized by ${hardware.supervisorBypassAuthBy} • Reason: ${hardware.bypassReason}`
                  : 'Automated tamper-evident load cell attestation active'}
              </div>
            </div>

            <button
              onClick={() => toggleSupervisorBypass(!hardware.supervisorBypassActive, 'Manual field calibration inspection conducted')}
              className={`btn-press px-4 py-2 rounded text-xs font-mono font-bold shadow ${
                hardware.supervisorBypassActive
                  ? 'bg-[#228B22] text-white'
                  : 'bg-[#D97706] text-white'
              }`}
            >
              {hardware.supervisorBypassActive ? 'RESTORE TIER 1 ATTESTED' : 'AUTHORIZE TIER 3 BYPASS'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Calibration */}
      {activeTab === 'calibration' && (
        <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-5 shadow-sm space-y-3">
          <div className="text-xs font-bold text-[#203864] uppercase font-mono border-b border-[#E7ECF2] pb-2">
            WEIGHBRIDGE METROLOGICAL CALIBRATION CERTIFICATE
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 bg-[#F7F9FC] border border-[#C4C6D0] rounded">
              <span className="text-[10px] text-slate-500 block">DEVICE ID</span>
              <strong className="text-[#172033]">{hardware.deviceId}</strong>
            </div>
            <div className="p-2.5 bg-[#F7F9FC] border border-[#C4C6D0] rounded">
              <span className="text-[10px] text-slate-500 block">LAST CALIBRATION</span>
              <strong className="text-[#228B22]">{hardware.calibrationCertifiedDate}</strong>
            </div>
            <div className="p-2.5 bg-[#F7F9FC] border border-[#C4C6D0] rounded">
              <span className="text-[10px] text-slate-500 block">FIRMWARE</span>
              <strong className="text-[#172033]">{hardware.firmwareVersion}</strong>
            </div>
            <div className="p-2.5 bg-[#F7F9FC] border border-[#C4C6D0] rounded">
              <span className="text-[10px] text-slate-500 block">ZERO OFFSET DRIFT</span>
              <strong className="text-[#228B22]">0.00 q (STABLE)</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
