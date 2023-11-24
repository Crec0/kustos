import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { discordOAuthURL } from '$lib/server/discord/http';
import { logger } from '$lib/server';

export const actions: Actions = {
    login: ({ url: { searchParams } }) => {
        throw redirect(301, discordOAuthURL(searchParams));
    },
    logout: ({ cookies }) => {
        logger.info('Yeeting cookies');
        cookies.delete('session_token');
        throw redirect(303, '/');
    },
};
