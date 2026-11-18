import React from "react";
import Link from "next/link";
import { getProducts, getAllCategories } from "@/server/dal/products";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: "price_asc" | "price_desc" | "newest" | "title";
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;
  const currentPage = Math.max(1, parseInt(sp.page || "1", 10));
  const limit = 8;
  const offset = (currentPage - 1) * limit;

  const [productsData, categories] = await Promise.all([
    getProducts({
      query: sp.q,
      categorySlug: sp.category,
      sortBy: sp.sort,
      limit,
      offset,
    }),
    getAllCategories(),
  ]);

  const { products, total, totalPages } = productsData;

  const buildPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    if (sp.category) params.set("category", sp.category);
    if (sp.sort) params.set("sort", sp.sort);
    params.set("page", String(pageNumber));
    return `/products?${params.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Product Catalog
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Showing {products.length} of {total} products available
        </p>
      </div>

      <ProductFilters categories={categories} />

      <ProductGrid products={products} />

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          {currentPage > 1 ? (
            <Link href={buildPageUrl(currentPage - 1)}>
              <Button variant="outline" size="sm" className="gap-1">
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled className="gap-1 opacity-40">
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
          )}

          <div className="flex items-center gap-1 px-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link key={p} href={buildPageUrl(p)}>
                <Button
                  variant={p === currentPage ? "primary" : "outline"}
                  size="sm"
                  className="w-9 h-9 p-0"
                >
                  {p}
                </Button>
              </Link>
            ))}
          </div>

          {currentPage < totalPages ? (
            <Link href={buildPageUrl(currentPage + 1)}>
              <Button variant="outline" size="sm" className="gap-1">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled className="gap-1 opacity-40">
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
