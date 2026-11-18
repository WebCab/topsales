"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { updateCartQuantityAction, removeFromCartAction } from "@/actions/cart";
import { createCheckoutSessionAction } from "@/actions/checkout";
import { useRouter } from "next/navigation";
import type { CartWithDetails } from "@/server/dal/cart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartWithDetails | null;
}

export function CartDrawer({ isOpen, onClose, cart }: CartDrawerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await updateCartQuantityAction({ cartItemId, quantity: newQuantity });
      if (!res.success && res.message) {
        setErrorMsg(res.message);
      }
      router.refresh();
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    setErrorMsg(null);
    startTransition(async () => {
      await removeFromCartAction({ cartItemId });
      router.refresh();
    });
  };

  const handleCheckout = async () => {
    setErrorMsg(null);
    setIsCheckingOut(true);
    try {
      const res = await createCheckoutSessionAction(window.location.origin);
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        setErrorMsg(res.message || "Failed to start checkout");
        setIsCheckingOut(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Checkout failed");
      setIsCheckingOut(false);
    }
  };

  const items = cart?.items || [];
  const subtotal = cart?.subtotalInCents || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Your Cart ({cart?.totalQuantity || 0})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-500 p-1.5 rounded-lg hover:bg-slate-100"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <ShoppingBag className="w-12 h-12 text-slate-300 mb-3 stroke-[1.5]" />
                <p className="font-medium text-slate-800">Your cart is empty</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                  Looks like you haven&apos;t added any items to your cart yet.
                </p>
                <Button variant="outline" size="sm" className="mt-4" onClick={onClose}>
                  Explore Products
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="relative w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={onClose}
                      className="text-sm font-medium text-slate-800 hover:text-emerald-600 truncate block"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatPrice(item.product.priceInCents)} each
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-slate-200 rounded-md">
                        <button
                          disabled={isPending || item.quantity <= 1}
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-slate-800 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          disabled={isPending || item.quantity >= item.product.stockQuantity}
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-900">
                          {formatPrice(item.itemTotalInCents)}
                        </span>
                        <button
                          disabled={isPending}
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>Shipping & Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  isLoading={isCheckingOut}
                  disabled={isPending}
                  className="w-full py-3"
                  size="lg"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link href="/cart" onClick={onClose} className="block text-center text-xs text-slate-600 hover:underline">
                  View Full Cart Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
