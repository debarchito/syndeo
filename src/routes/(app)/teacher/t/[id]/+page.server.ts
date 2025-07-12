import type { PageServerLoad } from "./$types";

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
