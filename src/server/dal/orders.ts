import { db, orders, orderItems, products, type Order, type OrderItem } from "@/db";
import { eq, desc, and } from "drizzle-orm";
import crypto from "crypto";
import { generateOrderNumber } from "@/lib/utils";
import { clearCart } from "./cart";

export interface CreateOrderParams {
  userId?: string | null;
  customerEmail: string;
  customerName: string;
  stripePaymentIntentId: string;
  stripeSessionId: string;
  subtotalInCents: number;
  taxInCents: number;
  shippingInCents: number;
  totalInCents: number;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    productTitle: string;
    priceInCents: number;
    quantity: number;
  }>;
  cartId?: string;
}

export async function getOrderByStripeSessionId(stripeSessionId: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.stripeSessionId, stripeSessionId))
    .limit(1);
  return order || null;
}

export async function getOrderByStripePaymentIntentId(stripePaymentIntentId: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.stripePaymentIntentId, stripePaymentIntentId))
    .limit(1);
  return order || null;
}

export async function createOrderFromStripe(params: CreateOrderParams): Promise<{ order: Order; isDuplicate: boolean }> {
  if (params.stripeSessionId) {
    const existingBySession = await getOrderByStripeSessionId(params.stripeSessionId);
    if (existingBySession) {
      console.log(`[Order Service] Order already processed for session: ${params.stripeSessionId}`);
      return { order: existingBySession, isDuplicate: true };
    }
  }

  if (params.stripePaymentIntentId) {
    const existingByIntent = await getOrderByStripePaymentIntentId(params.stripePaymentIntentId);
    if (existingByIntent) {
      console.log(`[Order Service] Order already processed for payment intent: ${params.stripePaymentIntentId}`);
      return { order: existingByIntent, isDuplicate: true };
    }
  }

  const orderId = crypto.randomUUID();
  const orderNumber = generateOrderNumber();
  const now = Math.floor(Date.now() / 1000);

  const newOrder = await db.transaction(async (tx) => {
    const [insertedOrder] = await tx
      .insert(orders)
      .values({
        id: orderId,
        orderNumber,
        userId: params.userId || null,
        customerEmail: params.customerEmail,
        customerName: params.customerName,
        status: "processing",
        paymentStatus: "paid",
        stripePaymentIntentId: params.stripePaymentIntentId,
        stripeSessionId: params.stripeSessionId,
        subtotalInCents: params.subtotalInCents,
        taxInCents: params.taxInCents,
        shippingInCents: params.shippingInCents,
        totalInCents: params.totalInCents,
        shippingAddress: JSON.stringify(params.shippingAddress),
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    for (const item of params.items) {
      const itemTotalInCents = item.priceInCents * item.quantity;
      await tx.insert(orderItems).values({
        id: crypto.randomUUID(),
        orderId: insertedOrder.id,
        productId: item.productId,
        productTitle: item.productTitle,
        priceInCents: item.priceInCents,
        quantity: item.quantity,
        totalInCents: itemTotalInCents,
        createdAt: now,
      });

      const [currentProd] = await tx
        .select({ stock: products.stockQuantity })
        .from(products)
        .where(eq(products.id, item.productId));

      if (currentProd) {
        const updatedStock = Math.max(0, currentProd.stock - item.quantity);
        await tx
          .update(products)
          .set({ stockQuantity: updatedStock, updatedAt: now })
          .where(eq(products.id, item.productId));
      }
    }

    return insertedOrder;
  });

  if (params.cartId) {
    try {
      await clearCart(params.cartId);
    } catch (err) {
      console.error("[Order Service] Error clearing cart after order creation:", err);
    }
  }

  return { order: newOrder, isDuplicate: false };
}

export async function getOrdersByUser(userId: string) {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrderWithItems(orderId: string, userId?: string) {
  const conditions = [eq(orders.id, orderId)];
  if (userId) {
    conditions.push(eq(orders.userId, userId));
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(and(...conditions))
    .limit(1);

  if (!order) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return {
    ...order,
    shippingAddressParsed: JSON.parse(order.shippingAddress),
    items,
  };
}

export async function getAllOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
) {
  const now = Math.floor(Date.now() / 1000);
  return db
    .update(orders)
    .set({
      status,
      updatedAt: now,
    })
    .where(eq(orders.id, orderId));
}
