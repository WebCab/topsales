"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerAction } from "@/actions/auth";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    startTransition(async () => {
      const res = await registerAction({ name, email, password });
      if (res.success) {
        router.push("/account");
        router.refresh();
      } else {
        if (res.errors) {
          setErrors(res.errors);
        } else {
          setGeneralError(res.message || "Failed to register");
        }
      }
    });
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-slate-500">
            Join TopSales to track orders, save shipping info, and get fast checkout
          </p>
        </div>

        {generalError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Alex Morgan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name?.[0]}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="alex@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email?.[0]}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters, 1 uppercase, 1 number"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password?.[0]}
            helperText="Min. 8 characters with at least 1 number and 1 capital letter"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isPending}
            className="w-full mt-2 py-2.5 font-bold"
          >
            Create Account
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
