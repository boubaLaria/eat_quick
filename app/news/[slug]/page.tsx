import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await prisma.news.findMany({ select: { slug: true } });
  return articles.map((a: { slug: string }) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.news.findUnique({ where: { slug } });
  if (!article) return { title: "Article introuvable — EatQuick" };
  return { title: `${article.title} — EatQuick` };
}

// Cached component — new Date() is frozen at cache-generation time (ISR effect)
async function ArticleContent({ slug }: { slug: string }) {
  "use cache";
  cacheLife("days");

  const article = await prisma.news.findUnique({ where: { slug } });
  if (!article) return null;

  return (
    <>
      <h1 className="mb-3">{article.title}</h1>
      <p className="text-sm text-stone-400 mb-8">
        Publié le{" "}
        {new Date(article.createdAt).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
        <Image
          src={article.featured_image}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="text-stone-700 leading-relaxed text-base whitespace-pre-line">
        {article.content}
      </div>

      {/* Timestamp figé lors de la génération du cache — ne change qu'au prochain revalidate */}
      <p className="mt-10 text-xs text-stone-400">
        Generated at: {new Date().toISOString()}
      </p>
    </>
  );
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

  // Check existence outside cache so notFound() can throw properly
  const exists = await prisma.news.findUnique({ where: { slug }, select: { id: true } });
  if (!exists) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/news" className="text-sm text-green-700 hover:underline mb-6 inline-block">
        ← Retour aux actualités
      </Link>
      <ArticleContent slug={slug} />
    </article>
  );
}
