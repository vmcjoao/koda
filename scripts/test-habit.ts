import assert from 'assert';
import { SEED_PROBLEMS } from '../data/seed-problems';
import {
  activityIntensity,
  adjustRatingBand,
  buildDailySet,
  computeActivityHeatmap,
  computeXpGain,
  computePipeline,
  filterAttempts,
  nextReviewDate,
  relativeDifficulty,
  reviewDue,
} from '../lib/habit';
import type { UserAttempt, UserProblemState } from '../types/database';

const set = buildDailySet(SEED_PROBLEMS, [], 1200);
assert.strictEqual(set.slots.length, 3);
assert.strictEqual(new Set(set.slots.map((s) => s.problemId)).size, 3);
assert.deepStrictEqual(
  set.slots.map((s) => s.role),
  ['warmup', 'target', 'boss'],
);

const xp = computeXpGain(80, true, 5);
assert.strictEqual(xp.base, 80);
assert.strictEqual(xp.radarBonus, 15);
assert.ok(xp.streakBonus > 0);
assert.strictEqual(xp.total, xp.base + xp.radarBonus + xp.streakBonus);

assert.strictEqual(nextReviewDate(90), null);
assert.ok(nextReviewDate(40));

const attempts: UserAttempt[] = [
  {
    id: '1',
    user_id: 'u',
    problem_id: SEED_PROBLEMS[0].id,
    timestamp: new Date().toISOString(),
    time_spent_sec: 10,
    selected_paradigms: [],
    selected_algorithms: [],
    selected_ds: [],
    selected_twists: [],
    guessed_complexity: null,
    complexity_bonus: false,
    user_twist_notes: null,
    pseudocode_draft: null,
    score_accuracy: 40,
    matched_approach_id: null,
    status: 'needs_review',
    mistake_types: ['Wrong Paradigm'],
  },
];
const states: UserProblemState[] = [
  {
    user_id: 'u',
    problem_id: SEED_PROBLEMS[0].id,
    is_solved: false,
    attempt_count: 1,
    next_review_date: '2000-01-01',
    best_score: 40,
  },
];
assert.ok(reviewDue(states, attempts).includes(SEED_PROBLEMS[0].id));

const up = adjustRatingBand(1200, 1600, 90);
assert.ok(up.delta > 0);
const down = adjustRatingBand(1200, 900, 30);
assert.ok(down.delta < 0);

const pipe = computePipeline(attempts);
assert.strictEqual(pipe.diagnosed, 1);

assert.strictEqual(relativeDifficulty(1000, 1200), 'easier');
assert.strictEqual(relativeDifficulty(1200, 1200), 'at band');
assert.strictEqual(relativeDifficulty(1500, 1200), 'harder');

assert.strictEqual(filterAttempts(attempts, 'weak').length, 1);
assert.strictEqual(filterAttempts(attempts, 'strong').length, 0);
assert.strictEqual(filterAttempts(attempts, 'radar').length, 0);

const heat = computeActivityHeatmap(attempts, 7, attempts[0].timestamp.slice(0, 10));
assert.strictEqual(heat.length, 7);
assert.ok(heat.some((d) => d.count === 1));
assert.strictEqual(activityIntensity(0), 0);
assert.strictEqual(activityIntensity(3), 3);

console.log('habit tests passed');
