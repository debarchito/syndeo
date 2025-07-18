<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import * as Lucide from "@lucide/svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { LightSwitch } from "$lib/components/ui/light-switch/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { redirectToMeOnSignIn } from "$lib/customUtils";

  const { data } = $props();
</script>

<svelte:head>
  <title>Dashboard | syndeo.</title>
</svelte:head>

<div class="bg-background min-h-screen">
  <div class="container mx-auto px-4 py-4 md:py-6">
    <div class="mx-auto max-w-4xl">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2 md:gap-3">
          <Button
            onclick={() => goto("/teacher/list")}
            variant="outline"
            size="icon"
            class="h-8 w-8 md:h-9 md:w-9"
          >
            <Lucide.ArrowLeft class="size-3 md:size-4" />
          </Button>
          <h1 class="text-lg font-bold md:text-xl">Dashboard</h1>
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

      <div class="space-y-4">
        <Card.Root class="shadow-md">
          <Card.Content class="p-4 md:p-6">
            <div class="mb-6 flex items-center gap-3">
              <div
                class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full md:size-12"
              >
                {data.user?.name[0].toUpperCase()}
              </div>
              <div>
                <h2 class="text-lg font-bold md:text-xl">
                  Welcome back, {data.user?.displayName || data.user?.name}!
                </h2>
                <p class="text-muted-foreground text-sm">
                  Stay on top of your appointments and messages.
                </p>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <Card.Root class="shadow-sm">
                <Card.Content class="p-4">
                  <div class="mb-3 flex items-center gap-3">
                    <div
                      class="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-800"
                    >
                      <Lucide.Calendar class="size-5" />
                    </div>
                    <div>
                      <h3 class="font-semibold">My Appointments</h3>
                      <p class="text-muted-foreground text-xs">View your appointments</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    class="w-full"
                    onclick={() => goto("/dashboard/appointments")}
                  >
                    <Lucide.Calendar class="mr-2 size-4" />
                    View Appointments
                  </Button>
                </Card.Content>
              </Card.Root>

              <Card.Root class="shadow-sm">
                <Card.Content class="p-4">
                  <div class="mb-3 flex items-center gap-3">
                    <div
                      class="flex size-10 items-center justify-center rounded-full bg-purple-100 text-purple-800"
                    >
                      <Lucide.MessageCircle class="size-5" />
                    </div>
                    <div>
                      <h3 class="font-semibold">My Messages</h3>
                      <p class="text-muted-foreground text-xs">Chat with teachers</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    class="w-full"
                    onclick={() => goto("/dashboard/message/list")}
                  >
                    <Lucide.MessageCircle class="mr-2 size-4" />
                    View Messages
                  </Button>
                </Card.Content>
              </Card.Root>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  </div>
</div>
