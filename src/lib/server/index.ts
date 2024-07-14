import { createDB, migrateDB } from '$lib/server/database';
import { createLogger } from '$lib/server/utils/logger';

const logger = createLogger();
const { pgClient, drizzle: db } = createDB();

(async () => {
    logger.info('Starting server...');
    await migrateDB();

    logger.info('Server started.');
})();

export { db, logger };
