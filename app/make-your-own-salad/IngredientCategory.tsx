type Ingredient = { name: string; price: number };

type Props = {
  title: string;
  required?: boolean;
  ingredients: Ingredient[];
  selected: Ingredient | null;
  onSelect: (ingredient: Ingredient) => void;
};

export default function IngredientCategory({
  title,
  required = false,
  ingredients,
  selected,
  onSelect,
}: Props) {
  return (
    <section className="mb-8">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-600 mb-3">
        {title}
        {required && <span className="text-red-500 ml-1">*</span>}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ingredients.map((ing) => {
          const isSelected = selected?.name === ing.name;
          return (
            <button
              key={ing.name}
              onClick={() => onSelect(ing)}
              className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                isSelected
                  ? "border-green-600 bg-green-50 text-green-800"
                  : "border-stone-200 bg-white hover:border-green-300"
              }`}
            >
              <span className="font-medium block capitalize">{ing.name}</span>
              <span className="text-xs text-stone-400">+€{ing.price.toFixed(2)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
