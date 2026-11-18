import { db, users, categories, products, orders, orderItems } from "./index";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateOrderNumber } from "../lib/utils";

async function seed() {
  console.log("🌱 Starting database seeding...");

  const adminPasswordHash = await bcrypt.hash("Admin1234!", 10);
  const customerPasswordHash = await bcrypt.hash("Customer1234!", 10);
  const now = Math.floor(Date.now() / 1000);

  const adminId = crypto.randomUUID();
  const customerId = crypto.randomUUID();

  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(products);
  await db.delete(categories);
  await db.delete(users);

  await db.insert(users).values([
    {
      id: adminId,
      name: "Admin Superuser",
      email: "admin@topsales.local",
      passwordHash: adminPasswordHash,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: customerId,
      name: "Jane Customer",
      email: "customer@topsales.local",
      passwordHash: customerPasswordHash,
      role: "customer",
      createdAt: now,
      updatedAt: now,
    },
  ]);
  console.log(" Users created: admin@topsales.local / Admin1234!, customer@topsales.local / Customer1234!");

  const catElectronicsId = crypto.randomUUID();
  const catApparelId = crypto.randomUUID();
  const catHomeId = crypto.randomUUID();
  const catFootwearId = crypto.randomUUID();

  await db.insert(categories).values([
    {
      id: catElectronicsId,
      name: "Electronics",
      slug: "electronics",
      description: "Cutting-edge audio, computing, and smart accessories",
      createdAt: now,
    },
    {
      id: catApparelId,
      name: "Apparel",
      slug: "apparel",
      description: "Premium sustainable fashion and urban everyday essentials",
      createdAt: now,
    },
    {
      id: catHomeId,
      name: "Home & Living",
      slug: "home",
      description: "Modern minimalist home goods and ambient desk accessories",
      createdAt: now,
    },
    {
      id: catFootwearId,
      name: "Footwear",
      slug: "footwear",
      description: "Engineered performance sneakers and artisanal boots",
      createdAt: now,
    },
  ]);
  console.log(" Categories seeded.");

  const sampleProducts = [
    {
      id: crypto.randomUUID(),
      title: "Pro Noise-Canceling Wireless Headphones",
      slug: "pro-wireless-headphones",
      description: "Industry-leading active noise cancellation with 40mm beryllium drivers, spatial audio support, and up to 45 hours of ultra-long battery life.",
      priceInCents: 24999,
      compareAtPriceInCents: 29999,
      categoryId: catElectronicsId,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      images: "[]",
      stockQuantity: 28,
      sku: "AUDIO-PRO-001",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Mechanical Precision Keyboard RGB",
      slug: "mechanical-precision-keyboard",
      description: "Custom hot-swappable tactile switches, CNC aluminum chassis, per-key RGB backlighting, and braided USB-C detachable cable.",
      priceInCents: 12900,
      compareAtPriceInCents: 15900,
      categoryId: catElectronicsId,
      imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
      images: "[]",
      stockQuantity: 15,
      sku: "TECH-KB-002",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Ultra-Lightweight Minimalist Smartwatch",
      slug: "minimalist-smartwatch",
      description: "Continuous heart rate and SPO2 monitoring, GPS tracking, 5ATM water resistance, and an always-on AMOLED sapphire crystal display.",
      priceInCents: 18950,
      compareAtPriceInCents: 21999,
      categoryId: catElectronicsId,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      images: "[]",
      stockQuantity: 4,
      sku: "WATCH-AMOLED-003",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Heavyweight Organic Cotton Oversized Hoodie",
      slug: "heavyweight-organic-hoodie",
      description: "Crafted from 480 GSM combed French terry organic cotton. Double-layered hood, seamless cuffs, and pre-shrunk luxury drape.",
      priceInCents: 8500,
      compareAtPriceInCents: 9800,
      categoryId: catApparelId,
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
      images: "[]",
      stockQuantity: 45,
      sku: "APP-HOOD-004",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Technical Water-Repellent City Jacket",
      slug: "technical-city-jacket",
      description: "Three-layer Gore-Tex membrane engineered for urban commuters. Sealed magnetic storm flap and concealed quick-access pockets.",
      priceInCents: 17500,
      compareAtPriceInCents: null,
      categoryId: catApparelId,
      imageUrl: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&q=80",
      images: "[]",
      stockQuantity: 12,
      sku: "APP-JKT-005",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Ceramic Matte Pour-Over Coffee Brewer Set",
      slug: "ceramic-pour-over-coffee-set",
      description: "Artisanal double-fired matte stoneware dripper with heat-resistant borosilicate glass server and bamboo insulation collar.",
      priceInCents: 4800,
      compareAtPriceInCents: 5800,
      categoryId: catHomeId,
      imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
      images: "[]",
      stockQuantity: 30,
      sku: "HOME-BREW-006",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Hand-Poured Soy Wax Botanical Candle",
      slug: "botanical-soy-wax-candle",
      description: "Clean burning natural soy wax scented with cedarwood, amber, and bergamot. 65-hour burn time in an amber glass jar.",
      priceInCents: 2600,
      compareAtPriceInCents: null,
      categoryId: catHomeId,
      imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80",
      images: "[]",
      stockQuantity: 50,
      sku: "HOME-CNDL-007",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: "Breathable Knit Cushion Running Sneakers",
      slug: "breathable-cushion-running-sneakers",
      description: "Engineered seamless jacquard upper with responsive dual-density nitrogen-infused EVA midsole for maximum energy rebound.",
      priceInCents: 13900,
      compareAtPriceInCents: 16500,
      categoryId: catFootwearId,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      images: "[]",
      stockQuantity: 20,
      sku: "SHOE-RUN-008",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.insert(products).values(sampleProducts);
  console.log(` Created ${sampleProducts.length} catalog products.`);

  const sampleOrderId = crypto.randomUUID();
  const sampleOrderNumber = generateOrderNumber();

  await db.insert(orders).values({
    id: sampleOrderId,
    orderNumber: sampleOrderNumber,
    userId: customerId,
    customerEmail: "customer@topsales.local",
    customerName: "Jane Customer",
    status: "delivered",
    paymentStatus: "paid",
    stripePaymentIntentId: "pi_demo_initial_order_123",
    stripeSessionId: "cs_demo_initial_order_123",
    subtotalInCents: 24999,
    taxInCents: 2000,
    shippingInCents: 0,
    totalInCents: 26999,
    shippingAddress: JSON.stringify({
      line1: "742 Evergreen Terrace",
      city: "Springfield",
      state: "OR",
      postalCode: "97477",
      country: "US",
    }),
    createdAt: now - 86400 * 3,
    updatedAt: now - 86400 * 3,
  });

  await db.insert(orderItems).values({
    id: crypto.randomUUID(),
    orderId: sampleOrderId,
    productId: sampleProducts[0].id,
    productTitle: sampleProducts[0].title,
    priceInCents: sampleProducts[0].priceInCents,
    quantity: 1,
    totalInCents: sampleProducts[0].priceInCents,
    createdAt: now - 86400 * 3,
  });

  console.log(` Sample order #${sampleOrderNumber} created.`);
  console.log(" Seeding completed successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
