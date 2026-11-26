import { getLesson } from '@/lib/learn';
import { lessonHasExercises } from '@/lib/learnExerciseGen';
import { todayIso } from '@/lib/habit';
import type { LearnLesson } from '@/types/learn';

/**
 * Daily rotation prefers lessons with procedural generators (fresh graphs/arrays).
 * Stable sorted list so a given date always maps to the same algorithm.
 */
const GENERATIVE_DAILY = [
  'bfs',
  'dfs',
  'dijkstra',
  'topo-sort',
  'binary-search',
  'lower-bound',
  'upper-bound',
  'prefix-sums',
  'knapsack',
  'two-pointers',
  'lis',
  'coordinate-compression',
  'dsu',
  'sieve',
  'ternary-search',
  'stack-ds',
  'queue-ds',
  'game-theory',
  'meet-in-middle',
  'hash-map',
] as const;

/** Lessons eligible for the daily algorithm puzzle. */
export function dailyAlgorithmPool(): string[] {
  const generative = GENERATIVE_DAILY.filter(lessonHasExercises);
  return generative.length ? [...generative] : GENERATIVE_DAILY.filter(() => true);
}
/** FNV-1a style hash → uint32. */
export function hashIso(iso: string): number {
  let h = 2166136261;
  for (let i = 0; i < iso.length; i++) {
    h ^= iso.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function lessonIdForDate(iso: string): string {
  const pool = dailyAlgorithmPool();
  if (!pool.length) return 'bfs';
  return pool[hashIso(iso) % pool.length]!;
}

export function seedForDate(iso: string): number {
  return hashIso(`daily-algo:${iso}`);
}

export function lessonForDate(iso: string): LearnLesson | undefined {
  return getLesson(lessonIdForDate(iso));
}

export function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1);
}

export function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDaysIso(iso: string, delta: number): string {
  const d = parseIso(iso);
  d.setDate(d.getDate() + delta);
  return toIso(d);
}

export function isFutureDate(iso: string, today = todayIso()): boolean {
  return iso > today;
}

export function isToday(iso: string, today = todayIso()): boolean {
  return iso === today;
}

/** Consecutive completed days ending at `today` (0 if today not done). */
export function dailyAlgoStreak(completed: Set<string>, today = todayIso()): number {
  let streak = 0;
  let cursor = today;
  // If today isn't cleared, streak is consecutive days ending yesterday.
  if (!completed.has(today)) {
    cursor = addDaysIso(today, -1);
  }
  while (completed.has(cursor)) {
    streak += 1;
    cursor = addDaysIso(cursor, -1);
  }
  return streak;
}

export function monthMatrix(year: number, monthIndex: number): (string | null)[][] {
  // monthIndex 0-based. Weeks start on Sunday (Duolingo-style).
  const first = new Date(year, monthIndex, 1);
  const startPad = first.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(toIso(new Date(year, monthIndex, d)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

export const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

export function monthTitle(year: number, monthIndex: number): string {
  return new Date(year, monthIndex, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}
