import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllLocalProblems, getLocalProblem } from '@/lib/catalog';
import {
  adjustRatingBand,
  buildDailySet,
  computeXpGain,
  DAILY_SET_BONUS_XP,
  nextReviewDate,
  reviewDue,
  todayIso,
  type DailySet,
} from '@/lib/habit';
import { syncFavoritesToCloud } from '@/lib/favorites';
import { readCatalogCache, writeCatalogCache } from '@/lib/offlineDb';
import { isPendingCloudAttempt, mergeProfilesForSync } from '@/lib/sync';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type {
  AttemptStatus,
  ProblemWithApproaches,
  ScoreBreakdown,
  UserAttempt,
  UserProblemState,
  UserProfile,
} from '@/types/database';

const LOCAL_ATTEMPTS_KEY = 'koda.attempts';
const LOCAL_PROFILE_KEY = 'koda.profile';
const LOCAL_STATE_KEY = 'koda.problem_state';
const LOCAL_DAILY_KEY = 'koda.daily_set';
const DEMO_USER_ID = 'demo-user';

function mergeCatalog(
  primary: ProblemWithApproaches[],
  secondary: ProblemWithApproaches[],
): ProblemWithApproaches[] {
  const byId = new Map<string, ProblemWithApproaches>();
  for (const p of secondary) byId.set(p.id, p);
  for (const p of primary) byId.set(p.id, p);
  return [...byId.values()].sort((a, b) => a.difficulty_rating - b.difficulty_rating);
}

async function readLocalAttempts(): Promise<UserAttempt[]> {
  const raw = await AsyncStorage.getItem(LOCAL_ATTEMPTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as UserAttempt[];
  } catch {
    return [];
  }
}

async function writeLocalAttempts(attempts: UserAttempt[]) {
  await AsyncStorage.setItem(LOCAL_ATTEMPTS_KEY, JSON.stringify(attempts));
}

async function readLocalProfile(): Promise<UserProfile> {
  const raw = await AsyncStorage.getItem(LOCAL_PROFILE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      /* fall through */
    }
  }
  return {
    user_id: DEMO_USER_ID,
    display_name: 'Coder',
    rating_band: 1200,
    streak: 0,
    xp: 0,
    last_active_date: null,
  };
}

async function writeLocalProfile(profile: UserProfile) {
  await AsyncStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
}

async function readLocalStates(): Promise<UserProblemState[]> {
  const raw = await AsyncStorage.getItem(LOCAL_STATE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as UserProblemState[];
  } catch {
    return [];
  }
}

async function writeLocalStates(states: UserProblemState[]) {
  await AsyncStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(states));
}

function mapProblemRow(
  problem: Record<string, unknown>,
  approaches: Record<string, unknown>[],
): ProblemWithApproaches {
  return {
    id: problem.id as string,
    title: problem.title as string,
    source: problem.source as string,
    url: (problem.url as string) ?? null,
    difficulty_rating: problem.difficulty_rating as number,
    statement_md: problem.statement_md as string,
    constraints_text: problem.constraints_text as string,
    sample_io: (problem.sample_io as ProblemWithApproaches['sample_io']) ?? [],
    target_complexity: problem.target_complexity as string,
    created_at: problem.created_at as string | undefined,
    approaches: approaches.map((a) => ({
      id: a.id as string,
      problem_id: a.problem_id as string,
      approach_name: a.approach_name as string,
      paradigms: (a.paradigms as string[]) ?? [],
      algorithms: (a.algorithms as string[]) ?? [],
      data_structures: (a.data_structures as string[]) ?? [],
      key_insights: (a.key_insights as string[]) ?? [],
      editorial_summary_md: (a.editorial_summary_md as string) ?? '',
    })),
  };
}

