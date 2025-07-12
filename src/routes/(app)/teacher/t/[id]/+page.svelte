<script lang="ts">
  import { cn } from "$lib/utils";
  import { goto } from "$app/navigation";
  import * as Lucide from "@lucide/svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import { LightSwitch } from "$lib/components/ui/light-switch/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  let { data } = $props();

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

  function handleRequestAppointment() {
    console.log("Request appointment for:", data.payload?.target.name);
  }
</script>

<svelte:head>
  {#if data.status != 200}
    <title>{data.status} | syndeo.</title>?
  {:else}
    <title>{data.payload?.target.displayName || data.payload?.target.name} | syndeo.</title>
  {/if}
</svelte:head>

{#if data.status == 200}
  <div class="bg-background min-h-screen">
    <div class="container mx-auto px-4 py-4 md:py-6">
      <div class="mx-auto max-w-2xl">
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2 md:gap-3">
            <Button
              onclick={() => goto("/teacher/list")}
              variant="outline"
              size="icon"
              class="h-8 w-8 md:h-9 md:w-9"
            >
              <Lucide.ArrowLeft class="size-3 md:size-4" />
            </Button>
            <h1 class="text-lg font-bold md:text-xl">Profile</h1>
          </div>

          <div class="flex items-center gap-2">
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <div
                    class="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm"
                  >
                    {#if data.payload?.user || data.payload?.teacher}
                      {(data.payload?.user?.name ||
                        data.payload?.teacher?.name ||
                        "U")[0].toUpperCase()}
                    {:else}
                      <Lucide.UserX class="size-4" />
                    {/if}
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p>
                    {data.payload?.user
                      ? `Signed in as @${data.payload?.user.name}`
                      : data.payload?.teacher
                        ? `Signed in as @${data.payload?.teacher.name}`
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
                  onclick={() =>
                    goto(data.payload?.user || data.payload?.teacher ? "/sign-out" : "/sign-in")}
                  class={cn(
                    buttonVariants({ variant: "outline" }),
                    "flex h-9 w-9 items-center justify-center rounded-md border shadow-sm transition-shadow hover:shadow-md",
                  )}
                >
                  {#if data.payload?.user || data.payload?.teacher}
                    <Lucide.LogOut class="size-4" />
                  {:else}
                    <Lucide.LogIn class="size-4" />
                  {/if}
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p>{data.payload?.user || data.payload?.teacher ? "Sign out" : "Sign in"}</p>
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>

        <Card.Root class="w-full shadow-sm">
          <Card.Content class="p-4 md:p-6">
            <div class="mb-6 flex flex-col items-center gap-3 text-center md:flex-row md:text-left">
              <div
                class="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full text-lg font-medium md:size-14 md:text-xl"
              >
                {data.payload?.target.name[0].toUpperCase()}
              </div>
              <div class="min-w-0 flex-1">
                <h2 class="text-lg font-bold md:text-xl">
                  {data.payload?.target.displayName || data.payload?.target.name}
                </h2>
                <p class="text-muted-foreground text-sm md:text-base">
                  @{data.payload?.target.name}
                </p>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="mb-2 text-base font-semibold">About</h3>
              <p class="text-muted-foreground text-sm leading-relaxed">
                {data.payload?.target.description || "No description available."}
              </p>
            </div>

            {#if data.payload?.target.expand?.tags && data.payload?.target.expand.tags.length > 0}
              {@const departmentTags = data.payload?.target.expand.tags.filter(
                (tag: { type: string }) => tag.type === "department",
              )}
              {@const subjectTags = data.payload?.target.expand.tags.filter(
                (tag: { type: string }) => tag.type === "subject",
              )}
              {@const classTags = data.payload?.target.expand.tags.filter(
                (tag: { type: string }) => tag.type === "class",
              )}

              {#if departmentTags.length > 0}
                <div class="mb-6">
                  <h3 class="mb-2 text-base font-semibold">Departments</h3>
                  <div class="flex flex-wrap gap-1.5">
                    {#each departmentTags as tag (tag.id)}
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
                </div>
              {/if}

              {#if subjectTags.length > 0}
                <div class="mb-6">
                  <h3 class="mb-2 text-base font-semibold">Subjects</h3>
                  <div class="flex flex-wrap gap-1.5">
                    {#each subjectTags as tag (tag.id)}
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
                </div>
              {/if}

              {#if classTags.length > 0}
                <div class="mb-6">
                  <h3 class="mb-2 text-base font-semibold">Classes</h3>
                  <div class="flex flex-wrap gap-1.5">
                    {#each classTags as tag (tag.id)}
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
                </div>
              {/if}
            {/if}

            <div class="flex justify-center">
              <Button onclick={handleRequestAppointment} size="default">
                <Lucide.Calendar class="size-4" />
                Request Appointment
              </Button>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  </div>
{:else}
  <div class="flex min-h-screen items-center justify-center p-4">
    <Card.Root class="w-full max-w-md shadow-sm">
      <Card.Content class="p-6 md:p-8">
        <div class="flex flex-col items-center space-y-6 text-center">
          <div class="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
            <Lucide.AlertCircle class="size-8 text-red-600 md:size-10 dark:text-red-400" />
          </div>
          <div class="space-y-3">
            <h2 class="text-xl font-bold text-gray-900 md:text-2xl dark:text-gray-100">
              <span class="text-red-600 dark:text-red-400">{data.status}:</span>
              {data.message}
            </h2>
            <p class="text-muted-foreground text-sm md:text-base">
              Continue <a
                href="/teacher/list"
                class="text-primary underline underline-offset-2 hover:no-underline">exploring</a
              >
            </p>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </div>
{/if}
