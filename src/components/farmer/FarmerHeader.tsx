import React, { useState } from 'react';
import { useFarmerStore } from '../../hooks/useFarmerStore';
import { LanguageCode, SUPPORTED_LANGUAGES, getTranslation } from '../../i18n';
import { 
  Sprout, 
  Bell, 
  Wifi, 
  WifiOff, 
  Globe, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  CheckCircle2,
  X
} from 'lucide-react';

interface FarmerHeaderProps {
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
}

export const FarmerHeader: React.FC<FarmerHeaderProps> = ({ currentLang, onSelectLang }) => {
  const { 
    profile, 
    notifications, 
    isOffline, 
    toggleOfflineMode, 
    setShowOnboardingModal,
    setActiveTab,
    demoStepIndex,
    setDemoStep
  } = useFarmerStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const demoSteps = [
    { label: '1. New Farmer Welcome', desc: 'Home overview & readiness' },
    { label: '2. Profile & KYC Verified', desc: 'Masked identity & land record' },
    { label: '3. My Crops (Wheat Rabi)', desc: 'Harvest management' },
    { label: '4. Book Arrival Window', desc: '6-step procurement wizard' },
    { label: '5. Gate Check-in', desc: 'Token QR scanned at gate' },
    { label: '6. Mandi Yard Queue', desc: 'Expected turn window' },
    { label: '7. Weighbridge Verified', desc: '74.25 q net weight recorded' },
    { label: '8. Quality Assay & Silo', desc: '11.2% moisture & unloading' },
    { label: '9. DBT Payment Settled', desc: 'PFMS bank transfer credited' }
  ];

  return (
    <header className="bg-[#203864] text-white border-b-2 border-[#F47920] sticky top-0 z-40 shadow-md">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Brand & Farmer Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div 
            onClick={() => setActiveTab('home')}
            className="w-10 h-10 rounded-full bg-white/10 border-2 border-[#F47920] flex items-center justify-center shrink-0 cursor-pointer hover:bg-white/20 transition-all"
            title="Return to Home"
          >
            <Sprout className="w-5 h-5 text-[#F47920]" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                CODERGALAXY
              </span>
              <span className="text-[10px] bg-[#228B22] text-white font-bold px-1.5 py-0.2 rounded">
                KISAN
              </span>
            </div>
            <div className="text-[11px] text-slate-200 flex items-center gap-1 font-medium">
              <span>{profile.name}</span>
              <span>•</span>
              <span className="opacity-90">{profile.village}</span>
              {profile.isIdentityVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-[#77dd6a] shrink-0" title="Identity Verified" />
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions (Language, Offline toggle, Notifications, Demo controller, Help) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Evaluator Demo Guide Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="px-2.5 py-1 bg-[#F47920] hover:bg-[#e06b18] text-white text-[11px] font-bold rounded flex items-center gap-1.5 shadow transition-all"
              title="Switch demo step for evaluator walkthrough"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DEMO STAGE:</span>
              <span>STEP {demoStepIndex + 1}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-[#172033] rounded-[8px] shadow-2xl border border-[#C4C6D0] p-2 z-50 animate-fadeIn">
                <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider px-2 py-1 border-b border-slate-100">
                  SIH26032 EVALUATOR JOURNEY
                </div>
                <div className="mt-1 space-y-1 max-h-72 overflow-y-auto">
                  {demoSteps.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDemoStep(idx);
                        setShowDemoMenu(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-start gap-2 transition-all ${
                        demoStepIndex === idx
                          ? 'bg-[#203864] text-white font-bold'
                          : 'hover:bg-slate-100 text-[#172033]'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-mono ${
                        demoStepIndex === idx ? 'bg-[#F47920] text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <div>{s.label}</div>
                        <div className={`text-[10px] font-normal ${demoStepIndex === idx ? 'text-slate-200' : 'text-slate-500'}`}>
                          {s.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-1.5 rounded hover:bg-white/10 text-white flex items-center gap-1 text-xs font-semibold"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-slate-200" />
              <span className="hidden sm:inline">
                {SUPPORTED_LANGUAGES.find(l => l.code === currentLang)?.native || 'English'}
              </span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white text-[#172033] rounded-[6px] shadow-xl border border-[#C4C6D0] p-1 z-50">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onSelectLang(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between ${
                      currentLang === l.code ? 'bg-[#203864] text-white font-bold' : 'hover:bg-slate-100'
                    }`}
                  >
                    <span>{l.native}</span>
                    {currentLang === l.code && <CheckCircle2 className="w-3.5 h-3.5 text-[#77dd6a]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Offline Resilient Toggle Indicator */}
          <button
            onClick={toggleOfflineMode}
            className={`px-2 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
              isOffline
                ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
                : 'bg-green-500/20 text-green-200 border border-green-400/40'
            }`}
            title={isOffline ? 'Offline Mode Active (Cached data)' : 'Online Connected'}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3 h-3 text-amber-300" />
                <span className="hidden md:inline">OFFLINE SAVED</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-green-300" />
                <span className="hidden md:inline">ONLINE</span>
              </>
            )}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 rounded hover:bg-white/10 text-white relative"
              title="Personal Notifications"
            >
              <Bell className="w-4 h-4 text-slate-200" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#F47920] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-[#172033] rounded-[8px] shadow-2xl border border-[#C4C6D0] p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-[#203864]">
                  <span>MY HARVEST ALERTS</span>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 space-y-2 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 bg-[#F7F9FC] border border-[#E7ECF2] rounded text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#203864]">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                      <div className="pt-1 border-t border-slate-200/60 text-[10px] text-slate-500">
                        <strong>What to do:</strong> {n.whatToDo}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help Guide */}
          <button
            onClick={() => setShowOnboardingModal(true)}
            className="p-1.5 rounded hover:bg-white/10 text-white"
            title="Harvest Journey Guide"
          >
            <HelpCircle className="w-4 h-4 text-slate-200" />
          </button>
        </div>
      </div>
    </header>
  );
};
