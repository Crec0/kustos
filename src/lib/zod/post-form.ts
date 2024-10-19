import { z } from 'zod';

export const credits = z.object({
    name: z.string().max(32),
    userId: z.string().max(32).optional(),
});

export const PostStatus = {
    Draft: 'draft',
    Private: 'private',
    Unlisted: 'unlisted',
    Public: 'public',
    Restricted: 'restricted',
} as const;

const postValueStatuses = Object.values(PostStatus) as unknown as readonly [string, ...string[]];

const blob = z.object({
    id: z.string(),
    name: z.string().max(64),
    size: z.number().max(1024 * 1024 * 10),
});

export const postForm = z.object({
    name: z.string().max(64),
    summary: z.string().max(64),
    status: z.enum(postValueStatuses).default("public"),
    description: z.string().max(1024),
    versions: z.string().array(),
    credits: credits.array(),
    schematic: blob.array().max(10),
    image: blob.array().max(10),
});

export type BlobType = z.infer<typeof blob>;
