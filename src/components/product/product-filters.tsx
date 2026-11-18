"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import type { Category } from "@/db";

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sort") || "newest";
  const currentQuery = searchParams.get("q") || "";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all" && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by title, sku..."
            defaultValue={currentQuery}
            onChange={(e) => {
              const val = e.target.value;
              const timeout = setTimeout(() => {
                updateFilters("q", val);
              }, 400);
              return () => clearTimeout(timeout);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={currentCategory}
            onChange={(e) => updateFilters("category", e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-700"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={currentSort}
            onChange={(e) => updateFilters("sort", e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-700"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>
      {isPending && (
        <div className="h-0.5 w-full bg-emerald-100 overflow-hidden">
          <div className="h-full bg-emerald-500 animate-pulse w-1/3" />
        </div>
      )}
    </div>
  );
}
