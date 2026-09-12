import React from 'react';
import { useMandiStore } from '../../hooks/useMandiStore';
import { BookingToken } from '../../types';
import { Truck, CheckCircle2, AlertCircle, Scale, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  onSelectVehicle: (id: string) => void;
  selectedVehicleId: string | null;
}

export const Isometric2DFallback: React.FC<Props> = ({ onSelectVehicle, selectedVehicleId }) => {
  const { tokens, hardware, parity } = useMandiStore();

  const stages = [
    { key: 'GATE', label: '1. PHYSICAL GATE', icon: '🚧', color: '#203864' },
    { key: 'LANES', label: '2. WDRR QUEUE LANES', icon: '🛣️', color: '#05224D' },
    { key: 'WEIGHBRIDGE', label: '3. ESP32 WEIGHBRIDGE', icon: '⚖️', color: '#F47920' },
    { key: 'QUALITY', label: '4. QUALITY ASSAY LAB', icon: '🔬', color: '#203864' },
    { key: 'UNLOADING', label: '5. SILO UNLOAD BAY', icon: '🏗️', color: '#228B22' },
  ];

  return (
    <div className="w-full h-full bg-[#E7ECF2] p-4 flex flex-col justify-between overflow-hidden relative select-none">
      {/* 2D Fallback Header Banner */}
      <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-[4px] border border-[#C4C6D0] shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#228B22]"></span>
          <span className="text-xs font-bold text-[#172033] tracking-wide">
            ISOMETRIC 2D LOGISTICS SCHEMATIC (LOW-BANDWIDTH FAILSAFE)
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#44474F]">
          PARITY SKEW: {parity.skewDriftQtl} q • LOAD CELL EQUILIBRIUM
        </span>
      </div>

      {/* Isometric Flow Canvas */}
      <div className="my-auto py-2 grid grid-cols-1 md:grid-cols-5 gap-3">
        {stages.map((stg, index) => (
          <div 
            key={stg.key}
            className="bg-white border border-[#C4C6D0] rounded-[6px] p-3 flex flex-col gap-2 relative shadow-sm"
          >
            {/* Step header */}
            <div className="flex items-center justify-between border-b border-[#E7ECF2] pb-1.5">
              <span className="text-xs font-bold text-[#203864] flex items-center gap-1.5">
                <span>{stg.icon}</span>
                <span>{stg.label}</span>
              </span>
              <span className="text-[10px] font-mono bg-[#E7ECF2] text-[#172033] px-1.5 py-0.2 rounded">
                0{index + 1}
              </span>
            </div>

            {/* Stage content */}
            <div className="space-y-2 min-h-[140px] flex flex-col justify-start">
              {index === 0 && (
                <div className="text-[11px] text-[#44474F] space-y-1">
                  <div className="p-1.5 bg-[#F7F9FC] border border-[#C4C6D0] rounded text-[10px] font-mono">
                    ANPR CAMERA 04: <strong className="text-[#228B22]">ONLINE</strong>
                  </div>
                  <div className="p-1.5 bg-[#F7F9FC] border border-[#C4C6D0] rounded text-[10px] font-mono">
                    BARRIER: <strong className="text-[#F47920]">{parity.barrierState}</strong>
                  </div>
                </div>
              )}

              {index === 1 && (
                <div className="space-y-1">
                  <div className="text-[10px] font-mono p-1 bg-blue-50 border border-blue-200 rounded text-blue-900">
                    Q1 Normal: 6 in queue (+24m)
                  </div>
                  <div className="text-[10px] font-mono p-1 bg-amber-50 border border-amber-200 rounded text-amber-900">
                    Q2 Exception: 2 vehicles (-18m)
                  </div>
                  <div className="text-[10px] font-mono p-1 bg-green-50 border border-green-200 rounded text-green-900">
                    Q3 Assisted: 3 vehicles (+11m)
                  </div>
                </div>
              )}

              {index === 2 && (
                <div className="space-y-1">
                  <div className="p-2 bg-[#172033] text-white rounded font-mono text-center">
                    <div className="text-[9px] text-slate-400">ACTIVE PLATFORM LOAD</div>
                    <div className="text-lg font-bold text-[#228B22]">
                      {hardware.grossWeightQtl.toFixed(2)} q
                    </div>
                    <div className="text-[9px] text-[#52b749]">
                      TARE: {hardware.tareWeightQtl.toFixed(2)} q | NET: {hardware.netPayloadQtl.toFixed(2)} q
                    </div>
                  </div>
                </div>
              )}

              {index === 3 && (
                <div className="space-y-1 text-[11px]">
                  <div className="p-1.5 bg-[#F7F9FC] border border-[#C4C6D0] rounded text-[10px] font-mono">
                    NIR SPECTROMETER: <strong className="text-[#228B22]">CALIBRATED</strong>
                  </div>
                  <div className="p-1.5 bg-[#F7F9FC] border border-[#C4C6D0] rounded text-[10px] font-mono">
                    MOISTURE AVERAGE: <strong>11.4% (&lt; 12% MAX)</strong>
                  </div>
                </div>
              )}

              {index === 4 && (
                <div className="space-y-1 text-[11px]">
                  <div className="p-1.5 bg-[#F7F9FC] border border-[#C4C6D0] rounded text-[10px] font-mono">
                    SILO ALPHA: <strong>2,850 / 4,000 q</strong>
                  </div>
                  <div className="p-1.5 bg-[#F7F9FC] border border-[#C4C6D0] rounded text-[10px] font-mono">
                    FLOW SENSOR: <strong className="text-[#228B22]">CONFIRMED</strong>
                  </div>
                </div>
              )}

              {/* Render vehicles in this stage */}
              <div className="mt-auto pt-1 border-t border-dashed border-[#C4C6D0]">
                <div className="text-[10px] font-semibold text-[#44474F] mb-1">Vehicles:</div>
                <div className="space-y-1">
                  {tokens
                    .filter(t => {
                      if (index === 0) return t.status === 'BOOKED' || t.status === 'GATE_CHECKIN';
                      if (index === 1) return t.status === 'QUEUED';
                      if (index === 2) return t.status === 'WEIGHING';
                      if (index === 3) return t.status === 'QUALITY_CHECK';
                      return t.status === 'UNLOADING' || t.status === 'PROCUREMENT_COMPLETE';
                    })
                    .slice(0, 2)
                    .map(t => (
                      <button
                        key={t.id}
                        onClick={() => onSelectVehicle(t.id)}
                        className={`w-full text-left p-1 rounded text-[10px] font-mono flex items-center justify-between border transition-all ${
                          selectedVehicleId === t.id
                            ? 'bg-[#F47920] text-white border-orange-700 font-bold shadow-sm'
                            : 'bg-white hover:bg-slate-50 text-[#172033] border-[#C4C6D0]'
                        }`}
                      >
                        <span className="truncate">{t.id} ({t.vehicleType === 'semi_trailer' ? 'Semi' : 'Tractor'})</span>
                        <span>{t.estimatedQuantityQtl}q</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Hint */}
      <div className="text-center text-[11px] text-[#44474F] font-mono">
        Select any vehicle above to inspect physical telemetric payload and digital ledger signatures.
      </div>
    </div>
  );
};
