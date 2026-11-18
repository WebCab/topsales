"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
        <p className="text-sm text-slate-500">
          An unexpected error occurred while loading this page. Our technical team has been notified.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go to Home
          </Button>
          <Button variant="primary" onClick={() => reset()}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
