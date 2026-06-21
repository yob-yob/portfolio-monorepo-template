import adapter from "svelte-adapter-bun";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
    runes: ({ filename }) =>
      // biome-ignore lint/performance/useTopLevelRegex: reason
      filename.split(/[/\\]/).includes("node_modules") ? undefined : true,

    experimental: {
      async: true,
    },
  },
  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),

    alias: {
      "@/backend/*": "../../apps/backend/src/*",
      "@/database/*": "../../packages/database/src/*",
      "@/api-client/*": "../../packages/api-client/src/*",
      "@/auth/client": "../../packages/auth/src/auth-client.ts",
    },

    experimental: {
      handleRenderingErrors: true,
    },
  },
};

export default config;
