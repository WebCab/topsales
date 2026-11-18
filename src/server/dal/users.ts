import { db, users, type User, type NewUser } from "@/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function findUserByEmail(email: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  return user || null;
}

export async function findUserById(id: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  role?: "customer" | "admin";
}): Promise<User> {
  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  const [newUser] = await db
    .insert(users)
    .values({
      id,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash: data.passwordHash,
      role: data.role || "customer",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return newUser;
}
