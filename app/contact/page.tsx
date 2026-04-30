export const metadata = {
  title: "Contact — EatQuick",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 gap-12">
      <div>
        <h1 className="mb-4">Get in Touch</h1>
        <div className="space-y-4 text-stone-600">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-400 mb-1">Address</h3>
            <p>123 Green Street</p>
            <p>75001 Paris, France</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-400 mb-1">Phone</h3>
            <p>+33 1 23 45 67 89</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-400 mb-1">Email</h3>
            <p>contact@eatquick.fr</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-400 mb-1">Hours</h3>
            <p>Tue–Fri: 10am – 3pm</p>
            <p>Wed &amp; Sat: also 7pm – 10pm</p>
          </div>
        </div>
      </div>

      <form className="card p-6 space-y-4">
        <h2 className="text-lg">Send us a message</h2>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
          <input
            type="text"
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
          <textarea
            rows={4}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Your message…"
          />
        </div>
        <button type="button" className="btn-primary w-full text-center">
          Send Message
        </button>
      </form>
    </div>
  );
}
