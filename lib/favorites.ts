import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'koda.favorites';

export async function getFavorites(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export async function toggleFavorite(problemId: string): Promise<string[]> {
  const current = await getFavorites();
  const next = current.includes(problemId)
    ? current.filter((id) => id !== problemId)
    : [...current, problemId];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function setFavorites(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(ids));
}
