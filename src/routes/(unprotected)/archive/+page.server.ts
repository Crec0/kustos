import { db } from '$lib/server/database';
import { posts } from '$lib/server/database/schema';
import type { PageServerLoad } from '../../(protected)/editor/$types';

export const load: PageServerLoad = async ({ url: { searchParams } }) => {
    const offset = Math.min(+(searchParams.get('offset') || '0'), 20);
    const limit = Math.min(+(searchParams.get('limit') || '20'), 50);

    const postItems = db
        .select()
        .from(posts)
        .offset(offset * limit)
        .limit(limit)
        .orderBy(posts.createdTime)
        .all();

    return {
        posts: postItems,
    };
};
