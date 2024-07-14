import { Logger } from '@tsed/logger';
import '@tsed/logger-file';

function createLogger(name: string = '') {
    const logger = new Logger(`Kustos|${name}`);
    logger.appenders
        .set('file', {
            type: 'file',
            filename: `./logs/latest.log`,
            layout: { type: 'basic' },
            pattern: 'yyyy-MM-dd',
            levels: ['info', 'warn', 'error', 'fatal'],
        })
        .set('console', {
            type: 'console',
            levels: ['info', 'debug', 'trace', 'warn', 'error', 'fatal'],
        });

    return logger;
}

export { createLogger };
