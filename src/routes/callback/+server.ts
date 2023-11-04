import type { RequestEvent } from '@sveltejs/kit';
import { fail, redirect, text } from '@sveltejs/kit';
import { CLIENT_ID, CLIENT_SECRET, ISSUER, PRIVATE_KEY, REDIRECT_URI } from '$env/static/private';
import { logger } from '$lib/server/logger';
import { SignJWT } from 'jose';
import { createPrivateKey } from 'crypto';
import { oauthSchema, userSchema } from '$lib/server/schemas';

const DISCORD_ENDPOINT = 'https://discord.com/api/v10';
const OAUTH_TOKEN_URL = `${DISCORD_ENDPOINT}/oauth2/token`;
const USER_ME_URL = `${DISCORD_ENDPOINT}/users/@me`;

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

    try {
        const oAuth = await fetchOAuthToken(code);
        const user = await fetchUser(oAuth.token_type, oAuth.access_token);

        const privateKey = createPrivateKey({
            key: Buffer.from(PRIVATE_KEY, 'base64'),
            format: 'pem',
        });

        const jwt = await new SignJWT({ user_id: user.id })
            .setProtectedHeader({ alg: 'EdDSA' })
            .setExpirationTime(Date.now() + 3600)
            .setIssuer(ISSUER)
            .sign(privateKey);

        logger.info(jwt);
    } catch (error) {
        logger.error(error);
        return text('An unexpected error occurred!');
    }

    throw redirect(301, '/');
}
