<script lang="ts">
  import { page } from "$app/state";
  import { enhance } from "$app/forms";
  import * as Lucide from "@lucide/svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import * as Password from "$lib/components/ui/password/index.js";

  let { form } = $props();
  let url = new URL(page.url);
  let isTeacher = $state(false);
</script>

<svelte:head>
  <title>Sign in | syndeo.</title>
</svelte:head>

<div class="flex flex-col gap-6">
  <Card.Root class="md:min-w-sm">
    <Card.Header class="text-center">
      <Card.Title class="text-2xl">Welcome back!</Card.Title>
      <Card.Description>Sign in with your email</Card.Description>
    </Card.Header>

    <Card.Content>
      <div class="grid gap-4">
        <form class="grid gap-4" method="POST" use:enhance>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="jane@doe.com"
              spellcheck="false"
              required
            />
          </div>

          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <div class="relative">
              <Password.Root>
                <Password.Input id="password" name="password">
                  <Password.ToggleVisibility />
                </Password.Input>
              </Password.Root>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Checkbox bind:checked={isTeacher} name="isTeacher" id="is-teacher" />
            <Label for="is-teacher">I am a teacher</Label>
          </div>

          <Button type="submit" class="w-full transition-all hover:scale-105">
            <Lucide.LogIn />
            Sign in as a {isTeacher ? "teacher" : "student"}
          </Button>
        </form>

        {#if form?.message}
          <Alert.Root variant="destructive">
            <Lucide.TriangleAlert />
            <Alert.Description class="max-w-70">
              <span>{form.message}</span>
            </Alert.Description>
          </Alert.Root>
        {/if}

        <div class="text-center text-sm">
          Don't have an account?
          <a href={`/sign-up${url.search}`} class="underline">Sign up</a>
        </div>
      </div>
    </Card.Content>
  </Card.Root>
</div>
