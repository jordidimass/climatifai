import "server-only";

import { serverEnv } from "@/lib/env";

const GQL_URL = serverEnv.CLIMATIFAI_API_URL
  ? `${serverEnv.CLIMATIFAI_API_URL}/graphql`
  : "http://localhost:8000/graphql";

export async function gqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  fetchOptions?: RequestInit,
): Promise<T> {
  const res = await fetch(GQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    ...fetchOptions,
  });

  if (!res.ok) {
    throw new Error(`GraphQL HTTP ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}
