import { logger } from '$lib/server';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { blobs, discordPost, inspirations, members, posts, postTags, users, versions } from './schema';

const sqliteDB = new Database('./data.db');
const db = drizzle(sqliteDB, {
    schema: {
        posts,
        postTags,
        members,
        blobs,
        discordPost,
        users,
        versions,
        inspirations,
    },
});

logger.info('Running migrations...');
migrate(db, { migrationsFolder: 'drizzle' });
logger.info('Migrations complete');

export { db };
