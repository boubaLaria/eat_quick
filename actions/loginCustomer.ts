"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";

export type LoginState = { error?: string; role?: string } | null;

export async function loginCustomer(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
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
  return { role: customer.role };
}
