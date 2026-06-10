"use server";

import prisma from "@/lib/prisma";

export type LoginState = {
  error?: string;
  customer?: { id: number; name: string; email: string };
} | null;

export async function loginCustomer(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email et mot de passe requis" };
  }

  const customer = await prisma.customer.findUnique({ where: { email } });

  // Plain-text comparison — for educational purposes only, use bcrypt in production
  if (!customer || customer.password !== password) {
    return { error: "Email ou mot de passe incorrect" };
  }

  return { customer: { id: customer.id, name: customer.name, email: customer.email } };
}
