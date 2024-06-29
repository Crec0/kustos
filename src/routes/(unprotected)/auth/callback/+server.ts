import { ISSUER } from '$env/static/private';
import { privateKey } from '$lib/server';
import { db } from '$lib/server/database';
import { users } from '$lib/server/database/schema';
import { fetchDiscordOAuthToken, fetchDiscordOAuthUser } from '$lib/server/discord/http';
import type { DiscordOAuth, DiscordUser } from '$lib/server/discord/schemas';
import { epochSecondsAfter } from '$lib/server/utils/math';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { SignJWT } from 'jose';

async function getOAuthAndUser(event: RequestEvent) {
    const params = event.url.searchParams;
    const code = params.get('code');

    if (!code) {
        throw fail(403, { body: 'Code parameter not provided' });
    }

    const oAuth: DiscordOAuth = await fetchDiscordOAuthToken(params);
    const user: DiscordUser = await fetchDiscordOAuthUser(oAuth.token_type, oAuth.access_token);

    return { oAuth, user };
}

function storeTokenInfo(oAuth: DiscordOAuth, user: DiscordUser, expireTime: number) {
    db.insert(users)
        .values({
            id: user.id,
            username: user.username,
            displayName: user.global_name || user.username,
            accessToken: oAuth.access_token,
            refreshToken: oAuth.refresh_token,
            expiry: expireTime,
        })
        .onConflictDoUpdate({
            target: users.id,
            targetWhere: eq(users.id, user.id),
            set: {
                username: user.username,
                displayName: user.global_name || user.username,
                accessToken: oAuth.access_token,
                refreshToken: oAuth.refresh_token,
                expiry: expireTime,
            },
        })
        .prepare()
        .run();
}

async function generateJWT(userID: string, expireTime: number): Promise<string> {
    return new SignJWT({ userID: userID })
        .setProtectedHeader({ alg: 'EdDSA' })
        .setExpirationTime(expireTime)
        .setIssuer(ISSUER)
        .sign(privateKey);
}

function setJWTCookie(event: RequestEvent, jwt: string) {
    event.cookies.set('session_token', jwt, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
}

export const GET: RequestHandler = async (event: RequestEvent) => {
    const { oAuth, user } = await getOAuthAndUser(event);
    const expireTime = epochSecondsAfter(oAuth.expires_in);

    storeTokenInfo(oAuth, user, expireTime);

    const jwt = await generateJWT(user.id, expireTime);
    setJWTCookie(event, jwt);

    redirect(301, '/');
};
