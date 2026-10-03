import type { Api, Origin, Settings, Order, Supply, AuditEntry, FlightCode } from '../engine/types';

const MOCK_ORIGINS: Origin[] = [
  { id: 'chikkamagaluru', name: 'Chikkamagaluru', flag: 'IN', tag: 'Classic Indian filter base', type: 'Arabica', color: '#b38822', flavor: { Fruity: 2, Flowery: 1, Sweet: 6, Nutty: 8, Spicy: 3, Tangy: 2, Strong: 5, Bitter: 4, Roasted: 5 }, pricePerKg: 750, inStock: true },
  { id: 'coorg', name: 'Coorg', flag: 'IN', tag: 'Heavy body, spicy notes', type: 'Robusta', color: '#8b5a2b', flavor: { Fruity: 1, Flowery: 0, Sweet: 3, Nutty: 6, Spicy: 8, Tangy: 1, Strong: 9, Bitter: 7, Roasted: 8 }, pricePerKg: 450, inStock: true },
  { id: 'ethiopia', name: 'Ethiopia Yirgacheffe', flag: 'ET', tag: 'Bright, floral, fruity', type: 'Arabica', color: '#d4af37', flavor: { Fruity: 9, Flowery: 8, Sweet: 7, Nutty: 2, Spicy: 1, Tangy: 8, Strong: 4, Bitter: 2, Roasted: 3 }, pricePerKg: 1800, inStock: true },
  { id: 'colombia', name: 'Colombia Supremo', flag: 'CO', tag: 'Balanced, caramel sweetness', type: 'Arabica', color: '#cd853f', flavor: { Fruity: 4, Flowery: 3, Sweet: 8, Nutty: 5, Spicy: 2, Tangy: 4, Strong: 6, Bitter: 3, Roasted: 5 }, pricePerKg: 1200, inStock: true }
];

const MOCK_SETTINGS: Settings = {
  showAI: true,
  showMenuFit: true,
  featuredBlendIds: [],
  roles: {
    robustaSouth: 'coorg', robustaBudget: 'coorg', robustaDefault: 'coorg',
    steadyArabica: 'chikkamagaluru', steadyPremium: 'colombia',
    starPremium: 'ethiopia', starAudiencePremium: 'ethiopia', starSouth: 'chikkamagaluru', starDefault: 'colombia',
    forgivingStar: 'colombia', baseWest: 'colombia', baseEast: 'chikkamagaluru', baseDefault: 'chikkamagaluru'
  },
  doseGrams: { kaapi: 15, espresso: 18, pourover: 20, mixed: 18 },
  salesWhatsApp: '1234567890',
  sampleSizesGrams: [250, 500],
  flightPackGrams: 100,
  reorderLeadDays: 5,
  freshDays: 14
};

export const mockApi: Api = {
  async getOrigins() { return MOCK_ORIGINS; },
  async getSettings() { return MOCK_SETTINGS; },
  async createOrder(o) { return { ...o, id: Date.now().toString(), status: 'new', createdAt: Date.now() } as Order; },
  async getFeedbackTarget() { return null; },
  async submitFeedback() {},
  async login() {},
  async saveOrigins() {},
  async saveSettings() {},
  async listOrders() { return []; },
  async setOrderStatus() { return {}; },
  async setOrderOutcome() {},
  async listAudit() { return []; },
  async listSupplies() { return []; },
  async createSupply(s) { return { ...s, id: Date.now().toString() } as Supply; },
  async markReminded() {}
};
