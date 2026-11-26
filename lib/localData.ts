import AsyncStorage from '@react-native-async-storage/async-storage';

/** Keys owned by Koda guest/local persistence. */
export const LOCAL_KEYS = [
  'koda.attempts',
  'koda.profile',
  'koda.problem_state',
  'koda.daily_set',
  'koda.favorites',
  'koda.playlists',
  'koda.onboarding.v1',
  'koda.reminders.enabled',
  'koda.reminders.hour',
] as const;

const KEY_SET = new Set<string>(LOCAL_KEYS);

export async function clearLocalTrainingData(): Promise<void> {
  await AsyncStorage.multiRemove([...LOCAL_KEYS]);
}

export async function resetOnboardingTips(): Promise<void> {
  await AsyncStorage.removeItem('koda.onboarding.v1');
}

/** Snapshot of device training data for backup/share. */
export async function exportLocalTrainingJson(): Promise<string> {
  const pairs = await AsyncStorage.multiGet([...LOCAL_KEYS]);
  const payload: Record<string, unknown> = {
    exportedAt: new Date().toISOString(),
    app: 'koda',
  };
  for (const [key, value] of pairs) {
    if (value == null) {
      payload[key] = null;
      continue;
    }
    try {
      payload[key] = JSON.parse(value);
    } catch {
      payload[key] = value;
    }
  }
  return JSON.stringify(payload, null, 2);
}

export type ImportResult =
  | { ok: true; restored: number }
  | { ok: false; error: string };

/** Restore a previously exported Koda backup (overwrites matching local keys). */
export async function importLocalTrainingJson(raw: string): Promise<ImportResult> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'Invalid JSON.' };
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: 'Backup must be a JSON object.' };
  }
  const obj = parsed as Record<string, unknown>;
  if (obj.app != null && obj.app !== 'koda') {
    return { ok: false, error: 'Not a Koda backup (app field mismatch).' };
  }

  const writes: [string, string][] = [];
  for (const key of KEY_SET) {
    if (!(key in obj) || obj[key] == null) continue;
    const value = obj[key];
    writes.push([
      key,
      typeof value === 'string' ? value : JSON.stringify(value),
    ]);
  }

  if (!writes.length) {
    return { ok: false, error: 'No recognizable Koda keys in backup.' };
  }

  await AsyncStorage.multiSet(writes);
  return { ok: true, restored: writes.length };
}
