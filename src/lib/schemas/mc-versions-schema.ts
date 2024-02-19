import { z } from 'zod';

export interface VersionManifest {
    latest: Latest;
    versions: Version[];
}

export interface Latest {
    release: string;
    snapshot: string;
}

export interface Version {
    id: string;
    type: VersionType;
    url: string;
    time: Date;
    releaseTime: Date;
}

export enum VersionType {
    OldAlpha = 'old_alpha',
    OldBeta = 'old_beta',
    Release = 'release',
    Snapshot = 'snapshot',
}

export type ParsedVersions = { [key: string]: 0 | 1 | 2 };

export const latestSchema = z.object({
    release: z.string(),
    snapshot: z.string(),
});

export const typeSchema = z.nativeEnum(VersionType);

export const versionSchema = z.object({
    id: z.string(),
    type: typeSchema,
    url: z.string(),
    time: z.string().datetime({ offset: true }),
    releaseTime: z.string().datetime({ offset: true }),
});

export const versionManifestSchema = z.object({
    latest: latestSchema,
    versions: z.array(versionSchema),
});
