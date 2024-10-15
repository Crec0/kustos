import {
    error,
    type RequestEvent,
} from '@sveltejs/kit';
import {
    db,
    logger,
} from '$lib/server';
import { blobs } from '$lib/server/database/schema';
import {
    and,
    eq,
} from 'drizzle-orm';
import { deleteObject } from '$lib/server/s3';


export async function POST({ params }: RequestEvent): Promise<Response> {
    logger.info('POST /api/blobs/[id]/');
    return new Response('GET /api/blobs/[id]/');
}

export async function DELETE({ params }: RequestEvent): Promise<Response> {
    // TODO: auth to check if post being edited is owned by user
    const postId = params.post;
    if (!postId) throw error(400, 'Invalid post id');

    const blobId = params.id;
    if (!blobId) throw error(400, 'Invalid blob id');

    const deleteQuery = await db.delete(blobs).where(and(eq(blobs.postId, postId), eq(blobs.id, blobId))).returning();
    if (deleteQuery.length === 0)
        throw error(500, 'Failed to delete blob');

    await deleteObject(`image/${ postId }/${ blobId }`);

    return new Response(`Successfully deleted ${ postId }/${ blobId }`);
}

