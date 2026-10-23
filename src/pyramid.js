import { rand, pickHidden } from './helpers.js';

/* ---------- Number Pyramid ---------- */
// Each cell = sum of the two below it. Fill the hidden cells.

export function generatePyramid(difficulty, rng = Math.random) {
  const n = { easy: 3, medium: 4, hard: 5 }[difficulty];
  const maxBase = { easy: 9, medium: 12, hard: 9 }[difficulty];
  const hideCount = { easy: 3, medium: 5, hard: 8 }[difficulty];

  const bottom = Array.from({ length: n }, () => rand(1, maxBase, rng));
  const rows = [bottom];
  for (let r = 1; r < n; r++) {
    rows.push(
      Array.from({ length: n - r }, (_, i) => rows[r - 1][i] + rows[r - 1][i + 1])
    );
  }

  const allKeys = [];
  const lines = [];
  for (let r = 0; r < n; r++) {
    for (let i = 0; i < n - r; i++) allKeys.push(`${r}:${i}`);
  }
  for (let r = 1; r < n; r++) {
    for (let i = 0; i < n - r; i++) {
      lines.push([`${r}:${i}`, `${r - 1}:${i}`, `${r - 1}:${i + 1}`]);
    }
  }

  const hidden = pickHidden(allKeys, lines, hideCount, rng);
  return { rows, hidden: new Set(hidden), n };
}
