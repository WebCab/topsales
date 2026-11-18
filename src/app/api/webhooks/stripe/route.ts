import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createOrderFromStripe } from "@/server/dal/orders";
import { getCartWithItems } from "@/server/dal/cart";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET environment variable is not configured");
    return NextResponse.json({ error: "Webhook secret unconfigured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const cartId = session.metadata?.cartId;
      const userId = session.metadata?.userId || null;
      const customerEmail = session.customer_details?.email || session.customer_email || "customer@example.com";
      const customerName = session.customer_details?.name || "Customer";

      let items: Array<{
        productId: string;
        productTitle: string;
        priceInCents: number;
        quantity: number;
      }> = [];

      if (cartId) {
        const cartDetails = await getCartWithItems(cartId);
        if (cartDetails && cartDetails.items.length > 0) {
          items = cartDetails.items.map((item) => ({
            productId: item.product.id,
            productTitle: item.product.title,
            priceInCents: item.product.priceInCents,
            quantity: item.quantity,
          }));
        }
      }

      if (items.length === 0) {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        items = lineItems.data.map((item) => ({
          productId: (item.price?.product as string) || "product_item",
          productTitle: item.description || "Product Item",
          priceInCents: item.amount_total / (item.quantity || 1),
          quantity: item.quantity || 1,
        }));
      }

      const shippingDetails = session.shipping_details?.address;
      const shippingAddress = {
        line1: shippingDetails?.line1 || "Street Address",
        line2: shippingDetails?.line2 || undefined,
        city: shippingDetails?.city || "City",
        state: shippingDetails?.state || "State",
        postalCode: shippingDetails?.postal_code || "00000",
        country: shippingDetails?.country || "US",
      };

      const totalInCents = session.amount_total || 0;
      const subtotalInCents = session.amount_subtotal || totalInCents;
      const shippingInCents = session.total_details?.amount_shipping || 0;
      const taxInCents = session.total_details?.amount_tax || 0;

      const { order, isDuplicate } = await createOrderFromStripe({
        userId,
        customerEmail,
        customerName,
        stripePaymentIntentId: (session.payment_intent as string) || session.id,
        stripeSessionId: session.id,
        subtotalInCents,
        taxInCents,
        shippingInCents,
        totalInCents,
        shippingAddress,
        items,
        cartId,
      });

      if (isDuplicate) {
        console.log(`[Stripe Webhook] Duplicate event for session ${session.id} skipped.`);
      } else {
        console.log(`[Stripe Webhook] Successfully recorded order #${order.orderNumber}`);
      }

      return NextResponse.json({ received: true, orderId: order.id });
    } catch (err: any) {
      console.error("[Stripe Webhook] Error fulfilling order:", err);
      return NextResponse.json({ error: "Failed to fulfill order" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
