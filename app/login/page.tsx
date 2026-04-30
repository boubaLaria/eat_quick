export const metadata = {
  title: "Log In — EatQuick",
};

export default function LoginPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="card p-8 w-full max-w-sm space-y-5">
        <h1 className="text-xl text-center">Welcome back</h1>
        <p className="text-stone-500 text-sm text-center">Log in to manage your orders</p>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="••••••••"
          />
        </div>
        <button type="button" className="btn-primary w-full text-center">
          Log In
        </button>
        <p className="text-xs text-stone-400 text-center">
          Don&apos;t have an account? <span className="text-green-700 cursor-pointer hover:underline">Sign up</span>
        </p>
      </div>
    </div>
  );
}
