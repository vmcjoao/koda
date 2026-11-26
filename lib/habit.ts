import type { ProblemWithApproaches, UserAttempt, UserProblemState } from '@/types/database';

export type DailySlotRole = 'warmup' | 'target' | 'boss';

export type DailySlot = {
  role: DailySlotRole;
  problemId: string;
  completed: boolean;
  score: number | null;
};

export type DailySet = {
  date: string; // YYYY-MM-DD
  slots: DailySlot[];
};

export const SLOT_LABELS: Record<DailySlotRole, string> = {
  warmup: 'Warm-up',
  target: 'Target',
  boss: 'Boss',
};

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Paradigms with enough attempts and weak average accuracy. */
export function weakTopics(attempts: UserAttempt[], problems: ProblemWithApproaches[]): string[] {
  const byTopic = new Map<string, number[]>();

  for (const a of attempts) {
    const problem = problems.find((p) => p.id === a.problem_id);
    if (!problem) continue;
    const tags = new Set(problem.approaches.flatMap((ap) => ap.paradigms));
    for (const tag of tags) {
      const list = byTopic.get(tag) ?? [];
      list.push(a.score_accuracy);
      byTopic.set(tag, list);
    }
  }

  return [...byTopic.entries()]
    .filter(([, scores]) => scores.length >= 1)
    .map(([topic, scores]) => ({
      topic,
      avg: scores.reduce((s, n) => s + n, 0) / scores.length,
    }))
    .filter((t) => t.avg < 60)
    .sort((a, b) => a.avg - b.avg)
    .map((t) => t.topic);
}

function hasTopic(problem: ProblemWithApproaches, topics: string[]): boolean {
  if (!topics.length) return false;
  return problem.approaches.some((a) => a.paradigms.some((p) => topics.includes(p)));
}

function inRange(p: ProblemWithApproaches, lo: number, hi: number) {
  return p.difficulty_rating >= lo && p.difficulty_rating <= hi;
}

function pickFrom(
  pool: ProblemWithApproaches[],
  used: Set<string>,
  prefer: (p: ProblemWithApproaches) => boolean,
): ProblemWithApproaches | null {
  const available = pool.filter((p) => !used.has(p.id));
  if (!available.length) return null;
  const preferred = available.filter(prefer);
  const list = preferred.length ? preferred : available;
  // Stable-ish: lowest id among closest — already filtered by caller
  return list[0] ?? null;
}

/**
 * Build a 3-problem daily run:
 * warm-up (comfort), target (band), boss (harder or weak topic).
 */
export function buildDailySet(
  problems: ProblemWithApproaches[],
  attempts: UserAttempt[],
  ratingBand: number,
): DailySet {
  const attempted = new Set(attempts.map((a) => a.problem_id));
  const weak = weakTopics(attempts, problems);
  const used = new Set<string>();

  const sorted = [...problems].sort((a, b) => {
    const au = attempted.has(a.id) ? 1 : 0;
    const bu = attempted.has(b.id) ? 1 : 0;
    if (au !== bu) return au - bu;
    return a.difficulty_rating - b.difficulty_rating;
  });

  const warmup =
    pickFrom(sorted.filter((p) => inRange(p, ratingBand - 450, ratingBand - 100)), used, () => true) ??
    pickFrom(sorted, used, (p) => p.difficulty_rating <= ratingBand);
  if (warmup) used.add(warmup.id);

  const target =
    pickFrom(sorted.filter((p) => inRange(p, ratingBand - 100, ratingBand + 150)), used, () => true) ??
    pickFrom(sorted, used, (p) => Math.abs(p.difficulty_rating - ratingBand) <= 200);
  if (target) used.add(target.id);

  const bossPool = sorted.filter(
    (p) => inRange(p, ratingBand + 100, ratingBand + 600) || hasTopic(p, weak),
  );
  const boss =
    pickFrom(bossPool, used, (p) => hasTopic(p, weak) || p.difficulty_rating >= ratingBand + 150) ??
    pickFrom(sorted, used, (p) => p.difficulty_rating >= ratingBand);

  const slots: DailySlot[] = [];
  if (warmup) slots.push({ role: 'warmup', problemId: warmup.id, completed: false, score: null });
  if (target) slots.push({ role: 'target', problemId: target.id, completed: false, score: null });
  if (boss) slots.push({ role: 'boss', problemId: boss.id, completed: false, score: null });

  return { date: todayIso(), slots };
}

