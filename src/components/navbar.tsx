import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getCartAction } from "@/actions/cart";
import { CartButton } from "./cart/cart-button";
import { ShoppingBag, User, ShieldCheck, LogOut, Package } from "lucide-react";
import { logoutAction } from "@/actions/auth";

export async function Navbar() {
  const user = await getCurrentUser();
  const cart = await getCartAction();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-700 transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Top<span className="text-emerald-600">Sales</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/products" className="hover:text-emerald-600 transition-colors">
                Catalog
              </Link>
              <Link href="/products?category=electronics" className="hover:text-emerald-600 transition-colors">
                Electronics
              </Link>
              <Link href="/products?category=apparel" className="hover:text-emerald-600 transition-colors">
                Apparel
              </Link>
              <Link href="/products?category=home" className="hover:text-emerald-600 transition-colors">
                Home & Living
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-emerald-600 p-1.5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="hidden sm:inline-block max-w-[120px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                  </button>

                  <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 hidden group-hover:block transition-all z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      Orders & Account
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-amber-700 hover:bg-amber-50"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        Admin Dashboard
                      </Link>
                    )}

                    <form action={logoutAction} className="border-t border-slate-100">
                      <button
                        type="submit"
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-700 hover:text-emerald-600 px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 px-3.5 py-1.5 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            <div className="border-l border-slate-200 pl-3">
              <CartButton initialCart={cart} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
