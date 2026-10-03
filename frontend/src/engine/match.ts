import type {  Origin, RoastIdx, ServeStyle, MachineId, GrinderId, Complaint, MatchResult, CurrentProfile, Ratios  } from './types';
import { computeFlavor, robustaPctOf } from './flavor';
import { computeFit } from './fit';
import { blendPricePerKg } from './money';

// ESTIMATE profiles post-roast
const CURRENT_PROFILES: Record<CurrentProfile, number[]> = {
  // Fruity, Flowery, Sweet, Nutty, Spicy, Tangy, Strong, Bitter, Roasted
  commodity_filter: [1, 0.5, 3.5, 7, 6, 1, 9, 6.5, 6.5],
  commodity_espresso: [2, 1, 4.5, 7.5, 6, 2, 8, 5, 4.2],
  light_arabica: [6, 5, 6, 3, 3, 7, 4, 1, 1],
};

const COMPLAINT_SHIFT: Record<Complaint, Partial<Record<keyof import('./types').Flavor, number>>> = {
  'too-bitter': { Bitter: -2, Roasted: -1.5 },
  'too-weak': { Strong: 2, Nutty: 1 },
  'too-sour': { Tangy: -2, Sweet: 1 },
  'flat': { Fruity: 1.5, Sweet: 1, Tangy: 1 },
  'burnt': { Roasted: -2.5, Bitter: -1 },
  'price-only': {}
};

const ROASTS_BY_STYLE: Record<ServeStyle, RoastIdx[]> = {
  kaapi: [2, 3],
  espresso: [1, 2, 3],
  pourover: [0, 1],
  mixed: [1, 2]
};

const AXIS_NAMES: (keyof import('./types').Flavor)[] = ['Fruity','Flowery','Sweet','Nutty','Spicy','Tangy','Strong','Bitter','Roasted'];

function clamp(v: number) { return Math.min(Math.max(v, 0), 10); }

export function matchCurrent(
  origins: Origin[],
  profileId: CurrentProfile,
  complaints: Complaint[],
  style: ServeStyle,
  machine: MachineId,
  grinder: GrinderId,
  currentPricePerKg?: number
): MatchResult[] {
  const baseProfile = CURRENT_PROFILES[profileId];
  if (!baseProfile) return [];

  // Build target profile
  const target = [...baseProfile];
  const weight = new Array(9).fill(1);

  for (const c of complaints) {
    const shift = COMPLAINT_SHIFT[c];
    for (const [axisStr, delta] of Object.entries(shift)) {
      const idx = AXIS_NAMES.indexOf(axisStr as any);
      if (idx !== -1) {
        target[idx] = clamp(target[idx] + delta);
        weight[idx] = 2; // complained axes get weight 2
      }
    }
  }

  const allowedRoasts = ROASTS_BY_STYLE[style];
  const inStock = origins.filter(o => o.inStock);
  const results: MatchResult[] = [];

  // Generate 1-2-3 combinations (simplified grid search)
  // For production, maybe run in Web Worker
  const combos: { ids: string[], ratios: Ratios }[] = [];
  
  // Single beans
  for (const o of inStock) {
    combos.push({ ids: [o.id], ratios: { [o.id]: 100 } });
  }
  
  // Pairs (10% steps)
  for (let i=0; i<inStock.length; i++) {
    for (let j=i+1; j<inStock.length; j++) {
      for (let pct = 10; pct <= 90; pct += 10) {
        combos.push({
          ids: [inStock[i].id, inStock[j].id],
          ratios: { [inStock[i].id]: pct, [inStock[j].id]: 100 - pct }
        });
      }
    }
  }
  
  // Check combos
  for (const combo of combos) {
    const rPct = robustaPctOf(origins, combo.ids, combo.ratios);
    if (rPct > 30) continue; // Skip heavy robusta in switch flow

    for (const roast of allowedRoasts) {
      const fv = computeFlavor(origins, combo.ids, combo.ratios, roast);
      const fit = computeFit(style, machine, grinder, roast, rPct, fv);
      if (fit.fit < 65) continue; // Must be workable

      // Distance calc
      let dist = 0;
      for (let i=0; i<9; i++) {
        const val = fv.find(a => a.axis === AXIS_NAMES[i])?.value || 0;
        dist += weight[i] * Math.pow(val - target[i], 2);
      }
      dist = Math.sqrt(dist);

      const price = blendPricePerKg(origins, combo.ratios);
      results.push({
        selectedIds: combo.ids,
        ratios: combo.ratios,
        roastIdx: roast,
        label: '',
        distance: dist,
        fit: fit.fit,
        pricePerKg: price
      });
    }
  }

  if (results.length === 0) return [];
  
  results.sort((a, b) => a.distance - b.distance);
  const closest = results[0];
  closest.label = "Closest match, complaint fixed";
  
  const bestValueDist = closest.distance * 1.15;
  const cheaper = results.find(r => r.distance <= bestValueDist && r.pricePerKg !== null && closest.pricePerKg !== null && r.pricePerKg < closest.pricePerKg);
  
  const finalRes = [];
  if (complaints.includes('price-only') && cheaper) {
    cheaper.label = "Best value, nearly as close";
    finalRes.push(cheaper);
    if (cheaper.selectedIds.join() !== closest.selectedIds.join()) {
      finalRes.push(closest);
    }
  } else {
    finalRes.push(closest);
    if (cheaper && cheaper.selectedIds.join() !== closest.selectedIds.join()) {
      cheaper.label = "Best value, nearly as close";
      finalRes.push(cheaper);
    }
  }

  return finalRes;
}
