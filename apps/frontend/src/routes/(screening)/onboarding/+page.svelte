<script lang="ts">
  import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
  import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
  import BuildingIcon from "@lucide/svelte/icons/building";
  import RefreshCwIcon from "@lucide/svelte/icons/refresh-cw";
  import { authClient } from "@/auth/client";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import Button from "$lib/components/button.svelte";
  import DarkModeToggle from "$lib/components/dark-mode-toggle.svelte";
  import OnboardingForm from "$lib/components/forms/onboarding-form.svelte";
  import { Spinner } from "$lib/components/ui/spinner/index.js";

  const organizations = authClient.useListOrganizations();

  let redirectIn = $state(3);

  $effect(() => {
    if ($organizations.data && $organizations.data.length > 0) {
      const interval = setInterval(() => {
        redirectIn--;
        if (redirectIn === 0) {
          goto(resolve("/(screening)/select-organization"));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  });

  const { data } = $props();
</script>

<div
  class="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
>
  <div class="absolute top-4 right-4">
    <DarkModeToggle />
  </div>
  <div class="w-full max-w-sm md:max-w-3xl">
    {#if $organizations.isPending || $organizations.isRefetching}
      <div class="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
        <div class="flex items-start gap-4">
          <div
            class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full"
          >
            <Spinner class="size-5" aria-label="Checking organizations" />
          </div>
          <div class="space-y-1">
            <p class="font-semibold">Checking your organizations</p>
            <p class="text-muted-foreground text-sm">
              We are looking to see if you already belong to a workspace before
              creating a new one.
            </p>
          </div>
        </div>
      </div>
    {:else if $organizations.error}
      <div class="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
        <div class="flex flex-col gap-5">
          <div class="flex items-start gap-4">
            <div
              class="bg-destructive/10 text-destructive flex size-10 shrink-0 items-center justify-center rounded-full"
            >
              <AlertCircleIcon class="size-5" aria-hidden="true" />
            </div>
            <div class="space-y-1">
              <p class="font-semibold">Unable to check organizations</p>
              <p class="text-muted-foreground text-sm">
                {$organizations.error.message ??
                  "There was a problem trying to check if you already have an organization."}
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            class="w-full sm:w-auto"
            onclick={() => $organizations.refetch()}
          >
            <RefreshCwIcon class="size-4" aria-hidden="true" />
            Try again
          </Button>
        </div>
      </div>
    {:else if $organizations.data && $organizations.data.length > 0}
      <div class="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
        <div class="flex flex-col gap-5">
          <div class="flex items-start gap-4">
            <div
              class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full"
            >
              <BuildingIcon class="size-5" aria-hidden="true" />
            </div>
            <div class="space-y-1">
              <p class="font-semibold">You already have access</p>
              <p class="text-muted-foreground text-sm">
                You already belong to an organization. We will redirect you to
                organization selection shortly.
              </p>
            </div>
          </div>

          <div
            class="bg-muted flex items-center justify-between gap-4 rounded-lg border px-4 py-3"
          >
            <div class="space-y-0.5">
              <p class="text-sm font-medium">Redirecting shortly</p>
              <p class="text-muted-foreground text-sm">
                {redirectIn}
                {redirectIn === 1 ? "second" : "seconds"}
                remaining
              </p>
            </div>
            <span
              class="border-primary/30 border-t-primary size-8 shrink-0 animate-spin rounded-full border-2"
              aria-hidden="true"
            ></span>
          </div>

          <Button
            class="w-full"
            onclick={() => goto(resolve("/(screening)/select-organization"))}
          >
            Continue now
            <ArrowRightIcon class="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    {:else}
      <OnboardingForm user={data.user} />
    {/if}
  </div>
</div>
