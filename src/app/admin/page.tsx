import React from "react";
import Link from "next/link";
import { getAllOrders } from "@/server/dal/orders";
import { getProducts } from "@/server/dal/products";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, ShoppingCart, Package, AlertTriangle, ArrowRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const [orders, productsData] = await Promise.all([
    getAllOrders(),
    getProducts({ limit: 100, onlyActive: false }),
  ]);

  const totalRevenueInCents = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((acc, o) => acc + o.totalInCents, 0);

  const lowStockProducts = productsData.products.filter((p) => p.stockQuantity <= 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Revenue</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {formatPrice(totalRevenueInCents)}
          </p>
          <span className="text-xs text-emerald-600 font-medium">From verified paid orders</span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Orders</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{orders.length}</p>
          <span className="text-xs text-slate-400 font-medium">Customer checkouts</span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Catalog Items</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{productsData.total}</p>
          <span className="text-xs text-slate-400 font-medium">Active & archived</span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Stock Alerts</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{lowStockProducts.length}</p>
          <span className="text-xs text-amber-600 font-medium">Items with ≤ 5 in stock</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Customer Orders</h2>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              View All Orders <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Order #</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{order.orderNumber}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-900">{order.customerName}</p>
                    <p className="text-slate-400">{order.customerEmail}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-3.5 capitalize">
                    <Badge variant={order.status === "delivered" ? "success" : "info"}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {formatPrice(order.totalInCents)}
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
