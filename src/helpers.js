export const rand = (min, max, rng = Math.random) =>
  min + Math.floor(rng() * (max - min + 1));

export const pick = (arr, rng = Math.random) => arr[rand(0, arr.length - 1, rng)];

/* ---------- shared solvability ---------- */

// A hidden cell is derivable when some line containing it has exactly one
// unknown. Iterate to a fixpoint; if everything resolves, the hide set is fair.
export function isDetermined(allKeys, hiddenSet, lines) {
  const unknown = new Set(hiddenSet);
  let changed = true;
  while (changed && unknown.size) {
    changed = false;
    for (const line of lines) {
      const u = line.filter((k) => unknown.has(k));
      if (u.length === 1) {
        unknown.delete(u[0]);
        changed = true;
      }
    }
  }
  return unknown.size === 0;
}

export function pickHidden(allKeys, lines, count, rng) {
  const hidden = new Set();
  const order = [...allKeys];
  for (let i = order.length - 1; i > 0; i--) {
    const j = rand(0, i, rng);
    [order[i], order[j]] = [order[j], order[i]];
  }
  for (const k of order) {
    if (hidden.size >= count) break;
    hidden.add(k);
    if (!isDetermined(allKeys, hidden, lines)) hidden.delete(k);
  }
  return hidden;
}
