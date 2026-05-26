import { redirect } from "@sveltejs/kit";

export const load = ({ locals }) => {
  if (!(locals.user && locals.session)) {
    redirect(307, "/auth/login");
  }

  if (!locals.session.activeOrganizationId) {
    // Redirect to organization selection page
    redirect(307, "/select-organization");
  }

  return {
    user: locals.user,
    session: locals.session,
  };
};
