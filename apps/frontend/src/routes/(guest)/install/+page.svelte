<script lang="ts">
  import DarkModeToggle from "$lib/components/dark-mode-toggle.svelte";
  import InstallForm from "$lib/components/forms/install-form.svelte";
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
