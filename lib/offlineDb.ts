import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { ProblemWithApproaches } from '../types/database';

const ASYNC_CATALOG_KEY = 'koda.catalog.cache';
const CATALOG_KV_KEY = 'catalog';

type SqliteDb = {
  execAsync: (source: string) => Promise<void>;
  getFirstAsync: <T>(source: string, params?: unknown[]) => Promise<T | null>;
  runAsync: (source: string, ...params: unknown[]) => Promise<unknown>;
};

let dbPromise: Promise<SqliteDb | null> | null = null;
let migrated = false;

async function openDb(): Promise<SqliteDb | null> {
  if (Platform.OS === 'web') return null;
  try {
    const SQLite = await import('expo-sqlite');
    const db = await SQLite.openDatabaseAsync('koda.db');
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS kv (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
    return db as unknown as SqliteDb;
  } catch {
    return null;
  }
}

async function getDb(): Promise<SqliteDb | null> {
  if (!dbPromise) dbPromise = openDb();
  const db = await dbPromise;
  if (db && !migrated) {
    migrated = true;
    try {
      const legacy = await AsyncStorage.getItem(ASYNC_CATALOG_KEY);
      if (legacy) {
        const existing = await db.getFirstAsync<{ key: string }>(
          'SELECT key FROM kv WHERE key = ?',
          [CATALOG_KV_KEY],
        );
        if (!existing) {
          await db.runAsync(
            'INSERT INTO kv (key, value, updated_at) VALUES (?, ?, ?)',
            CATALOG_KV_KEY,
            legacy,
            new Date().toISOString(),
          );
        }
        await AsyncStorage.removeItem(ASYNC_CATALOG_KEY);
      }
    } catch {
      /* keep going */
    }
  }
  return db;
}

function parseCatalog(raw: string | null | undefined): ProblemWithApproaches[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ProblemWithApproaches[];
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

/** Read cached catalog from SQLite (native) or AsyncStorage (web / fallback). */
export async function readCatalogCache(): Promise<ProblemWithApproaches[] | null> {
  try {
    const db = await getDb();
    if (db) {
      const row = await db.getFirstAsync<{ value: string }>(
        'SELECT value FROM kv WHERE key = ?',
        [CATALOG_KV_KEY],
      );
      const fromSql = parseCatalog(row?.value);
      if (fromSql) return fromSql;
    }
  } catch {
    /* fall through */
  }

  try {
    return parseCatalog(await AsyncStorage.getItem(ASYNC_CATALOG_KEY));
  } catch {
    return null;
  }
}

/** Persist catalog to SQLite when available; always mirror to AsyncStorage on web. */
export async function writeCatalogCache(problems: ProblemWithApproaches[]): Promise<void> {
  const payload = JSON.stringify(problems);
  const now = new Date().toISOString();

  try {
    const db = await getDb();
    if (db) {
      await db.runAsync(
        `INSERT INTO kv (key, value, updated_at) VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
        CATALOG_KV_KEY,
        payload,
        now,
      );
      return;
    }
  } catch {
    /* fall through to AsyncStorage */
  }

  await AsyncStorage.setItem(ASYNC_CATALOG_KEY, payload);
}
