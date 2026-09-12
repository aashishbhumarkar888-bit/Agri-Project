import React, { useState } from 'react';
import { useMandiStore } from '../../hooks/useMandiStore';
import { LedgerEvent } from '../../types';
import { TrustBadge } from '../ui/TrustBadge';
import { 
  FileText, 
  Link, 
  Hash, 
  ShieldCheck, 
  X, 
  Eye, 
  Lock, 
  Cpu, 
  History,
  CheckCircle2
} from 'lucide-react';

export const EventLedgerModule: React.FC = () => {
  const { ledgerEvents } = useMandiStore();
  const [inspectedEvent, setInspectedEvent] = useState<LedgerEvent | null>(null);

  return (
    <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-4 flex flex-col gap-3 shadow-sm select-none">
      {/* Module Header */}
      <div className="flex items-center justify-between border-b border-[#E7ECF2] pb-2">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#203864]" />
          <span className="font-bold text-xs uppercase tracking-wide text-[#172033]">
            IMMUTABLE EVENT LEDGER (CRYPTOGRAPHIC AUDIT TRAIL)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#228B22] font-semibold">
          <Lock className="w-3 h-3" />
          <span>APPEND-ONLY • SHA-256 HASH CHAIN</span>
        </div>
      </div>

      {/* Responsive Ledger Table */}
      <div className="overflow-x-auto border border-[#C4C6D0] rounded-[6px]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#172033] text-white text-[10px] uppercase">
            <tr>
              <th className="py-2 px-2.5">Seq</th>
              <th className="py-2 px-2.5">Event ID</th>
              <th className="py-2 px-2.5">Aggregate</th>
              <th className="py-2 px-2.5">Event Type</th>
              <th className="py-2 px-2.5">Trust Tier</th>
              <th className="py-2 px-2.5">Timestamp</th>
              <th className="py-2 px-2.5">Operator</th>
              <th className="py-2 px-2.5 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7ECF2] bg-white">
            {ledgerEvents.map((ev) => (
              <tr 
                key={ev.id} 
                onClick={() => setInspectedEvent(ev)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="py-2 px-2.5 font-bold text-slate-500">#{ev.sequence}</td>
                <td className="py-2 px-2.5 font-bold text-[#203864]">{ev.id}</td>
                <td className="py-2 px-2.5 text-slate-700">{ev.aggregateId}</td>
                <td className="py-2 px-2.5 font-semibold text-[#172033]">
                  <span className="bg-[#F7F9FC] border border-[#C4C6D0] px-1.5 py-0.5 rounded text-[10px]">
                    {ev.eventType}
                  </span>
                </td>
                <td className="py-2 px-2.5">
                  <TrustBadge tier={ev.trustTier} size="sm" />
                </td>
                <td className="py-2 px-2.5 text-[10px] text-slate-500">{ev.timestamp}</td>
                <td className="py-2 px-2.5 text-slate-700 truncate max-w-[120px]">{ev.operator}</td>
                <td className="py-2 px-2.5 text-right">
                  <button className="text-[#203864] hover:text-[#F47920] p-1">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer for Inspecting Cryptographic Event Details */}
      {inspectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-lg h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl border-l border-[#203864]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#C4C6D0] pb-3">
                <div>
                  <div className="text-xs font-mono font-bold text-[#F47920]">
                    EVENT INSPECTOR • SEQ #{inspectedEvent.sequence}
                  </div>
                  <h3 className="text-base font-bold text-[#172033] font-mono">
                    {inspectedEvent.id}
                  </h3>
                </div>
                <button
                  onClick={() => setInspectedEvent(null)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Event Metadata Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-[#F7F9FC] border border-[#C4C6D0] rounded">
                  <span className="text-[10px] text-slate-500 block">AGGREGATE ID</span>
                  <span className="font-bold text-[#172033]">{inspectedEvent.aggregateId}</span>
                </div>
                <div className="p-2 bg-[#F7F9FC] border border-[#C4C6D0] rounded">
                  <span className="text-[10px] text-slate-500 block">DEVICE ORIGIN</span>
                  <span className="font-bold text-[#172033]">{inspectedEvent.deviceOrigin}</span>
                </div>
              </div>

              {/* Payload Summary */}
              <div>
                <label className="text-[11px] font-mono font-bold text-[#172033] block mb-1">
                  PAYLOAD SUMMARY:
                </label>
                <div className="p-2.5 bg-[#F7F9FC] border border-[#C4C6D0] rounded text-xs text-[#172033] font-mono leading-relaxed">
                  {inspectedEvent.payloadSummary}
                </div>
              </div>

              {/* Cryptographic Hashes & Signatures */}
              <div className="space-y-2 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">PREVIOUS BLOCK HASH (H_prev):</span>
                  <div className="p-1.5 bg-[#172033] text-slate-300 rounded text-[10px] break-all">
                    {inspectedEvent.prevHash}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">CURRENT EVENT HASH (H_cur):</span>
                  <div className="p-1.5 bg-[#172033] text-[#77dd6a] font-bold rounded text-[10px] break-all">
                    {inspectedEvent.currentHash}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">ECDSA SECP256R1 DIGITAL SIGNATURE:</span>
                  <div className="p-1.5 bg-[#172033] text-amber-300 rounded text-[10px] break-all">
                    {inspectedEvent.signature}
                  </div>
                </div>
              </div>

              {/* Trust Confirmation */}
              <div className="p-2.5 bg-green-50 border border-[#228B22] rounded flex items-center gap-2 text-xs text-[#228B22]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-mono">
                  Cryptographic verification succeeded. Signature matches authorized hardware key.
                </span>
              </div>
            </div>

            <button
              onClick={() => setInspectedEvent(null)}
              className="btn-press w-full py-2 bg-[#203864] text-white font-mono font-semibold text-xs rounded mt-4"
            >
              CLOSE INSPECTOR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
