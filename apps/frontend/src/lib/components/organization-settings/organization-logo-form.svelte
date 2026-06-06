<script lang="ts">
  import CameraIcon from "@lucide/svelte/icons/camera";
  import { toast } from "svelte-sonner";
  import { authClient } from "@/auth/client";
  import { isSupportedMimeType } from "@/backend/utils/constants/supported-mime-types";
  import { invalidateAll } from "$app/navigation";
  import { backend } from "$lib/api";
  import SettingsSection from "$lib/components/settings-section.svelte";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Field,
    FieldDescription,
    FieldLabel,
  } from "$lib/components/ui/field/index.js";

  const id = $props.id();

  let {
    organizationName,
    organizationId,
    logoPreview,
  }: {
    organizationName: string;
    organizationId: string;
    logoPreview: string | null | undefined;
  } = $props();

  const logoFallbackInitials = $derived(
    organizationName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "OR"
  );

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

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const file = formData.get("logo") as File;

    if (!file) {
      toast.warning("No file selected");
      return;
    }

    if (!isSupportedMimeType(file.type)) {
      toast.warning(`Unsupported File Type: ${file.type}`);
      return;
    }

    // upload logo
    const { data: uploadLogoData, error: uploadLogoError } =
      await backend.storage.upload.post({
        contextType: "organization",
        contextId: organizationId,
        location: "logo",
        files: [file],
      });

    if (uploadLogoError) {
      toast.error(`Failed to upload logo: ${uploadLogoError.value.message}`);
      return;
    }

    const { error: updateOrganizationLogoError } =
      await authClient.organization.update({
        data: {
          logo: uploadLogoData.files[0],
        },
      });

    if (updateOrganizationLogoError) {
      toast.error(
        `Failed to update organization logo: ${updateOrganizationLogoError.message}`
      );

      // delete uploaded file if an error occurs!!!

      return;
    }

    invalidateAll();

    toast.success("Organization logo update saved...");
  };
</script>

<SettingsSection
  title="Organization logo"
  description="Upload a logo that appears across your organization workspace."
>
  {#snippet children()}
    <form id="organization-logo-form-{id}" onsubmit={handleSubmit}>
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
    <Button type="submit" form="organization-logo-form-{id}">Save logo</Button>
  {/snippet}
</SettingsSection>
