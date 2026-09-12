import { useSyncExternalStore } from 'react';
import { farmerStore } from '../services/farmerStore';
import { FarmerTab, FarmerJourneyStage } from '../types/farmer';
import { TokenStatus } from '../types';

export function useFarmerStore() {
  useSyncExternalStore(
    (onStoreChange) => farmerStore.subscribe(onStoreChange),
    () => farmerStore
  );

  return {
    activeTab: farmerStore.getActiveTab(),
    setActiveTab: (tab: FarmerTab) => farmerStore.setActiveTab(tab),
    profile: farmerStore.getProfile(),
    updateProfile: (p: any) => farmerStore.updateProfile(p),
    crops: farmerStore.getCrops(),
    addCrop: (c: any) => farmerStore.addCrop(c),
    activeToken: farmerStore.getActiveToken(),
    notifications: farmerStore.getNotifications(),
    markAllNotificationsRead: () => farmerStore.markAllNotificationsRead(),
    selectedCentreId: farmerStore.getSelectedCentreId(),
    selectedCentre: farmerStore.getSelectedCentre(),
    setSelectedCentre: (id: string) => farmerStore.setSelectedCentre(id),
    isOffline: farmerStore.isOfflineMode(),
    toggleOfflineMode: () => farmerStore.toggleOfflineMode(),
    showOnboardingModal: farmerStore.getShowOnboardingModal(),
    setShowOnboardingModal: (s: boolean) => farmerStore.setShowOnboardingModal(s),
    showQrModal: farmerStore.getShowQrModal(),
    setShowQrModal: (s: boolean) => farmerStore.setShowQrModal(s),
    selectedMilestoneModal: farmerStore.getSelectedMilestoneModal(),
    setSelectedMilestoneModal: (m: FarmerJourneyStage | null) => farmerStore.setSelectedMilestoneModal(m),
    demoStepIndex: farmerStore.getDemoStepIndex(),
    setDemoStep: (step: number) => farmerStore.setDemoStep(step),
    createBooking: (b: any) => farmerStore.createBooking(b),
    advanceTokenState: (s: TokenStatus) => farmerStore.advanceTokenState(s)
  };
}
