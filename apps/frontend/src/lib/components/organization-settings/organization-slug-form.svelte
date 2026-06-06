<script lang="ts">
  import TriangleAlertIcon from "@lucide/svelte/icons/triangle-alert";
  import { toast } from "svelte-sonner";
  import SettingsSection from "$lib/components/settings-section.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  const id = $props.id();

  let { organizationSlug }: { organizationSlug: string } = $props();

  let slug = $state("");

  $effect.pre(() => {
    slug = organizationSlug;
  });

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    const normalizedSlug = slug.trim().toLowerCase();
    if (!normalizedSlug) {
      toast.warning("Organization slug cannot be empty");
      return;
    }
    if (normalizedSlug !== organizationSlug) {
      toast.warning(
        "Slug changes are discouraged — review warnings before saving"
      );
    }
    toast.success("Organization slug update saved (placeholder)");
  };
</script>

<SettingsSection
  title="Organization slug"
  description="The URL-friendly identifier used in your organization's address."
>
  {#snippet children()}
    <form id="organization-slug-form-{id}" onsubmit={handleSubmit}>
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
              API callbacks that reference the old slug will need to be updated.
            </p>
          </div>
        </div>

        <Field>
          <FieldLabel for="organization-slug-{id}">Slug</FieldLabel>
          <Input
            id="organization-slug-{id}"
            name="slug"
            bind:value={slug}
            placeholder="acme-corp"
            autocomplete="off"
            spellcheck={false}
            aria-describedby="organization-slug-hint-{id}"
          />
          <FieldDescription id="organization-slug-hint-{id}">
            Lowercase letters, numbers, and hyphens only. Your organization is
            currently reachable at
            <span class="font-mono">/{organizationSlug}</span>.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  {/snippet}
  {#snippet footer()}
    <Button type="submit" form="organization-slug-form-{id}" variant="outline">
      Save slug
    </Button>
  {/snippet}
</SettingsSection>
