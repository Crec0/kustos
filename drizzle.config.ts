import { defineConfig } from 'drizzle-kit';

const { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } = process.env;
const postgresUrl = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    schema: './src/lib/server/database/schema.ts',
    dialect: 'postgresql',
    out: 'drizzle',
    dbCredentials: {
        url: postgresUrl,
    },
    verbose: true,
    strict: true,
});
