import React, { useState } from 'react';
import { useFarmerStore } from '../../../hooks/useFarmerStore';
import { 
  X, 
  QrCode, 
  Download, 
  Share2, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  Truck,
  Printer
} from 'lucide-react';

export const FarmerTokenModal: React.FC = () => {
  const { showQrModal, setShowQrModal, activeToken, profile } = useFarmerStore();
  const [smsSent, setSmsSent] = useState(false);
  const [savedOffline, setSavedOffline] = useState(false);

  if (!showQrModal || !activeToken) return null;

  const handleSendSms = () => {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 4000);
  };

  const handleSaveOffline = () => {
    setSavedOffline(true);
    setTimeout(() => setSavedOffline(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-[10px] max-w-md w-full border border-[#C4C6D0] shadow-2xl overflow-hidden">
        {/* Pass Header */}
        <div className="bg-[#05224D] text-white p-4 border-b-4 border-[#F47920] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F47920] flex items-center justify-center font-bold text-white text-xs">
              CG
            </div>
            <div>
              <div className="text-[9px] font-mono text-[#F47920] font-bold uppercase tracking-wider">
                GOVERNMENT OF MP • APMC MANDI GATE PASS
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Physical Harvest Procurement Token
              </h3>
            </div>
          </div>

          <button
            onClick={() => setShowQrModal(false)}
            className="text-slate-300 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Body */}
        <div className="p-5 space-y-4 text-xs font-sans">
          {/* Main Token Identifier */}
          <div className="text-center py-2 bg-[#F1F4F9] rounded-[8px] border border-[#C4C6D0]">
            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider block">
              SECURE MANDI ENTRY TOKEN
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#05224D] tracking-wider block mt-0.5">
              {activeToken.id}
            </span>
            <div className="text-[11px] text-[#228B22] font-semibold flex items-center justify-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PHYSICAL CAPACITY SECURELY ALLOCATED</span>
            </div>
          </div>

          {/* High-Contrast QR Code for Gate Scanner */}
          <div className="flex flex-col items-center justify-center p-4 bg-white border-2 border-dashed border-[#C4C6D0] rounded-[8px]">
            {/* SVG High-Res QR Simulation */}
            <div className="w-40 h-40 bg-white p-2 rounded shadow-inner flex items-center justify-center border border-slate-200">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#172033]" fill="currentColor">
                {/* QR Pattern Representation */}
                <rect x="0" y="0" width="30" height="30" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="9" y="9" width="12" height="12" />

                <rect x="70" y="0" width="30" height="30" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="79" y="9" width="12" height="12" />

                <rect x="0" y="70" width="30" height="30" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="9" y="79" width="12" height="12" />

                {/* Random Matrix Modules */}
                <rect x="36" y="10" width="6" height="6" />
                <rect x="48" y="10" width="6" height="6" />
                <rect x="36" y="22" width="12" height="6" />
                <rect x="54" y="22" width="6" height="12" />
                <rect x="10" y="36" width="6" height="12" />
                <rect x="22" y="36" width="12" height="6" />
                <rect x="36" y="36" width="28" height="28" />
                <rect x="42" y="42" width="16" height="16" fill="white" />
                <rect x="46" y="46" width="8" height="8" fill="#F47920" />
                <rect x="70" y="36" width="10" height="6" />
                <rect x="84" y="36" width="10" height="10" />
                <rect x="70" y="48" width="6" height="14" />
                <rect x="80" y="52" width="14" height="6" />
                <rect x="36" y="70" width="6" height="20" />
                <rect x="48" y="76" width="14" height="6" />
                <rect x="70" y="70" width="20" height="6" />
                <rect x="76" y="80" width="14" height="14" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-2">
              Scan at Gate 1 ANPR Barrier Arm Reader
            </span>
          </div>

          {/* Key Arrival & Booking Details */}
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="p-2.5 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
              <span className="text-[10px] text-slate-500 font-sans block">FARMER NAME</span>
              <strong className="text-[#172033] font-sans text-xs">{profile.name}</strong>
              <div className="text-[10px] text-slate-400">{profile.virtualId}</div>
            </div>

            <div className="p-2.5 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
              <span className="text-[10px] text-slate-500 font-sans block">VEHICLE NUMBER</span>
              <strong className="text-[#05224D]">{activeToken.vehicleNumber}</strong>
              <div className="text-[10px] text-slate-400 capitalize">{activeToken.vehicleType}</div>
            </div>

            <div className="p-2.5 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
              <span className="text-[10px] text-slate-500 font-sans block">ARRIVAL WINDOW</span>
              <strong className="text-[#F47920]">{activeToken.slotWindow}</strong>
            </div>

            <div className="p-2.5 bg-[#F7F9FC] border border-[#E7ECF2] rounded">
              <span className="text-[10px] text-slate-500 font-sans block">EXPECTED TURN</span>
              <strong className="text-[#228B22]">{activeToken.expectedTurnWindow}</strong>
            </div>
          </div>

          {/* Centre Address */}
          <div className="p-2.5 bg-[#F7F9FC] border border-[#E7ECF2] rounded flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#F47920] shrink-0" />
            <div>
              <div className="font-bold text-[#172033]">{activeToken.centreName}</div>
              <div className="text-[10px] text-slate-500">APMC Karond Bypass, Bhopal • Gate 1</div>
            </div>
          </div>

          {/* Action Buttons: Save, SMS, Print */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2 border-t border-[#E7ECF2]">
            <button
              onClick={handleSaveOffline}
              className="btn-press w-full sm:flex-1 py-2 bg-[#203864] text-white font-bold rounded flex items-center justify-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{savedOffline ? 'SAVED TO PHONE!' : 'SAVE PASS OFFLINE'}</span>
            </button>

            <button
              onClick={handleSendSms}
              className="btn-press w-full sm:flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded flex items-center justify-center gap-1.5 border border-[#C4C6D0]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#228B22]" />
              <span>{smsSent ? 'SMS DISPATCHED!' : 'SEND TO PHONE SMS'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
