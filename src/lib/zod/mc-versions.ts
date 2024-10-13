import { z } from 'zod';

interface VersionManifest {
    $schema: string;
    latest: Latest;
    versions: Version[];
}

interface Latest {
    old_alpha: string;
    classic_server: string;
    alpha_server: string;
    old_beta: string;
    snapshot: string;
    release: string;
    pending: string;
}

interface Version {
    id: string;
    type: VersionType;
    url: string;
    time?: Date;
    releaseTime: Date;
    details: string;
}

enum VersionType {
    AlphaServer = 'alpha_server',
    ClassicServer = 'classic_server',
    OldAlpha = 'old_alpha',
    OldBeta = 'old_beta',
    Pending = 'pending',
    Release = 'release',
    Snapshot = 'snapshot',
}

const latestSchema = z.object({
    old_alpha: z.string().optional(),
    classic_server: z.string().optional(),
    alpha_server: z.string().optional(),
    old_beta: z.string().optional(),
    snapshot: z.string().optional(),
    release: z.string().optional(),
    pending: z.string().optional(),
});

const typeSchema = z.nativeEnum(VersionType);

const versionSchema = z.object({
    id: z.string(),
    type: typeSchema,
    url: z.string().optional(),
    time: z.string().optional(),
    releaseTime: z.string().optional(),
    details: z.string().optional(),
});

export const versionManifestSchema = z.object({
    latest: latestSchema,
    versions: z.array(versionSchema),
});

export type ParsedVersions = {
    [key: string]: {
        id: number;
        isSnapshot: boolean;
    };
};
