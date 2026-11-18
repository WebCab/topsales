import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getOrdersByUser } from "@/server/dal/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Package, ChevronRight } from "lucide-react";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const orders = await getOrdersByUser(user.userId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge variant="success">Delivered</Badge>;
      case "shipped":
        return <Badge variant="info">Shipped</Badge>;
      case "processing":
        return <Badge variant="warning">Processing</Badge>;
      case "cancelled":
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">Pending</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="neutral" className="uppercase text-[11px] font-bold">
            Account Type: {user.role}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Your Order History</h2>
          <span className="text-xs text-slate-500">{orders.length} total orders</span>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon={<Package className="w-10 h-10" />}
            title="No orders yet"
            description="You haven't placed any orders yet. Browse our products and place your first order today!"
            actionHref="/products"
            actionLabel="Start Shopping"
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-slate-900">
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                    <Badge variant={order.paymentStatus === "paid" ? "success" : "warning"}>
                      Payment: {order.paymentStatus}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <span className="text-base font-extrabold text-slate-900">
                    {formatPrice(order.totalInCents)}
                  </span>
                  <Link href={`/account/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