export async function fetchProblems(): Promise<ProblemWithApproaches[]> {
  const local = getAllLocalProblems();
  if (!supabase) return local;

  const { data: problems, error } = await supabase
    .from('problems')
    .select('*')
    .order('difficulty_rating', { ascending: true });

  if (error || !problems?.length) {
    console.warn('Falling back to catalog cache / local seed:', error?.message);
    const cached = await readCatalogCache();
    return cached?.length ? mergeCatalog(cached, local) : local;
  }

  const { data: approaches } = await supabase.from('solution_approaches').select('*');
  const byProblem = new Map<string, Record<string, unknown>[]>();
  for (const a of approaches ?? []) {
    const list = byProblem.get(a.problem_id) ?? [];
    list.push(a);
    byProblem.set(a.problem_id, list);
  }

  const remote = problems.map((p) => mapProblemRow(p, byProblem.get(p.id) ?? []));
  await writeCatalogCache(remote);
  // Remote wins on id clash; keep local-only extras (ingestion) available offline.
  return mergeCatalog(remote, local);
}

export async function fetchProblem(id: string): Promise<ProblemWithApproaches | null> {
  if (!supabase) return getLocalProblem(id) ?? null;

  const { data: problem, error } = await supabase.from('problems').select('*').eq('id', id).maybeSingle();
  if (error || !problem) {
    const cached = await readCatalogCache();
    const fromCache = cached?.find((p) => p.id === id);
    return fromCache ?? getLocalProblem(id) ?? null;
  }
  const { data: approaches } = await supabase
    .from('solution_approaches')
    .select('*')
    .eq('problem_id', id);
  return mapProblemRow(problem, approaches ?? []);
}

export async function getProfile(userId: string | null): Promise<UserProfile> {
  if (!supabase || !userId) return readLocalProfile();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return readLocalProfile();
  // Keep local XP as source of truth when remote is stale zeroes after guest play
  const local = await readLocalProfile();
  const remote = data as UserProfile;
  if (local.xp > remote.xp) {
    return { ...remote, xp: local.xp, streak: Math.max(local.streak, remote.streak), last_active_date: local.last_active_date ?? remote.last_active_date };
  }
  return remote;
}

export async function updateRatingBand(userId: string | null, band: number): Promise<UserProfile> {
  const clamped = Math.max(800, Math.min(2400, Math.round(band)));
  const profile = await readLocalProfile();
  profile.rating_band = clamped;
  await writeLocalProfile(profile);

  if (supabase && userId) {
    await supabase.from('user_profiles').update({ rating_band: clamped }).eq('user_id', userId);
  }
  return profile;
}

export type SyncResult = {
  uploadedAttempts: number;
  upsertedStates: number;
  uploadedFavorites: number;
  profileSynced: boolean;
  pendingLeft: number;
  error?: string;
};

/**
 * Push guest/local attempts + problem state + favorites + XP into the signed-in cloud account.
 * Safe to call repeatedly — only `local-*` / demo-user attempts are uploaded.
 */
