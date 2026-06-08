import { authClient } from "@/auth/client";
import { getHeadersCookieAndAuthorizationValues } from "$lib/helpers.js";

export const load = async ({ request }) => {
  //
  const { data: organizations, error: organizationsError } =
    await authClient.organization.list({
      fetchOptions: {
        headers: getHeadersCookieAndAuthorizationValues(request.headers),
      },
    });

  if (organizationsError) {
    //
  }

  const { data: teams, error: teamsError } =
    await authClient.organization.listUserTeams({
      fetchOptions: {
        headers: getHeadersCookieAndAuthorizationValues(request.headers),
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
