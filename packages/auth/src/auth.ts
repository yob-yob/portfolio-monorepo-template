import { redisStorage } from "@better-auth/redis-storage";
import { db } from "@city-os/database/node/db";
// biome-ignore lint/performance/noNamespaceImport: Importing All Tables from Auth Schema is what we need anyways...
import * as authSchema from "@city-os/database/schemas/auth";
import { createId } from "@paralleldrive/cuid2";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { openAPI } from "better-auth/plugins";
import { Redis } from "ioredis";
import { emailOtpPlugin } from "./plugins/mail-otp.ts";
import { organizationPlugin } from "./plugins/organization.ts";

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
    keyPrefix: "city-os:auth:",
  }),
  baseURL: {
    allowedHosts: ["http://localhost:*"],
    fallback: "http://localhost:3000",
  },
  basePath: "/",
  plugins: [openAPI(), organizationPlugin, emailOtpPlugin],
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
  user: {
    changeEmail: {
      enabled: true,
    },
    deleteUser: {
      enabled: false,
    },
  },
});
