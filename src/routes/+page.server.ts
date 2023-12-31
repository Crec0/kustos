import { logger } from '$lib/server';
import { discordOAuthURL } from '$lib/server/discord/http';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    login: ({ url: { searchParams } }) => {
        redirect(301, discordOAuthURL(searchParams));
    },
    logout: ({ cookies }) => {
        logger.info('Yeeting cookies');
        cookies.delete('session_token', { path: '/' });
        redirect(303, '/');
    },
};
