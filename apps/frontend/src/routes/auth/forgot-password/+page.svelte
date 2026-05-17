<script lang="ts">
  import DarkModeToggle from "$lib/components/dark-mode-toggle.svelte";
  import ForgotPasswordForm from "$lib/components/forms/forgot-password-form.svelte";
</script>

<div
  class="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
>
  <div class="absolute top-4 right-4">
    <DarkModeToggle />
  </div>
  <div class="w-full max-w-sm md:max-w-3xl">
    <ForgotPasswordForm />
  </div>
</div>
