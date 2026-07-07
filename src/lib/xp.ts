// RPG leveling — habit чеклэх бүрт XP. Level exponential бус, зөөлөн муруй.
export const XP_PER_HABIT = 10;

// Level L-д хүрэхэд нийт хэрэгтэй XP: 50 * L^1.5
export function xpForLevel(level: number): number {
  return Math.floor(50 * Math.pow(level, 1.5));
}

export function levelFromXp(xp: number): {
  level: number; into: number; span: number; pct: number;
} {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const into = xp - base;
  const span = next - base;
  return { level, into, span, pct: span > 0 ? into / span : 0 };
}

export const RANKS = [
  { min: 1, name: "Sleeper" },
  { min: 5, name: "Grinder" },
  { min: 10, name: "Operator" },
  { min: 18, name: "Machine" },
  { min: 28, name: "Killah" },
  { min: 40, name: "Legend" },
];

export function rankFor(level: number): string {
  let r = RANKS[0].name;
  for (const x of RANKS) if (level >= x.min) r = x.name;
  return r;
}
