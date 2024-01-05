import { logger } from '$lib/server';
import { verifyJWTAndGetUserID } from '$lib/server/utils/jwt';
import { error, type Handle, type HandleServerError } from '@sveltejs/kit';

const isProtectedAPIRoute = (path: string) => {
    if (!path.startsWith('/api')) return false;
    if (path.startsWith('/api/discord/user/')) return false;
    return true;
};

export const handle: Handle = async ({ event, resolve }) => {
    const {
        cookies,
        request: { headers },
        url: { pathname },
    } = event;

    const userId = await verifyJWTAndGetUserID(cookies);
    // Delete the header in case someone tries to be funny.
    headers.delete('discord-user-id');
    if (userId != null) {
        headers.set('discord-user-id', userId);
    } else if (isProtectedAPIRoute(pathname)) {
        error(403, 'Cannot access protected API without logging in.');
    }
    return resolve(event);
};

export const handleError: HandleServerError = ({ error }) => {
    logger.error(error);
};
