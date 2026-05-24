<script lang="ts">
  import { onMount } from "svelte";
  import ProfileSessionsList from "$lib/components/profile/profile-sessions-list.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  onMount(() => {
    const profileCrumb = breadcrumbs.addCrumb({
      href: "/profile",
      label: "Profile",
    });
    const sessionsCrumb = breadcrumbs.addCrumb({
      href: "/profile/sessions",
      label: "Sessions",
    });

    return () => {
      breadcrumbs.removeCrumb(sessionsCrumb);
      breadcrumbs.removeCrumb(profileCrumb);
    };
  });
</script>

<ProfileSessionsList />
