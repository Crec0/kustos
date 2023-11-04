import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import Database from 'better-sqlite3';

export const db: BetterSQLite3Database = drizzle(new Database('./data.db'));

db.run(sql`
    CREATE TABLE IF NOT EXISTS tokens
    (
        user_id       TEXT PRIMARY KEY UNIQUE,
        access_token  TEXT UNIQUE,
        refresh_token TEXT UNIQUE,
        jwt           TEXT UNIQUE
    );
`);

export const tokensTable = sqliteTable('tokens', {
    user_id: text('user_id').primaryKey().unique(),
    access_token: text('access_token').unique(),
    refresh_token: text('refresh_token').unique(),
    jwt: text('jwt').unique(),
});
