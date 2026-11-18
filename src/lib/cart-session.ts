import { cookies } from "next/headers";
import crypto from "crypto";

const CART_SESSION_COOKIE = "topsales_cart_session";

export async function getOrCreateCartSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existingId = cookieStore.get(CART_SESSION_COOKIE)?.value;
  if (existingId) {
    return existingId;
  }

  const newId = crypto.randomUUID();
  try {
    cookieStore.set(CART_SESSION_COOKIE, newId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
  } catch (err) {
    console.warn("[cart-session] Cannot write cookie during render:", err);
  }

  return newId;
}

export async function getCartSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_SESSION_COOKIE)?.value || null;
}
