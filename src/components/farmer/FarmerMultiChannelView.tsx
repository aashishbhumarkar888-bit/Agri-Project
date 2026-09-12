import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Truck,
  Scale,
  CreditCard,
  QrCode,
  MapPin,
  Phone,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Layers,
  Smartphone,
  Info,
  Calendar,
  Building2,
  FileCheck2,
  ArrowRight
} from 'lucide-react';

type ProcurementStage = 'BOOKED' | 'ARRIVED' | 'INSPECTED' | 'WEIGHED' | 'SETTLED';

export const FarmerMultiChannelView: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<ProcurementStage>('WEIGHED');
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [activeLang, setActiveLang] = useState<'EN' | 'HI'>('HI');

  const stages: { key: ProcurementStage; label: string; labelHi: string; desc: string }[] = [
    { key: 'BOOKED', label: 'Booked', labelHi: 'पंजीकृत (स्लॉट)', desc: 'Slot reserved: 10:00 - 11:00 AM' },
    { key: 'ARRIVED', label: 'Arrived', labelHi: 'गेट आगमन', desc: 'Gate 1 pass scanned at 10:04 AM' },
    { key: 'INSPECTED', label: 'Inspected', labelHi: 'गुणवत्ता जांच', desc: 'Moisture 11.2% • Grade FAQ Pass' },
    { key: 'WEIGHED', label: 'Weighed', labelHi: 'कांटा तौल', desc: 'Gross 92.40q • Net 74.25q locked' },
    { key: 'SETTLED', label: 'Settled', labelHi: 'DBT भुगतान', desc: '₹1,68,918 sent to Bank (PFMS)' }
  ];

  const getStageIndex = (stage: ProcurementStage) => {
    return stages.findIndex((s) => s.key === stage);
  };

  const activeIndex = getStageIndex(currentStage);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-3 sm:p-6 select-none flex flex-col items-center">
      {/* Top Controls: Frame Size Toggle & Simulator Helpers */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-4 bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#F47932]" />
          <span className="text-xs font-extrabold text-[#0A2540]">
            VIEW 3: FARMER MULTI-CHANNEL VIEW (SIH 26032)
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Language Switch */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden font-bold">
            <button
              onClick={() => setActiveLang('HI')}
              className={`px-2.5 py-1 ${activeLang === 'HI' ? 'bg-[#0A2540] text-white' : 'bg-white text-slate-600'}`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setActiveLang('EN')}
              className={`px-2.5 py-1 ${activeLang === 'EN' ? 'bg-[#0A2540] text-white' : 'bg-white text-slate-600'}`}
            >
              English
            </button>
          </div>

          {/* Viewport Frame Toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="px-3 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 font-mono font-semibold text-slate-700"
          >
            {isMobileFrame ? 'Expand Fullscreen' : 'Simulate Phone (390px)'}
          </button>
        </div>
      </div>

      {/* Main Container (Simulated Smartphone or Responsive Fullscreen) */}
      <div className={`w-full transition-all ${
        isMobileFrame
          ? 'max-w-md bg-white rounded-3xl border-8 border-slate-800 shadow-2xl overflow-hidden pb-6'
          : 'max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6'
      }`}>
        {/* Mobile Status Bar (If in phone frame) */}
        {isMobileFrame && (
          <div className="bg-[#0A2540] text-white px-6 py-2 flex items-center justify-between text-[11px] font-mono">
            <span>10:24 AM</span>
            <div className="w-16 h-4 bg-black rounded-full mx-auto" />
            <span className="flex items-center gap-1">
              <span>5G</span>
              <span>100%</span>
            </span>
          </div>
        )}

        {/* 1. APP HEADER */}
        <div className="bg-[#0A2540] text-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F47932] to-amber-600 flex items-center justify-center text-white font-black text-sm shadow">
                CG
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-tight text-white">
                  {activeLang === 'HI' ? 'ई-उपार्जन किसान सेवा' : 'CODERGALAXY Kisan Portal'}
                </h1>
                <p className="text-[10px] text-slate-300">
                  {activeLang === 'HI' ? 'मध्य प्रदेश कृषि विपणन बोर्ड' : 'MP Agricultural Procurement Board'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#228B22] text-white">
                KYC VERIFIED
              </span>
              <div className="text-[11px] font-bold text-slate-200 mt-0.5">
                {activeLang === 'HI' ? 'रामेश पटेल' : 'Ramesh Patel'}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 space-y-4">
          {/* 2. DYNAMIC PROBABILISTIC ETA CARD (Core Requirement) */}
          <div className="bg-gradient-to-br from-white to-orange-50/40 border-2 border-[#F47932] rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-orange-100 text-[#F47932] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeLang === 'HI' ? 'संभावित तौल समय' : 'LIVE PROBABILISTIC TURN'}</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#228B22]">
                <span className="w-2 h-2 rounded-full bg-[#228B22] animate-pulse" />
                {activeLang === 'HI' ? 'सुचारू संचालन' : 'On Schedule'}
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-500 font-medium">
                {activeLang === 'HI' ? 'कांटा तौल अनुमानित खिड़की:' : 'Expected Weighbridge Turn Window:'}
              </div>
              <div className="text-2xl font-black text-[#0A2540] tracking-tight mt-0.5">
                10:20 AM - 10:50 AM
              </div>
            </div>

            {/* Queue position & lane telemetry */}
            <div className="p-3 bg-white rounded-xl border border-orange-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  {activeLang === 'HI' ? 'होल्डिंग यार्ड लेन Q1:' : 'Holding Yard Lane Q1:'}
                </span>
                <span className="font-mono font-bold text-[#228B22]">
                  {activeLang === 'HI' ? 'आगे केवल 2 वाहन' : '2 Vehicles Ahead'}
                </span>
              </div>

              {/* Progress visual lane */}
              <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-slate-600 overflow-x-auto pb-1">
                <div className="px-2 py-1 bg-slate-100 rounded border text-center shrink-0">
                  <div className="text-[9px] text-slate-400">At Scale</div>
                  <div className="font-bold">MP-04-E-1049</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="px-2 py-1 bg-slate-100 rounded border text-center shrink-0">
                  <div className="text-[9px] text-slate-400">In Front</div>
                  <div className="font-bold">MP-04-F-8812</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="px-2.5 py-1 bg-[#0A2540] text-white rounded border border-[#F47932] text-center shrink-0 shadow-xs">
                  <div className="text-[9px] text-[#F47932] font-bold">YOU (NEXT)</div>
                  <div className="font-bold">MP-04-AB-9842</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                {activeLang === 'HI'
                  ? 'लोड सेल खाली होते ही आपको गेट 1 से तौल कांटे पर बुलाया जाएगा।'
                  : 'You will be dispatched to WB-01 as soon as the active scale is cleared.'}
              </div>
            </div>
          </div>

          {/* 3. STEP-BY-STEP PROGRESS TRACKER (Core Requirement) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="font-extrabold text-sm text-[#0A2540]">
                {activeLang === 'HI' ? 'उपार्जन यात्रा प्रगति' : 'Step-by-Step Progress Tracker'}
              </h2>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {activeIndex + 1} OF 5 COMPLETED
              </span>
            </div>

            {/* Horizontal / Vertical Stage Timeline */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {stages.map((st, idx) => {
                const isCompleted = idx < activeIndex;
                const isCurrent = idx === activeIndex;
                const isUpcoming = idx > activeIndex;

                return (
                  <div
                    key={st.key}
                    onClick={() => setCurrentStage(st.key)}
                    className="relative cursor-pointer group"
                  >
                    {/* Circle icon on the timeline line */}
                    <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isCompleted
                        ? 'bg-[#228B22] text-white ring-2 ring-green-100'
                        : isCurrent
                        ? 'bg-[#F47932] text-white ring-4 ring-orange-100 animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    {/* Stage Label & Details */}
                    <div className={`p-2.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-orange-50/50 border-orange-200 shadow-xs'
                        : isCompleted
                        ? 'bg-slate-50/60 border-slate-200'
                        : 'bg-white border-slate-100 opacity-60'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${
                          isCurrent ? 'text-[#0A2540]' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                        }`}>
                          {activeLang === 'HI' ? st.labelHi : st.label}
                        </span>

                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isCurrent
                            ? 'bg-[#F47932] text-white'
                            : isCompleted
                            ? 'bg-green-100 text-[#228B22]'
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          {isCurrent ? 'ACTIVE' : isCompleted ? 'DONE' : 'QUEUED'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. ACTIVE WEIGHMENT TRUTH DETAILS */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#0A2540]" />
                {activeLang === 'HI' ? 'कांटा तौल पर्ची (डिजिटल)' : 'Verified Weighment Slip'}
              </span>
              <span className="font-mono text-[10px] text-slate-500">WB-01 • SENSOR LOCKED</span>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-1">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 font-sans">
                  {activeLang === 'HI' ? 'सकल वजन (Gross)' : 'Gross Weight'}
                </div>
                <div className="text-base font-black text-slate-800">92.40 q</div>
              </div>

              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 font-sans">
                  {activeLang === 'HI' ? 'खाली ट्रैक्टर (Tare)' : 'Tare Weight'}
                </div>
                <div className="text-base font-black text-slate-800">18.15 q</div>
              </div>
            </div>

            <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 font-sans">
                  {activeLang === 'HI' ? 'सत्यापित शुद्ध गेहूं (Net Payload)' : 'Verified Net Payload'}
                </div>
                <div className="text-lg font-mono font-black text-[#0A2540]">74.25 Quintals</div>
              </div>
              <div className="text-right font-mono text-xs">
                <div className="text-[10px] text-slate-500 font-sans">MSP @ ₹2,275/q</div>
                <div className="font-bold text-[#228B22]">₹1,68,918</div>
              </div>
            </div>
          </div>

          {/* 5. MULTI-CHANNEL ACCESS & HELPLINE BADGE */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs space-y-1.5">
            <div className="font-bold text-amber-950 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#F47932]" />
              <span>{activeLang === 'HI' ? 'मल्टी-चैनल सहायता (इंटरनेट के बिना)' : 'Multi-Channel Offline Support'}</span>
            </div>
            <div className="text-[11px] text-amber-900 leading-relaxed">
              SMS <strong>"CG STATUS"</strong> to <strong>51969</strong> or dial Toll-free Kisan Helpline <strong>1800-200-5196</strong> for automated voice updates.
            </div>
          </div>

          {/* Interactive Simulator Bar to Advance Stages */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="font-mono text-slate-400">TEST STAGES:</span>
            <div className="flex gap-1">
              {stages.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setCurrentStage(s.key)}
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                    currentStage === s.key ? 'bg-[#0A2540] text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {s.key.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
