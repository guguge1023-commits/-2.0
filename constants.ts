
export const COLORS = {
  emerald: '#043927',
  deepEmerald: '#011611',
  gold: '#D4AF37',
  brightGold: '#FFD700',
  whiteGold: '#F5F5DC'
};

export const MORPH_CONFIG = {
  particleCount: 2500,
  scatterRadius: 8,
  treeHeight: 4,
  treeBaseRadius: 1.8,
  transitionSpeed: 0.05
};

// Helper for random positions
const randomInSphere = (radius: number): [number, number, number] => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = radius * Math.cbrt(Math.random());
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  ];
};

export const INITIAL_ORNAMENTS: any[] = [
  { id: '1', position: [0.8, 0.5, 0.4], scatterPosition: randomInSphere(MORPH_CONFIG.scatterRadius), color: COLORS.gold, type: 'bauble' },
  { id: '2', position: [-0.7, 1.2, -0.5], scatterPosition: randomInSphere(MORPH_CONFIG.scatterRadius), color: COLORS.whiteGold, type: 'diamond' },
  { id: '3', position: [0.4, 1.8, -0.3], scatterPosition: randomInSphere(MORPH_CONFIG.scatterRadius), color: COLORS.brightGold, type: 'bauble' },
  { id: '4', position: [-0.3, 2.4, 0.2], scatterPosition: randomInSphere(MORPH_CONFIG.scatterRadius), color: COLORS.gold, type: 'star' },
  { id: '5', position: [0.5, 0.8, -0.6], scatterPosition: randomInSphere(MORPH_CONFIG.scatterRadius), color: COLORS.whiteGold, type: 'bauble' },
];
