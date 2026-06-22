"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type OrderItem = { name: string; price: number };

type Order = {
  orderNumber: string;
  orderDateFormatted: string;
  pickupFormatted: string;
  maskedName: string;
  maskedEmail: string;
  items: OrderItem[];
  total: number;
  discount: number;
  status: string;
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En préparation",
  READY: "Prête à récupérer",
  COMPLETED: "Récupérée",
  DISTRIBUTED: "Distribuée",
  CANCELLED: "Annulée",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-700",
  READY: "bg-green-100 text-green-700",
  COMPLETED: "bg-stone-100 text-stone-500",
  DISTRIBUTED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrderTrackingView({ order }: { order: Order }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold">Suivi de commande</h1>
        <p className="text-stone-400 text-sm mt-1">
          #{order.orderNumber} · {order.orderDateFormatted}
        </p>
      </div>

      {/* Badge statut */}
      <div className="flex justify-center">
        <span
          className={`text-sm font-semibold px-5 py-2 rounded-full ${
            STATUS_COLORS[order.status] ?? STATUS_COLORS.PENDING
          }`}
        >
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      {/* Bouton Rafraîchir */}
      <div className="flex justify-center">
        <button
          onClick={handleRefresh}
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className={isPending ? "animate-spin inline-block" : "inline-block"}>
            ↻
          </span>
          {isPending ? "Actualisation…" : "Rafraîchir le statut"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-100">
        {/* Informations client (masquées) */}
        <div className="p-5 space-y-2 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">
            Informations client
          </p>
          <p>
            <span className="text-stone-400 w-28 inline-block">Nom</span>
            <strong>{order.maskedName}</strong>
          </p>
          <p>
            <span className="text-stone-400 w-28 inline-block">Email</span>
            {order.maskedEmail}
          </p>
          <p>
            <span className="text-stone-400 w-28 inline-block">Retrait</span>
            <strong>{order.pickupFormatted}</strong>
          </p>
        </div>

        {/* Liste des ingrédients */}
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">
            Détail de la commande
          </p>
          <ul className="space-y-2">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="capitalize">{item.name}</span>
                <span className="text-stone-400">€{item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-700 font-semibold mt-2">
              <span>Réduction fidélité</span>
              <span>−€{order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base border-t border-stone-100 mt-3 pt-3">
            <span>Total</span>
            <span className="text-green-700">€{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
