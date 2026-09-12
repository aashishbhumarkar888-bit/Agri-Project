import React, { useState } from 'react';
import { useMandiStore } from '../../hooks/useMandiStore';
import { CropType, VehicleType } from '../../types';
import { CROP_DETAILS, MSP_RATES_2026 } from '../../constants/designTokens';
import { StatusBadge } from '../ui/StatusBadge';
import { 
  Building2, 
  Printer, 
  UserCheck, 
  PlusCircle, 
  CheckCircle2, 
  Search, 
  ArrowRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

export const CscPortal: React.FC = () => {
  const { tokens, selectedCentre, createBooking, advanceTokenState } = useMandiStore();

  const [farmerName, setFarmerName] = useState('');
  const [aadhaarMasked, setAadhaarMasked] = useState('');
  const [crop, setCrop] = useState<CropType>('wheat');
  const [qty, setQty] = useState('45.00');
  const [vehicleNumber, setVehicleNumber] = useState('MP-04-E-1122');
  const [vehicleType, setVehicleType] = useState<VehicleType>('tractor');
  const [searchQuery, setSearchQuery] = useState('');
  const [printedTokenId, setPrintedTokenId] = useState<string | null>(null);

  const handleCreateAssistedBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName) return;

    const token = createBooking({
      farmerId: `FARM-CSC-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerName,
      maskedId: aadhaarMasked || 'VID-XXXX-9912',
      crop,
      cropGrade: 'FAQ (Fair Average Quality)',
      estimatedQuantityQtl: parseFloat(qty) || 45,
      centreId: selectedCentre.id,
      centreName: selectedCentre.name,
      slotWindow: '11:00 AM - 12:00 PM',
      expectedTurnWindow: '11:20 AM - 11:50 AM',
      vehicleType,
      vehicleNumber,
      moisturePercent: 11.0,
      paymentStatus: 'NOT_INITIATED',
      mspRateInrPerQtl: MSP_RATES_2026[crop] || 2275,
    });

    setPrintedTokenId(token.id);
    setFarmerName('');
    setAadhaarMasked('');
  };

  const filteredTokens = tokens.filter(t => 
    t.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-4 select-none">
      {/* Kiosk Header */}
      <div className="bg-[#203864] text-white p-4 rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="text-[10px] font-mono text-[#F47920] uppercase font-bold tracking-wider">
            COMMON SERVICE CENTRE (CSC) • VILLAGE ASSISTANCE DESK
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Assisted Procurement Kiosk (VLE Station #09)
          </h2>
          <div className="text-xs text-slate-300 mt-0.5">
            Active Hub: {selectedCentre.name} ({selectedCentre.code})
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-white/10 rounded border border-white/20 text-xs font-mono">
            VLE ID: <strong className="text-white">CSC-MP-BHOPAL-44</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Form: Fast Assisted Booking */}
        <div className="lg:col-span-1 bg-white border border-[#C4C6D0] rounded-[8px] p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E7ECF2] pb-2 text-xs font-bold text-[#203864] uppercase font-mono">
            <PlusCircle className="w-4 h-4 text-[#F47920]" />
            <span>NEW ASSISTED BOOKING</span>
          </div>

          <form onSubmit={handleCreateAssistedBooking} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-[#172033] mb-0.5">
                Farmer Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sunderlal Sharma"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full border border-[#C4C6D0] rounded p-1.5 focus:outline-none focus:border-[#203864]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#172033] mb-0.5">
                Masked Aadhaar / VID
              </label>
              <input
                type="text"
                placeholder="XXXX-XXXX-3829"
                value={aadhaarMasked}
                onChange={(e) => setAadhaarMasked(e.target.value)}
                className="w-full border border-[#C4C6D0] rounded p-1.5 font-mono focus:outline-none focus:border-[#203864]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#172033] mb-0.5">
                  Crop Type
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value as CropType)}
                  className="w-full border border-[#C4C6D0] rounded p-1.5 focus:outline-none focus:border-[#203864] uppercase font-semibold"
                >
                  <option value="wheat">Wheat (₹2,275/q)</option>
                  <option value="paddy">Paddy (₹2,183/q)</option>
                  <option value="soybean">Soybean (₹4,892/q)</option>
                  <option value="maize">Maize (₹2,090/q)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#172033] mb-0.5">
                  Quantity (q)
                </label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="w-full border border-[#C4C6D0] rounded p-1.5 font-mono font-bold focus:outline-none focus:border-[#203864]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#172033] mb-0.5">
                Vehicle Registration Number
              </label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full border border-[#C4C6D0] rounded p-1.5 font-mono uppercase focus:outline-none focus:border-[#203864]"
              />
            </div>

            <button
              type="submit"
              className="btn-press w-full py-2 bg-[#F47920] hover:bg-[#e06b18] text-white font-bold rounded flex items-center justify-center gap-1.5 shadow"
            >
              <UserCheck className="w-4 h-4" />
              <span>BOOK & ISSUE PHYSICAL TOKEN</span>
            </button>
          </form>

          {/* Quick Print Notification */}
          {printedTokenId && (
            <div className="p-3 bg-green-50 border border-[#228B22] rounded text-xs text-[#228B22] space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Token {printedTokenId} Issued!</span>
              </div>
              <p className="text-[11px] text-slate-700">
                Print physical slip for farmer to carry to Mandi Weighbridge.
              </p>
              <button
                onClick={() => window.print()}
                className="btn-press w-full py-1.5 bg-[#228B22] text-white font-mono font-bold rounded flex items-center justify-center gap-1 text-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PRINT GATE PASS RECEIPT</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Table: All Village Bookings */}
        <div className="lg:col-span-2 bg-white border border-[#C4C6D0] rounded-[8px] p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7ECF2] pb-2">
            <div className="text-xs font-bold text-[#172033] uppercase font-mono">
              VILLAGE ASSISTED TOKENS DIRECTORY
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search farmer or token..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-[#C4C6D0] rounded px-2.5 py-1 text-xs pl-7 focus:outline-none focus:border-[#203864]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9FC] text-slate-600 font-mono text-[10px] uppercase border-b border-[#C4C6D0]">
                <tr>
                  <th className="p-2">Token</th>
                  <th className="p-2">Farmer</th>
                  <th className="p-2">Crop</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Status</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7ECF2]">
                {filteredTokens.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="p-2 font-mono font-bold text-[#203864]">{t.id}</td>
                    <td className="p-2">
                      <div className="font-semibold text-[#172033]">{t.farmerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{t.vehicleNumber}</div>
                    </td>
                    <td className="p-2 uppercase font-medium">{t.crop}</td>
                    <td className="p-2 font-mono">{t.estimatedQuantityQtl} q</td>
                    <td className="p-2">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => window.print()}
                        className="p-1 rounded text-slate-600 hover:text-[#203864]"
                        title="Print Token Slip"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
