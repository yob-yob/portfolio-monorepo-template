import { db } from "@asset-tracking/database/node/db";
import {
  accounts,
  sessions,
  users,
  verifications,
} from "@asset-tracking/database/schemas/auth";
import { createId } from "@paralleldrive/cuid2";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { openAPI } from "better-auth/plugins";
// biome-ignore lint/correctness/noUnresolvedImports: False Positive
import { redis } from "bun";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not set");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      accounts,
      sessions,
      users,
      verifications,
    },
    usePlural: true,
  }),
  deferSessionRefresh: true,
  secondaryStorage: {
    get: async (key) => await redis.get(`better-auth:${key}`),
    set: async (key, value, ttl) => {
      if (ttl) {
        await redis.set(`better-auth:${key}`, value);
        await redis.expire(`better-auth:${key}`, ttl);
      } else {
        await redis.set(`better-auth:${key}`, value);
      }
    },
    delete: async (key) => {
      await redis.del(`better-auth:${key}`);
    },
  },
  baseURL: {
    allowedHosts: ["http://localhost:*"],
    fallback: "http://localhost:3000",
  },
  basePath: "/",
  plugins: [openAPI()],
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
