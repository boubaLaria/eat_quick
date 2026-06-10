"use client";

import { useEffect } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  onClose: () => void;
};

export default function ImageModal({ src, alt, onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute -top-10 right-0 text-white/80 hover:text-white text-3xl leading-none transition-colors"
        >
          ✕
        </button>

        {/* Full-size image */}
        <div className="relative h-[55vh] sm:h-[70vh] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 95vw, 900px"
            priority
          />
        </div>

        <p className="text-center text-white/70 text-sm mt-3">{alt}</p>
      </div>
    </div>
  );
}
