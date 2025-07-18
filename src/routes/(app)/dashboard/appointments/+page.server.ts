import { redirectToMeOnSignIn } from "$lib/customUtils";
import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";

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

  const validStatuses = ["pending", "accepted", "rejected", "cancelled"];
  const status = url.searchParams.get("status") || "pending";

  if (!validStatuses.includes(status)) {
    return fail(400, { message: "Invalid status parameter." });
  }

  const page = Number(url.searchParams.get("p")) || 1;
  const perPage = Number(url.searchParams.get("n")) || 10;
  const appointments = await locals.pb.collection("appointments").getList(page, perPage, {
    filter: `sender = "${locals.user.id}" && status = "${status}"`,
    expand: "recipient",
    sort: "-created",
  });

  return {
    user: locals.user,
    activeAppointments: appointments.items,
    totalItems: appointments.totalItems,
    totalPages: appointments.totalPages,
    page: appointments.page,
    perPage: appointments.perPage,
    status,
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, { message: "Unauthorized." });
    }

    const formData = await request.formData();
    const action = formData.get("action")?.toString();
    const id = formData.get("id")?.toString();

    if (!action || !id) {
      return fail(400, { message: "Missing action or id." });
    }

    if (action !== "cancel") {
      return fail(400, { message: "Invalid action." });
    }

    try {
      await locals.pb.collection("appointments").update(id, { status: "cancelled" });

      return { message: "Appointment cancelled successfully." };
    } catch (error) {
      locals.logger.error("Error updating appointment:", error);

      return fail(500, { error: "Failed to update appointment." });
    }
  },
};
