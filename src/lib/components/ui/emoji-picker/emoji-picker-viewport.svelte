<!--
	Installed from @ieedan/shadcn-svelte-extras
-->

<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...rest} class={cn("border-border rounded-md border", className)}>
  {@render children?.()}
</div>
