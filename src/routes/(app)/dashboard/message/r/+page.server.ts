import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.teacher) {
    return redirect(307, "/teacher/dashboard/message/list");
  }

  if (locals.user) {
    return redirect(307, "/dashboard/message/list");
  }

  return redirect(307, "/teacher/list");
};
