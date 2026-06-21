import { db } from "../db.ts";
import { requireEnv } from "../env.ts";
import { freshDatabase } from "../fresh-database.ts";
import { users } from "../schemas/auth.ts";
import { seedBulkData } from "./bulk-data.ts";
import { ORG_COUNT, SCENARIO_USERS, TEAM_NAMES } from "./fixtures.ts";
import { hashSeedPassword } from "./helpers.ts";
import {
  seedOrganizationsAndTeams,
  seedScenarioUsers,
  wireScenarioMemberships,
} from "./scenario-users.ts";

async function assertDatabaseEmpty(): Promise<void> {
  const existing = await db.select().from(users).limit(1);

  if (existing.length > 0) {
    throw new Error("Refusing to seed: database is not empty.");
  }
}

async function main(): Promise<void> {
  requireEnv(
    "DATABASE_URL",
    "DATABASE_URL is required to run the database seeder"
  );
  const password = requireEnv(
    "SEED_PASSWORD",
    "SEED_PASSWORD is required to run the database seeder"
  );

  const shouldFresh = process.argv.includes("--fresh");

  if (shouldFresh) {
    await freshDatabase();
  } else {
    await assertDatabaseEmpty();
  }

  const passwordHash = await hashSeedPassword(password);

  console.log("Creating scenario users...");
  const scenarioUsers = await seedScenarioUsers(passwordHash);

  console.log("Creating organizations and teams...");
  const organizations = await seedOrganizationsAndTeams(scenarioUsers);

  console.log("Creating filler users and team memberships...");
  const fillerCount = await seedBulkData(organizations, passwordHash);

  console.log("Wiring scenario user memberships...");
  await wireScenarioMemberships(scenarioUsers, organizations);

  const totalUsers = fillerCount + Object.keys(SCENARIO_USERS).length;

  console.log("");
  console.log("Seed complete.");
  console.log(`  Organizations: ${ORG_COUNT}`);
  console.log(`  Teams per org: ${TEAM_NAMES.join(", ")}`);
  console.log(`  Filler users: ${fillerCount}`);
  console.log(`  Scenario users: ${Object.keys(SCENARIO_USERS).length}`);
  console.log(`  Total users: ${totalUsers}`);
  console.log("");
  console.log("Scenario accounts:");
  console.log(`  User-1: ${SCENARIO_USERS.user1.email}`);
  console.log(`  User-2: ${SCENARIO_USERS.user2.email}`);
  console.log(`  User-3: ${SCENARIO_USERS.user3.email} (owner of orgs 3–5)`);
  console.log(`  User-4: ${SCENARIO_USERS.user4.email} (owner of orgs 1–2)`);
  console.log(`  User-5: ${SCENARIO_USERS.user5.email} (member of all orgs)`);
  console.log("");
  console.log("Sign in with any seeded email using SEED_PASSWORD.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Seed failed: ${message}`, error);
  process.exit(1);
});
