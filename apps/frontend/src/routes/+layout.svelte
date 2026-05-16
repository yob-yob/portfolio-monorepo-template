<script lang="ts">
  import "./layout.css";
  import { authClient } from "@asset-tracking/auth/client";
  import { ModeWatcher } from "mode-watcher";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import favicon from "$lib/assets/favicon.svg";

  const { children } = $props();

  onMount(async () => {
    const session = await authClient.getSession();
    if (!session) {
      goto("/auth/login");
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon}>
</svelte:head>

<ModeWatcher />

{@render children()}
