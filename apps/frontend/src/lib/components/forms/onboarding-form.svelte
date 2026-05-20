<script lang="ts">
  import { api } from "@asset-tracking/api-client";
  import type { HTMLAttributes } from "svelte/elements";
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
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const organizationName = formData.get("organizationName") as string;
    const { error } = await api.api.v1.onboarding.post({
      name,
      organizationName,
      email,
      password,
      confirmPassword,
    });
    if (error) {
      errorMessage = error.value.message ?? "An unknown error occurred";
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
            <h1 class="text-2xl font-bold">Admin On Boarding</h1>
            <p class="text-muted-foreground text-balance">
              Complete your onboarding to start using the asset tracking system
            </p>
          </div>
          <Field>
            <FieldLabel for="name-{id}">Name</FieldLabel>
            <Input
              id="name-{id}"
              type="text"
              name="name"
              placeholder="John Doe"
              required
            />
          </Field>
          <Field>
            <FieldLabel for={`organization-name-${id}`}>
              Organization Name
            </FieldLabel>
            <Input
              id="organization-name-{id}"
              type="text"
              name="organizationName"
              placeholder="Carcar City Government"
              required
            />
          </Field>
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
            <FieldLabel for="password-{id}">Password</FieldLabel>
            <Input
              id="password-{id}"
              type="password"
              name="password"
              required
            />
          </Field>
          <Field>
            <FieldLabel for="confirmPassword-{id}">Confirm Password</FieldLabel>
            <Input
              id="confirmPassword-{id}"
              type="password"
              name="confirmPassword"
              required
            />
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
