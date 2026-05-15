<script>
  import { api } from "@asset-tracking/api-client";
</script>

<h1>Welcome to SvelteKit</h1>

<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read
  the documentation
</p>

{#await api.api.v1.get()}
  <p>waiting for the promise to resolve...</p>
{:then value}
  <p>The value is {value.data}</p>
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}
