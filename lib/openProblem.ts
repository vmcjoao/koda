import { router, type Href } from 'expo-router';
import type { ProblemWithApproaches, UserAttempt } from '@/types/database';

export type OpenProblemIntent = 'fresh' | 'review' | 'retry';

export type OpenProblemOptions = {
  /** Prior attempt shown as reference (not auto-submitted). */
  priorAttempt?: UserAttempt | null;
  intent?: OpenProblemIntent;
};

/** Hand-off into a fresh problem flow (AttemptProvider mounts inside the route). */
let pending: ProblemWithApproaches | null = null;
let pendingOpts: OpenProblemOptions | null = null;

export function takePendingOpen(
  id: string,
): { problem: ProblemWithApproaches; opts: OpenProblemOptions } | null {
  if (pending?.id !== id) return null;
  const problem = pending;
  const opts = pendingOpts ?? {};
  pending = null;
  pendingOpts = null;
  return { problem, opts };
}

/** @deprecated Prefer takePendingOpen — kept for call sites that only need the problem. */
export function takePendingProblem(id: string): ProblemWithApproaches | null {
  return takePendingOpen(id)?.problem ?? null;
}

/**
 * Open a problem in a clean stack.
 * Always return to tabs first so any prior `problem/[id]` nested stack (and its
 * WebViews / attempt state) fully unmounts — otherwise the next open flickers
 * blank between the old and new problem until a cold start.
 */
export function openProblem(
  problem: ProblemWithApproaches,
  opts: OpenProblemOptions = {},
): void {
  pending = problem;
  pendingOpts = opts;
  router.dismissTo('/(tabs)');
  router.push(`/problem/${problem.id}`);
}

/** Leave Encounter → … → Reveal and land on a tab. */
export function exitProblemFlow(href: Href = '/(tabs)'): void {
  pending = null;
  pendingOpts = null;
  router.dismissTo(href);
}
