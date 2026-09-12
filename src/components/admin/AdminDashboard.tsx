import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  LayoutDashboard,
  Truck,
  Cpu,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Bell,
  RefreshCw,
  Scale,
  Database,
  Wifi,
  ChevronRight,
  Sliders,
  Filter,
  Download,
  ShieldCheck,
  Zap,
  Radio,
  Layers
} from 'lucide-react';

// Data for Before vs After manual vs IoT processing
const beforeAfterData = [
  { stage: 'Gate Ingress', manual: 45, iot: 4, label: 'Gate Ingress (min)' },
  { stage: 'Gross Weighing', manual: 35, iot: 6, label: 'Gross Weigh (min)' },
  { stage: 'Quality Assay', manual: 40, iot: 5, label: 'Quality Test (min)' },
  { stage: 'Silo Intake', manual: 55, iot: 12, label: 'Silo Intake (min)' },
  { stage: 'Tare Weighing', manual: 25, iot: 4, label: 'Tare Weigh (min)' },
  { stage: 'DBT Settlement', manual: 180, iot: 15, label: 'PFMS DBT (min)' },
];

// Silo capacity pie chart data
const siloData = [
  { name: 'Wheat (FAQ Grade)', value: 245, color: '#228B22' },
  { name: 'Wheat (Sharbati)', value: 110, color: '#F47932' },
  { name: 'Paddy / Mustard', value: 57, color: '#0A2540' },
  { name: 'Available Buffer', value: 88, color: '#E2E8F0' },
];

// Active live vehicles in yard
const activeVehicles = [
  { id: 'T-101', vehicle: 'MP-04-AB-9842', farmer: 'Ramesh Patel', crop: 'Sharbati Wheat', weight: '74.25 q', stage: 'Weighbridge 01', status: 'In Progress', wait: '8 min' },
  { id: 'T-102', vehicle: 'MP-04-E-1049', farmer: 'Sunil Verma', crop: 'Wheat (FAQ)', weight: '68.50 q', stage: 'Quality Assay', status: 'Testing', wait: '12 min' },
  { id: 'T-103', vehicle: 'MP-04-F-8812', farmer: 'Dinesh Yadav', crop: 'Wheat (FAQ)', weight: '82.10 q', stage: 'Silo Bay 02', status: 'Discharging', wait: '18 min' },
  { id: 'T-104', vehicle: 'MP-04-G-3120', farmer: 'Kamal Singh', crop: 'Mustard', weight: '54.00 q', stage: 'Holding Yard', status: 'Queued', wait: '4 min' },
  { id: 'T-105', vehicle: 'MP-04-H-4491', farmer: 'Bhupendra Lodhi', crop: 'Sharbati Wheat', weight: '91.20 q', stage: 'Gate Arrival', status: 'Scanning', wait: '1 min' },
];

