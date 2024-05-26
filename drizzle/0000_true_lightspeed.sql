CREATE TABLE `blobs` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`name` text NOT NULL,
	`kind` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `discord_post` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`channel_id` text NOT NULL,
	`guild_id` text NOT NULL,
	`message_id` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `inspirations` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`inspired_by` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`inspired_by`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`post_id` text NOT NULL,
	`role` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `post_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`tag_name` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`name` text NOT NULL,
	`credits` text NOT NULL,
	`version` text NOT NULL,
	`summary` text NOT NULL,
	`description` text NOT NULL,
	`slug` text NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`display_name` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`expiry` integer
);
--> statement-breakpoint
CREATE TABLE `versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` text NOT NULL,
	`version` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `blob_idx` ON `blobs` (`id`,`post_id`);--> statement-breakpoint
CREATE INDEX `inspiration_idx` ON `inspirations` (`post_id`,`inspired_by`);--> statement-breakpoint
CREATE INDEX `member_idx` ON `members` (`user_id`,`post_id`);--> statement-breakpoint
CREATE INDEX `tag_idx` ON `post_tags` (`post_id`,`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `post_idx` ON `posts` (`id`);--> statement-breakpoint
CREATE INDEX `version_idx` ON `versions` (`post_id`,`version`);