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
