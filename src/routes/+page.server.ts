import type { Actions, PageServerLoadEvent } from './$types';
import { bot } from '$lib/server/discord/bot';
import { verifyJWTAndGetUserID } from '$lib/server/utils/jwt';
import { redirect } from '@sveltejs/kit';
import { discordOAuthURL } from '$lib/server/discord/http';
import { logger } from '$lib/server';

export async function load({ cookies }: PageServerLoadEvent) {
    const userID = await verifyJWTAndGetUserID(cookies);
    let user = !userID ? null : await bot.users.fetch(userID, { force: true });

    return {
        username: user?.displayName,
    };
}

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
