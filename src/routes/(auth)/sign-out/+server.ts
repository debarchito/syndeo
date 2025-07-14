import type { RequestHandler } from "./$types";
import { redirect } from "@sveltejs/kit";

const getRedirectUrl = (url: URL) => {
  const redirectTo = url.searchParams.get("redirect-to");
  return redirectTo ? `/${redirectTo.slice(1)}` : "/sign-in";
};

export const GET: RequestHandler = async ({ locals, url }) => {
  if (!(locals.user || locals.teacher)) {
    return redirect(307, getRedirectUrl(url));
  }

  locals.pb.authStore.clear();
  locals.user = null;
  locals.teacher = null;

  return redirect(307, getRedirectUrl(url));
};
