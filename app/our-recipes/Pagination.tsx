import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  query?: string;
};

function href(page: number, query?: string) {
  const p = new URLSearchParams();
  if (query) p.set("q", query);
  p.set("page", String(page));
  return `/our-recipes?${p.toString()}`;
}

export default function Pagination({ currentPage, totalPages, query }: Props) {
  if (totalPages <= 1) return null;

  // Build page list with ellipsis
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const linkBase =
    "flex items-center justify-center rounded-lg text-sm font-medium transition-colors border";
  const active = "bg-green-600 text-white border-green-600";
  const inactive = "border-stone-200 hover:border-green-500 hover:text-green-700";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-10 flex-wrap">
      {currentPage > 1 && (
        <Link href={href(currentPage - 1, query)} className={`${linkBase} ${inactive} px-3 py-2`}>
          ← Préc.
        </Link>
      )}

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`dots-${i}`} className="px-1 text-stone-400 select-none">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p, query)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`${linkBase} w-9 h-9 ${p === currentPage ? active : inactive}`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link href={href(currentPage + 1, query)} className={`${linkBase} ${inactive} px-3 py-2`}>
          Suiv. →
        </Link>
      )}
    </nav>
  );
}
