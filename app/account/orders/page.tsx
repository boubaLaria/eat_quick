import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Mes commandes — EatQuick",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En préparation",
  READY: "Prête à récupérer",
  COMPLETED: "Récupérée",
  DISTRIBUTED: "Distribuée",
  CANCELLED: "Annulée",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-600",
  READY: "bg-green-100 text-green-700",
  COMPLETED: "bg-stone-100 text-stone-500",
  DISTRIBUTED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-600",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { orderTime: "desc" },
    select: {
      id: true,
      orderNumber: true,
      orderTime: true,
      pickupTime: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      items: true,
      status: true,
      discount: true,
      userId: true,
    },
  });

  const enriched = orders.map((o) => {
    let items: { name: string; price: number }[] = [];
    let total = 0;
    try {
      items = JSON.parse(o.items);
      total = Math.max(0, items.reduce((sum, i) => sum + i.price, 0) - (o.discount ?? 0));
    } catch {}
    return { ...o, parsedItems: items, total };
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/account"
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Mon compte
        </Link>
        <span className="text-stone-200">/</span>
        <h1 className="text-xl font-bold text-stone-800">Mes commandes</h1>
      </div>

      {enriched.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-stone-400 text-lg">Aucune commande pour l'instant.</p>
          <Link
            href="/make-your-own-salad"
            className="mt-4 inline-block text-sm font-semibold text-green-700 hover:text-green-800"
          >
            Commander maintenant →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {enriched.map((order) => (
            <li key={order.orderNumber}>
              <Link
                href={`/order-tracking/${order.orderNumber}`}
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:border-stone-200 transition-all group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-stone-800 group-hover:text-green-700 transition-colors">
                      #{order.orderNumber}
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_COLORS[order.status] ?? STATUS_COLORS.PENDING}`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">{formatDate(order.orderTime)}</p>
                  <p className="text-xs text-stone-500 mt-1 truncate">
                    {order.parsedItems.map((i) => i.name).join(", ")}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <p className="text-sm font-bold text-green-700">€{order.total.toFixed(2)}</p>
                  <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
