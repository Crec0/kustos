CREATE TABLE IF NOT EXISTS "kustos"."config" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	CONSTRAINT "config_key_unique" UNIQUE("key")
);
--> statement-breakpoint
