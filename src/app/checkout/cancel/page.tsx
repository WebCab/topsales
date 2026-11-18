import React from "react";
import Link from "next/link";
import { XCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
        <XCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Checkout Cancelled</h1>
        <p className="text-sm text-slate-500">
          Your payment session was cancelled. No charges were made, and your cart items remain saved.
        </p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Link href="/cart">
          <Button variant="primary">
            <ShoppingBag className="w-4 h-4 mr-2" /> Return to Cart
          </Button>
        </Link>
      </div>
    </div>
  );
}
