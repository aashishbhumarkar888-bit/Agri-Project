import React, { useState } from 'react';
import { useFarmerStore } from '../../../hooks/useFarmerStore';
import { NEARBY_CENTRES } from '../../../services/farmerStore';
import { CropType } from '../../../types';
import { MSP_RATES_2026 } from '../../../constants/designTokens';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  Minus,
  Sprout,
  QrCode
} from 'lucide-react';

export const BookingWizardView: React.FC = () => {
  const { crops, createBooking, setActiveTab, setShowQrModal } = useFarmerStore();

  const [step, setStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState<CropType>('wheat');
  const [quantityQtl, setQuantityQtl] = useState(50);
  const [selectedCentreId, setSelectedCentreId] = useState('centre_04');
  const [selectedSlotWindow, setSelectedSlotWindow] = useState('10:00 AM – 11:00 AM');
  const [vehicleNumber, setVehicleNumber] = useState('MP-04-AB-9842');

  const selectedCentre = NEARBY_CENTRES.find(c => c.id === selectedCentreId) || NEARBY_CENTRES[0];
  const mspRate = MSP_RATES_2026[selectedCrop] || 2275;

  const cropCards: { type: CropType; name: string; hindi: string; msp: number; icon: any }[] = [
    { type: 'wheat', name: 'Sharbati Wheat', hindi: 'गेंहू', msp: 2275, icon: Sprout },
    { type: 'paddy', name: 'Paddy / Dhan', hindi: 'धान', msp: 2320, icon: Sprout },
    { type: 'soybean', name: 'Yellow Soybean', hindi: 'सोयाबीन', msp: 4892, icon: Sprout },
    { type: 'maize', name: 'Hybrid Maize', hindi: 'मक्का', msp: 2090, icon: Sprout }
  ];

  const arrivalSlots = [
    { window: '08:00 AM – 09:00 AM', status: 'AVAILABLE', wait: '15 min' },
    { window: '09:00 AM – 10:00 AM', status: 'LIMITED', wait: '25 min' },
    { window: '10:00 AM – 11:00 AM', status: 'AVAILABLE', wait: '20 min' },
    { window: '11:00 AM – 12:00 PM', status: 'AVAILABLE', wait: '25 min' },
    { window: '02:00 PM – 03:00 PM', status: 'AVAILABLE', wait: '15 min' },
    { window: '03:00 PM – 04:00 PM', status: 'AVAILABLE', wait: '20 min' }
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Create Booking
      createBooking({
        crop: selectedCrop,
        cropName: cropCards.find(c => c.type === selectedCrop)?.name || 'Wheat',
        quantityQtl,
        centreId: selectedCentreId,
        slotWindow: selectedSlotWindow,
        vehicleNumber
      });
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="bg-white border border-[#C4C6D0] rounded-[8px] p-4 sm:p-6 shadow-sm space-y-5 select-none font-sans">
      {/* Wizard Header */}
      <div className="border-b border-[#E7ECF2] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-mono text-[#F47920] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#F47920]" />
            <span>PREPARE MY PROCUREMENT • GUIDED ARRIVAL BOOKING</span>
          </div>
          <h2 className="text-xl font-bold text-[#05224D] tracking-tight">
            Reserve a Guaranteed Yard Arrival Slot
          </h2>
        </div>

        {/* Stepper Indicator */}
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#203864]">
          <span className="px-2 py-0.5 bg-[#F1F4F9] rounded border border-[#C4C6D0]">
            STEP {step} OF 5
          </span>
        </div>
      </div>

      {/* Step Dots */}
      <div className="grid grid-cols-5 gap-2">
        {['1. Select Crop', '2. Quantity', '3. Centre', '4. Arrival Window', '5. Confirm'].map((name, i) => (
          <div key={i} className="space-y-1">
            <div className={`h-1.5 rounded-full transition-all ${
              i + 1 <= step ? 'bg-[#F47920]' : 'bg-slate-200'
            }`} />
            <span className={`text-[10px] hidden sm:block truncate ${
              i + 1 === step ? 'font-bold text-[#203864]' : 'text-slate-400'
            }`}>
              {name}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Choose Crop */}
      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-sm font-bold text-[#172033] uppercase font-mono tracking-wider">
              WHICH CROP ARE YOU BRINGING FOR PROCUREMENT?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select the harvest commodity to lock MSP price rate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cropCards.map((c) => {
              const isSelected = selectedCrop === c.type;
              const Icon = c.icon;

              return (
                <div
                  key={c.type}
                  onClick={() => setSelectedCrop(c.type)}
                  className={`p-4 rounded-[8px] border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#F47920] bg-orange-50/50 shadow-sm'
                      : 'border-[#C4C6D0] hover:border-slate-400 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-[#F47920] text-white' : 'bg-[#F1F4F9] text-slate-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#05224D]">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.hindi}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-500 block font-sans">MSP 2026</span>
                    <strong className="text-sm text-[#228B22]">₹{c.msp}/q</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Enter Expected Quantity */}
      {step === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-sm font-bold text-[#172033] uppercase font-mono tracking-wider">
              ENTER ESTIMATED QUANTITY
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              This helps the Mandi reserve adequate intake platform and lane capacity.
            </p>
          </div>

          {/* Stepper Display */}
          <div className="max-w-md mx-auto p-6 bg-[#F7F9FC] border border-[#E7ECF2] rounded-[8px] text-center space-y-4">
            <span className="text-xs font-mono text-slate-500 uppercase font-bold">
              ESTIMATED HARVEST PAYLOAD
            </span>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setQuantityQtl(Math.max(5, quantityQtl - 5))}
                className="w-12 h-12 rounded-full bg-white border border-[#C4C6D0] hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-sm transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="px-6 py-2 bg-white border-2 border-[#203864] rounded-[8px] shadow-inner font-mono">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#05224D]">
                  {quantityQtl}
                </span>
                <span className="text-sm text-slate-500 ml-1.5 font-bold">Quintals</span>
              </div>

              <button
                onClick={() => setQuantityQtl(quantityQtl + 5)}
                className="w-12 h-12 rounded-full bg-white border border-[#C4C6D0] hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-sm transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs font-mono text-slate-600">
              = Approx. {(quantityQtl * 100).toLocaleString()} kg • Estimated MSP Value: <strong className="text-[#228B22]">₹{(quantityQtl * mspRate).toLocaleString()}</strong>
            </div>
          </div>

          {/* Prominent Physical Truth Disclaimer */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-[6px] text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#F47920] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Important Notice for Farmers:</strong>
              This is your approximate expected quantity. The exact net weight and final procurement payment will be determined by the official weighbridge scale upon physical arrival.
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Choose Centre */}
      {step === 3 && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-sm font-bold text-[#172033] uppercase font-mono tracking-wider">
              SELECT NEARBY PROCUREMENT CENTRE
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the Mandi yard closest to your farm or with the lowest wait time.
            </p>
          </div>

          <div className="space-y-3">
            {NEARBY_CENTRES.map((centre) => {
              const isSelected = selectedCentreId === centre.id;

              return (
                <div
                  key={centre.id}
                  onClick={() => setSelectedCentreId(centre.id)}
                  className={`p-4 rounded-[8px] border-2 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#F47920] bg-orange-50/50 shadow-sm'
                      : 'border-[#C4C6D0] hover:border-slate-400 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#05224D]">{centre.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">({centre.code})</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F47920]" />
                        {centre.distanceKm} km from Bilkisganj
                      </span>
                      <span>•</span>
                      <span>Hours: {centre.workingHours}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <div className="text-right font-mono text-xs">
                      <span className="text-[10px] text-slate-500 block font-sans">STATUS</span>
                      <strong className="text-[#228B22]">Operating Smoothly</strong>
                      <span className="text-[10px] text-slate-400 block">Wait: {centre.expectedWaitMins}</span>
                    </div>

                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-[#F47920] bg-[#F47920] text-white' : 'border-[#C4C6D0]'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4: Choose Arrival Window */}
      {step === 4 && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-sm font-bold text-[#172033] uppercase font-mono tracking-wider">
              CHOOSE ARRIVAL TIME WINDOW
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your expected arrival time block for {selectedCentre.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {arrivalSlots.map((slot) => {
              const isSelected = selectedSlotWindow === slot.window;

              return (
                <div
                  key={slot.window}
                  onClick={() => setSelectedSlotWindow(slot.window)}
                  className={`p-3.5 rounded-[8px] border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#F47920] bg-orange-50/50 shadow-sm'
                      : 'border-[#C4C6D0] hover:border-slate-400 bg-white'
                  }`}
                >
                  <div>
                    <div className="font-mono font-bold text-sm text-[#05224D]">{slot.window}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Avg wait: {slot.wait} • Safe capacity reserved
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    slot.status === 'AVAILABLE' ? 'bg-green-100 text-[#228B22]' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {slot.status}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[#F7F9FC] border border-[#E7ECF2] rounded text-xs text-slate-600">
            <strong>How Arrival Windows Work:</strong> Your selected window tells you when to arrive at the gate. Once scanned at the gate, your expected turn window will be refined dynamically without penalty.
          </div>
        </div>
      )}

      {/* Step 5: Review & Confirm Booking */}
      {step === 5 && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-sm font-bold text-[#172033] uppercase font-mono tracking-wider">
              REVIEW & CONFIRM PROCUREMENT BOOKING
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify your booking details before generating your gate token pass.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="p-4 bg-[#F7F9FC] border border-[#C4C6D0] rounded-[8px] space-y-3 text-xs font-sans">
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div>
                <span className="text-[10px] text-slate-500 font-sans block">COMMODITY</span>
                <strong className="text-sm text-[#05224D]">{selectedCrop.toUpperCase()} (Grade FAQ)</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-sans block">EXPECTED QUANTITY</span>
                <strong className="text-sm text-[#05224D]">{quantityQtl} Quintals</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-sans block">CENTRE</span>
                <strong className="text-[#05224D] font-sans">{selectedCentre.name}</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-sans block">ARRIVAL WINDOW</span>
                <strong className="text-[#F47920]">{selectedSlotWindow}</strong>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1 font-mono">
                VEHICLE REGISTRATION NUMBER
              </label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full sm:w-64 p-2 border border-[#C4C6D0] rounded font-mono text-xs font-bold text-[#05224D]"
                placeholder="e.g. MP-04-AB-9842"
                required
              />
            </div>

            <div className="p-2.5 bg-green-50 border border-green-200 rounded text-[11px] text-[#228B22] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Yard capacity guaranteed. You will receive an instant digital token pass with QR code.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="pt-3 border-t border-[#E7ECF2] flex items-center justify-between">
        <button
          disabled={step === 1}
          onClick={handlePrev}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs disabled:opacity-30 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK</span>
        </button>

        <button
          onClick={handleNext}
          className="btn-press px-6 py-2.5 bg-[#203864] hover:bg-[#172033] text-white text-xs font-mono font-bold rounded flex items-center gap-2 shadow"
        >
          <span>{step === 5 ? 'CONFIRM & ISSUE TOKEN PASS' : 'CONTINUE'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
