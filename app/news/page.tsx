import prisma from "@/lib/prisma";
import type { News } from "@/app/generated/prisma";
import Link from "next/link";
import Image from "next/image";
import { cacheLife } from "next/cache";

export const metadata = {
  title: "Actualités — EatQuick",
};

async function NewsList() {
  "use cache";
  cacheLife("days");

  const articles = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: News) => (
          <Link key={article.id} href={`/news/${article.slug}`} className="card block group">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={article.featured_image}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <p className="text-xs text-stone-400 mb-2">
                {new Date(article.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <h2 className="text-lg font-bold text-stone-800 mb-3 group-hover:text-green-700 transition-colors line-clamp-2">
                {article.title}
              </h2>
              <p className="text-sm text-stone-500 line-clamp-3">{article.content}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-green-700 group-hover:underline">
                Lire la suite →
              </span>
            </div>
          </Link>
        ))}
      </div>
      <p className="mt-12 text-xs text-stone-400 text-center">
        Generated at: {new Date().toISOString()}
      </p>
    </>
  );
}

export default function NewsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="mb-2">Actualités</h1>
      <p className="text-stone-500 mb-10">
        Restez informés des dernières nouvelles d&apos;EatQuick.
      </p>
      <NewsList />
    </div>
  );
}
