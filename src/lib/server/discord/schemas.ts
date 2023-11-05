import { z } from 'zod';

export const discordUserSchema = z.object({
    id: z.string(),
    username: z.string(),
    discriminator: z.string(),
    global_name: z.string(),
    avatar: z.string(),
    bot: z.boolean().optional().nullable(),
    system: z.boolean().optional().nullable(),
    mfa_enabled: z.boolean().optional().nullable(),
    banner: z.string().optional().nullable(),
    accent_color: z.number().optional().nullable(),
    locale: z.string().optional().nullable(),
    verified: z.boolean().optional().nullable(),
    email: z.string().optional().nullable(),
    flags: z.number().optional().nullable(),
    premium_type: z.number().optional().nullable(),
    public_flags: z.number().optional().nullable(),
    avatar_decoration: z.string().optional().nullable(),
});

export const discordOAuthSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
    expires_in: z.number(),
    refresh_token: z.string(),
    scope: z.string(),
});
