import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
  const page = Number(url.searchParams.get("p")) || 1;
  const perPage = Number(url.searchParams.get("n")) || 10;
  const search =
    url.searchParams
      .get("s")
      ?.trim()
      ?.replace(/(["\\])/g, "\\$1") || "";
  const tags =
    url.searchParams
      .get("t")
      ?.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag) || [];

  const searchFilter = search
    ? `name~"${search}" || displayName~"${search}" || description~"${search}"`
    : "";

  let filters = "";
  let teacherIds: string[] = [];

  if (tags.length > 0) {
    const tagFilter = tags.map((tag) => `name~"${tag.replace(/(["\\])/g, "\\$1")}"`).join(" || ");
    const matchingTags = await locals.pb.collection("tags").getFullList({
      filter: tagFilter,
    });

    if (matchingTags.length > 0) {
      const tagIds = matchingTags.map((tag) => tag.id);
      const teachersWithTags = await locals.pb.collection("teachers").getFullList({
        filter: tagIds.map((tagId) => `tags~"${tagId}"`).join(" || "),
      });

      teacherIds = teachersWithTags
        .filter((teacher) => {
          const teacherTagIds = teacher.tags || [];
          return tagIds.every((tagId) => teacherTagIds.includes(tagId));
        })
        .map((teacher) => teacher.id);
    }

    if (teacherIds.length > 0) {
      const teacherFilter = teacherIds.map((id) => `id="${id}"`).join(" || ");
      filters = search ? `(${teacherFilter}) && (${searchFilter})` : teacherFilter;
    } else {
      filters = 'id="nonexistent"';
    }
  } else if (search) {
    filters = searchFilter;
  }

  const teachers = await locals.pb.collection("teachers").getList(page, perPage, {
    sort: "-created",
    filter: filters,
    expand: "tags",
  });

  return {
    user: locals.user,
    teacher: locals.teacher,
    teachers: teachers.items,
    totalItems: teachers.totalItems,
    totalPages: teachers.totalPages,
    page: teachers.page,
    perPage: teachers.perPage,
    search,
    tags,
  };
};
