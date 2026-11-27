import AsyncStorage from '@react-native-async-storage/async-storage';

const LEARN_RANDOM_SCOPE_KEY = 'koda.prefs.learn_random_scope';

/** Which lessons Random drill may pull from. */
export type LearnRandomScope = 'completed' | 'all';

export async function getLearnRandomScope(): Promise<LearnRandomScope> {
  const raw = await AsyncStorage.getItem(LEARN_RANDOM_SCOPE_KEY);
  return raw === 'all' ? 'all' : 'completed';
}

export async function setLearnRandomScope(scope: LearnRandomScope): Promise<void> {
  await AsyncStorage.setItem(LEARN_RANDOM_SCOPE_KEY, scope);
}
