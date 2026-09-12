import React from 'react';
import { useFarmerStore } from '../../hooks/useFarmerStore';
import { FarmerTab } from '../../types/farmer';
import { 
  Home, 
  Sprout, 
  CalendarPlus, 
  Compass, 
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export const FarmerBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, activeToken, profile } = useFarmerStore();

  const navItems: { tab: FarmerTab; label: string; hindiLabel: string; icon: any; badge?: string }[] = [
    {
      tab: 'home',
      label: 'HOME',
      hindiLabel: 'होम',
      icon: Home
    },
    {
      tab: 'harvest',
      label: 'MY HARVEST',
      hindiLabel: 'मेरी फसल',
      icon: Sprout
    },
    {
      tab: 'booking',
      label: 'BOOKING',
      hindiLabel: 'स्लॉट बुक',
      icon: CalendarPlus
    },
    {
      tab: 'progress',
      label: 'PROGRESS',
      hindiLabel: 'प्रगति',
      icon: Compass,
      badge: activeToken?.status === 'WEIGHING' ? 'WEIGH' : activeToken?.status === 'QUEUED' ? 'QUEUE' : undefined
    },
    {
      tab: 'profile',
      label: 'PROFILE',
      hindiLabel: 'प्रोफ़ाइल',
      icon: UserCheck,
      badge: `${profile.verificationScore}%`
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#C4C6D0] shadow-lg md:relative md:border-t-0 md:bg-transparent md:shadow-none">
      <div className="max-w-xl md:max-w-4xl mx-auto px-2 py-1.5 flex items-center justify-around md:justify-center md:gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;

          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col md:flex-row items-center justify-center gap-1 px-3 py-1.5 rounded-[8px] transition-all relative ${
                isActive
                  ? 'text-[#203864] font-bold bg-[#F1F4F9] md:bg-[#203864] md:text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#172033] hover:bg-slate-100'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#F47920] md:text-[#F47920]' : 'text-slate-500'}`} />
                {item.badge && (
                  <span className={`absolute -top-1.5 -right-3 text-[9px] font-mono px-1 py-0.2 rounded-full font-bold leading-tight ${
                    isActive 
                      ? 'bg-[#228B22] text-white' 
                      : 'bg-[#F47920] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>

              <div className="text-center md:text-left">
                <span className="text-[10px] md:text-xs block tracking-tight">
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
