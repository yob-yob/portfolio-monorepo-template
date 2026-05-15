import { db } from "@asset-tracking/database/node/db";
import {
  accounts,
  sessions,
  users,
  verifications,
} from "@asset-tracking/database/schemas/auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not set");
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
  baseURL: "http://localhost:3000/",
  emailAndPassword: { enabled: true },
  secret: process.env.BETTER_AUTH_SECRET,
});
