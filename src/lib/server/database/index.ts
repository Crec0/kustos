import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from '$env/static/private';
import { logger } from '$lib/server';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { blobs, discordPost, members, posts, postTags, relatedPost, users, versions } from './schema';

const postgresUrl = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

async function migratePostgres() {
    const migrationClient = postgres(postgresUrl, { max: 1 });
    logger.info('Running migrations...');

    await migrate(drizzle(migrationClient), { migrationsFolder: 'drizzle' });

    logger.info('Migrations complete');
    await migrationClient.end();
}

const db = drizzle(postgres(postgresUrl), {
    schema: {
        posts,
        postTags,
        members,
        blobs,
        discordPost,
        users,
        versions,
        relatedPost,
    },
});

export { db };
