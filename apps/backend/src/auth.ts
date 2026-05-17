import auth from "@asset-tracking/auth/server";
import Elysia from "elysia";

// user middleware (compute user and session and pass to routes)
export const betterAuth = new Elysia({
  name: "better-auth",
})
  .mount("/api/auth/", auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });
        if (!session) {
          return status(401);
        }
        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });

// OpenAPI Schema
let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;

const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const authOpenApiSchema = {
  getPaths: (prefix = "/api/auth") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const pathItem = paths[path];

        if (!pathItem) {
          continue;
        }

        const key = prefix + path;

        reference[key] = pathItem;

        for (const method of Object.keys(pathItem) as Array<
          keyof typeof pathItem
        >) {
          const operation = pathItem[method];

          if (operation && typeof operation === "object") {
            operation.tags = ["Better Auth"];
          }
        }
      }

      return reference;
      // biome-ignore lint/suspicious/noExplicitAny: could not fix
    }) as Promise<any>,

  // biome-ignore lint/suspicious/noExplicitAny: could not fix
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
