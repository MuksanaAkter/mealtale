"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="unavailable">
      <span className="eyebrow">EVEN MAGIC NEEDS A MOMENT</span>
      <h1>A little kitchen mishap.</h1>
      <p>We couldn’t open this part of the kingdom. Please try again.</p>
      <button className="button button-forest" onClick={reset}>
        Try again
      </button>
      <Link className="inline-link" href="/">
        Back to the kingdom
      </Link>
    </main>
  );
}
