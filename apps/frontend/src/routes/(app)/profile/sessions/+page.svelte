<script lang="ts">
  import { onMount } from "svelte";
  import ProfileSessionsList from "$lib/components/profile/profile-sessions-list.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  onMount(() => {
    const profileCrumb = breadcrumbs.addCrumb({
      href: "/profile",
      label: "Profile",
      sort_order: 2,
    });
    const sessionsCrumb = breadcrumbs.addCrumb({
      href: "/profile/sessions",
      label: "Sessions",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(sessionsCrumb);
      breadcrumbs.removeCrumb(profileCrumb);
    };
  });
</script>

<ProfileSessionsList />
