import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["customer", "admin"] })
    .notNull()
    .default("customer"),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  compareAtPriceInCents: integer("compare_at_price_in_cents"),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  imageUrl: text("image_url").notNull(),
  images: text("images").notNull().default("[]"),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  sku: text("sku").notNull().unique(),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const carts = sqliteTable("carts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  sessionToken: text("session_token").notNull().unique(),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const cartItems = sqliteTable("cart_items", {
  id: text("id").primaryKey(),
  cartId: text("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: text("user_id").references(() => users.id),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  status: text("status", {
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
  })
    .notNull()
    .default("pending"),
  paymentStatus: text("payment_status", {
    enum: ["unpaid", "paid", "failed", "refunded"],
  })
    .notNull()
    .default("unpaid"),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  stripeSessionId: text("stripe_session_id").unique(),
  subtotalInCents: integer("subtotal_in_cents").notNull(),
  taxInCents: integer("tax_in_cents").notNull().default(0),
  shippingInCents: integer("shipping_in_cents").notNull().default(0),
  totalInCents: integer("total_in_cents").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => products.id),
  productTitle: text("product_title").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  quantity: integer("quantity").notNull(),
  totalInCents: integer("total_in_cents").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch())`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Cart = typeof carts.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
