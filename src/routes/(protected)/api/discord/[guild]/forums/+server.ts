import { bot } from '$lib/server/discord/bot';
import { json, type RequestEvent } from '@sveltejs/kit';
import { ForumChannel } from 'discord.js';

export async function GET({ params }: RequestEvent): Promise<Response> {
    if (params.guild == null) {
        return json([]);
    }
    const guild = bot.guilds.cache.get(params.guild);
    if (guild == null) {
        return json([]);
    }

    const channels = [
        ...guild.channels.cache.filter((channel) => channel instanceof ForumChannel).values(),
    ].map((channel) => {
        return { name: channel.name, id: channel.id };
    });

    return json(channels);
}
