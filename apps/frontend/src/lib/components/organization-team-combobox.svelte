<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { tick } from "svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { cn } from "$lib/utils.js";

  interface TeamOption {
    id: string;
    name: string;
  }

  let {
    teams,
    value,
    disabled = false,
    organizationName,
    onValueChange,
  }: {
    teams: TeamOption[];
    value: string;
    disabled?: boolean;
    organizationName: string;
    onValueChange: (teamId: string) => void;
  } = $props();

  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement | null>(null);

  const selectedTeamName = $derived(
    teams.find((team) => team.id === value)?.name ?? "Select team..."
  );

  const closeAndFocusTrigger = () => {
    open = false;
    tick().then(() => {
      triggerRef?.focus();
    });
  };
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="outline"
        size="sm"
        class="min-w-64 max-w-44 justify-between"
        role="combobox"
        aria-expanded={open}
        aria-label={`Select team for ${organizationName}`}
        {disabled}
      >
        <span class="truncate">{selectedTeamName}</span>
        <ChevronsUpDownIcon class="ms-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-(--bits-popover-anchor-width) min-w-32 p-0">
    <Command.Root>
      <Command.List>
        <Command.Empty>No teams found.</Command.Empty>
        <Command.Group>
          {#each teams as team (team.id)}
            <Command.Item
              value={team.id}
              onSelect={() => {
                onValueChange(team.id);
                closeAndFocusTrigger();
              }}
            >
              <CheckIcon
                class={cn(
                  "me-2 size-4",
                  value !== team.id && "text-transparent"
                )}
              />
              <span class="truncate">{team.name}</span>
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
