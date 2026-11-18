import React from "react";
import Link from "next/link";
import { getCartAction } from "@/actions/cart";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { CartItemRow } from "./cart-item-row";
import { CheckoutButton } from "./checkout-button";
import { ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";

export default async function CartPage() {
  const cart = await getCartAction();
  const items = cart?.items || [];
  const subtotalInCents = cart?.subtotalInCents || 0;
  const shippingInCents = subtotalInCents > 5000 || subtotalInCents === 0 ? 0 : 500;
  const estimatedTaxInCents = Math.round(subtotalInCents * 0.08);
  const totalInCents = subtotalInCents + shippingInCents + estimatedTaxInCents;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={<ShoppingBag className="w-12 h-12" />}
          title="Your Shopping Cart is Empty"
          description="You haven't added any items to your cart yet. Explore our latest arrivals and exclusive deals."
          actionHref="/products"
          actionLabel="Start Shopping"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your {cart?.totalQuantity || 0} selected items
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatPrice(subtotalInCents)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Shipping</span>
              <span>{shippingInCents === 0 ? <span className="text-emerald-600 font-medium">Free</span> : formatPrice(shippingInCents)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Tax (8%)</span>
              <span>{formatPrice(estimatedTaxInCents)}</span>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between text-base font-bold text-slate-900">
              <span>Total</span>
              <span className="text-emerald-600">{formatPrice(totalInCents)}</span>
            </div>
          </div>

          <CheckoutButton />

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed safe & secure checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
