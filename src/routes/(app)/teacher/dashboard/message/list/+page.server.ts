import { redirectToMeOnSignIn } from "$lib/customUtils";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.user) {
    return redirect(307, "/dashboard/message/list");
  }

  if (!locals.teacher) {
    return redirect(307, redirectToMeOnSignIn(url));
  }

  const page = Number(url.searchParams.get("p")) || 1;
  const perPage = Number(url.searchParams.get("n")) || 10;
  const rooms = await locals.pb.collection("rooms").getList(page, perPage, {
    filter: `appointee = "${locals.teacher.id}"`,
    expand: "appointee",
    sort: "-created",
  });

  return {
    teacher: locals.teacher,
    activeRooms: rooms.items,
    totalItems: rooms.totalItems,
    totalPages: rooms.totalPages,
    page: rooms.page,
    perPage: rooms.perPage,
  };
};
