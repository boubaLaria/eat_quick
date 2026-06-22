import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ChevronLeft, Star, Lock, Tag } from "lucide-react";
import RedeemButton from "./RedeemButton";
import type { CouponTier } from "@/actions/redeemCoupon";

export const metadata = { title: "Fidélité — EatQuick" };

const COUPONS: { points: CouponTier; discount: number; label: string }[] = [
  { points: 100, discount: 2, label: "2€ de réduction" },
  { points: 300, discount: 5, label: "5€ de réduction" },
  { points: 500, discount: 10, label: "10€ de réduction" },
];

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function LoyaltyPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { loyaltyPoints: true, pendingDiscount: true },
  });

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { orderTime: "desc" },
    select: { orderNumber: true, orderTime: true, items: true, status: true, discount: true },
  });

  const enrichedOrders = orders.map((o) => {
    let total = 0;
    try {
      const items = JSON.parse(o.items) as { price: number }[];
      total = items.reduce((sum, i) => sum + i.price, 0);
    } catch {}
    const pointsEarned = o.status === "DISTRIBUTED" ? Math.floor(total) : null;
    return { ...o, total, pointsEarned };
  });

  const loyaltyPoints = user?.loyaltyPoints ?? 0;
  const pendingDiscount = user?.pendingDiscount ?? 0;
  const hasPendingDiscount = pendingDiscount > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-10">
      {/* Header breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/account"
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Mon compte
        </Link>
        <span className="text-stone-200">/</span>
        <h1 className="text-xl font-bold text-stone-800">Programme de fidélité</h1>
      </div>

      {/* Points balance card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-white shadow-lg">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -right-2 w-20 h-20 bg-white/10 rounded-full" />
        <p className="text-sm font-medium opacity-80 mb-1">Mes points</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-extrabold">{loyaltyPoints}</span>
          <span className="text-lg font-semibold opacity-70 mb-1">pts</span>
        </div>
        <p className="text-xs opacity-70 mt-2">1€ dépensé = 1 point · cumulés à la distribution</p>
      </div>

      {/* Pending discount alert */}
      {hasPendingDiscount && (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl p-4">
          <Tag className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-green-800">
              Réduction de {pendingDiscount}€ disponible !
            </p>
            <p className="text-xs text-green-600 mt-0.5">
              Elle sera automatiquement appliquée sur votre prochaine commande.
            </p>
          </div>
        </div>
      )}

      {/* Coupons section */}
      <section>
        <h2 className="text-base font-bold text-stone-800 mb-4">Coupons disponibles</h2>
        <ul className="space-y-3">
          {COUPONS.map(({ points, discount, label }) => {
            const unlockable = loyaltyPoints >= points && !hasPendingDiscount;
            const locked = loyaltyPoints < points;
            return (
              <li
                key={points}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  locked
                    ? "bg-stone-50 border-stone-100 opacity-60"
                    : "bg-white border-amber-100 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      locked ? "bg-stone-100" : "bg-amber-50"
                    }`}
                  >
                    {locked ? (
                      <Lock className="w-4 h-4 text-stone-400" />
                    ) : (
                      <Star className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800">{label}</p>
                    <p className="text-xs text-stone-400">{points} points requis</p>
                  </div>
                </div>
                <RedeemButton
                  pointsCost={points as CouponTier}
                  disabled={!unlockable}
                  disabledReason={
                    hasPendingDiscount
                      ? "Vous avez déjà une réduction en attente"
                      : locked
                      ? `Il vous manque ${points - loyaltyPoints} points`
                      : undefined
                  }
                />
              </li>
            );
          })}
        </ul>
      </section>

      {/* Order history with points */}
      <section>
        <h2 className="text-base font-bold text-stone-800 mb-4">Historique des points</h2>
        {enrichedOrders.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-sm">
            Aucune commande pour l&apos;instant.{" "}
            <Link href="/make-your-own-salad" className="text-green-700 font-semibold hover:underline">
              Commander maintenant →
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {enrichedOrders.map((order) => (
              <li
                key={order.orderNumber}
                className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-stone-100 shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold text-stone-700">
                    #{order.orderNumber}
                  </p>
                  <p className="text-xs text-stone-400">{formatDate(order.orderTime)}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-stone-500">€{order.total.toFixed(2)}</span>
                  {order.pointsEarned !== null ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                      <Star className="w-3 h-3" />
                      +{order.pointsEarned} pts
                    </span>
                  ) : (
                    <span className="text-xs text-stone-300 px-2.5 py-1">—</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
