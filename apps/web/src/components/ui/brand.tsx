import Link from "next/link";
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="MealTale home">
      <svg
        width="38"
        height="43"
        viewBox="0 0 44 50"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M7 10 22 3l15 7v18c0 9-15 18-15 18S7 37 7 28Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M13 26h18l-2 10H15l-2-10ZM11 23h22M22 22V12m0 7c-7 0-8-6-8-6 7-1 8 6 8 6Zm0-3c7 0 8-6 8-6-7-1-8 6-8 6Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span>
          MealTale<small>THE ENCHANTED KITCHEN</small>
        </span>
      )}
    </Link>
  );
}
