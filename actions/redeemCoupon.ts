"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CouponTier = 100 | 300 | 500;

const COUPON_DISCOUNTS: Record<CouponTier, number> = {
  100: 2,
  300: 5,
  500: 10,
};

export type RedeemResult = { success: true; discount: number } | { success: false; error: string };

export async function redeemCoupon(pointsCost: CouponTier): Promise<RedeemResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Non authentifié" };

  const discount = COUPON_DISCOUNTS[pointsCost];
  if (!discount) return { success: false, error: "Coupon invalide" };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { loyaltyPoints: true, pendingDiscount: true },
  });

  if (!user) return { success: false, error: "Utilisateur introuvable" };
  if (user.loyaltyPoints < pointsCost)
    return { success: false, error: "Points insuffisants" };
  if (user.pendingDiscount > 0)
    return { success: false, error: "Vous avez déjà une réduction en attente" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      loyaltyPoints: { decrement: pointsCost },
      pendingDiscount: discount,
    },
  });

  revalidatePath("/account/loyalty");
  return { success: true, discount };
}
