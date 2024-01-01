import { discordOAuthURL } from '$lib/server/discord/http';
import { redirect, type RequestEvent, type RequestHandler } from '@sveltejs/kit';

const performLogin = ({
    url: { searchParams, pathname },
    request: { headers },
}: RequestEvent): Response => {
    const userId = headers.get('discord-user-id');
    if (userId != null) return new Response();

    const params = new URLSearchParams(searchParams);

    params.set('goto', pathname);
    const discordURL = discordOAuthURL(params);

    redirect(301, discordURL);
};

export const GET: RequestHandler = (e) => performLogin(e);
export const POST: RequestHandler = (e) => performLogin(e);
