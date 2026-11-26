import { LESSONS } from '@/data/learn/lessons';
import { TAG_CATALOG } from '@/constants/tags';
import type { LearnLesson } from '@/types/learn';
import type { ProblemWithApproaches } from '@/types/database';
import { todayIso } from '@/lib/habit';

export function listLessons(): LearnLesson[] {
  return LESSONS;
}

export function getLesson(id: string): LearnLesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

function algorithmAliases(tagLabel: string): string[] {
  const entry = TAG_CATALOG.find((t) => t.kind === 'algorithm' && t.label === tagLabel);
  const aliases = entry?.aliases ?? [];
  return [tagLabel, ...aliases].map((s) => s.toLowerCase());
}

function problemMatchesAlgorithm(p: ProblemWithApproaches, tagLabel: string): boolean {
  const keys = new Set(algorithmAliases(tagLabel));
  return p.approaches.some((a) =>
    (a.algorithms ?? []).some((alg) => keys.has(String(alg).toLowerCase())),
  );
}

/** Simple seeded RNG (mulberry32). */
function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffleInPlace<T>(arr: T[], rand: () => number): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Up to `limit` easier catalog problems for a lesson.
 * Picks randomly among the easiest pool; stable for `dayKey` (default today).
 */
export function pickPracticeProblems(
  lesson: LearnLesson,
  catalog: ProblemWithApproaches[],
  opts?: { limit?: number; dayKey?: string },
): ProblemWithApproaches[] {
  const limit = opts?.limit ?? 3;
  const dayKey = opts?.dayKey ?? todayIso();

  if (lesson.practiceProblemIds?.length) {
    const byId = new Map(catalog.map((p) => [p.id, p]));
    return lesson.practiceProblemIds
      .map((id) => byId.get(id))
      .filter((p): p is ProblemWithApproaches => !!p)
      .slice(0, limit);
  }

  const matched = catalog
    .filter((p) => problemMatchesAlgorithm(p, lesson.tagLabel))
    .sort((a, b) => a.difficulty_rating - b.difficulty_rating);

  if (!matched.length) return [];

  const poolSize = Math.max(6, limit * 3);
  const pool = matched.slice(0, Math.min(poolSize, matched.length));
  const rand = mulberry32(hashSeed(`${lesson.id}:${dayKey}`));
  const copy = [...pool];
  shuffleInPlace(copy, rand);
  return copy.slice(0, Math.min(limit, copy.length));
}
