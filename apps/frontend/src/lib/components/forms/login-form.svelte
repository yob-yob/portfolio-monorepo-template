<script lang="ts">
  import { authClient } from "@city-os/auth/client";
  import type { HTMLAttributes } from "svelte/elements";
  import { goto, invalidateAll } from "$app/navigation";
  import loginBanner from "$lib/assets/login-banner.svg";
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
  import * as Password from "$lib/components/ui/password";
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
    const password = formData.get("password") as string;
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });
    if (error) {
      errorMessage = error.message ?? "An unknown error occurred";
    } else {
      invalidateAll();
      goto(data.redirect && data.url ? data.url : "/");
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
            <h1 class="text-2xl font-bold">Welcome back</h1>
            <p class="text-muted-foreground text-balance">
              Login to Asset Tracking System
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
            <div class="flex items-center">
              <FieldLabel for="password-{id}">Password</FieldLabel>
              <a
                href="##"
                class="ms-auto text-sm underline-offset-2 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Password.Root>
              <Password.Input
                id="password-{id}"
                placeholder="Password"
                name="password"
                required
              >
                <Password.ToggleVisibility />
              </Password.Input>
            </Password.Root>
          </Field>
          <Field>
            <Button type="submit" class="cursor-pointer" disabled={isLoading}>
              Login
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
