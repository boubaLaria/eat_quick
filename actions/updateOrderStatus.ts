"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@/app/generated/prisma";

const VALID_STATUSES: OrderStatus[] = ["PENDING", "READY", "COMPLETED", "CANCELLED"];

export async function updateOrderStatus(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "STAFF") redirect("/");

  const orderId = parseInt(formData.get("orderId") as string);
  const status = formData.get("status") as string;

  if (!VALID_STATUSES.includes(status as OrderStatus)) return;

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
  });

  revalidatePath("/admin");
}
