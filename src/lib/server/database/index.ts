import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from '$env/static/private';
import { createLogger } from '$lib/server/utils/logger';
import { safeAwait } from '$lib/utils/safeAwait';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as tables from './schema';

const log = createLogger('database');

function createDB(maxConnections: number = 5) {
    const postgresUrl = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
    const pgClient = postgres(postgresUrl, { max: maxConnections });
    const dClient = drizzle(pgClient, { schema: { ...tables } });

    return {
        pgClient,
        drizzle: dClient,
    };
}

async function migrateDB() {
    log.info('Migration starting');
    const time = Date.now();

    const { pgClient, drizzle } = createDB(1);

    const res = await safeAwait(migrate(drizzle, { migrationsFolder: 'drizzle' }));
    if (res.success) {
        log.info('Migration successfully completed');
    } else {
        log.error('Migration failed', res.error);
    }

    await pgClient.end();

    log.info('Migration finished in', Date.now() - time, 'ms');
}

export { createDB, migrateDB };
