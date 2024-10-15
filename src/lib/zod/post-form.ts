import { z } from 'zod';

export const credits = z.object({
    name: z.string(),
    userId: z.string().optional(),
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
    name: z.string(),
    size: z.number(),
});

export const postForm = z.object({
    name: z.string(),
    status: z.enum(postValueStatuses).default("public"),
    credits: credits.array(),
    versions: z.string().array(),
    summary: z.string(),
    description: z.string(),
    image: blob.array().max(10),
    schematic: blob.array().max(10),
});

export type BlobType = z.infer<typeof blob>;
