import Database from 'better-sqlite3';

import { logger } from '$lib/server';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { blobs, blobsRelations, posts, tokens } from './schema';

const sqliteDB = new Database('./data.db');
const db = drizzle(sqliteDB, { schema: { posts, tokens, blobs, blobsRelations } });

logger.info('Running migrations...');
migrate(db, { migrationsFolder: 'drizzle' });
logger.info('Migrations complete');

export { blobs, db, posts, tokens };
