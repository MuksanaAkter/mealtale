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
      `${process.env.API_URL ?? "http://127.0.0.1:4000"}/api/state`,
      {
        headers: { cookie: `mealtale_session=${cookie.value}` },
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      },
    );
  } catch {
    return (
      <main className="unavailable">
        <h1>The kitchen is resting.</h1>
        <p>
          Start the database and both apps with <code>pnpm run dev</code>, then
          refresh this page.
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
