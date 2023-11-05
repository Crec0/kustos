import { CLIENT_ID, ISSUER, REDIRECT_URI } from '$env/static/private';
import type { Actions, PageServerLoadEvent } from './$types';
import { redirect } from '@sveltejs/kit';
import { createPublicKey } from 'crypto';
import { PUBLIC_KEY } from '$env/static/public';
import { logger } from '$lib/server/logger';
import { safeVerifyJWT } from '$lib/utils';
import { client } from '$lib/server/bot';
import { goto } from '$app/navigation';

const publicKey = createPublicKey({
    key: Buffer.from(PUBLIC_KEY, 'base64'),
    format: 'pem',
});

export const actions: Actions = {
    authorize: async ({ cookies }) => {
        let isVerified = false;

        const sessionCookie = cookies.get('session_token');
        if (sessionCookie != null) {
            const verifyResult = await safeVerifyJWT(sessionCookie, publicKey, {
                issuer: ISSUER,
                clockTolerance: 30,
            });
            if (verifyResult.success) {
                logger.info(verifyResult);
                isVerified = true;
            }
        }

        if (!isVerified) {
            const urlParams = new URLSearchParams({
                client_id: CLIENT_ID,
                prompt: 'consent',
                redirect_uri: REDIRECT_URI,
                response_type: 'code',
                scope: 'guilds identify',
            });
            throw redirect(301, `https://discord.com/oauth2/authorize?${urlParams}`);
        }

        await goto('/');
    },
};

export async function load({ cookies }: PageServerLoadEvent) {
    const sessionCookie = cookies.get('session_token');
    let data = {
        isVerified: false,
        userID: '',
        userName: '',
    };

    if (sessionCookie != null) {
        const verifyResult = await safeVerifyJWT(sessionCookie, publicKey, {
            issuer: ISSUER,
            clockTolerance: 30,
        });
        if (verifyResult.success) {
            data.isVerified = true;

            const userID = verifyResult.jwt.payload.userID;
            const user = await client.users.fetch(userID, { force: true });

            data.userID = user.id;
            data.userName = user.username;
        } else {
            cookies.delete('session_token');
        }
    }

    return data;
}
