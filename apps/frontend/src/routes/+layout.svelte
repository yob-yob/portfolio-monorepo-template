<script lang="ts">
  import "./layout.css";
  import { authClient } from "@asset-tracking/auth/client";
  import { ModeWatcher } from "mode-watcher";
  import favicon from "$lib/assets/favicon.svg";
  import LoginForm from "$lib/components/login-form.svelte";

  const { children } = $props();

  const session = authClient.useSession();
</script>

<svelte:head>
  <link rel="icon" href={favicon}>
</svelte:head>

<ModeWatcher />

{#if session.get()}
  {@render children()}
{:else}
  <LoginForm />
{/if}
