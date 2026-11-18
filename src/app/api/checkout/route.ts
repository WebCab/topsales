import { NextResponse } from "next/server";
import { createCheckoutSessionAction } from "@/actions/checkout";

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin") || undefined;
    const result = await createCheckoutSessionAction(origin);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ url: result.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Checkout error" }, { status: 500 });
  }
}
