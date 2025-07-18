<script lang="ts">
  import { page } from "$app/state";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import * as Lucide from "@lucide/svelte";
  import type { RecordModel } from "pocketbase";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { redirectToMeOnSignIn } from "$lib/customUtils.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { getLocalTimeZone, today, type CalendarDate } from "@internationalized/date";
  import * as Pagination from "$lib/components/ui/pagination/index.js";
  import { LightSwitch } from "$lib/components/ui/light-switch/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  const { data } = $props();

  let showConfirmDialog = $state(false);
  let showResultDialog = $state(false);
  let showCalendarDialog = $state(false);
  let selectedAppointment = $state() as RecordModel;
  let selectedAction = $state("");
  let resultMessage = $state("");
  let isSuccess = $state(false);
  let startDate = $state<CalendarDate | undefined>(today(getLocalTimeZone()));
  let endDate = $state<CalendarDate | undefined>(today(getLocalTimeZone()).add({ days: 1 }));
  let startDateOpen = $state(false);
  let endDateOpen = $state(false);

  const currentPage = $derived(data.page);
  const currentStatus = $derived(data.status || "pending");
  const perPage = $derived(data.perPage || 10);
  const validStatuses = ["pending", "accepted", "rejected", "cancelled"];

  function handleAction(appointment: RecordModel, action: string) {
    selectedAppointment = appointment;
    selectedAction = action;
    showConfirmDialog = true;
  }

  function handleCalendarAction(appointment: RecordModel) {
    selectedAppointment = appointment;
    showCalendarDialog = true;
  }

  function confirmAction() {
    showConfirmDialog = false;
    const form = document.getElementById(
      `schedule-action-form-${selectedAppointment.id}`,
    ) as HTMLFormElement;
    if (form) {
      form.submit();
    }
  }

  function confirmCalendarAction() {
    showCalendarDialog = false;

    const scheduleForm = document.getElementById(
      `update-schedule-form-${selectedAppointment.id}`,
    ) as HTMLFormElement;

    const startsOnInput = scheduleForm.querySelector('input[name="startsOn"]') as HTMLInputElement;
    const endsOnInput = scheduleForm.querySelector('input[name="endsOn"]') as HTMLInputElement;

    if (startsOnInput && endsOnInput && startDate && endDate) {
      startsOnInput.value = startDate.toString();
      endsOnInput.value = endDate.toString();
    }

    if (scheduleForm) {
      scheduleForm.submit();
    }
  }

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

  function handleTabChange(status: string) {
    goto(buildUrl({ status, p: 1 }));
  }

  function handlePageChange(newPage: number) {
    goto(buildUrl({ status: currentStatus, p: newPage }));
  }

  function updatePerPage(newPerPage: number) {
    goto(
      buildUrl({
        status: currentStatus,
        n: Math.max(1, newPerPage),
        p: 1,
      }),
    );
  }

  function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  }
</script>

<svelte:head>
  <title>My Appointments | syndeo.</title>
</svelte:head>

