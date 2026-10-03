import type {  Origin, Ratios  } from './types';

export function blendPricePerKg(origins: Origin[], ratios: Ratios): number | null {
  let price = 0;
  for (const [id, pct] of Object.entries(ratios)) {
    const origin = origins.find(o => o.id === id);
    if (!origin || origin.pricePerKg <= 0) return null;
    price += origin.pricePerKg * (pct / 100);
  }
  return Math.round(price);
}

export function costPerCup(pricePerKg: number, doseGrams: number): number {
  return Number((pricePerKg * doseGrams / 1000).toFixed(2));
}

interface MonthlyArgs {
  pricePerKg: number;
  doseGrams: number;
  cupsPerDay: number;
  currentPricePerKg?: number | null;
  days?: number;
}

export function monthlyPicture({ pricePerKg, doseGrams, cupsPerDay, currentPricePerKg, days = 30 }: MonthlyArgs) {
  const kgPerMonth = Number(((cupsPerDay * doseGrams * days) / 1000).toFixed(1));
  const spend = Math.round(kgPerMonth * pricePerKg);
  let saving: number | null = null;
  
  if (currentPricePerKg && currentPricePerKg > 0) {
    saving = Math.round(kgPerMonth * (currentPricePerKg - pricePerKg));
  }
  
  return { kgPerMonth, spend, saving };
}
