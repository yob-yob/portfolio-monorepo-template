<script>
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";
</script>

<Breadcrumb.Root>
  <Breadcrumb.List>
    {#each breadcrumbs.sortedBreadcrumbs() as crumb, index}
      <Breadcrumb.Item>
        <Breadcrumb.Link href={crumb.href}> {crumb.label} </Breadcrumb.Link>
      </Breadcrumb.Item>

      {#if index < breadcrumbs.breadcrumbs.size - 1}
        <Breadcrumb.Separator class="hidden md:block" />
      {/if}
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>
