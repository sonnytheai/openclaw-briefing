import Database from "better-sqlite3";
import path from "path";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath =
      process.env.DATABASE_PATH ||
      path.join(process.cwd(), "data", "briefings.db");

    db = new Database(dbPath, { readonly: true });
    db.pragma("cache_size = -64000");
  }
  return db;
}
