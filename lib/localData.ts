import AsyncStorage from '@react-native-async-storage/async-storage';

/** Keys owned by Koda guest/local persistence. */
export const LOCAL_KEYS = [
  'koda.attempts',
  'koda.profile',
  'koda.problem_state',
  'koda.daily_set',
  'koda.favorites',
  'koda.onboarding.v1',
] as const;

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
