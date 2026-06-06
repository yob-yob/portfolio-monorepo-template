<!-- Organization general settings page -->
<script lang="ts" module>
  import { resolve } from "$app/paths";

  export const OrganizationSettingsRoute = (organizationSlug: string) =>
    resolve("/(app)/[organizationSlug]/settings", {
      organizationSlug,
    });
</script>

<script lang="ts">
  import CameraIcon from "@lucide/svelte/icons/camera";
  import TriangleAlertIcon from "@lucide/svelte/icons/triangle-alert";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import ProfileSettingsSection from "$lib/components/profile/profile-settings-section.svelte";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  const id = $props.id();
  const { params } = $props();
  const currentOrganizationSlug = $derived(params.organizationSlug);

  const slugToDisplayName = (slug: string): string =>
    slug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || "Organization";

  let organizationName = $state("");
  let organizationSlug = $state("");

  $effect.pre(() => {
    const slug = currentOrganizationSlug;
    organizationName = slugToDisplayName(slug);
    organizationSlug = slug;
  });
  let logoPreview = $state<string | undefined>(undefined);
  let newOwnerIdentifier = $state("");

  const logoFallbackInitials = $derived(
    organizationName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "OR"
  );

  onMount(() => {
    const OrganizationGeneralSettingsCrumb = breadcrumbs.addCrumb({
      href: OrganizationSettingsRoute(currentOrganizationSlug),
      label: "General",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(OrganizationGeneralSettingsCrumb);
    };
  });

  const handleLogoChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    logoPreview = URL.createObjectURL(file);
  };

  const handleRemoveLogo = () => {
    logoPreview = undefined;
  };

  const handleLogoSubmit = (event: Event) => {
    event.preventDefault();
    toast.success("Organization logo update saved (placeholder)");
  };

  const handleNameSubmit = (event: Event) => {
    event.preventDefault();
    if (!organizationName.trim()) {
      toast.warning("Organization name cannot be empty");
      return;
    }
    toast.success("Organization name update saved (placeholder)");
  };

  const handleSlugSubmit = (event: Event) => {
    event.preventDefault();
    const normalizedSlug = organizationSlug.trim().toLowerCase();
    if (!normalizedSlug) {
      toast.warning("Organization slug cannot be empty");
      return;
    }
    if (normalizedSlug !== currentOrganizationSlug) {
      toast.warning(
        "Slug changes are discouraged — review warnings before saving"
      );
    }
    toast.success("Organization slug update saved (placeholder)");
  };

  const handleSwitchOwnerSubmit = (event: Event) => {
    event.preventDefault();
    if (!newOwnerIdentifier.trim()) {
      toast.warning("Enter an email address or user ID for the new owner");
      return;
    }
    toast.success("Ownership transfer request submitted (placeholder)");
  };
</script>

