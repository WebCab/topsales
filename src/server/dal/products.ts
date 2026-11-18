import { db, products, categories, type Product, type Category, type NewProduct } from "@/db";
import { eq, and, like, or, desc, asc, sql } from "drizzle-orm";
import crypto from "crypto";

export interface GetProductsParams {
  query?: string;
  categorySlug?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "title";
  limit?: number;
  offset?: number;
  onlyActive?: boolean;
}

export async function getProducts(params: GetProductsParams = {}) {
  const {
    query,
    categorySlug,
    sortBy = "newest",
    limit = 12,
    offset = 0,
    onlyActive = true,
  } = params;

  let conditions = [];

  if (onlyActive) {
    conditions.push(eq(products.isActive, true));
  }

  if (query && query.trim() !== "") {
    const searchPattern = `%${query.trim()}%`;
    conditions.push(
      or(
        like(products.title, searchPattern),
        like(products.description, searchPattern),
        like(products.sku, searchPattern)
      )
    );
  }

  if (categorySlug && categorySlug !== "all") {
    const cat = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1);

    if (cat.length > 0) {
      conditions.push(eq(products.categoryId, cat[0].id));
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByClause;
  switch (sortBy) {
    case "price_asc":
      orderByClause = asc(products.priceInCents);
      break;
    case "price_desc":
      orderByClause = desc(products.priceInCents);
      break;
    case "title":
      orderByClause = asc(products.title);
      break;
    case "newest":
    default:
      orderByClause = desc(products.createdAt);
      break;
  }

  const items = await db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      description: products.description,
      priceInCents: products.priceInCents,
      compareAtPriceInCents: products.compareAtPriceInCents,
      categoryId: products.categoryId,
      imageUrl: products.imageUrl,
      images: products.images,
      stockQuantity: products.stockQuantity,
      isActive: products.isActive,
      sku: products.sku,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(whereClause)
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(whereClause);

  const total = Number(totalCountResult[0]?.count || 0);

  return {
    products: items,
    total,
    totalPages: Math.ceil(total / limit),
    page: Math.floor(offset / limit) + 1,
  };
}

export async function getProductBySlug(slug: string) {
  const result = await db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      description: products.description,
      priceInCents: products.priceInCents,
      compareAtPriceInCents: products.compareAtPriceInCents,
      categoryId: products.categoryId,
      imageUrl: products.imageUrl,
      images: products.images,
      stockQuantity: products.stockQuantity,
      isActive: products.isActive,
      sku: products.sku,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);

  return result[0] || null;
}

export async function getProductById(id: string) {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  return result[0] || null;
}

export async function getAllCategories(): Promise<Category[]> {
  return db.select().from(categories).orderBy(asc(categories.name));
}

export async function createProduct(data: Omit<NewProduct, "id" | "createdAt" | "updatedAt">) {
  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  await db.insert(products).values({
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  });

  return getProductById(id);
}

export async function updateProduct(id: string, data: Partial<Omit<NewProduct, "id" | "createdAt" | "updatedAt">>) {
  const now = Math.floor(Date.now() / 1000);

  await db
    .update(products)
    .set({
      ...data,
      updatedAt: now,
    })
    .where(eq(products.id, id));

  return getProductById(id);
}

export async function deleteProduct(id: string) {
  return db.delete(products).where(eq(products.id, id));
}
