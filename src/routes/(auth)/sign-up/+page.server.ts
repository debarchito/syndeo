import { isValidName, isValidDisplayName, isValidPassword } from "$lib/customUtils.js";
import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import isEmail from "validator/lib/isEmail";

const getRedirectUrl = (url: URL) => {
  const redirectTo = url.searchParams.get("redirect-to");
  return redirectTo ? `/${redirectTo.slice(1)}` : "/explore";
};

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.user || locals.teacher) {
    return redirect(307, getRedirectUrl(url));
  }

  return {};
};

export const actions: Actions = {
  default: async ({ locals, request, url }) => {
    if (locals.user || locals.teacher) {
      return fail(405, { message: "Method not allowed." });
    }

    const formData = await request.formData();
    const email = formData.get("email")?.toString() || "";
    const name = formData.get("name")?.toString() || "";
    const displayName = formData.get("displayName")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!isEmail(email)) {
      return fail(400, { message: "Invalid email format." });
    }

    if (!isValidName(name)) {
      return fail(400, {
        message: "Name must be 3 to 255 chars and only use a-z, 0-9, _ or -.",
      });
    }

    if (!isValidDisplayName(displayName)) {
      return fail(400, {
        message: "Display name can be at-most 255 chars.",
      });
    }

    if (!isValidPassword(password)) {
      return fail(400, {
        message:
          "Password must be at-least 8 chars and include a-z, A-Z, 0-9, and a special character.",
      });
    }

    try {
      await locals.pb.collection("users").create({
        email,
        name,
        displayName,
        password,
        passwordConfirm: password,
      });

      await locals.pb.collection("users").authWithPassword(email, password);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      locals.logger.error(err);

      if (err?.status === 400 && err?.data?.message === "Failed to authenticate.") {
        return fail(401, { message: "Invalid credentials." });
      }

      return fail(500, { message: "An unexpected error occurred. Please try again later." });
    }

    return redirect(307, getRedirectUrl(url));
  },
};
