import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEED_PROBLEMS, getSeedProblem } from '@/data/seed-problems';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type {
  AttemptStatus,
  ProblemWithApproaches,
  ScoreBreakdown,
  UserAttempt,
  UserProfile,
} from '@/types/database';

const LOCAL_ATTEMPTS_KEY = 'koda.attempts';
const LOCAL_PROFILE_KEY = 'koda.profile';
const DEMO_USER_ID = 'demo-user';

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
  if (!supabase) return SEED_PROBLEMS;

  const { data: problems, error } = await supabase
    .from('problems')
    .select('*')
    .order('difficulty_rating', { ascending: true });

  if (error || !problems?.length) {
    console.warn('Falling back to local seed:', error?.message);
    return SEED_PROBLEMS;
  }

  const { data: approaches } = await supabase.from('solution_approaches').select('*');
  const byProblem = new Map<string, Record<string, unknown>[]>();
  for (const a of approaches ?? []) {
    const list = byProblem.get(a.problem_id) ?? [];
    list.push(a);
    byProblem.set(a.problem_id, list);
  }

  return problems.map((p) => mapProblemRow(p, byProblem.get(p.id) ?? []));
}

export async function fetchProblem(id: string): Promise<ProblemWithApproaches | null> {
  if (!supabase) return getSeedProblem(id) ?? null;

  const { data: problem, error } = await supabase.from('problems').select('*').eq('id', id).maybeSingle();
  if (error || !problem) {
    return getSeedProblem(id) ?? null;
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
  return data as UserProfile;
}

export async function saveAttempt(input: {
  userId: string | null;
  problemId: string;
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
}): Promise<UserAttempt> {
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

  // Update local profile XP / streak
  const profile = await readLocalProfile();
  const today = new Date().toISOString().slice(0, 10);
  const xpGain = input.breakdown.score + (input.breakdown.complexityBonus ? 10 : 0);
  profile.xp += xpGain;
  if (profile.last_active_date !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const y = yesterday.toISOString().slice(0, 10);
    profile.streak = profile.last_active_date === y ? profile.streak + 1 : 1;
    profile.last_active_date = today;
  }
  await writeLocalProfile(profile);

  if (!supabase || !input.userId) {
    const attempts = await readLocalAttempts();
    attempts.unshift(attempt);
    await writeLocalAttempts(attempts);
    return attempt;
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
    return attempt;
  }

  // Upsert problem state + bump profile
  const solved = input.breakdown.score >= 70;
  await supabase.from('user_problem_state').upsert({
    user_id: input.userId,
    problem_id: input.problemId,
    is_solved: solved,
    attempt_count: 1,
    best_score: input.breakdown.score,
    next_review_date: solved
      ? null
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  });

  await supabase
    .from('user_profiles')
    .update({
      xp: profile.xp,
      streak: profile.streak,
      last_active_date: profile.last_active_date,
    })
    .eq('user_id', input.userId);

  return data as UserAttempt;
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
  // Merge remote + local demos without dupes
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

export { isSupabaseConfigured };
