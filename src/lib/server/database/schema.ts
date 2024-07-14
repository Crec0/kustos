import { init } from '@paralleldrive/cuid2';
import Alea from 'alea';
import { boolean, index, integer, pgSchema, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { int4range } from './custom-int4range';

const randomGen = Alea();
const cuid = init({
    length: 10,
    random: () => randomGen.next(),
    fingerprint: process.env.CUID_FINGERPRINT,
});

export const schema = pgSchema('kustos');

export const users = schema.table('users', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => cuid()),
    username: text('username').notNull(),
    displayName: text('display_name').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expiry: integer('expiry'),
});

export const posts = schema.table(
    'posts',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => cuid()),
        authorId: text('author_id')
            .notNull()
            .references(() => users.id),
        name: text('name').notNull(),
        versions: text('version').notNull(),
        summary: text('summary').notNull(),
        description: text('description').notNull(),
        slug: text('slug').notNull(),
        createdTime: timestamp('created_time').defaultNow(),
    },
    (table) => ({
        postIdx: uniqueIndex('post_idx').on(table.id),
    }),
);

export const postTags = schema.table(
    'post_tags',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => cuid()),
        postId: text('post_id')
            .notNull()
            .references(() => posts.id),
        tagName: text('tag_name').notNull(),
    },
    (table) => ({
        tagIdx: index('tag_idx').on(table.postId, table.id),
    }),
);

export const versions = schema.table(
    'versions',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => cuid()),
        postId: text('post_id')
            .notNull()
            .references(() => posts.id),
        versions: int4range('versions').notNull(),
    },
    (table) => ({
        versionIdx: index('version_idx').using('gist', table.versions),
        versionsPostIdx: index('versions_post_idx').using('hash', table.postId),
    }),
);

export const members = schema.table(
    'members',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => cuid()),
        userId: text('user_id')
            .notNull()
            .references(() => users.id),
        postId: text('post_id')
            .notNull()
            .references(() => posts.id),
        role: text('role').notNull(),
    },
    (table) => ({
        memberIdx: index('member_idx').on(table.userId, table.postId),
    }),
);

export const relatedPost = schema.table(
    'related_post',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => cuid()),
        post: text('post_id')
            .notNull()
            .references(() => posts.id),
        relatedPost: text('related_post_id')
            .notNull()
            .references(() => posts.id),
        relationship: text('relationship').notNull(), // 'variant' | 'inspired'
    },
    (table) => ({
        relationshipIdx: index('relationship_idx').on(table.post, table.relationship),
    }),
);

export const discordPost = schema.table('discord_post', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => cuid()),
    postId: text('post_id')
        .notNull()
        .references(() => posts.id),
    channelId: text('channel_id').notNull(),
    guildId: text('guild_id').notNull(),
    messageId: text('message_id').notNull(),
});

export const blobs = schema.table(
    'blobs',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => cuid()),
        postId: text('post_id')
            .notNull()
            .references(() => posts.id),
        name: text('name').notNull(),
        kind: text('kind').notNull(), // 'image' | 'file' | 'icon'
    },
    (table) => ({
        blobIdx: index('blob_idx').on(table.id, table.postId),
    }),
);

export const mcVersions = schema.table(
    'mc_versions',
    {
        id: integer('id').primaryKey(),
        version: text('version').notNull().unique(),
        isSnapshot: boolean('is_snapshot').notNull(),
    },
    (table) => ({
        versionIdx: index('mc_version_idx').using('hash', table.version),
    }),
);

export const config = schema.table('config', {
    key: text('key').notNull().unique().primaryKey(),
    value: text('value').notNull(),
});
