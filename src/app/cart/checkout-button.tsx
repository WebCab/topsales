"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSessionAction } from "@/actions/checkout";
import { ArrowRight } from "lucide-react";

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await createCheckoutSessionAction(window.location.origin);
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        setErrorMsg(res.message || "Failed to proceed to checkout");
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error initiating checkout");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCheckout}
        isLoading={isLoading}
        size="lg"
        className="w-full py-3.5 font-bold shadow-md shadow-emerald-700/20"
      >
        Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
      {errorMsg && (
        <p className="text-xs text-rose-600 font-medium text-center">{errorMsg}</p>
      )}
    </div>
  );
}
