import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/bun-sql/migrator";
import { db } from "./db.ts";

const migrationsFolder = join(
  dirname(fileURLToPath(import.meta.url)),
  "migrations"
);

export async function freshDatabase(): Promise<void> {
  console.log("Dropping Drizzle migration journal...");
  await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE`);

  console.log("Dropping all tables in public schema...");
  await db.execute(sql`
    DO $$ DECLARE
      table_name text;
    BEGIN
      FOR table_name IN
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
      LOOP
        EXECUTE format('DROP TABLE IF EXISTS %I.%I CASCADE', 'public', table_name);
      END LOOP;
    END $$;
  `);

  console.log("Recreating schema from migrations...");
  await migrate(db, { migrationsFolder });

  console.log("Database fresh complete.");

  console.warn(
    "You may also need to clear the cache, by running `bun run cache:clear`"
  );
}
