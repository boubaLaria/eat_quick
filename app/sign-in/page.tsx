"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";

type State = { error?: string } | null;

export default function SignInPage() {
  const router = useRouter();

  async function handleSignIn(_prevState: State, formData: FormData): Promise<State> {
    const res = await signIn.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (res.error) {
      return { error: res.error.message || "Email ou mot de passe incorrect" };
    }

    router.push("/account");
    return null;
  }

  const [state, action, pending] = useActionState<State, FormData>(handleSignIn, null);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="card p-8 w-full max-w-sm space-y-5">
        <h1 className="text-xl text-center">Bon retour</h1>
        <p className="text-stone-500 text-sm text-center">
          Connectez-vous pour gérer vos commandes
        </p>
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
            <Link href="/sign-up" className="text-green-700 hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
