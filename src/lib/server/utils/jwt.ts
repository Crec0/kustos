import { ISSUER, PRIVATE_KEY } from '$env/static/private';
import { PUBLIC_KEY } from '$env/static/public';
import { db } from '$lib/server';
import { users } from '$lib/server/database/schema';
import { fetchDiscordOAuthToken, fetchDiscordOAuthUser } from '$lib/server/discord/http';
import type { DiscordOAuth, DiscordUser } from '$lib/server/discord/schemas';
import { type Failure, safeAwait } from '$lib/utils/safeAwait';
import { type Cookies, fail, type RequestEvent } from '@sveltejs/kit';
import { createPrivateKey, createPublicKey } from 'crypto';
import { eq } from 'drizzle-orm';
import { type JWTPayload, jwtVerify, SignJWT } from 'jose';

interface SessionJWT extends JWTPayload {
    userID: string;
}

const privateKey = createPrivateKey({
    key: Buffer.from(PRIVATE_KEY, 'base64'),
    format: 'pem',
});

const publicKey = createPublicKey({
    key: Buffer.from(PUBLIC_KEY, 'base64'),
    format: 'pem',
});

export async function verifySession(token: string | undefined) {
    if (token == null) {
        return {
            success: false,
            error: 'Cookie not found',
        } satisfies Failure;
    }

    return await safeAwait(
        jwtVerify<SessionJWT>(token, publicKey, {
            issuer: ISSUER,
            clockTolerance: 30,
        }),
    );
}

export async function verifyJWTAndGetUserID(cookies: Cookies) {
    const sessionTokenCookie = cookies.get('session_token');
    const result = await verifySession(sessionTokenCookie);
    if (result.success) {
        return result.value.payload.userID;
    }
    return null;
}

export async function getOAuthAndUser(event: RequestEvent) {
    const params = event.url.searchParams;
    const code = params.get('code');

    if (!code) {
        throw fail(403, { body: 'Code parameter not provided' });
    }

    const oAuth: DiscordOAuth = await fetchDiscordOAuthToken(params);
    const user: DiscordUser = await fetchDiscordOAuthUser(oAuth.token_type, oAuth.access_token);

    return { oAuth, user };
}

export async function storeTokenInfo(oAuth: DiscordOAuth, user: DiscordUser, expireTime: number) {
    await db
        .insert(users)
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
        });
}

export async function generateJWT(userID: string, expireTime: number): Promise<string> {
    return new SignJWT({ userID: userID })
        .setProtectedHeader({ alg: 'EdDSA' })
        .setExpirationTime(expireTime)
        .setIssuer(ISSUER)
        .sign(privateKey);
}
