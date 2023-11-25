import { ISSUER } from '$env/static/private';
import { publicKey } from '$lib/server';
import type { Cookies } from '@sveltejs/kit';
import type { KeyObject } from 'crypto';
import { jwtVerify, type JWTPayload, type JWTVerifyOptions, type JWTVerifyResult } from 'jose';

interface SessionJWT extends JWTPayload {
    userID: string;
}

type SafeVerifySuccess = {
    success: true;
    jwt: JWTVerifyResult<SessionJWT>;
};

type SafeVerifyError = {
    success: false;
    error: string;
};

type SafeVerifyResult = SafeVerifySuccess | SafeVerifyError;

export async function safeVerifyJWT(
    jwt: string,
    key: KeyObject,
    options?: JWTVerifyOptions | undefined,
): Promise<SafeVerifyResult> {
    try {
        const verifiedJwt = await jwtVerify<SessionJWT>(jwt, key, options);
        return { success: true, jwt: verifiedJwt };
    } catch (e: unknown) {
        if (e instanceof Error) {
            return { success: false, error: e.message };
        }
        // Unknown error. It shouldn't reach here.
        throw e;
    }
}

export async function verifySession(cookies: string | undefined) {
    if (cookies == null) {
        return {
            success: false,
            error: 'Cookie not found',
        } satisfies SafeVerifyError;
    }
    return await safeVerifyJWT(cookies, publicKey, {
        issuer: ISSUER,
        clockTolerance: 30,
    });
}

export async function verifyJWTAndGetUserID(cookies: Cookies) {
    const sessionTokenCookie = cookies.get('session_token');
    const verificationResult = await verifySession(sessionTokenCookie);
    if (verificationResult.success) {
        return verificationResult.jwt.payload.userID;
    }
    return null;
}
