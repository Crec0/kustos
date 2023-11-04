import type { RequestEvent } from '@sveltejs/kit';
import { redirect, text } from '@sveltejs/kit';
import { REDIRECT_URI, CLIENT_ID, CLIENT_SECRET } from '$env/static/private';
import { client, logger } from '$lib/server';

export async function GET(data: RequestEvent): Promise<Response> {
    const code = data.url.searchParams.get('code');

    if (code == null) {
        return text('Code do be null boi');
    }

    const urlParams = new URLSearchParams({
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code: code,
    });

    const tokenResp = await fetch(`https://discord.com/api/v10/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: urlParams,
    });

    const responseJson = await tokenResp.json();

    logger.info(responseJson);

    const guild = await client.guilds.fetch({ guild: 'DEFINITELY_NOT_HARD_CODED', force: true });
    const channels = guild.channels.cache.map((k, v) => v);

    logger.info(channels);

    throw redirect(301, '/');
}
