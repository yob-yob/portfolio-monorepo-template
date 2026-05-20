<script lang="ts">
  import ProfileSettingsNav from "$lib/components/profile/profile-settings-nav.svelte";

  const { children } = $props();
</script>

<div class="mx-auto flex w-full max-w-5xl flex-col gap-8 lg:flex-row lg:gap-12">
  <aside class="lg:w-56 lg:shrink-0">
    <div class="space-y-4 lg:sticky lg:top-4">
      <div class="space-y-1 px-1">
        <h1 class="text-2xl font-semibold tracking-tight">Settings</h1>
        <p class="text-muted-foreground text-sm">
          Manage your account and security preferences.
        </p>
      </div>
      <ProfileSettingsNav />
    </div>
  </aside>
  <main class="min-w-0 flex-1 space-y-8"> {@render children()} </main>
</div>
