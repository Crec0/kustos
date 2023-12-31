import { constructRedirectURL } from '$lib/server/utils/url';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const isAPIRoute = (route: string | null) => {
    if (route == null) return false;
    return route.startsWith('/api') && route !== '/api/callback';
};

export const load: LayoutServerLoad = async ({ url: { pathname }, request: { headers } }) => {
    const userId = headers.get('discord-user-id');
    if (userId != null) return;

    if (isAPIRoute(pathname)) {
        error(403, 'Cannot access api without logging in.');
    }

    redirect(303, constructRedirectURL(pathname));
};
