<script lang="ts">
  import CameraIcon from "@lucide/svelte/icons/camera";
  import { authClient } from "@/auth/client";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import ProfileSettingsSection from "./profile-settings-section.svelte";

  const id = $props.id();

  let { user }: { user: { name: string; image?: string } } = $props();

  let name = $derived(user.name);
  let avatarPreview = $derived(user.image);

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const image = formData.get("image") as string;
    const { error } = await authClient.updateUser({ name, image });
    if (error) {
      console.error(error);
    }
  };

  const handleAvatarChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    avatarPreview = URL.createObjectURL(file);
  };

  const handleRemoveAvatar = () => {
    avatarPreview = undefined;
  };
</script>

<ProfileSettingsSection
  title="Profile"
  description="Update your display name and profile picture."
>
  {#snippet children()}
    <form id="profile-details-form" onsubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel>Profile picture</FieldLabel>
          <div class="flex flex-wrap items-center gap-4">
            <Avatar.Root class="size-20 rounded-lg">
              {#if avatarPreview}
                <Avatar.Image src={avatarPreview} alt={name} />
              {/if}
              <Avatar.Fallback class="rounded-lg text-lg">
                {name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
            <div class="flex flex-wrap gap-2">
              <Button type="button" variant="outline" class="relative">
                <CameraIcon />
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  class="absolute inset-0 cursor-pointer opacity-0"
                  onchange={handleAvatarChange}
                  aria-label="Upload profile image"
                >
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={!avatarPreview}
                onclick={handleRemoveAvatar}
              >
                Remove
              </Button>
            </div>
          </div>
          <FieldDescription>
            JPG, PNG, or GIF. Recommended at least 256×256 pixels.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel for="profile-name-{id}">Display name</FieldLabel>
          <Input
            id="profile-name-{id}"
            name="name"
            bind:value={name}
            placeholder="Your name"
            autocomplete="name"
          />
        </Field>
      </FieldGroup>
    </form>
  {/snippet}
  {#snippet footer()}
    <Button type="submit" form="profile-details-form">Save changes</Button>
  {/snippet}
</ProfileSettingsSection>
