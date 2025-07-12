<script lang="ts">
  import { cn } from "$lib/utils";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import * as Lucide from "@lucide/svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { TagsInput } from "$lib/components/ui/tags-input";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import * as Pagination from "$lib/components/ui/pagination/index.js";
  import { LightSwitch } from "$lib/components/ui/light-switch/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";

  const { data } = $props();

  let searchQuery = $state(data.search || "");
  let selectedTags = $state(data.tags || []);
  const currentPage = $derived(data.page);
  const perPage = $derived(data.perPage);

  function buildUrl(params: Record<string, string | number | null | string[]>) {
    const url = new URL(page.url);
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            url.searchParams.set(key, value.join(","));
          } else {
            url.searchParams.delete(key);
          }
        } else {
          url.searchParams.set(key, value.toString());
        }
      } else {
        url.searchParams.delete(key);
      }
    });
    return url.toString();
  }

  function handlePageChange(newPage: number) {
    goto(buildUrl({ p: newPage, s: searchQuery.trim() || null, t: selectedTags }));
  }

  function updatePerPage(newPerPage: number) {
    goto(
      buildUrl({
        n: Math.max(1, newPerPage),
        p: 1,
        s: searchQuery.trim() || null,
        t: selectedTags,
      }),
    );
  }

  function clearSearch() {
    searchQuery = "";
    goto(buildUrl({ p: 1, s: null, t: selectedTags }));
  }

  function handleSearch() {
    goto(buildUrl({ p: 1, s: searchQuery.trim() || null, t: selectedTags }));
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      goto(buildUrl({ p: 1, s: searchQuery.trim() || null, t: selectedTags }));
    }
  }

  function handleTagsChange() {
    goto(buildUrl({ p: 1, s: searchQuery.trim() || null, t: selectedTags }));
  }

  function getTagVariant(type: string) {
    switch (type) {
      case "department":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-300 dark:border-blue-400";
      case "subject":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-300 dark:border-green-400";
      case "class":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-300 dark:border-purple-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-300 dark:border-gray-400";
    }
  }
</script>

<svelte:head>
  <title>Explore teachers | syndeo.</title>
</svelte:head>

