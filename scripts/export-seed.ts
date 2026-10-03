import * as fs from 'fs';
import * as path from 'path';

// Note: since this script is executed outside the typical Vite build,
// you might need to adapt the imports if they depend on React/Vite.
// For now, we mock the output based on the required schema.

const origins = [
  { id: 'chikmagalur_arabica', name: 'Chikmagalur Arabica', flag: 'IN', tag: 'Mellow & spiced', type: 'Arabica', color: '#A97142', flavor: { Fruity: 3, Flowery: 2, Sweet: 5, Nutty: 6, Spicy: 6, Tangy: 3, Strong: 6, Bitter: 2, Roasted: 1 }, pricePerKg: 650, inStock: true },
  { id: 'chikmagalur_robusta', name: 'Chikmagalur Robusta', flag: 'IN', tag: 'Earthy & full-bodied', type: 'Robusta', color: '#6B4A2B', flavor: { Fruity: 1, Flowery: 1, Sweet: 3, Nutty: 7, Spicy: 4, Tangy: 2, Strong: 9, Bitter: 6, Roasted: 1 }, pricePerKg: 450, inStock: true },
  { id: 'coorg_arabica', name: 'Coorg Arabica', flag: 'IN', tag: 'Sweet & fruity (honey-processed)', type: 'Arabica', color: '#CC8B3C', flavor: { Fruity: 6, Flowery: 3, Sweet: 7, Nutty: 4, Spicy: 4, Tangy: 5, Strong: 5, Bitter: 2, Roasted: 1 }, pricePerKg: 750, inStock: true },
  { id: 'coorg_robusta_aa', name: 'Coorg Robusta Cherry AA', flag: 'IN', tag: 'Bold, natural-processed & heavy', type: 'Robusta', grade: 'Cherry AA', color: '#5A3B22', flavor: { Fruity: 2, Flowery: 1, Sweet: 4, Nutty: 7, Spicy: 4, Tangy: 3, Strong: 9, Bitter: 5, Roasted: 1 }, pricePerKg: 500, inStock: true },
  { id: 'babaBudangiri', name: 'Baba Budangiri Arabica', flag: 'IN', tag: 'Balanced & mild, India\'s original coffee hills', type: 'Arabica', color: '#B97A4A', flavor: { Fruity: 4, Flowery: 3, Sweet: 6, Nutty: 5, Spicy: 4, Tangy: 4, Strong: 5, Bitter: 2, Roasted: 1 }, pricePerKg: 700, inStock: true },
  { id: 'kaapi', name: 'Robusta Kaapi Royale', flag: 'IN', tag: 'Clean, chocolatey & full-bodied, India\'s finest washed Robusta', type: 'Robusta', grade: 'Screen 17+', color: '#4B3621', flavor: { Fruity: 2, Flowery: 1, Sweet: 5, Nutty: 7, Spicy: 6, Tangy: 2, Strong: 8, Bitter: 3, Roasted: 1 }, pricePerKg: 550, inStock: true },
  { id: 'monsooned_malabar', name: 'Monsooned Malabar AA', flag: 'IN', tag: 'Mellow, musty & almost zero acidity', type: 'Arabica', grade: 'AA', color: '#8A7A5C', flavor: { Fruity: 2, Flowery: 1, Sweet: 5, Nutty: 6, Spicy: 5, Tangy: 1, Strong: 8, Bitter: 3, Roasted: 1 }, pricePerKg: 850, inStock: true },
  { id: 'mneb', name: 'Mysore Nuggets Extra Bold', flag: 'IN', tag: 'Top washed Arabica, clean & sweet', type: 'Arabica', grade: 'Screen 19', color: '#9C6B3F', flavor: { Fruity: 4, Flowery: 3, Sweet: 7, Nutty: 5, Spicy: 5, Tangy: 5, Strong: 6, Bitter: 2, Roasted: 1 }, pricePerKg: 950, inStock: true },
  { id: 'araku', name: 'Araku Valley Arabica', flag: 'IN', tag: 'Tribal-grown, fruity & chocolatey', type: 'Arabica', color: '#B5703A', flavor: { Fruity: 6, Flowery: 4, Sweet: 7, Nutty: 4, Spicy: 4, Tangy: 5, Strong: 5, Bitter: 2, Roasted: 1 }, pricePerKg: 1200, inStock: true },
  { id: 'wayanad_robusta', name: 'Wayanad Robusta', flag: 'IN', tag: 'Heavy, earthy, espresso backbone', type: 'Robusta', color: '#5E4028', flavor: { Fruity: 1, Flowery: 1, Sweet: 3, Nutty: 6, Spicy: 5, Tangy: 2, Strong: 9, Bitter: 6, Roasted: 1 }, pricePerKg: 400, inStock: true },
  { id: 'nilgiris', name: 'Nilgiris Arabica', flag: 'IN', tag: 'High-grown, bright & spiced', type: 'Arabica', color: '#A8804F', flavor: { Fruity: 5, Flowery: 4, Sweet: 6, Nutty: 4, Spicy: 5, Tangy: 6, Strong: 5, Bitter: 2, Roasted: 1 }, pricePerKg: 800, inStock: true },
  { id: 'yirgacheffe', name: 'Ethiopia Yirgacheffe', flag: 'ET', tag: 'Bright, fruity & flowery', type: 'Arabica', color: '#D9A441', flavor: { Fruity: 9, Flowery: 9, Sweet: 6, Nutty: 2, Spicy: 2, Tangy: 9, Strong: 3, Bitter: 1, Roasted: 1 }, pricePerKg: 1400, inStock: true },
  { id: 'huila', name: 'Colombia Huila', flag: 'CO', tag: 'Sweet & balanced', type: 'Arabica', color: '#C7893E', flavor: { Fruity: 6, Flowery: 4, Sweet: 7, Nutty: 4, Spicy: 3, Tangy: 6, Strong: 5, Bitter: 2, Roasted: 1 }, pricePerKg: 1100, inStock: true },
  { id: 'cerrado', name: 'Brazil Cerrado', flag: 'BR', tag: 'Nutty & chocolatey', type: 'Arabica', color: '#8B5A2B', flavor: { Fruity: 2, Flowery: 1, Sweet: 7, Nutty: 8, Spicy: 3, Tangy: 3, Strong: 8, Bitter: 3, Roasted: 1 }, pricePerKg: 900, inStock: true },
  { id: 'nyeri', name: 'Kenya Nyeri', flag: 'KE', tag: 'Bold & berry-tangy', type: 'Arabica', color: '#C0504D', flavor: { Fruity: 9, Flowery: 5, Sweet: 5, Nutty: 2, Spicy: 3, Tangy: 9, Strong: 4, Bitter: 2, Roasted: 1 }, pricePerKg: 1500, inStock: true },
  { id: 'antigua', name: 'Guatemala Antigua', flag: 'GT', tag: 'Rich, chocolatey & spiced', type: 'Arabica', color: '#9E6B3A', flavor: { Fruity: 4, Flowery: 2, Sweet: 6, Nutty: 6, Spicy: 6, Tangy: 6, Strong: 7, Bitter: 2, Roasted: 1 }, pricePerKg: 1100, inStock: true },
  { id: 'yemen_mocha', name: 'Yemen Mocha', flag: 'YE', tag: 'Winey & spiced', type: 'Arabica', color: '#7A4B3A', flavor: { Fruity: 7, Flowery: 3, Sweet: 5, Nutty: 3, Spicy: 8, Tangy: 6, Strong: 7, Bitter: 2, Roasted: 1 }, pricePerKg: 2000, inStock: true }
];

