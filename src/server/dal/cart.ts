import { db, carts, cartItems, products } from "@/db";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

export interface CartWithDetails {
  cart: {
    id: string;
    userId: string | null;
    sessionToken: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      title: string;
      slug: string;
      priceInCents: number;
      imageUrl: string;
      stockQuantity: number;
      isActive: boolean;
    };
    itemTotalInCents: number;
  }>;
  subtotalInCents: number;
  totalQuantity: number;
}

export async function getCartForSession(sessionToken?: string | null, userId?: string | null) {
  if (userId) {
    const [userCart] = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    if (userCart) return userCart;
  }

  if (sessionToken) {
    const [existingCart] = await db
      .select()
      .from(carts)
      .where(eq(carts.sessionToken, sessionToken))
      .limit(1);

    if (existingCart) return existingCart;
  }

  return null;
}

export async function getOrCreateCart(sessionToken: string, userId?: string) {
  if (userId) {
    const userCart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    if (userCart.length > 0) {
      return userCart[0];
    }
  }

  const existingCart = await db
    .select()
    .from(carts)
    .where(eq(carts.sessionToken, sessionToken))
    .limit(1);

  if (existingCart.length > 0) {
    if (userId && !existingCart[0].userId) {
      await db
        .update(carts)
        .set({ userId })
        .where(eq(carts.id, existingCart[0].id));
      existingCart[0].userId = userId;
    }
    return existingCart[0];
  }

  const cartId = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  const [newCart] = await db
    .insert(carts)
    .values({
      id: cartId,
      sessionToken,
      userId: userId || null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return newCart;
}

export async function getCartWithItems(cartId: string): Promise<CartWithDetails | null> {
  const cartList = await db
    .select()
    .from(carts)
    .where(eq(carts.id, cartId))
    .limit(1);

  if (cartList.length === 0) return null;
  const cart = cartList[0];

  const items = await db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      product: {
        id: products.id,
        title: products.title,
        slug: products.slug,
        priceInCents: products.priceInCents,
        imageUrl: products.imageUrl,
        stockQuantity: products.stockQuantity,
        isActive: products.isActive,
      },
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cartId));

  let subtotalInCents = 0;
  let totalQuantity = 0;

  const formattedItems = items.map((item) => {
    const itemTotalInCents = item.quantity * item.product.priceInCents;
    subtotalInCents += itemTotalInCents;
    totalQuantity += item.quantity;

    return {
      id: item.id,
      quantity: item.quantity,
      product: item.product,
      itemTotalInCents,
    };
  });

  return {
    cart: {
      id: cart.id,
      userId: cart.userId,
      sessionToken: cart.sessionToken,
    },
    items: formattedItems,
    subtotalInCents,
    totalQuantity,
  };
}

export async function addItemToCart(cartId: string, productId: string, quantity: number) {
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, productId), eq(products.isActive, true)))
    .limit(1);

  if (!product) {
    throw new Error("Product not found or unavailable");
  }

  const [existingItem] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))
    .limit(1);

  const now = Math.floor(Date.now() / 1000);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.stockQuantity) {
      throw new Error(`Only ${product.stockQuantity} items in stock`);
    }

    await db
      .update(cartItems)
      .set({
        quantity: newQuantity,
        updatedAt: now,
      })
      .where(eq(cartItems.id, existingItem.id));

    return existingItem.id;
  } else {
    if (quantity > product.stockQuantity) {
      throw new Error(`Only ${product.stockQuantity} items in stock`);
    }

    const newItemId = crypto.randomUUID();
    await db.insert(cartItems).values({
      id: newItemId,
      cartId,
      productId,
      quantity,
      createdAt: now,
      updatedAt: now,
    });

    return newItemId;
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  if (quantity <= 0) {
    return removeCartItem(cartItemId);
  }

  const [item] = await db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      stockQuantity: products.stockQuantity,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.id, cartItemId))
    .limit(1);

  if (!item) {
    throw new Error("Cart item not found");
  }

  if (quantity > item.stockQuantity) {
    throw new Error(`Only ${item.stockQuantity} items in stock`);
  }

  const now = Math.floor(Date.now() / 1000);
  await db
    .update(cartItems)
    .set({
      quantity,
      updatedAt: now,
    })
    .where(eq(cartItems.id, cartItemId));
}

export async function removeCartItem(cartItemId: string) {
  return db.delete(cartItems).where(eq(cartItems.id, cartItemId));
}

export async function clearCart(cartId: string) {
  return db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}

export async function mergeGuestCartIntoUserCart(guestSessionToken: string, userId: string) {
  const [guestCart] = await db
    .select()
    .from(carts)
    .where(eq(carts.sessionToken, guestSessionToken))
    .limit(1);

  if (!guestCart) return;

  const [userCart] = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, userId))
    .limit(1);

  if (!userCart) {
    await db
      .update(carts)
      .set({ userId })
      .where(eq(carts.id, guestCart.id));
    return;
  }

  const guestItems = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.cartId, guestCart.id));

  for (const item of guestItems) {
    const [existing] = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.cartId, userCart.id), eq(cartItems.productId, item.productId)))
      .limit(1);

    if (existing) {
      await db
        .update(cartItems)
        .set({ quantity: existing.quantity + item.quantity })
        .where(eq(cartItems.id, existing.id));
    } else {
      await db.insert(cartItems).values({
        id: crypto.randomUUID(),
        cartId: userCart.id,
        productId: item.productId,
        quantity: item.quantity,
        createdAt: Math.floor(Date.now() / 1000),
        updatedAt: Math.floor(Date.now() / 1000),
      });
    }
  }

  await db.delete(carts).where(eq(carts.id, guestCart.id));
}
