import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "./add-to-cart-button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    description: string;
    priceInCents: number;
    compareAtPriceInCents?: number | null;
    imageUrl: string;
    categoryName?: string | null;
    stockQuantity: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const discountPercent =
    product.compareAtPriceInCents && product.compareAtPriceInCents > product.priceInCents
      ? Math.round(((product.compareAtPriceInCents - product.priceInCents) / product.compareAtPriceInCents) * 100)
      : null;

  return (
    <div className="group relative flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <Link href={`/products/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent && (
            <Badge variant="danger" className="font-bold shadow-sm">
              Save {discountPercent}%
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="neutral" className="bg-slate-900/80 text-white border-none shadow-sm backdrop-blur-sm">
              Sold Out
            </Badge>
          )}
          {isLowStock && (
            <Badge variant="warning" className="shadow-sm">
              Only {product.stockQuantity} left
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        {product.categoryName && (
          <span className="text-xs font-medium text-emerald-600 mb-1">
            {product.categoryName}
          </span>
        )}
        <Link href={`/products/${product.slug}`} className="group-hover:text-emerald-600 transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </Link>

        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-slate-900">
              {formatPrice(product.priceInCents)}
            </span>
            {product.compareAtPriceInCents && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.compareAtPriceInCents)}
              </span>
            )}
          </div>

          <AddToCartButton
            productId={product.id}
            disabled={isOutOfStock}
            size="sm"
            compact
          />
        </div>
      </div>
    </div>
  );
}
