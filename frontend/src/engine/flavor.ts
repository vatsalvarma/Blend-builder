import type {  Origin, Ratios, RoastIdx, AxisValue, Axis, Flavor  } from './types';
import { AXES, ROAST_MULT } from './data';

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function computeFlavor(
  origins: Origin[],
  selectedIds: string[],
  ratios: Ratios,
  roastIdx: RoastIdx
): AxisValue[] {
  return AXES.map((axis: Axis) => {
    let sum = 0;
    for (const id of selectedIds) {
      const origin = origins.find(o => o.id === id);
      if (origin) {
        const pct = ratios[id] || 0;
        sum += origin.flavor[axis] * (pct / 100);
      }
    }
    const multiplied = sum * ROAST_MULT[axis][roastIdx];
    const val = clamp(multiplied, 0, 10);
    return { axis, value: Math.round(val * 10) / 10 };
  });
}

export function robustaPctOf(origins: Origin[], ids: string[], ratios: Ratios): number {
  let pct = 0;
  for (const id of ids) {
    const origin = origins.find(o => o.id === id);
    if (origin && origin.type === 'Robusta') {
      pct += ratios[id] || 0;
    }
  }
  return pct;
}

export function delicacyOf(f: Flavor | AxisValue[]): number {
  const getVal = (axis: Axis) => {
    if (Array.isArray(f)) {
      return f.find(a => a.axis === axis)?.value || 0;
    }
    return f[axis] || 0;
  };
  const flowery = getVal('Flowery');
  const fruity = getVal('Fruity');
  const tangy = getVal('Tangy');
  return (flowery + fruity + tangy) / 3;
}
