import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'koda.learn.studied.v1';

async function readIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

async function writeIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify([...new Set(ids)]));
}

export async function getStudiedLessonIds(): Promise<Set<string>> {
  return new Set(await readIds());
}

export async function isLessonStudied(id: string): Promise<boolean> {
  const ids = await readIds();
  return ids.includes(id);
}

export async function setLessonStudied(id: string, studied: boolean): Promise<void> {
  const ids = await readIds();
  if (studied) {
    if (!ids.includes(id)) ids.push(id);
  } else {
    const next = ids.filter((x) => x !== id);
    await writeIds(next);
    return;
  }
  await writeIds(ids);
}

export async function toggleLessonStudied(id: string): Promise<boolean> {
  const studied = await isLessonStudied(id);
  await setLessonStudied(id, !studied);
  return !studied;
}
