import { json, type RequestEvent } from '@sveltejs/kit';
import { db, tokensTable } from '$lib/server/database';
import { eq } from 'drizzle-orm';
import { fetchDiscordOAuthUserGuilds } from '$lib/server/discord/http';
import { bot } from '$lib/server/discord/bot';

export async function GET({ cookies, request: { headers } }: RequestEvent): Promise<Response> {
    const userID = headers.get('x-user-id');
    if (userID == null) {
        return json([]);
    }

    const token = db.select().from(tokensTable).where(eq(tokensTable.user_id, userID)).get();
    if (token == null || token.access_token == null) {
        return json([]);
    }

    const guilds = await fetchDiscordOAuthUserGuilds('Bearer', token.access_token);
    const botGuilds = new Set(bot.guilds.cache.keys());

    const sharedGuilds = guilds
        .filter((guild) => botGuilds.has(guild.id))
        .map((guild) => {
            return { name: guild.name, id: guild.id };
        });

    return json(sharedGuilds);
}
