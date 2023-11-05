import type { RequestEvent } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { ISSUER } from '$env/static/private';
import { SignJWT } from 'jose';
import { fetchDiscordOAuthToken, fetchDiscordOAuthUser } from '$lib/server/discord/http';
import { privateKey } from '$lib/server';
import { db, tokensTable } from '$lib/server/database';
import { epochSecondsAfter } from '$lib/utils';
import { eq } from 'drizzle-orm';

export async function GET(data: RequestEvent): Promise<Response> {
    const code = data.url.searchParams.get('code');

    if (!code) {
        throw fail(403, { body: 'Code parameter not provided' });
    }

    const oAuth = await fetchDiscordOAuthToken(code);
    const user = await fetchDiscordOAuthUser(oAuth.token_type, oAuth.access_token);
    const expireTime = epochSecondsAfter(oAuth.expires_in);

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

    // TODO: Move this to a separate file along with jwt refresh function
    const jwt = await new SignJWT({ userID: user.id })
        .setProtectedHeader({ alg: 'EdDSA' })
        .setExpirationTime(expireTime)
        .setIssuer(ISSUER)
        .sign(privateKey);

    data.cookies.set('session_token', jwt, { path: '/' });
    throw redirect(301, '/');
}
