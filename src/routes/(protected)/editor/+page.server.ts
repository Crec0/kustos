import { type Guild } from '$lib/schemas/discord-schema';
import type { ParsedVersions } from '$lib/schemas/mc-versions-schema';
import { postForm } from '$lib/schemas/post-form-schema';
import { logger } from '$lib/server';
import { blobs, db, posts } from '$lib/server/database';
import { upload } from '$lib/server/s3';
import { generateUniqueID } from '$lib/server/utils/random';
import { error, fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, withFiles } from 'sveltekit-superforms/server';
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

        const postID = generateUniqueID(posts, posts.id);

        db.insert(posts)
            .values({
                id: postID,
                name: form.data.name,
                author: userID,
                channel: form.data.channel,
                credits: form.data.credits,
                guild: form.data.guild,
                tags: form.data.tag.join(','),
                version: form.data.version,
                description: form.data.description,
            })
            .returning()
            .prepare()
            .run();

        await Promise.allSettled([
            ...uploadAllOf(form.data.schematic, postID, 'schematic'),
            ...uploadAllOf(form.data.image, postID, 'image'),
        ]);

        return { form: withFiles(form) };
    },
};

const uploadAllOf = (formData: File[], postID: string, kind: string) =>
    formData.map((f) => {
        const id = generateUniqueID(blobs, blobs.id);
        // TODO make this not so error prone
        db.insert(blobs).values({ id: id, name: f.name, kind: kind, postId: postID }).returning().get();
        return upload(`${kind}/${postID}/${id}`, f.arrayBuffer());
    });
