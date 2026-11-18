import { z } from "zod";

export const shippingAddressSchema = z.object({
  line1: z.string().min(3, "Street address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  postalCode: z.string().min(3, "Postal/Zip code is required"),
  country: z.string().length(2, "Country must be a 2-letter ISO code (e.g. US)"),
});

export const checkoutSessionSchema = z.object({
  customerEmail: z.string().email("Valid email is required"),
  customerName: z.string().min(2, "Full name is required"),
  shippingAddress: shippingAddressSchema,
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CheckoutSessionInput = z.infer<typeof checkoutSessionSchema>;
