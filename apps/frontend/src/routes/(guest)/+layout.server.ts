import { redirect } from "@sveltejs/kit";

export const load = ({ locals }) => {
  if (locals.user && locals.session) {
    redirect(307, "/");
  }

  return {};
};
