<script lang="ts">
  import { page } from "$app/state";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import * as Lucide from "@lucide/svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { redirectToMeOnSignIn } from "$lib/customUtils.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { LightSwitch } from "$lib/components/ui/light-switch/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Pagination from "$lib/components/ui/pagination/index.js";

  const { data } = $props();

  const currentPage = $derived(data.page);
  const perPage = $derived(data.perPage || 10);

  function buildUrl(params: Record<string, string | number | null>) {
    const url = new URL(page.url);
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) {
        url.searchParams.set(key, value.toString());
      } else {
        url.searchParams.delete(key);
      }
    });
    return url.toString();
  }

  function handlePageChange(newPage: number) {
    goto(buildUrl({ p: newPage }));
  }

  function updatePerPage(newPerPage: number) {
    goto(
      buildUrl({
        n: Math.max(1, newPerPage),
        p: 1,
      }),
    );
  }
</script>

<svelte:head>
  <title>My Messages | syndeo.</title>
</svelte:head>

<div class="bg-background min-h-screen">
  <div class="container mx-auto px-4 py-4 md:py-6">
    <div class="mx-auto max-w-4xl">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2 md:gap-3">
          <Button
            onclick={() => goto("/dashboard")}
            variant="outline"
            size="icon"
            class="h-8 w-8 md:h-9 md:w-9"
          >
            <Lucide.ArrowLeft class="size-3 md:size-4" />
          </Button>
          <h1 class="text-lg font-bold md:text-xl">My Messages</h1>
        </div>

        <div class="flex items-center gap-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              {#snippet child({ props })}
                <Button {...props} variant="ghost" size="icon" class="h-9 w-9">
                  <div
                    class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-sm"
                  >
                    {data.user?.name[0].toUpperCase()}
                  </div>
                </Button>
              {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="w-56" align="end">
              <DropdownMenu.Label>
                Signed in as @{data.user?.name}
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Item>
                <div class="flex items-center gap-2">
                  <Lucide.Palette class="size-4" />
                  <span>Switch theme</span>
                </div>
                <div class="ml-auto">
                  <LightSwitch />
                </div>
              </DropdownMenu.Item>
              <DropdownMenu.Item onclick={() => goto("/teacher/list")}>
                <div class="flex items-center gap-2">
                  <Lucide.Users class="size-4" />
                  <span>Browse Teachers</span>
                </div>
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onclick={() => goto(redirectToMeOnSignIn(page.url, "/sign-out"))}>
                <div class="flex items-center gap-2">
                  <Lucide.LogOut class="size-4" />
                  <span>Sign out</span>
                </div>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>

      <div class="mb-4 flex items-center justify-end md:justify-end">
        <div class="flex w-full items-center gap-1 rounded-lg border p-1 md:w-auto">
          <Button
            onclick={() => updatePerPage(perPage - 1)}
            disabled={perPage <= 1}
            variant="ghost"
            size="icon"
            class="size-8"
          >
            <Lucide.Minus class="size-3" />
          </Button>
          <span class="flex-1 px-3 py-1 text-center text-sm font-medium md:flex-none md:text-left">
            {perPage}
            <span class="hidden sm:inline">items</span>
          </span>
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

      <div class="space-y-4">
        {#if data.activeRooms && data.activeRooms.length > 0}
          {#each data.activeRooms as room (room.id)}
            <Card.Root class="shadow-md">
              <Card.Content class="p-4 md:p-6">
                <div class="flex items-start gap-3">
                  <div
                    class="flex size-10 items-center justify-center rounded-full bg-green-100 text-green-800"
                  >
                    <Lucide.MessageCircle class="size-5" />
                  </div>
                  <button
                    class="flex-1 text-left"
                    onclick={() => goto(`/dashboard/message/${room.id}`)}
                  >
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <h3 class="text-sm font-semibold md:text-lg">
                          {room.name || "Unnamed Room"}
                        </h3>
                      </div>
                    </div>
                    <p class="text-muted-foreground text-xs md:text-sm">
                      {new Date(room.created).toLocaleDateString()} at {new Date(
                        room.created,
                      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </button>
                  <Button
                    variant="outline"
                    size="icon"
                    class="h-8 w-8"
                    onclick={() => goto(`/dashboard/message/${room.id}`)}
                  >
                    <Lucide.MessageCircle class="size-4" />
                  </Button>
                </div>

                <form id={`room-form-${room.id}`} method="POST" style="display: none;" use:enhance>
                  <input type="hidden" name="action" value="leave" />
                  <input type="hidden" name="id" value={room.id} />
                </form>
              </Card.Content>
            </Card.Root>
          {/each}
        {:else}
          <Card.Root class="shadow-md">
            <Card.Content class="p-8 text-center">
              <div class="mb-4 flex justify-center">
                <div
                  class="flex size-16 items-center justify-center rounded-full bg-gray-100 text-gray-400"
                >
                  <Lucide.MessageCircle class="size-8" />
                </div>
              </div>
              <h3 class="mb-2 text-lg font-semibold">No rooms</h3>
              <p class="text-muted-foreground text-sm">When you join rooms, they'll appear here.</p>
            </Card.Content>
          </Card.Root>
        {/if}

        {#if data.totalPages && data.totalPages > 1}
          <div class="flex justify-center">
            <Pagination.Root count={data.totalItems || 0} {perPage} page={currentPage}>
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
                      disabled={paginationCurrentPage === (data.totalPages || 0)}
                    />
                  </Pagination.Item>
                </Pagination.Content>
              {/snippet}
            </Pagination.Root>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
