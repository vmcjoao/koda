import { router } from 'expo-router';
import type { ProblemWithApproaches } from '@/types/database';

/** Hand-off into a fresh problem flow (AttemptProvider mounts inside the route). */
let pending: ProblemWithApproaches | null = null;

export function takePendingProblem(id: string): ProblemWithApproaches | null {
  if (pending?.id !== id) return null;
  const next = pending;
  pending = null;
  return next;
}

/**
 * Open a problem in a clean stack.
 * Always return to tabs first so any prior `problem/[id]` nested stack (and its
 * WebViews / attempt state) fully unmounts — otherwise the next open flickers
 * blank between the old and new problem until a cold start.
 */
export function openProblem(problem: ProblemWithApproaches): void {
  pending = problem;
  router.dismissTo('/(tabs)');
  router.push(`/problem/${problem.id}`);
}

/** Leave Encounter → … → Reveal and land on Home. */
export function exitProblemFlow(): void {
  pending = null;
  router.dismissTo('/(tabs)');
}
