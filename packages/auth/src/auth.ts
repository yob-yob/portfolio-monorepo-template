import { db } from "@asset-tracking/database/node/db";
// biome-ignore lint/performance/noNamespaceImport: Importing All Tables from Auth Schema is what we need anyways...
import * as authSchema from "@asset-tracking/database/schemas/auth";
import { redisStorage } from "@better-auth/redis-storage";
import { createId } from "@paralleldrive/cuid2";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { openAPI, organization } from "better-auth/plugins";
import { Redis } from "ioredis";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not set");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const redis = new Redis({
  host: "localhost",
  port: 6379,
  db: 3,
});

export default betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
    usePlural: true,
  }),
  deferSessionRefresh: true,
  secondaryStorage: redisStorage({
    client: redis,
    keyPrefix: "asset-tracking:auth:",
  }),
  baseURL: {
    allowedHosts: ["http://localhost:*"],
    fallback: "http://localhost:3000",
  },
  basePath: "/",
  plugins: [openAPI(), organization()],
  emailAndPassword: { enabled: true },
  secret: process.env.BETTER_AUTH_SECRET,
  advanced: {
    database: {
      generateId: () => createId(),
    },
  },
  session: {
    preserveSessionInDatabase: true,
  },
});
