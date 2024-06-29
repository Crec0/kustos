import { db } from '$lib/server/database';
import { blobs, posts } from '$lib/server/database/schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from '../../(protected)/editor/$types';

export const load: PageServerLoad = async ({ url: { searchParams } }) => {
    const offset = Math.min(+(searchParams.get('offset') || '0'), 20);
    const limit = Math.min(+(searchParams.get('limit') || '20'), 50);

    const postItems = db
        .select()
        .from(posts)
        .innerJoin(blobs, and(eq(posts.id, blobs.id), eq(blobs.kind, 'icon')))
        .offset(offset * limit)
        .limit(limit)
        .orderBy(posts.createdTime)
        .all();

    return {
        posts: postItems,
    };
};
