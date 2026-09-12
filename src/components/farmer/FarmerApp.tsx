import React, { useState } from 'react';
import { useFarmerStore } from '../../hooks/useFarmerStore';
import { LanguageCode } from '../../i18n';
import { FarmerHeader } from './FarmerHeader';
import { FarmerBottomNav } from './FarmerBottomNav';
import { FarmerHomeView } from './views/FarmerHomeView';
import { MyHarvestView } from './views/MyHarvestView';
import { BookingWizardView } from './views/BookingWizardView';
import { ProgressJourneyView } from './views/ProgressJourneyView';
import { ProfileView } from './views/ProfileView';
import { FarmerTokenModal } from './modals/FarmerTokenModal';
import { FarmerOnboardingModal } from './modals/FarmerOnboardingModal';
import { MilestoneDetailModal } from './modals/MilestoneDetailModal';
import { FarmerDemoWalkthrough } from './demo/FarmerDemoWalkthrough';

export const FarmerApp: React.FC = () => {
  const { activeTab } = useFarmerStore();
  const [currentLang, setCurrentLang] = useState<LanguageCode>('hi');

  return (
    <div className="min-h-screen bg-[#F1F4F9] text-[#172033] flex flex-col font-sans selection:bg-[#F47920] selection:text-white">
      {/* 1. Farmer Header */}
      <FarmerHeader currentLang={currentLang} onSelectLang={setCurrentLang} />

      {/* 2. SIH Evaluator Demo Walkthrough Bar */}
      <FarmerDemoWalkthrough />

      {/* 3. Main View Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-5 pb-20 md:pb-8">
        {activeTab === 'home' && <FarmerHomeView />}
        {activeTab === 'harvest' && <MyHarvestView />}
        {activeTab === 'booking' && <BookingWizardView />}
        {activeTab === 'progress' && <ProgressJourneyView />}
        {activeTab === 'profile' && (
          <ProfileView currentLang={currentLang} onSelectLang={setCurrentLang} />
        )}
      </main>

      {/* 4. Farmer Mobile & Desktop Bottom Navigation */}
      <FarmerBottomNav />

      {/* 5. Modals */}
      <FarmerTokenModal />
      <FarmerOnboardingModal />
      <MilestoneDetailModal />
    </div>
  );
};
