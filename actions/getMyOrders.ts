"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export type RecentOrder = {
  orderNumber: string;
  status: string;
  orderTime: string;
  total: number;
};

export async function getMyOrders(limit = 3): Promise<RecentOrder[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { orderTime: "desc" },
    take: limit,
    select: { orderNumber: true, status: true, orderTime: true, items: true },
  });

  return orders.map((o) => {
    let total = 0;
    try {
      const items = JSON.parse(o.items) as { price: number }[];
      total = items.reduce((sum, i) => sum + i.price, 0);
    } catch {}
    return {
      orderNumber: o.orderNumber,
      status: o.status,
      orderTime: o.orderTime.toISOString(),
      total,
    };
  });
}
