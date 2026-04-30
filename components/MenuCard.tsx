import Image from "next/image";
import Link from "next/link";
import { MenuItem } from "@/lib/menu";

export default function MenuCard({ item }: { item: MenuItem }) {
  return (
    <Link href={`/menu/${item.category}/${item.slug}`} className="card block group">
      <div className="relative h-48 bg-stone-100">
        <Image
          src={`/img/${item.imageSrc}`}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute top-2 right-2 bg-green-700 text-white text-xs font-semibold px-2 py-1 rounded-full capitalize">
          {item.category === "hot-meal" ? "Hot Meal" : "Salad"}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-base mb-1 group-hover:text-green-700 transition-colors">{item.title}</h3>
        <p className="text-xs text-stone-400 mb-2">{item.calories} kcal</p>
        <p className="text-xs text-stone-500 line-clamp-2">
          {item.ingredients.join(", ")}
        </p>
      </div>
    </Link>
  );
}