const settings = {
  showAI: true,
  showMenuFit: true,
  featuredBlendIds: [],
  roles: { robustaSouth: 'kaapi', robustaBudget: 'coorg_robusta_aa', robustaDefault: 'wayanad_robusta', steadyArabica: 'chikmagalur_arabica', steadyPremium: 'mneb', starPremium: 'yirgacheffe', starAudiencePremium: 'araku', starSouth: 'coorg_arabica', starDefault: 'nyeri', forgivingStar: 'monsooned_malabar', baseWest: 'antigua', baseEast: 'babaBudangiri', baseDefault: 'huila' },
  doseGrams: { espresso: 18, pourover: 15, kaapi: 0, mixed: 18 },
  salesWhatsApp: '',
  sampleSizesGrams: [250, 500],
  flightPackGrams: 100,
  reorderLeadDays: 5,
  freshDays: 28
};

const seedDir = path.join(__dirname, '..', 'backend', 'src', 'main', 'resources', 'seed');
if (!fs.existsSync(seedDir)) {
  fs.mkdirSync(seedDir, { recursive: true });
}

fs.writeFileSync(path.join(seedDir, 'origins.json'), JSON.stringify(origins, null, 2));
fs.writeFileSync(path.join(seedDir, 'settings.json'), JSON.stringify(settings, null, 2));

console.log('Seed files exported to backend/src/main/resources/seed');
