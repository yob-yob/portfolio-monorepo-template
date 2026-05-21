import { redirect } from "@sveltejs/kit";
import { backend } from "$lib/api";

export const load = async () => {
  const { data, error } = await backend.api.v1.setup.get();

  if (error) {
    return {
      error: error.value,
    };
  }

  if (!data.shouldSetup) {
    redirect(308, "/");
  }

  return {};
};
