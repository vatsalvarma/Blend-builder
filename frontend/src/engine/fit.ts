import type {  Machine, Grinder, ServeStyle, FitResult, RoastIdx, MachineId, GrinderId, AxisValue  } from './types';
import { MACHINES, GRINDERS } from './data';
import { delicacyOf } from './flavor';

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function kitCeiling(machineId: MachineId, grinderId: GrinderId): number {
  const m = MACHINES.find(x => x.id === machineId) || MACHINES[3];
  const g = GRINDERS.find(x => x.id === grinderId) || GRINDERS[2];
  const mStab = m.stability === 0 ? 3 : m.stability;
  return Math.min(mStab, g.clarity);
}

export function computeFit(
  style: ServeStyle,
  machineId: MachineId,
  grinderId: GrinderId,
  roastIdx: RoastIdx,
  robustaPct: number,
  flavorValues: AxisValue[]
): FitResult {
  let fit = 100;
  const notes: string[] = [];

  const getVal = (axis: string) => flavorValues.find(a => a.axis === axis)?.value || 0;
  const strong = getVal('Strong');
  const tangy = getVal('Tangy');
  const bitter = getVal('Bitter');
  const delicacy = delicacyOf(flavorValues);
  
  const ceil = kitCeiling(machineId, grinderId);

  if (style === 'kaapi') {
    if (roastIdx < 2) {
      fit -= 25;
      notes.push("Kaapi wants a dark roast so the decoction stands up to milk.");
    }
    if (strong < 6) {
      fit -= 20;
      notes.push("Needs more body, or it vanishes under hot milk.");
    }
  }

  if (style === 'espresso') {
    if (strong < 6) {
      fit -= 25;
      notes.push("Light for espresso. Add a Robusta or heavier bean.");
    }
    if (robustaPct === 0) {
      fit -= 15;
      notes.push("A little Robusta (10-20%) builds crema.");
    }
    if (robustaPct > 30) {
      fit -= 20;
      notes.push("Over 30% Robusta turns harsh. Classic Indian espresso is 70/30 to 80/20.");
    }
    if (roastIdx === 0) {
      fit -= 15;
      notes.push("Light roast tastes sour as espresso. Go medium or darker.");
    }
  }

  if (style === 'pourover') {
    if (tangy < 4) {
      fit -= 25;
      notes.push("Pour-over lives on brightness. This is flat.");
    }
    if (bitter > 4) {
      fit -= 25;
      notes.push("Too harsh for filter. Drop the Robusta or lighten the roast.");
    }
    if (roastIdx > 1) {
      fit -= 20;
      notes.push("Dark roast buries the clarity pour-over is for.");
    }
  }

  if (style === 'mixed') {
    if (strong < 4) {
      fit -= 15;
      notes.push("A bit light to cover espresso as well.");
    }
    if (bitter > 5) {
      fit -= 20;
      notes.push("Too harsh to work across both.");
    }
  }

  if (style === 'espresso' || style === 'mixed') {
    if (machineId === 'none') {
      fit -= 40;
      notes.push("This serve style needs an espresso machine.");
    }
    if (machineId === 'single') {
      notes.push("Single boiler can't brew and steam at once. Plan for the rush."); // note only
    }
    if (ceil <= 1 && delicacy > 5) {
      fit -= 20;
      notes.push("Your kit won't hold a delicate blend steady cup to cup. Pick a forgiving bean.");
    }
  }

  fit = clamp(fit, 0, 100);

  let label = "Wrong blend for this";
  if (fit >= 85) label = "Great fit";
  else if (fit >= 65) label = "Workable";
  else if (fit >= 40) label = "Poor fit";

  return { fit, label, notes };
}
