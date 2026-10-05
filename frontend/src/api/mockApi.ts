import type { Origin, Settings, Order, Supply, AuditEntry, FlightCode } from '../engine/types';
import type { Api } from './api';

const MOCK_ORIGINS: Origin[] = [
  {"id":"chikmagalur_arabica","name":"Chikmagalur Arabica","flag":"IN","type":"Arabica","color":"#A97142","tag":"Mellow & spiced","flavor":{"Nutty": 6, "Spicy": 6, "Sweet": 5, "Tangy": 3, "Bitter": 2, "Fruity": 3, "Strong": 6, "Flowery": 2, "Roasted": 1},"pricePerKg":650,"inStock":true},
  {"id":"coorg_arabica","name":"Coorg Arabica","flag":"IN","type":"Arabica","color":"#CC8B3C","tag":"Sweet & fruity (honey-processed)","flavor":{"Nutty": 4, "Spicy": 4, "Sweet": 7, "Tangy": 5, "Bitter": 2, "Fruity": 6, "Strong": 5, "Flowery": 3, "Roasted": 1},"pricePerKg":750,"inStock":true},
  {"id":"extra1","name":"Monkey Parchment","flag":"IN","type":"Arabica","color":"#D9A441","tag":"Specialty process","flavor":{"Nutty": 4, "Spicy": 2, "Sweet": 6, "Tangy": 4, "Bitter": 2, "Fruity": 5, "Strong": 4, "Flowery": 3, "Roasted": 1},"pricePerKg":1100,"inStock":true},
  {"id":"extra10","name":"Robusta Cherry PB","flag":"IN","type":"Robusta","color":"#6B4A2B","tag":"Natural / peaberry","flavor":{"Nutty": 5, "Spicy": 3, "Sweet": 4, "Tangy": 2, "Bitter": 3, "Fruity": 3, "Strong": 7, "Flowery": 1, "Roasted": 2},"pricePerKg":420,"inStock":true},
  {"id":"extra2","name":"Monsooned Malabar Robusta","flag":"IN","type":"Robusta","color":"#8A7A5C","tag":"Monsooned","flavor":{"Nutty": 7, "Spicy": 6, "Sweet": 4, "Tangy": 1, "Bitter": 3, "Fruity": 2, "Strong": 7, "Flowery": 1, "Roasted": 2},"pricePerKg":600,"inStock":true},
  {"id":"extra3","name":"Arabica Plantation AA","flag":"IN","type":"Arabica","color":"#9C6B3F","tag":"Washed / grade","flavor":{"Nutty": 5, "Spicy": 5, "Sweet": 5, "Tangy": 3, "Bitter": 2, "Fruity": 3, "Strong": 5, "Flowery": 2, "Roasted": 1},"pricePerKg":700,"inStock":true},
  {"id":"extra4","name":"Arabica Plantation A","flag":"IN","type":"Arabica","color":"#A97142","tag":"Washed / grade","flavor":{"Nutty": 5, "Spicy": 5, "Sweet": 5, "Tangy": 3, "Bitter": 2, "Fruity": 3, "Strong": 5, "Flowery": 2, "Roasted": 1},"pricePerKg":650,"inStock":true},
  {"id":"extra5","name":"Arabica Plantation PB","flag":"IN","type":"Arabica","color":"#CC8B3C","tag":"Washed / peaberry","flavor":{"Nutty": 5, "Spicy": 4, "Sweet": 6, "Tangy": 4, "Bitter": 2, "Fruity": 4, "Strong": 5, "Flowery": 2, "Roasted": 1},"pricePerKg":720,"inStock":true},
  {"id":"extra6","name":"Arabica Cherry AB","flag":"IN","type":"Arabica","color":"#B97A4A","tag":"Natural / grade","flavor":{"Nutty": 4, "Spicy": 3, "Sweet": 5, "Tangy": 3, "Bitter": 2, "Fruity": 5, "Strong": 5, "Flowery": 2, "Roasted": 1},"pricePerKg":600,"inStock":true},
  {"id":"extra7","name":"Robusta Parchment AB","flag":"IN","type":"Robusta","color":"#5A3B22","tag":"Washed / grade","flavor":{"Nutty": 6, "Spicy": 4, "Sweet": 3, "Tangy": 2, "Bitter": 4, "Fruity": 2, "Strong": 6, "Flowery": 1, "Roasted": 2},"pricePerKg":450,"inStock":true},
  {"id":"extra8","name":"Robusta Parchment PB","flag":"IN","type":"Robusta","color":"#4B3621","tag":"Washed / peaberry","flavor":{"Nutty": 6, "Spicy": 4, "Sweet": 4, "Tangy": 2, "Bitter": 3, "Fruity": 2, "Strong": 6, "Flowery": 1, "Roasted": 2},"pricePerKg":480,"inStock":true},
  {"id":"extra9","name":"Robusta Cherry AB","flag":"IN","type":"Robusta","color":"#5E4028","tag":"Natural / grade","flavor":{"Nutty": 5, "Spicy": 3, "Sweet": 3, "Tangy": 2, "Bitter": 4, "Fruity": 3, "Strong": 7, "Flowery": 1, "Roasted": 2},"pricePerKg":400,"inStock":true},
  {"id":"kaapi","name":"Robusta Kaapi Royale","flag":"IN","type":"Robusta","color":"#4B3621","tag":"Clean, chocolatey & full-bodied, India's finest washed Robusta","flavor":{"Nutty": 7, "Spicy": 6, "Sweet": 5, "Tangy": 2, "Bitter": 3, "Fruity": 2, "Strong": 8, "Flowery": 1, "Roasted": 1},"pricePerKg":550,"inStock":true},
  {"id":"yirgacheffe","name":"Ethiopia Yirgacheffe","flag":"ET","type":"Arabica","color":"#D9A441","tag":"Bright, fruity & flowery","flavor":{"Nutty": 2, "Spicy": 2, "Sweet": 6, "Tangy": 9, "Bitter": 1, "Fruity": 9, "Strong": 3, "Flowery": 9, "Roasted": 1},"pricePerKg":1400,"inStock":true}
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
  async createOrder(o: any) { return { ...o, id: Date.now().toString(), status: 'new', createdAt: Date.now() } as Order; },
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
  async createSupply(s: any) { return { ...s, id: Date.now().toString() } as Supply; },
  async markReminded() {}
};
