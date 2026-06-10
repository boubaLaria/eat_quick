"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";

export type LoginInlineState = {
  error?: string;
  customer?: { id: number; name: string; email: string };
} | null;

export async function loginCustomerInline(
  _prevState: LoginInlineState,
  formData: FormData
): Promise<LoginInlineState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email et mot de passe requis" };
  }

  const customer = await prisma.customer.findUnique({ where: { email } });

  if (!customer || !(await bcrypt.compare(password, customer.password))) {
    return { error: "Email ou mot de passe incorrect" };
  }

  await createSession(customer.id, customer.role);
  return { customer: { id: customer.id, name: customer.name, email: customer.email } };
}
