import { DISCORD_TOKEN } from '$env/static/private';
import { logger } from '$lib/server';
import { ActivityType, Client, GatewayIntentBits } from 'discord.js';

export const bot = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    allowedMentions: { parse: [] },
    presence: {
        activities: [{ name: 'the wind in the archives', type: ActivityType.Listening }],
    },
});

bot.once('ready', async () => {
    logger.info(`${bot.user!.tag} is online!`);
});

await bot.login(DISCORD_TOKEN);
