import { constructRedirectURL } from '$lib/server/utils/url';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url: { pathname }, request: { headers } }) => {
    const userId = headers.get('discord-user-id');
    if (userId != null) return;

    if (pathname.startsWith('/api')) {
        error(403, 'Cannot access api without logging in.');
    }

    redirect(301, constructRedirectURL(pathname));
};
