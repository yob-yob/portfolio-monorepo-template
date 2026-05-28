import { redirect } from "@sveltejs/kit";
import { authClient } from "@/auth/client";

export const load = async ({ locals, request }) => {
  if (!(locals.user && locals.session)) {
    redirect(307, "/auth/login");
  }

  if (!locals.session.activeOrganizationId) {
    // Redirect to organization selection page
    redirect(307, "/select-organization");
  }

  const { data, error } = await authClient.organization.getFullOrganization({
    query: {
      organizationId: locals.session.activeOrganizationId,
    },
    fetchOptions: {
      headers: request.headers,
    },
  });

  if (error) {
    //
  }

  return {
    user: locals.user,
    session: locals.session,
    activeOrganizationSlug: data?.slug,
  };
};
