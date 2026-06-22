import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { updateOrderStatus } from "@/actions/updateOrderStatus";

type Props = { params: Promise<{ id: string }> };

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

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Commande #${id} — Admin EatQuick` };
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const orderId = parseInt(id, 10);
  if (isNaN(orderId)) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  if (!order) notFound();

  let items: { name: string; price: number }[] = [];
  try {
    items = JSON.parse(order.items);
  } catch {}

  const rawTotal = items.reduce((sum, i) => sum + i.price, 0);
  const discount = order.discount ?? 0;
  const total = Math.max(0, rawTotal - discount);

  return (
    <main className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Dashboard
        </Link>
        <span className="text-stone-200">/</span>
        <h1 className="text-xl font-bold text-stone-800">Détail commande</h1>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-100">
        {/* En-tête commande */}
        <div className="p-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-1">
              Numéro de commande
            </p>
            <p className="font-mono text-sm text-stone-700">{order.orderNumber}</p>
            <p className="text-xs text-stone-400 mt-1">
              Passée le{" "}
              {order.orderTime.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 ${
              STATUS_COLORS[order.status] ?? STATUS_COLORS.PENDING
            }`}
          >
            {STATUS_LABELS[order.status] ?? order.status}
          </span>
        </div>

        {/* Informations client */}
        <div className="p-5 space-y-2 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">
            Informations client
          </p>
          <p>
            <span className="text-stone-400 w-24 inline-block">Nom</span>
            <strong>{order.customerName}</strong>
            {order.user && (
              <span className="ml-2 text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-full">
                compte lié
              </span>
            )}
          </p>
          <p>
            <span className="text-stone-400 w-24 inline-block">Email</span>
            {order.customerEmail}
          </p>
          <p>
            <span className="text-stone-400 w-24 inline-block">Téléphone</span>
            {order.customerPhone || <span className="text-stone-300">—</span>}
          </p>
          <p>
            <span className="text-stone-400 w-24 inline-block">Retrait</span>
            <strong>
              {order.pickupTime.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </strong>
          </p>
        </div>

        {/* Détail des articles */}
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">
            Articles commandés
          </p>
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="capitalize text-stone-700">{item.name}</span>
                <span className="text-stone-400">€{item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-700 font-semibold mt-3 border-t border-stone-100 pt-3">
              <span>Réduction fidélité</span>
              <span>−€{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base border-t border-stone-100 mt-3 pt-3">
            <span>Total</span>
            <span className="text-green-700">€{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Modifier le statut */}
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">
            Modifier le statut
          </p>
          <form action={updateOrderStatus} className="flex items-center gap-3">
            <input type="hidden" name="orderId" value={order.id} />
            <select
              name="status"
              defaultValue={order.status}
              className="flex-1 border border-stone-200 rounded-xl px-3 py-2.5 text-sm bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="PENDING">En préparation</option>
              <option value="READY">Prête à récupérer</option>
              <option value="COMPLETED">Récupérée</option>
              <option value="DISTRIBUTED">Distribuée</option>
              <option value="CANCELLED">Annulée</option>
            </select>
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Mettre à jour
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
