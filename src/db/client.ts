import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { drizzle } from 'drizzle-orm/sqlite-proxy';
import * as schema from './schema';

const sqlite = new SQLiteConnection(CapacitorSQLite);

export async function initDb() {
  const conn = await sqlite.createConnection('ezorder.db', false, 'no-encryption', 1, false);
  await conn.open();

  const db = drizzle(async (sql, params, method) => {
    try {
      if (method === 'run') {
        const res = await conn.run(sql, params);
        return { rows: [], insertId: res.changes?.lastId };
      }

      const res = await conn.query(sql, params);
      const rows = (res.values ?? []).map((row) => Object.values(row));

      if (method === 'get') {
        return { rows: rows[0] ?? [] };
      }

      return { rows };
    } catch (e: any) {
      console.error('Error in SQLite query:', e);
      return { rows: [] };
    }
  }, { schema });

  return db;
}

export type DBInstance = Awaited<ReturnType<typeof initDb>>;