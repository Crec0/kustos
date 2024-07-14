DROP INDEX IF EXISTS "version_idx";--> statement-breakpoint
ALTER TABLE "kustos"."mc_versions" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mc_version_idx" ON "kustos"."mc_versions" USING hash ("version");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "versions_post_idx" ON "kustos"."versions" USING hash ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "version_idx" ON "kustos"."versions" USING gist ("versions");