import React, { useState } from 'react';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { EdgeOperatorPWA } from './components/offline/EdgeOperatorPWA';
import { FarmerMultiChannelView } from './components/farmer/FarmerMultiChannelView';
import { FarmerApp } from './components/farmer/FarmerApp';
import { LayoutDashboard, Radio, Smartphone, Sparkles, Layers } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'admin' | 'operator' | 'farmer' | 'farmer_full'>('admin');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* SIH 26032 Architecture Switcher Pill Banner */}
      <header className="bg-[#0A2540] text-white border-b border-slate-700/80 px-4 py-2.5 shadow-md shrink-0 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#F47932] flex items-center justify-center font-black text-xs text-white shadow-xs">
              SIH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs tracking-tight text-white">CODERGALAXY</span>
                <span className="text-[10px] text-[#F47932] font-mono font-bold">SIH 26032</span>
              </div>
              <p className="text-[10px] text-slate-300 hidden md:block">
                Agricultural Procurement OS • Enterprise Digital Twin & Offline Mesh
              </p>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/70 p-1 rounded-xl border border-slate-700/60 overflow-x-auto">
            <button
              onClick={() => setActiveView('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeView === 'admin'
                  ? 'bg-[#F47932] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>1. Admin Digital Twin</span>
            </button>

            <button
              onClick={() => setActiveView('operator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeView === 'operator'
                  ? 'bg-[#F47932] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>2. Edge Operator PWA (Offline)</span>
            </button>

            <button
              onClick={() => setActiveView('farmer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeView === 'farmer'
                  ? 'bg-[#F47932] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>3. Farmer Multi-Channel</span>
            </button>

            <button
              onClick={() => setActiveView('farmer_full')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeView === 'farmer_full'
                  ? 'bg-[#228B22] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title="Full 3D Harvest Journey & Booking Wizard"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Full 3D Journey</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main View Container */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeView === 'admin' && <AdminDashboard />}
        {activeView === 'operator' && <EdgeOperatorPWA />}
        {activeView === 'farmer' && <FarmerMultiChannelView />}
        {activeView === 'farmer_full' && <FarmerApp />}
      </div>
    </div>
  );
}
