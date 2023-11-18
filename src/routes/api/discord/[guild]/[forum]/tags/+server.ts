import { json, type RequestEvent } from '@sveltejs/kit';
import { bot } from '$lib/server/discord/bot';
import { ForumChannel } from 'discord.js';
import { logger } from '$lib/server';

export async function GET({ params }: RequestEvent): Promise<Response> {
    if (params.guild == null || params.forum == null) {
        return json([]);
    }

    const guild = bot.guilds.cache.get(params.guild);
    if (guild == null) {
        logger.info('Guild null bozo');
        return json([]);
    }

    const channel = guild.channels.cache.get(params.forum);
    if (channel == null || !(channel instanceof ForumChannel)) {
        logger.info('Channel null bozo', channel);
        return json([]);
    }

    const tags = channel.availableTags.map((tag) => {
        return { name: tag.name, id: tag.id };
    });

    return json(tags);
}
