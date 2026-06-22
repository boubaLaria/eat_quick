"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Phone, User, Mail, ShieldCheck, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { updatePhone } from "@/actions/updatePhone";

export default function AccountPage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();

  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
    if (session?.user) {
      setPhone(session.user.phoneNumber ?? "");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
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

  async function handleSavePhone(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const result = await updatePhone(phone);

    setSaving(false);

    if (!result.success) {
      setError(result.error ?? "Une erreur est survenue");
      return;
    }

    setSaved(true);
    refetch();
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="card p-8 w-full max-w-sm space-y-6">
        <h1 className="text-xl font-bold text-center">Mon compte</h1>

        {/* Infos en lecture seule */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
            <User className="w-4 h-4 text-stone-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-stone-400 font-medium">Nom</p>
              <p className="text-sm font-semibold text-stone-800 truncate">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
            <Mail className="w-4 h-4 text-stone-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-stone-400 font-medium">Email</p>
              <p className="text-sm font-semibold text-stone-800 truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
            <ShieldCheck className="w-4 h-4 text-stone-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-stone-400 font-medium">Rôle</p>
              <p className="text-sm font-semibold text-stone-800">
                {user.role === "staff" ? "Staff" : "Client"}
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire téléphone */}
        <form onSubmit={handleSavePhone} className="space-y-2">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide">
            Numéro de téléphone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(null); }}
              placeholder="+33 6 00 00 00 00"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-800 bg-white placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Enregistré
              </>
            ) : (
              "Enregistrer"
            )}
          </button>
        </form>

        <div className="h-px bg-stone-100" />

        <button
          onClick={() => signOut().then(() => router.push("/sign-in"))}
          className="w-full text-sm font-semibold text-red-500 hover:text-red-600 py-2 rounded-xl hover:bg-red-50 transition-all"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
