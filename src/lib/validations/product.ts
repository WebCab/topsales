import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(120),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priceInCents: z.coerce.number().int().positive("Price must be greater than zero"),
  compareAtPriceInCents: z.coerce.number().int().positive().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Must be a valid image URL"),
  images: z.string().optional().default("[]"),
  stockQuantity: z.coerce.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().min(3, "SKU must be at least 3 characters").max(50),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = productSchema.partial().extend({
  id: z.string().min(1),
});

export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
