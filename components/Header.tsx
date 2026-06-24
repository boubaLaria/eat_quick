"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import AuthNav from "@/components/AuthNav";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/menus", label: "Menu" },
  { href: "/make-your-own-salad", label: "Composer" },
  { href: "/our-recipes", label: "Recettes" },
  { href: "/news", label: "Actualités" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-green-900 text-white transition-shadow duration-200 ${
        scrolled ? "shadow-xl shadow-green-950/40" : "shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image
              src="/logo-eat.png"
              alt="EatQuick"
              width={40}
              height={40}
              className="rounded-full ring-2 ring-white/20 group-hover:ring-white/50 transition-all duration-200"
              priority
            />
            <span className="text-xl font-bold tracking-wide hidden sm:block select-none">
              EatQuick
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-semibold rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right: search + auth */}
          <div className="hidden md:flex items-center gap-3">
            <form action="/search" method="get">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                <input
                  type="search"
                  name="q"
                  placeholder="Rechercher…"
                  className="pl-8 pr-3 py-1.5 rounded-full text-sm text-stone-800 bg-white/95 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-green-400 w-44 transition-all"
                />
              </div>
            </form>
            <ul className="flex items-center gap-1 text-sm font-semibold">
              <AuthNav />
            </ul>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-green-900">
          <nav className="px-4 pt-3 pb-2 space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-semibold rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="px-4 pb-4 pt-2 border-t border-white/10 space-y-3">
            <form action="/search" method="get" className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                <input
                  type="search"
                  name="q"
                  placeholder="Rechercher un plat…"
                  className="pl-8 pr-3 py-2 rounded-full text-sm text-stone-800 bg-white/95 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
                />
              </div>
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-600 transition-colors rounded-full px-4 py-2 text-sm font-semibold shrink-0"
              >
                Chercher
              </button>
            </form>
            <ul className="flex flex-col gap-1 text-sm font-semibold">
              <AuthNav mobile />
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
