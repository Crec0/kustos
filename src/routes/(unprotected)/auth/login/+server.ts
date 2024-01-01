import { logger } from '$lib/server';
import { discordOAuthURL } from '$lib/server/discord/http';
import { redirect, type RequestEvent, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({
    url: { searchParams, pathname },
    request: { headers, url },
}: RequestEvent) => {
    logger.info(url);

    const userId = headers.get('discord-user-id');
    if (userId != null) return new Response();

    const params = new URLSearchParams(searchParams);

    params.set('goto', pathname);
    const discordURL = discordOAuthURL(params);

    redirect(301, discordURL);
};
