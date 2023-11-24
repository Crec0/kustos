import type { LayoutServerLoadEvent } from './$types';
import type { UserObject } from '$lib/types';
import { logger } from '$lib/server';


const defaultResponse: UserObject = {
    avatarUrl: '',
    id: '',
    creation: '',
    displayName: '',
    username: '',
};

export async function load({ request: { headers }, fetch }: LayoutServerLoadEvent): Promise<UserObject> {
    const userID = headers.get('x-user-id');
    if ( userID == null ) {
        return defaultResponse;
    }

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