export const AdminDashboard: React.FC = () => {
  const [activeNav, setActiveNav] = useState<'Dashboard' | 'Live Yard' | 'Hardware Status' | 'Analytics'>('Dashboard');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All Crops');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased overflow-hidden">
      {/* 1. LEFT-HAND NAVIGATION SIDEBAR (ROS System Style) */}
      <aside className="w-64 bg-[#0A2540] text-slate-200 flex flex-col justify-between shrink-0 border-r border-[#0A2540]/40 shadow-xl z-20">
        <div>
          {/* Brand Header */}
          <div className="px-5 py-5 border-b border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F47932] to-amber-600 flex items-center justify-center text-white font-black text-lg shadow-md ring-2 ring-white/10">
              CG
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white text-base">CODERGALAXY</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#F47932] text-white">OS</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">SIH 26032 • Digital Twin</p>
            </div>
          </div>

          {/* Nav Section Label */}
          <div className="px-5 pt-5 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            System Operations
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1">
            <button
              onClick={() => setActiveNav('Dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === 'Dashboard'
                  ? 'bg-[#F47932] text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Executive Dashboard</span>
              </div>
              {activeNav === 'Dashboard' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </button>

            <button
              onClick={() => setActiveNav('Live Yard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === 'Live Yard'
                  ? 'bg-[#F47932] text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4" />
                <span>Live Yard Logistics</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/15 text-slate-200">5 Active</span>
            </button>

            <button
              onClick={() => setActiveNav('Hardware Status')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === 'Hardware Status'
                  ? 'bg-[#F47932] text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4" />
                <span>IoT & Weighbridges</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#228B22] animate-ping" />
            </button>

            <button
              onClick={() => setActiveNav('Analytics')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeNav === 'Analytics'
                  ? 'bg-[#F47932] text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4" />
                <span>Procurement Audit</span>
              </div>
            </button>
          </nav>

          {/* Quick Hardware Diagnostic Pill in Sidebar */}
          <div className="mx-3 mt-6 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 text-[11px] space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#228B22]" />
                ESP32 Telemetry
              </span>
              <span className="text-[#228B22] font-mono text-[10px] font-bold">STABLE</span>
            </div>
            <div className="space-y-1 font-mono text-[10px] text-slate-400">
              <div className="flex justify-between">
                <span>WB-01 Load Cell:</span>
                <span className="text-slate-200">0.00 kg (Calibrated)</span>
              </div>
              <div className="flex justify-between">
                <span>BLE Mesh Hub:</span>
                <span className="text-slate-200">CH-08 • 0% Loss</span>
              </div>
            </div>
          </div>
        </div>

        {/* User profile / Station Footer */}
        <div className="p-4 border-t border-slate-700/60 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F47932] flex items-center justify-center font-bold text-white text-xs ring-2 ring-white/20">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">Aditi Sharma</div>
              <div className="text-[10px] text-slate-400 truncate">Central Mandi Supervisor</div>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#228B22]" title="System Online" />
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
          {/* Breadcrumb & Centre Info */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">APMC Mandi Network</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-sm font-bold text-[#0A2540]">Bhopal Central Silo Complex (MP-BPL-04)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-green-50 text-[#228B22] border border-green-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#228B22] animate-pulse" />
              LIVE TELEMETRY ACTIVE
            </span>
          </div>

          {/* Search, Filter & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search token, vehicle, khasra..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2540]/20 w-56 transition-all"
              />
            </div>

            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all ${
                isRefreshing ? 'animate-spin text-[#F47932]' : ''
              }`}
              title="Refresh telemetry"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs">
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Audit</span>
            </button>

            <button className="px-3 py-1.5 rounded-lg bg-[#0A2540] text-white text-xs font-semibold hover:bg-[#0A2540]/90 flex items-center gap-1.5 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-[#F47932]" />
              <span>Broadcast Slot</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 space-y-6 flex-1">
          {/* 3. TOP KPI ROW: 4 Tremor/Shadcn Style Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Wait Time Reduction */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Wait Time Reduction</span>
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#F47932]">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">64.2%</span>
                <span className="text-xs font-bold text-[#228B22] flex items-center">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  -9.1 hrs
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                From 14.2h manual down to <strong className="text-slate-800 font-semibold">5.1h average</strong>
              </p>
              <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#F47932] h-full rounded-full" style={{ width: '64.2%' }} />
              </div>
            </div>

            {/* KPI 2: Capacity Utilization */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Capacity Utilization</span>
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[#228B22]">
                  <Database className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">82.4%</span>
                <span className="text-xs font-bold text-[#228B22] flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +12.1%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                <strong className="text-slate-800 font-semibold">412 / 500 Quintals</strong> silo capacity utilized
              </p>
              <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#228B22] h-full rounded-full" style={{ width: '82.4%' }} />
              </div>
            </div>

            {/* KPI 3: Hardware Health */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Hardware Health</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0A2540]">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">99.4%</span>
                <span className="text-xs font-bold text-[#228B22] flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  18/18 Online
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Zero load-cell drift • Calibration valid for Rabi 2026
              </p>
              <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#0A2540] h-full rounded-full" style={{ width: '99.4%' }} />
              </div>
            </div>

            {/* KPI 4: Processing Time */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Avg Tractor Processing</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">18.5 min</span>
                <span className="text-xs font-bold text-[#228B22] flex items-center">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  -78.2%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Target: &lt;20 min • Prev baseline: 85.0 min manual
              </p>
              <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#228B22] h-full rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>

          {/* 4. MAIN CONTENT GRID: Before vs After Chart (Left) + Live Capacity Status (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: Dynamic "Before vs After" Bar Chart (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#0A2540]">
                      Process Velocity: Manual Legacy vs. CODERGALAXY IoT
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-100 text-[#F47932]">
                      SIH 26032 IMPACT
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-world time benchmark in minutes across procurement lifecycle milestones.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] font-medium text-slate-500">Unit: Minutes</span>
                </div>
              </div>

              {/* Recharts Bar Chart */}
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={beforeAfterData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0A2540',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                      formatter={(val: any, name: any) => [`${val} min`, name === 'manual' ? 'Manual Legacy' : 'CODERGALAXY IoT']}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      formatter={(val) => (
                        <span className="text-xs font-semibold text-slate-700">
                          {val === 'manual' ? 'Legacy Manual Mandi (mins)' : 'CODERGALAXY IoT Digital Twin (mins)'}
                        </span>
                      )}
                    />
                    <Bar dataKey="manual" name="manual" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="iot" name="iot" fill="#F47932" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Chart Insight Card */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#228B22]" />
                  <span className="text-slate-600">
                    Cumulative turnaround compressed from <strong>380 minutes (6.3 hrs)</strong> down to <strong>31 minutes</strong>.
                  </span>
                </div>
                <span className="text-[#228B22] font-mono font-bold">91.8% Speedup</span>
              </div>
            </div>

            {/* RIGHT COLUMN: Live Capacity Status (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#0A2540]">Live Capacity Status</h3>
                  <p className="text-xs text-slate-500">Silo storage intake & active weighbridge lanes</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-800">
                  412 / 500 q
                </span>
              </div>

              {/* Silo Pie Chart & Legend */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                <div className="h-44 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={siloData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {siloData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0A2540',
                          borderRadius: '8px',
                          border: 'none',
                          color: '#FFFFFF',
                          fontSize: '11px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1.5 text-xs">
                  {siloData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-600 truncate text-[11px]">{item.name}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-800 text-[11px]">{item.value}q</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                    Remaining Safe Headroom: <strong className="text-[#228B22]">88 Quintals</strong>
                  </div>
                </div>
              </div>

              {/* Weighbridge Hardware Channel Indicators */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Weighbridge Status</span>
                  <span className="text-[10px] font-mono text-slate-400">ESP32 Telemetry</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* WB-01 Gross Scale */}
                  <div className="p-2.5 rounded-lg border border-green-200 bg-green-50/50 space-y-1">
                    <div className="flex items-center justify-between font-mono font-bold text-[11px]">
                      <span className="text-[#0A2540]">WB-01 (Inbound Gross)</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#228B22] text-white">ACTIVE</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      Scale: <strong className="text-[#0A2540]">92.40 q</strong>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      Vehicle: MP-04-AB-9842 (Tractor)
                    </div>
                  </div>

                  {/* WB-02 Tare Scale */}
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <div className="flex items-center justify-between font-mono font-bold text-[11px]">
                      <span className="text-[#0A2540]">WB-02 (Outbound Tare)</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-200 text-slate-700">READY</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      Scale: <strong className="text-slate-500">0.00 q (Zeroed)</strong>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      Standby for empty tractor tare
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. DATA TABLE: Live Vehicles in Yard Logistics */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0A2540]">Active Vehicles in Yard Network</h3>
                <p className="text-xs text-slate-500">Real-time tracking of queued, weighing, and discharging tractors</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Total in Complex:</span>
                <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-[#0A2540] text-white">
                  5 Vehicles
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Token / ID</th>
                    <th className="py-2.5 px-3">Vehicle No</th>
                    <th className="py-2.5 px-3">Farmer Name</th>
                    <th className="py-2.5 px-3">Commodity</th>
                    <th className="py-2.5 px-3">Gross / Est Weight</th>
                    <th className="py-2.5 px-3">Current Location</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Wait Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {activeVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#0A2540]">{v.id}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold">{v.vehicle}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{v.farmer}</td>
                      <td className="py-2.5 px-3">{v.crop}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-[#0A2540]">{v.weight}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800">
                          {v.stage}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === 'In Progress' ? 'bg-orange-100 text-[#F47932]' :
                          v.status === 'Testing' ? 'bg-blue-100 text-[#0A2540]' :
                          v.status === 'Discharging' ? 'bg-green-100 text-[#228B22]' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right font-medium">{v.wait}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
