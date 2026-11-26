import { SEED_PROBLEMS } from '@/data/seed-problems';
import extraJson from '@/data/extra-problems.json';
import type { ProblemWithApproaches } from '@/types/database';

function isProblem(value: unknown): value is ProblemWithApproaches {
  if (!value || typeof value !== 'object') return false;
  const p = value as ProblemWithApproaches;
  return (
    typeof p.id === 'string' &&
    typeof p.title === 'string' &&
    Array.isArray(p.approaches) &&
    p.approaches.length > 0
  );
}

/** Built-in seed + reviewed extras from ingestion. */
export function getAllLocalProblems(): ProblemWithApproaches[] {
  const raw = extraJson as unknown;
  const extras = (Array.isArray(raw) ? raw : []).filter(isProblem);
  const byId = new Map<string, ProblemWithApproaches>();
  for (const p of SEED_PROBLEMS) byId.set(p.id, p);
  for (const p of extras) byId.set(p.id, p);
  return [...byId.values()].sort((a, b) => a.difficulty_rating - b.difficulty_rating);
}

export function getLocalProblem(id: string): ProblemWithApproaches | undefined {
  return getAllLocalProblems().find((p) => p.id === id);
}
