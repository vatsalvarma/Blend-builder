import type {  FlightCode, FlightItem, Suggestion, FeedbackVerdict  } from './types';

export function makeFlight(options: Suggestion[], rand = Math.random): FlightItem[] {
  const shuffled = [...options].sort(() => 0.5 - rand());
  const codes: FlightCode[] = ['A', 'B', 'C'];
  
  return shuffled.slice(0, 3).map((opt, i) => ({
    ...opt,
    code: codes[i],
    blendName: `${opt.blendName} (${opt.variantName})`,
    variant: opt.variant
  }));
}

export function winnerOf(flight: FlightItem[], rank?: FlightCode[]): FlightItem | undefined {
  if (!rank || rank.length === 0) return undefined;
  const bestCode = rank[0];
  return flight.find(f => f.code === bestCode);
}

export function pairsOf(rank: FlightCode[]): [FlightCode, FlightCode][] {
  const pairs: [FlightCode, FlightCode][] = [];
  for (let i = 0; i < rank.length; i++) {
    for (let j = i + 1; j < rank.length; j++) {
      pairs.push([rank[i], rank[j]]);
    }
  }
  return pairs; // all (better, worse) pairs
}

export function agreement(pairs: [FlightCode, FlightCode][], scoreFn: (c: FlightCode) => number): number {
  if (pairs.length === 0) return NaN;
  let matches = 0;
  for (const [better, worse] of pairs) {
    if (scoreFn(better) > scoreFn(worse)) {
      matches++;
    } else if (scoreFn(better) === scoreFn(worse)) {
      matches += 0.5; // tie in engine counts as half match
    }
  }
  return matches / pairs.length;
}
