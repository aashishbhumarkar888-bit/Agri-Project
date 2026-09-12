export const PALETTE = {
  primaryBlue: '#203864',
  deepPrimary: '#05224D',
  sihOrange: '#F47920',
  operationalGreen: '#228B22',
  warningAmber: '#D97706',
  criticalRed: '#DC2626',
  canvas: '#F7F9FC',
  white: '#FFFFFF',
  mutedSurfaces: '#E7ECF2',
  primaryText: '#172033',
  secondaryText: '#44474F',
  borders: '#C4C6D0',
};

export const MSP_RATES_2026: Record<string, number> = {
  wheat: 2275, // INR / quintal
  paddy: 2300,
  soybean: 4892,
  maize: 2090,
  mustard: 5650,
};

export const CROP_DETAILS = {
  wheat: { name: 'Wheat (गेहूं / Sharbati)', icon: '🌾', maxMoisture: 12.0 },
  paddy: { name: 'Paddy (धान / Basmati)', icon: '🌱', maxMoisture: 17.0 },
  soybean: { name: 'Soybean (सोयाबीन / Yellow)', icon: '🌿', maxMoisture: 10.0 },
  maize: { name: 'Maize (मक्का / Hybrid)', icon: '🌽', maxMoisture: 14.0 },
  mustard: { name: 'Mustard (सरसों / Black)', icon: '🌼', maxMoisture: 8.0 },
};
