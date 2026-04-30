import { getAllMenuItems } from "@/lib/menu";
import MenuCard from "@/components/MenuCard";
import Link from "next/link";

export const metadata = {
  title: "Menu — EatQuick",
};

export default function MenusPage() {
  const items = getAllMenuItems();
  const salads = items.filter((i) => i.category === "salads");
  const hotMeals = items.filter((i) => i.category === "hot-meal");

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="mb-2">Our Menu</h1>
      <p className="text-stone-500 mb-8">Fresh picks, every day.</p>

      {/* Category tabs */}
      <div className="flex gap-3 mb-10">
        <Link href="/menus" className="btn-primary text-sm py-2 px-4">All items</Link>
        <Link href="/menus/salads" className="btn-outline text-sm py-2 px-4">Salads</Link>
        <Link href="/menus/hot-meal" className="btn-outline text-sm py-2 px-4">Hot Meals</Link>
      </div>

      {salads.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-green-800">Salads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {salads.map((item) => (
              <MenuCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      )}

      {hotMeals.length > 0 && (
        <section>
          <h2 className="mb-6 text-green-800">Hot Meals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotMeals.map((item) => (
              <MenuCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
