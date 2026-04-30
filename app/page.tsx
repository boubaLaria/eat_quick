import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-green-900 text-white overflow-hidden min-h-[520px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/img/chicken-caesar-salad.jpeg"
            alt="Fresh salad hero"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold leading-tight mb-4 font-display">
            Fresh. Fast. <span className="text-green-300">Delicious.</span>
          </h1>
          <p className="text-lg text-green-100 max-w-xl mx-auto mb-8">
            Handcrafted salads and hot meals made with seasonal ingredients.
            Eat well, eat quick.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/menus" className="btn-primary">
              See the Menu
            </Link>
            <Link
              href="/make-your-own-salad"
              className="btn-outline border-white text-white hover:bg-white hover:text-green-800"
            >
              Build Your Salad
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="text-4xl mb-3">🥗</div>
          <h3 className="mb-2">Fresh Salads</h3>
          <p className="text-stone-500 text-sm">
            Seasonal vegetables, bold dressings, and crunchy toppings.
          </p>
          <Link href="/menus/salads" className="mt-4 inline-block text-green-700 font-semibold text-sm hover:underline">
            View salads →
          </Link>
        </div>
        <div className="card p-6 text-center">
          <div className="text-4xl mb-3">🍲</div>
          <h3 className="mb-2">Hot Meals</h3>
          <p className="text-stone-500 text-sm">
            Warm, hearty dishes made fresh every day.
          </p>
          <Link href="/menus/hot-meal" className="mt-4 inline-block text-green-700 font-semibold text-sm hover:underline">
            View hot meals →
          </Link>
        </div>
        <div className="card p-6 text-center">
          <div className="text-4xl mb-3">🎨</div>
          <h3 className="mb-2">Make Your Own</h3>
          <p className="text-stone-500 text-sm">
            Pick your ingredients and compose your perfect plate.
          </p>
          <Link href="/make-your-own-salad" className="mt-4 inline-block text-green-700 font-semibold text-sm hover:underline">
            Start building →
          </Link>
        </div>
      </section>

      {/* Opening hours teaser */}
      <section className="bg-green-50 py-10 text-center">
        <p className="text-stone-600 text-sm mb-2">We&apos;re open Tuesday to Saturday</p>
        <h2 className="text-green-800">Come visit us</h2>
        <Link href="/opening-time" className="mt-4 inline-block text-green-700 font-semibold hover:underline text-sm">
          See full opening hours →
        </Link>
      </section>
    </div>
  );
}
