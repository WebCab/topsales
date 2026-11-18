import React from "react";
import { ProductCard } from "./product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PackageSearch } from "lucide-react";

interface ProductGridProps {
  products: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    priceInCents: number;
    compareAtPriceInCents?: number | null;
    imageUrl: string;
    categoryName?: string | null;
    stockQuantity: number;
  }>;
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<PackageSearch className="w-10 h-10" />}
        title="No products found"
        description="We couldn't find any items matching your current filters or search query."
        actionHref="/products"
        actionLabel="Reset Filters"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
