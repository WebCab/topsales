import React from "react";
import { getAllCategories } from "@/server/dal/products";
import { ProductForm } from "@/components/admin/product-form";

export default async function AdminNewProductPage() {
  const categories = await getAllCategories();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
        <p className="text-xs text-slate-500 mt-1">
          Publish a new item to your online product catalog
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
