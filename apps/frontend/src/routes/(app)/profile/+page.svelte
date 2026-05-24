<script lang="ts">
  import { onMount } from "svelte";
  import ProfileDetailsForm from "$lib/components/profile/profile-details-form.svelte";
  import ProfileEmailForm from "$lib/components/profile/profile-email-form.svelte";
  import ProfilePasswordForm from "$lib/components/profile/profile-password-form.svelte";
  import { breadcrumbs } from "$lib/composables/breadcrumbs.svelte";

  const { data } = $props();

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

<ProfileDetailsForm user={data.user} />
<ProfilePasswordForm />
<ProfileEmailForm
  currentEmail={data.user.email}
  emailVerified={data.user.emailVerified}
/>
