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

export const guildSchema = z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string().optional().nullable(),
    owner: z.boolean(),
    permissions: z.string(),
    features: z.array(z.string()),
    approximate_member_count: z.number().optional().nullable(),
    approximate_presence_count: z.number().optional().nullable(),
});

export const guildsSchema = z.array(guildSchema);

type DiscordUser = z.infer<typeof discordUserSchema>;
type DiscordOAuth = z.infer<typeof discordOAuthSchema>;
type DiscordGuild = z.infer<typeof guildSchema>;
type DiscordGuilds = z.infer<typeof guildsSchema>;

export type { DiscordGuild, DiscordGuilds, DiscordOAuth, DiscordUser };
