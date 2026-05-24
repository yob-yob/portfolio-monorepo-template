<script lang="ts">
  import "./layout.css";
  import { ModeWatcher } from "mode-watcher";
  import appleTouchIcon from "$lib/assets/apple-touch-icon.png";
  import favicon from "$lib/assets/favicon.svg";
  import { Toaster } from "$lib/components/ui/sonner/index.js";

  const { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon}>
  <link rel="apple-touch-icon" href={appleTouchIcon}>
</svelte:head>

<ModeWatcher />
<Toaster />

{@render children()}
