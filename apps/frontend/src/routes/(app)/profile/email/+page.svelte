<script lang="ts" module>
  import { resolve } from "$app/paths";

  export const ProfileEmailRoute = () => resolve("/(app)/profile/email");
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import ProfileChangeEmail from "$lib/components/profile/profile-change-email.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  const { data } = $props();

  onMount(() => {
    const emailCrumb = breadcrumbs.addCrumb({
      href: ProfileEmailRoute(),
      label: "Email address",
      sort_order: 3,
    });

    return () => {
      breadcrumbs.removeCrumb(emailCrumb);
    };
  });
</script>

<ProfileChangeEmail
  currentEmail={data.user.email}
  emailVerified={data.user.emailVerified}
/>
