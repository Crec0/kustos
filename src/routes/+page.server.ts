import { ISSUER } from '$env/static/private';
import type { Actions, PageServerLoadEvent } from './$types';
import { type Cookies, fail, redirect } from '@sveltejs/kit';
import { safeVerifyJWT } from '$lib/utils';
import { bot } from '$lib/server/discord/bot';
import { goto } from '$app/navigation';
import { logger, publicKey } from '$lib/server';
import { discordOAuthURL } from '$lib/server/discord/http';

async function verifySession(cookies: Cookies) {
    const sessionCookie = cookies.get('session_token');

    if (sessionCookie != null) {
        return await safeVerifyJWT(sessionCookie, publicKey, {
            issuer: ISSUER,
            clockTolerance: 30,
        });
    }

    return null;
}

export const actions: Actions = {
    authorize: async ({ cookies }) => {
        let verifyResult = await verifySession(cookies);

        if (!verifyResult || !verifyResult.success) {
            throw redirect(301, discordOAuthURL());
        }

        await goto('/');
    },
};

export async function load({ cookies }: PageServerLoadEvent) {
    let data = {
        isVerified: false,
        userID: '',
        userName: '',
    };

    const verifyResult = await verifySession(cookies);

    if (verifyResult && verifyResult.success) {
        data.isVerified = true;

        const userID = verifyResult.jwt.payload.userID;
        const user = await bot.users.fetch(userID, { force: true });

        data.userID = user.id;
        data.userName = user.username;
    } else {
        logger.info('?', verifyResult?.error);
        cookies.delete('session_token');
        throw fail(403, { code: 'RELOG', body: 'Failed to verify session token. Please relog.' });
    }

    return data;
}
