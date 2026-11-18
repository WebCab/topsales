"use client";

import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { CartDrawer } from "./cart-drawer";
import type { CartWithDetails } from "@/server/dal/cart";

interface CartButtonProps {
  initialCart: CartWithDetails | null;
}

export function CartButton({ initialCart }: CartButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const totalQuantity = initialCart?.totalQuantity || 0;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-slate-700 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Open shopping cart"
      >
        <ShoppingBag className="w-5 h-5" />
        {totalQuantity > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-emerald-600 rounded-full animate-in fade-in zoom-in">
            {totalQuantity > 99 ? "99+" : totalQuantity}
          </span>
        )}
      </button>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} cart={initialCart} />
    </>
  );
}
