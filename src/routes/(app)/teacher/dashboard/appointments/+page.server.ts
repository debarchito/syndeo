import { redirectToMeOnSignIn } from "$lib/customUtils";
import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import isDate from "validator/lib/isDate";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.user) {
    return redirect(307, "/dashboard/appointments");
  }

  if (!locals.teacher) {
    return redirect(307, redirectToMeOnSignIn(url));
  }

  const validStatuses = ["pending", "accepted", "rejected", "cancelled"];
  const status = url.searchParams.get("status") || "pending";

  if (!validStatuses.includes(status)) {
    return fail(400, { message: "Invalid status parameter." });
  }

  const page = Number(url.searchParams.get("p")) || 1;
  const perPage = Number(url.searchParams.get("n")) || 10;

  const appointments = await locals.pb.collection("appointments").getList(page, perPage, {
    filter: `recipient = "${locals.teacher.id}" && status = "${status}"`,
    expand: "sender",
    sort: "-created",
  });

  return {
    teacher: locals.teacher,
    activeAppointments: appointments.items,
    totalItems: appointments.totalItems,
    totalPages: appointments.totalPages,
    page: appointments.page,
    perPage: appointments.perPage,
    status,
  };
};

export const actions: Actions = {
  "schedule-action": async ({ request, locals }) => {
    if (!locals.teacher) {
      return fail(401, { message: "Unauthorized." });
    }

    const formData = await request.formData();
    const action = formData.get("action")?.toString();
    const id = formData.get("id")?.toString();
    const senderId = formData.get("senderId")?.toString();

    if (!action || !id) {
      return fail(400, { message: "Missing action or id." });
    }

    if (action !== "accept" && action !== "reject") {
      return fail(400, { message: "Invalid action." });
    }

    try {
      const appointment = await locals.pb.collection("appointments").getOne(id, {
        expand: "sender",
      });

      if (appointment.expand?.sender.id !== senderId) {
        return fail(400, { message: "Sender ID mismatch." });
      }

      const status = action === "accept" ? "accepted" : "rejected";

      await locals.pb.collection("appointments").update(id, { status });

      if (status === "accepted") {
        await locals.pb.collection("rooms").create({
          name: `${locals.teacher.name}-to-${appointment.expand?.sender.name}`.slice(0, 255),
          appointer: senderId,
          appointee: locals.teacher.id,
        });
      }

      return { message: `Appointment ${status} successfully.` };
    } catch (err) {
      locals.logger.error(err);

      return fail(500, { error: "Failed to update appointment." });
    }
  },
  "update-schedule": async ({ request, locals }) => {
    if (!locals.teacher) {
      return fail(401, { message: "Unauthorized." });
    }

    const formData = await request.formData();
    const id = formData.get("id")?.toString();
    const startsOn = formData.get("startsOn")?.toString();
    const endsOn = formData.get("endsOn")?.toString();

    if (!id || !startsOn || !endsOn) {
      return fail(400, { message: "Missing id, startsOn, or endsOn." });
    }

    if (!isDate(startsOn) || !isDate(endsOn)) {
      return fail(400, { message: "Invalid date format for startsOn or endsOn." });
    }

    try {
      const appointment = await locals.pb.collection("appointments").getOne(id);

      if (appointment.recipient !== locals.teacher.id) {
        return fail(403, { message: "You can only update appointments you're the recipient of." });
      }

      await locals.pb.collection("appointments").update(id, {
        startsOn,
        endsOn,
      });

      return { message: "Appointment schedule updated successfully." };
    } catch (err) {
      locals.logger.error(err);

      return fail(500, { error: "Failed to update appointment schedule." });
    }
  },
};
