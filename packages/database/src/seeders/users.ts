import { seed } from "drizzle-seed";
import { db } from "../db.ts";
import * as auth from "../schemas/auth.ts";

export async function main() {
  await seed(db, { auth });
}

main();
