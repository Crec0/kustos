import { MC_VERSION_MANIFEST_URL } from '$env/static/private';
import { type ParsedVersions, versionManifestSchema } from '$lib/schemas/mc-versions-schema';
import { db } from '$lib/server';
import { config, mcVersions } from '$lib/server/database/schema';
import { createLogger } from '$lib/server/utils/logger';
import { safeAwait } from '$lib/utils/safeAwait';
import { eq } from 'drizzle-orm';

const log = createLogger('mc-versions');
const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24;
let cachedVersions: ParsedVersions | null = null;

async function fetchVersions(): Promise<{ [key: string]: boolean }> {
    const response = await fetch(MC_VERSION_MANIFEST_URL);
    const data = versionManifestSchema.safeParse(await response.json());

    if (!data.success) {
        log.info('Failed to parse version manifest', data.error);
        throw new Error('Failed to parse version manifest');
    }

    return data.data.versions
        .filter((v) => (v.type === 'release' || v.type === 'snapshot') && !v.id.startsWith('af-'))
        .reverse()
        .map((version) => ({
            [version.id.replace(/-\d+$/, '').replace(/-pre$/, '')]: version.type === 'snapshot',
        }))
        .reduce((acc, v) => ({ ...acc, ...v }), {});
}

async function refreshDB(): Promise<boolean> {
    const versionsRes = await safeAwait(fetchVersions());
    if (!versionsRes.success) {
        log.info('Failed to fetch versions', versionsRes.error);
        return false;
    }

    const versions = versionsRes.value;

    const formattedVersions = Object.entries(versions).map(([version, isSnapshot], idx) => ({
        id: idx + 1,
        version,
        isSnapshot,
    }));

    formattedVersions.push({ id: 696969, version: 'Latest', isSnapshot: false });

    await db.delete(mcVersions);
    await db.insert(mcVersions).values(formattedVersions);

    return true;
}

async function getMcVersions(): Promise<ParsedVersions> {
    const prevFetch = await db.select().from(config).where(eq(config.key, 'mc_versions_previous_fetch'));
    const prevFetchTime = prevFetch.length === 0 ? 0 : parseInt(prevFetch[0].value);

    const currTime = Date.now();

    if (currTime - prevFetchTime > TWENTY_FOUR_HOURS) {
        log.info('Refreshing mc versions');
        cachedVersions = null;

        if (await refreshDB()) {
            await db
                .insert(config)
                .values({ key: 'mc_versions_previous_fetch', value: `${currTime}` })
                .onConflictDoUpdate({ target: config.key, set: { value: `${currTime}` } });
        }
    }

    if (!cachedVersions) {
        const versions = await db.select().from(mcVersions);
        cachedVersions = versions.reduce(
            (acc, v) => ({ ...acc, [v.version]: { id: v.id, isSnapshot: v.isSnapshot } }),
            {},
        );
    }

    return cachedVersions;
}

export { getMcVersions };
