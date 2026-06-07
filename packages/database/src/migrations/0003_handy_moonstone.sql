ALTER TABLE "teams" ADD COLUMN "description" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "created_by" text;

-- EXTRA STEPS!
UPDATE "teams" 
SET "created_by" = (SELECT "user_id" FROM "members" where "organization_id" = "teams"."organization_id" LIMIT 1) 
WHERE "created_by" IS NULL;

ALTER TABLE "teams" ALTER COLUMN "created_by" SET NOT NULL;