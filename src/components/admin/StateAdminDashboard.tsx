import React, { useState } from 'react';
import { useMandiStore } from '../../hooks/useMandiStore';
import { CapacityInvariantModule } from '../capacity/CapacityInvariantModule';
import { EventLedgerModule } from '../ledger/EventLedgerModule';
import { 
  Building2, 
  Database, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  ArrowRight,
  BarChart3,
  Layers,
  MapPin
} from 'lucide-react';

export const StateAdminDashboard: React.FC = () => {
  const { centres, setSelectedCentre, selectedCentre, ledgerEvents, tokens, advanceTokenState } = useMandiStore();
  const [adminTab, setAdminTab] = useState<'centres' | 'ledger' | 'settlement'>('centres');

  // Statewide Aggregates
  const totalCMax = centres.reduce((acc, c) => acc + c.capacity.cMaxQtl, 0);
  const totalOccupied = centres.reduce((acc, c) => acc + c.capacity.physicalOccupiedQtl, 0);
  const totalReserved = centres.reduce((acc, c) => acc + c.capacity.futureReservedQtl, 0);
  const totalSafeAllocatable = totalCMax - totalOccupied - totalReserved;

  const totalProcuredInr = tokens
    .filter(t => t.status === 'PROCUREMENT_COMPLETE' || t.status === 'PAYMENT_RECONCILIATION' || t.status === 'SETTLED')
    .reduce((acc, t) => acc + ((t.actualNetWeightQtl || t.estimatedQuantityQtl) * (t.mspRateInrPerQtl || 2275)), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-4 select-none">
      {/* State APMC Directorate Header */}
      <div className="bg-[#05224D] text-white p-5 rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border-b-4 border-[#228B22]">
        <div>
          <div className="text-[10px] font-mono text-[#77dd6a] uppercase font-bold tracking-wider">
            GOVERNMENT OF MADHYA PRADESH • APMC STATE PROCUREMENT BOARD
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Central Command & Telemetric Audit Dashboard
          </h2>
          <div className="text-xs text-slate-300 mt-0.5">
            Supervising 4 Regional Mandi Hubs • SIH26032 Physical Truth Protocol
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-[#228B22] text-white rounded font-mono text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>LEDGER CHAIN UNCOMPROMISED</span>
          </div>
        </div>
      </div>

      {/* 4 Statewide Key KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono">
        <div className="bg-white border border-[#C4C6D0] rounded-[6px] p-3 shadow-sm">
          <div className="text-[10px] text-slate-500 font-sans">STATE MAXIMUM CAPACITY</div>
          <div className="text-xl font-bold text-[#05224D] mt-0.5">
            {totalCMax.toLocaleString()} <span className="text-xs font-normal">q</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-sans">Across 4 hub silos</div>
        </div>

        <div className="bg-white border border-[#C4C6D0] rounded-[6px] p-3 shadow-sm">
          <div className="text-[10px] text-slate-500 font-sans">PHYSICALLY OCCUPIED</div>
          <div className="text-xl font-bold text-[#203864] mt-0.5">
            {totalOccupied.toLocaleString()} <span className="text-xs font-normal">q</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-sans">Load cell verified</div>
        </div>

        <div className="bg-white border border-[#C4C6D0] rounded-[6px] p-3 shadow-sm">
          <div className="text-[10px] text-slate-500 font-sans">SAFE ALLOCATABLE BUFFER</div>
          <div className="text-xl font-bold text-[#228B22] mt-0.5">
            {totalSafeAllocatable.toLocaleString()} <span className="text-xs font-normal">q</span>
          </div>
          <div className="text-[10px] text-[#228B22] mt-1 font-sans font-semibold">Zero overshoot invariant</div>
        </div>

        <div className="bg-white border border-[#C4C6D0] rounded-[6px] p-3 shadow-sm">
          <div className="text-[10px] text-slate-500 font-sans">DISBURSED / RECONCILED MSP</div>
          <div className="text-xl font-bold text-[#F47920] mt-0.5">
            ₹{(totalProcuredInr / 100000).toFixed(2)} <span className="text-xs font-normal">Lakh</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-sans">DBT PFMS integration</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#C4C6D0] rounded-[6px] p-1 flex text-xs font-semibold">
        <button
          onClick={() => setAdminTab('centres')}
          className={`flex-1 py-2 rounded text-center transition-all ${
            adminTab === 'centres' ? 'bg-[#203864] text-white' : 'text-[#172033] hover:bg-slate-100'
          }`}
        >
          REGIONAL MANDI CENTRES COMPARISON
        </button>
        <button
          onClick={() => setAdminTab('ledger')}
          className={`flex-1 py-2 rounded text-center transition-all ${
            adminTab === 'ledger' ? 'bg-[#203864] text-white' : 'text-[#172033] hover:bg-slate-100'
          }`}
        >
          GLOBAL AUDIT LEDGER & SKEW PROOF
        </button>
        <button
          onClick={() => setAdminTab('settlement')}
          className={`flex-1 py-2 rounded text-center transition-all ${
            adminTab === 'settlement' ? 'bg-[#203864] text-white' : 'text-[#172033] hover:bg-slate-100'
          }`}
        >
          PFMS DIRECT BENEFIT DISBURSEMENTS
        </button>
      </div>

      {/* Tab Content 1: Centres Comparison */}
      {adminTab === 'centres' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {centres.map((c) => {
              const free = c.capacity.cMaxQtl - c.capacity.physicalOccupiedQtl - c.capacity.futureReservedQtl;
              const isSelected = c.id === selectedCentre.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCentre(c.id)}
                  className={`p-4 rounded-[8px] border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#203864] bg-[#F1F4F9] ring-2 ring-[#203864]'
                      : 'border-[#C4C6D0] bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-slate-500">{c.code}</div>
                      <h3 className="font-bold text-sm text-[#172033]">{c.name}</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      c.status === 'OPERATIONAL' ? 'bg-green-100 text-[#228B22]' : 'bg-red-100 text-[#DC2626]'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>C_max Capacity:</span>
                      <strong>{c.capacity.cMaxQtl} q</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Physical Occupied:</span>
                      <strong>{c.capacity.physicalOccupiedQtl} q</strong>
                    </div>
                    <div className="flex justify-between text-[#228B22]">
                      <span>Safe Allocatable:</span>
                      <strong>{free} q</strong>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#C4C6D0] flex justify-between items-center text-[10px] text-slate-500">
                    <span>Avg wait: {c.avgWaitMins} mins</span>
                    <span className="text-[#203864] font-bold">
                      {isSelected ? 'CURRENTLY INSPECTING' : 'CLICK TO SWITCH'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <CapacityInvariantModule />
        </div>
      )}

      {/* Tab Content 2: Global Audit Ledger */}
      {adminTab === 'ledger' && (
        <div className="space-y-4">
          <EventLedgerModule />
        </div>
      )}

      {/* Tab Content 3: PFMS Settlements */}
      {adminTab === 'settlement' && (
        <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7ECF2] pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#228B22] uppercase font-bold">
                PUBLIC FINANCIAL MANAGEMENT SYSTEM (PFMS)
              </span>
              <h3 className="text-base font-bold text-[#172033]">
                DBT Direct Farmer Account Bank Settlement Gateway
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            {tokens.map((t) => {
              const amount = (t.actualNetWeightQtl || t.estimatedQuantityQtl) * (t.mspRateInrPerQtl || 2275);
              const isSettled = t.status === 'SETTLED';
              const isRecon = t.status === 'PAYMENT_RECONCILIATION';

              return (
                <div key={t.id} className="p-3 bg-[#F7F9FC] border border-[#C4C6D0] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-bold text-[#05224D] flex items-center gap-2">
                      <span>{t.id}</span>
                      <span className="text-slate-600 font-normal">({t.farmerName})</span>
                      <span className="text-[10px] font-mono text-slate-400">{t.maskedId}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                      Net: {t.actualNetWeightQtl || t.estimatedQuantityQtl} q • MSP: ₹{t.mspRateInrPerQtl}/q • Total: <strong className="text-[#228B22]">₹{amount.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div>
                    {isSettled ? (
                      <span className="px-2.5 py-1 bg-green-100 text-[#228B22] font-mono font-bold rounded text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>DBT CREDITED</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => advanceTokenState(t.id, 'SETTLED')}
                        className="btn-press px-3 py-1.5 bg-[#203864] text-white rounded font-mono text-xs font-bold flex items-center gap-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>AUTHORIZE PFMS DBT</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
