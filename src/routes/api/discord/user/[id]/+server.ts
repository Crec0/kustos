import { error, json, type RequestEvent } from '@sveltejs/kit';
import { bot } from '$lib/server/discord/bot';
import { logger } from '$lib/server';

export async function GET({ params }: RequestEvent): Promise<Response> {
    logger.info(params);
    if (params.id == null) {
        throw error(403, `Undefined id param. Please check the id and try again.`);
    }
    try {
        const user = await bot.users.fetch(params.id, { force: true });
        return json({
            id: user.id,
            displayName: user.displayName,
            username: user.username,
            creation: user.createdTimestamp,
            avatarUrl: user.displayAvatarURL({ extension: 'png' }),
        });
    } catch (e) {
        throw error(
            404,
            `User with id: ${params.id} not found. Please check the id and try again.`,
        );
    }
}
