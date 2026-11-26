import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'koda.dailyAlgorithm.cleared.v1';

async function readDates(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

async function writeDates(dates: string[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify([...new Set(dates)].sort()));
}

export async function getClearedDailyAlgoDates(): Promise<Set<string>> {
  return new Set(await readDates());
}

export async function isDailyAlgoCleared(iso: string): Promise<boolean> {
  const dates = await readDates();
  return dates.includes(iso);
}

export async function markDailyAlgoCleared(iso: string): Promise<void> {
  const dates = await readDates();
  if (!dates.includes(iso)) {
    dates.push(iso);
    await writeDates(dates);
  }
}

export async function unmarkDailyAlgoCleared(iso: string): Promise<void> {
  const dates = await readDates();
  await writeDates(dates.filter((d) => d !== iso));
}
