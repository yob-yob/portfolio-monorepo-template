<script lang="ts" module>
  import { resolve } from "$app/paths";

  export const ProfileSessionsRoute = () => resolve("/(app)/profile/sessions");
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import ProfileSessionsList from "$lib/components/profile/profile-sessions-list.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  onMount(() => {
    const sessionsCrumb = breadcrumbs.addCrumb({
      href: ProfileSessionsRoute(),
      label: "Sessions",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(sessionsCrumb);
    };
  });
</script>

<ProfileSessionsList />
