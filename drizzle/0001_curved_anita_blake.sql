ALTER TABLE "kustos"."versions" ADD COLUMN IF NOT EXISTS "versions" int4range NOT NULL;--> statement-breakpoint
ALTER TABLE "kustos"."versions" DROP COLUMN IF EXISTS "version";--> statement-breakpoint
DROP INDEX IF EXISTS "version_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "post_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "version_idx" ON "kustos"."versions" using GiST ("versions");
CREATE INDEX IF NOT EXISTS "post_idx" ON "kustos"."versions" ("post_id");