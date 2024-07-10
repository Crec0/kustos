import { z } from 'zod';

export const postForm = z.object({
    guild: z.string(),
    channel: z.string(),
    tag: z.string().array().max(5),
    name: z.string(),
    credits: z.string(),
    versions: z.string().array(),
    description: z.string(),
    image: z
        .instanceof(File)
        .refine((f) => f && f.size < 1024 * 1024 * 10, { message: 'Image size must be less than 10MiB' })
        .array()
        .max(10),
    schematic: z
        .instanceof(File)
        .refine((f) => f && f.size < 1024 * 1024 * 10, { message: 'File size must be less than 10MiB' })
        .array()
        .max(10),
});

export type PostForm = typeof postForm;
