import React from "react";
import { notFound } from "next/navigation";
import { getProductById, getAllCategories } from "@/server/dal/products";
import { ProductForm } from "@/components/admin/product-form";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getAllCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
        <p className="text-xs text-slate-500 mt-1">
          Update pricing, description, stock quantities, and media
        </p>
      </div>

      <ProductForm categories={categories} initialProduct={product} />
    </div>
  );
}
