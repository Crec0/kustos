CREATE SCHEMA "kustos";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kustos"."blobs" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"name" text NOT NULL,
	"kind" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kustos"."discord_post" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"channel_id" text NOT NULL,
	"guild_id" text NOT NULL,
	"message_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kustos"."members" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"post_id" text NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kustos"."post_tags" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"tag_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kustos"."posts" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"name" text NOT NULL,
	"version" text NOT NULL,
	"summary" text NOT NULL,
	"description" text NOT NULL,
	"slug" text NOT NULL,
	"created_time" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kustos"."related_post" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"related_post_id" text NOT NULL,
	"relationship" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kustos"."users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"display_name" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"expiry" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kustos"."versions" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"version" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kustos"."blobs" ADD CONSTRAINT "blobs_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "kustos"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kustos"."discord_post" ADD CONSTRAINT "discord_post_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "kustos"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kustos"."members" ADD CONSTRAINT "members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "kustos"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kustos"."members" ADD CONSTRAINT "members_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "kustos"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kustos"."post_tags" ADD CONSTRAINT "post_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "kustos"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kustos"."posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "kustos"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kustos"."related_post" ADD CONSTRAINT "related_post_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "kustos"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kustos"."related_post" ADD CONSTRAINT "related_post_related_post_id_posts_id_fk" FOREIGN KEY ("related_post_id") REFERENCES "kustos"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kustos"."versions" ADD CONSTRAINT "versions_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "kustos"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blob_idx" ON "kustos"."blobs" ("id","post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_idx" ON "kustos"."members" ("user_id","post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tag_idx" ON "kustos"."post_tags" ("post_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "post_idx" ON "kustos"."posts" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "relationship_idx" ON "kustos"."related_post" ("post_id","relationship");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "version_idx" ON "kustos"."versions" ("post_id","version");