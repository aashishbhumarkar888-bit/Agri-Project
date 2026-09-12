import React, { useState } from 'react';
import { useMandiStore } from '../../hooks/useMandiStore';
import { 
  Wifi, 
  WifiOff, 
  Share2, 
  HardDrive, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Send,
  Database,
  ArrowRight
} from 'lucide-react';

export const P2PMeshReplayBuffer: React.FC = () => {
  const { isOffline, simulateOfflineCut, p2pState, transferP2PQuota } = useMandiStore();

  const [transferAmount, setTransferAmount] = useState('100');
  const [targetDevice, setTargetDevice] = useState('ROUGH-TERMINAL-02');
  const [transferSuccess, setTransferSuccess] = useState(false);

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(transferAmount) || 0;
    const ok = transferP2PQuota('ESP32-MASTER-04', targetDevice, qty);
    if (ok) {
      setTransferSuccess(true);
      setTimeout(() => setTransferSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-4 flex flex-col gap-3 shadow-sm select-none">
      {/* Module Header */}
      <div className="flex items-center justify-between border-b border-[#E7ECF2] pb-2">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#203864]" />
          <span className="font-bold text-xs uppercase tracking-wide text-[#172033]">
            LOCAL P2P MESH REPLAY BUFFER
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#228B22]/10 text-[#228B22] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#228B22]"></span>
            P2P MESH ONLINE ({p2pState.peerCount} PEERS)
          </span>
        </div>
      </div>

      {/* Network State & Offline Simulator Banner */}
      <div className={`p-3 rounded-[6px] border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
        isOffline 
          ? 'bg-amber-50 border-[#D97706] text-amber-900' 
          : 'bg-[#F7F9FC] border-[#C4C6D0] text-[#172033]'
      }`}>
        <div>
          <div className="font-bold flex items-center gap-1.5">
            {isOffline ? (
              <>
                <WifiOff className="w-4 h-4 text-[#D97706]" />
                <span className="text-[#D97706]">OFFLINE MODE — LOCAL OPERATIONS ACTIVE</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-[#228B22]" />
                <span className="text-[#203864]">APMC CLOUD CONNECTED</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-600 mt-0.5 font-mono">
            Pending events: <strong>{p2pState.localEventsCount}</strong> • Local quota: <strong>{p2pState.localQuotaQtl} q</strong> • IndexedDB: <strong className="text-[#228B22]">ACTIVE</strong>
          </p>
        </div>

        {/* The required demonstration interaction button */}
        <button
          onClick={() => simulateOfflineCut(!isOffline)}
          className={`btn-press px-3 py-1.5 rounded-[4px] font-mono text-xs font-bold transition-all shadow-sm ${
            isOffline
              ? 'bg-[#228B22] hover:bg-green-700 text-white'
              : 'bg-[#D97706] hover:bg-amber-600 text-white'
          }`}
        >
          {isOffline ? 'RECONNECT TO CLOUD' : 'SIMULATE OFFLINE CUT'}
        </button>
      </div>

      {/* 4-Stage Transaction Flow: REQUEST → GRANT → COMMIT → ACKNOWLEDGE */}
      <div className="bg-[#172033] p-3 rounded-[6px] text-white space-y-2">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span>P2P CRYPTOGRAPHIC RATCHET TRANSACTION FLOW:</span>
          <span className="text-[#77dd6a]">STEP #{p2pState.cryptographicRatchetStep}</span>
        </div>

        <div className="grid grid-cols-4 gap-1 text-center font-mono text-xs">
          <div className="p-1.5 bg-white/10 rounded border border-white/20">
            <div className="text-[9px] text-slate-400">STAGE 1</div>
            <div className="font-bold text-white">REQUEST</div>
          </div>
          <div className="p-1.5 bg-white/10 rounded border border-white/20">
            <div className="text-[9px] text-slate-400">STAGE 2</div>
            <div className="font-bold text-white">GRANT</div>
          </div>
          <div className="p-1.5 bg-white/10 rounded border border-white/20">
            <div className="text-[9px] text-slate-400">STAGE 3</div>
            <div className="font-bold text-white">COMMIT</div>
          </div>
          <div className="p-1.5 bg-[#228B22] rounded text-white font-bold border border-green-400">
            <div className="text-[9px] text-green-100">STAGE 4</div>
            <div>ACKNOWLEDGE</div>
          </div>
        </div>
      </div>

      {/* P2P Transfer UI Form */}
      <form onSubmit={handleExecuteTransfer} className="p-3 bg-[#F7F9FC] border border-[#C4C6D0] rounded-[6px] space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-[#203864]">
          <span>TRANSFER CAPACITY QUOTA (OFFLINE LEASE)</span>
          <span className="font-mono text-[10px] text-slate-500">
            Available to Lease: {p2pState.localQuotaQtl} q
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-semibold text-[#44474F] mb-0.5 font-mono">
              SOURCE DEVICE
            </label>
            <input
              type="text"
              readOnly
              value="ESP32-MASTER-04"
              className="w-full bg-[#E7ECF2] border border-[#C4C6D0] rounded px-2 py-1 font-mono text-xs text-slate-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#44474F] mb-0.5 font-mono">
              DESTINATION DEVICE
            </label>
            <select
              value={targetDevice}
              onChange={(e) => setTargetDevice(e.target.value)}
              className="w-full bg-white border border-[#C4C6D0] rounded px-2 py-1 font-mono text-xs text-[#172033] focus:border-[#203864]"
            >
              <option value="ROUGH-TERMINAL-02">ROUGH-TERMINAL-02</option>
              <option value="TABLET-FIELD-01">TABLET-FIELD-01</option>
              <option value="MOBILE-GATE-03">MOBILE-GATE-03</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#44474F] mb-0.5 font-mono">
              QUANTITY (QUINTALS)
            </label>
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="w-full bg-white border border-[#C4C6D0] rounded px-2 py-1 font-mono text-xs text-[#172033] focus:border-[#203864]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-press w-full bg-[#203864] hover:bg-[#1a2d52] text-white py-1.5 rounded font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>SIGN & BROADCAST P2P QUOTA CERTIFICATE</span>
        </button>

        {transferSuccess && (
          <div className="p-2 bg-green-50 border border-[#228B22] rounded text-[11px] text-[#228B22] font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>P2P capacity lease certificate cryptographically committed to local peers.</span>
          </div>
        )}
      </form>

      {/* Recent P2P Quota Transfers Log */}
      <div className="text-[10px] font-mono">
        <div className="text-slate-500 font-semibold mb-1">RECENT LOCAL LEASE CERTIFICATES:</div>
        <div className="space-y-1">
          {p2pState.transfers.map((tx) => (
            <div key={tx.id} className="p-1.5 bg-white border border-[#C4C6D0] rounded flex items-center justify-between">
              <div>
                <span className="font-bold text-[#203864]">{tx.id}</span>
                <span className="text-slate-500 mx-1">•</span>
                <span>{tx.sourceDevice} → {tx.targetDevice}</span>
                <span className="text-slate-500 mx-1">•</span>
                <strong className="text-[#228B22]">{tx.quantityQtl} q</strong>
              </div>
              <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                {tx.certificateId}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
