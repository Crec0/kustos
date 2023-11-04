import { CLIENT_ID, REDIRECT_URI } from '$env/static/private';
import type { Actions, PageServerLoadEvent } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
    authorize: async (event) => {
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

export function load({ cookies }: PageServerLoadEvent) {
    return {};
}
