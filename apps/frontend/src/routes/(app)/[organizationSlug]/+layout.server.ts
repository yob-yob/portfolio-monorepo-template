import { error, redirect } from "@sveltejs/kit";
import { authClient } from "@/auth/client";

export const load = async ({ locals, request, params }) => {
  if (!(locals.user && locals.session)) {
    redirect(307, "/auth/login");
  }

  if (!locals.session.activeOrganizationId) {
    // Redirect to organization selection page
    redirect(307, "/select-organization");
  }

  if (!locals.session.activeTeamId) {
    // Redirect to organization selection page
    redirect(307, "/select-organization");
  }

  const { data: getOrganizationData, error: getOrganizationError } =
    await authClient.organization.getFullOrganization({
      query: {
        organizationSlug: params.organizationSlug,
        membersLimit: 0, // we don't need this...
      },
      fetchOptions: {
        headers: request.headers,
      },
    });

  if (getOrganizationError) {
    // 404 error
    error(getOrganizationError.status, {
      code: getOrganizationError.code ?? "NOT_FOUND",
      message: getOrganizationError.message ?? "Organization Not Found",
    });
  }

  const { data: userTeamsData, error: userTeamsError } =
    await authClient.organization.listUserTeams({
      fetchOptions: {
        headers: request.headers,
      },
    });

  if (userTeamsError) {
    error(userTeamsError.status, {
      code: userTeamsError.code ?? "NOT_FOUND",
      message: userTeamsError.message ?? "User Teams Not Found",
    });
  }

  return {
    activeOrganizationSlug: getOrganizationData.slug,
    organizationName: getOrganizationData.name,
    activeTeamId: locals.session.activeTeamId,
    userTeams: userTeamsData.filter(
      (team) => team.organizationId === getOrganizationData.id
    ), // filter to only show this user's organization
    organization: getOrganizationData,
  };
};
