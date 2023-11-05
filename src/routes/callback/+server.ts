import type { RequestEvent } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import {
    CLIENT_ID,
    CLIENT_SECRET,
    ISSUER,
    PRIVATE_KEY,
    REDIRECT_URI,
    SESSION_EXPIRY_SECONDS,
} from '$env/static/private';
import { logger } from '$lib/server/logger';
import { SignJWT } from 'jose';
import { createPrivateKey } from 'crypto';
import { oauthSchema, userSchema } from '$lib/server/schemas';

const DISCORD_ENDPOINT = 'https://discord.com/api/v10';
const OAUTH_TOKEN_URL = `${DISCORD_ENDPOINT}/oauth2/token`;
const USER_ME_URL = `${DISCORD_ENDPOINT}/users/@me`;

const privateKey = createPrivateKey({
    key: Buffer.from(PRIVATE_KEY, 'base64'),
    format: 'pem',
});

async function fetchOAuthToken(code: string) {
    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code: code,
    });

    const response = await fetch(OAUTH_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: params,
    });

    const responseJson = await response.json();

    if (!response.ok) {
        throw fail(response.status, {
            body: 'Failed to acquire oauth token',
            discord_response: responseJson,
        });
    }

    const parsed = oauthSchema.safeParse(responseJson);

    if (parsed.success) {
        return parsed.data;
    }

    logger.error(parsed.error);

    throw fail(400, { body: 'Failed to parse discord response' });
}

async function fetchUser(tokenType: string, accessToken: string) {
    const response = await fetch(USER_ME_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `${tokenType} ${accessToken}`,
        },
    });

    const responseJson = await response.json();

    if (!response.ok) {
        throw fail(response.status, responseJson);
    }

    const parsed = userSchema.safeParse(responseJson);

    if (parsed.success) {
        return parsed.data;
    }

    logger.error(parsed.error);

    throw fail(400, { body: 'Failed to parse discord response' });
}

export async function GET(data: RequestEvent): Promise<Response> {
    const code = data.url.searchParams.get('code');

    if (!code) {
        throw fail(403, { body: 'Code parameter not provided' });
    }

    const oAuth = await fetchOAuthToken(code);
    const user = await fetchUser(oAuth.token_type, oAuth.access_token);

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
