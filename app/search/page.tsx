import { getAllMenuItems } from "@/lib/menu";
import MenuCard from "@/components/MenuCard";
import Link from "next/link";

export const metadata = {
  title: "Rechercher un plat — EatQuick",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q = "" } = await searchParams;
  const query = Array.isArray(q) ? q[0] : q;
  const normalized = query.toLowerCase().trim();

  const allItems = getAllMenuItems();
  const results = normalized
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(normalized) ||
          item.ingredients.some((ing) =>
            ing.toLowerCase().includes(normalized)
          ) ||
          item.category.toLowerCase().includes(normalized)
      )
    : allItems;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="mb-2">Rechercher un plat</h1>

      <form action="/search" method="get" className="flex gap-3 mb-8 max-w-xl">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Ex : salade, feta, quinoa…"
          className="flex-1 px-4 py-2 rounded-full border border-stone-300 text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-600"
          autoFocus
        />
        <button type="submit" className="btn-primary py-2 px-5 text-sm">
          Rechercher
        </button>
      </form>

      {normalized && (
        <p className="text-stone-500 mb-6">
          {results.length} résultat{results.length !== 1 ? "s" : ""} pour{" "}
          <span className="font-semibold text-stone-700">&quot;{query}&quot;</span>
        </p>
      )}

      {!normalized && (
        <p className="text-stone-500 mb-6">Tous les plats ({results.length})</p>
      )}

      {normalized && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-stone-500 mb-4">Aucun plat ne correspond à &quot;{query}&quot;.</p>
          <Link href="/menus" className="btn-outline text-sm py-2 px-5">
            Voir tout le menu
          </Link>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item) => (
            <MenuCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
