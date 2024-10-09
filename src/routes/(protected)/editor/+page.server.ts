import { type Guild } from '$lib/schemas/discord-schema';
import type { ParsedVersions } from '$lib/schemas/mc-versions-schema';
import { postForm } from '$lib/schemas/post-form-schema';
import { db, logger } from '$lib/server';
import { Int4Range } from '$lib/server/database/custom-int4range';
import { blobs, posts, versions } from '$lib/server/database/schema';
import { upload } from '$lib/server/s3';
import { error, fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import {
    message,
    superValidate,
    withFiles,
} from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    const [form, guilds, mcVersions] = await Promise.all([
        superValidate(zod(postForm)),
        fetch('/api/discord/guilds').then((res) => res.json()) as Promise<Guild[]>,
        fetch('/api/mc/versions').then((res) => res.json()) as Promise<ParsedVersions>,
    ]);

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
            return fail(400, { form: withFiles(form), error: 'Versions must be in pairs' });
        }

        const op = await db
            .insert(posts)
            .values({
                name: form.data.name,
                authorId: userID,
                description: form.data.description,
                summary: form.data.summary,
                slug: form.data.slug,
            })
            .returning();

        const postID = op[0].id;

        const ranges = [];
        for (let i = 0; i < selectedVersions.length; i += 2) {
            const range = Int4Range.from(+selectedVersions[i], +selectedVersions[i + 1]);
            ranges.push({ postId: postID, versions: range });
        }

        await db.insert(versions).values(ranges);

        await Promise.allSettled([
            ...uploadAllOf(form.data.schematic, postID, 'schematic'),
            ...uploadAllOf(form.data.image, postID, 'image'),
        ]);

        return message(form, 'Post created');
    },
};

const uploadAllOf = (formData: File[], postID: string, kind: string) =>
    formData.map(async (f) => {
        const dd = await db.insert(blobs).values({ name: f.name, kind: kind, postId: postID }).returning();
        const ddID = dd[0].id;
        return upload(`${kind}/${postID}/${ddID}`, f.arrayBuffer());
    });