export async function syncLocalProgressToCloud(userId: string): Promise<SyncResult> {
  if (!supabase) {
    return {
      uploadedAttempts: 0,
      upsertedStates: 0,
      uploadedFavorites: 0,
      profileSynced: false,
      pendingLeft: 0,
      error: 'Supabase is not configured.',
    };
  }

  const localAttempts = await readLocalAttempts();
  const pending = localAttempts.filter((a) => isPendingCloudAttempt(a));
  const kept: UserAttempt[] = localAttempts.filter((a) => !isPendingCloudAttempt(a));
  let uploadedAttempts = 0;

  for (const a of pending) {
    const row = {
      user_id: userId,
      problem_id: a.problem_id,
      timestamp: a.timestamp,
      time_spent_sec: a.time_spent_sec,
      selected_paradigms: a.selected_paradigms,
      selected_algorithms: a.selected_algorithms,
      selected_ds: a.selected_ds,
      selected_twists: a.selected_twists,
      guessed_complexity: a.guessed_complexity,
      complexity_bonus: a.complexity_bonus,
      user_twist_notes: a.user_twist_notes,
      pseudocode_draft: a.pseudocode_draft,
      score_accuracy: a.score_accuracy,
      matched_approach_id: a.matched_approach_id,
      status: a.status,
      mistake_types: a.mistake_types,
    };

    let { error } = await supabase.from('user_attempts').insert(row);
    if (error && a.matched_approach_id) {
      ({ error } = await supabase
        .from('user_attempts')
        .insert({ ...row, matched_approach_id: null }));
    }

    if (error) {
      kept.push(a);
    } else {
      uploadedAttempts += 1;
    }
  }
  await writeLocalAttempts(kept);

  const states = await readLocalStates();
  let upsertedStates = 0;
  for (const s of states) {
    const { error } = await supabase.from('user_problem_state').upsert({
      user_id: userId,
      problem_id: s.problem_id,
      is_solved: s.is_solved,
      attempt_count: s.attempt_count,
      best_score: s.best_score,
      next_review_date: s.next_review_date,
    });
    if (!error) upsertedStates += 1;
  }

  const localProfile = await readLocalProfile();
  const { data: remoteRow } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  let profileSynced = false;
  if (remoteRow) {
    const merged = mergeProfilesForSync(localProfile, remoteRow as UserProfile);
    const { error } = await supabase
      .from('user_profiles')
      .update({
        xp: merged.xp,
        streak: merged.streak,
        rating_band: merged.rating_band,
        last_active_date: merged.last_active_date,
      })
      .eq('user_id', userId);
    if (!error) {
      await writeLocalProfile({ ...merged, user_id: DEMO_USER_ID });
      profileSynced = true;
    }
  }

  const uploadedFavorites = await syncFavoritesToCloud(userId);

  const pendingLeft = (await readLocalAttempts()).filter((a) => isPendingCloudAttempt(a)).length;
  return { uploadedAttempts, upsertedStates, uploadedFavorites, profileSynced, pendingLeft };
}

export async function fetchProblemStates(userId: string | null): Promise<UserProblemState[]> {
  const local = await readLocalStates();
  if (!supabase || !userId) return local;

  const { data, error } = await supabase.from('user_problem_state').select('*').eq('user_id', userId);
  if (error || !data) return local;

  const byId = new Map<string, UserProblemState>();
  for (const s of local) byId.set(s.problem_id, s);
  for (const s of data as UserProblemState[]) {
    const prev = byId.get(s.problem_id);
    if (!prev || s.best_score >= prev.best_score) byId.set(s.problem_id, s);
  }
  return [...byId.values()];
}

async function upsertProblemState(
  userId: string | null,
  problemId: string,
  score: number,
  forceReview: boolean,
): Promise<UserProblemState> {
  const states = await readLocalStates();
  const existing = states.find((s) => s.problem_id === problemId);
  const solved = score >= 70 && !forceReview;
  const review = forceReview || score < 70 ? nextReviewDate(forceReview ? Math.min(score, 49) : score) : nextReviewDate(score);

  const next: UserProblemState = {
    user_id: userId ?? DEMO_USER_ID,
    problem_id: problemId,
    is_solved: solved || (existing?.is_solved ?? false),
    attempt_count: (existing?.attempt_count ?? 0) + 1,
    best_score: Math.max(existing?.best_score ?? 0, score),
    next_review_date: solved && !forceReview ? null : review,
  };

  if (solved && !forceReview) {
    next.is_solved = true;
    next.next_review_date = null;
  }

  const idx = states.findIndex((s) => s.problem_id === problemId);
  if (idx >= 0) states[idx] = next;
  else states.push(next);
  await writeLocalStates(states);

  if (supabase && userId) {
    await supabase.from('user_problem_state').upsert({
      user_id: userId,
      problem_id: problemId,
      is_solved: next.is_solved,
      attempt_count: next.attempt_count,
      best_score: next.best_score,
      next_review_date: next.next_review_date,
    });
  }

  return next;
}

export type SaveAttemptResult = {
  attempt: UserAttempt;
  xpGain: ReturnType<typeof computeXpGain>;
  streak: number;
  ratingBand: number;
  bandDelta: number;
  dailyBonusXp: number;
};

