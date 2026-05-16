<script lang="ts">
  import { authClient } from "@asset-tracking/auth/client";
  import type { HTMLAttributes } from "svelte/elements";
  import loginBanner from "$lib/assets/login-banner.png";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { cn } from "$lib/utils.js";

  let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> =
    $props();

  const id = $props.id();

  let errorMessage = $state<string | undefined>(undefined);
  let isLoading = $state<boolean>(false);

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    errorMessage = undefined;
    isLoading = true;
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const { error } = await authClient.requestPasswordReset({ email });
    if (error) {
      errorMessage = error.message ?? "An unknown error occurred";
    }
    isLoading = false;
  };
</script>

<div class={cn("flex flex-col gap-6", className)} {...restProps}>
  <Card.Root class="overflow-hidden p-0">
    <Card.Content class="grid p-0 md:grid-cols-2">
      <form class="p-6 md:p-8" onsubmit={handleSubmit}>
        <FieldGroup>
          <div class="flex flex-col items-center gap-2 text-center">
            <h1 class="text-2xl font-bold">Forgot your password?</h1>
            <p class="text-muted-foreground text-balance">
              Enter your email to reset your password
            </p>
          </div>
          <Field>
            <FieldLabel for="email-{id}">Email</FieldLabel>
            <Input
              id="email-{id}"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <Button type="submit" class="cursor-pointer" disabled={isLoading}>
              Reset Password
            </Button>
            <FieldError>
              {#if errorMessage}
                {errorMessage}
              {:else}
                &nbsp;
              {/if}
            </FieldError>
          </Field>
        </FieldGroup>
      </form>
      <div class="bg-muted relative hidden md:block">
        <img
          src={loginBanner}
          alt="placeholder"
          class="absolute inset-0 h-full w-full object-cover"
        >
      </div>
    </Card.Content>
  </Card.Root>
  <FieldDescription class="px-6 text-center">
    By signing in, you agree to our <a href="##">Terms of Service</a> and
    <a href="##">Privacy Policy</a>.
  </FieldDescription>
</div>
