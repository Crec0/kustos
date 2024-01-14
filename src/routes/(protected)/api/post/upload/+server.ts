import { logger } from '$lib/server';
import { blobs, db, posts } from '$lib/server/database';
import { upload } from '$lib/server/s3';
import { generateUniqueID } from '$lib/server/utils/random';
import { safeAwait } from '$lib/server/utils/type-utils';
import { error } from '@sveltejs/kit';

export const POST = async (event): Promise<Response> => {
    const userID = event.request.headers.get('discord-user-id');
    if (userID == null) {
        logger.error("discord-user-id is null. This shouldn't happen.");
        error(403, 'Invalid user id header');
    }

    const res = await safeAwait(event.request.formData());
    if (!res.success) {
        error(400, 'Invalid form data');
    }

    const formData = res.value;
    const postID = generateUniqueID(posts, posts.id);

    db.insert(posts)
        .values({
            id: postID,
            name: 'placeholder',
            author: 'placeholder',
            channel: 'placeholder',
            credits: 'placeholder',
            guild: 'placeholder',
            tags: 'placeholder',
            version: 'placeholder',
            description: 'placeholder',
        })
        .returning()
        .prepare(true)
        .run();

    await Promise.allSettled([
        ...uploadAllOf(formData, postID, 'schematic'),
        ...uploadAllOf(formData, postID, 'image'),
    ]);

    return new Response('Upload complete');
};

const uploadAllOf = (formData: FormData, postID: string, kind: string) =>
    formData.getAll(kind).map((f, idx) => {
        if (!(f instanceof File)) {
            return null;
        }
        const id = generateUniqueID(blobs, blobs.id);
        db.insert(blobs)
            .values({ id: id, name: f.name, kind: kind, postId: postID })
            .returning()
            .get();

        return upload(`${kind}/${postID}/${id}`, f.arrayBuffer());
    });
