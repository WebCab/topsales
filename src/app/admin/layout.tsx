import React from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
