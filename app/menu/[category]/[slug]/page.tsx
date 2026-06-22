import { getMenuItemBySlug, getAllMenuItems } from "@/lib/menu";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import OrderButton from "./OrderButton";

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateStaticParams() {
  const items = getAllMenuItems();
  return items.map((item) => ({ category: item.category, slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = await getMenuItemBySlug(slug);
  if (!item) return {};
  return { title: `${item.title} — EatQuick` };
}

export default async function MenuItemPage({ params }: Props) {
  const { slug, category } = await params;
  const item = await getMenuItemBySlug(slug);

  if (!item) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const initialUser = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        phoneNumber: session.user.phoneNumber ?? null,
      }
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href={`/menus/${category}`}
        className="text-green-700 hover:underline text-sm mb-6 inline-block"
      >
        ← Back to {category === "hot-meal" ? "Hot Meals" : "Salads"}
      </Link>

      <div className="card overflow-hidden">
        <div className="relative h-72 sm:h-96">
          <Image
            src={`/img/${item.imageSrc}`}
            alt={item.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="p-6 sm:p-8">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3 capitalize">
            {item.category === "hot-meal" ? "Hot Meal" : "Salad"}
          </span>
          <h1 className="mb-2">{item.title}</h1>
          <div className="flex items-center gap-4 mb-6">
            <p className="text-stone-400 text-sm">{item.calories} kcal</p>
            <p className="text-2xl font-bold text-green-700">€{item.price.toFixed(2)}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-base mb-3">Ingredients</h3>
            <ul className="flex flex-wrap gap-2">
              {item.ingredients.map((ing) => (
                <li
                  key={ing}
                  className="bg-stone-100 text-stone-600 text-xs px-3 py-1 rounded-full"
                >
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="prose prose-stone max-w-none text-stone-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item.contentHtml }}
          />

          <div className="mt-8 flex gap-4 flex-wrap">
            <OrderButton
              item={{ name: item.title, price: item.price }}
              initialCustomer={initialUser}
            />
            <Link href="/make-your-own-salad" className="btn-outline">
              Make Your Own
            </Link>
            <Link href="/menus" className="btn-outline">
              Full Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
