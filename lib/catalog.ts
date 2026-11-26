import { SEED_PROBLEMS } from '@/data/seed-problems';
import extraJson from '@/data/extra-problems.json';
import ioFormats from '@/data/io-formats.json';
import type { ProblemWithApproaches } from '@/types/database';

type IoOverlay = { input_format_md?: string; output_format_md?: string };

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

/** Fill empty I/O format fields from the curated overlay. */
export function withIoFormats(p: ProblemWithApproaches): ProblemWithApproaches {
  const overlay = (ioFormats as Record<string, IoOverlay>)[p.id];
  return {
    ...p,
    input_format_md: p.input_format_md?.trim() || overlay?.input_format_md || '',
    output_format_md: p.output_format_md?.trim() || overlay?.output_format_md || '',
  };
}

/** Built-in seed + reviewed extras from ingestion (+ I/O format overlay). */
export function getAllLocalProblems(): ProblemWithApproaches[] {
  const raw = extraJson as unknown;
  const extras = (Array.isArray(raw) ? raw : []).filter(isProblem);
  const byId = new Map<string, ProblemWithApproaches>();
  for (const p of SEED_PROBLEMS) byId.set(p.id, withIoFormats(p as ProblemWithApproaches));
  for (const p of extras) byId.set(p.id, withIoFormats(p));
  return [...byId.values()].sort((a, b) => a.difficulty_rating - b.difficulty_rating);
}

export function getLocalProblem(id: string): ProblemWithApproaches | undefined {
  return getAllLocalProblems().find((p) => p.id === id);
}
