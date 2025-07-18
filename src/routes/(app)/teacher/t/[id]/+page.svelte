<script lang="ts">
  import { cn } from "$lib/utils";
  import { page } from "$app/state";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import * as Lucide from "@lucide/svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { redirectToMeOnSignIn } from "$lib/customUtils.js";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import { LightSwitch } from "$lib/components/ui/light-switch/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { DateFormatter, type DateValue, getLocalTimeZone, today } from "@internationalized/date";

  interface Teacher {
    id: string;
    name: string;
    displayName?: string;
    description?: string;
    expand?: {
      tags?: Tag[];
    };
  }

  interface Tag {
    id: string;
    name: string;
    type: string;
  }

  interface User {
    id: string;
    name: string;
    approved?: boolean;
  }

  interface PageData {
    status: number;
    message?: string;
    payload?: {
      user?: User;
      teacher?: Teacher;
      target: Teacher;
    };
  }

  let { data }: { data: PageData } = $props();

  const df = new DateFormatter("en-US", { dateStyle: "medium" });

  let startDate: DateValue | undefined = $state(today(getLocalTimeZone()));
  let endDate: DateValue | undefined = $state(today(getLocalTimeZone()).add({ days: 1 }));
  let description = $state("");
  let submitting = $state(false);
  let showConfirmDialog = $state(false);
  let showResultDialog = $state(false);
  let resultMessage = $state("");
  let isSuccess = $state(false);
  let startDatePickerOpen = $state(false);
  let endDatePickerOpen = $state(false);

  const isSignedIn = !!data.payload?.user;
  const isApproved = data.payload?.user?.approved !== false;

  function toDateString(d?: DateValue) {
    return d?.toDate(getLocalTimeZone()).toISOString().split("T")[0];
  }

  function handleSubmit() {
    if (!isSignedIn) {
      goto(redirectToMeOnSignIn(page.url));
      return;
    }
    showConfirmDialog = true;
  }

  function confirmSubmit() {
    showConfirmDialog = false;
    const form = document.getElementById("appointment-form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
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
  {#if data.status !== 200}
    <title>{data.status} | syndeo.</title>
  {:else}
    <title>
      {data.payload?.target.displayName || data.payload?.target.name} | syndeo.
    </title>
  {/if}
</svelte:head>

{#if data.status === 200 && data.payload}
  <div class="bg-background min-h-screen">
    <div class="container mx-auto px-4 py-4 md:py-6">
      <div class="mx-auto max-w-6xl">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-2 md:gap-3">
            <Button
              onclick={() => goto("/teacher/list")}
              variant="outline"
              size="icon"
              class="h-8 w-8 md:h-9 md:w-9"
              aria-label="Go back to teacher list"
            >
              <Lucide.ArrowLeft class="size-3 md:size-4" />
            </Button>
            <h1 class="text-lg font-bold md:text-xl">Profile</h1>
          </div>

          <div class="flex items-center gap-2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                {#snippet child({ props })}
                  <Button
                    {...props}
                    variant="ghost"
                    size="icon"
                    class="h-9 w-9"
                    aria-label="User menu"
                  >
                    <div
                      class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-xs"
                    >
                      {#if data.payload?.user || data.payload?.teacher}
                        {(data.payload?.user?.name ||
                          data.payload?.teacher?.name ||
                          "U")[0].toUpperCase()}
                      {:else}
                        <Lucide.UserX class="size-3" />
                      {/if}
                    </div>
                  </Button>
                {/snippet}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content class="w-56" align="end">
                <DropdownMenu.Label>
                  {data.payload.user
                    ? `Signed in as @${data.payload.user.name}`
                    : data.payload.teacher
                      ? `Signed in as @${data.payload.teacher.name}`
                      : "Not signed in"}
                </DropdownMenu.Label>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>
                  <div class="flex items-center gap-2">
                    <Lucide.Palette class="size-4" />
                    <span>Theme</span>
                  </div>
                  <div class="ml-auto">
                    <LightSwitch />
                  </div>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item onclick={() => goto("/dashboard")}>
                  <div class="flex items-center gap-2">
                    <Lucide.LayoutDashboard class="size-4" />
                    <span>Dashboard</span>
                  </div>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  onclick={() =>
                    goto(
                      data.payload?.user || data.payload?.teacher
                        ? redirectToMeOnSignIn(page.url, "/sign-out")
                        : redirectToMeOnSignIn(page.url),
                    )}
                >
                  {#if data.payload?.user || data.payload?.teacher}
                    <Lucide.LogOut class="size-4" />
                    Sign out
                  {:else}
                    <Lucide.LogIn class="size-4" />
                    Sign in
                  {/if}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <Card.Root class="shadow-md">
            <Card.Content class="p-6">
              <div class="mb-4 flex items-center gap-4">
                <div
                  class="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full text-lg font-medium"
                >
                  {data.payload?.target.name?.[0]?.toUpperCase() || "T"}
                </div>
                <div class="min-w-0 flex-1">
                  <h2 class="text-xl font-bold">
                    {data.payload?.target.displayName || data.payload?.target.name}
                  </h2>
                  <p class="text-muted-foreground text-sm">
                    @{data.payload?.target.name}
                  </p>
                </div>
              </div>

              <div class="mb-4">
                <h3 class="mb-2 text-sm font-semibold">About</h3>
                <p class="text-muted-foreground text-sm leading-relaxed">
                  {data.payload?.target.description || "No description available."}
                </p>
              </div>

              {#if data.payload?.target.expand?.tags && data.payload?.target.expand.tags.length > 0}
                {@const departmentTags = data.payload?.target.expand.tags.filter(
                  (tag: Tag) => tag.type === "department",
                )}
                {@const subjectTags = data.payload?.target.expand.tags.filter(
                  (tag: Tag) => tag.type === "subject",
                )}
                {@const classTags = data.payload?.target.expand.tags.filter(
                  (tag: Tag) => tag.type === "class",
                )}

                {#if departmentTags.length > 0}
                  <div class="mb-4">
                    <h3 class="mb-2 text-sm font-semibold">Departments</h3>
                    <div class="flex flex-wrap gap-1">
                      {#each departmentTags as tag (tag.id)}
                        <a
                          class={cn(
                            "rounded-full border px-2 py-1 text-xs font-medium",
                            getTagVariant(tag.type),
                          )}
                          href="/teacher/list?t={tag.name.replace(/\s+/gm, '+')}"
                        >
                          {tag.name}
                        </a>
                      {/each}
                    </div>
                  </div>
                {/if}

                {#if subjectTags.length > 0}
                  <div class="mb-4">
                    <h3 class="mb-2 text-sm font-semibold">Subjects</h3>
                    <div class="flex flex-wrap gap-1">
                      {#each subjectTags as tag (tag.id)}
                        <a
                          class={cn(
                            "rounded-full border px-2 py-1 text-xs font-medium",
                            getTagVariant(tag.type),
                          )}
                          href="/teacher/list?t={tag.name.replace(/\s+/gm, '+')}"
                        >
                          {tag.name}
                        </a>
                      {/each}
                    </div>
                  </div>
                {/if}

                {#if classTags.length > 0}
                  <div class="mb-4">
                    <h3 class="mb-2 text-sm font-semibold">Classes</h3>
                    <div class="flex flex-wrap gap-1">
                      {#each classTags as tag (tag.id)}
                        <a
                          class={cn(
                            "rounded-full border px-2 py-1 text-xs font-medium",
                            getTagVariant(tag.type),
                          )}
                          href="/teacher/list?t={tag.name.replace(/\s+/gm, '+')}"
                        >
                          {tag.name}
                        </a>
                      {/each}
                    </div>
                  </div>
                {/if}
              {/if}
            </Card.Content>
          </Card.Root>

          <Card.Root class="shadow-md">
            <Card.Content class="p-6">
              <form
                id="appointment-form"
                method="post"
                use:enhance={() => {
                  submitting = true;
                  return ({ result }) => {
                    submitting = false;
                    if (result.type === "success") {
                      isSuccess = true;
                      resultMessage = (result.data?.message as string)
                        ? (result.data?.message as string).trim() +
                          " Return to your dashboard to keep track of your appointments and messages."
                        : "Appointment request submitted successfully! Return to your dashboard to keep track of your appointments and messages.";
                      showResultDialog = true;
                    } else if (result.type === "failure") {
                      isSuccess = false;
                      resultMessage = (result.data?.message as string) || "An error occurred";
                      showResultDialog = true;
                    }
                  };
                }}
                class="grid gap-4"
              >
                <input type="hidden" name="recipient" value={data.payload?.target.id} />
                <input type="hidden" name="startsOn" value={toDateString(startDate)} />
                <input type="hidden" name="endsOn" value={toDateString(endDate)} />

                <fieldset class="grid gap-4 sm:gap-3">
                  <legend
                    class="mb-1 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Select schedule
                  </legend>

                  <div class="grid gap-3 sm:grid-cols-2 sm:gap-2">
                    <div class="grid gap-2">
                      <span class="text-muted-foreground text-xs font-medium">Start Date</span>
                      <Popover.Root bind:open={startDatePickerOpen}>
                        <Popover.Trigger>
                          {#snippet child({ props })}
                            <Button
                              {...props}
                              variant="outline"
                              class="w-full justify-start text-left font-normal"
                              disabled={!isSignedIn || !isApproved}
                              aria-label="Select start date"
                            >
                              <Lucide.Calendar class="mr-2 size-4 shrink-0" />
                              <span class="truncate">
                                {#if startDate}
                                  {df.format(startDate.toDate(getLocalTimeZone()))}
                                {:else}
                                  Pick start date
                                {/if}
                              </span>
                            </Button>
                          {/snippet}
                        </Popover.Trigger>
                        <Popover.Content class="w-auto p-0" align="start">
                          <Calendar
                            bind:value={startDate!}
                            onValueChange={(value) => {
                              startDate = value;
                              if (startDate && endDate && startDate.compare(endDate) >= 0) {
                                endDate = startDate.add({ days: 1 });
                              }
                              startDatePickerOpen = false;
                            }}
                            minValue={today(getLocalTimeZone())}
                          />
                        </Popover.Content>
                      </Popover.Root>
                    </div>

                    <div class="grid gap-2">
                      <span class="text-muted-foreground text-xs font-medium">End Date</span>
                      <Popover.Root bind:open={endDatePickerOpen}>
                        <Popover.Trigger>
                          {#snippet child({ props })}
                            <Button
                              {...props}
                              variant="outline"
                              class="w-full justify-start text-left font-normal"
                              disabled={!isSignedIn || !startDate || !isApproved}
                              aria-label="Select end date"
                            >
                              <Lucide.Calendar class="mr-2 size-4 shrink-0" />
                              <span class="truncate">
                                {#if endDate}
                                  {df.format(endDate.toDate(getLocalTimeZone()))}
                                {:else}
                                  Pick end date
                                {/if}
                              </span>
                            </Button>
                          {/snippet}
                        </Popover.Trigger>
                        <Popover.Content class="w-auto p-0" align="start">
                          <Calendar
                            value={endDate}
                            onValueChange={(value) => {
                              endDate = value;
                              endDatePickerOpen = false;
                            }}
                            minValue={startDate
                              ? startDate.add({ days: 1 })
                              : today(getLocalTimeZone()).add({ days: 1 })}
                          />
                        </Popover.Content>
                      </Popover.Root>
                    </div>
                  </div>
                </fieldset>

                <div class="grid gap-2">
                  <label
                    class="mb-1 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    for="description"
                  >
                    Description <Badge>optional</Badge>
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    bind:value={description}
                    placeholder="Give the teacher some context about your appointment request..."
                    class="max-h-[300px] min-h-[100px]"
                    disabled={!isSignedIn || !isApproved}
                  />
                </div>

                <Button
                  type="button"
                  onclick={handleSubmit}
                  disabled={submitting || !startDate || !endDate || !isSignedIn || !isApproved}
                  class="w-full transition-all hover:scale-105"
                >
                  {#if submitting}
                    <Lucide.Loader2 class="size-4 animate-spin" />
                    Submitting...
                  {:else}
                    <Lucide.Check class="size-4" />
                    Submit Request
                  {/if}
                </Button>

                {#if data.payload.teacher}
                  <Alert.Root>
                    <Lucide.CircleAlert />
                    <Alert.Title>Students only!</Alert.Title>
                    <Alert.Description>
                      Only students can send appointments to teachers.
                    </Alert.Description>
                  </Alert.Root>
                {:else if !data.payload?.user}
                  <Alert.Root>
                    <Lucide.CircleAlert />
                    <Alert.Title>Sign in to continue</Alert.Title>
                    <Alert.Description class="flex items-center gap-1">
                      You must be signed in to request an appointment.
                      <a href={redirectToMeOnSignIn(page.url)} class="underline"> Sign in </a>
                    </Alert.Description>
                  </Alert.Root>
                {:else if !isApproved}
                  <Alert.Root variant="destructive">
                    <Lucide.CircleAlert />
                    <Alert.Title>Account pending approval</Alert.Title>
                    <Alert.Description>
                      Your account is pending approval. You cannot request appointments until
                      approved.
                    </Alert.Description>
                  </Alert.Root>
                {/if}
              </form>
            </Card.Content>
          </Card.Root>
        </div>
      </div>
    </div>
  </div>

  <Dialog.Root bind:open={showConfirmDialog}>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Confirm Appointment Request</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to submit this appointment request?
        </Dialog.Description>
      </Dialog.Header>
      <div class="grid gap-4 py-4">
        <div class="space-y-2">
          <p class="text-sm font-medium">Teacher:</p>
          <p class="text-muted-foreground text-sm">
            {data.payload?.target.displayName || data.payload?.target.name}
          </p>
        </div>
        <div class="space-y-2">
          <p class="text-sm font-medium">Schedule:</p>
          <p class="text-muted-foreground text-sm">
            {#if startDate && endDate}
              {df.format(startDate.toDate(getLocalTimeZone()))} – {df.format(
                endDate.toDate(getLocalTimeZone()),
              )}
            {/if}
          </p>
        </div>
        {#if description}
          <div class="space-y-2">
            <p class="text-sm font-medium">Description:</p>
            <p class="text-muted-foreground text-sm">
              {description.length > 50 ? description.slice(0, 50) + "..." : description}
            </p>
          </div>
        {/if}
      </div>
      <Dialog.Footer>
        <Button variant="outline" onclick={() => (showConfirmDialog = false)}>
          <Lucide.X class="size-4" />
          Cancel
        </Button>
        <Button onclick={confirmSubmit}>
          <Lucide.Check class="size-4" />
          Confirm Request
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>

  <Dialog.Root bind:open={showResultDialog}>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>
          {#if isSuccess}
            <div class="flex items-center gap-2">
              <Lucide.CheckCircle class="size-5 text-green-600" />
              Success
            </div>
          {:else}
            <div class="flex items-center gap-2">
              <Lucide.AlertCircle class="size-5 text-red-600" />
              Error
            </div>
          {/if}
        </Dialog.Title>
        <Dialog.Description>
          {resultMessage}
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Button onclick={() => (showResultDialog = false)}>Close</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
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
