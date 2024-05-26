import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    username: text('username').notNull(),
    displayName: text('display_name').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expiry: integer('expiry'),
});

// TODO - downloads tracking
export const posts = sqliteTable(
    'posts',
    {
        id: text('id').primaryKey(),
        authorId: text('author_id')
            .notNull()
            .references(() => users.id),
        name: text('name').notNull(),
        version: text('version').notNull(),
        summary: text('summary').notNull(),
        description: text('description').notNull(),
        slug: text('slug').notNull(),
        createdTime: integer('created_time', { mode: 'timestamp' })
            .notNull()
            .default(sql`(unixepoch())`),
    },
    (table) => {
        return {
            postIdx: uniqueIndex('post_idx').on(table.id),
        };
    },
);

export const postTags = sqliteTable(
    'post_tags',
    {
        id: text('id').primaryKey(),
        postId: text('post_id')
            .notNull()
            .references(() => posts.id),
        tagName: text('tag_name').notNull(),
    },
    (table) => {
        return {
            tagIdx: index('tag_idx').on(table.postId, table.id),
        };
    },
);

// TODO - add post version as well in this.
export const versions = sqliteTable(
    'versions',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        postId: text('post_id')
            .notNull()
            .references(() => posts.id),
        version: text('version').notNull(),
    },
    (table) => {
        return {
            versionIdx: index('version_idx').on(table.postId, table.version),
        };
    },
);

export const members = sqliteTable(
    'members',
    {
        id: text('id').primaryKey(),
        userId: text('user_id')
            .notNull()
            .references(() => users.id),
        postId: text('post_id')
            .notNull()
            .references(() => posts.id),
        role: text('role').notNull(),
    },
    (table) => {
        return {
            memberIdx: index('member_idx').on(table.userId, table.postId),
        };
    },
);

export const inspirations = sqliteTable(
    'inspirations',
    {
        id: text('id').primaryKey(),
        postId: text('post_id')
            .notNull()
            .references(() => posts.id),
        inspiredBy: text('inspired_by')
            .notNull()
            .references(() => posts.id),
    },
    (table) => {
        return {
            inspirationIdx: index('inspiration_idx').on(table.postId, table.inspiredBy),
        };
    },
);

export const discordPost = sqliteTable('discord_post', {
    id: text('id').primaryKey(),
    postId: text('post_id')
        .notNull()
        .references(() => posts.id),
    channelId: text('channel_id').notNull(),
    guildId: text('guild_id').notNull(),
    messageId: text('message_id').notNull(),
});

export const blobs = sqliteTable(
    'blobs',
    {
        id: text('id').primaryKey(),
        postId: text('post_id')
            .notNull()
            .references(() => posts.id),
        name: text('name').notNull(),
        kind: text('kind').notNull(), // 'image' | 'file' | 'icon'
    },
    (table) => {
        return {
            blobIdx: index('blob_idx').on(table.id, table.postId),
        };
    },
);
