"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export type OrderState = {
  errors?: {
    name?: string;
    email?: string;
    pickupTime?: string;
    items?: string;
    general?: string;
  };
} | null;

export async function placeOrder(
  prevState: OrderState,
  formData: FormData
): Promise<OrderState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() ?? "";
  const pickupTime = formData.get("pickupTime") as string;
  const itemsRaw = formData.get("items") as string;
  const customerIdRaw = formData.get("customerId") as string | null;

  const errors: NonNullable<OrderState>["errors"] = {};

  if (!name) errors.name = "Le nom est requis";
  if (!email) errors.email = "L'email est requis";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Format email invalide";
  if (!pickupTime) errors.pickupTime = "L'heure de retrait est requise";
  if (!itemsRaw) errors.items = "Aucun ingrédient sélectionné";

  if (Object.keys(errors).length > 0) return { errors };

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const orderNumber = `EQ-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`;

  const [hours, minutes] = pickupTime.split(":").map(Number);
  const pickup = new Date();
  pickup.setHours(hours, minutes, 0, 0);

  try {
    await prisma.order.create({
      data: {
        orderNumber,
        pickupTime: pickup,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        items: itemsRaw,
        status: "PENDING",
        customerId: customerIdRaw ? parseInt(customerIdRaw) : null,
      },
    });
  } catch {
    return { errors: { general: "Erreur lors de l'enregistrement de la commande" } };
  }

  redirect(`/tracking-order/${orderNumber}`);
}
