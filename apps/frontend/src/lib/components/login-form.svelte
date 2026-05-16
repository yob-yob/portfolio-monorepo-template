<script lang="ts">
  import { authClient } from "@asset-tracking/auth/client";
  import type { HTMLAttributes } from "svelte/elements";
  import loginBanner from "$lib/assets/login-banner.png";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { cn } from "$lib/utils.js";

  let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> =
    $props();

  const id = $props.id();

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      console.error(error);
    } else {
      console.log("Login successful");
    }
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
            <Input
              id="password-{id}"
              type="password"
              name="password"
              required
            />
          </Field>
          <Field>
            <Button type="submit">Login</Button>
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
