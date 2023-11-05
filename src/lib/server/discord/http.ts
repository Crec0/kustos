import { fail } from '@sveltejs/kit';
import { discordOAuthSchema, discordUserSchema } from '$lib/server/discord/schemas';
import { logger } from '$lib/server';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';

const DISCORD_API = 'https://discord.com/api/v10';
const OAUTH_TOKEN = `${DISCORD_API}/oauth2/token`;
const OAUTH_USER = `${DISCORD_API}/users/@me`;
const OAUTH_USER_GUILDS = `${OAUTH_USER}/guilds`;

export function discordOAuthURL() {
    const urlParams = new URLSearchParams({
        client_id: CLIENT_ID,
        prompt: 'consent',
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'guilds identify',
    });
    return `https://discord.com/oauth2/authorize?${urlParams}`;
}

export async function fetchDiscordOAuthToken(code: string) {
    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code: code,
    });

    const response = await fetch(OAUTH_TOKEN, {
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

    const parsed = discordOAuthSchema.safeParse(responseJson);
    if (parsed.success) {
        return parsed.data;
    }

    logger.error(parsed.error);
    throw fail(400, { body: 'Failed to parse discord response' });
}

export async function fetchDiscordOAuthUser(tokenType: string, accessToken: string) {
    const response = await fetch(OAUTH_USER, {
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

    const parsed = discordUserSchema.safeParse(responseJson);
    if (parsed.success) {
        return parsed.data;
    }

    logger.error(parsed.error);
    throw fail(400, { body: 'Failed to parse discord response' });
}
