"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@/app/generated/prisma";

const VALID_STATUSES: OrderStatus[] = ["PENDING", "READY", "COMPLETED", "DISTRIBUTED", "CANCELLED"];

export async function updateOrderStatus(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "staff") redirect("/");

  const orderId = parseInt(formData.get("orderId") as string);
  const status = formData.get("status") as string;

  if (!VALID_STATUSES.includes(status as OrderStatus)) return;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true, userId: true, items: true },
  });

  if (!order) return;

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
  });

  // Award loyalty points when order is marked as distributed
  if (status === "DISTRIBUTED" && order.status !== "DISTRIBUTED" && order.userId) {
    let total = 0;
    try {
      const items = JSON.parse(order.items) as { price: number }[];
      total = items.reduce((sum, i) => sum + i.price, 0);
    } catch {}
    const points = Math.floor(total);
    if (points > 0) {
      await prisma.user.update({
        where: { id: order.userId },
        data: { loyaltyPoints: { increment: points } },
      });
    }
  }

  revalidatePath("/admin");
}
