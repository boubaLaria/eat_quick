"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle,
  LogOut,
  LogIn,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Loader2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getMyOrders, type RecentOrder } from "@/actions/getMyOrders";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({ name, image }: { name: string; image?: string | null }) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={32}
        height={32}
        className="w-8 h-8 rounded-full ring-2 ring-white/30 object-cover"
      />
    );
  }
  return (
    <span className="w-8 h-8 rounded-full bg-emerald-600 ring-2 ring-white/30 flex items-center justify-center text-xs font-bold text-white select-none shrink-0">
      {getInitials(name)}
    </span>
  );
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En préparation",
  READY: "Prête",
  COMPLETED: "Récupérée",
  CANCELLED: "Annulée",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-orange-100 text-orange-600",
  READY: "bg-green-100 text-green-700",
  COMPLETED: "bg-stone-100 text-stone-500",
  CANCELLED: "bg-red-100 text-red-600",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-1.5 py-0.5 rounded-full text-[10px] font-semibold leading-none ${STATUS_COLORS[status] ?? STATUS_COLORS.PENDING}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export default function AuthNav({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<RecentOrder[] | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch orders lazily when dropdown first opens
  useEffect(() => {
    if (open && orders === null && session?.user) {
      setOrdersLoading(true);
      getMyOrders(3).then((data) => {
        setOrders(data);
        setOrdersLoading(false);
      });
    }
  }, [open, orders, session?.user]);

  if (!session?.user) {
    return (
      <li>
        <Link
          href="/sign-in"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-green-900 font-semibold hover:bg-white/90 transition-all"
        >
          <LogIn className="w-4 h-4 shrink-0" />
          Connexion
        </Link>
      </li>
    );
  }

  /* ── Mobile : liste plate ─────────────────────────────── */
  if (mobile) {
    return (
      <>
        {session.user.role === "staff" && (
          <li>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              Dashboard
            </Link>
          </li>
        )}
        <li>
          <div className="flex items-center gap-3 px-4 py-2.5">
            <Avatar name={session.user.name} image={session.user.image} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{session.user.name}</p>
              <p className="text-xs text-white/50 truncate">{session.user.email}</p>
            </div>
          </div>
        </li>
        <li>
          <Link
            href="/account"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold"
          >
            <UserCircle className="w-4 h-4 shrink-0" />
            Mon profil
          </Link>
        </li>
        <li>
          <Link
            href="/account/orders"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold"
          >
            <ClipboardList className="w-4 h-4 shrink-0" />
            Mes commandes
          </Link>
        </li>
        <li>
          <button
            onClick={() => signOut().then(() => router.push("/sign-in"))}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-300 hover:text-red-200 hover:bg-white/10 transition-all text-sm font-semibold"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Déconnexion
          </button>
        </li>
      </>
    );
  }

  /* ── Desktop : avatar + dropdown ─────────────────────── */
  return (
    <>
      {session.user.role === "staff" && (
        <li>
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            Dashboard
          </Link>
        </li>
      )}
      <li className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-all"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <Avatar name={session.user.name} image={session.user.image} />
          <ChevronDown
            className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl shadow-black/10 border border-stone-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            {/* En-tête utilisateur */}
            <div className="flex items-center gap-3 px-4 py-3 bg-stone-50 border-b border-stone-100">
              <Avatar name={session.user.name} image={session.user.image} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">{session.user.name}</p>
                <p className="text-xs text-stone-400 truncate">{session.user.email}</p>
              </div>
            </div>

            {/* Items nav */}
            <div className="py-1">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
              >
                <UserCircle className="w-4 h-4 text-stone-400" />
                Mon profil
              </Link>
            </div>

            {/* Commandes récentes */}
            <div className="border-t border-stone-100">
              <div className="flex items-center justify-between px-4 pt-2.5 pb-1">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
                  Commandes récentes
                </p>
                <Link
                  href="/account/orders"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-0.5 text-xs text-green-700 hover:text-green-800 font-semibold"
                >
                  Voir tout
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {ordersLoading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-stone-300" />
                </div>
              )}

              {!ordersLoading && orders && orders.length === 0 && (
                <p className="px-4 py-3 text-xs text-stone-400 italic">
                  Aucune commande pour l'instant
                </p>
              )}

              {!ordersLoading && orders && orders.length > 0 && (
                <ul className="pb-1">
                  {orders.map((order) => (
                    <li key={order.orderNumber}>
                      <Link
                        href={`/order-tracking/${order.orderNumber}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between px-4 py-2 hover:bg-stone-50 transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-stone-700 group-hover:text-stone-900 truncate">
                            #{order.orderNumber}
                          </p>
                          <p className="text-[11px] text-stone-400">
                            {formatOrderDate(order.orderTime)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0 ml-3">
                          <StatusPill status={order.status} />
                          <p className="text-[11px] text-stone-500 font-medium">
                            €{order.total.toFixed(2)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Déconnexion */}
            <div className="border-t border-stone-100 py-1">
              <button
                onClick={() =>
                  signOut().then(() => {
                    setOpen(false);
                    router.push("/sign-in");
                  })
                }
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </li>
    </>
  );
}
