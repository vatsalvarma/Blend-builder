export function reorderDates(
  kg: number,
  cupsPerDay: number,
  doseGrams: number,
  deliveredAt: number,
  roastedAt: number,
  leadDays: number,
  freshDays: number
) {
  if (cupsPerDay === 0 || doseGrams === 0) {
    return { runOutAt: Infinity, remindAt: Infinity, staleRisk: false };
  }
  
  const runOutAt = deliveredAt + (kg * 1000 / (cupsPerDay * doseGrams)) * 86400000;
  const remindAt = runOutAt - (leadDays * 86400000);
  const staleRisk = (runOutAt - roastedAt) > (freshDays * 86400000);
  
  return { runOutAt, remindAt, staleRisk };
}

export function kgForDays(cupsPerDay: number, doseGrams: number, days: number): number {
  return Math.ceil((cupsPerDay * doseGrams * days / 1000) * 2) / 2;
}
