<!-- Organization general settings page  -->
<script lang="ts">
  import { onMount } from "svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  onMount(() => {
    const dashboardCrumb = breadcrumbs.addCrumb({
      href: "/",
      label: "Organization General Settings",
    });

    return () => {
      breadcrumbs.removeCrumb(dashboardCrumb);
    };
  });
</script>

<h1>Organization General Settings</h1>
