import { db } from "@city-os/database/db";
import { APIError } from "better-auth";
import { organization } from "better-auth/plugins";

const checkIfTeamAlreadyExist = async (
  teamName: string,
  organizationId: string
) => {
  // check if team name already exist
  const team = await db.query.teams.findFirst({
    where: (teams, { eq, and }) =>
      and(eq(teams.name, teamName), eq(teams.organizationId, organizationId)),
  });

  if (team) {
    return true;
  }

  return false;
};

export const organizationPlugin = organization({
  teams: {
    enabled: true,
    defaultTeam: {
      enabled: false,
    },
  },

  organizationHooks: {
    // Before creating a team
    beforeCreateTeam: async ({ team, user, organization }) => {
      if (!user) {
        throw new APIError("BAD_REQUEST", {
          message: "User not found",
        });
      }

      if (await checkIfTeamAlreadyExist(team.name, organization.id)) {
        // check if team name already exist
        throw new APIError("BAD_REQUEST", {
          message: "Team name already exists",
        });
      }

      const color = team.color || "#ffffff";

      return {
        data: {
          ...team,
          color,
          createdBy: user.id,
        },
      };
    },
  },
  allowUserToCreateOrganization: () => {
    // TODO: Only Allow Users to create if they don't have an existing organizations
    // Users can only create 1 free organization
    return true;
  },
  schema: {
    team: {
      additionalFields: {
        description: {
          type: "string",
          input: true,
          defaultValue: "",
          required: false,
        },
        color: {
          type: "string",
          input: true,
          defaultValue: "",
          required: false,
        },
        createdBy: {
          type: "string",
          input: false,
          required: true,
        },
      },
    },
  },
});
