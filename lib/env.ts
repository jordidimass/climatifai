import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  AI_GATEWAY_API_KEY: z.string().min(1).optional(),
  AGRI_API_BASE_URL: z.url().optional(),
  AGRI_GRAPHQL_URL: z.url().optional(),
  FIRMS_MAP_KEY: z.string().min(1).optional(),
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
  FIRMS_MAP_KEY: process.env.FIRMS_MAP_KEY,
});

export const clientEnv = parse(clientSchema, {
  NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
});
