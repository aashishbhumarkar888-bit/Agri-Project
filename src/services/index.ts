import { mandiStore } from './mandiStore';
import { BookingToken, MandiCentre, TokenStatus, CropType, VehicleType } from '../types';

export const bookingService = {
  getTokens: () => mandiStore.getTokens(),
  getSelectedToken: () => mandiStore.getSelectedToken(),
  setSelectedToken: (id: string) => mandiStore.setSelectedToken(id),
  createBooking: (booking: Omit<BookingToken, 'id' | 'status' | 'createdAt' | 'trustTier' | 'laneId'>) =>
    mandiStore.createBooking(booking),
  advanceTokenState: (tokenId: string, nextStatus: TokenStatus) =>
    mandiStore.advanceTokenState(tokenId, nextStatus)
};

export const queueService = {
  getLanes: () => mandiStore.getLanes(),
  rebalanceWdrrLanes: (normalDelta: number, exceptionDelta: number) =>
    mandiStore.rebalanceWdrrLanes(normalDelta, exceptionDelta)
};

export const capacityService = {
  getCentreCapacity: () => mandiStore.getSelectedCentre().capacity,
  getAllCentres: () => mandiStore.getCentres()
};

export const hardwareService = {
  getTelemetry: () => mandiStore.getHardware(),
  updateWeights: (gross: number, tare: number) => mandiStore.updateWeighbridgeWeights(gross, tare),
  toggleSupervisorBypass: (active: boolean, reason?: string) => mandiStore.toggleSupervisorBypass(active, reason)
};

export const paymentService = {
  reconcileToken: (tokenId: string) => mandiStore.advanceTokenState(tokenId, 'PAYMENT_RECONCILIATION'),
  settlePayment: (tokenId: string) => mandiStore.advanceTokenState(tokenId, 'SETTLED')
};

export const eventLedgerService = {
  getEvents: () => mandiStore.getLedgerEvents()
};

export const offlineSyncService = {
  isOffline: () => mandiStore.isOffline(),
  simulateCut: (cut: boolean) => mandiStore.simulateOfflineCut(cut)
};

export const p2pService = {
  getP2PState: () => mandiStore.getP2PState(),
  transferQuota: (source: string, target: string, qty: number) => mandiStore.transferP2PQuota(source, target, qty)
};

export const centreService = {
  getCentres: () => mandiStore.getCentres(),
  getSelectedCentre: () => mandiStore.getSelectedCentre(),
  selectCentre: (id: string) => mandiStore.setSelectedCentre(id)
};

export const authService = {
  getRole: () => mandiStore.getRole(),
  setRole: (role: any) => mandiStore.setRole(role)
};

export const notificationService = {
  getNotifications: () => mandiStore.getNotifications(),
  addNotification: (title: string, body: string, type?: 'info' | 'warn' | 'success') =>
    mandiStore.addNotification(title, body, type)
};
