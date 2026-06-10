"use client";

import { useState, useEffect, useActionState } from "react";
import { placeOrder } from "@/actions/placeOrder";
import { loginCustomerInline } from "@/actions/loginCustomerInline";

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

type InitialCustomer = { id: number; name: string; email: string } | null;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  item: { name: string; price: number };
  initialCustomer: InitialCustomer;
};

export default function MenuItemOrderModal({ isOpen, onClose, item, initialCustomer }: Props) {
  const [step, setStep] = useState<Step>(initialCustomer ? "info" : "auth");
  const [showLogin, setShowLogin] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(initialCustomer?.id ?? null);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: initialCustomer?.name ?? "",
    email: initialCustomer?.email ?? "",
    phone: "",
    pickupTime: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const [loginState, loginAction, loginPending] = useActionState(loginCustomerInline, null);
  const [orderState, orderAction, orderPending] = useActionState(placeOrder, null);

  useEffect(() => {
    if (isOpen) {
      setStep(initialCustomer ? "info" : "auth");
      setShowLogin(false);
      setCustomerId(initialCustomer?.id ?? null);
      setPaymentMethod(null);
      setUserInfo({
        name: initialCustomer?.name ?? "",
        email: initialCustomer?.email ?? "",
        phone: "",
        pickupTime: "",
      });
    }
  }, [isOpen, initialCustomer]);

  useEffect(() => {
    if (loginState?.customer) {
      setCustomerId(loginState.customer.id);
      setUserInfo((prev) => ({
        ...prev,
        name: loginState.customer!.name,
        email: loginState.customer!.email,
      }));
      setStep("info");
      setShowLogin(false);
    }
  }, [loginState]);

  if (!isOpen) return null;

  const now = new Date();
  const minTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const stepIndex = STEPS.indexOf(step);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-100">
          <h2 className="text-lg font-bold">
            {step === "auth" && "Finaliser la commande"}
            {step === "info" && "Vos coordonnées"}
            {step === "recap" && "Récapitulatif de commande"}
            {step === "payment" && "Mode de paiement"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="text-stone-400 hover:text-stone-700 transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100"
          >
            ✕
          </button>
        </div>

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
              <p className="text-sm text-stone-500 mb-5">Comment souhaitez-vous continuer ?</p>
              {!showLogin ? (
                <>
                  <button
                    onClick={() => { setCustomerId(null); setStep("info"); }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-stone-200 hover:border-green-500 transition-colors text-left group"
                  >
                    <span className="text-2xl">👤</span>
                    <div>
                      <p className="font-semibold group-hover:text-green-700 transition-colors">Continuer comme invité</p>
                      <p className="text-sm text-stone-500">Rapide, sans compte nécessaire</p>
                    </div>
                    <span className="ml-auto text-stone-300 group-hover:text-green-500 transition-colors">→</span>
                  </button>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-stone-200 hover:border-green-500 transition-colors text-left group"
                  >
                    <span className="text-2xl">🔑</span>
                    <div>
                      <p className="font-semibold group-hover:text-green-700 transition-colors">Se connecter</p>
                      <p className="text-sm text-stone-500">Retrouvez vos commandes précédentes</p>
                    </div>
                    <span className="ml-auto text-stone-300 group-hover:text-green-500 transition-colors">→</span>
                  </button>
                </>
              ) : (
                <form action={loginAction} className="space-y-4">
                  <button type="button" onClick={() => setShowLogin(false)} className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
                    ← Retour
                  </button>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                    <input required type="email" name="email" autoComplete="email" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Mot de passe</label>
                    <input required type="password" name="password" autoComplete="current-password" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  {loginState?.error && <p className="text-sm text-red-500">{loginState.error}</p>}
                  <button type="submit" disabled={loginPending} className={`btn-primary w-full ${loginPending ? "opacity-60 cursor-not-allowed" : ""}`}>
                    {loginPending ? "Connexion…" : "Se connecter"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ── STEP 2 : info ── */}
          {step === "info" && (
            <form onSubmit={(e) => { e.preventDefault(); setStep("recap"); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nom complet <span className="text-red-500">*</span></label>
                <input required type="text" autoComplete="name" value={userInfo.name} onChange={(e) => setUserInfo((p) => ({ ...p, name: e.target.value }))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input required type="email" autoComplete="email" value={userInfo.email} onChange={(e) => setUserInfo((p) => ({ ...p, email: e.target.value }))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Téléphone <span className="text-red-500">*</span></label>
                <input required type="tel" autoComplete="tel" value={userInfo.phone} onChange={(e) => setUserInfo((p) => ({ ...p, phone: e.target.value }))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Heure de collecte <span className="text-red-500">*</span></label>
                <input required type="time" min={minTime} value={userInfo.pickupTime} onChange={(e) => setUserInfo((p) => ({ ...p, pickupTime: e.target.value }))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                <p className="text-xs text-stone-400 mt-1">Commande à collecter aujourd&apos;hui — heure minimum : {minTime}</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep("auth")} className="btn-outline flex-1">Retour</button>
                <button type="submit" className="btn-primary flex-1">Continuer</button>
              </div>
            </form>
          )}

          {/* ── STEP 3 : recap ── */}
          {step === "recap" && (
            <div className="space-y-5">
              <div className="bg-stone-50 rounded-xl p-4 text-sm space-y-1.5">
                <p><span className="text-stone-500 w-20 inline-block">Nom</span><strong>{userInfo.name}</strong></p>
                <p><span className="text-stone-500 w-20 inline-block">Email</span>{userInfo.email}</p>
                <p><span className="text-stone-500 w-20 inline-block">Téléphone</span>{userInfo.phone}</p>
                <p><span className="text-stone-500 w-20 inline-block">Collecte</span><strong>{userInfo.pickupTime}</strong></p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">Commande</p>
                <div className="flex justify-between text-sm py-2 border-b border-stone-100">
                  <span>{item.name}</span>
                  <span className="text-stone-500">€{item.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg border-t-2 border-stone-200 pt-4">
                <span>Total à payer</span>
                <span className="text-green-700">€{item.price.toFixed(2)}</span>
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => setStep("info")} className="btn-outline flex-1">Retour</button>
                <button onClick={() => setStep("payment")} className="btn-primary flex-1">Choisir le paiement</button>
              </div>
            </div>
          )}

          {/* ── STEP 4 : payment ── */}
          {step === "payment" && (
            <form action={orderAction} className="space-y-4">
              <input type="hidden" name="name" value={userInfo.name} />
              <input type="hidden" name="email" value={userInfo.email} />
              <input type="hidden" name="phone" value={userInfo.phone} />
              <input type="hidden" name="pickupTime" value={userInfo.pickupTime} />
              <input type="hidden" name="items" value={JSON.stringify([item])} />
              {customerId !== null && <input type="hidden" name="customerId" value={customerId} />}
              <input type="hidden" name="paymentMethod" value={paymentMethod ?? ""} />

              <p className="text-sm text-stone-500">Sélectionnez votre mode de paiement pour finaliser.</p>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const isActive = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        isActive ? "border-green-600 bg-green-50" : "border-stone-200 hover:border-green-300"
                      }`}
                    >
                      <span className="text-2xl w-8 text-center">{method.icon}</span>
                      <div>
                        <p className={`font-semibold text-sm ${isActive ? "text-green-800" : ""}`}>{method.label}</p>
                        <p className="text-xs text-stone-500">{method.sublabel}</p>
                      </div>
                      <span className={`ml-auto text-lg transition-opacity ${isActive ? "text-green-600 opacity-100" : "opacity-0"}`}>✓</span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-stone-100 pt-4">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total à payer</span>
                  <span className="text-green-700">€{item.price.toFixed(2)}</span>
                </div>
                {orderState?.errors?.general && <p className="text-sm text-red-500 mb-3">{orderState.errors.general}</p>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep("recap")} className="btn-outline flex-1">Retour</button>
                  <button
                    type="submit"
                    disabled={!paymentMethod || orderPending}
                    className={`btn-primary flex-1 transition-opacity ${!paymentMethod || orderPending ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {orderPending ? "Enregistrement…" : "Valider et Payer"}
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
