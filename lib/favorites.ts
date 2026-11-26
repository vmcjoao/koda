import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

const KEY = 'koda.favorites';

async function readLocal(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export async function setFavorites(ids: string[]): Promise<void> {
  const unique = [...new Set(ids)];
  await AsyncStorage.setItem(KEY, JSON.stringify(unique));
}

/**
 * Local favorites, merged with cloud when signed in.
 * Missing remote rows are uploaded; missing local rows from remote are kept locally.
 */
export async function getFavorites(userId?: string | null): Promise<string[]> {
  const local = await readLocal();
  if (!isSupabaseConfigured || !supabase || !userId) return local;

  const { data, error } = await supabase
    .from('user_favorites')
    .select('problem_id')
    .eq('user_id', userId);

  if (error || !data) return local;

  const remote = data.map((row) => row.problem_id as string);
  const merged = [...new Set([...local, ...remote])];
  await setFavorites(merged);

  const localOnly = merged.filter((id) => !remote.includes(id));
  if (localOnly.length) {
    await supabase.from('user_favorites').upsert(
      localOnly.map((problem_id) => ({ user_id: userId, problem_id })),
      { onConflict: 'user_id,problem_id' },
    );
  }

  return merged;
}

export async function toggleFavorite(
  problemId: string,
  userId?: string | null,
): Promise<string[]> {
  const current = await readLocal();
  const removing = current.includes(problemId);
  const next = removing ? current.filter((id) => id !== problemId) : [...current, problemId];
  await setFavorites(next);

  if (isSupabaseConfigured && supabase && userId) {
    if (removing) {
      await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('problem_id', problemId);
    } else {
      await supabase.from('user_favorites').upsert(
        { user_id: userId, problem_id: problemId },
        { onConflict: 'user_id,problem_id' },
      );
    }
  }

  return next;
}

/** Upload local-only favorites for a signed-in user. */
export async function syncFavoritesToCloud(userId: string): Promise<number> {
  if (!isSupabaseConfigured || !supabase) return 0;
  const local = await readLocal();
  if (!local.length) return 0;

  const { data } = await supabase
    .from('user_favorites')
    .select('problem_id')
    .eq('user_id', userId);
  const remote = new Set((data ?? []).map((row) => row.problem_id as string));
  const missing = local.filter((id) => !remote.has(id));
  if (!missing.length) return 0;

  const { error } = await supabase.from('user_favorites').upsert(
    missing.map((problem_id) => ({ user_id: userId, problem_id })),
    { onConflict: 'user_id,problem_id' },
  );
  return error ? 0 : missing.length;
}
