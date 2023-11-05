import { type JWTPayload, jwtVerify, type JWTVerifyOptions, type JWTVerifyResult } from 'jose';
import type { KeyObject } from 'crypto';

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

export const epochSeconds = () => Math.floor(Date.now() / 1000);

export const epochSecondsAfter = (interval: number) => epochSeconds() + interval;
