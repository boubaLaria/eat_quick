"use client";

import { useState } from "react";
import Link from "next/link";

type OrderItem = { name: string; price: number };

type Props = {
  method: string;
  name: string;
  pickup: string;
  total: string;
  items: OrderItem[];
};

const METHOD_LABELS: Record<string, { label: string; icon: string }> = {
  card: { label: "Carte bancaire", icon: "💳" },
  paypal: { label: "PayPal", icon: "🅿️" },
  apple: { label: "Apple Pay", icon: "🍎" },
  google: { label: "Google Pay", icon: "🔵" },
};

const CARD_TYPES = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "amex", label: "American Express" },
  { value: "cb", label: "Carte Bancaire (CB)" },
];

// ── client-side helpers ──────────────────────────────────────────────────────

function formatCardNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

function detectCardType(num: string): string {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^6/.test(n)) return "cb";
  return "";
}

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\s/g, "").split("").map(Number);
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i];
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function isExpiryValid(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);
  if (month < 1 || month > 12) return false;
  return new Date(year, month, 0) >= new Date();
}

// ── Confirmation screen ──────────────────────────────────────────────────────

function Confirmation({
  name,
  pickup,
  total,
  items,
  methodInfo,
  orderRef,
}: {
  name: string;
  pickup: string;
  total: string;
  items: OrderItem[];
  methodInfo: { label: string; icon: string };
  orderRef: string;
}) {
  return (
    <div className="text-center py-12 max-w-md mx-auto">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="mb-1">Paiement accepté !</h1>
      <p className="text-stone-500 mb-1">
        Merci <strong>{name}</strong>, votre commande est confirmée.
      </p>
      <p className="text-stone-500 mb-8">
        Référence :{" "}
        <strong className="text-green-700 font-mono text-lg">{orderRef}</strong>
      </p>

      {/* Order recap */}
      <div className="card p-5 text-left mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">
          Récapitulatif de la commande
        </p>
        <ul className="space-y-1.5 mb-3">
          {items.map((item) => (
            <li key={item.name} className="flex justify-between text-sm">
              <span className="capitalize">{item.name}</span>
              <span className="text-stone-500">€{item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-stone-100 pt-3 flex justify-between font-bold">
          <span>Total payé</span>
          <span className="text-green-700">€{total}</span>
        </div>
      </div>

      {/* Pickup & payment info */}
      <div className="card p-5 text-left text-sm space-y-2 mb-8">
        <p>
          <span className="text-stone-500 w-32 inline-block">Collecte à</span>
          <strong>{pickup}</strong> aujourd&apos;hui
        </p>
        <p>
          <span className="text-stone-500 w-32 inline-block">Moyen de paiement</span>
          {methodInfo.icon} {methodInfo.label}
        </p>
      </div>

      <Link href="/" className="btn-primary">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function PaymentClient({ method, name, pickup, total, items }: Props) {
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Card form fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  // Per-field error messages (client + server merged)
  const [errors, setErrors] = useState<Record<string, string>>({});

  const methodInfo = METHOD_LABELS[method] ?? { label: method, icon: "💰" };
  const orderRef = `EQ-${Math.floor(Math.random() * 900000 + 100000)}`;
  const cvvLength = cardType === "amex" ? 4 : 3;

  if (confirmed) {
    return (
      <Confirmation
        name={name}
        pickup={pickup}
        total={total}
        items={items}
        methodInfo={methodInfo}
        orderRef={orderRef}
      />
    );
  }

  // ── Client-side validation ────────────────────────────────────────────────
  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    const raw = cardNumber.replace(/\s/g, "");
    if (raw.length < 13 || raw.length > 16 || !/^\d+$/.test(raw)) {
      e.cardNumber = "Numéro invalide (13–16 chiffres)";
    } else if (!luhnCheck(raw)) {
      e.cardNumber = "Numéro de carte invalide";
    }
    if (!cardType) e.cardType = "Sélectionnez un type de carte";
    if (!isExpiryValid(expiry)) e.expiry = "Date invalide ou expirée";
    if (!new RegExp(`^\\d{${cvvLength}}$`).test(cvv))
      e.cvv = `${cvvLength} chiffres requis`;
    if (cardHolder.trim().length < 2) e.cardHolder = "Nom requis";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    // ── Server-side validation ──────────────────────────────────────────────
    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardNumber, cardType, expiry, cvv, cardHolder }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setErrors(data.errors ?? { general: "Erreur de validation serveur" });
    } else {
      setConfirmed(true);
    }
  }

  // ── Amount + method summary ───────────────────────────────────────────────
  const SummaryBar = () => (
    <div className="card p-4 mb-6 flex justify-between items-center">
      <span className="text-stone-500 text-sm">
        {methodInfo.icon} {methodInfo.label}
      </span>
      <span className="font-bold text-green-700 text-xl">€{total}</span>
    </div>
  );

  // ── Card form ─────────────────────────────────────────────────────────────
  if (method === "card") {
    return (
      <div className="max-w-md mx-auto">
        <SummaryBar />
        <form onSubmit={handleSubmit} noValidate className="card p-6 space-y-5">
          <h2 className="text-base">Informations de carte</h2>

          {/* Card number */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Numéro de carte <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => {
                const v = formatCardNumber(e.target.value);
                setCardNumber(v);
                setCardType(detectCardType(v));
              }}
              className={`w-full border rounded-lg px-3 py-2 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.cardNumber ? "border-red-400" : "border-stone-300"
              }`}
            />
            {errors.cardNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>
            )}
          </div>

          {/* Card type */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Type de carte <span className="text-red-500">*</span>
            </label>
            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.cardType ? "border-red-400" : "border-stone-300"
              }`}
            >
              <option value="">Sélectionner…</option>
              {CARD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.cardType && (
              <p className="text-xs text-red-500 mt-1">{errors.cardType}</p>
            )}
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Expiration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/AA"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.expiry ? "border-red-400" : "border-stone-300"
                }`}
              />
              {errors.expiry && (
                <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Cryptogramme <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder={"•".repeat(cvvLength)}
                maxLength={cvvLength}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, cvvLength))}
                className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.cvv ? "border-red-400" : "border-stone-300"
                }`}
              />
              {errors.cvv && (
                <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>

          {/* Cardholder name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Nom du détenteur <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoComplete="cc-name"
              placeholder="JEAN DUPONT"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              className={`w-full border rounded-lg px-3 py-2 text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.cardHolder ? "border-red-400" : "border-stone-300"
              }`}
            />
            {errors.cardHolder && (
              <p className="text-xs text-red-500 mt-1">{errors.cardHolder}</p>
            )}
          </div>

          {errors.general && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {errors.general}
            </p>
          )}

          <p className="text-xs text-stone-400">
            Paiement fictif — n&apos;entrez pas de vraies données bancaires.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className={`btn-primary w-full transition-opacity ${
              submitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Vérification…" : `Confirmer le paiement — €${total}`}
          </button>
        </form>
      </div>
    );
  }

  // ── PayPal ────────────────────────────────────────────────────────────────
  if (method === "paypal") {
    return (
      <div className="max-w-md mx-auto">
        <SummaryBar />
        <div className="card p-8 text-center space-y-5">
          <div className="text-5xl">🅿️</div>
          <p className="font-semibold text-lg text-blue-700">PayPal</p>
          <p className="text-stone-500 text-sm">
            Vous seriez normalement redirigé vers PayPal pour finaliser votre
            paiement de <strong>€{total}</strong>.
          </p>
          <button onClick={() => setConfirmed(true)} className="btn-primary w-full">
            Simuler le paiement PayPal
          </button>
        </div>
      </div>
    );
  }

  // ── Apple Pay ─────────────────────────────────────────────────────────────
  if (method === "apple") {
    return (
      <div className="max-w-md mx-auto">
        <SummaryBar />
        <div className="card p-8 text-center space-y-5">
          <div className="text-5xl">🍎</div>
          <p className="font-semibold text-lg">Apple Pay</p>
          <p className="text-stone-500 text-sm">
            Authentifiez-vous via Face ID ou Touch ID pour payer{" "}
            <strong>€{total}</strong>.
          </p>
          <button onClick={() => setConfirmed(true)} className="btn-primary w-full">
            Simuler l&apos;authentification Face ID
          </button>
        </div>
      </div>
    );
  }

  // ── Google Pay ────────────────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto">
      <SummaryBar />
      <div className="card p-8 text-center space-y-5">
        <div className="text-5xl">🔵</div>
        <p className="font-semibold text-lg">Google Pay</p>
        <p className="text-stone-500 text-sm">
          Authentifiez-vous via votre compte Google pour payer{" "}
          <strong>€{total}</strong>.
        </p>
        <button onClick={() => setConfirmed(true)} className="btn-primary w-full">
          Simuler l&apos;authentification Google
        </button>
      </div>
    </div>
  );
}
