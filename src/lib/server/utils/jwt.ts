import { ISSUER } from '$env/static/private';
import { publicKey } from '$lib/server';
import { safeAwait, type Failure } from '$lib/utils/safeAwait';
import type { Cookies } from '@sveltejs/kit';
import { jwtVerify, type JWTPayload } from 'jose';

interface SessionJWT extends JWTPayload {
    userID: string;
}

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
