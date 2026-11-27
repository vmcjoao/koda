import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ProblemWithApproaches } from '../types/database';

const ASYNC_CATALOG_KEY = 'koda.catalog.cache';

function parseCatalog(raw: string | null | undefined): ProblemWithApproaches[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ProblemWithApproaches[];
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

/** Web: catalog cache lives in AsyncStorage (no expo-sqlite / WASM). */
export async function readCatalogCache(): Promise<ProblemWithApproaches[] | null> {
  try {
    return parseCatalog(await AsyncStorage.getItem(ASYNC_CATALOG_KEY));
  } catch {
    return null;
  }
}

export async function writeCatalogCache(problems: ProblemWithApproaches[]): Promise<void> {
  await AsyncStorage.setItem(ASYNC_CATALOG_KEY, JSON.stringify(problems));
}
