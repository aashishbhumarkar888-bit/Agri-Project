import React from 'react';
import { useMandiStore } from '../../hooks/useMandiStore';
import { PhysicalYard3D } from '../digital-twin/PhysicalYard3D';
import { WeighbridgeConsole } from '../hardware/WeighbridgeConsole';
import { WdrrQueueControl } from '../queue/WdrrQueueControl';
import { PhysicalDigitalParity } from '../digital-twin/PhysicalDigitalParity';
import { P2PMeshReplayBuffer } from '../offline/P2PMeshReplayBuffer';
import { CapacityInvariantModule } from '../capacity/CapacityInvariantModule';
import { EventLedgerModule } from '../ledger/EventLedgerModule';
import { StatusBadge } from '../ui/StatusBadge';
import { TrustBadge } from '../ui/TrustBadge';
import { Layers, Activity, Truck, Scale, ShieldCheck, Database, RefreshCw } from 'lucide-react';

export const YardStaffWorkspace: React.FC = () => {
  const { 
    tokens, 
    selectedToken, 
    setSelectedToken, 
    selectedCentre, 
    hardware, 
    parity, 
    advanceTokenState,
    selected3DVehicle,
    setSelected3DVehicle
  } = useMandiStore();

  const handleSelectVehicle = (vehicleId: string) => {
    setSelected3DVehicle(vehicleId);
    // Also select the corresponding token if exists
    const matchedToken = tokens.find(t => t.id === vehicleId);
    if (matchedToken) {
      setSelectedToken(matchedToken.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Telemetry & Vehicle Quick-Select Strip */}
      <div className="bg-white border border-[#C4C6D0] rounded-[6px] p-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs font-mono shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <span className="text-slate-500 font-bold uppercase text-[10px] shrink-0">
            YARD VEHICLES:
          </span>
          {tokens.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedToken(t.id);
                setSelected3DVehicle(t.id);
              }}
              className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 shrink-0 transition-all ${
                selectedToken?.id === t.id
                  ? 'bg-[#203864] text-white font-bold shadow-sm'
                  : 'bg-[#F7F9FC] text-[#172033] hover:bg-slate-200 border border-[#C4C6D0]'
              }`}
            >
              <Truck className="w-3 h-3 text-[#F47920]" />
              <span>{t.id}</span>
              <span className="opacity-70 text-[9px]">({t.crop.toUpperCase()})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[10px]">
          <span className="text-slate-500">
            BARRIER: <strong className="text-[#F47920]">{parity.barrierState}</strong>
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-500">
            LOAD EQUILIBRIUM: <strong className="text-[#228B22]">STABLE</strong>
          </span>
        </div>
      </div>

      {/* Main Two-Column Engineering Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: 3D Twin & Parity Lock (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* 3D Physical Yard Logistics Twin */}
          <div className="h-[420px] shadow-sm">
            <PhysicalYard3D
              onSelectVehicle={handleSelectVehicle}
              selectedVehicleId={selected3DVehicle || selectedToken?.id || null}
            />
          </div>

          {/* Physical Yard ↔ Digital Ledger Parity Module */}
          <PhysicalDigitalParity />

          {/* WDRR Anti-Starvation Queue Control */}
          <WdrrQueueControl />
        </div>

        {/* Right Column: Hardware Telemetry, Offline P2P & Capacity Invariant (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Weighbridge Console */}
          <WeighbridgeConsole />

          {/* Local P2P Mesh Replay Buffer */}
          <P2PMeshReplayBuffer />

          {/* Yard Capacity Invariant Module */}
          <CapacityInvariantModule />
        </div>
      </div>

      {/* Full-width Bottom: Event Ledger */}
      <EventLedgerModule />
    </div>
  );
};
