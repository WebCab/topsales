"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/actions/auth";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    startTransition(async () => {
      const res = await loginAction({ email, password });
      if (res.success) {
        if (res.data?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/account");
        }
        router.refresh();
      } else {
        if (res.errors) {
          setErrors(res.errors);
        } else {
          setGeneralError(res.message || "Failed to sign in");
        }
      }
    });
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-xs text-slate-500">
            Access order history, tracking details, and saved preferences
          </p>
        </div>

        {generalError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email?.[0]}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password?.[0]}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isPending}
            className="w-full mt-2 py-2.5 font-bold"
          >
            Sign In
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
