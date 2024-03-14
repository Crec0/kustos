import { type Guild } from '$lib/schemas/discord-schema';
import type { ParsedVersions } from '$lib/schemas/mc-versions-schema';
import { postForm } from '$lib/schemas/post-form-schema';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    const [form, guilds, mcVersions] = await Promise.all([
        superValidate(postForm),
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
        const form = await superValidate(request, postForm);
        console.log('POST', form);

        if (!form.valid) {
            return fail(400, { form });
        }

        return { form };
    },
};
