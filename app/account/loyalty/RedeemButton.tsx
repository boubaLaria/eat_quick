"use client";

import { useState, useTransition } from "react";
import { redeemCoupon, CouponTier } from "@/actions/redeemCoupon";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RedeemButton({
  pointsCost,
  disabled,
  disabledReason,
}: {
  pointsCost: CouponTier;
  disabled: boolean;
  disabledReason?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleRedeem() {
    setError(null);
    startTransition(async () => {
      const result = await redeemCoupon(pointsCost);
      if (result.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  if (success) {
    return (
      <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">
        Débloqué !
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleRedeem}
        disabled={disabled || isPending}
        title={disabledReason}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-amber-500 hover:bg-amber-600 text-white disabled:bg-stone-200 disabled:text-stone-400"
      >
        {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
        Débloquer
      </button>
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
