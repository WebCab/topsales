"use client";

import React, { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProductAction } from "@/actions/admin";
import { useRouter } from "next/navigation";

export function DeleteProductButton({ productId, title }: { productId: string; title: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      startTransition(async () => {
        await deleteProductAction(productId);
        router.refresh();
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-slate-100 disabled:opacity-50"
      title="Delete Product"
      aria-label="Delete product"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
