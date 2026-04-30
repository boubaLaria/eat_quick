import { getMenuItemsByCategory, getAllCategories } from "@/lib/menu";
import MenuCard from "@/components/MenuCard";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const label = category === "hot-meal" ? "Hot Meals" : "Salads";
  return { title: `${label} — EatQuick` };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const items = getMenuItemsByCategory(category);

  if (items.length === 0) notFound();

  const label = category === "hot-meal" ? "Hot Meals" : "Salads";

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="mb-2">{label}</h1>
      <p className="text-stone-500 mb-8">{items.length} items available</p>

      <div className="flex gap-3 mb-10">
        <Link href="/menus" className="btn-outline text-sm py-2 px-4">All items</Link>
        <Link
          href="/menus/salads"
          className={`text-sm py-2 px-4 rounded-full font-semibold border-2 transition-colors ${
            category === "salads"
              ? "bg-green-700 text-white border-green-700"
              : "border-green-700 text-green-700 hover:bg-green-700 hover:text-white"
          }`}
        >
          Salads
        </Link>
        <Link
          href="/menus/hot-meal"
          className={`text-sm py-2 px-4 rounded-full font-semibold border-2 transition-colors ${
            category === "hot-meal"
              ? "bg-green-700 text-white border-green-700"
              : "border-green-700 text-green-700 hover:bg-green-700 hover:text-white"
          }`}
        >
          Hot Meals
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MenuCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
