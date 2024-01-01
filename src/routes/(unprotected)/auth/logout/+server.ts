import { redirect, type RequestEvent, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = ({
    cookies,
    request: { headers },
    url: { searchParams },
}: RequestEvent) => {
    headers.delete('discord-user-id');
    cookies.delete('session_token', { path: '/' });

    const redirectTo = searchParams.get('goto') ?? '';
    redirect(301, `/${redirectTo}`);
};
