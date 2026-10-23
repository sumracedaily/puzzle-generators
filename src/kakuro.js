import { rand } from './helpers.js';

/* ---------- Kakuro ---------- */
// A valid digit fill is generated first, so a solution always exists.
// Check is rule-based (sums + no repeats per run), so alternates count.
export function generateKakuro(difficulty, rng = Math.random) {
  const n = { easy: 5, medium: 6, hard: 7 }[difficulty];

  const buildMask = () => {
    const white = Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => r > 0 && c > 0 && false)
    );
    for (let r = 1; r < n; r++) {
      let c = 1;
      while (c < n) {
        const room = n - c;
        if (room < 2 || rng() < 0.22) { c++; continue; }
        const len = rand(2, Math.min(4, room), rng);
        for (let k = 0; k < len; k++) white[r][c + k] = true;
        c += len + 1;
      }
    }
    return white;
  };

  const runsOf = (white) => {
    const runs = [];
    for (let r = 1; r < n; r++) {
      for (let c = 1; c < n; c++) {
        if (white[r][c] && !white[r][c - 1]) {
          const cells = [];
          while (c + cells.length < n && white[r][c + cells.length])
            cells.push(`${r}:${c + cells.length}`);
          if (cells.length >= 2) runs.push({ dir: 'a', cells, clueAt: `${r}:${c - 1}` });
        }
      }
    }
    for (let c = 1; c < n; c++) {
      for (let r = 1; r < n; r++) {
        if (white[r][c] && !white[r - 1][c]) {
          const cells = [];
          while (r + cells.length < n && white[r + cells.length][c])
            cells.push(`${r + cells.length}:${c}`);
          if (cells.length >= 2) runs.push({ dir: 'd', cells, clueAt: `${r - 1}:${c}` });
        }
      }
    }
    return runs;
  };

  for (let attempt = 0; attempt < 300; attempt++) {
    const white = buildMask();
    const runs = runsOf(white);
    // every white cell must belong to both an across and a down run
    const inA = new Set(), inD = new Set();
    runs.forEach((run) => run.cells.forEach((k) => (run.dir === 'a' ? inA : inD).add(k)));
    let ok = true;
    for (let r = 1; r < n && ok; r++)
      for (let c = 1; c < n && ok; c++)
        if (white[r][c] && !(inA.has(`${r}:${c}`) && inD.has(`${r}:${c}`))) ok = false;
    if (!ok || runs.length < n) continue;

    // backtracking fill: no repeated digit within any run
    const cellRuns = {};
    runs.forEach((run, i) =>
      run.cells.forEach((k) => (cellRuns[k] = [...(cellRuns[k] || []), i]))
    );
    const cells = Object.keys(cellRuns);
    const used = runs.map(() => new Set());
    const assign = {};
    const order = cells.slice().sort(
      (a, b) => cellRuns[b].length - cellRuns[a].length
    );
    const solve = (idx) => {
      if (idx === order.length) return true;
      const k = order[idx];
      const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => rng() - 0.5);
      for (const d of digits) {
        if (cellRuns[k].every((ri) => !used[ri].has(d))) {
          assign[k] = d;
          cellRuns[k].forEach((ri) => used[ri].add(d));
          if (solve(idx + 1)) return true;
          cellRuns[k].forEach((ri) => used[ri].delete(d));
          delete assign[k];
        }
      }
      return false;
    };
    if (!solve(0)) continue;

    const clues = {};
    runs.forEach((run) => {
      const sum = run.cells.reduce((s, k) => s + assign[k], 0);
      clues[run.clueAt] = { ...(clues[run.clueAt] || {}), [run.dir]: sum };
    });
    return { n, entries: new Set(cells), clues };
  }
  return null;
}
