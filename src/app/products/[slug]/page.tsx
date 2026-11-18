import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/server/dal/products";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";
import { Truck, ShieldCheck, RefreshCw, ChevronRight } from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedData = await getProducts({
    categorySlug: product.categorySlug || undefined,
    limit: 4,
  });
  const relatedProducts = relatedData.products.filter((p) => p.id !== product.id).slice(0, 4);

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const discountPercent =
    product.compareAtPriceInCents && product.compareAtPriceInCents > product.priceInCents
      ? Math.round(((product.compareAtPriceInCents - product.priceInCents) / product.compareAtPriceInCents) * 100)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/" className="hover:text-slate-900">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/products" className="hover:text-slate-900">
          Products
        </Link>
        {product.categoryName && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              href={`/products?category=${product.categorySlug}`}
              className="hover:text-slate-900"
            >
              {product.categoryName}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            {product.categoryName && (
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                {product.categoryName}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 leading-snug">
              {product.title}
            </h1>
            <p className="text-xs text-slate-400 mt-2">SKU: {product.sku}</p>
          </div>

          <div className="flex items-baseline gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-3xl font-black text-slate-900">
              {formatPrice(product.priceInCents)}
            </span>
            {product.compareAtPriceInCents && (
              <span className="text-base text-slate-400 line-through">
                {formatPrice(product.compareAtPriceInCents)}
              </span>
            )}
            {discountPercent && (
              <Badge variant="danger" className="ml-auto font-bold text-xs">
                Save {discountPercent}%
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <Badge variant="danger">Out of Stock</Badge>
            ) : isLowStock ? (
              <Badge variant="warning">Low Stock — Only {product.stockQuantity} remaining</Badge>
            ) : (
              <Badge variant="success">In Stock ({product.stockQuantity} available)</Badge>
            )}
          </div>

          <div className="prose prose-sm text-slate-600 leading-relaxed pt-2">
            <p>{product.description}</p>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <AddToCartButton
              productId={product.id}
              disabled={isOutOfStock}
              maxQuantity={product.stockQuantity}
              size="lg"
            />
          </div>

          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Fast 3-5 day delivery</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>30-day money back guarantee</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Verified genuine item</span>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            You may also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
