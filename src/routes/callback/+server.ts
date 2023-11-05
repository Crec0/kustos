import type { RequestEvent } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { ISSUER, SESSION_EXPIRY_SECONDS } from '$env/static/private';
import { SignJWT } from 'jose';
import { fetchDiscordOAuthToken, fetchDiscordOAuthUser } from '$lib/server/discord/http';
import { privateKey } from '$lib/server';

export async function GET(data: RequestEvent): Promise<Response> {
    const code = data.url.searchParams.get('code');

    if (!code) {
        throw fail(403, { body: 'Code parameter not provided' });
    }

    const oAuth = await fetchDiscordOAuthToken(code);
    const user = await fetchDiscordOAuthUser(oAuth.token_type, oAuth.access_token);

    const sessionExpirySeconds = parseInt(SESSION_EXPIRY_SECONDS);
    const expireTime = Date.now() + sessionExpirySeconds;

    const jwt = await new SignJWT({ userID: user.id })
        .setProtectedHeader({ alg: 'EdDSA' })
        .setExpirationTime(Math.floor(expireTime / 1000))
        .setIssuer(ISSUER)
        .sign(privateKey);

    data.cookies.set('session_token', jwt, { path: '/' });
    throw redirect(301, '/');
}
