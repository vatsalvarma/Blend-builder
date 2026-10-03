import type {  Axis, Flavor, Machine, Grinder, Origin, Settings  } from './types';

export const AXES: Axis[] = ['Fruity','Flowery','Sweet','Nutty','Spicy','Tangy','Strong','Bitter','Roasted'];
export const NEG_AXES: Axis[] = ['Bitter','Roasted'];
export const ROAST_LABELS = ['Light','Medium','Medium-dark','Dark'] as const;
export const MAX_ORIGINS = 4;

// What roasting does to each taste, index 0 (light) to 3 (dark)
export const ROAST_MULT: Record<Axis,[number,number,number,number]> = {
  Flowery:[1,0.85,0.7,0.55], Fruity:[1,0.88,0.76,0.6], Tangy:[1,0.85,0.68,0.5],
  Sweet:[1,1.15,1.02,0.8],  Nutty:[1,1.1,1.25,1.4],  Spicy:[1,1.1,1.25,1.45],
  Strong:[1,1.08,1.18,1.3], Bitter:[0.7,1,1.45,2.1], Roasted:[1,2.4,4.2,6.5],
};
export const MACHINES: Machine[] = [
  {id:'none',label:'No espresso machine',stability:0},{id:'single',label:'Single boiler',stability:1},
  {id:'hx',label:'Heat exchanger',stability:2},{id:'double',label:'Double / multi-boiler',stability:3}
];
export const GRINDERS: Grinder[] = [
  {id:'blade',label:'Blade grinder',clarity:1},{id:'entry',label:'Entry-level burr',clarity:2},
  {id:'commercial',label:'Commercial burr',clarity:3}
];

function f(Fruity:number, Flowery:number, Sweet:number, Nutty:number, Spicy:number, Tangy:number, Strong:number, Bitter:number): Flavor {
  return { Fruity, Flowery, Sweet, Nutty, Spicy, Tangy, Strong, Bitter, Roasted: 1 };
}

