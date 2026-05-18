<script lang="ts">
  import { onMount } from "svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  onMount(() => {
    const profileCrumb = breadcrumbs.addCrumb({
      href: "/profile",
      label: "Profile",
    });

    return () => {
      breadcrumbs.removeCrumb(profileCrumb);
    };
  });
</script>

<h1>Profile</h1>
