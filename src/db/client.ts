/*
 * Database-layer teaching note:
 * This file owns the database connection and caches it.
 * Opening one shared SQLite connection is simpler and safer than opening a new one in every query.
 */
import * as SQLite from "expo-sqlite";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Open the local SQLite database once and reuse the same promise everywhere else. */
export const getDatabase = async () => {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync("panchanga.db");
  }

  return databasePromise;
};
