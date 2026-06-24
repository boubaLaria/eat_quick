import Link from "next/link";
import { connection } from "next/server";
import prisma from "@/lib/prisma";
import { updateOrderStatus } from "@/actions/updateOrderStatus";

export const metadata = { title: "Dashboard — EatQuick" };

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

export default async function AdminDashboardPage() {
  await connection();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [pendingToday, readyToday, orders] = await Promise.all([
    prisma.order.count({
      where: { status: "PENDING", orderTime: { gte: today, lt: tomorrow } },
    }),
    prisma.order.count({
      where: { status: "READY", orderTime: { gte: today, lt: tomorrow } },
    }),
    prisma.order.findMany({
      orderBy: { orderTime: "desc" },
      include: { user: { select: { id: true, name: true } } },
    }),
  ]);

  return (
    <main className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard staff</h1>
        <Link
          href="/admin/news"
          className="btn-outline text-sm py-2 px-4"
        >
          Gérer les actualités
        </Link>
      </div>

      <section className="grid grid-cols-2 gap-4 mb-10 max-w-md">
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-center">
          <p className="text-4xl font-bold text-orange-700">{pendingToday}</p>
          <p className="text-sm text-orange-600 mt-1 font-medium">
            En préparation aujourd&apos;hui
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
          <p className="text-4xl font-bold text-green-700">{readyToday}</p>
          <p className="text-sm text-green-600 mt-1 font-medium">
            Prêtes à récupérer aujourd&apos;hui
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          Toutes les commandes ({orders.length})
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-stone-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">N° commande</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Retrait</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Modifier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-stone-500">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hover:text-green-700 hover:underline transition-colors"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-stone-600">
                    {order.orderTime.toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    <span className="text-stone-400">
                      {order.orderTime.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{order.customerName}</span>
                    {order.user && (
                      <span className="ml-1.5 text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-full">
                        compte
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-stone-500">{order.customerEmail}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-stone-600">
                    {order.pickupTime.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        STATUS_COLORS[order.status] ?? STATUS_COLORS.PENDING
                      }`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <form action={updateOrderStatus} className="flex items-center gap-2">
                      <input type="hidden" name="orderId" value={order.id} />
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option value="PENDING">En préparation</option>
                        <option value="READY">Prête à récupérer</option>
                        <option value="COMPLETED">Récupérée</option>
                        <option value="DISTRIBUTED">Distribuée</option>
                        <option value="CANCELLED">Annulée</option>
                      </select>
                      <button
                        type="submit"
                        className="text-xs bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        OK
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-stone-400 text-sm"
                  >
                    Aucune commande pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
