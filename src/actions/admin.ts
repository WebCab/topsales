"use server";

import { requireAdmin } from "@/lib/auth";
import { productSchema, updateProductSchema } from "@/lib/validations/product";
import { createProduct, updateProduct, deleteProduct } from "@/server/dal/products";
import { updateOrderStatus } from "@/server/dal/orders";
import { revalidatePath } from "next/cache";

export async function createProductAction(formData: unknown) {
  await requireAdmin();

  const parsed = productSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const product = await createProduct(parsed.data);
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product created successfully",
      product,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create product",
    };
  }
}

export async function updateProductAction(formData: unknown) {
  await requireAdmin();

  const parsed = updateProductSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { id, ...updateData } = parsed.data;

  try {
    const updated = await updateProduct(id, updateData);
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product updated successfully",
      product: updated,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update product",
    };
  }
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();

  try {
    await deleteProduct(productId);
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete product",
    };
  }
}

export async function updateOrderStatusAction(orderId: string, status: any) {
  await requireAdmin();

  try {
    await updateOrderStatus(orderId, status);
    revalidatePath("/admin/orders");
    revalidatePath("/account");
    return {
      success: true,
      message: "Order status updated",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update order status",
    };
  }
}
