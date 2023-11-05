import { createPrivateKey, createPublicKey } from 'crypto';

import { PRIVATE_KEY } from '$env/static/private';
import { PUBLIC_KEY } from '$env/static/public';
import { Logger } from '@tsed/logger';
import '@tsed/logger-file';

export const privateKey = createPrivateKey({
    key: Buffer.from(PRIVATE_KEY, 'base64'),
    format: 'pem',
});

export const publicKey = createPublicKey({
    key: Buffer.from(PUBLIC_KEY, 'base64'),
    format: 'pem',
});

export const logger = new Logger('Main');

logger.appenders
    .set('file', {
        type: 'file',
        filename: `./logs/latest.log`,
        layout: { type: 'basic' },
        pattern: '.yyyy-MM-dd',
        levels: ['info', 'warn', 'error', 'fatal'],
    })
    .set('console', {
        type: 'console',
        levels: ['info', 'debug', 'trace', 'warn', 'error', 'fatal'],
    });