export async function saveAttempt(input: {
  userId: string | null;
  problemId: string;
  problemDifficulty: number;
  timeSpentSec: number;
  paradigms: string[];
  algorithms: string[];
  dataStructures: string[];
  twists: string[];
  guessedComplexity: string | null;
  complexityBonus: boolean;
  pseudocode: string;
  breakdown: ScoreBreakdown;
  status: AttemptStatus;
}): Promise<SaveAttemptResult> {
  const attempt: UserAttempt = {
    id: `local-${Date.now()}`,
    user_id: input.userId ?? DEMO_USER_ID,
    problem_id: input.problemId,
    timestamp: new Date().toISOString(),
    time_spent_sec: input.timeSpentSec,
    selected_paradigms: input.paradigms,
    selected_algorithms: input.algorithms,
    selected_ds: input.dataStructures,
    selected_twists: input.twists,
    guessed_complexity: input.guessedComplexity,
    complexity_bonus: input.complexityBonus,
    user_twist_notes: null,
    pseudocode_draft: input.pseudocode,
    score_accuracy: input.breakdown.score,
    matched_approach_id: input.breakdown.matchedApproach?.id ?? null,
    status: input.status,
    mistake_types: input.breakdown.mistakeTypes,
  };

  const profile = await readLocalProfile();
  const today = todayIso();
  if (profile.last_active_date !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const y = yesterday.toISOString().slice(0, 10);
    profile.streak = profile.last_active_date === y ? profile.streak + 1 : 1;
    profile.last_active_date = today;
  }

  const xpGain = computeXpGain(
    input.breakdown.score,
    input.breakdown.complexityBonus,
    profile.streak,
  );
  profile.xp += xpGain.total;
  const { band, delta: bandDelta } = adjustRatingBand(
    profile.rating_band,
    input.problemDifficulty,
    input.breakdown.score,
  );
  profile.rating_band = band;

  const forceReview = input.status === 'needs_review';
  await upsertProblemState(input.userId, input.problemId, input.breakdown.score, forceReview);
  const dailyBonusXp = await markDailySlotComplete(input.problemId, input.breakdown.score);
  profile.xp += dailyBonusXp;
  await writeLocalProfile(profile);

  const resultBase = {
    xpGain,
    streak: profile.streak,
    ratingBand: band,
    bandDelta,
    dailyBonusXp,
  };

  if (!supabase || !input.userId) {
    const attempts = await readLocalAttempts();
    attempts.unshift(attempt);
    await writeLocalAttempts(attempts);
    return { attempt, ...resultBase };
  }

  const { data, error } = await supabase
    .from('user_attempts')
    .insert({
      user_id: input.userId,
      problem_id: input.problemId,
      time_spent_sec: input.timeSpentSec,
      selected_paradigms: input.paradigms,
      selected_algorithms: input.algorithms,
      selected_ds: input.dataStructures,
      selected_twists: input.twists,
      guessed_complexity: input.guessedComplexity,
      complexity_bonus: input.complexityBonus,
      pseudocode_draft: input.pseudocode,
      score_accuracy: input.breakdown.score,
      matched_approach_id: input.breakdown.matchedApproach?.id ?? null,
      status: input.status,
      mistake_types: input.breakdown.mistakeTypes,
    })
    .select('*')
    .single();

  if (error || !data) {
    const attempts = await readLocalAttempts();
    attempts.unshift(attempt);
    await writeLocalAttempts(attempts);
    return { attempt, ...resultBase };
  }

  await supabase
    .from('user_profiles')
    .update({
      xp: profile.xp,
      streak: profile.streak,
      rating_band: profile.rating_band,
      last_active_date: profile.last_active_date,
    })
    .eq('user_id', input.userId);

  return {
    attempt: data as UserAttempt,
    ...resultBase,
  };
}

