import { drizzle } from "drizzle-orm/bun-sql";
import { schema } from "./schema.ts";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

let LoggerEnabled = false;

if (
  process.env.DATABASE_LOGGER_ENABLED &&
  process.env.DATABASE_LOGGER_ENABLED === "true"
) {
  LoggerEnabled = true;
}

export const db = drizzle({
  connection: process.env.DATABASE_URL,
  logger: LoggerEnabled,
  schema,
});
