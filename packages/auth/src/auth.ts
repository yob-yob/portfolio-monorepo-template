import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@asset-tracking/database/node/db"
import { auth } from "@asset-tracking/database/schemas";

export default betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: auth,
    usePlural: true,
  }),
  baseURL: "http://localhost:3000/",
  emailAndPassword: { enabled: true },
});
