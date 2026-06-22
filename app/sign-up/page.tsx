"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";

type State = { error?: string } | null;

export default function SignUpPage() {
  const router = useRouter();

  async function handleSignUp(_prevState: State, formData: FormData): Promise<State> {
    const password = formData.get("password") as string;

    if (password.length < 8) {
      return { error: "Le mot de passe doit contenir au moins 8 caractères" };
    }

    const res = await signUp.email({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password,
    });

    if (res.error) {
      return { error: res.error.message || "Une erreur est survenue, réessayez" };
    }

    router.push("/account");
    return null;
  }

  const [state, action, pending] = useActionState<State, FormData>(handleSignUp, null);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="card p-8 w-full max-w-sm space-y-5">
        <h1 className="text-xl text-center">Créer un compte</h1>
        <p className="text-stone-500 text-sm text-center">
          Rejoignez EatQuick pour commander facilement
        </p>
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
            <Link href="/sign-in" className="text-green-700 hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