<div class="space-y-6">
  <div class="space-y-1">
    <h2 class="text-2xl font-semibold tracking-tight">General</h2>
    <p class="text-muted-foreground text-sm">
      Manage your organization's identity, URL slug, and ownership.
    </p>
  </div>

  <ProfileSettingsSection
    title="Organization logo"
    description="Upload a logo that appears across your organization workspace."
  >
    {#snippet children()}
      <form id="organization-logo-form-{id}" onsubmit={handleLogoSubmit}>
        <Field>
          <FieldLabel>Logo</FieldLabel>
          <div class="flex flex-wrap items-center gap-4">
            <Avatar.Root class="size-20 rounded-lg">
              {#if logoPreview}
                <Avatar.Image src={logoPreview} alt={organizationName} />
              {/if}
              <Avatar.Fallback class="rounded-lg text-lg">
                {logoFallbackInitials}
              </Avatar.Fallback>
            </Avatar.Root>
            <div class="flex flex-wrap gap-2">
              <Button type="button" variant="outline" class="relative">
                <CameraIcon />
                Upload logo
                <input
                  type="file"
                  accept="image/*"
                  class="absolute inset-0 cursor-pointer opacity-0"
                  onchange={handleLogoChange}
                  aria-label="Upload organization logo"
                  name="logo"
                >
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={!logoPreview}
                onclick={handleRemoveLogo}
              >
                Remove
              </Button>
            </div>
          </div>
          <FieldDescription>
            JPG, PNG, or GIF. Recommended at least 256×256 pixels.
          </FieldDescription>
        </Field>
      </form>
    {/snippet}
    {#snippet footer()}
      <Button type="submit" form="organization-logo-form-{id}">
        Save logo
      </Button>
    {/snippet}
  </ProfileSettingsSection>

  <ProfileSettingsSection
    title="Organization name"
    description="The display name shown to members and on shared resources."
  >
    {#snippet children()}
      <form id="organization-name-form-{id}" onsubmit={handleNameSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel for="organization-name-{id}">Name</FieldLabel>
            <Input
              id="organization-name-{id}"
              name="name"
              bind:value={organizationName}
              placeholder="Acme Corporation"
              autocomplete="organization"
            />
            <FieldDescription>
              This name is visible to all organization members.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    {/snippet}
    {#snippet footer()}
      <Button type="submit" form="organization-name-form-{id}">
        Save name
      </Button>
    {/snippet}
  </ProfileSettingsSection>

  <ProfileSettingsSection
    title="Organization slug"
    description="The URL-friendly identifier used in your organization's address."
  >
    {#snippet children()}
      <form id="organization-slug-form-{id}" onsubmit={handleSlugSubmit}>
        <FieldGroup>
          <div
            class="flex gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm"
            role="alert"
          >
            <TriangleAlertIcon
              class="size-5 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
            <div class="space-y-1">
              <p class="font-medium text-amber-950 dark:text-amber-100">
                Changing your slug is discouraged
              </p>
              <p class="text-amber-900/80 dark:text-amber-100/80">
                Updating the slug changes your organization's URL. Existing
                bookmarks and shared links may break. Integrations, webhooks, and
                API callbacks that reference the old slug will need to be
                updated.
              </p>
            </div>
          </div>

          <Field>
            <FieldLabel for="organization-slug-{id}">Slug</FieldLabel>
            <Input
              id="organization-slug-{id}"
              name="slug"
              bind:value={organizationSlug}
              placeholder="acme-corp"
              autocomplete="off"
              spellcheck={false}
              aria-describedby="organization-slug-hint-{id}"
            />
            <FieldDescription id="organization-slug-hint-{id}">
              Lowercase letters, numbers, and hyphens only. Your organization is
              currently reachable at
              <span class="font-mono">/{currentOrganizationSlug}</span>.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    {/snippet}
    {#snippet footer()}
      <Button
        type="submit"
        form="organization-slug-form-{id}"
        variant="outline"
      >
        Save slug
      </Button>
    {/snippet}
  </ProfileSettingsSection>

  <ProfileSettingsSection
    title="Switch owner"
    description="Transfer organization ownership to another member."
  >
    {#snippet children()}
      <form id="organization-owner-form-{id}" onsubmit={handleSwitchOwnerSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel for="new-owner-identifier-{id}">
              New owner email or user ID
            </FieldLabel>
            <Input
              id="new-owner-identifier-{id}"
              name="newOwner"
              type="text"
              bind:value={newOwnerIdentifier}
              placeholder="member@example.com or usr_abc123"
              autocomplete="off"
              aria-describedby="new-owner-hint-{id}"
            />
            <FieldDescription id="new-owner-hint-{id}">
              The new owner must already be a member of this organization. They
              will gain full administrative control, and your role will change
              after the transfer completes.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    {/snippet}
    {#snippet footer()}
      <Button
        type="submit"
        form="organization-owner-form-{id}"
        variant="destructive"
      >
        Transfer ownership
      </Button>
    {/snippet}
  </ProfileSettingsSection>
</div>
