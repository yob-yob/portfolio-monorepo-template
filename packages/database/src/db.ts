import { drizzle } from "drizzle-orm/bun-sql";
import { schema } from "./schema.ts";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const db = drizzle({
  connection: process.env.DATABASE_URL,
  logger: true,
  schema,
});
