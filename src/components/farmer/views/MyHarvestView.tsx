import React, { useState } from 'react';
import { useFarmerStore } from '../../../hooks/useFarmerStore';
import { CropType } from '../../../types';
import { FarmerCrop } from '../../../types/farmer';
import { MSP_RATES_2026 } from '../../../constants/designTokens';
import { 
  Sprout, 
  Plus, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  X,
  FileText
} from 'lucide-react';

export const MyHarvestView: React.FC = () => {
  const { profile, crops, addCrop, setActiveTab, createBooking } = useFarmerStore();
  const [showAddCropModal, setShowAddCropModal] = useState(false);

  // New Crop Form State
  const [newCropType, setNewCropType] = useState<CropType>('wheat');
  const [newCropVariety, setNewCropVariety] = useState('Lok-1 High Yield');
  const [newCropQuantity, setNewCropQuantity] = useState('45');
  const [newCropSeason, setNewCropSeason] = useState<'Rabi 2026' | 'Kharif 2025' | 'Zaid 2026'>('Rabi 2026');
  const [newCropPlot, setNewCropPlot] = useState('South Canal Basin (1.8 Ha)');

  const handleAddCropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(newCropQuantity) || 30;
    const msp = MSP_RATES_2026[newCropType] || 2275;

    const names: Record<CropType, string> = {
      wheat: 'Sharbati Wheat (Grade FAQ)',
      paddy: 'Paddy / Dhan (Grade A)',
      soybean: 'Yellow Soybean',
      maize: 'Hybrid Maize / Corn',
      mustard: 'Yellow Mustard / Sarson'
    };

    addCrop({
      crop: newCropType,
      cropName: names[newCropType],
      season: newCropSeason,
      variety: newCropVariety,
      approxQuantityQtl: qty,
      mspRateInr: msp,
      status: 'READY_FOR_PROCUREMENT',
      farmReference: newCropPlot
    });

    setShowAddCropModal(false);
  };

  return (
    <div className="space-y-4 select-none">
      {/* 1. Header & Farm Reference Card */}
      <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7ECF2] pb-3">
          <div>
            <div className="text-[10px] font-mono text-[#228B22] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-[#228B22]" />
              <span>MY AGRICULTURAL PROFILE & HARVEST</span>
            </div>
            <h2 className="text-xl font-bold text-[#05224D] tracking-tight">
              My Farm & Cultivated Land
            </h2>
          </div>

          <button
            onClick={() => setShowAddCropModal(true)}
            className="btn-press px-4 py-2 bg-[#203864] hover:bg-[#172033] text-white text-xs font-mono font-bold rounded flex items-center gap-1.5 shadow self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#F47920]" />
            <span>ADD NEW CROP</span>
          </button>
        </div>

        {/* Farm Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-sans">
          <div className="p-3 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
            <span className="text-[10px] text-slate-500 block font-mono">KHASRA / LAND RECORD</span>
            <strong className="text-[#172033] text-sm block mt-0.5">{profile.farmDetails.khasraNumber}</strong>
            <span className="text-[10px] text-[#228B22] flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> MP Bhulekh Verified
            </span>
          </div>

          <div className="p-3 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
            <span className="text-[10px] text-slate-500 block font-mono">TOTAL HOLDING</span>
            <strong className="text-[#172033] text-sm block mt-0.5">{profile.farmDetails.totalLandHectares} Hectares</strong>
            <span className="text-[10px] text-slate-500 mt-0.5">
              Cultivated: {profile.farmDetails.cultivatedAreaHectares} Ha
            </span>
          </div>

          <div className="p-3 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
            <span className="text-[10px] text-slate-500 block font-mono">VILLAGE & BLOCK</span>
            <strong className="text-[#172033] text-sm block mt-0.5">{profile.village}</strong>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {profile.district}
            </span>
          </div>

          <div className="p-3 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
            <span className="text-[10px] text-slate-500 block font-mono">SOIL & IRRIGATION</span>
            <strong className="text-[#172033] text-sm block mt-0.5">{profile.farmDetails.soilHealthCardNo}</strong>
            <span className="text-[10px] text-slate-500 mt-0.5 truncate block">
              {profile.farmDetails.irrigationType}
            </span>
          </div>
        </div>
      </div>

      {/* 2. My Crops List with Rich Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#05224D] uppercase font-mono tracking-wider">
            DECLARED CROPS ({crops.length})
          </h3>
          <span className="text-xs text-slate-500">
            Click "Prepare Slot" to reserve Mandi arrival window
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crops.map((c) => {
            const isReady = c.status === 'READY_FOR_PROCUREMENT';

            return (
              <div
                key={c.id}
                className="bg-white border border-[#C4C6D0] rounded-[8px] p-4 shadow-sm space-y-3 flex flex-col justify-between hover:border-[#203864] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#E7ECF2] pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                        <Sprout className="w-4 h-4 text-[#F47920]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#05224D]">{c.cropName}</h4>
                        <span className="text-[11px] text-slate-500">{c.season} • {c.variety}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isReady
                        ? 'bg-green-100 text-[#228B22] border border-green-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isReady ? 'READY FOR PROCUREMENT' : c.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                    <div className="p-2 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
                      <span className="text-[10px] text-slate-500 font-sans block">ESTIMATED QUANTITY</span>
                      <strong className="text-base text-[#05224D]">{c.approxQuantityQtl} q</strong>
                    </div>

                    <div className="p-2 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
                      <span className="text-[10px] text-slate-500 font-sans block">GOVT MSP RATE 2026</span>
                      <strong className="text-base text-[#228B22]">₹{c.mspRateInr} / q</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                    <span>Plot: {c.farmReference}</span>
                    <span>Updated: {c.lastUpdated}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E7ECF2] flex items-center justify-between gap-2">
                  <div className="text-xs font-mono font-bold text-[#203864]">
                    Estimated Value: ₹{(c.approxQuantityQtl * c.mspRateInr).toLocaleString()}
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('booking');
                    }}
                    className={`btn-press px-3.5 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 shadow ${
                      isReady
                        ? 'bg-[#F47920] hover:bg-[#e06b18] text-white'
                        : 'bg-[#203864] text-white'
                    }`}
                  >
                    <span>PREPARE SLOT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Add Crop Modal */}
      {showAddCropModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[8px] max-w-md w-full border border-[#C4C6D0] shadow-2xl overflow-hidden">
            <div className="bg-[#203864] text-white p-4 flex items-center justify-between border-b-2 border-[#F47920]">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-[#F47920]" />
                <h3 className="font-bold text-sm">Add Crop to Your Harvest List</h3>
              </div>
              <button onClick={() => setShowAddCropModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCropSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#172033] block mb-1">Select Crop Type</label>
                <select
                  value={newCropType}
                  onChange={(e) => setNewCropType(e.target.value as CropType)}
                  className="w-full p-2 border border-[#C4C6D0] rounded bg-white font-sans text-xs"
                >
                  <option value="wheat">Wheat (गेंहू) • MSP ₹2,275/q</option>
                  <option value="paddy">Paddy / Dhan (धान) • MSP ₹2,320/q</option>
                  <option value="soybean">Soybean (सोयाबीन) • MSP ₹4,892/q</option>
                  <option value="maize">Maize (मक्का) • MSP ₹2,090/q</option>
                  <option value="mustard">Mustard (सरसों) • MSP ₹5,650/q</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#172033] block mb-1">Crop Variety / Strain</label>
                <input
                  type="text"
                  value={newCropVariety}
                  onChange={(e) => setNewCropVariety(e.target.value)}
                  className="w-full p-2 border border-[#C4C6D0] rounded text-xs"
                  placeholder="e.g. Sharbati C-306 or Lok-1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#172033] block mb-1">Approx Quantity (Quintals)</label>
                  <input
                    type="number"
                    value={newCropQuantity}
                    onChange={(e) => setNewCropQuantity(e.target.value)}
                    className="w-full p-2 border border-[#C4C6D0] rounded text-xs font-mono font-bold"
                    min="5"
                    max="500"
                    required
                  />
                  <span className="text-[10px] text-slate-400">1 Quintal = 100 kg</span>
                </div>

                <div>
                  <label className="font-bold text-[#172033] block mb-1">Harvest Season</label>
                  <select
                    value={newCropSeason}
                    onChange={(e) => setNewCropSeason(e.target.value as any)}
                    className="w-full p-2 border border-[#C4C6D0] rounded bg-white text-xs"
                  >
                    <option value="Rabi 2026">Rabi 2026</option>
                    <option value="Kharif 2025">Kharif 2025</option>
                    <option value="Zaid 2026">Zaid 2026</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#172033] block mb-1">Land Plot / Farm Reference</label>
                <input
                  type="text"
                  value={newCropPlot}
                  onChange={(e) => setNewCropPlot(e.target.value)}
                  className="w-full p-2 border border-[#C4C6D0] rounded text-xs"
                  placeholder="e.g. North Plot Khasra 142/2"
                  required
                />
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800">
                Note: Approximate quantity helps Mandi reserve sufficient intake space. Exact net weight will be recorded on the certified weighbridge scale upon arrival.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E7ECF2]">
                <button
                  type="button"
                  onClick={() => setShowAddCropModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn-press px-5 py-2 bg-[#203864] hover:bg-[#172033] text-white font-bold rounded text-xs shadow"
                >
                  SAVE CROP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
