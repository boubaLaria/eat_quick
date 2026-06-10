"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Ingredient = { name: string; price: number };

export type Order = {
  veggie: Ingredient;
  protein: Ingredient;
  sauce: Ingredient;
  extra: Ingredient | null;
};

type UserInfo = {
  name: string;
  email: string;
  phone: string;
  pickupTime: string;
};

type Step = "auth" | "info" | "recap" | "payment";

const STEPS: Step[] = ["auth", "info", "recap", "payment"];

const PAYMENT_METHODS = [
  { id: "card", label: "Carte bancaire", sublabel: "Visa, Mastercard, CB", icon: "💳" },
  { id: "paypal", label: "PayPal", sublabel: "Paiement via votre compte PayPal", icon: "🅿️" },
  { id: "apple", label: "Apple Pay", sublabel: "Face ID / Touch ID", icon: "🍎" },
  { id: "google", label: "Google Pay", sublabel: "Authentification Google", icon: "🔵" },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
};

export default function OrderModal({ isOpen, onClose, order }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("auth");
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    phone: "",
    pickupTime: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  // Reset the tunnel each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("auth");
      setPaymentMethod(null);
      setUserInfo({ name: "", email: "", phone: "", pickupTime: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const baseItems = [order.veggie, order.protein, order.sauce];
  const baseTotal = baseItems.reduce((s, i) => s + i.price, 0);
  const extraTotal = order.extra?.price ?? 0;
  const total = baseTotal + extraTotal;

  const now = new Date();
  const minTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const stepIndex = STEPS.indexOf(step);

  function handlePay() {
    const items = [
      order.veggie,
      order.protein,
      order.sauce,
      ...(order.extra ? [order.extra] : []),
    ];
    const params = new URLSearchParams({
      method: paymentMethod!,
      name: userInfo.name,
      pickup: userInfo.pickupTime,
      total: total.toFixed(2),
      items: JSON.stringify(items),
    });
    router.push(`/payment?${params.toString()}`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold">
              {step === "auth" && "Finaliser la commande"}
              {step === "info" && "Vos coordonnées"}
              {step === "recap" && "Récapitulatif de commande"}
              {step === "payment" && "Mode de paiement"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="text-stone-400 hover:text-stone-700 transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 px-6 pt-4">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= stepIndex ? "bg-green-600" : "bg-stone-200"
              }`}
            />
          ))}
        </div>

        <div className="p-6">

          {/* ── STEP 1 : auth ── */}
          {step === "auth" && (
            <div className="space-y-3">
              <p className="text-sm text-stone-500 mb-5">
                Comment souhaitez-vous continuer ?
              </p>
              <button
                onClick={() => setStep("info")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-stone-200 hover:border-green-500 transition-colors text-left group"
              >
                <span className="text-2xl">👤</span>
                <div>
                  <p className="font-semibold group-hover:text-green-700 transition-colors">
                    Continuer comme invité
                  </p>
                  <p className="text-sm text-stone-500">Rapide, sans compte nécessaire</p>
                </div>
                <span className="ml-auto text-stone-300 group-hover:text-green-500 transition-colors">→</span>
              </button>
              <button
                onClick={() => setStep("info")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-stone-200 hover:border-green-500 transition-colors text-left group"
              >
                <span className="text-2xl">🔑</span>
                <div>
                  <p className="font-semibold group-hover:text-green-700 transition-colors">
                    Se connecter
                  </p>
                  <p className="text-sm text-stone-500">Retrouvez vos commandes précédentes</p>
                </div>
                <span className="ml-auto text-stone-300 group-hover:text-green-500 transition-colors">→</span>
              </button>
            </div>
          )}

          {/* ── STEP 2 : info ── */}
          {step === "info" && (
            <form
              onSubmit={(e) => { e.preventDefault(); setStep("recap"); }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  autoComplete="name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo((p) => ({ ...p, email: e.target.value }))}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="tel"
                  autoComplete="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Heure de collecte <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="time"
                  min={minTime}
                  value={userInfo.pickupTime}
                  onChange={(e) => setUserInfo((p) => ({ ...p, pickupTime: e.target.value }))}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-stone-400 mt-1">
                  Commande à collecter aujourd&apos;hui — heure minimum : {minTime}
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep("auth")} className="btn-outline flex-1">
                  Retour
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Continuer
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 3 : recap ── */}
          {step === "recap" && (
            <div className="space-y-5">
              {/* Contact recap */}
              <div className="bg-stone-50 rounded-xl p-4 text-sm space-y-1.5">
                <p>
                  <span className="text-stone-500 w-20 inline-block">Nom</span>
                  <strong>{userInfo.name}</strong>
                </p>
                <p>
                  <span className="text-stone-500 w-20 inline-block">Email</span>
                  {userInfo.email}
                </p>
                <p>
                  <span className="text-stone-500 w-20 inline-block">Téléphone</span>
                  {userInfo.phone}
                </p>
                <p>
                  <span className="text-stone-500 w-20 inline-block">Collecte</span>
                  <strong>{userInfo.pickupTime}</strong>
                </p>
              </div>

              {/* Base breakdown */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
                  Ingrédients de base
                </p>
                <ul className="space-y-1.5">
                  {baseItems.map((item) => (
                    <li key={item.name} className="flex justify-between text-sm">
                      <span className="capitalize">{item.name}</span>
                      <span className="text-stone-500">€{item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between text-sm font-semibold border-t border-stone-100 mt-2 pt-2">
                  <span>Sous-total base</span>
                  <span>€{baseTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Extra breakdown */}
              {order.extra ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
                    Extra
                  </p>
                  <ul className="space-y-1.5">
                    <li className="flex justify-between text-sm">
                      <span className="capitalize">{order.extra.name}</span>
                      <span className="text-stone-500">€{order.extra.price.toFixed(2)}</span>
                    </li>
                  </ul>
                  <div className="flex justify-between text-sm font-semibold border-t border-stone-100 mt-2 pt-2">
                    <span>Sous-total extras</span>
                    <span>€{extraTotal.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-stone-400 italic">Aucun extra sélectionné</p>
              )}

              {/* Grand total */}
              <div className="flex justify-between font-bold text-lg border-t-2 border-stone-200 pt-4">
                <span>Total à payer</span>
                <span className="text-green-700">€{total.toFixed(2)}</span>
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => setStep("info")} className="btn-outline flex-1">
                  Retour
                </button>
                <button onClick={() => setStep("payment")} className="btn-primary flex-1">
                  Choisir le paiement
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4 : payment ── */}
          {step === "payment" && (
            <div className="space-y-4">
              <p className="text-sm text-stone-500">
                Sélectionnez votre mode de paiement pour finaliser.
              </p>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const isActive = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        isActive
                          ? "border-green-600 bg-green-50"
                          : "border-stone-200 hover:border-green-300"
                      }`}
                    >
                      <span className="text-2xl w-8 text-center">{method.icon}</span>
                      <div>
                        <p className={`font-semibold text-sm ${isActive ? "text-green-800" : ""}`}>
                          {method.label}
                        </p>
                        <p className="text-xs text-stone-500">{method.sublabel}</p>
                      </div>
                      <span
                        className={`ml-auto text-lg transition-opacity ${
                          isActive ? "text-green-600 opacity-100" : "opacity-0"
                        }`}
                      >
                        ✓
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-stone-100 pt-4">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total à payer</span>
                  <span className="text-green-700">€{total.toFixed(2)}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep("recap")} className="btn-outline flex-1">
                    Retour
                  </button>
                  <button
                    disabled={!paymentMethod}
                    onClick={handlePay}
                    className={`btn-primary flex-1 transition-opacity ${
                      !paymentMethod ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                  >
                    Valider et Payer
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
