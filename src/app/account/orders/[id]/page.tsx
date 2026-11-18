import React from "react";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getOrderWithItems } from "@/server/dal/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, MapPin } from "lucide-react";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const order = await getOrderWithItems(
    id,
    user.role === "admin" ? undefined : user.userId
  );

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/account"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Order Summary
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">{order.orderNumber}</h1>
          <p className="text-xs text-slate-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={order.status === "delivered" ? "success" : "info"} className="capitalize">
            Status: {order.status}
          </Badge>
          <Badge variant={order.paymentStatus === "paid" ? "success" : "warning"} className="capitalize">
            Payment: {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" /> Items in this Order
          </h2>

          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{item.productTitle}</p>
                  <p className="text-xs text-slate-500">
                    {formatPrice(item.priceInCents)} × {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-slate-900">
                  {formatPrice(item.totalInCents)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotalInCents)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(order.shippingInCents)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(order.taxInCents)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Amount</span>
              <span className="text-emerald-600">{formatPrice(order.totalInCents)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 h-fit">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" /> Delivery Address
          </h2>

          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-900">{order.customerName}</p>
            <p>{order.shippingAddressParsed.line1}</p>
            {order.shippingAddressParsed.line2 && <p>{order.shippingAddressParsed.line2}</p>}
            <p>
              {order.shippingAddressParsed.city}, {order.shippingAddressParsed.state}{" "}
              {order.shippingAddressParsed.postalCode}
            </p>
            <p>{order.shippingAddressParsed.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
