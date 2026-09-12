import React, { useState } from 'react';
import { useMandiStore } from '../../hooks/useMandiStore';
import { AppRole } from '../../types';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../../i18n';
import { 
  Building2, 
  Cpu, 
  Wifi, 
  WifiOff, 
  Globe, 
  Bell, 
  Play, 
  ShieldCheck, 
  Users, 
  ChevronDown,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  currentLang: LanguageCode;
  onSelectLang: (code: LanguageCode) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentLang, onSelectLang }) => {
  const { 
    role, 
    setRole, 
    selectedCentre, 
    centres, 
    setSelectedCentre, 
    hardware, 
    isOffline, 
    simulateOfflineCut, 
    isDemoMode, 
    setDemoMode, 
    notifications 
  } = useMandiStore();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showCentreMenu, setShowCentreMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const rolesList: { id: AppRole; label: string; desc: string }[] = [
    { id: 'farmer', label: 'Farmer Portal', desc: 'Minimal outdoor high-contrast booking & tracking' },
    { id: 'csc', label: 'CSC Operator', desc: 'Assisted rural kiosk booking & token printing' },
    { id: 'staff', label: 'Yard Weighbridge Staff', desc: 'Digital Twin, ESP32 console & WDRR control' },
    { id: 'supervisor', label: 'Centre Supervisor', desc: 'Exceptions, bypass authorization & audit' },
    { id: 'admin', label: 'State APMC Admin', desc: 'Multi-centre telemetry, ledger & capacity policy' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#05224D] text-white border-b border-[#203864] shadow-md select-none">
      {/* Top Banner with SIH and Core Invariant */}
      <div className="bg-[#203864] px-4 py-1 text-[11px] font-mono flex items-center justify-between border-b border-[#05224D]/60 text-slate-300">
        <div className="flex items-center gap-3">
          <span className="bg-[#F47920] text-white px-2 py-0.2 rounded font-bold uppercase tracking-wider text-[10px]">
            SIH 2026 • SIH26032
          </span>
          <span className="font-semibold text-white tracking-wide">
            CODERGALAXY
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline text-[#77dd6a] font-mono">
            CORE PRINCIPLE: &ldquo;FROM DIGITAL BOOKING TO PHYSICAL TRUTH&rdquo;
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* SIH Demo Mode Trigger Button */}
          <button
            onClick={() => setDemoMode(!isDemoMode)}
            className={`btn-press flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
              isDemoMode 
                ? 'bg-[#F47920] text-white ring-2 ring-orange-300 animate-pulse' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#F47920]" />
            <span>{isDemoMode ? 'JUDGE PLAYBOOK ACTIVE' : 'SIH DEMO PLAYBOOK'}</span>
          </button>

          {/* Quick Offline Simulation Toggle */}
          <button
            onClick={() => simulateOfflineCut(!isOffline)}
            className={`btn-press flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              isOffline 
                ? 'bg-[#D97706] text-white font-bold' 
                : 'bg-black/20 hover:bg-black/40 text-slate-300'
            }`}
            title="Click to simulate network severance and test offline P2P mesh"
          >
            {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3 text-[#228B22]" />}
            <span>{isOffline ? 'OFFLINE SIMULATED' : 'CLOUD ONLINE'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Left: Branding & Centre Selector */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-bold text-base md:text-lg tracking-tight text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F47920] inline-block shadow-[0_0_8px_#F47920]"></span>
              CODERGALAXY
            </span>
            <span className="text-[10px] text-slate-300 font-mono tracking-wider -mt-1 hidden sm:block">
              PHYSICAL TRUTH ECOSYSTEM
            </span>
          </div>

          <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block"></div>

          {/* Centre Switcher */}
          <div className="relative">
            <button
              onClick={() => { setShowCentreMenu(!showCentreMenu); setShowRoleMenu(false); }}
              className="flex items-center gap-2 bg-[#203864] hover:bg-[#203864]/80 px-2.5 py-1.5 rounded-[4px] border border-white/10 text-xs text-white"
            >
              <Building2 className="w-3.5 h-3.5 text-[#F47920]" />
              <span className="font-medium max-w-[150px] md:max-w-[220px] truncate">
                {selectedCentre.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showCentreMenu && (
              <div className="absolute left-0 mt-1 w-72 bg-[#05224D] border border-[#203864] rounded-[6px] shadow-xl p-1 z-50">
                <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-white/10">
                  Select APMC Mandi Complex
                </div>
                {centres.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCentre(c.id); setShowCentreMenu(false); }}
                    className={`w-full text-left p-2 rounded text-xs flex flex-col gap-0.5 hover:bg-[#203864] ${
                      selectedCentre.id === c.id ? 'bg-[#203864] font-semibold border-l-2 border-[#F47920]' : ''
                    }`}
                  >
                    <span className="text-white">{c.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                      <span>{c.code}</span>
                      <span>•</span>
                      <span>{c.distanceKm} km</span>
                      <span>•</span>
                      <span className={c.status === 'OPERATIONAL' ? 'text-[#228B22]' : 'text-[#D97706]'}>
                        {c.status}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center/Right Status Badges: Hardware Attestation + Skew */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#203864] rounded-[4px] border border-white/10 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-[#228B22]" />
            <span className="text-slate-300">ESP32 WB-04A:</span>
            <span className="text-[#228B22] font-semibold">TIER 1 ATTESTED</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#203864] rounded-[4px] border border-white/10 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#228B22]"></span>
            <span className="text-slate-300">PARITY SKEW:</span>
            <span className="text-white font-semibold">0.00 q</span>
          </div>
        </div>

        {/* Right Action Icons: Language, Notifications, Role Switcher */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => { setShowLangMenu(!showLangMenu); setShowRoleMenu(false); }}
              className="p-2 rounded hover:bg-[#203864] text-slate-200 transition-colors flex items-center gap-1 text-xs"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-[#F47920]" />
              <span className="font-mono text-xs uppercase hidden sm:inline">{currentLang}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-[#05224D] border border-[#203864] rounded shadow-xl p-1 z-50">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { onSelectLang(l.code); setShowLangMenu(false); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between hover:bg-[#203864] ${
                      currentLang === l.code ? 'bg-[#203864] text-[#F47920] font-bold' : 'text-white'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[11px] text-slate-400 font-sans">{l.native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded hover:bg-[#203864] text-slate-200 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#F47920] rounded-full"></span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-1 w-80 bg-[#05224D] border border-[#203864] rounded shadow-2xl p-2 z-50 text-xs">
                <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider pb-1 mb-2 border-b border-white/10 flex justify-between">
                  <span>System Event Log</span>
                  <span>{notifications.length} unread</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded bg-[#203864]/50 border border-white/5 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between font-semibold text-white">
                        <span>{n.title}</span>
                        <span className="text-[9px] font-mono text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{n.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => { setShowRoleMenu(!showRoleMenu); setShowCentreMenu(false); }}
              className="btn-press flex items-center gap-1.5 bg-[#F47920] hover:bg-[#e06b18] text-white px-3 py-1.5 rounded-[4px] font-semibold text-xs transition-all shadow"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Role:</span>
              <span className="uppercase tracking-wide font-mono">
                {role === 'staff' ? 'YARD STAFF' : role.toUpperCase()}
              </span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1 w-64 bg-[#05224D] border border-[#203864] rounded-[6px] shadow-2xl p-1.5 z-50">
                <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-white/10">
                  Switch System Persona
                </div>
                {rolesList.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { setRole(r.id); setShowRoleMenu(false); }}
                    className={`w-full text-left p-2 rounded text-xs flex flex-col gap-0.5 hover:bg-[#203864] transition-colors ${
                      role === r.id ? 'bg-[#203864] border-l-2 border-[#F47920]' : ''
                    }`}
                  >
                    <span className="font-semibold text-white flex items-center justify-between">
                      <span>{r.label}</span>
                      {role === r.id && (
                        <span className="text-[10px] text-[#F47920] font-mono font-bold uppercase">ACTIVE</span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-tight">
                      {r.desc}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
