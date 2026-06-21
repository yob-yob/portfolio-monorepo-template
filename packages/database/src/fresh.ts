import { freshDatabase } from "./fresh-database.ts";

freshDatabase().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Fresh failed: ${message}`);
  process.exit(1);
});
