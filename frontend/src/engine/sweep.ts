import { INITIAL_ORIGINS } from './data';
import { computeFlavor } from './flavor';
import { computeScore } from './score';

async function runSweep() {
  const inStock = INITIAL_ORIGINS.filter(o => o.inStock);
  const scores: Record<string, number> = {
    '<80': 0,
    '80-84': 0,
    '85-89': 0,
    '90+': 0
  };
  let total = 0;

  // Single beans
  for (const o of inStock) {
    for (let r = 0; r <= 3; r++) {
      const f = computeFlavor(inStock, [o.id], { [o.id]: 100 }, r as any);
      const score = computeScore(f);
      if (score < 80) scores['<80']++;
      else if (score < 85) scores['80-84']++;
      else if (score < 90) scores['85-89']++;
      else scores['90+']++;
      total++;
    }
  }

  // Pairs (10% steps)
  for (let i = 0; i < inStock.length; i++) {
    for (let j = i + 1; j < inStock.length; j++) {
      for (let pct = 10; pct <= 90; pct += 10) {
        for (let r = 0; r <= 3; r++) {
          const f = computeFlavor(inStock, [inStock[i].id, inStock[j].id], { [inStock[i].id]: pct, [inStock[j].id]: 100 - pct }, r as any);
          const score = computeScore(f);
          if (score < 80) scores['<80']++;
          else if (score < 85) scores['80-84']++;
          else if (score < 90) scores['85-89']++;
          else scores['90+']++;
          total++;
        }
      }
    }
  }

  // Trios (10% steps)
  for (let i = 0; i < inStock.length; i++) {
    for (let j = i + 1; j < inStock.length; j++) {
      for (let k = j + 1; k < inStock.length; k++) {
        for (let p1 = 10; p1 <= 80; p1 += 10) {
          for (let p2 = 10; p2 <= 100 - p1 - 10; p2 += 10) {
            const p3 = 100 - p1 - p2;
            for (let r = 0; r <= 3; r++) {
              const f = computeFlavor(
                inStock, 
                [inStock[i].id, inStock[j].id, inStock[k].id], 
                { [inStock[i].id]: p1, [inStock[j].id]: p2, [inStock[k].id]: p3 }, 
                r as any
              );
              const score = computeScore(f);
              if (score < 80) scores['<80']++;
              else if (score < 85) scores['80-84']++;
              else if (score < 90) scores['85-89']++;
              else scores['90+']++;
              total++;
            }
          }
        }
      }
    }
  }

  console.log(`Total blends evaluated: ${total}`);
  console.log('Score distribution:');
  for (const [band, count] of Object.entries(scores)) {
    const pct = ((count / total) * 100).toFixed(2);
    console.log(`${band}: ${pct}% (${count})`);
  }

  const pass = scores['<80'] > 0 && scores['80-84'] > 0 && scores['85-89'] > 0 && scores['90+'] > 0;
  if (!pass) {
    console.error('Sweep failed: all four bands must be > 0%');
    process.exit(1);
  } else {
    console.log('Sweep passed.');
  }
}

runSweep();
