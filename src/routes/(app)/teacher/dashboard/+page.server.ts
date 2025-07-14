import { redirectToMeOnSignIn } from "$lib/customUtils";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.user) {
    return redirect(307, "/dashboard");
  }

  if (!locals.teacher) {
    return redirect(307, redirectToMeOnSignIn(url));
  }

  return {
    teacher: locals.teacher,
  };
};