export async function fetchAttempts(userId: string | null): Promise<UserAttempt[]> {
  const local = await readLocalAttempts();
  if (!supabase || !userId) return local;

  const { data, error } = await supabase
    .from('user_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });

  if (error || !data) return local;
  const ids = new Set(data.map((a) => a.id));
  return [...(data as UserAttempt[]), ...local.filter((a) => !ids.has(a.id))];
}

export async function updateAttemptStatus(
  attemptId: string,
  userId: string | null,
  status: AttemptStatus,
): Promise<void> {
  const attempts = await readLocalAttempts();
  const idx = attempts.findIndex((a) => a.id === attemptId);
  if (idx >= 0) {
    attempts[idx] = { ...attempts[idx], status };
    await writeLocalAttempts(attempts);
  }

  if (supabase && userId && !attemptId.startsWith('local-')) {
    await supabase.from('user_attempts').update({ status }).eq('id', attemptId).eq('user_id', userId);
  }
}

export function pickNextProblem(
  problems: ProblemWithApproaches[],
  attempts: UserAttempt[],
  ratingBand: number,
): ProblemWithApproaches | null {
  if (!problems.length) return null;
  const attempted = new Set(attempts.map((a) => a.problem_id));
  const unsolved = problems.filter((p) => !attempted.has(p.id));
  const pool = unsolved.length ? unsolved : problems;
  const sorted = [...pool].sort(
    (a, b) => Math.abs(a.difficulty_rating - ratingBand) - Math.abs(b.difficulty_rating - ratingBand),
  );
  return sorted[0] ?? null;
}

export async function getDailySet(
  problems: ProblemWithApproaches[],
  attempts: UserAttempt[],
  ratingBand: number,
): Promise<DailySet> {
  const raw = await AsyncStorage.getItem(LOCAL_DAILY_KEY);
  const today = todayIso();
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as DailySet;
      if (parsed.date === today && parsed.slots?.length) {
        // Drop slots whose problems disappeared
        const ids = new Set(problems.map((p) => p.id));
        if (parsed.slots.every((s) => ids.has(s.problemId))) return parsed;
      }
    } catch {
      /* rebuild */
    }
  }

  const set = buildDailySet(problems, attempts, ratingBand);
  await AsyncStorage.setItem(LOCAL_DAILY_KEY, JSON.stringify(set));
  return set;
}

/** Force a new Daily Set for today (keeps completed progress only if force=false). */
export async function regenerateDailySet(
  problems: ProblemWithApproaches[],
  attempts: UserAttempt[],
  ratingBand: number,
): Promise<DailySet> {
  const set = buildDailySet(problems, attempts, ratingBand);
  await AsyncStorage.setItem(LOCAL_DAILY_KEY, JSON.stringify(set));
  return set;
}

/** Marks a daily slot done. Returns bonus XP if the full set just completed. */
async function markDailySlotComplete(problemId: string, score: number): Promise<number> {
  const raw = await AsyncStorage.getItem(LOCAL_DAILY_KEY);
  if (!raw) return 0;
  try {
    const set = JSON.parse(raw) as DailySet;
    if (set.date !== todayIso()) return 0;
    let changed = false;
    for (const slot of set.slots) {
      if (slot.problemId === problemId && !slot.completed) {
        slot.completed = true;
        slot.score = score;
        changed = true;
      }
    }
    if (!changed) return 0;

    let bonus = 0;
    const allDone = set.slots.length > 0 && set.slots.every((s) => s.completed);
    if (allDone && !set.bonusAwarded) {
      set.bonusAwarded = true;
      bonus = DAILY_SET_BONUS_XP;
    }
    await AsyncStorage.setItem(LOCAL_DAILY_KEY, JSON.stringify(set));
    return bonus;
  } catch {
    return 0;
  }
}

export async function getReviewQueue(
  userId: string | null,
  problems: ProblemWithApproaches[],
  attempts: UserAttempt[],
): Promise<ProblemWithApproaches[]> {
  const states = await fetchProblemStates(userId);
  const dueIds = reviewDue(states, attempts);
  return dueIds
    .map((id) => problems.find((p) => p.id === id))
    .filter((p): p is ProblemWithApproaches => !!p);
}

export { isSupabaseConfigured };
