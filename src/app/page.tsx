import React from "react";
import Link from "next/link";
import { getProducts, getAllCategories } from "@/server/dal/products";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";

export default async function HomePage() {
  const [productsData, categories] = await Promise.all([
    getProducts({ limit: 8, sortBy: "newest" }),
    getAllCategories(),
  ]);

  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-20 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> High-Performance Full-Stack Commerce
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Curated Excellence,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Delivered Seamlessly
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience lightning-fast shopping powered by modern App Router server components, robust relational persistence, and secure Stripe checkout.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-base font-semibold shadow-lg shadow-emerald-900/30">
                Explore Catalog <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/products?category=electronics">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-slate-700 text-white hover:bg-slate-800">
                Featured Electronics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Shop by Category</h2>
            <p className="text-sm text-slate-500 mt-1">Discover popular collections handpicked for you</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group p-6 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  {category.description || "Explore our top-selling items"}
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Browse Collection <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" /> Fresh Drops
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Products</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-slate-600 hover:text-emerald-600">
            View Catalog ({productsData.total})
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsData.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to elevate your shopping experience?
            </h3>
            <p className="text-sm text-slate-300">
              Join thousands of customers enjoying guaranteed fast shipping, reliable inventory, and continuous customer care.
            </p>
          </div>
          <Link href="/products">
            <Button size="lg" className="whitespace-nowrap px-8 py-3">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
