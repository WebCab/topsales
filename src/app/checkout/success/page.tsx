import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderByStripeSessionId, getOrderWithItems } from "@/server/dal/orders";
import { formatPrice } from "@/lib/utils";

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
    order_id?: string;
  }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const sp = await searchParams;
  let order = null;

  if (sp.order_id) {
    order = await getOrderWithItems(sp.order_id);
  } else if (sp.session_id) {
    const rawOrder = await getOrderByStripeSessionId(sp.session_id);
    if (rawOrder) {
      order = await getOrderWithItems(rawOrder.id);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
      <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Thank you for your order. A receipt and confirmation has been generated for your purchase.
        </p>
      </div>

      {order ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Order Reference</p>
              <p className="text-base font-bold text-slate-900">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Customer Email</p>
              <p className="text-sm font-medium text-slate-800">{order.customerEmail}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase">Items Ordered</h3>
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">{item.productTitle}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(item.totalInCents)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-base text-slate-900">
            <span>Total Paid</span>
            <span className="text-emerald-600">{formatPrice(order.totalInCents)}</span>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-6 text-sm text-slate-600">
          Your order has been recorded and is currently being processed.
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        <Link href="/products">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
        <Link href="/account">
          <Button variant="primary">
            View Order History <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
