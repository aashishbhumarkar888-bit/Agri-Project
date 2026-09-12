import { useSyncExternalStore } from 'react';
import { mandiStore } from '../services/mandiStore';

export function useMandiStore() {
  useSyncExternalStore(
    (onStoreChange) => mandiStore.subscribe(onStoreChange),
    () => mandiStore
  );

  return {
    role: mandiStore.getRole(),
    setRole: (role: any) => mandiStore.setRole(role),
    selectedCentre: mandiStore.getSelectedCentre(),
    centres: mandiStore.getCentres(),
    setSelectedCentre: (id: string) => mandiStore.setSelectedCentre(id),
    tokens: mandiStore.getTokens(),
    selectedToken: mandiStore.getSelectedToken(),
    setSelectedToken: (id: string) => mandiStore.setSelectedToken(id),
    lanes: mandiStore.getLanes(),
    hardware: mandiStore.getHardware(),
    parity: mandiStore.getParity(),
    ledgerEvents: mandiStore.getLedgerEvents(),
    p2pState: mandiStore.getP2PState(),
    isOffline: mandiStore.isOffline(),
    isDemoMode: mandiStore.isDemoActive(),
    demoStep: mandiStore.getDemoStep(),
    selected3DVehicle: mandiStore.getSelected3DVehicle(),
    notifications: mandiStore.getNotifications(),
    createBooking: (b: any) => mandiStore.createBooking(b),
    advanceTokenState: (id: string, s: any) => mandiStore.advanceTokenState(id, s),
    updateWeighbridgeWeights: (g: number, t: number) => mandiStore.updateWeighbridgeWeights(g, t),
    toggleSupervisorBypass: (a: boolean, r?: string) => mandiStore.toggleSupervisorBypass(a, r),
    simulateOfflineCut: (cut: boolean) => mandiStore.simulateOfflineCut(cut),
    transferP2PQuota: (s: string, t: string, q: number) => mandiStore.transferP2PQuota(s, t, q),
    setDemoMode: (active: boolean) => mandiStore.setDemoMode(active),
    setDemoStep: (step: number) => mandiStore.setDemoStep(step),
    setSelected3DVehicle: (id: string | null) => mandiStore.setSelected3DVehicle(id),
    rebalanceWdrrLanes: (n: number, e: number) => mandiStore.rebalanceWdrrLanes(n, e)
  };
}
