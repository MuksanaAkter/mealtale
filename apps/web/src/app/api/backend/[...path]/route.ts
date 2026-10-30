import type { NextRequest } from "next/server";

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  if (request.method !== "GET") {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin)
      return Response.json({ error: "Origin not allowed" }, { status: 403 });
  }
  if (path.some((segment) => !/^[a-zA-Z0-9_-]+$/.test(segment)))
    return Response.json({ error: "Invalid path" }, { status: 400 });
  try {
    const response = await fetch(
      `${process.env.API_URL ?? "http://127.0.0.1:4000"}/api/${path.join("/")}`,
      {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          cookie: request.headers.get("cookie") ?? "",
          origin: request.nextUrl.origin,
        },
        ...(request.method === "GET" ? {} : { body: await request.text() }),
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
      },
    );
    const headers = new Headers({
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    });
    for (const cookie of response.headers.getSetCookie())
      headers.append("Set-Cookie", cookie);
    return new Response(await response.text(), {
      status: response.status,
      headers,
    });
  } catch {
    return Response.json(
      {
        error:
          "The kitchen server is resting. Run pnpm run dev from the project root.",
      },
      { status: 503 },
    );
  }
}
export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
