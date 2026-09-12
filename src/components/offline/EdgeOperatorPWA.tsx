import React, { useState } from 'react';
import {
  WifiOff,
  AlertCircle,
  Truck,
  Scale,
  CheckCircle2,
  Share2,
  RefreshCw,
  Printer,
  ShieldCheck,
  Search,
  Database,
  Radio,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  X
} from 'lucide-react';

interface QueuedSlip {
  id: string;
  token: string;
  vehicle: string;
  farmer: string;
  bookedQtl: number;
  actualQtl: number;
  varianceQtl: number;
  variancePercent: number;
  moisture: number;
  timestamp: string;
  hash: string;
  status: 'QUEUED_OFFLINE' | 'SYNCED';
}

export const EdgeOperatorPWA: React.FC = () => {
  // State for offline tractor verification form
  const [searchToken, setSearchToken] = useState('CG-WHT-2841');
  const [vehicleNumber, setVehicleNumber] = useState('MP-04-AB-9842');
  const [farmerName, setFarmerName] = useState('Ramesh Patel');
  const [khasraNumber, setKhasraNumber] = useState('142/2');
  const [commodity, setCommodity] = useState('Sharbati Wheat (Grade FAQ)');
  const [bookedWeight, setBookedWeight] = useState<number>(70.00);
  const [grossWeight, setGrossWeight] = useState<number>(92.40);
  const [tareWeight, setTareWeight] = useState<number>(18.15);
  const [moisture, setMoisture] = useState<number>(11.2);
  const [isCapturingScale, setIsCapturingScale] = useState(false);
  const [showP2PModal, setShowP2PModal] = useState(false);
  const [p2pTransferQtl, setP2pTransferQtl] = useState<number>(15.00);
  const [p2pTargetNode, setP2pTargetNode] = useState('Sehore-Mandi-Hub-02');
  const [p2pSuccess, setP2pSuccess] = useState(false);
  const [lastPrintedSlip, setLastPrintedSlip] = useState<string | null>(null);

  // Local SQLite / P2P Offline Slip Queue
  const [offlineQueue, setOfflineQueue] = useState<QueuedSlip[]>([
    {
      id: 'SLIP-OFFLINE-001',
      token: 'CG-WHT-2838',
      vehicle: 'MP-04-EA-1120',
      farmer: 'Mahesh Sharma',
      bookedQtl: 65.00,
      actualQtl: 66.80,
      varianceQtl: 1.80,
      variancePercent: 2.77,
      moisture: 11.5,
      timestamp: '10:14 AM',
      hash: 'sha256-8a9f2c19e8',
      status: 'QUEUED_OFFLINE'
    },
    {
      id: 'SLIP-OFFLINE-002',
      token: 'CG-WHT-2839',
      vehicle: 'MP-04-K-4912',
      farmer: 'Gopal Meena',
      bookedQtl: 80.00,
      actualQtl: 82.20,
      varianceQtl: 2.20,
      variancePercent: 2.75,
      moisture: 10.9,
      timestamp: '10:28 AM',
      hash: 'sha256-4c7b11d940',
      status: 'QUEUED_OFFLINE'
    }
  ]);

  // Derived calculations
  const actualNetWeight = Number((grossWeight - tareWeight).toFixed(2));
  const varianceQtl = Number((actualNetWeight - bookedWeight).toFixed(2));
  const variancePercent = Number(((varianceQtl / bookedWeight) * 100).toFixed(2));
  const isVarianceWithinTolerance = Math.abs(variancePercent) <= 10.0; // +/- 10% government limit
  const isMoistureCompliant = moisture <= 12.0; // max safe moisture for wheat

  // Handle auto-pulling scale live reading from ESP32 load cell
  const handleCaptureScale = () => {
    setIsCapturingScale(true);
    setTimeout(() => {
      setGrossWeight(92.40);
      setTareWeight(18.15);
      setIsCapturingScale(false);
    }, 600);
  };

  // Submit and queue offline physical slip
  const handleVerifyAndPrint = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlip: QueuedSlip = {
      id: `SLIP-OFFLINE-00${offlineQueue.length + 1}`,
      token: searchToken,
      vehicle: vehicleNumber,
      farmer: farmerName,
      bookedQtl: bookedWeight,
      actualQtl: actualNetWeight,
      varianceQtl,
      variancePercent,
      moisture,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hash: `sha256-${Math.random().toString(36).substring(2, 10)}`,
      status: 'QUEUED_OFFLINE'
    };

    setOfflineQueue([newSlip, ...offlineQueue]);
    setLastPrintedSlip(newSlip.id);
    setTimeout(() => setLastPrintedSlip(null), 4000);
  };

  // P2P Quota Transfer Execution
  const handleExecuteP2P = (e: React.FormEvent) => {
    e.preventDefault();
    setP2pSuccess(true);
    setTimeout(() => {
      setP2pSuccess(false);
      setShowP2PModal(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-3 sm:p-6 select-none max-w-5xl mx-auto space-y-5">
      {/* 1. TOP BAR: PROMINENT OFFLINE MODE - SYNC PENDING BANNER */}
      <div className="bg-gradient-to-r from-red-600 via-[#F47932] to-amber-600 text-white rounded-xl p-4 shadow-lg border border-red-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 animate-pulse">
            <WifiOff className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black tracking-widest uppercase bg-black/30 px-2 py-0.5 rounded text-amber-200">
                P2P MESH LEDGER RUNNING
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
              OFFLINE MODE — SYNC PENDING ({offlineQueue.length} SLIPS QUEUED)
            </h1>
            <p className="text-xs text-white/90">
              Mandi Internet Disconnected • Storing verified weighments to local SQLite with P2P BLE consensus.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={() => setShowP2PModal(true)}
            className="px-3.5 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold font-mono flex items-center gap-1.5 border border-white/30 shadow-xs transition-all"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-200" />
            <span>P2P QUOTA TRANSFER</span>
          </button>

          <button
            onClick={() => alert('Local SQLite ledger synced via ESP32 BLE peer node.')}
            className="px-3.5 py-2 rounded-lg bg-white text-[#0A2540] text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-slate-100 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#F47932]" />
            <span>FORCE RE-SYNC</span>
          </button>
        </div>
      </div>

      {lastPrintedSlip && (
        <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl text-xs font-semibold text-[#228B22] flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#228B22] shrink-0" />
            <span>Offline Slip #{lastPrintedSlip} generated & verified locally! Thermal printer triggered.</span>
          </div>
          <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-green-200">
            RECORDED IN LOCAL P2P LEDGER
          </span>
        </div>
      )}

      {/* 2. MAIN OPERATOR FORM: HIGH-CONTRAST VERIFICATION (SUN-READABLE) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#0A2540]" />
              <h2 className="text-lg font-black text-[#0A2540]">
                Tractor Verification & Weighment Assay
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Edge Operator Terminal: Gate Scale WB-01 • High-Contrast Field Interface
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500">OPERATOR:</span>
            <span className="px-2.5 py-1 rounded bg-[#0A2540] text-white text-xs font-mono font-bold">
              OP-SEHORE-09 (K. Verma)
            </span>
          </div>
        </div>

        <form onSubmit={handleVerifyAndPrint} className="space-y-5">
          {/* Quick Search / Scan Row */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                Token / QR Pass ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 text-sm font-mono font-black text-[#0A2540] bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A2540]"
                  placeholder="e.g. CG-WHT-2841"
                  required
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                Vehicle Registration Plate
              </label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono font-black text-slate-900 bg-white border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                Farmer & Khasra Ref
              </label>
              <input
                type="text"
                value={`${farmerName} (${khasraNumber})`}
                disabled
                className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed"
              />
            </div>
          </div>

          {/* Booked vs Actual Quantity Variance Section (Core Requirement) */}
          <div className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-gradient-to-b from-white to-slate-50/50 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F47932] flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#F47932]" />
                QUANTITY VARIANCE & PHYSICAL TRUTH ENGINE
              </span>
              <button
                type="button"
                onClick={handleCaptureScale}
                className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 border border-slate-300"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCapturingScale ? 'animate-spin text-[#F47932]' : ''}`} />
                <span>{isCapturingScale ? 'READING LOAD CELL...' : 'PULL ESP32 SCALE'}</span>
              </button>
            </div>

            {/* Weighbridge Inputs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {/* Gross Weight */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">1. Gross Scale (q)</span>
                <input
                  type="number"
                  step="0.01"
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(parseFloat(e.target.value) || 0)}
                  className="w-full text-lg font-mono font-black text-slate-900 border-b border-slate-300 focus:border-[#0A2540] focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 block">Tractor + Trolley + Wheat</span>
              </div>

              {/* Tare Weight */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">2. Tare Weight (q)</span>
                <input
                  type="number"
                  step="0.01"
                  value={tareWeight}
                  onChange={(e) => setTareWeight(parseFloat(e.target.value) || 0)}
                  className="w-full text-lg font-mono font-black text-slate-900 border-b border-slate-300 focus:border-[#0A2540] focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 block">Empty Vehicle Weight</span>
              </div>

              {/* Actual Net Weight Calculated */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-[#0A2540] block uppercase">3. Verified Net (q)</span>
                <div className="text-xl font-mono font-black text-[#0A2540]">
                  {actualNetWeight} q
                </div>
                <span className="text-[10px] text-slate-500 block">Gross - Tare payload</span>
              </div>

              {/* Booked Target */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">4. Slot Booked (q)</span>
                <input
                  type="number"
                  step="0.01"
                  value={bookedWeight}
                  onChange={(e) => setBookedWeight(parseFloat(e.target.value) || 0)}
                  className="w-full text-lg font-mono font-black text-slate-900 border-b border-slate-300 focus:border-[#0A2540] focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 block">From Farmer Slot Pass</span>
              </div>
            </div>

            {/* VARIANCE CALCULATOR METRIC CALLOUT */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isVarianceWithinTolerance
                ? 'bg-green-50/80 border-green-200 text-green-950'
                : 'bg-red-50 border-red-200 text-red-950'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase">
                    Calculated Variance:
                  </span>
                  <span className="text-base font-mono font-black">
                    {varianceQtl >= 0 ? `+${varianceQtl}` : varianceQtl} Quintals ({variancePercent >= 0 ? `+${variancePercent}` : variancePercent}%)
                  </span>
                </div>
                <p className="text-xs mt-0.5 text-slate-600">
                  {isVarianceWithinTolerance
                    ? 'Within official APMC ±10% buffer tolerance limit. Valid for direct silo intake.'
                    : 'ATTENTION: Variance exceeds ±10% threshold! Supervisor manual override required.'}
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold self-start sm:self-auto ${
                isVarianceWithinTolerance ? 'bg-[#228B22] text-white' : 'bg-red-600 text-white'
              }`}>
                {isVarianceWithinTolerance ? 'TOLERANCE PASSED' : 'OUT OF SPEC'}
              </span>
            </div>

            {/* Moisture & Grain Assay Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Digital Moisture Sensor Probe</label>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isMoistureCompliant ? 'bg-green-100 text-[#228B22]' : 'bg-red-100 text-red-700'
                  }`}>
                    {isMoistureCompliant ? '< 12.0% LIMIT PASS' : 'EXCESS MOISTURE'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="8"
                    max="18"
                    step="0.1"
                    value={moisture}
                    onChange={(e) => setMoisture(parseFloat(e.target.value))}
                    className="flex-1 accent-[#0A2540]"
                  />
                  <span className="text-base font-mono font-black text-[#0A2540] w-14 text-right">
                    {moisture}%
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Silo Dock Bay Allocation</label>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono font-bold text-xs text-[#0A2540]">
                    SILO BAY 02 (Sharbati)
                  </span>
                  <span className="text-[11px] text-slate-500 font-sans">Automated chute unlocked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#228B22]" />
              <span>Offline hash will append to local chain: sha256-edge-{Math.floor(Date.now() / 1000)}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowP2PModal(true)}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <Share2 className="w-3.5 h-3.5 text-[#F47932]" />
                <span>P2P TRANSFER</span>
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#0A2540] hover:bg-slate-900 text-white font-mono font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-[#F47932]" />
                <span>VERIFY & PRINT OFFLINE SLIP</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 3. LOCAL OFFLINE TRANSACTION LOG TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#0A2540]">Local Ledger: Queued Offline Slips</h3>
            <p className="text-xs text-slate-500">Stored in browser SQLite cache • Cryptographically signed with peer node</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-orange-100 text-[#F47932]">
            {offlineQueue.length} PENDING UPLOAD
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 font-mono text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Slip ID</th>
                <th className="py-2.5 px-3">Token</th>
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Farmer</th>
                <th className="py-2.5 px-3">Booked (q)</th>
                <th className="py-2.5 px-3">Actual (q)</th>
                <th className="py-2.5 px-3">Variance</th>
                <th className="py-2.5 px-3">Local Hash</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {offlineQueue.map((slip) => (
                <tr key={slip.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#0A2540]">{slip.id}</td>
                  <td className="py-2.5 px-3">{slip.token}</td>
                  <td className="py-2.5 px-3">{slip.vehicle}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-800 font-medium">{slip.farmer}</td>
                  <td className="py-2.5 px-3">{slip.bookedQtl} q</td>
                  <td className="py-2.5 px-3 font-bold text-[#0A2540]">{slip.actualQtl} q</td>
                  <td className="py-2.5 px-3 font-bold text-[#228B22]">
                    +{slip.varianceQtl} q ({slip.variancePercent}%)
                  </td>
                  <td className="py-2.5 px-3 text-[10px] text-slate-400">{slip.hash}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      OFFLINE QUEUED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL: P2P QUOTA TRANSFER INITIATION */}
      {showP2PModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#F47932]" />
                <h3 className="font-extrabold text-base text-[#0A2540]">Initiate P2P Quota Transfer</h3>
              </div>
              <button
                onClick={() => setShowP2PModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {p2pSuccess ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#228B22] mx-auto" />
                <h4 className="font-bold text-sm text-[#228B22]">Transfer Signed via Local BLE Mesh</h4>
                <p className="text-xs text-slate-600">
                  {p2pTransferQtl} Quintals transferred to {p2pTargetNode}. Cryptographic receipt verified.
                </p>
              </div>
            ) : (
              <form onSubmit={handleExecuteP2P} className="space-y-4 text-xs">
                <p className="text-slate-600">
                  In offline mode, operators can reallocate surplus silo or weighbridge slot quota to an adjacent Mandi hub via BLE mesh ledger consensus.
                </p>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Origin Hub (Self)</label>
                  <input
                    type="text"
                    value="Bhopal Central Silo Complex (MP-BPL-04)"
                    disabled
                    className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-mono cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Target Peer Node (BLE Discovered)</label>
                  <select
                    value={p2pTargetNode}
                    onChange={(e) => setP2pTargetNode(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono text-[#0A2540] font-bold"
                  >
                    <option value="Sehore-Mandi-Hub-02">Sehore-Mandi-Hub-02 (Signal: -48dBm)</option>
                    <option value="Bilkisganj-Sub-Yard-01">Bilkisganj-Sub-Yard-01 (Signal: -62dBm)</option>
                    <option value="Ashta-Procurement-Dock">Ashta-Procurement-Dock (Signal: -70dBm)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Transfer Quantity (Quintals)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={p2pTransferQtl}
                    onChange={(e) => setP2pTransferQtl(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono text-base font-black text-[#0A2540]"
                    required
                  />
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 space-y-1">
                  <div className="font-bold">Offline Cryptographic Guarantee</div>
                  <div>Zero risk of double-spend: Signed by OP-SEHORE-09 private key in Secure Enclave.</div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowP2PModal(false)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#F47932] hover:bg-[#e06b18] text-white font-mono font-bold text-xs rounded-lg shadow"
                  >
                    SIGN & TRANSMIT P2P QUOTA
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
