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

  const { data, error: getOrganizationError } =
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

  return {
    activeOrganizationSlug: data.slug,
    organizationName: data.name,
  };
};
