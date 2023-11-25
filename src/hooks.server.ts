import { logger } from '$lib/server';
import { verifyJWTAndGetUserID } from '$lib/server/utils/jwt';
import { constructRedirectURL } from '$lib/server/utils/url';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const isProtectedRoute = (route: string) => {
    return route.startsWith('/editor') && route.startsWith('/api') && route !== '/api/callback';
};

export const handle: Handle = async ({ event, resolve }) => {
    const userId = await verifyJWTAndGetUserID(event.cookies);
    if (userId == null) {
        logger.debug('JWT verification failed. Checking protected route');
        if (event.route.id == null || isProtectedRoute(event.route.id)) {
            logger.warn('Protected route or id is null. Redirecting...');
            throw redirect(302, constructRedirectURL(event.route.id, event.url.searchParams));
        }
        logger.debug('JWT verification failed. Route is unprotected');
    } else {
        logger.debug('JWT verification passed. Setting x-user-id header');
        event.request.headers.set('x-user-id', userId);
    }

    return resolve(event);
};

export const handleError: HandleServerError = ({ error, event }) => {
    logger.error(error);
    return {
        message: error as string,
        // @ts-ignore
        code: error?.code ?? 'UNKNOWN',
    };
};
