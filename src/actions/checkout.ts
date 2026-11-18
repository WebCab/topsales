"use server";

import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";
import { getCartSessionId } from "@/lib/cart-session";
import { getCartForSession, getCartWithItems } from "@/server/dal/cart";
import { createOrderFromStripe } from "@/server/dal/orders";
import crypto from "crypto";

export async function createCheckoutSessionAction(returnUrlOrigin?: string) {
  const sessionToken = await getCartSessionId();
  const user = await getCurrentUser();

  if (!sessionToken && !user) {
    return {
      success: false,
      message: "Your cart is empty",
    };
  }

  const cart = await getCartForSession(sessionToken, user?.userId);
  if (!cart) {
    return {
      success: false,
      message: "Your cart is empty",
    };
  }

  const cartDetails = await getCartWithItems(cart.id);

  if (!cartDetails || cartDetails.items.length === 0) {
    return {
      success: false,
      message: "Your cart is empty",
    };
  }

  for (const item of cartDetails.items) {
    if (!item.product.isActive) {
      return {
        success: false,
        message: `Product "${item.product.title}" is no longer available.`,
      };
    }
    if (item.quantity > item.product.stockQuantity) {
      return {
        success: false,
        message: `Insufficient stock for "${item.product.title}". Only ${item.product.stockQuantity} remaining.`,
      };
    }
  }

  const origin = returnUrlOrigin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const lineItems = cartDetails.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.product.title,
        images: item.product.imageUrl ? [item.product.imageUrl] : [],
      },
      unit_amount: item.product.priceInCents,
    },
    quantity: item.quantity,
  }));

  const isStripeConfigured =
    process.env.STRIPE_SECRET_KEY &&
    !process.env.STRIPE_SECRET_KEY.includes("placeholder");

  if (!isStripeConfigured) {
    const mockPaymentIntentId = `pi_mock_${crypto.randomUUID().replace(/-/g, "")}`;
    const mockSessionId = `cs_mock_${crypto.randomUUID().replace(/-/g, "")}`;

    const subtotalInCents = cartDetails.subtotalInCents;
    const taxInCents = Math.round(subtotalInCents * 0.08);
    const shippingInCents = subtotalInCents > 5000 ? 0 : 500;
    const totalInCents = subtotalInCents + taxInCents + shippingInCents;

    const { order } = await createOrderFromStripe({
      userId: user?.userId || null,
      customerEmail: user?.email || "guest@topsales.local",
      customerName: user?.name || "Valued Customer",
      stripePaymentIntentId: mockPaymentIntentId,
      stripeSessionId: mockSessionId,
      subtotalInCents,
      taxInCents,
      shippingInCents,
      totalInCents,
      shippingAddress: {
        line1: "123 Commerce Blvd",
        city: "San Francisco",
        state: "CA",
        postalCode: "94103",
        country: "US",
      },
      items: cartDetails.items.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.title,
        priceInCents: item.product.priceInCents,
        quantity: item.quantity,
      })),
      cartId: cart.id,
    });

    return {
      success: true,
      url: `${origin}/checkout/success?session_id=${mockSessionId}&order_id=${order.id}`,
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: cartDetails.subtotalInCents > 5000 ? 0 : 500,
              currency: "usd",
            },
            display_name: cartDetails.subtotalInCents > 5000 ? "Free Standard Shipping" : "Standard Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
      customer_email: user?.email,
      metadata: {
        cartId: cart.id,
        userId: user?.userId || "",
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return {
      success: true,
      url: session.url,
    };
  } catch (error: any) {
    console.error("Stripe session creation error:", error);
    return {
      success: false,
      message: error.message || "Unable to initiate checkout session",
    };
  }
}
