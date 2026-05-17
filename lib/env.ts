import { z } from "zod";

/**
 * Validated environment access. Server-only — never import from a Client
 * Component or the secrets in `serverEnv` will be inlined into the bundle.
 *
 * Reads are tolerant in development (warn) and strict in production
 * (throw on the first server module that imports a missing required key).
 */

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  AI_GATEWAY_API_KEY: z.string().min(1).optional(),
  AGRI_API_BASE_URL: z.url().optional(),
  AGRI_GRAPHQL_URL: z.url().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string().min(1).optional(),
});

function parse<T extends z.ZodTypeAny>(schema: T, source: Record<string, string | undefined>) {
  const result = schema.safeParse(source);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  · ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Invalid environment configuration:\n${issues}`);
    }
    console.warn(`[env] schema warnings:\n${issues}`);
    return source as z.infer<T>;
  }
  return result.data;
}

export const serverEnv = parse(serverSchema, {
  NODE_ENV: process.env.NODE_ENV,
  AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
  AGRI_API_BASE_URL: process.env.AGRI_API_BASE_URL,
  AGRI_GRAPHQL_URL: process.env.AGRI_GRAPHQL_URL,
});

export const clientEnv = parse(clientSchema, {
  NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
});
