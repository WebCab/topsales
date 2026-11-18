import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1").max(99),
});

export const updateCartItemSchema = z.object({
  cartItemId: z.string().min(1, "Cart Item ID is required"),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative").max(99),
});

export const removeCartItemSchema = z.object({
  cartItemId: z.string().min(1, "Cart Item ID is required"),
});
