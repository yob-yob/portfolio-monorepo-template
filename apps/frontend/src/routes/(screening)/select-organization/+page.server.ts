import { authClient } from "@/auth/client";

export const load = async ({ request }) => {
  //
  const { data: organizations, error: organizationsError } =
    await authClient.organization.list({
      fetchOptions: {
        headers: request.headers,
      },
    });

  if (organizationsError) {
    //
  }

  const { data: teams, error: teamsError } =
    await authClient.organization.listUserTeams({
      fetchOptions: {
        headers: request.headers,
      },
    });

  if (teamsError) {
    // teams = [];
  }

  return {
    organizations,
    teams,
  };
};
