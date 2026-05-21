<script lang="ts">
  import { api } from "@asset-tracking/api-client";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import DarkModeToggle from "$lib/components/dark-mode-toggle.svelte";
  import InstallForm from "$lib/components/forms/install-form.svelte";

  onMount(async () => {
    const { data, error } = await api.api.v1.onboarding.get();

    if (error) {
      // if there's an Error we don't want users to see this page...
      return;
    }

    if (!data.shouldOnBoard) {
      goto("/auth/login");
    }
  });
</script>

<div
  class="bg-background relative flex min-h-svh flex-col items-center justify-center px-4 py-12 sm:px-6"
>
  <div
    class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--muted)_0%,transparent_55%)]"
    aria-hidden="true"
  ></div>
  <div class="absolute inset-e-4 top-4 z-10">
    <DarkModeToggle />
  </div>
  <div class="relative z-10 w-full max-w-md">
    <InstallForm />
  </div>
</div>
