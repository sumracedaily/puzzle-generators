# Σ puzzle-generators

The seeded puzzle engines behind [sumrace.com](https://sumrace.com) — deterministic boards from a string seed. Same seed, same puzzle, on any device — that's how the Daily Set gives everyone the same board.

```js
import { rngForSeed, generatePyramid, generateKakuro } from '@sumracedaily/puzzle-generators';

const rng = rngForSeed('2026-10-23');      // a date, a user id, a race code…
const pyramid = generatePyramid('medium', rng);
const kakuro = generateKakuro('hard', rngForSeed('another-seed'));
```

## Generators

| export | puzzle | notes |
|---|---|---|
| `generatePyramid(difficulty, rng)` | Number Pyramid | each cell = sum of the two below; hidden cells are picked so every blank stays derivable |
| `generateKakuro(difficulty, rng)` | Kakuro | generates a valid backtracking fill first — a solution always exists; clues are the run sums |
| `rngForSeed(seed)` / `mulberry32` / `hashStr` | — | string-seeded PRNG used by everything |

`difficulty` is `'easy' | 'medium' | 'hard'`. `rng` defaults to `Math.random` if you don't need determinism.

## Try it

```bash
npm run demo
```

## How the seeds work

`rngForSeed(seed)` = `mulberry32(hashStr(seed))` — hash the string, feed the PRNG, pass the resulting function to any generator. Every `rng()` call consumes the stream in order, so identical seeds produce byte-identical boards.

## License

MIT — take it, build on it, credit appreciated.

---

play → [sumrace.com](https://sumrace.com) · wear → [shop.sumrace.com](https://shop.sumrace.com)
