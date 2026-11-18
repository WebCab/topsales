import React from "react";
import Link from "next/link";
import { ShoppingBag, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-400">On all orders over $50.00 nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Encrypted & Secure</h4>
              <p className="text-xs text-slate-400">PCI-DSS compliant Stripe checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">30-Day Hassle Returns</h4>
              <p className="text-xs text-slate-400">Instant full refund guarantee</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">
                Top<span className="text-emerald-400">Sales</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Modern full-stack commerce engine built with Next.js App Router, TypeScript, Drizzle ORM, and edge-native architectures.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=electronics" className="hover:text-emerald-400 transition-colors">
                  Electronics & Tech
                </Link>
              </li>
              <li>
                <Link href="/products?category=apparel" className="hover:text-emerald-400 transition-colors">
                  Apparel & Fashion
                </Link>
              </li>
              <li>
                <Link href="/products?category=home" className="hover:text-emerald-400 transition-colors">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-emerald-400 transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Customer Area
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/account" className="hover:text-emerald-400 transition-colors">
                  Order History & Status
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-emerald-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-emerald-400 transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Developer & Admin
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/products" className="hover:text-amber-400 transition-colors">
                  Product Inventory
                </Link>
              </li>
              <li>
                <Link href="/admin/orders" className="hover:text-amber-400 transition-colors">
                  Order Management
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TopSales Inc. All rights reserved.</p>
          <p>Production Ready Full-Stack Commerce Architecture</p>
        </div>
      </div>
    </footer>
  );
}
