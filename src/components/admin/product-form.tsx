"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createProductAction, updateProductAction } from "@/actions/admin";
import type { Category, Product } from "@/db";

interface ProductFormProps {
  categories: Category[];
  initialProduct?: Product | null;
}

export function ProductForm({ categories, initialProduct }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialProduct?.title || "",
    slug: initialProduct?.slug || "",
    description: initialProduct?.description || "",
    priceInDollars: initialProduct ? (initialProduct.priceInCents / 100).toFixed(2) : "",
    compareAtPriceInDollars: initialProduct?.compareAtPriceInCents
      ? (initialProduct.compareAtPriceInCents / 100).toFixed(2)
      : "",
    categoryId: initialProduct?.categoryId || (categories[0]?.id || ""),
    imageUrl: initialProduct?.imageUrl || "",
    stockQuantity: initialProduct ? String(initialProduct.stockQuantity) : "10",
    sku: initialProduct?.sku || "",
    isActive: initialProduct ? initialProduct.isActive : true,
  });

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !initialProduct
        ? val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        : prev.slug,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    const priceInCents = Math.round(parseFloat(formData.priceInDollars || "0") * 100);
    const compareAtPriceInCents = formData.compareAtPriceInDollars
      ? Math.round(parseFloat(formData.compareAtPriceInDollars) * 100)
      : undefined;

    const payload = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      priceInCents,
      compareAtPriceInCents,
      categoryId: formData.categoryId,
      imageUrl: formData.imageUrl,
      stockQuantity: parseInt(formData.stockQuantity, 10),
      sku: formData.sku,
      isActive: formData.isActive,
    };

    startTransition(async () => {
      let result;
      if (initialProduct) {
        result = await updateProductAction({ id: initialProduct.id, ...payload });
      } else {
        result = await createProductAction(payload);
      }

      if (result.success) {
        router.push("/admin/products");
        router.refresh();
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setGeneralError(result.message || "Failed to save product");
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
      {generalError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {generalError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Title"
          placeholder="e.g. Mechanical Gaming Keyboard"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          error={errors.title?.[0]}
          required
        />

        <Input
          label="URL Slug"
          placeholder="e.g. mechanical-gaming-keyboard"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          error={errors.slug?.[0]}
          helperText="Lowercase alphanumeric letters and hyphens"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Comprehensive details, features, and specs..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          required
        />
        {errors.description?.[0] && (
          <p className="text-xs text-rose-600 font-medium">{errors.description[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Price (USD $)"
          type="number"
          step="0.01"
          placeholder="49.99"
          value={formData.priceInDollars}
          onChange={(e) => setFormData({ ...formData, priceInDollars: e.target.value })}
          error={errors.priceInCents?.[0]}
          required
        />

        <Input
          label="Compare-At Price (USD $)"
          type="number"
          step="0.01"
          placeholder="69.99 (Optional strike-through)"
          value={formData.compareAtPriceInDollars}
          onChange={(e) => setFormData({ ...formData, compareAtPriceInDollars: e.target.value })}
          error={errors.compareAtPriceInCents?.[0]}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Category</label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId?.[0] && (
            <p className="text-xs text-rose-600 font-medium">{errors.categoryId[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Image URL"
          placeholder="https://images.unsplash.com/..."
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          error={errors.imageUrl?.[0]}
          required
        />

        <Input
          label="Inventory Stock Quantity"
          type="number"
          min="0"
          value={formData.stockQuantity}
          onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
          error={errors.stockQuantity?.[0]}
          required
        />

        <Input
          label="SKU (Stock Keeping Unit)"
          placeholder="e.g. TECH-KB-001"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          error={errors.sku?.[0]}
          required
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <input
          id="is_active"
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-slate-800 cursor-pointer">
          Product is active and published to catalog
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isPending}>
          {initialProduct ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
