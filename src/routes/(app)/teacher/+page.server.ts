import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
  return redirect(307, "/teacher/list");
};
