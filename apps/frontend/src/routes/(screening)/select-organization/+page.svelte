<script lang="ts">
  import { authClient } from "@/auth/client";
  import { invalidateAll } from "$app/navigation";
  import DarkModeToggle from "$lib/components/dark-mode-toggle.svelte";

  const organizations = authClient.useListOrganizations();
  let activatingOrganizationId = $state<string | null>(null);

  const activeOrganization = async (organizationId: string) => {
    activatingOrganizationId = organizationId;
    try {
      await authClient.organization.setActive({ organizationId });
      await invalidateAll();
    } finally {
      activatingOrganizationId = null;
    }
  };
</script>

<div
  class="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
>
  <div class="absolute top-4 right-4">
    <DarkModeToggle />
  </div>

  {#if $organizations.isPending}
    <div class="w-full max-w-sm md:max-w-3xl">
      <div class="bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
        <div class="flex items-start gap-3">
          <span
            class="border-primary/30 border-t-primary mt-0.5 size-5 animate-spin rounded-full border-2"
            aria-hidden="true"
          ></span>
          <div class="space-y-1">
            <p class="font-semibold">Loading organizations</p>
            <p class="text-muted-foreground text-sm">
              Fetching your available organizations...
            </p>
          </div>
        </div>
      </div>
    </div>
  {:else if !$organizations.data?.length}
    <div class="w-full max-w-sm md:max-w-3xl">
      <div class="bg-card text-card-foreground rounded-xl border p-6 text-center shadow-sm">
        <p class="font-semibold">No organizations found</p>
        <p class="text-muted-foreground mt-1 text-sm">
          You do not have access to any organizations yet.
        </p>
      </div>
    </div>
  {:else}
    <div class="w-full max-w-sm space-y-3 md:max-w-3xl">
      <h1 class="text-2xl font-semibold tracking-tight">Select an organization</h1>
      <p class="text-muted-foreground text-sm">
        Click an organization to continue.
      </p>

      <ul class="space-y-3">
        {#each $organizations.data as organization (organization.id)}
          <li>
            <button
              type="button"
              class="group bg-card text-card-foreground ring-offset-background w-full rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80"
              disabled={activatingOrganizationId === organization.id}
              onclick={() => activeOrganization(organization.id)}
            >
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate font-medium">{organization.name}</p>
                  <p class="text-muted-foreground text-sm">
                    {activatingOrganizationId === organization.id
                      ? "Switching organization..."
                      : "Click to use this organization"}
                  </p>
                </div>
                <span
                  class="text-muted-foreground group-hover:text-foreground shrink-0 text-sm transition-colors"
                >
                  {activatingOrganizationId === organization.id ? "..." : "Open"}
                </span>
              </div>
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
