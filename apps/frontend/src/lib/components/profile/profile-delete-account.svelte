<script lang="ts">
  import AlertTriangleIcon from "@lucide/svelte/icons/alert-triangle";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  const id = $props.id();
  const confirmPhrase = "DELETE";

  let understands = $state(false);
  let confirmation = $state("");
  let showConfirmation = $state(false);

  const canDelete = $derived(
    understands && confirmation.trim().toUpperCase() === confirmPhrase
  );

  const handleSubmit = (event: Event) => {
    event.preventDefault();
  };
</script>

<div class="space-y-6">
  <div class="space-y-1">
    <h2 class="text-2xl font-semibold tracking-tight">Delete account</h2>
    <p class="text-muted-foreground text-sm">
      Permanently remove your account and all associated data.
    </p>
  </div>

  <Card.Root
    class="border-destructive/50 bg-destructive/5 gap-4 py-6"
  >
    <Card.Header class="pb-0">
      <div class="flex items-start gap-3">
        <div
          class="bg-destructive/15 text-destructive flex size-10 shrink-0 items-center justify-center rounded-lg"
        >
          <AlertTriangleIcon class="size-5" />
        </div>
        <div class="space-y-1">
          <Card.Title class="text-destructive">Danger zone</Card.Title>
          <Card.Description>
            Deleting your account is permanent and cannot be undone. You will
            lose access to all assets, history, and settings immediately.
          </Card.Description>
        </div>
      </div>
    </Card.Header>
    <Card.Content class="space-y-4">
      <ul
        class="text-muted-foreground list-inside list-disc space-y-1 text-sm"
      >
        <li>All personal data will be erased from our systems.</li>
        <li>Active sessions will be revoked on every device.</li>
        <li>You will not be able to recover your account or data.</li>
      </ul>

      {#if !showConfirmation}
        <Button
          variant="destructive"
          type="button"
          onclick={() => {
            showConfirmation = true;
          }}
        >
          I want to delete my account
        </Button>
      {:else}
        <form id="profile-delete-form" class="space-y-4" onsubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <div class="flex items-start gap-3">
                <input
                  id="delete-understand-{id}"
                  type="checkbox"
                  bind:checked={understands}
                  class="border-input mt-1 size-4 rounded border"
                />
                <div class="space-y-1">
                  <Label for="delete-understand-{id}" class="font-medium">
                    I understand this action is permanent
                  </Label>
                  <FieldDescription>
                    I acknowledge that deleting my account cannot be reversed.
                  </FieldDescription>
                </div>
              </div>
            </Field>

            <Field>
              <FieldLabel for="delete-confirm-{id}">
                Type <span class="font-mono font-semibold">{confirmPhrase}</span>
                to confirm
              </FieldLabel>
              <Input
                id="delete-confirm-{id}"
                name="confirmation"
                bind:value={confirmation}
                placeholder={confirmPhrase}
                autocomplete="off"
                aria-describedby="delete-confirm-hint-{id}"
              />
              <FieldDescription id="delete-confirm-hint-{id}">
                This confirms you intend to permanently delete your account.
              </FieldDescription>
            </Field>
          </FieldGroup>

          <div class="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onclick={() => {
                showConfirmation = false;
                understands = false;
                confirmation = "";
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!canDelete}
            >
              Delete my account permanently
            </Button>
          </div>
        </form>
      {/if}
    </Card.Content>
  </Card.Root>
</div>
