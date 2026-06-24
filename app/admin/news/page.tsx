import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import prisma from "@/lib/prisma";
import CreateNewsForm from "./CreateNewsForm";

export const metadata = { title: "Gestion actualités — Admin EatQuick" };

export default async function AdminNewsPage() {
  const articles = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-4xl mx-auto py-10 px-4 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Dashboard
        </Link>
        <span className="text-stone-200">/</span>
        <h1 className="text-xl font-bold text-stone-800">Gestion des actualités</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Formulaire de création */}
        <section className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-stone-800 mb-1">
            Publier une nouvelle actualité
          </h2>
          <p className="text-sm text-stone-400 mb-6">
            Visible sur{" "}
            <Link href="/news" target="_blank" className="text-green-700 hover:underline">
              /news
            </Link>{" "}
            après la revalidation du cache.
          </p>
          <CreateNewsForm />
        </section>

        {/* Liste des actualités existantes */}
        <section>
          <h2 className="text-base font-bold text-stone-800 mb-4">
            Actualités publiées ({articles.length})
          </h2>

          {articles.length === 0 ? (
            <p className="text-sm text-stone-400">Aucune actualité pour le moment.</p>
          ) : (
            <ul className="space-y-3">
              {articles.map((article) => (
                <li
                  key={article.id}
                  className="bg-white rounded-xl border border-stone-100 shadow-sm p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-800 truncate">
                        {article.title}
                      </p>
                      <p className="text-xs font-mono text-stone-400 mt-0.5">
                        /news/{article.slug}
                      </p>
                      <p className="text-xs text-stone-400 mt-1">
                        {new Date(article.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Link
                      href={`/news/${article.slug}`}
                      target="_blank"
                      className="shrink-0 text-green-700 hover:text-green-800 transition-colors"
                      title="Voir l'article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
