import { type Guild } from '$lib/zod/discord';
import type { ParsedVersions } from '$lib/zod/mc-versions';
import { postForm } from '$lib/zod/post-form';
import { db, logger } from '$lib/server';
import { Int4Range } from '$lib/server/database/custom-int4range';
import { blobs, posts, versions } from '$lib/server/database/schema';
import { error, fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate, withFiles } from 'sveltekit-superforms/server';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

const defaultForm = {
    name: '',
    status: 'public',
    summary: '',
    description: '',
    credits: [],
    versions: [] as number[],
    image: [] as { name: string; id: string }[],
    schematic: [] as { name: string; id: string }[],
};

export const load: PageServerLoad = async ({ fetch, params }) => {
    const query = await db.select({
        'authorId': posts.authorId,
        'name': posts.name,
        'summary': posts.summary,
        'description': posts.description,
        'status': posts.status,
        'created_time': posts.createdTime,
        'blobId': blobs.id,
        'blobName': blobs.name,
        'blobKind': blobs.kind,
        'versionId': versions.id,
        'versions': versions.versions,
    })
        .from(posts)
        .leftJoin(blobs, eq(posts.id, blobs.postId))
        .leftJoin(versions, eq(posts.id, versions.postId))
        .where(eq(posts.id, params.id));

    if (query.length === 0) {
        error(404, {
            message: `Post '${params.id}' not found`,
        });
    }

    const queryForm = query.reduce((acc, row) => {
        if (row.name) acc.name = row.name;
        if (row.status) acc.status = row.status;
        if (row.summary) acc.summary = row.summary;
        if (row.description) acc.description = row.description;

        if (row.blobKind === 'image') {
            acc.image.push({
                name: row.blobName!,
                id: row.blobId!,
            });
        } else if (row.blobKind === 'schematic') {
            acc.schematic.push({
                name: row.blobName!,
                id: row.blobId!,
            });
        }

        if (row.versions) {
            const start = row.versions.start!;
            const end = row.versions.end!;

            acc.versions = [
                ...new Set([
                    ...acc.versions,
                    start.inclusive ? start.value : start.value + 1,
                    end.inclusive ? end.value : end.value - 1,
                ]),
            ];
        }

        return acc;
    }, structuredClone(defaultForm));

    // https://orm.drizzle.team/docs/joins#aggregating-results
    // const formObject = postForm.parse(queryForm);

    logger.info(queryForm);

    const [form, guilds, mcVersions] = await Promise.all([
        superValidate(zod(postForm)),
        fetch('/api/discord/guilds').then((res) => res.json()) as Promise<
            Guild[]
        >,
        fetch('/api/mc/versions').then((res) => res.json()) as Promise<
            ParsedVersions
        >,
    ]);

    logger.info(form, 'form');

    return {
        form: form,
        guilds: guilds,
        versions: mcVersions,
    };
};

export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(postForm));
        if (!form.valid) {
            return fail(400, { form: withFiles(form) });
        }

        const userID = request.headers.get('discord-user-id');
        if (userID == null) {
            logger.error("discord-user-id is null. This shouldn't happen.");
            error(403, 'Invalid user id header');
        }

        console.log(form.data);

        const selectedVersions = form.data.versions.map((v) => +v);
        if (selectedVersions.length % 2 !== 0) {
            return fail(400, {
                form: withFiles(form),
                error: 'Versions must be in pairs',
            });
        }

        const op = await db
            .insert(posts)
            .values({
                name: form.data.name,
                authorId: userID,
                description: form.data.description,
                summary: form.data.summary,
                status: form.data.status,
            })
            .returning();

        const postID = op[0].id;

        const ranges = [];
        for (let i = 0; i < selectedVersions.length; i += 2) {
            const range = Int4Range.from(
                +selectedVersions[i],
                +selectedVersions[i + 1],
            );
            ranges.push({ postId: postID, versions: range });
        }

        await db.insert(versions).values(ranges);

        return message(form, 'Post created');
    },
};
