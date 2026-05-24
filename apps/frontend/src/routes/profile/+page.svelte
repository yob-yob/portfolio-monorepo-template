<script lang="ts">
  import { authClient } from "@asset-tracking/auth/client";
  import { onMount } from "svelte";
  import ProfileDetailsForm from "$lib/components/profile/profile-details-form.svelte";
  import ProfileEmailForm from "$lib/components/profile/profile-email-form.svelte";
  import ProfilePasswordForm from "$lib/components/profile/profile-password-form.svelte";
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

  const session = authClient.useSession();

  const user = $derived.by(
    () =>
      $session.data?.user ?? {
        name: "",
        email: "",
        image: "",
      }
  );
</script>

<ProfileDetailsForm {user} />
<ProfilePasswordForm />
<ProfileEmailForm currentEmail={user.email} />
