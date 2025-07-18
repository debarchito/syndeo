import type { PageServerLoad, Actions } from "./$types";
import { env } from "$env/dynamic/private";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, request, params }) => {
  if (locals.teacher) {
    return redirect(307, "/teacher/dashboard/message/list");
  }

  if (!locals.user) {
    return redirect(307, "/teacher/list");
  }

  try {
    const room = await locals.pb.collection("rooms").getOne(params.id, {
      expand: "appointee",
    });
    const messages = await locals.pb.collection("messages").getList(1, 10, {
      filter: `room = "${room.id}"`,
      expand: "from_teacher",
      sort: "-created",
    });

    return {
      status: 200,
      message: "Success",
      payload: {
        user: locals.user,
        room,
        messages: {
          ...messages,
          items: messages.items.reverse(),
        },
        POCKETBASE_URL: env.POCKETBASE_URL,
        COOKIE: request.headers.get("cookie"),
      },
    };
  } catch (err) {
    locals.logger.error(err);

    return { status: 404, message: "Not Found", payload: null };
  }
};

export const actions: Actions = {
  "load-more": async ({ request, locals, params }) => {
    if (!locals.user) {
      return { status: 405, message: "Unauthorized", payload: null };
    }

    const formData = await request.formData();
    const page = parseInt(formData.get("page")?.toString() ?? "1");
    const perPage = parseInt(formData.get("perPage")?.toString() ?? "10");

    try {
      const messages = await locals.pb.collection("messages").getList(page, perPage, {
        filter: `room = "${params.id}"`,
        expand: "from_teacher",
        sort: "-created",
      });

      return {
        status: 200,
        message: "Success",
        messages: {
          ...messages,
          items: messages.items.reverse(),
        },
      };
    } catch (err) {
      locals.logger.error(err);

      return { status: 500, message: "Failed to load messages", messages: null };
    }
  },
  message: async ({ request, locals, params }) => {
    if (!locals.user) {
      return {
        status: 401,
        message: "Method not allowed",
        payload: null,
      };
    }

    const formData = await request.formData();
    const to_teacher = formData.get("to_teacher")?.toString();
    let content = formData.get("content")?.toString();

    if (!to_teacher || !content) {
      return {
        status: 400,
        message: "Missing required fields",
        payload: null,
      };
    }

    content = content
      .replace(/[<>\\]/g, (char) => {
        const replacements = {
          "<": "&lt;",
          ">": "&gt;",
          "\\": "&#92;",
        };
        return replacements[char as keyof typeof replacements];
      })
      .replace(
        /(?<![\\])\[(.*?)\]/g,
        '<a href="$1" class="underline" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      .replace(/(?<![\\])\*(.*?)(?<![\\])\*/g, "<strong>$1</strong>")
      .replace(/(?<![\\])_(.*?)(?<![\\])_/g, "<em>$1</em>")
      .replace(/(?<![\\])~(.*?)(?<![\\])~/g, "<del>$1</del>")
      .replace(/(?<![\\])__(.*?)(?<![\\])__/g, "<u>$1</u>")
      .replace(/\\\*/g, "*")
      .replace(/\\_/g, "_")
      .replace(/\\~/g, "~")
      .replace(/\\__/g, "__")
      .replace(/\\\[/g, "[")
      .replace(/\\\]/g, "]");

    try {
      const message = await locals.pb.collection("messages").create({
        room: params.id,
        content,
        from_user: locals.user.id,
        to_teacher,
      });

      return {
        status: 200,
        message: "Message sent successfully",
        payload: { message },
      };
    } catch (err) {
      locals.logger.error(err);

      return { status: 500, message: "Failed to send message", payload: null };
    }
  },
};
