import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/server/dal/products";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { Plus, Edit } from "lucide-react";

export default async function AdminProductsPage() {
  const { products, total } = await getProducts({ limit: 100, onlyActive: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Inventory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your store catalog, pricing, and stock levels ({total} items)
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" /> Add New Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">SKU</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/products/${product.slug}`}
                          className="font-bold text-slate-900 hover:text-emerald-600 truncate max-w-xs block"
                        >
                          {product.title}
                        </Link>
                        <span className="text-slate-400 text-[11px]">/{product.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">
                    {product.categoryName || "Uncategorized"}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                    {product.sku}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {formatPrice(product.priceInCents)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`font-semibold ${
                        product.stockQuantity <= 5 ? "text-rose-600" : "text-slate-800"
                      }`}
                    >
                      {product.stockQuantity} units
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={product.isActive ? "success" : "neutral"}>
                      {product.isActive ? "Active" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-slate-400 hover:text-emerald-600 p-1.5 rounded hover:bg-slate-100"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteProductButton productId={product.id} title={product.title} />
                    </div>
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
