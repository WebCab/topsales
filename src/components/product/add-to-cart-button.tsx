"use client";

import React, { useState, useTransition } from "react";
import { Plus, Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/actions/cart";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  compact?: boolean;
  maxQuantity?: number;
}

export function AddToCartButton({
  productId,
  disabled = false,
  size = "md",
  compact = false,
  maxQuantity = 99,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdd = () => {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await addToCartAction({ productId, quantity });
      if (res.success) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
        router.refresh();
      } else {
        setErrorMsg(res.message || "Failed to add to cart");
      }
    });
  };

  if (compact) {
    return (
      <Button
        variant={justAdded ? "secondary" : "primary"}
        size="sm"
        disabled={disabled || isPending}
        isLoading={isPending}
        onClick={handleAdd}
        title={disabled ? "Out of Stock" : "Add to Cart"}
        className="h-8 px-2.5 rounded-lg"
      >
        {justAdded ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Plus className="w-3.5 h-3.5" />
        )}
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-slate-300 rounded-lg bg-white">
          <button
            type="button"
            disabled={quantity <= 1 || disabled || isPending}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 rounded-l-lg"
          >
            -
          </button>
          <span className="px-3 text-sm font-semibold text-slate-800 min-w-[36px] text-center">
            {quantity}
          </span>
          <button
            type="button"
            disabled={quantity >= maxQuantity || disabled || isPending}
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 rounded-r-lg"
          >
            +
          </button>
        </div>

        <Button
          variant={justAdded ? "secondary" : "primary"}
          size={size}
          disabled={disabled || isPending}
          isLoading={isPending}
          onClick={handleAdd}
          className="flex-1 py-3"
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 mr-2" /> Added to Cart!
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 mr-2" /> {disabled ? "Out of Stock" : "Add to Cart"}
            </>
          )}
        </Button>
      </div>

      {errorMsg && (
        <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
      )}
    </div>
  );
}
