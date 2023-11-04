import { Logger } from '@tsed/logger';
import '@tsed/logger-file';
import { ActivityType, Client, GatewayIntentBits } from 'discord.js';
import { DISCORD_TOKEN } from '$env/static/private';

export const logger = new Logger('Main');

logger.appenders.set('file', {
    type: 'file',
    filename: `./logs/latest.log`,
    layout: { type: 'basic' },
    pattern: '.yyyy-MM-dd',
});

logger.appenders.set('console', {
    type: 'console',
});

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
