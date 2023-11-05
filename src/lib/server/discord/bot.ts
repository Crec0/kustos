import '@tsed/logger-file';
import { ActivityType, Client, GatewayIntentBits } from 'discord.js';
import { DISCORD_TOKEN } from '$env/static/private';
import { logger } from '$lib/server/logger';

export const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    allowedMentions: { parse: [] },
    presence: {
        activities: [{ name: 'the wind in the archives', type: ActivityType.Listening }],
    },
});

client.once('ready', async () => {
    logger.info(`${client.user!.tag} is online!`);
});

await client.login(DISCORD_TOKEN);
