<script lang="ts">
  import type { Snippet } from "svelte";
  import * as Card from "$lib/components/ui/card/index.js";

  let {
    title,
    description,
    children,
    footer,
  }: {
    title: string;
    description?: string;
    children: Snippet;
    footer?: Snippet;
  } = $props();
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>{title}</Card.Title>
    {#if description}
      <Card.Description>{description}</Card.Description>
    {/if}
  </Card.Header>
  <Card.Content> {@render children()} </Card.Content>
  {#if footer}
    <Card.Footer class="border-t"> {@render footer()} </Card.Footer>
  {/if}
</Card.Root>
