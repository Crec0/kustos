import {
    error,
    type RequestEvent,
} from '@sveltejs/kit';
import {
    db,
    logger,
} from '$lib/server';
import { blobs } from '$lib/server/database/schema';
import { upload } from '$lib/server/s3';
import type { BlobType } from '$lib/zod/post-form';


export async function GET({ params }: RequestEvent): Promise<Response> {
    logger.info('GET /api/blobs/[id]/');
    return new Response('GET /api/blobs/[id]/');
}

const uploadToDBandS3 = async (type: string, data: FormData, postID: string) => {
    const blobInfo: BlobType[] = [];

    for ( const blob of data.getAll(type) ) {
        if (!(blob instanceof File))
            throw error(400, 'Invalid file');

        const blobInsertReturn = await db.insert(blobs)
            .values({ name: blob.name, kind: type, postId: postID, bytes: blob.size })
            .returning();

        if (blobInsertReturn.length === 0)
            throw error(500, 'Failed to insert blob');

        const blobID = blobInsertReturn[0].id;
        await upload(`${ type }/${ postID }/${ blobID }`, blob.arrayBuffer());

        blobInfo.push({ id: blobID, name: blob.name, size: blob.size });
    }

    return blobInfo;
};

export async function POST({ params, request }: RequestEvent): Promise<Response> {
    // TODO: auth to check if post being edited is owned by user
    const data = await request.formData();
    const postID = params.post as string;

    const blobInfo = await Promise.all([
        ...await uploadToDBandS3('schematic', data, postID),
        ...await uploadToDBandS3('image', data, postID),
    ]);

    return new Response(JSON.stringify(blobInfo));
}