<div class="bg-background min-h-screen">
  <div class="container mx-auto px-4 py-4 md:py-6">
    <div class="mx-auto max-w-4xl">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2 md:gap-3">
          <Button
            onclick={() => goto("/teacher/dashboard")}
            variant="outline"
            size="icon"
            class="h-8 w-8 md:h-9 md:w-9"
          >
            <Lucide.ArrowLeft class="size-3 md:size-4" />
          </Button>
          <h1 class="text-lg font-bold md:text-xl">My Appointments</h1>
        </div>

        <div class="flex items-center gap-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              {#snippet child({ props })}
                <Button {...props} variant="ghost" size="icon" class="h-9 w-9">
                  <div
                    class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-sm"
                  >
                    {data.teacher?.name[0].toUpperCase()}
                  </div>
                </Button>
              {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="w-56" align="end">
              <DropdownMenu.Label>
                Signed in as @{data.teacher?.name}
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

      <Tabs.Root value={String(currentStatus)} onValueChange={handleTabChange}>
        <div class="mb-4 hidden md:flex md:items-center md:justify-between">
          <Tabs.List class="flex gap-2">
            {#each validStatuses as status (status)}
              <Tabs.Trigger value={status} class="capitalize">{status}</Tabs.Trigger>
            {/each}
          </Tabs.List>

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
            <span class="px-3 py-1 text-sm font-medium">
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

        <div class="mb-4 flex flex-col gap-4 md:hidden">
          <Tabs.List class="flex w-full gap-2">
            {#each validStatuses as status (status)}
              <Tabs.Trigger value={status} class="flex-1 capitalize">{status}</Tabs.Trigger>
            {/each}
          </Tabs.List>

          <div class="flex w-full items-center gap-1 rounded-lg border p-1">
            <Button
              onclick={() => updatePerPage(perPage - 1)}
              disabled={perPage <= 1}
              variant="ghost"
              size="icon"
              class="size-8"
            >
              <Lucide.Minus class="size-3" />
            </Button>
            <span class="flex-1 px-3 py-1 text-center text-sm font-medium">
              {perPage} items
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
          {#if data.activeAppointments && data.activeAppointments.length > 0}
            {#each data.activeAppointments as appointment (appointment.id)}
              <Card.Root class="transition-shadow duration-200 hover:shadow-lg">
                <Card.Content class="p-4 md:p-6">
                  <div class="flex items-start gap-4">
                    <div
                      class="bg-primary/10 text-primary flex size-12 flex-shrink-0 items-center justify-center rounded-full"
                    >
                      <Lucide.Calendar class="size-6" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="mb-1 flex items-center justify-between gap-2">
                        <h3 class="truncate text-base font-semibold md:text-lg">
                          {appointment.expand?.sender?.name || "Unknown Student"}
                        </h3>
                        {#if currentStatus === "pending"}
                          <div class="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              class="h-8 w-8"
                              onclick={() => handleCalendarAction(appointment)}
                            >
                              <Lucide.CalendarDays class="size-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              class="h-8 w-8"
                              onclick={() => handleAction(appointment, "accept")}
                            >
                              <Lucide.Check class="size-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              class="h-8 w-8"
                              onclick={() => handleAction(appointment, "reject")}
                            >
                              <Lucide.X class="size-4" />
                            </Button>
                          </div>
                        {/if}
                      </div>
                      <div class="mt-2 space-y-2">
                        <p class="text-muted-foreground/80 bg-muted/30 rounded px-2 py-1 text-sm">
                          {appointment.description || "No subject"}
                        </p>
                        <div class="space-y-2 rounded-lg border p-3">
                          <div class="flex items-center gap-2">
                            <Lucide.Clock class="size-4" />
                            <span class="text-sm font-medium">Scheduled Time</span>
                          </div>
                          <div class="space-y-1 text-sm">
                            <div class="flex items-center gap-2">
                              <Lucide.Play class="size-3" />
                              <span
                                >Starts: {formatDateTime(appointment.startsOn).date} at {formatDateTime(
                                  appointment.startsOn,
                                ).time}</span
                              >
                            </div>
                            <div class="flex items-center gap-2">
                              <Lucide.Square class="size-3" />
                              <span
                                >Ends: {formatDateTime(appointment.endsOn).date} at {formatDateTime(
                                  appointment.endsOn,
                                ).time}</span
                              >
                            </div>
                          </div>
                        </div>
                        <p class="text-muted-foreground text-sm">
                          Requested on {formatDateTime(appointment.created).date} at {formatDateTime(
                            appointment.created,
                          ).time}
                        </p>
                      </div>
                    </div>
                  </div>

                  <form
                    id={`schedule-action-form-${appointment.id}`}
                    method="POST"
                    action="?/schedule-action"
                    style="display: none;"
                    use:enhance={() => {
                      return async ({ result }) => {
                        if (result.type === "success") {
                          isSuccess = true;
                          resultMessage =
                            (result.data?.message as string) || "Appointment updated successfully";
                        } else {
                          isSuccess = false;
                          resultMessage = "Failed to update appointment";
                        }
                        showResultDialog = true;
                      };
                    }}
                  >
                    <input type="hidden" name="action" value={selectedAction} />
                    <input type="hidden" name="id" value={appointment.id} />
                    <input type="hidden" name="senderId" value={appointment.expand?.sender.id} />
                  </form>

                  <form
                    id={`update-schedule-form-${appointment.id}`}
                    method="POST"
                    action="?/update-schedule"
                    style="display: none;"
                    use:enhance={() => {
                      return async ({ result }) => {
                        if (result.type === "success") {
                          isSuccess = true;
                          resultMessage =
                            (result.data?.message as string) ||
                            "Appointment schedule updated successfully";
                        } else {
                          isSuccess = false;
                          resultMessage = "Failed to update appointment schedule";
                        }
                        showResultDialog = true;
                      };
                    }}
                  >
                    <input type="hidden" name="id" value={appointment.id} />
                    <input type="hidden" name="startsOn" value="" />
                    <input type="hidden" name="endsOn" value="" />
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
                    <Lucide.Calendar class="size-8" />
                  </div>
                </div>
                <h3 class="mb-2 text-lg font-semibold">No {currentStatus} appointments</h3>
                <p class="text-muted-foreground text-sm">
                  {currentStatus === "pending"
                    ? "When students request appointments, they'll appear here."
                    : "No appointments found for this status."}
                </p>
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
      </Tabs.Root>
    </div>
  </div>
</div>

<Dialog.Root bind:open={showConfirmDialog}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>
        {selectedAction === "accept" ? "Accept Appointment" : "Reject Appointment"}
      </Dialog.Title>
      <Dialog.Description>
        Are you sure you want to {selectedAction} this appointment request?
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="space-y-2">
        <p class="text-sm font-medium">Student</p>
        <p class="text-muted-foreground text-sm">
          {selectedAppointment?.expand?.sender?.name || "Unknown Student"}
        </p>
      </div>
      <div class="space-y-2">
        <p class="text-sm font-medium">Subject</p>
        <p class="text-muted-foreground text-sm">
          {selectedAppointment?.description || "No subject"}
        </p>
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => (showConfirmDialog = false)}>
        <Lucide.X class="size-4" />
        Cancel
      </Button>
      <Button
        onclick={confirmAction}
        variant={selectedAction === "accept" ? "default" : "destructive"}
      >
        {#if selectedAction === "accept"}
          <Lucide.Check class="size-4" />
          Accept
        {:else}
          <Lucide.X class="size-4" />
          Reject
        {/if}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={showCalendarDialog}>
  <Dialog.Content class="sm:max-w-[500px]">
    <Dialog.Header>
      <Dialog.Title>Schedule Appointment</Dialog.Title>
      <Dialog.Description>Select new dates for the appointment and accept it.</Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="space-y-2">
        <p class="text-sm font-medium">Student</p>
        <p class="text-muted-foreground text-sm">
          {selectedAppointment?.expand?.sender?.name || "Unknown Student"}
        </p>
      </div>
      <div class="space-y-2">
        <p class="text-sm font-medium">Subject</p>
        <p class="text-muted-foreground text-sm">
          {selectedAppointment?.description || "No subject"}
        </p>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="flex flex-col gap-3">
          <Label>Start Date</Label>
          <Popover.Root bind:open={startDateOpen}>
            <Popover.Trigger>
              {#snippet child({ props })}
                <Button {...props} variant="outline" class="w-full justify-between font-normal">
                  {startDate
                    ? startDate.toDate(getLocalTimeZone()).toLocaleDateString()
                    : "Select start date"}
                  <Lucide.ChevronDown class="size-4" />
                </Button>
              {/snippet}
            </Popover.Trigger>
            <Popover.Content class="w-auto overflow-hidden p-0" align="start">
              <Calendar
                type="single"
                bind:value={startDate}
                captionLayout="dropdown"
                onValueChange={() => {
                  startDateOpen = false;
                }}
                minValue={today(getLocalTimeZone())}
              />
            </Popover.Content>
          </Popover.Root>
        </div>
        <div class="flex flex-col gap-3">
          <Label>End Date</Label>
          <Popover.Root bind:open={endDateOpen}>
            <Popover.Trigger>
              {#snippet child({ props })}
                <Button {...props} variant="outline" class="w-full justify-between font-normal">
                  {endDate
                    ? endDate.toDate(getLocalTimeZone()).toLocaleDateString()
                    : "Select end date"}
                  <Lucide.ChevronDown class="size-4" />
                </Button>
              {/snippet}
            </Popover.Trigger>
            <Popover.Content class="w-auto overflow-hidden p-0" align="start">
              <Calendar
                type="single"
                bind:value={endDate}
                captionLayout="dropdown"
                onValueChange={() => {
                  endDateOpen = false;
                }}
                minValue={startDate || today(getLocalTimeZone())}
              />
            </Popover.Content>
          </Popover.Root>
        </div>
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => (showCalendarDialog = false)}>
        <Lucide.X class="size-4" />
        Cancel
      </Button>
      <Button onclick={confirmCalendarAction}>
        <Lucide.Check class="size-4" />
        Update and accept
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
