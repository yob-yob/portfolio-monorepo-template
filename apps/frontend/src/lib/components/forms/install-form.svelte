<script lang="ts">
  import ShieldCheckIcon from "@lucide/svelte/icons/shield-check";
  import type { HTMLAttributes } from "svelte/elements";
  import { goto } from "$app/navigation";
  import { backend } from "$lib/api";
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { cn } from "$lib/utils.js";

  let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> =
    $props();

  const id = $props.id();

  let errorMessage = $state<string | undefined>(undefined);
  let isLoading = $state<boolean>(false);
  let password = $state("");
  let confirmPassword = $state("");
  let confirmTouched = $state(false);

  const passwordsMatch = $derived(
    confirmPassword.length === 0 || password === confirmPassword
  );

  const showPasswordMismatch = $derived(
    confirmTouched && confirmPassword.length > 0 && !passwordsMatch
  );

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    errorMessage = undefined;
    confirmTouched = true;

    if (!passwordsMatch) {
      errorMessage = "Passwords do not match. Please confirm your password.";
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    isLoading = true;
    // API wiring: POST /api/v1/setup when backend drops organizationName from this step.
    await new Promise((resolve) => setTimeout(resolve, 0));

    const { error } = await backend.api.v1.setup.post({
      name,
      email,
      password,
    });

    if (error) {
      errorMessage = error.value.message ?? "Installation failed.";
    } else {
      goto("/");
    }

    isLoading = false;
  };
</script>

<div class={cn("w-full", className)} {...restProps}>
  <div
    class="border-border bg-card overflow-hidden rounded-xl border shadow-sm"
  >
    <header class="border-border bg-muted/30 border-b px-5 py-4 sm:px-6">
      <div class="flex items-start gap-3">
        <div
          class="border-border bg-background text-primary flex size-9 shrink-0 items-center justify-center rounded-md border"
          aria-hidden="true"
        >
          <ShieldCheckIcon class="size-4" />
        </div>
        <div class="min-w-0 space-y-0.5">
          <p
            class="text-muted-foreground text-[0.65rem] font-semibold tracking-widest uppercase"
          >
            Initial installation
          </p>
          <h1 class="text-foreground text-lg font-semibold tracking-tight">
            Create administrator account
          </h1>
          <p class="text-muted-foreground text-xs leading-snug">
            Create the first administrator account. Organization settings are
            configured in the next step.
          </p>
        </div>
      </div>

      <nav class="mt-4" aria-label="Installation steps">
        <div class="relative mx-auto w-full max-w-xs">
          <div
            class="bg-border pointer-events-none absolute top-3.5 inset-s-[20%] inset-e-[20%] h-px"
            aria-hidden="true"
          ></div>

          <ol class="relative flex w-full">
            <li
              class="relative z-10 flex flex-1 flex-col items-center gap-1.5"
              aria-current="step"
            >
              <span
                class="bg-primary text-primary-foreground ring-card flex size-7 items-center justify-center rounded-full text-xs font-semibold ring-4"
                title="Step 1: Administrator"
              >
                <span class="sr-only">Step 1 — </span>1
              </span>
              <div class="flex flex-col items-center gap-0.5 text-center">
                <span class="text-foreground text-xs font-medium">
                  Administrator
                </span>
                <span class="text-primary text-[0.65rem] font-medium">
                  Current
                </span>
              </div>
            </li>

            <li class="relative z-10 flex flex-1 flex-col items-center gap-1.5">
              <span
                class="bg-card border-border text-muted-foreground ring-card flex size-7 items-center justify-center rounded-full border-2 text-xs font-semibold ring-4"
                title="Step 2: Organization"
              >
                <span class="sr-only">Step 2 — </span>2
              </span>
              <div class="flex flex-col items-center gap-0.5 text-center">
                <span class="text-muted-foreground text-xs font-medium">
                  Organization
                </span>
                <span class="text-muted-foreground text-[0.65rem]">Next</span>
              </div>
            </li>
          </ol>
        </div>
      </nav>
    </header>

    <form class="px-5 py-5 sm:px-6" onsubmit={handleSubmit}>
      <FieldGroup class="gap-4">
        <section class="space-y-3" aria-labelledby="install-account-heading">
          <div class="space-y-0.5">
            <h2
              id="install-account-heading"
              class="text-foreground text-sm font-semibold"
            >
              Account details
            </h2>
            <p class="text-muted-foreground text-xs">
              Name and email for the primary administrator.
            </p>
          </div>

          <div class="grid gap-3">
            <Field class="gap-2">
              <FieldLabel for="install-name-{id}">Full name</FieldLabel>
              <Input
                id="install-name-{id}"
                type="text"
                name="name"
                autocomplete="name"
                placeholder="Jane Reyes"
                required
              />
            </Field>

            <Field class="gap-2">
              <FieldLabel for="install-email-{id}">Work email</FieldLabel>
              <Input
                id="install-email-{id}"
                type="email"
                name="email"
                autocomplete="email"
                placeholder="admin@example.gov"
                required
              />
            </Field>
          </div>
        </section>

        <Separator />

        <section class="space-y-3" aria-labelledby="install-security-heading">
          <div class="space-y-0.5">
            <h2
              id="install-security-heading"
              class="text-foreground text-sm font-semibold"
            >
              Security
            </h2>
            <p class="text-muted-foreground text-xs">
              8–20 characters with uppercase, lowercase, and a number.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <Field class="gap-2">
              <FieldLabel for="install-password-{id}">Password</FieldLabel>
              <Input
                id="install-password-{id}"
                type="password"
                name="password"
                autocomplete="new-password"
                bind:value={password}
                minlength={8}
                maxlength={20}
                required
              />
            </Field>

            <Field class="gap-2">
              <FieldLabel for="install-confirm-password-{id}">
                Confirm password
              </FieldLabel>
              <Input
                id="install-confirm-password-{id}"
                type="password"
                name="confirmPassword"
                autocomplete="new-password"
                bind:value={confirmPassword}
                onblur={() => {
                  confirmTouched = true;
                }}
                aria-invalid={showPasswordMismatch}
                aria-describedby={showPasswordMismatch
                  ? `install-confirm-password-error-${id}`
                  : undefined}
                minlength={8}
                maxlength={20}
                required
              />
              {#if showPasswordMismatch}
                <FieldError id="install-confirm-password-error-{id}">
                  Passwords do not match.
                </FieldError>
              {/if}
            </Field>
          </div>
        </section>

        <div class="space-y-2">
          <Button
            type="submit"
            size="sm"
            class="h-9 w-full cursor-pointer sm:w-auto sm:min-w-48"
            disabled={isLoading || showPasswordMismatch}
          >
            {isLoading ? "Creating account…" : "Create administrator account"}
          </Button>

          {#if errorMessage}
            <FieldError>{errorMessage}</FieldError>
          {/if}
        </div>
      </FieldGroup>
    </form>

    <footer
      class="border-border bg-muted/20 text-muted-foreground border-t px-5 py-3 text-[0.7rem] leading-snug sm:px-6"
    >
      Runs once per installation. Organization setup follows before you can
      access the application.
    </footer>
  </div>
</div>
