import React from 'react';
import { useMandiStore } from '../../hooks/useMandiStore';
import { Database, AlertTriangle, CheckCircle2, ShieldCheck, PieChart, Layers } from 'lucide-react';

export const CapacityInvariantModule: React.FC = () => {
  const { selectedCentre } = useMandiStore();
  const cap = selectedCentre.capacity;

  const physicalAvailable = cap.cMaxQtl - cap.physicalOccupiedQtl;
  const safeAllocatable = physicalAvailable - cap.futureReservedQtl;
  const isZeroCapacity = safeAllocatable <= 0;

  // Percentage calculations
  const occupiedPct = ((cap.physicalOccupiedQtl / cap.cMaxQtl) * 100).toFixed(1);
  const reservedPct = ((cap.futureReservedQtl / cap.cMaxQtl) * 100).toFixed(1);
  const safePct = Math.max(0, (safeAllocatable / cap.cMaxQtl) * 100).toFixed(1);

  return (
    <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-4 flex flex-col gap-3 shadow-sm select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E7ECF2] pb-2">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#203864]" />
          <span className="font-bold text-xs uppercase tracking-wide text-[#172033]">
            PHYSICAL YARD CAPACITY INVARIANT
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#44474F]">
          C_max: {cap.cMaxQtl.toLocaleString()} q
        </span>
      </div>

      {/* Safety Alert Banner if Capacity is Paused */}
      {isZeroCapacity ? (
        <div className="p-3 bg-red-50 border-l-4 border-[#DC2626] rounded-[4px] text-xs">
          <div className="flex items-center gap-1.5 text-[#DC2626] font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>BOOKING GENERATION PAUSED</span>
          </div>
          <p className="text-[11px] text-red-900 mt-1">
            Reason: No safe physical capacity remains in storage silos. Centre temporarily paused for intake.
          </p>
        </div>
      ) : (
        <div className="p-2.5 bg-[#F7F9FC] border border-[#C4C6D0] rounded-[6px] text-xs font-mono">
          <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
            <span>MATHEMATICAL INVARIANT ENFORCEMENT:</span>
            <span className="text-[#228B22] font-bold">● CAPACITY HEALTHY</span>
          </div>
          <div className="text-[10px] text-[#203864] leading-relaxed">
            <div>C_available = C_max ({cap.cMaxQtl}q) − C_occupied ({cap.physicalOccupiedQtl}q) = <strong>{physicalAvailable} q</strong></div>
            <div>C_allocatable = C_available ({physicalAvailable}q) − C_reserved ({cap.futureReservedQtl}q) = <strong className="text-[#228B22]">{safeAllocatable} q</strong></div>
          </div>
        </div>
      )}

      {/* Multi-layered Storage Meter Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono font-medium">
          <span>Storage Utilization Meter:</span>
          <span>
            {occupiedPct}% Occupied + {reservedPct}% Reserved = <strong>{safePct}% Safe Free</strong>
          </span>
        </div>

        <div className="w-full h-5 bg-[#E7ECF2] rounded-[4px] overflow-hidden flex border border-[#C4C6D0]">
          {/* Occupied Bar */}
          <div
            style={{ width: `${occupiedPct}%` }}
            className="bg-[#203864] h-full flex items-center justify-center text-[9px] font-mono text-white font-bold"
            title={`Physical Occupied: ${cap.physicalOccupiedQtl} q`}
          >
            {cap.physicalOccupiedQtl}q
          </div>

          {/* Reserved Bar */}
          <div
            style={{ width: `${reservedPct}%` }}
            className="bg-[#F47920] h-full flex items-center justify-center text-[9px] font-mono text-white font-bold"
            title={`Future Reserved: ${cap.futureReservedQtl} q`}
          >
            {cap.futureReservedQtl}q
          </div>

          {/* Safe Allocatable Bar */}
          <div
            style={{ width: `${safePct}%` }}
            className="bg-[#228B22] h-full flex items-center justify-center text-[9px] font-mono text-white font-bold"
            title={`Safe Allocatable: ${safeAllocatable} q`}
          >
            {safeAllocatable}q
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] font-mono text-center">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#203864]"></span>
            <span>Occupied: <strong>{cap.physicalOccupiedQtl}q</strong></span>
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#F47920]"></span>
            <span>Reserved: <strong>{cap.futureReservedQtl}q</strong></span>
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#228B22]"></span>
            <span>Safe Free: <strong>{safeAllocatable}q</strong></span>
          </div>
        </div>
      </div>

      {/* Silo Hardware Status Breakdown */}
      <div className="pt-2 border-t border-[#E7ECF2] space-y-1.5">
        <div className="text-[10px] font-semibold text-[#44474F] uppercase tracking-wider font-mono">
          Individual Storage Silos:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {cap.silos.map((silo) => (
            <div
              key={silo.id}
              className="p-2 bg-[#F7F9FC] border border-[#C4C6D0] rounded-[4px] text-[10px] font-mono flex flex-col gap-0.5"
            >
              <div className="font-bold text-[#172033] truncate">{silo.name}</div>
              <div className="text-slate-500">
                Load: <strong>{silo.currentLoadQtl} / {silo.capacityQtl} q</strong>
              </div>
              <div className="text-slate-500">
                Depth: <strong>{silo.sensorDepthMeters}m</strong> • Temp: <strong>{silo.tempCelsius}°C</strong>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${silo.status === 'OPTIMAL' ? 'bg-[#228B22]' : 'bg-[#D97706]'}`}></span>
                <span className="text-[9px] font-semibold text-slate-700">{silo.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
