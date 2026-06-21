import {
  fillerEmail,
  fillerName,
  MEMBERS_PER_TEAM,
  ORG_COUNT,
  TEAMS_PER_ORG,
} from "./fixtures.ts";
import { insertOrgMember, insertUser } from "./helpers.ts";
import type { SeededOrg } from "./scenario-users.ts";

export async function seedBulkData(
  organizations: SeededOrg[],
  passwordHash: string
): Promise<number> {
  let fillerCount = 0;

  for (let orgIndex = 1; orgIndex <= ORG_COUNT; orgIndex++) {
    const organization = organizations[orgIndex - 1];

    if (!organization) {
      throw new Error(`Missing organization at index ${orgIndex}`);
    }

    for (let teamIndex = 1; teamIndex <= TEAMS_PER_ORG; teamIndex++) {
      const team = organization.teams[teamIndex - 1];

      if (!team) {
        throw new Error(
          `Missing team ${teamIndex} in organization ${organization.slug}`
        );
      }

      for (
        let memberIndex = 1;
        memberIndex <= MEMBERS_PER_TEAM;
        memberIndex++
      ) {
        const email = fillerEmail(orgIndex, teamIndex, memberIndex);
        const name = fillerName(orgIndex, teamIndex, memberIndex);
        const user = await insertUser(name, email, passwordHash);

        await insertOrgMember(user.id, organization.id, "member", team.id);
        fillerCount += 1;
      }
    }
  }

  return fillerCount;
}
