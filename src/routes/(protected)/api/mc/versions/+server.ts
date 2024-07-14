import { getMcVersions } from '$lib/server/utils/mc-versions';
import { safeAwait } from '$lib/utils/safeAwait';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    const versionsRes = await safeAwait(getMcVersions());
    if (versionsRes.success) {
        return json(versionsRes.value);
    }
    return error(500, 'Failed to fetch versions');
};
