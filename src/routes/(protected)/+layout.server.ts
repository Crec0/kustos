import { constructRedirectURL } from '$lib/server/utils/url';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url: { pathname }, request: { headers } }) => {
    const userId = headers.get('discord-user-id');
    if (userId != null) return;

    redirect(301, constructRedirectURL(pathname));
};
