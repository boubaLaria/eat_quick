"use client";

import { useState, useEffect } from "react";
import IngredientCategory from "./IngredientCategory";
import OrderSummary from "./OrderSummary";
import OrderModal from "./OrderModal";

type Ingredient = { name: string; price: number };

type IngredientsData = {
  veggies: Ingredient[];
  proteins: Ingredient[];
  sauces: Ingredient[];
  extras: Ingredient[];
};

type InitialCustomer = { id: string; name: string; email: string; phoneNumber?: string | null } | null;

export default function SaladBuilder({ initialCustomer, pendingDiscount = 0 }: { initialCustomer: InitialCustomer; pendingDiscount?: number }) {
  const [data, setData] = useState<IngredientsData | null>(null);
  const [veggie, setVeggie] = useState<Ingredient | null>(null);
  const [protein, setProtein] = useState<Ingredient | null>(null);
  const [sauce, setSauce] = useState<Ingredient | null>(null);
  const [extra, setExtra] = useState<Ingredient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/ingredients")
      .then((r) => r.json())
      .then((d: IngredientsData) => setData(d));
  }, []);

  const total = [veggie, protein, sauce, extra]
    .filter(Boolean)
    .reduce((sum, i) => sum + i!.price, 0);

  // The "Commander" button appears only when the 3 required categories are selected
  const canOrder = !!(veggie && protein && sauce);

  if (!data) {
    return <p className="text-stone-400 py-8">Chargement des ingrédients…</p>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Ingredient selection — left/main column */}
      <div className="md:col-span-2">
        <IngredientCategory
          title="Veggie (base)"
          required
          ingredients={data.veggies}
          selected={veggie}
          onSelect={setVeggie}
        />
        <IngredientCategory
          title="Protein"
          required
          ingredients={data.proteins}
          selected={protein}
          onSelect={setProtein}
        />
        <IngredientCategory
          title="Sauce"
          required
          ingredients={data.sauces}
          selected={sauce}
          onSelect={setSauce}
        />
        <IngredientCategory
          title="Extra (optional)"
          ingredients={data.extras}
          selected={extra}
          onSelect={(ing) => setExtra(extra?.name === ing.name ? null : ing)}
        />
        <p className="text-xs text-stone-400 mt-2">
          <span className="text-red-500">*</span> Champs obligatoires
        </p>
      </div>

      {/* Order summary — sticky right column */}
      <div className="md:col-span-1">
        <div className="sticky top-6 space-y-4">
          <OrderSummary
            veggie={veggie}
            protein={protein}
            sauce={sauce}
            extra={extra}
            total={total}
          />
          {canOrder ? (
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary w-full text-center"
            >
              Commander — €{total.toFixed(2)}
            </button>
          ) : (
            <p className="text-sm text-stone-400 text-center">
              Sélectionnez une veggie, une protéine et une sauce pour commander
            </p>
          )}
        </div>
      </div>

      <OrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        order={{ veggie: veggie!, protein: protein!, sauce: sauce!, extra }}
        initialCustomer={initialCustomer}
        pendingDiscount={pendingDiscount}
      />
    </div>
  );
}