export const INITIAL_ORIGINS: Origin[] = [
  { id: 'chikmagalur_arabica', name: 'Chikmagalur Arabica', flag: 'IN', type: 'Arabica', color: '#A97142', tag: 'Mellow & spiced', flavor: f(3,2,5,6,6,3,6,2), pricePerKg: 0, inStock: true },
  { id: 'chikmagalur_robusta', name: 'Chikmagalur Robusta', flag: 'IN', type: 'Robusta', color: '#6B4A2B', tag: 'Earthy & full-bodied', flavor: f(1,1,3,7,4,2,9,6), pricePerKg: 0, inStock: true },
  { id: 'coorg_arabica', name: 'Coorg Arabica', flag: 'IN', type: 'Arabica', color: '#CC8B3C', tag: 'Sweet & fruity (honey-processed)', flavor: f(6,3,7,4,4,5,5,2), pricePerKg: 0, inStock: true },
  { id: 'coorg_robusta_aa', name: 'Coorg Robusta Cherry AA', flag: 'IN', type: 'Robusta', grade: 'Cherry AA', color: '#5A3B22', tag: 'Bold, natural-processed & heavy', flavor: f(2,1,4,7,4,3,9,5), pricePerKg: 0, inStock: true },
  { id: 'babaBudangiri', name: 'Baba Budangiri Arabica', flag: 'IN', type: 'Arabica', color: '#B97A4A', tag: 'Balanced & mild, India\'s original coffee hills', flavor: f(4,3,6,5,4,4,5,2), pricePerKg: 0, inStock: true },
  { id: 'kaapi', name: 'Robusta Kaapi Royale', flag: 'IN', type: 'Robusta', grade: 'Screen 17+', color: '#4B3621', tag: 'Clean, chocolatey & full-bodied, India\'s finest washed Robusta', flavor: f(2,1,5,7,6,2,8,3), pricePerKg: 0, inStock: true },
  { id: 'monsooned_malabar', name: 'Monsooned Malabar AA', flag: 'IN', type: 'Arabica', grade: 'AA', color: '#8A7A5C', tag: 'Mellow, musty & almost zero acidity', flavor: f(2,1,5,6,5,1,8,3), pricePerKg: 0, inStock: true },
  { id: 'mneb', name: 'Mysore Nuggets Extra Bold', flag: 'IN', type: 'Arabica', grade: 'Screen 19', color: '#9C6B3F', tag: 'Top washed Arabica, clean & sweet', flavor: f(4,3,7,5,5,5,6,2), pricePerKg: 0, inStock: true }, // ESTIMATE
  { id: 'araku', name: 'Araku Valley Arabica', flag: 'IN', type: 'Arabica', color: '#B5703A', tag: 'Tribal-grown, fruity & chocolatey', flavor: f(6,4,7,4,4,5,5,2), pricePerKg: 0, inStock: true }, // ESTIMATE
  { id: 'wayanad_robusta', name: 'Wayanad Robusta', flag: 'IN', type: 'Robusta', color: '#5E4028', tag: 'Heavy, earthy, espresso backbone', flavor: f(1,1,3,6,5,2,9,6), pricePerKg: 0, inStock: true }, // ESTIMATE
  { id: 'nilgiris', name: 'Nilgiris Arabica', flag: 'IN', type: 'Arabica', color: '#A8804F', tag: 'High-grown, bright & spiced', flavor: f(5,4,6,4,5,6,5,2), pricePerKg: 0, inStock: true }, // ESTIMATE
  { id: 'yirgacheffe', name: 'Ethiopia Yirgacheffe', flag: 'ET', type: 'Arabica', color: '#D9A441', tag: 'Bright, fruity & flowery', flavor: f(9,9,6,2,2,9,3,1), pricePerKg: 0, inStock: true },
  { id: 'huila', name: 'Colombia Huila', flag: 'CO', type: 'Arabica', color: '#C7893E', tag: 'Sweet & balanced', flavor: f(6,4,7,4,3,6,5,2), pricePerKg: 0, inStock: true },
  { id: 'cerrado', name: 'Brazil Cerrado', flag: 'BR', type: 'Arabica', color: '#8B5A2B', tag: 'Nutty & chocolatey', flavor: f(2,1,7,8,3,3,8,3), pricePerKg: 0, inStock: true },
  { id: 'nyeri', name: 'Kenya Nyeri', flag: 'KE', type: 'Arabica', color: '#C0504D', tag: 'Bold & berry-tangy', flavor: f(9,5,5,2,3,9,4,2), pricePerKg: 0, inStock: true },
  { id: 'antigua', name: 'Guatemala Antigua', flag: 'GT', type: 'Arabica', color: '#9E6B3A', tag: 'Rich, chocolatey & spiced', flavor: f(4,2,6,6,6,6,7,2), pricePerKg: 0, inStock: true },
  { id: 'yemen_mocha', name: 'Yemen Mocha', flag: 'YE', type: 'Arabica', color: '#7A4B3A', tag: 'Winey & spiced', flavor: f(7,3,5,3,8,6,7,2), pricePerKg: 0, inStock: true }
];

export const DEFAULT_SETTINGS: Settings = {
  showAI: true,
  showMenuFit: true,
  featuredBlendIds: [],
  roles: { 
    robustaSouth: 'kaapi', 
    robustaBudget: 'coorg_robusta_aa', 
    robustaDefault: 'wayanad_robusta',
    steadyArabica: 'chikmagalur_arabica', 
    steadyPremium: 'mneb',
    starPremium: 'yirgacheffe', 
    starAudiencePremium: 'araku', 
    starSouth: 'coorg_arabica', 
    starDefault: 'nyeri',
    forgivingStar: 'monsooned_malabar', 
    baseWest: 'antigua', 
    baseEast: 'babaBudangiri', 
    baseDefault: 'huila' 
  },
  doseGrams: { espresso: 18, pourover: 15, kaapi: 0, mixed: 18 },   // 0 = ask owner
  salesWhatsApp: '',                // admin must fill before launch
  sampleSizesGrams: [250, 500],      // PLACEHOLDER
  flightPackGrams: 100, 
  reorderLeadDays: 5, 
  freshDays: 28,   // PLACEHOLDERS
};
