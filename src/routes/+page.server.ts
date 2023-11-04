import { CLIENT_ID, REDIRECT_URI } from '$env/static/private';
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
    authorize: async ({ cookies, request, url }) => {
        const urlParams = new URLSearchParams({
            client_id: CLIENT_ID,
            prompt: 'consent',
            redirect_uri: REDIRECT_URI,
            response_type: 'code',
            scope: 'guilds identify',
        });

        throw redirect(301, `https://discord.com/oauth2/authorize?${urlParams}`);
    },
};
