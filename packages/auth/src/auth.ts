import { db } from "@city-os/database/db";
// biome-ignore lint/performance/noNamespaceImport: Importing All Tables from Auth Schema is what we need anyways...
import * as authSchema from "@city-os/database/schemas/auth";
import { createId } from "@paralleldrive/cuid2";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { openAPI } from "better-auth/plugins";
import secondaryStorage from "./config/secondary-storage.ts";
import { emailOtpPlugin } from "./plugins/mail-otp.ts";
import { organizationPlugin } from "./plugins/organization.ts";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not set");
}

if (!process.env.DOMAIN) {
  if (process.env.APP_ENV === "production") {
    throw new Error("DOMAIN is not set");
  }

  console.warn("Development mode detected: Only Allowing localhost:*");
} else if (
  process.env.DOMAIN.startsWith("http://") ||
  process.env.DOMAIN.startsWith("https://")
) {
  throw new Error("DOMAIN should not have HTTP:// or HTTPS:// prefixes");
}

const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
    usePlural: true,
  }),
  deferSessionRefresh: true,
  secondaryStorage,
  baseURL: {
    allowedHosts: [
      ...(process.env.APP_ENV === "production" ? [] : ["localhost:*"]),
      ...(process.env.DOMAIN
        ? [`${process.env.DOMAIN}`, `*.${process.env.DOMAIN}`]
        : []),
    ],
    fallback: "http://localhost:3000",
    protocol: process.env.APP_ENV === "development" ? "http" : "https",
  },
  basePath: "/",
  plugins: [openAPI(), organizationPlugin, emailOtpPlugin],
  emailAndPassword: { enabled: true },
  secret: process.env.BETTER_AUTH_SECRET,
  advanced: {
    database: {
      generateId: () => createId(),
    },
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.DOMAIN, // your domain
    },
  },
  session: {
    preserveSessionInDatabase: true,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    deleteUser: {
      enabled: false,
    },
  },
  trustedOrigins: process.env.TRUSTED_DOMAIN
    ? process.env.TRUSTED_DOMAIN.trim()
        .split(",")
        .map((domain) => domain.trim())
    : undefined,
});

export default auth;

export type AuthConfig = typeof auth;
