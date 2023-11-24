import type { PageServerLoadEvent } from './$types';
import type { UserObject } from '$lib/types';
import { logger } from '$lib/server';


const defaultResponse: UserObject = {
    avatarUrl: '',
    id: '',
    creation: '',
    displayName: '',
    username: '',
};

export async function load({ params, fetch }: PageServerLoadEvent): Promise<UserObject> {
    const userID = params.id;

    try {
        const response = await fetch(`/api/discord/user/${ userID }`);
        if ( response.ok ) {
            return response.json();
        }
    } catch ( e ) {
        logger.error(e);
    }

    return defaultResponse;
}
