import { createPrivateKey, createPublicKey } from 'crypto';

import { PRIVATE_KEY } from '$env/static/private';
import { PUBLIC_KEY } from '$env/static/public';

export const privateKey = createPrivateKey({
    key: Buffer.from(PRIVATE_KEY, 'base64'),
    format: 'pem',
});

export const publicKey = createPublicKey({
    key: Buffer.from(PUBLIC_KEY, 'base64'),
    format: 'pem',
});
