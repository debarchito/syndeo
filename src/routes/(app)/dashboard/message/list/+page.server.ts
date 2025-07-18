import { redirectToMeOnSignIn } from "$lib/customUtils";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.teacher) {
    return redirect(307, "/teacher/dashboard/message/list");
  }

  if (!locals.user) {
    return redirect(307, redirectToMeOnSignIn(url));
  }

  if (!locals.user.approved) {
    return redirect(307, "/teacher/list");
  }

  const page = Number(url.searchParams.get("p")) || 1;
  const perPage = Number(url.searchParams.get("n")) || 10;
  const rooms = await locals.pb.collection("rooms").getList(page, perPage, {
    filter: `appointer = "${locals.user.id}"`,
    expand: "appointer",
    sort: "-created",
  });

  return {
    user: locals.user,
    activeRooms: rooms.items,
    totalItems: rooms.totalItems,
    totalPages: rooms.totalPages,
    page: rooms.page,
    perPage: rooms.perPage,
  };
};
