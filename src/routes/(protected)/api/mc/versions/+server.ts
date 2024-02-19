import TEST_DATA from '$lib/assets/DELETE-ME.json';
import { VersionType, versionManifestSchema, type ParsedVersions } from '$lib/schemas/mc-versions-schema';
import { logger } from '$lib/server';
import { safeAwait } from '$lib/utils/safeAwait';
import { error, json, type RequestHandler } from '@sveltejs/kit';

async function fetchVersions(): Promise<ParsedVersions> {
    const data = versionManifestSchema.safeParse(TEST_DATA);
    // const response = await fetch('https://piston-meta.mojang.com/mc/game/version_manifest.json');
    // const data = versionManifestSchema.safeParse(await response.json());
    if (!data.success) {
        logger.info('Failed to parse version manifest', data.error);
        throw new Error('Failed to parse version manifest');
    }
    return data.data.versions
        .filter((version) => {
            const rt = new Date(version.releaseTime);
            if (rt.getUTCMonth() === 3 && rt.getUTCDate() === 1) return false;
            return version.type === VersionType.Release || version.type === VersionType.Snapshot;
        })
        .sort((a, b) => new Date(a.releaseTime).getTime() - new Date(b.releaseTime).getTime())
        .map((version): ParsedVersions => {
            const id = version.id.replace(' Pre-Release ', '-pre');
            const type = version.type === 'snapshot' ? 2 : version.id.split('.').length > 2 ? 1 : 0;
            return { [id]: type };
        })
        .reduce((a, b): ParsedVersions => ({ ...a, ...b }), {});
}

let versions: ParsedVersions;
let lastFetch = Date.now();

async function getVersions(): Promise<ParsedVersions> {
    if (!versions || Date.now() - lastFetch > 1000 * 60 * 60) {
        versions = await fetchVersions();
        lastFetch = Date.now();
    }
    return versions;
}

export const GET: RequestHandler = async () => {
    const versionsRes = await safeAwait(getVersions());
    if (versionsRes.success) {
        return json(versionsRes.value);
    }
    return error(500, 'Failed to fetch versions');
};
