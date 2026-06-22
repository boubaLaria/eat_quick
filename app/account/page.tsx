"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export default function AccountPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-stone-500">Chargement...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-stone-500">Redirection...</p>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="card p-8 w-full max-w-sm space-y-5">
        <h1 className="text-xl font-bold text-center">Mon compte</h1>
        <div className="space-y-3 text-sm text-stone-700">
          <p>
            <span className="font-medium">Nom :</span> {user.name}
          </p>
          <p>
            <span className="font-medium">Email :</span> {user.email}
          </p>
          <p>
            <span className="font-medium">Rôle :</span>{" "}
            {user.role === "staff" ? "Staff" : "Client"}
          </p>
        </div>
        <button
          onClick={() => signOut().then(() => router.push("/sign-in"))}
          className="btn-primary w-full text-center"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
