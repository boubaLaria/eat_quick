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
  recipes: Recipe[];
  query?: string;
};

export default function RecipeList({ recipes, query }: Props) {
  if (recipes.length === 0) {
    return (
      <p className="text-stone-500 text-center py-16">
        {query
          ? `Aucune recette trouvée pour « ${query} ».`
          : "Aucune recette disponible."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={recipe.image}
            alt={recipe.name}
            className="h-44 w-full object-cover"
            loading="lazy"
          />
          <div className="p-4">
            <h3 className="text-base mb-1">{recipe.name}</h3>
            <p className="text-xs text-stone-400 mb-2">
              {recipe.cuisine} · {recipe.caloriesPerServing} kcal
            </p>
            <div className="flex flex-wrap gap-1 mb-2">
              {recipe.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between text-xs text-stone-400">
              <span>⏱ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
              <span>⭐ {recipe.rating}</span>
              <span className="capitalize">{recipe.difficulty}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
