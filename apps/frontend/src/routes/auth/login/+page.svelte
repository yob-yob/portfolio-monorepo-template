<script lang="ts">
  import { api } from "@asset-tracking/api-client";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import DarkModeToggle from "$lib/components/dark-mode-toggle.svelte";
  import LoginForm from "$lib/components/forms/login-form.svelte";

  onMount(async () => {
    // Should On-Board
    const { data, error } = await api.api.v1.onboarding.get();

    if (error) {
      // if there's an Error we don't want users to see this page...
      return;
    }

    if (data.shouldOnBoard) {
      goto("/onboarding");
    }
  });
</script>

<div
  class="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
>
  <div class="absolute top-4 right-4">
    <DarkModeToggle />
  </div>
  <div class="w-full max-w-sm md:max-w-3xl">
    <LoginForm />
  </div>
</div>
