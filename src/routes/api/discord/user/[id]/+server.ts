import { logger } from '$lib/server';
import { bot } from '$lib/server/discord/bot';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
    logger.info(params);
    if (params.id == null) {
        error(403, `Undefined id param. Please check the id and try again.`);
    }
    try {
        const user = await bot.users.fetch(params.id, { force: true });
        return json({
            id: user.id,
            displayName: user.displayName,
            username: user.username,
            accountSince: new Date(user.createdTimestamp).toUTCString(),
            relativeAge: relativeAge(user.createdTimestamp),
            avatarUrl: user.displayAvatarURL({ extension: 'png' }),
        });
    } catch (e) {
        error(404, `User with id: ${params.id} not found. Please check the id and try again.`);
    }
};

const units = [
    // 365.2425 is the average days in a year.
    { name: 'year', seconds: 365.2425 * 24 * 3600 },
    // 30.437 is the average days in a month.
    { name: 'month', seconds: 30.437 * 24 * 3600 },
    { name: 'week', seconds: 7 * 24 * 3600 },
    { name: 'day', seconds: 24 * 3600 },
    { name: 'hour', seconds: 3600 },
];

function relativeAge(timestamp: number): string {
    let secondsPast = Math.floor((Date.now() - timestamp) / 1000);

    const result = units.reduce((acc, { name, seconds }) => {
        const value = Math.floor(secondsPast / seconds);
        secondsPast %= seconds;
        return value ? [...acc, `${value} ${name}${value !== 1 ? 's' : ''}`] : acc;
    }, [] as string[]);

    return result.join(' ') + ' ago';
}
