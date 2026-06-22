"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function updatePhone(
  phone: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return { success: false, error: "Non authentifié" };
  }

  const value = phone.trim() || null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { phoneNumber: value },
  });

  return { success: true };
}
