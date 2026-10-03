import type {  AxisValue  } from './types';

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function computeScore(flavorValues: AxisValue[]): number {
  if (flavorValues.length === 0) return 0;
  
  const posAxes = flavorValues.filter(a => a.axis !== 'Bitter' && a.axis !== 'Roasted').map(a => a.value);
  if (posAxes.length === 0) return 0;

  const sum = posAxes.reduce((a, b) => a + b, 0);
  const avg = sum / posAxes.length;
  
  const variance = posAxes.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / posAxes.length;
  const sd = Math.sqrt(variance);
  
  const harmony = 10 - 2.5 * Math.abs(sd - 2);
  
  const getVal = (axis: string) => flavorValues.find(a => a.axis === axis)?.value || 0;
  
  const sweet = getVal('Sweet');
  const bitter = getVal('Bitter');
  const roasted = getVal('Roasted');
  const maxPos = Math.max(...posAxes);
  
  const S = 70 + (2 * avg) + (0.7 * sweet) + (0.6 * maxPos) + (0.6 * harmony) - (2.4 * bitter) - (0.3 * roasted);
  
  return Math.round(clamp(S, 70, 96));
}

export function scoreVerdict(score: number): string {
  if (score >= 90) return "Outstanding: rare clarity and balance.";
  if (score >= 85) return "Excellent: clean and distinctive.";
  if (score >= 80) return "Solid, very drinkable.";
  return "Bold and roast-forward: low on origin clarity.";
}
