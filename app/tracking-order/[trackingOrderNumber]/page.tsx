import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

type Props = { params: Promise<{ trackingOrderNumber: string }> };

export async function generateMetadata({ params }: Props) {
  const { trackingOrderNumber } = await params;
  return { title: `Commande ${trackingOrderNumber} — EatQuick` };
}

type OrderItem = { name: string; price: number };

const STATUSES = ["PENDING", "READY", "COMPLETED"] as const;

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En préparation",
  READY: "Prête à récupérer",
  COMPLETED: "Récupérée",
  CANCELLED: "Annulée",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-700",
  READY: "bg-green-100 text-green-700",
  COMPLETED: "bg-stone-100 text-stone-500",
  CANCELLED: "bg-red-100 text-red-700",
};

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${local[0]}${"*".repeat(Math.min(local.length - 1, 4))}@${domain}`;
}

export default async function TrackingPage({ params }: Props) {
  const { trackingOrderNumber } = await params;

  // select limits the fields fetched from the database — sensitive data
  // (customerPhone, customerId) are deliberately excluded for the public view
  const order = await prisma.order.findUnique({
    where: { orderNumber: trackingOrderNumber },
    select: {
      orderNumber: true,
      orderTime: true,
      pickupTime: true,
      customerName: true,
      customerEmail: true,
      items: true,
      status: true,
      customerId: true,
    },
  });

  if (!order) notFound();

  // Check whether the current session belongs to the owner of this order
  const session = await getSession();
  const isOwner =
    session?.userId != null && order.customerId === session.userId;

  let items: OrderItem[] = [];
  try {
    items = JSON.parse(order.items);
  } catch {
    // malformed JSON — show empty list
  }

  const total = items.reduce((sum, i) => sum + i.price, 0);

  const pickupFormatted = order.pickupTime.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const orderDateFormatted = order.orderTime.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const isCancelled = order.status === "CANCELLED";
  const currentStatusIndex = STATUSES.indexOf(
    order.status as (typeof STATUSES)[number]
  );

  return (
    <main className="max-w-lg mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-1">Suivi de commande</h1>
      <p className="text-stone-400 text-sm mb-8">
        #{order.orderNumber} · {orderDateFormatted}
      </p>

      {/* Status badge */}
      <div className="flex justify-center mb-6">
        <span
          className={`text-sm font-semibold px-4 py-1.5 rounded-full ${
            STATUS_COLORS[order.status] ?? STATUS_COLORS.PENDING
          }`}
        >
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      {/* Progress stepper — hidden if cancelled */}
      {!isCancelled && (
        <div className="flex items-center mb-8">
          {STATUSES.map((s, i) => {
            const done = i <= currentStatusIndex;
            const isLast = i === STATUSES.length - 1;
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      done
                        ? "bg-green-600 text-white"
                        : "bg-stone-200 text-stone-400"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 text-center leading-tight w-16">
                    {STATUS_LABELS[s]}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={`flex-1 h-0.5 mx-1 mb-4 transition-colors ${
                      i < currentStatusIndex ? "bg-green-500" : "bg-stone-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-100">

        {/* Customer info — email masked for non-owners */}
        <div className="p-5 space-y-2 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">
            Informations client
          </p>
          <p>
            <span className="text-stone-400 w-24 inline-block">Nom</span>
            <strong>{order.customerName}</strong>
          </p>
          <p>
            <span className="text-stone-400 w-24 inline-block">Email</span>
            {isOwner ? order.customerEmail : maskEmail(order.customerEmail)}
            {!isOwner && (
              <span className="ml-2 text-xs text-stone-400 italic">
                (connectez-vous pour voir en entier)
              </span>
            )}
          </p>
          <p>
            <span className="text-stone-400 w-24 inline-block">Retrait</span>
            <strong>{pickupFormatted}</strong>
          </p>
        </div>

        {/* Items list */}
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-3">
            Détail de la commande
          </p>
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="capitalize">{item.name}</span>
                <span className="text-stone-400">€{item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold text-base border-t border-stone-100 mt-3 pt-3">
            <span>Total</span>
            <span className="text-green-700">€{total.toFixed(2)}</span>
          </div>
        </div>

      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        {!isOwner && (
          <Link
            href="/login"
            className="text-sm text-green-700 hover:underline font-medium"
          >
            Se connecter pour accéder à toutes vos commandes
          </Link>
        )}
        <Link
          href="/"
          className="text-sm text-stone-400 hover:text-stone-700 transition-colors"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
