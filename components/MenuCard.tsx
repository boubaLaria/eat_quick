"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { MenuItem } from "@/lib/menu";

/*
  ImageModal is loaded lazily with next/dynamic.
  The JS chunk for this component is NOT included in the initial page bundle.
  It is fetched from the server only when the user clicks the magnifier icon
  for the first time. The `loading` prop provides the fallback shown while
  the chunk is being downloaded.
*/
const ImageModal = dynamic(() => import("./ImageModal"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <p className="text-white text-sm animate-pulse">Chargement…</p>
    </div>
  ),
});

export default function MenuCard({ item }: { item: MenuItem }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/*
        The card is a plain div so we can keep the Link and the button as
        siblings — nesting <button> inside <a> is invalid HTML.
        The button is positioned absolutely over the bottom-right of the image.
      */}
      <div className="card group relative">
        <Link href={`/menu/${item.category}/${item.slug}`} className="block">
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
            <h3 className="text-base mb-1 group-hover:text-green-700 transition-colors">
              {item.title}
            </h3>
            <p className="text-xs text-stone-400 mb-2">{item.calories} kcal</p>
            <p className="text-xs text-stone-500 line-clamp-2">
              {item.ingredients.join(", ")}
            </p>
          </div>
        </Link>

        {/* Magnifier trigger — positioned at bottom-right of the image (h-48 = 12rem) */}
        <button
          aria-label={`Agrandir l'image : ${item.title}`}
          onClick={() => setModalOpen(true)}
          className="absolute top-[9.5rem] right-2 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-stone-600 hover:text-green-700 transition-all hover:scale-110"
        >
          {/* Magnifier SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" />
          </svg>
        </button>
      </div>

      {/* Render the modal only when open — this is what triggers the dynamic import */}
      {modalOpen && (
        <ImageModal
          src={`/img/${item.imageSrc}`}
          alt={item.title}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
