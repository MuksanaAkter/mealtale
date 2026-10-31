import { backendURL, API_TIMEOUT_MS, API_UNAVAILABLE } from "@/lib/api/backend";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { KingdomProvider } from "@/components/kingdom/provider";
import { KingdomShell } from "@/components/kingdom/shell";
import type { KingdomState } from "@/lib/types";
import Link from "next/link";
export default async function KingdomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = (await cookies()).get("mealtale_session");
  if (!cookie) redirect("/login");
  let response: Response;
  try {
    response = await fetch(
      `${backendURL()}/api/state`,
      {
        headers: { cookie: `mealtale_session=${cookie.value}` },
        cache: "no-store",
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      },
    );
  } catch {
    return (
      <main className="unavailable">
        <h1>The kitchen is resting.</h1>
        <p>
          {API_UNAVAILABLE} Refresh this page to reconnect.
        </p>
        <Link className="button button-forest" href="/">
          Back to MealTale
        </Link>
      </main>
    );
  }
  if (response.status === 401) redirect("/login");
  if (!response.ok)
    throw new Error(
      "The kitchen could not be opened. Check the server and database connection.",
    );
  const initial = (await response.json()) as KingdomState;
  return (
    <KingdomProvider initial={initial}>
      <KingdomShell>{children}</KingdomShell>
    </KingdomProvider>
  );
}
