import type { PageServerLoad, Actions } from "./$types";
import isDate from "validator/lib/isDate";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, params }) => {
  try {
    return {
      status: 200,
      message: "Success",
      payload: {
        user: locals.user,
        teacher: locals.teacher,
        target: await locals.pb.collection("teachers").getOne(params.id, {
          expand: "tags",
        }),
      },
    };
  } catch (err) {
    locals.logger.error(err);

    return { status: 404, message: "Not Found", payload: null };
  }
};

export const actions: Actions = {
  default: async ({ locals, request }) => {
    if (!locals.user) {
      return fail(405, { message: "Method not allowed." });
    }

    const formData = await request.formData();
    const recipient = formData.get("recipient")?.toString();
    const startsOn = formData.get("startsOn")?.toString() ?? "";
    const endsOn = formData.get("endsOn")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";

    if (!recipient) {
      return fail(400, { message: "Recipient is mandatory." });
    }

    if (!(isDate(startsOn) && isDate(endsOn))) {
      return fail(400, { message: "Invalid date format." });
    }

    if (description.length > 500) {
      return fail(400, { message: "Descripion can be at most 500 chars." });
    }

    try {
      // TODO: Run it in a transaction in future using hooks

      await locals.pb.collection("appointments").create({
        sender: locals.user.id,
        recipient,
        description,
        startsOn,
        endsOn,
        status: "pending",
      });

      await locals.pb.collection("teacher_notifications").create({
        recipient,
        content: `${locals.user.name} requested for an appointment.`,
        type: "schedule",
      });

      return { message: "Appointment request sent successfully." };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      locals.logger.error(err);

      if (err?.status === 400 && err?.data?.message === "Failed to authenticate.") {
        return fail(401, { message: "Invalid credentials." });
      }

      return fail(500, { message: "An unexpected error occurred. Please try again later." });
    }
  },
};
