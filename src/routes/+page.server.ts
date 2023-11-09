import { ISSUER } from '$env/static/private';
import type { Actions, PageServerLoadEvent } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { safeVerifyJWT } from '$lib/utils';
import { bot } from '$lib/server/discord/bot';
import { logger, publicKey } from '$lib/server';
import { discordOAuthURL } from '$lib/server/discord/http';

async function verifySession(cookies: string) {
    return await safeVerifyJWT(cookies, publicKey, {
        issuer: ISSUER,
        clockTolerance: 30,
    });
}

export const actions: Actions = {
    authorize: async ({ cookies }) => {
        const token = cookies.get('session_token');
        if (token == null) {
            throw redirect(301, discordOAuthURL());
        }

        const verifyResult = await verifySession(token);
        if (!verifyResult || !verifyResult.success) {
            throw redirect(301, discordOAuthURL());
        }

        throw redirect(301, '/');
    },
};

export async function load({ cookies }: PageServerLoadEvent) {
    let data = {
        isVerified: false,
        userID: '',
        userName: '',
    };

    const token = cookies.get('session_token');
    if (token != null) {
        const verifyResult = await verifySession(token);

        if (verifyResult && verifyResult.success) {
            data.isVerified = true;

            const userID = verifyResult.jwt.payload.userID;
            const user = await bot.users.fetch(userID, { force: true });

            data.userID = user.id;
            data.userName = user.username;
        } else {
            logger.info('?', verifyResult?.error);
            cookies.delete('session_token');
            throw fail(403, {
                code: 'RELOG',
                body: 'Failed to verify session token. Please relog.',
            });
        }
    }

    return data;
}
