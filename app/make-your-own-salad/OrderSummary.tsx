type Ingredient = { name: string; price: number };

type Props = {
  veggie: Ingredient | null;
  protein: Ingredient | null;
  sauce: Ingredient | null;
  extra: Ingredient | null;
  total: number;
};

const ROWS: { label: string; key: keyof Omit<Props, "total"> }[] = [
  { label: "Veggie", key: "veggie" },
  { label: "Protein", key: "protein" },
  { label: "Sauce", key: "sauce" },
  { label: "Extra", key: "extra" },
];

export default function OrderSummary({ veggie, protein, sauce, extra, total }: Props) {
  const items = { veggie, protein, sauce, extra };

  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold mb-4">Order Summary</h3>
      <ul className="space-y-2">
        {ROWS.map(({ label, key }) => {
          const item = items[key];
          return (
            <li key={key} className="flex justify-between text-sm">
              <span className="text-stone-500">{label}</span>
              {item ? (
                <span className="font-medium capitalize">
                  {item.name}{" "}
                  <span className="text-stone-400">€{item.price.toFixed(2)}</span>
                </span>
              ) : (
                <span className="text-stone-300 italic">not selected</span>
              )}
            </li>
          );
        })}
      </ul>
      <div className="border-t border-stone-100 mt-4 pt-4 flex justify-between font-bold">
        <span>Total</span>
        <span className="text-green-700">€{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
