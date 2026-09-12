import React from 'react';
import { useMandiStore } from '../../hooks/useMandiStore';
import { Clock, Lock, Truck, AlertCircle, ArrowUpRight, CheckCircle2, RotateCw } from 'lucide-react';

export const WdrrQueueControl: React.FC = () => {
  const { lanes, tokens, rebalanceWdrrLanes, advanceTokenState, setSelectedToken, selectedToken } = useMandiStore();

  return (
    <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-4 flex flex-col gap-3 shadow-sm select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E7ECF2] pb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#F47920]" />
          <span className="font-bold text-xs uppercase tracking-wide text-[#172033]">
            WDRR ANTI-STARVATION SCHEDULER
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#44474F] bg-[#E7ECF2] px-2 py-0.5 rounded">
          EMPIRICAL WEIGHTED DEFICIT ROUND ROBIN
        </span>
      </div>

      {/* Non-Preemptive Lock Active Banner for Heavy Semi-trailer */}
      <div className="bg-[#172033] text-white p-2.5 rounded-[6px] flex items-center justify-between font-mono text-xs border-l-4 border-[#F47920]">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#F47920]" />
          <div>
            <span className="text-[#F47920] font-bold">NON-PREEMPTIVE LOCK ACTIVE</span>
            <span className="text-slate-400 ml-2 text-[10px]">
              Active Vehicle: <strong>CG-SOY-2842 (Semi-Trailer)</strong>
            </span>
          </div>
        </div>
        <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-[#77dd6a]">
          EPT: 26 min
        </span>
      </div>

      {/* 3 Queue Lanes: Q1 Normal, Q2 Exception, Q3 Assisted */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {lanes.map((lane) => {
          const isCredit = lane.creditDeficitMin >= 0;
          return (
            <div
              key={lane.id}
              className="bg-[#F7F9FC] border border-[#C4C6D0] rounded-[6px] p-2.5 flex flex-col justify-between relative"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-[#203864]">
                    {lane.code}
                  </span>
                  <span className="text-[10px] font-mono bg-white border border-[#C4C6D0] px-1.5 py-0.2 rounded font-semibold text-[#172033]">
                    {lane.count} vehicles
                  </span>
                </div>

                <div className="text-[11px] text-[#44474F] mb-2 leading-tight">
                  {lane.name}
                </div>

                {/* Deficit / Credit Pill */}
                <div className="flex items-center justify-between text-[11px] font-mono p-1.5 rounded bg-white border border-[#C4C6D0]">
                  <span className="text-[10px] text-slate-500">SCHEDULER QUANTUM:</span>
                  <span
                    className={`font-bold ${
                      isCredit ? 'text-[#228B22]' : 'text-[#D97706]'
                    }`}
                  >
                    {isCredit ? `+${lane.creditDeficitMin}m credit` : `${lane.creditDeficitMin}m debt`}
                  </span>
                </div>
              </div>

              {/* Active processing card if any */}
              <div className="mt-2 pt-2 border-t border-dashed border-[#C4C6D0] text-[10px]">
                {lane.activeVehicleId ? (
                  <div className="bg-white p-1.5 rounded border border-slate-300 flex flex-col gap-0.5 font-mono">
                    <div className="flex justify-between items-center text-[#172033]">
                      <span className="font-bold">{lane.activeVehicleId}</span>
                      <span className="text-[#F47920]">EPT: {lane.activeVehicleEptMin}m</span>
                    </div>
                    {lane.isNonPreemptiveLocked && (
                      <span className="text-[9px] text-[#D97706] font-semibold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        NO INTERRUPTION ALLOWED
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-400 font-mono italic">
                    Lane idling • Available for next token
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scheduler Demonstration Controls */}
      <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-500">
        <span>Dynamic compensation prevents starvation of smaller tractor payloads.</span>
        <button
          onClick={() => rebalanceWdrrLanes(5, -5)}
          className="text-[#203864] hover:underline font-semibold flex items-center gap-1"
        >
          <RotateCw className="w-3 h-3" />
          <span>REBALANCE QUANTUM SLICE</span>
        </button>
      </div>
    </div>
  );
};
