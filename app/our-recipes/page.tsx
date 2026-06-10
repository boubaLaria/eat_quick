import RecipeList from "./RecipeList";
import Pagination from "./Pagination";

export const metadata = {
  title: "Our Recipes — EatQuick",
};

const LIMIT = 10;

type Recipe = {
  id: number;
  name: string;
  cuisine: string;
  difficulty: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  caloriesPerServing: number;
  tags: string[];
  image: string;
  rating: number;
};

type Props = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function OurRecipesPage({ searchParams }: Props) {
  const { q, page: pageStr } = await searchParams;

  // page param — clamp to 1 minimum
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
  const skip = (page - 1) * LIMIT;

  // Build API URL — dummyjson supports skip + limit for both list and search
  const url = q
    ? `https://dummyjson.com/recipes/search?q=${encodeURIComponent(q)}&limit=${LIMIT}&skip=${skip}`
    : `https://dummyjson.com/recipes?limit=${LIMIT}&skip=${skip}`;

  const data = await fetch(url, { next: { revalidate: 3600 } }).then((r) =>
    r.json()
  );

  const recipes: Recipe[] = data.recipes ?? [];
  const total: number = data.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="mb-2">Recipe Inspirations</h1>
      <p className="text-stone-500 mb-8">Discover dishes we love from around the world.</p>

      {/* Search form — submits only ?q=..., which resets page to 1 naturally */}
      <form method="get" className="mb-8 flex gap-3 max-w-md">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search a recipe…"
          className="flex-1 border border-stone-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button type="submit" className="btn-primary text-sm py-2 px-5">
          Search
        </button>
        {q && (
          <a href="/our-recipes" className="btn-outline text-sm py-2 px-4">
            Clear
          </a>
        )}
      </form>

      {/* Context line */}
      <div className="flex items-center justify-between mb-6 text-sm text-stone-500">
        {q ? (
          <p>
            Résultats pour <strong className="text-stone-700">&laquo;{q}&raquo;</strong>
            {total > 0 && ` — ${total} recette${total > 1 ? "s" : ""} trouvée${total > 1 ? "s" : ""}`}
          </p>
        ) : (
          <p>{total} recettes disponibles</p>
        )}
        {totalPages > 1 && (
          <p>
            Page <strong>{page}</strong> / {totalPages}
          </p>
        )}
      </div>

      {/* Recipe grid — Server Component, no Suspense needed (awaited above) */}
      <RecipeList recipes={recipes} query={q} />

      {/*
        Pagination — each link preserves ?q to avoid losing the search query.
        Q: Comment avez-vous conservé la query d'une page à l'autre ?
        R: En l'encodant dans chaque URL de pagination (?q=...&page=N).
           Le composant Pagination reçoit `query` en prop et l'injecte dans
           chaque <Link href>. La query n'est donc jamais stockée en état
           client — elle vit dans l'URL, source de vérité unique.
      */}
      <Pagination currentPage={page} totalPages={totalPages} query={q} />
    </div>
  );
}
