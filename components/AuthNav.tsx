"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function AuthNav() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      {session?.user?.role === "staff" && (
        <li>
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded hover:bg-green-700 transition-colors"
          >
            DASHBOARD
          </Link>
        </li>
      )}
      <li>
        {session?.user ? (
          <div className="flex items-center gap-2">
            <Link
              href="/account"
              className="px-3 py-1.5 rounded hover:bg-green-700 transition-colors text-sm"
            >
              {session.user.name}
            </Link>
            <button
              onClick={() => signOut().then(() => router.push("/sign-in"))}
              className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="px-3 py-1.5 rounded hover:bg-green-700 transition-colors"
          >
            LOG IN
          </Link>
        )}
      </li>
    </>
  );
}
