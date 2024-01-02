import { logger } from '$lib/server';
import { verifyJWTAndGetUserID } from '$lib/server/utils/jwt';
import type { Handle, HandleServerError } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const userId = await verifyJWTAndGetUserID(event.cookies);
    // Delete the header in case someone tries to be funny.
    event.request.headers.delete('discord-user-id');
    if (userId != null) {
        logger.debug('JWT verification passed. Setting discord-user-id header');
        event.request.headers.set('discord-user-id', userId);
    }
    return resolve(event);
};

export const handleError: HandleServerError = ({ error }) => {
    logger.error(error);
};
