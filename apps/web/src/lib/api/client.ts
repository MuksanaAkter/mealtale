export async function api<T = { ok: boolean }>(
  path: string,
  method = "GET",
  data?: unknown,
): Promise<T> {
  const response = await fetch(`/api/backend/${path}`, {
    method,
    headers: method === "GET" ? {} : { "Content-Type": "application/json" },
    ...(method === "GET" ? {} : { body: JSON.stringify(data ?? {}) }),
  });
  const json = await response.json();
  if (!response.ok)
    throw new Error(json.error ?? "Something went wrong. Please try again.");
  return json as T;
}
