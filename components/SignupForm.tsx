"use client";

import { useActionState } from "react";
import { signupCustomer, SignupState } from "@/actions/signupCustomer";
import Link from "next/link";

export default function SignupForm() {
  const [state, action, pending] = useActionState<SignupState, FormData>(
    signupCustomer,
    null
  );

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Nom
        </label>
        <input
          type="text"
          name="name"
          required
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Jean Dupont"
        />
      </div>
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
          minLength={8}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full text-center disabled:opacity-60"
      >
        {pending ? "Création..." : "Créer un compte"}
      </button>
      <p className="text-xs text-stone-400 text-center">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-green-700 hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