export function reviewDue(
  states: UserProblemState[],
  attempts: UserAttempt[],
  today = todayIso(),
): string[] {
  const due = new Set<string>();

  for (const s of states) {
    if (s.next_review_date && s.next_review_date <= today) {
      due.add(s.problem_id);
    }
  }

  for (const a of attempts) {
    if (a.status === 'needs_review' || (a.score_accuracy < 70 && a.mistake_types.length > 0)) {
      // Only if not already solved strongly later
      const best = states.find((s) => s.problem_id === a.problem_id);
      if (!best?.is_solved) due.add(a.problem_id);
    }
  }

  return [...due];
}

/** SM-2-ish light schedule from score. */
export function nextReviewDate(score: number, from = new Date()): string | null {
  if (score >= 85) return null; // graduated for now
  const days = score >= 70 ? 7 : score >= 50 ? 3 : 1;
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function computeXpGain(score: number, complexityBonus: boolean, streak: number): {
  total: number;
  base: number;
  radarBonus: number;
  streakBonus: number;
} {
  const base = score;
  const radarBonus = complexityBonus ? 15 : 0;
  const streakBonus = streak >= 3 ? Math.min(20, streak * 2) : 0;
  return { total: base + radarBonus + streakBonus, base, radarBonus, streakBonus };
}

/**
 * Nudge rating band after a solve: crush harder problems → up; miss easier → down.
 * Clamped to [800, 2400].
 */
export function adjustRatingBand(
  current: number,
  problemDifficulty: number,
  score: number,
): { band: number; delta: number } {
  const relative = problemDifficulty - current;
  let delta = 0;
  if (score >= 85) delta = Math.round(15 + Math.max(0, relative) * 0.04);
  else if (score >= 70) delta = Math.round(6 + Math.max(0, relative) * 0.02);
  else if (score < 40) delta = Math.round(-12 + Math.min(0, relative) * 0.03);
  else if (score < 60) delta = -5;

  const band = Math.max(800, Math.min(2400, current + delta));
  return { band, delta: band - current };
}

export type TopicStat = {
  topic: string;
  avg: number | null;
  n: number;
  avgTimeSec: number | null;
  blindSpot: boolean;
};

export function computeTopicStats(
  attempts: UserAttempt[],
  problems: ProblemWithApproaches[],
  categories: string[],
): TopicStat[] {
  return categories.map((topic) => {
    const related = attempts.filter((a) => {
      const p = problems.find((x) => x.id === a.problem_id);
      return p?.approaches.some((ap) => ap.paradigms.includes(topic));
    });
    if (!related.length) {
      return { topic, avg: null, n: 0, avgTimeSec: null, blindSpot: false };
    }
    const avg = Math.round(related.reduce((s, a) => s + a.score_accuracy, 0) / related.length);
    const avgTimeSec = Math.round(
      related.reduce((s, a) => s + a.time_spent_sec, 0) / related.length,
    );
    return {
      topic,
      avg,
      n: related.length,
      avgTimeSec,
      blindSpot: related.length >= 2 && avg < 55,
    };
  });
}

export function computePipeline(attempts: UserAttempt[]) {
  const diagnosed = attempts.length;
  const blueprinted = attempts.filter((a) => !!a.pseudocode_draft?.trim()).length;
  const implemented = attempts.filter((a) => a.status === 'implemented_ac').length;
  const pct = (n: number) => (diagnosed ? Math.round((n / diagnosed) * 100) : 0);
  return {
    diagnosed,
    blueprinted,
    implemented,
    blueprintRate: pct(blueprinted),
    implementRate: pct(implemented),
  };
}
