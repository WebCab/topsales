"use client";

import React, { useTransition } from "react";
import { updateOrderStatusAction } from "@/actions/admin";
import { useRouter } from "next/navigation";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newStatus: string) => {
    startTransition(async () => {
      await updateOrderStatusAction(orderId, newStatus);
      router.refresh();
    });
  };

  return (
    <select
      value={currentStatus}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value)}
      className="text-xs font-semibold rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
    >
      <option value="pending">Pending</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
