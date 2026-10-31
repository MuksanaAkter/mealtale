// Allow a sleeping Render service time to start before abandoning the request.
export const API_TIMEOUT_MS = 75_000;
export const API_UNAVAILABLE =
  "The kitchen server is unavailable or waking up. Please try again in a minute. If this continues, check the API connection.";

export function backendURL(
  env: { API_URL?: string; NODE_ENV?: string } = process.env,
) {
  const base = env.API_URL?.trim().replace(/\/+$/, "");
  if (!base && env.NODE_ENV === "production") {
    throw new Error(
      "Set API_URL to the deployed backend origin in Vercel and redeploy.",
    );
  }
  const url = new URL(base || "http://127.0.0.1:4000");
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.pathname !== "/" || url.search || url.hash ||
    url.username || url.password
  ) {
    throw new Error(
      "API_URL must be an HTTP(S) origin without /api, /health, or credentials.",
    );
  }
  return url.origin;
}
