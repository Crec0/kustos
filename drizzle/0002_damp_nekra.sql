CREATE TABLE IF NOT EXISTS "kustos"."mc_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"version" text NOT NULL,
	"is_snapshot" boolean NOT NULL,
	CONSTRAINT "mc_versions_version_unique" UNIQUE("version")
);

DROP INDEX IF EXISTS "kustos"."mc_version_idx";
CREATE INDEX "mc_version_idx" ON "kustos"."mc_versions" USING HASH ("version");