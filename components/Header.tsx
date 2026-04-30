import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/menus", label: "MENU" },
  { href: "/make-your-own-salad", label: "MAKE YOUR OWN" },
  { href: "/our-recipes", label: "OUR RECIPES" },
  { href: "/contact", label: "CONTACT" },
  { href: "/login", label: "LOG IN" },
];

export default function Header() {
  return (
    <header className="bg-green-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-eat.png"
            alt="EatQuick logo"
            width={48}
            height={48}
            className="rounded-full"
            priority
          />
          <span className="text-2xl font-bold tracking-wide font-display">
            EatQuick
          </span>
        </Link>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <form action="/search" method="get" className="flex gap-1">
            <input
              type="search"
              name="q"
              placeholder="Rechercher un plat…"
              className="px-3 py-1.5 rounded-full text-sm text-stone-800 bg-white/90 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-green-400 w-40 sm:w-48"
            />
            <button
              type="submit"
              aria-label="Lancer la recherche"
              className="bg-white/20 hover:bg-white/30 transition-colors rounded-full px-3 py-1.5 text-sm font-medium"
            >
              🔍
            </button>
          </form>
          <nav>
            <ul className="flex flex-wrap gap-1 items-center text-sm font-medium">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="px-3 py-1.5 rounded hover:bg-green-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
