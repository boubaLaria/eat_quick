import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

type OrderItem = { name: string; price: number };

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: "En cours de préparation", color: "bg-orange-100 text-orange-700" },
  READY: { label: "Prête à récupérer", color: "bg-green-100 text-green-700" },
  COMPLETED: { label: "Récupérée", color: "bg-stone-100 text-stone-600" },
  CANCELLED: { label: "Annulée", color: "bg-red-100 text-red-700" },
};

export default async function TrackingPage({
  params,
}: {
  params: Promise<{ trackingOrderNumber: string }>;
}) {
  const { trackingOrderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber: trackingOrderNumber },
  });

  if (!order) notFound();

  let items: OrderItem[] = [];
  try {
    items = JSON.parse(order.items);
  } catch {
    // malformed JSON — show empty list
  }

  const total = items.reduce((sum, i) => sum + i.price, 0);
  const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
  const pickupFormatted = order.pickupTime.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="max-w-lg mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-1">Suivi de commande</h1>
      <p className="text-stone-400 text-sm mb-8">#{order.orderNumber}</p>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-stone-500">Statut</span>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${status.color}`}>
            {status.label}
          </span>
        </div>

        <div className="text-sm space-y-1.5 border-t border-stone-100 pt-4">
          <p>
            <span className="text-stone-400 w-24 inline-block">Nom</span>
            <strong>{order.customerName}</strong>
          </p>
          <p>
            <span className="text-stone-400 w-24 inline-block">Email</span>
            {order.customerEmail}
          </p>
          <p>
            <span className="text-stone-400 w-24 inline-block">Retrait</span>
            <strong>{pickupFormatted}</strong>
          </p>
        </div>

        <div className="border-t border-stone-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">
            Ingrédients
          </p>
          <ul className="space-y-1.5">
            {items.map((item, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="capitalize">{item.name}</span>
                <span className="text-stone-400">€{item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold border-t border-stone-100 mt-3 pt-3">
            <span>Total</span>
            <span className="text-green-700">€{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <a
        href="/"
        className="block text-center text-sm text-stone-400 hover:text-stone-700 mt-8 transition-colors"
      >
        ← Retour à l&apos;accueil
      </a>
    </main>
  );
}
