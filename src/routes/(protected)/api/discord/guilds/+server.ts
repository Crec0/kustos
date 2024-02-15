import { db, tokens } from '$lib/server/database';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET = async ({ request: { headers } }): Promise<Response> => {
    const userID = headers.get('discord-user-id');
    if (userID == null) {
        error(403, 'Cannot access guild resource without logging in');
    }

    const token = await db.query.tokens.findFirst({ where: eq(tokens.userID, userID) });
    if (token == null || token.accessToken == null) {
        error(403, 'No data found. please re-log');
    }

    const guilds = await fetchDiscordOAuthUserGuilds('Bearer', token.access_token);
    const botGuilds = new Set(bot.guilds.cache.keys());

    // TODO: Add whitelisted guilds filter

    const sharedGuilds = guilds
        .filter((guild) => botGuilds.has(guild.id))
        .map((guild) => {
            return { name: guild.name, id: guild.id };
        });

    return json(sharedGuilds);
}