<div class="flex flex-col items-center justify-center gap-4 p-4 md:gap-6 md:p-10">
  <div class="flex w-full max-w-4xl flex-col gap-4 md:gap-6">
    <div class="flex items-center justify-between text-4xl font-medium select-none md:text-6xl">
      <a class="flex items-center gap-2" href="/">
        <div
          class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full shadow-md transition-transform duration-200 hover:scale-105 md:size-8"
        >
          <Lucide.CalendarSync class="size-3 md:size-5" />
        </div>
        <span class="font-ms-madi mr-2 mb-2 md:mr-4 md:mb-4">syndeo.</span>
      </a>

      <div class="flex items-center gap-2">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <div
                class="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm"
              >
                {#if data.user || data.teacher}
                  {(data.user?.name || data.teacher?.name || "U")[0].toUpperCase()}
                {:else}
                  <Lucide.UserX class="size-4" />
                {/if}
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>
                {data.user
                  ? `Signed in as @${data.user.name}`
                  : data.teacher
                    ? `Signed in as @${data.teacher.name}`
                    : "You are currently not signed in"}
              </p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>

        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <div class="flex h-9 items-center"><LightSwitch /></div>
            </Tooltip.Trigger>
            <Tooltip.Content><p>Switch theme</p></Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>

        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger
              onclick={() => goto(data.user || data.teacher ? "/sign-out" : "/sign-in")}
              class={cn(
                buttonVariants({ variant: "outline" }),
                "flex h-9 w-9 items-center justify-center rounded-md border shadow-sm transition-shadow hover:shadow-md",
              )}
            >
              {#if data.user || data.teacher}
                <Lucide.LogOut class="size-4" />
              {:else}
                <Lucide.LogIn class="size-4" />
              {/if}
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>{data.user || data.teacher ? "Sign out" : "Sign in"}</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="bg-background flex items-center gap-0 rounded-lg border">
        <div class="relative flex-1">
          <Lucide.Search
            class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            bind:value={searchQuery}
            onkeydown={handleKeydown}
            placeholder="Search teachers by name or description..."
            class="h-12 border-0 bg-transparent pr-10 pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {#if searchQuery}
            <Button
              onclick={clearSearch}
              variant="ghost"
              size="icon"
              class="absolute top-1/2 right-3 size-6 -translate-y-1/2"
            >
              <Lucide.X class="size-3" />
            </Button>
          {/if}
        </div>
        <Button
          onclick={handleSearch}
          variant="default"
          size="icon"
          class="h-12 w-12 flex-shrink-0 rounded-l-none"
        >
          <Lucide.Search class="size-4" />
        </Button>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex-1">
          <TagsInput
            bind:value={selectedTags}
            placeholder="Filter by tags"
            onchange={handleTagsChange}
          />
        </div>

        <div class="flex items-center gap-1 rounded-lg border p-1">
          <Button
            onclick={() => updatePerPage(perPage - 1)}
            disabled={perPage <= 1}
            variant="ghost"
            size="icon"
            class="size-8"
          >
            <Lucide.Minus class="size-3" />
          </Button>
          <span class="px-3 py-1 text-sm font-medium">{perPage} teachers</span>
          <Button
            onclick={() => updatePerPage(perPage + 1)}
            variant="ghost"
            size="icon"
            class="size-8"
          >
            <Lucide.Plus class="size-3" />
          </Button>
        </div>
      </div>
    </div>

    {#if !data.teachers.length}
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <div class="bg-muted mb-4 rounded-full p-3 sm:p-4">
          <Lucide.User class="text-muted-foreground size-6 sm:size-8" />
        </div>
        <h3 class="text-muted-foreground mb-2 text-base font-medium sm:text-lg">
          No teachers found
        </h3>
        <p class="text-muted-foreground max-w-md text-xs sm:text-sm">
          {searchQuery || selectedTags.length > 0
            ? "No teachers match your search criteria. Try a different search or"
            : "No teachers are available right now. Please"} check back later.
        </p>
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each data.teachers as teacher (teacher.id)}
          <Card.Root
            class="group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
          >
            <a href={`/teacher/${teacher.id}`} class="block h-full">
              <Card.CardHeader class="pb-4">
                <div class="flex items-start gap-3">
                  <div
                    class="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full text-lg font-medium"
                  >
                    {teacher.name[0].toUpperCase()}
                  </div>
                  <div class="min-w-0 flex-1">
                    <Card.CardTitle
                      class="group-hover:text-primary flex min-w-0 flex-1 items-center gap-2 text-lg transition-colors"
                    >
                      <span class="block truncate overflow-hidden whitespace-nowrap">
                        {teacher.displayName || teacher.name}
                      </span>
                    </Card.CardTitle>
                    <Card.CardDescription class="text-muted-foreground text-sm">
                      @{teacher.name}
                    </Card.CardDescription>
                  </div>
                </div>
              </Card.CardHeader>
              <Card.CardContent class="pt-0">
                <p class="mb-3 line-clamp-3 text-sm leading-relaxed overflow-ellipsis">
                  {teacher.description || "No description available."}
                </p>
                {#if teacher.expand?.tags && teacher.expand.tags.length > 0}
                  <div class="flex flex-wrap gap-1">
                    {#each teacher.expand.tags as tag (tag.id)}
                      <span
                        class={cn(
                          "rounded-full border px-2 py-1 text-xs font-medium",
                          getTagVariant(tag.type),
                        )}
                      >
                        {tag.name}
                      </span>
                    {/each}
                  </div>
                {/if}
              </Card.CardContent>
            </a>
          </Card.Root>
        {/each}
      </div>

      {#if data.totalPages > 1}
        <div class="flex justify-center">
          <Pagination.Root count={data.totalItems} perPage={data.perPage} page={currentPage}>
            {#snippet children({ pages, currentPage: paginationCurrentPage })}
              <Pagination.Content>
                <Pagination.Item>
                  <Pagination.PrevButton
                    onclick={() => handlePageChange(paginationCurrentPage - 1)}
                    disabled={paginationCurrentPage === 1}
                  />
                </Pagination.Item>
                {#each pages as page (page.key)}
                  <Pagination.Item>
                    {#if page.type === "ellipsis"}
                      <Pagination.Ellipsis />
                    {:else}
                      <Pagination.Link
                        {page}
                        isActive={paginationCurrentPage === page.value}
                        onclick={() => handlePageChange(page.value)}
                      >
                        {page.value}
                      </Pagination.Link>
                    {/if}
                  </Pagination.Item>
                {/each}
                <Pagination.Item>
                  <Pagination.NextButton
                    onclick={() => handlePageChange(paginationCurrentPage + 1)}
                    disabled={paginationCurrentPage === data.totalPages}
                  />
                </Pagination.Item>
              </Pagination.Content>
            {/snippet}
          </Pagination.Root>
        </div>
      {/if}
    {/if}
  </div>
</div>
