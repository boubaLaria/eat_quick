"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginCustomer, LoginState } from "@/actions/loginCustomer";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginCustomer,
    null
  );

  useEffect(() => {
    if (state?.role) {
      router.push(state.role === "STAFF" ? "/admin" : "/");
    }
  }, [state?.role]);

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Mot de passe
        </label>
        <input
          type="password"
          name="password"
          required
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full text-center disabled:opacity-60"
      >
        {pending ? "Connexion..." : "Se connecter"}
      </button>
      <p className="text-xs text-stone-400 text-center">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="text-green-700 hover:underline">
          S&apos;inscrire
        </Link>
      </p>
    </form>
  );
}
