import Link from "next/link";
export default function NotFound() {
  return (
    <main className="unavailable">
      <span className="eyebrow">A PATH LESS TRAVELLED</span>
      <h1>This corner of the kingdom is quiet.</h1>
      <p>The page you’re looking for could not be found.</p>
      <Link className="button button-forest" href="/">
        Find your way home
      </Link>
    </main>
  );
}
