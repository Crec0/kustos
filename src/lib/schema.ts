import { z } from 'zod';

export type UserObject = {
    id: string;
    displayName: string;
    username: string;
    avatarUrl: string;
    accountSince: string;
    relativeAge: string;
};

export type NameIdObject = {
    name: string;
    id: string;
};

export type Guild = NameIdObject;
export type Channel = NameIdObject;
export type Tag = NameIdObject;

export const postForm = z.object({
    guild: z.string(),
    channel: z.string(),
    tag: z.string().array().max(5),
    name: z.string(),
    credits: z.string(),
    version: z.string(),
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
