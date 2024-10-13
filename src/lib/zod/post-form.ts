import { z } from 'zod';

export const credits = z.object({
    name: z.string(),
    userId: z.string().optional(),
});

export const postForm = z.object({
    name: z.string(),
    status: z.string().default("public"),
    credits: credits.array(),
    versions: z.string().array(),
    summary: z.string(),
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
