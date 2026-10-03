import type {  Answers, Suggestion, Variant, Roles, ServeStyle, Origin, RoastIdx  } from './types';
import { kitCeiling } from './fit';
import { robustaPctOf } from './flavor';

const ROAST_BY_STYLE: Record<ServeStyle, RoastIdx> = { kaapi: 3, espresso: 2, pourover: 0, mixed: 1 };
const ROBUSTA_TIERS = [0, 10, 20, 30];

export function buildSuggestions(
  answers: Answers,
  roles: Roles,
  origins: Origin[]
): Suggestion[] {
  const inStock = origins.filter(o => o.inStock);
  if (inStock.length === 0) return []; // UI shows "Beans back soon."

  const getBean = (id: string, fbType: string) => {
    let b = inStock.find(x => x.id === id);
    if (b) return b;
    return inStock.find(x => x.type === fbType) || inStock[0];
  };

  const { audience, region, price, style, machine, grinder } = answers;
  
  const audienceVal = { students: 0, corporate: 1, families: 1, premium: -1 }[audience];
  const regionVal = { south: 1, north: 0, west: 0, east: -1 }[region];
  const priceVal = { budget: 1, mid: 0, premium: -1 }[price];
  const bold = audienceVal + regionVal + priceVal + (style === 'espresso' ? 1 : 0);

  const step = style === 'pourover' ? 0 : Math.min(Math.max(bold, 0), 3);
  const robustaPct = ROBUSTA_TIERS[step];

  let roastIdx = ROAST_BY_STYLE[style];
  if (style === 'pourover' && region === 'south') roastIdx = 1;
  if (style === 'espresso' && audience === 'premium') roastIdx = 1;
  if (bold > 3 && style !== 'pourover') roastIdx = Math.min(roastIdx + 1, 3) as RoastIdx;

  const forgiving = kitCeiling(machine, grinder) <= 1;
  if (forgiving && roastIdx === 0) roastIdx = 1;

  let robustaRole = roles.robustaDefault;
  if (region === 'south') robustaRole = roles.robustaSouth;
  else if (price === 'budget') robustaRole = roles.robustaBudget;

  let steadyRole = price === 'premium' ? roles.steadyPremium : roles.steadyArabica;
  
  let starId = roles.starDefault;
  if (price === 'premium') starId = roles.starPremium;
  else if (audience === 'premium') starId = roles.starAudiencePremium;
  else if (region === 'south') starId = roles.starSouth;
  
  const starRole = forgiving ? roles.forgivingStar : starId;
  
  let baseRole = roles.baseDefault;
  if (region === 'west') baseRole = roles.baseWest;
  if (region === 'east') baseRole = roles.baseEast;

  const robusta = getBean(robustaRole, 'Robusta');
  const steady = getBean(steadyRole, 'Arabica');
  const star = getBean(starRole, 'Arabica');
  const base = getBean(baseRole, 'Arabica');

  const adj = { south: 'South Indian', north: 'Northern', west: 'Western', east: 'Eastern Hills' }[region];
  const noun = { students: 'Campus Blend', corporate: 'Boardroom Blend', families: 'Family Table Blend', premium: 'Reserve' }[audience];
  const blendName = `${adj} ${noun}`;

  const makeRatios = (spec: [string, number][]) => {
    const merged: Record<string, number> = {};
    for (const [id, val] of spec) {
      if (val > 0) {
        merged[id] = (merged[id] || 0) + val;
      }
    }
    return merged;
  };

  const rSig = Math.max(0, robustaPct - 10);
  const sigRatios = makeRatios([
    [star.id, 60],
    [steady.id, 40 - rSig],
    [robusta.id, rSig]
  ]);

  const houseRatios = makeRatios([
    [base.id, 50],
    [steady.id, 50 - robustaPct],
    [robusta.id, robustaPct]
  ]);

  const rVal = style === 'pourover' ? 10 : 30;
  const valRatios = makeRatios([
    [steady.id, 100 - rVal],
    [robusta.id, rVal]
  ]);

  const whySig = "Most origin character. Costs more per kg.";
  const whyHouse = "The workhorse. Survives a rush and a new barista.";
  const whyVal = "Lowest cost per cup. Robusta at its safe ceiling for this drink.";

  const baseAdvs = [
    {
      south: "Built for a South Indian palate: body that stands up to milk, a decoction that doesn't wash out.",
      north: "Balanced, espresso-friendly profile for North India's cappuccino and latte culture.",
      west: "Rounded, chocolatey cup for the mixed filter-and-espresso crowd.",
      east: "A distinctive origin story customers in the East and Northeast can connect with."
    }[region],
    {
      students: "Bright notes and an approachable price for a younger, exploring crowd.",
      corporate: "Consistent, smooth cup that holds up in high-volume brewing.",
      families: "Comforting, nutty-sweet cup that's broadly likeable.",
      premium: "Distinctive origin character that justifies premium pricing."
    }[audience],
    {
      budget: "Robusta-leaning within safe limits: low cost per cup without harshness.",
      mid: "Balanced cost-to-character ratio across a varied menu.",
      premium: "Mostly Arabica with real story value: origin names worth printing on the menu."
    }[price],
    {
      kaapi: "Dark roast built so the decoction still tastes like coffee after hot milk and sugar.",
      espresso: "Robusta kept inside the 10-30% window that builds crema without harshness.",
      pourover: "Light roast and minimal Robusta: everything that protects clarity.",
      mixed: "Medium roast that performs as espresso or filter."
    }[style]
  ];
  if (forgiving) {
    baseAdvs.push("Forgiving, low-acid star bean so your kit holds it steady cup to cup.");
  }

  const out: Suggestion[] = [
    {
      variant: 'signature', variantName: 'The Signature', blendName,
      selectedIds: Object.keys(sigRatios), ratios: sigRatios, roastIdx,
      style, machine, grinder, why: whySig, advantages: baseAdvs
    },
    {
      variant: 'house', variantName: 'The House Blend', blendName,
      selectedIds: Object.keys(houseRatios), ratios: houseRatios, roastIdx,
      style, machine, grinder, why: whyHouse, advantages: baseAdvs
    },
    {
      variant: 'value', variantName: 'The Value Pick', blendName,
      selectedIds: Object.keys(valRatios), ratios: valRatios, roastIdx,
      style, machine, grinder, why: whyVal, advantages: baseAdvs
    }
  ];

  return out;
}
