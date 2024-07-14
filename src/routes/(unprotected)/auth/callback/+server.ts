import { generateJWT, getOAuthAndUser, storeTokenInfo } from '$lib/server/utils/jwt';
import { epochSecondsAfter } from '$lib/server/utils/math';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async (event: RequestEvent) => {
    const { oAuth, user } = await getOAuthAndUser(event);
    const expireTime = epochSecondsAfter(oAuth.expires_in);

    await storeTokenInfo(oAuth, user, expireTime);

    const jwt = await generateJWT(user.id, expireTime);
    event.cookies.set('session_token', jwt, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    redirect(301, '/');
};
