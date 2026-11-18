import React from "react";
import Link from "next/link";
import { getAllOrders } from "@/server/dal/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Customer Orders</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review fulfillments, delivery status, and order details ({orders.length} orders total)
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Order Number</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Fulfillment Status</th>
                <th className="px-5 py-3.5">Total</th>
                <th className="px-5 py-3.5 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-900">{order.customerName}</p>
                    <p className="text-slate-400">{order.customerEmail}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={order.paymentStatus === "paid" ? "success" : "warning"}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {formatPrice(order.totalInCents)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="h-7 px-2">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
