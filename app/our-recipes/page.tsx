import { Suspense } from "react";
import RecipeList from "./RecipeList";

export const metadata = {
  title: "Our Recipes — EatQuick",
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function OurRecipesPage({ searchParams }: Props) {
  const { q } = await searchParams;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="mb-2">Recipe Inspirations</h1>
      <p className="text-stone-500 mb-8">Discover dishes we love from around the world.</p>

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

      {q && (
        <p className="text-sm text-stone-500 mb-6">
          Results for: <strong className="text-stone-700">{q}</strong>
        </p>
      )}

      <Suspense
        key={q}
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-40 bg-stone-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <RecipeList query={q} />
      </Suspense>
    </div>
  );
}
