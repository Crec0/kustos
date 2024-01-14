import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tokens = sqliteTable('tokens', {
    userID: text('id').primaryKey(),
    accessToken: text('access_token').unique().notNull(),
    refreshToken: text('refresh_token').notNull(),
    expiry: integer('expiry').notNull(),
});

export const posts = sqliteTable('posts', {
    id: text('id').primaryKey(),
    author: text('author').notNull(),
    name: text('name').notNull(),
    credits: text('credits').notNull(),
    version: text('version').notNull(),
    description: text('description').notNull(),
    guild: text('guild').notNull(),
    channel: text('channel').notNull(),
    tags: text('tags').notNull(),
});

export const blobs = sqliteTable('blobs', {
    id: text('id').primaryKey(),
    postId: text('post_id').notNull(),
    name: text('name').notNull(),
    kind: text('kind').notNull(),
});

export const blobsRelations = relations(blobs, ({ one }) => ({
    post: one(posts, {
        fields: [blobs.postId],
        references: [posts.id],
    }),
}));
