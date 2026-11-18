"use client";

import React, { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { updateCartQuantityAction, removeFromCartAction } from "@/actions/cart";
import { useRouter } from "next/navigation";

interface CartItemRowProps {
  item: {
    id: string;
    quantity: number;
    itemTotalInCents: number;
    product: {
      id: string;
      title: string;
      slug: string;
      priceInCents: number;
      imageUrl: string;
      stockQuantity: number;
    };
  };
}

export function CartItemRow({ item }: CartItemRowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (qty: number) => {
    startTransition(async () => {
      await updateCartQuantityAction({ cartItemId: item.id, quantity: qty });
      router.refresh();
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      await removeFromCartAction({ cartItemId: item.id });
      router.refresh();
    });
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
          <Image
            src={item.product.imageUrl}
            alt={item.product.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        <div>
          <Link
            href={`/products/${item.product.slug}`}
            className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors"
          >
            {item.product.title}
          </Link>
          <p className="text-xs text-slate-500 mt-1">
            Price: {formatPrice(item.product.priceInCents)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        <div className="flex items-center border border-slate-200 rounded-lg bg-white">
          <button
            disabled={isPending || item.quantity <= 1}
            onClick={() => handleUpdate(item.quantity - 1)}
            className="p-1.5 hover:bg-slate-100 text-slate-600 disabled:opacity-30 rounded-l-lg"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-bold text-slate-800 min-w-[32px] text-center">
            {item.quantity}
          </span>
          <button
            disabled={isPending || item.quantity >= item.product.stockQuantity}
            onClick={() => handleUpdate(item.quantity + 1)}
            className="p-1.5 hover:bg-slate-100 text-slate-600 disabled:opacity-30 rounded-r-lg"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-right min-w-[80px]">
          <p className="text-sm font-extrabold text-slate-900">
            {formatPrice(item.itemTotalInCents)}
          </p>
        </div>

        <button
          onClick={handleRemove}
          disabled={isPending}
          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-50"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
