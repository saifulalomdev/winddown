import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { drizzle } from 'drizzle-orm/sqlite-proxy';
import * as schema from './schema';

const sqlite = new SQLiteConnection(CapacitorSQLite);
const DB_NAME = 'ezorder';

let dbInstance: SQLiteDBConnection | null = null;
let initPromise: Promise<any> | null = null;

// 1. Import all .sql files from root /drizzle as raw text strings
const migrationFiles = import.meta.glob('/migrations/*.sql', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export async function initDb() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await sqlite.checkConnectionsConsistency().catch(() => {});

      const isConn = (await sqlite.isConnection(DB_NAME, false)).result;

      if (isConn) {
        dbInstance = await sqlite.retrieveConnection(DB_NAME, false);
      } else {
        try {
          dbInstance = await sqlite.createConnection(
            DB_NAME,
            false,
            'no-encryption',
            1,
            false
          );
        } catch (err: any) {
          if (err?.message?.includes('already exists')) {
            dbInstance = await sqlite.retrieveConnection(DB_NAME, false);
          } else {
            throw err;
          }
        }
      }

      const isDBOpen = (await dbInstance.isDBOpen()).result;
      if (!isDBOpen) {
        await dbInstance.open();
      }

      // 2. Run raw SQL migrations on startup
      const sortedMigrationPaths = Object.keys(migrationFiles).sort();
      for (const path of sortedMigrationPaths) {
        const sqlContent = migrationFiles[path];
        if (sqlContent) {
          await dbInstance.execute(sqlContent);
        }
      }

      // 3. Return Drizzle instance
      return drizzle(
        async (sql, params, method) => {
          if (!dbInstance) throw new Error('Database instance is missing');

          const isOpened = (await dbInstance.isDBOpen()).result;
          if (!isOpened) {
            await dbInstance.open();
          }

          if (method === 'run') {
            const res = await dbInstance.run(sql, params);
            return { rows: [], insertId: res.changes?.lastId };
          }

          const res = await dbInstance.query(sql, params);
          const values = res.values ?? [];

          const rows = values.map((row) =>
            Array.isArray(row) ? row : Object.values(row)
          );

          if (method === 'get') {
            return { rows: rows[0] ?? [] };
          }

          return { rows };
        },
        { schema }
      );
    } catch (error) {
      initPromise = null;
      dbInstance = null;
      throw error;
    }
  })();

  return initPromise;
}

export type DBInstance = Awaited<ReturnType<typeof initDb>>;