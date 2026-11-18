"use server";

import { addToCartSchema, updateCartItemSchema, removeCartItemSchema } from "@/lib/validations/cart";
import { getOrCreateCartSessionId, getCartSessionId } from "@/lib/cart-session";
import { getCurrentUser } from "@/lib/auth";
import {
  getOrCreateCart,
  getCartForSession,
  getCartWithItems,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  type CartWithDetails,
} from "@/server/dal/cart";
import { revalidatePath } from "next/cache";

export async function getCartAction(): Promise<CartWithDetails | null> {
  const user = await getCurrentUser();
  const sessionToken = await getCartSessionId();

  if (!user && !sessionToken) {
    return null;
  }

  const cart = await getCartForSession(sessionToken, user?.userId);
  if (!cart) {
    return null;
  }

  return getCartWithItems(cart.id);
}

export async function addToCartAction(input: { productId: string; quantity: number }) {
  const parsed = addToCartSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid input",
    };
  }

  try {
    const sessionToken = await getOrCreateCartSessionId();
    const user = await getCurrentUser();
    const cart = await getOrCreateCart(sessionToken, user?.userId);

    await addItemToCart(cart.id, parsed.data.productId, parsed.data.quantity);
    revalidatePath("/", "layout");
    return { success: true, message: "Item added to cart" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to add item to cart",
    };
  }
}

export async function updateCartQuantityAction(input: { cartItemId: string; quantity: number }) {
  const parsed = updateCartItemSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid quantity",
    };
  }

  try {
    await updateCartItemQuantity(parsed.data.cartItemId, parsed.data.quantity);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update item quantity",
    };
  }
}

export async function removeFromCartAction(input: { cartItemId: string }) {
  const parsed = removeCartItemSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid cart item",
    };
  }

  try {
    await removeCartItem(parsed.data.cartItemId);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to remove item",
    };
  }
}
