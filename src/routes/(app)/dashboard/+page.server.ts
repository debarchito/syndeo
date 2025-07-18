import { redirectToMeOnSignIn } from "$lib/customUtils";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.teacher) {
    return redirect(307, "/teacher/dashboard");
  }

  if (!locals.user) {
    return redirect(307, redirectToMeOnSignIn(url));
  }

  if (!locals.user.approved) {
    return redirect(307, "/teacher/list");
  }

  return {
    user: locals.user,
  };
};
