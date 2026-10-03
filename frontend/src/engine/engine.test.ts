import { describe, it, expect } from 'vitest';
import { INITIAL_ORIGINS, DEFAULT_SETTINGS } from './data';
import { computeFlavor } from './flavor';
import { computeScore, scoreVerdict } from './score';
import { computeFit } from './fit';
import { buildSuggestions } from './suggest';
import { makeFlight, pairsOf } from './flight';
import { kgForDays } from './reorder';
import { matchCurrent } from './match';
import { blendPricePerKg } from './money';
import type {  Answers  } from './types';

describe('Engine Tests', () => {
  it('1. Worked example: 70% chikmagalur_arabica, 30% kaapi, roast 2', () => {
    const ids = ['chikmagalur_arabica', 'kaapi'];
    const ratios = { 'chikmagalur_arabica': 70, 'kaapi': 30 };
    const flavor = computeFlavor(INITIAL_ORIGINS, ids, ratios, 2);
    
    // Check specific values
    const getVal = (axis: string) => flavor.find(a => a.axis === axis)?.value;
    expect(getVal('Fruity')).toBeCloseTo(2.1, 1);
    expect(getVal('Flowery')).toBeCloseTo(1.2, 1);
    expect(getVal('Sweet')).toBeCloseTo(5.1, 1);
    expect(getVal('Nutty')).toBeCloseTo(7.9, 1);
    expect(getVal('Spicy')).toBeCloseTo(7.5, 1);
    expect(getVal('Tangy')).toBeCloseTo(1.8, 1);
    expect(getVal('Strong')).toBeCloseTo(7.8, 1);
    expect(getVal('Bitter')).toBeCloseTo(3.3, 1);
    expect(getVal('Roasted')).toBeCloseTo(4.2, 1);
    
    const score = computeScore(flavor);
    expect(score).toBe(83);
    expect(scoreVerdict(score)).toBe("Solid, very drinkable.");
    
    const fitEspresso = computeFit('espresso', 'double', 'commercial', 2, 30, flavor);
    expect(fitEspresso.fit).toBe(100);
    
    const fitPourover = computeFit('pourover', 'double', 'commercial', 2, 30, flavor);
    expect(fitPourover.fit).toBe(55);
  });

  it('2. Suggestion engine constraints', () => {
    const answers: Answers = { audience: 'students', region: 'south', price: 'budget', style: 'espresso', machine: 'double', grinder: 'commercial' };
    const suggestions = buildSuggestions(answers, DEFAULT_SETTINGS.roles, INITIAL_ORIGINS);
    expect(suggestions).toHaveLength(3);
    for (const sug of suggestions) {
      const sum = Object.values(sug.ratios).reduce((a, b) => a + b, 0);
      expect(sum).toBe(100);
      expect(sug.selectedIds.length).toBeLessThanOrEqual(4);
      
      let rPct = 0;
      for (const id of sug.selectedIds) {
        const o = INITIAL_ORIGINS.find(x => x.id === id);
        if (o?.type === 'Robusta') rPct += sug.ratios[id];
      }
      expect(rPct).toBeLessThanOrEqual(30);
    }
  });

  it('4. Deleted role bean falls back safely', () => {
    // Hide 'kaapi' which is robustaSouth
    const modOrigins = INITIAL_ORIGINS.map(o => o.id === 'kaapi' ? { ...o, inStock: false } : o);
    const answers: Answers = { audience: 'students', region: 'south', price: 'budget', style: 'espresso', machine: 'double', grinder: 'commercial' };
    const suggestions = buildSuggestions(answers, DEFAULT_SETTINGS.roles, modOrigins);
    expect(suggestions).toHaveLength(3);
    for (const sug of suggestions) {
      expect(sug.selectedIds).not.toContain('kaapi');
    }
  });

  it('5. blendPricePerKg returns null when prices are 0', () => {
    const ids = ['chikmagalur_arabica', 'kaapi'];
    const ratios = { 'chikmagalur_arabica': 70, 'kaapi': 30 };
    expect(blendPricePerKg(INITIAL_ORIGINS, ratios)).toBeNull();
  });

  it('6. Empty stock returns []', () => {
    const modOrigins = INITIAL_ORIGINS.map(o => ({ ...o, inStock: false }));
    const answers: Answers = { audience: 'students', region: 'south', price: 'budget', style: 'espresso', machine: 'double', grinder: 'commercial' };
    const suggestions = buildSuggestions(answers, DEFAULT_SETTINGS.roles, modOrigins);
    expect(suggestions).toEqual([]);
  });

  it('7. Flight pairs generation', () => {
    const pairs = pairsOf(['B', 'A', 'C']);
    expect(pairs).toEqual([['B', 'A'], ['B', 'C'], ['A', 'C']]);
  });

  it('8. Reorder kgForDays calculation', () => {
    expect(kgForDays(150, 18, 7)).toBe(19);
  });

  it('9. Match current profile', () => {
    const matches = matchCurrent(INITIAL_ORIGINS, 'commodity_espresso', ['too-bitter'], 'espresso', 'double', 'commercial');
    expect(matches.length).toBeGreaterThan(0);
    const best = matches[0];
    const rPct = best.selectedIds.reduce((sum, id) => {
      const o = INITIAL_ORIGINS.find(x => x.id === id);
      return o?.type === 'Robusta' ? sum + best.ratios[id] : sum;
    }, 0);
    expect(rPct).toBeLessThanOrEqual(30);
  });
});
