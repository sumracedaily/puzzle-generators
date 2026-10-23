import { rngForSeed, generatePyramid, generateKakuro } from '../src/index.js';

// Same seed → same puzzle, on any device.
const p1 = generatePyramid('medium', rngForSeed('2026-10-23'));
const p2 = generatePyramid('medium', rngForSeed('2026-10-23'));

console.log('pyramid rows:', p1.rows);
console.log('hidden cells:', [...p1.hidden]);
console.log('deterministic:', JSON.stringify(p1.rows) === JSON.stringify(p2.rows));

const k = generateKakuro('medium', rngForSeed('daily-set'));
console.log(`\nkakuro ${k.n}×${k.n} — ${k.entries.size} cells, ${Object.keys(k.clues).length} clues`);
