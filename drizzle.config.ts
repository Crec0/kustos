import { defineConfig } from 'drizzle-kit';

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    schema: './src/lib/server/database/schema.ts',
    dialect: 'sqlite',
    out: 'drizzle',
    dbCredentials: {
        url: './data.db',
    },
    verbose: true,
    strict: true,
});
