"use client";

import { useState, useEffect } from "react";

type Ingredient = {
  id: number;
  name: string;
  category: string;
  price: number;
};

type Step = "build" | "choice" | "form" | "confirm";

type OrderInfo = {
  name: string;
  email: string;
  phone: string;
  pickupTime: string;
  asGuest: boolean;
};

const CATEGORIES = ["base", "protein", "topping", "dressing"] as const;

export default function SaladBuilder() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selected, setSelected] = useState<Ingredient[]>([]);
  const [step, setStep] = useState<Step>("build");
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    name: "",
    email: "",
    phone: "",
    pickupTime: "",
    asGuest: true,
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/ingredients")
      .then((r) => r.json())
      .then((d) => setIngredients(d.ingredients));
  }, []);

  const total = selected.reduce((sum, i) => sum + i.price, 0);
  const canValidate = selected.length >= 3;

  function toggle(ingredient: Ingredient) {
    setSelected((prev) =>
      prev.find((i) => i.id === ingredient.id)
        ? prev.filter((i) => i.id !== ingredient.id)
        : [...prev, ingredient]
    );
  }

  function handleOrderSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setStep("confirm");
  }

  // Today's date as min for time input
  const now = new Date();
  const minTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  if (step === "confirm") {
    const orderNumber = `EQ-${Date.now().toString().slice(-6)}`;
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="mb-2">Order confirmed!</h2>
        <p className="text-stone-500 mb-4">
          Order number: <strong className="text-green-700">{orderNumber}</strong>
        </p>
        <p className="text-stone-500 mb-8">
          Pickup at <strong>{orderInfo.pickupTime}</strong> — we&apos;ll see you soon, {orderInfo.name}!
        </p>
        <div className="card p-6 max-w-sm mx-auto text-left mb-8">
          <h3 className="mb-3 text-base">Your salad</h3>
          <ul className="space-y-1">
            {selected.map((i) => (
              <li key={i.id} className="flex justify-between text-sm">
                <span>{i.name}</span>
                <span className="text-stone-400">€{i.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-stone-100 mt-3 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-green-700">€{total.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={() => {
            setSelected([]);
            setStep("build");
            setSubmitted(false);
            setOrderInfo({ name: "", email: "", phone: "", pickupTime: "", asGuest: true });
          }}
          className="btn-primary"
        >
          New Order
        </button>
      </div>
    );
  }

  if (step === "form") {
    return (
      <div className="max-w-md mx-auto">
        <button onClick={() => setStep("choice")} className="text-green-700 text-sm hover:underline mb-6 inline-block">
          ← Back
        </button>
        <h2 className="mb-6">Your details</h2>
        <form onSubmit={handleOrderSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Full Name *</label>
            <input
              required
              type="text"
              value={orderInfo.name}
              onChange={(e) => setOrderInfo((o) => ({ ...o, name: e.target.value }))}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
            <input
              required
              type="email"
              value={orderInfo.email}
              onChange={(e) => setOrderInfo((o) => ({ ...o, email: e.target.value }))}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Phone *</label>
            <input
              required
              type="tel"
              value={orderInfo.phone}
              onChange={(e) => setOrderInfo((o) => ({ ...o, phone: e.target.value }))}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Pickup Time (today) *
            </label>
            <input
              required
              type="time"
              min={minTime}
              value={orderInfo.pickupTime}
              onChange={(e) => setOrderInfo((o) => ({ ...o, pickupTime: e.target.value }))}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-green-700">Total: €{total.toFixed(2)}</span>
            <button type="submit" className="btn-primary">
              Place Order
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (step === "choice") {
    return (
      <div className="max-w-sm mx-auto text-center py-12">
        <h2 className="mb-2">Almost there!</h2>
        <p className="text-stone-500 mb-8">How would you like to continue?</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => { setOrderInfo((o) => ({ ...o, asGuest: true })); setStep("form"); }}
            className="btn-primary"
          >
            Continue as Guest
          </button>
          <button
            onClick={() => { setOrderInfo((o) => ({ ...o, asGuest: false })); setStep("form"); }}
            className="btn-outline"
          >
            Log In to My Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex-1 bg-stone-100 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{ width: `${Math.min((selected.length / 3) * 100, 100)}%` }}
          />
        </div>
        <span className="text-sm text-stone-500 whitespace-nowrap">
          {selected.length} / 3+ selected · €{total.toFixed(2)}
        </span>
      </div>

      {/* Selected summary */}
      {selected.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {selected.map((i) => (
            <span
              key={i.id}
              onClick={() => toggle(i)}
              className="bg-green-100 text-green-800 text-xs px-3 py-1.5 rounded-full cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors"
              title="Click to remove"
            >
              {i.name} · €{i.price.toFixed(2)} ✕
            </span>
          ))}
        </div>
      )}

      {/* Ingredient grid by category */}
      {CATEGORIES.map((cat) => (
        <section key={cat} className="mb-8">
          <h3 className="capitalize mb-3 text-stone-600 text-sm font-semibold uppercase tracking-wide">
            {cat}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {ingredients
              .filter((i) => i.category === cat)
              .map((ing) => {
                const isSelected = !!selected.find((s) => s.id === ing.id);
                return (
                  <button
                    key={ing.id}
                    onClick={() => toggle(ing)}
                    className={`p-3 rounded-xl border-2 text-left transition-all text-sm ${
                      isSelected
                        ? "border-green-600 bg-green-50 text-green-800"
                        : "border-stone-200 bg-white hover:border-green-300"
                    }`}
                  >
                    <span className="font-medium block">{ing.name}</span>
                    <span className="text-xs text-stone-400">+€{ing.price.toFixed(2)}</span>
                  </button>
                );
              })}
          </div>
        </section>
      ))}

      <div className="sticky bottom-4 flex justify-end">
        <button
          disabled={!canValidate}
          onClick={() => setStep("choice")}
          className={`btn-primary transition-opacity ${!canValidate ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          Validate — €{total.toFixed(2)}
        </button>
      </div>
      {!canValidate && (
        <p className="text-sm text-stone-400 text-right mt-2">
          Choose at least 3 ingredients to continue
        </p>
      )}
    </div>
  );
}
