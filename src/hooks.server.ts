import type { Handle, HandleServerError } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { logger } from '$lib/server';
import { verifyJWTAndGetUserID } from '$lib/server/utils/jwt';
import { constructRedirectURL } from '$lib/server/utils/url';

const isProtectedRoute = (route: string) => {
    return (
        route !== '/' &&
        route !== '/callback' &&
        !route.startsWith('/session') &&
        !route.startsWith('/error')
    );
};

export const handle: Handle = async ({ event, resolve }) => {
    const userId = await verifyJWTAndGetUserID(event.cookies);
    if (userId == null && (event.route.id == null || isProtectedRoute(event.route.id))) {
        throw redirect(302, constructRedirectURL(event.route.id, event.url.searchParams));
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
