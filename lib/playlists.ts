import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

const KEY = 'koda.playlists';

export type Playlist = {
  id: string;
  name: string;
  description: string;
  /** Ordered problem ids. */
  problemIds: string[];
  createdAt: string;
  updatedAt: string;
};

async function readAll(): Promise<Playlist[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isPlaylist);
  } catch {
    return [];
  }
}

function isPlaylist(value: unknown): value is Playlist {
  if (!value || typeof value !== 'object') return false;
  const p = value as Playlist;
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    Array.isArray(p.problemIds) &&
    p.problemIds.every((id) => typeof id === 'string')
  );
}

async function writeAll(playlists: Playlist[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(playlists));
}

function touch(p: Playlist): Playlist {
  return { ...p, updatedAt: new Date().toISOString() };
}

export async function listPlaylists(): Promise<Playlist[]> {
  const list = await readAll();
  return [...list].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getPlaylist(id: string): Promise<Playlist | null> {
  const list = await readAll();
  return list.find((p) => p.id === id) ?? null;
}

export async function createPlaylist(input: {
  name: string;
  description?: string;
  problemIds?: string[];
}): Promise<Playlist> {
  const name = input.name.trim();
  if (!name) throw new Error('Playlist name is required');
  const now = new Date().toISOString();
  const playlist: Playlist = {
    id: Crypto.randomUUID(),
    name,
    description: (input.description ?? '').trim(),
    problemIds: [...new Set(input.problemIds ?? [])],
    createdAt: now,
    updatedAt: now,
  };
  const list = await readAll();
  list.unshift(playlist);
  await writeAll(list);
  return playlist;
}

/** Build a playlist containing every local problem from a given source label. */
export async function createPlaylistFromSource(
  source: string,
  problemIds: string[],
): Promise<Playlist> {
  return createPlaylist({
    name: source,
    description: `Problems from ${source}`,
    problemIds,
  });
}

export async function renamePlaylist(
  id: string,
  name: string,
  description?: string,
): Promise<Playlist | null> {
  const list = await readAll();
  const idx = list.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  const next = touch({
    ...list[idx],
    name: name.trim() || list[idx].name,
    description: description != null ? description.trim() : list[idx].description,
  });
  list[idx] = next;
  await writeAll(list);
  return next;
}

export async function deletePlaylist(id: string): Promise<void> {
  const list = await readAll();
  await writeAll(list.filter((p) => p.id !== id));
}

export async function addProblemToPlaylist(
  playlistId: string,
  problemId: string,
): Promise<Playlist | null> {
  const list = await readAll();
  const idx = list.findIndex((p) => p.id === playlistId);
  if (idx < 0) return null;
  if (list[idx].problemIds.includes(problemId)) return list[idx];
  const next = touch({
    ...list[idx],
    problemIds: [...list[idx].problemIds, problemId],
  });
  list[idx] = next;
  await writeAll(list);
  return next;
}

export async function removeProblemFromPlaylist(
  playlistId: string,
  problemId: string,
): Promise<Playlist | null> {
  const list = await readAll();
  const idx = list.findIndex((p) => p.id === playlistId);
  if (idx < 0) return null;
  const next = touch({
    ...list[idx],
    problemIds: list[idx].problemIds.filter((id) => id !== problemId),
  });
  list[idx] = next;
  await writeAll(list);
  return next;
}

export async function setPlaylistProblems(
  playlistId: string,
  problemIds: string[],
): Promise<Playlist | null> {
  const list = await readAll();
  const idx = list.findIndex((p) => p.id === playlistId);
  if (idx < 0) return null;
  const next = touch({
    ...list[idx],
    problemIds: [...new Set(problemIds)],
  });
  list[idx] = next;
  await writeAll(list);
  return next;
}

export async function playlistsContaining(problemId: string): Promise<Playlist[]> {
  const list = await listPlaylists();
  return list.filter((p) => p.problemIds.includes(problemId));
}

/**
 * Push local playlists to Supabase and pull remote ones the device doesn't have.
 * Uses full replace per playlist row for simplicity.
 */
export async function syncPlaylistsToCloud(userId: string): Promise<number> {
  if (!isSupabaseConfigured || !supabase) return 0;

  const local = await readAll();
  const { data: remoteRows, error } = await supabase
    .from('user_playlists')
    .select('id, name, description, problem_ids, created_at, updated_at')
    .eq('user_id', userId);

  if (error) return 0;

  const remote = (remoteRows ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? '',
    problemIds: (row.problem_ids as string[]) ?? [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));

  const byId = new Map<string, Playlist>();
  for (const p of remote) byId.set(p.id, p);
  for (const p of local) {
    const prev = byId.get(p.id);
    if (!prev || p.updatedAt >= prev.updatedAt) byId.set(p.id, p);
  }
  const merged = [...byId.values()];
  await writeAll(merged);

  let upserted = 0;
  for (const p of merged) {
    const { error: upErr } = await supabase.from('user_playlists').upsert(
      {
        id: p.id,
        user_id: userId,
        name: p.name,
        description: p.description,
        problem_ids: p.problemIds,
        created_at: p.createdAt,
        updated_at: p.updatedAt,
      },
      { onConflict: 'id' },
    );
    if (!upErr) upserted += 1;
  }
  return upserted;
}
