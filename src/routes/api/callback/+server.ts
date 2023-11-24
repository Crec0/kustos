import type { RequestEvent } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { ISSUER } from '$env/static/private';
import { SignJWT } from 'jose';
import { fetchDiscordOAuthToken, fetchDiscordOAuthUser } from '$lib/server/discord/http';
import { privateKey } from '$lib/server';
import { db, tokensTable } from '$lib/server/database';
import { epochSecondsAfter } from '$lib/server/utils/math';
import { eq } from 'drizzle-orm';
import type { DiscordOAuth, DiscordUser } from '$lib/server/discord/schemas';

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
    db.insert(tokensTable)
        .values({
            access_token: oAuth.access_token,
            refresh_token: oAuth.refresh_token,
            token_expiry: expireTime,
            user_id: user.id,
        })
        .onConflictDoUpdate({
            target: tokensTable.user_id,
            where: eq(tokensTable.user_id, user.id),
            set: {
                access_token: oAuth.access_token,
                refresh_token: oAuth.refresh_token,
                token_expiry: expireTime,
            },
        })
        .prepare(true)
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

export async function GET(event: RequestEvent): Promise<Response> {
    const { oAuth, user } = await getOAuthAndUser(event);
    const expireTime = epochSecondsAfter(oAuth.expires_in);

    storeTokenInfo(oAuth, user, expireTime);

    const jwt = await generateJWT(user.id, expireTime);
    setJWTCookie(event, jwt);

    throw redirect(301, '/');
}
