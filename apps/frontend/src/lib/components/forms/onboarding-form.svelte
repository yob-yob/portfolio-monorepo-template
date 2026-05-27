<script lang="ts">
  import type { User } from "@city-os/auth/client";
  import { randCompanyName } from "@ngneat/falso";
  import type { HTMLAttributes } from "svelte/elements";
  import { authClient } from "@/auth/client";
  import { invalidateAll } from "$app/navigation";
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
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import { slugify } from "$lib/helpers.js";
  import { cn } from "$lib/utils.js";

  let {
    user,
    class: className,
    ...restProps
  }: HTMLAttributes<HTMLDivElement> & { user: User } = $props();

  const id = $props.id();

  let orgName = $state("");
  let errorMessage = $state<string | undefined>(undefined);
  let isLoading = $state<boolean>(false);

  const orgNamePlaceholder = $state(randCompanyName());

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    errorMessage = undefined;
    isLoading = true;
    const formData = new FormData(event.target as HTMLFormElement);
    const organizationName = formData.get("organizationName") as string;
    const organizationSlug = formData.get("organizationSlug") as string;
    const { error: CreateOrgError } = await authClient.organization.create({
      name: organizationName,
      slug: organizationSlug,
      userId: user.id,
    });

    if (CreateOrgError) {
      errorMessage = CreateOrgError.message ?? "An unknown error occurred";
      isLoading = false;
      return;
    }

    invalidateAll();
  };

  const generateOrgName = () => (orgName = randCompanyName());
</script>

<div class={cn("flex flex-col gap-6", className)} {...restProps}>
  <Card.Root class="overflow-hidden p-0">
    <Card.Content class="grid p-0 md:grid-cols-2">
      <form class="p-6 md:p-8" onsubmit={handleSubmit}>
        <FieldGroup>
          <div class="flex flex-col items-center gap-2 text-center">
            <h1 class="text-2xl font-bold">Organization</h1>
            <p class="text-muted-foreground text-balance">
              Create your first organization to start using the asset tracking
              system
            </p>
          </div>
          <Field>
            <FieldLabel for={`organization-name-${id}`}>
              Organization Name
            </FieldLabel>

            <InputGroup.Root>
              <InputGroup.Input
                id="organization-name-{id}"
                type="text"
                name="organizationName"
                required
                placeholder={orgNamePlaceholder}
                bind:value={orgName}
              />
              <InputGroup.Addon align="inline-end">
                <InputGroup.Button
                  variant="secondary"
                  onclick={generateOrgName}
                >
                  Generate
                </InputGroup.Button>
              </InputGroup.Addon>
            </InputGroup.Root>
          </Field>
          <Field>
            <FieldLabel for={`organization-slug-${id}`}>
              Organization Slug
            </FieldLabel>
            <Input
              id="organization-slug-{id}"
              type="text"
              name="organizationSlug"
              placeholder={slugify(orgNamePlaceholder)}
              required
              value={slugify(orgName)}
            />
            <FieldDescription> This will be used in the URL </FieldDescription>
          </Field>
          <Field>
            <Button type="submit" class="cursor-pointer" disabled={isLoading}>
              Create
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
</div>
