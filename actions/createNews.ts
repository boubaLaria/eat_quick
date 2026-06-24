"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CreateNewsState = {
  success: boolean;
  error?: string;
};

export async function createNews(
  _prevState: CreateNewsState | null,
  formData: FormData
): Promise<CreateNewsState> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "staff") {
    return { success: false, error: "Action réservée aux administrateurs." };
  }

  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const featured_image = (formData.get("featured_image") as string)?.trim();

  if (!title || !slug || !content || !featured_image) {
    return { success: false, error: "Tous les champs sont obligatoires." };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return {
      success: false,
      error: "Le slug doit être en minuscules, sans espaces (ex: mon-article).",
    };
  }

  const existing = await prisma.news.findUnique({ where: { slug } });
  if (existing) {
    return { success: false, error: `Le slug « ${slug} » est déjà utilisé.` };
  }

  await prisma.news.create({
    data: { title, slug, content, featured_image },
  });

  // Revalidate the public news listing so ISR picks up the new article
  revalidatePath("/news");

  return { success: true };
}
