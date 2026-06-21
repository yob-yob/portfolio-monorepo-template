import {
  ORG_COUNT,
  orgName,
  orgSlug,
  SCENARIO_USERS,
  TEAM_NAMES,
} from "./fixtures.ts";
import {
  insertOrganization,
  insertOrgMember,
  insertTeam,
  insertTeamMember,
  insertUser,
  type SeedOrganization,
  type SeedTeam,
  type SeedUser,
} from "./helpers.ts";

export interface ScenarioUsers {
  user1: SeedUser;
  user2: SeedUser;
  user3: SeedUser;
  user4: SeedUser;
  user5: SeedUser;
}

export type SeededOrg = SeedOrganization & {
  teams: SeedTeam[];
};

export async function seedScenarioUsers(
  passwordHash: string
): Promise<ScenarioUsers> {
  const [user1, user2, user3, user4, user5] = await Promise.all([
    insertUser(
      SCENARIO_USERS.user1.name,
      SCENARIO_USERS.user1.email,
      passwordHash
    ),
    insertUser(
      SCENARIO_USERS.user2.name,
      SCENARIO_USERS.user2.email,
      passwordHash
    ),
    insertUser(
      SCENARIO_USERS.user3.name,
      SCENARIO_USERS.user3.email,
      passwordHash
    ),
    insertUser(
      SCENARIO_USERS.user4.name,
      SCENARIO_USERS.user4.email,
      passwordHash
    ),
    insertUser(
      SCENARIO_USERS.user5.name,
      SCENARIO_USERS.user5.email,
      passwordHash
    ),
  ]);

  return { user1, user2, user3, user4, user5 };
}

export async function seedOrganizationsAndTeams(
  users: ScenarioUsers
): Promise<SeededOrg[]> {
  const seededOrganizations: SeededOrg[] = [];

  for (let orgIndex = 1; orgIndex <= ORG_COUNT; orgIndex++) {
    const owner = orgIndex <= 2 ? users.user4 : users.user3;
    const organization = await insertOrganization(
      orgName(orgIndex),
      orgSlug(orgIndex),
      owner.id
    );

    const seededTeams: SeedTeam[] = [];

    if (orgIndex <= 2) {
      for (const teamName of TEAM_NAMES) {
        const team = await insertTeam(
          teamName,
          organization.id,
          users.user4.id
        );
        seededTeams.push(team);
      }
    } else {
      const teamA = await insertTeam(
        TEAM_NAMES[0],
        organization.id,
        users.user3.id
      );
      seededTeams.push(teamA);

      await insertOrgMember(users.user4.id, organization.id, "admin");

      for (const teamName of TEAM_NAMES.slice(1)) {
        const team = await insertTeam(
          teamName,
          organization.id,
          users.user4.id
        );
        seededTeams.push(team);
      }
    }

    seededOrganizations.push({
      ...organization,
      teams: seededTeams,
    });
  }

  return seededOrganizations;
}

export async function wireScenarioMemberships(
  users: ScenarioUsers,
  organizations: SeededOrg[]
): Promise<void> {
  const org1 = organizations[0];
  const org2 = organizations[1];

  if (!(org1 && org2)) {
    throw new Error("Expected at least two organizations for scenario wiring");
  }

  const org1TeamA = org1.teams[0];
  const org1TeamB = org1.teams[1];
  const org2TeamA = org2.teams[0];
  const org2TeamB = org2.teams[1];

  if (!(org1TeamA && org1TeamB && org2TeamA && org2TeamB)) {
    throw new Error("Expected Team A and Team B in organizations 1 and 2");
  }

  await insertOrgMember(users.user1.id, org1.id, "member", org1TeamA.id);
  await insertOrgMember(users.user1.id, org2.id, "member", org2TeamA.id);

  await insertOrgMember(users.user2.id, org1.id, "member", org1TeamA.id);
  await insertTeamMember(users.user2.id, org1TeamB.id);
  await insertOrgMember(users.user2.id, org2.id, "member", org2TeamA.id);
  await insertTeamMember(users.user2.id, org2TeamB.id);

  for (const organization of organizations) {
    await insertOrgMember(
      users.user5.id,
      organization.id,
      "member",
      organization.teams[0]?.id ?? ""
    );
  }
}
