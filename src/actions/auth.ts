"use server";

import { registerSchema, loginSchema, type RegisterInput, type LoginInput } from "@/lib/validations/auth";
import { findUserByEmail, createUser } from "@/server/dal/users";
import { hashPassword, verifyPassword, signSessionToken, setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { getCartSessionId } from "@/lib/cart-session";
import { mergeGuestCartIntoUserCart } from "@/server/dal/cart";
import { revalidatePath } from "next/cache";

export type ActionResult<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export async function registerAction(data: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid registration data",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await findUserByEmail(parsed.data.email);
  if (existing) {
    return {
      success: false,
      message: "An account with this email address already exists",
    };
  }

  const hashedPassword = await hashPassword(parsed.data.password);
  const user = await createUser({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash: hashedPassword,
    role: "customer",
  });

  const token = await signSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await setSessionCookie(token);

  const guestSession = await getCartSessionId();
  if (guestSession) {
    await mergeGuestCartIntoUserCart(guestSession, user.id);
  }

  revalidatePath("/", "layout");
  return { success: true, message: "Account created successfully" };
}

export async function loginAction(data: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid login credentials",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await findUserByEmail(parsed.data.email);
  if (!user) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  const isValid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!isValid) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  const token = await signSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await setSessionCookie(token);

  const guestSession = await getCartSessionId();
  if (guestSession) {
    await mergeGuestCartIntoUserCart(guestSession, user.id);
  }

  revalidatePath("/", "layout");
  return { success: true, message: "Signed in successfully", data: { role: user.role } };
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  revalidatePath("/", "layout");
}
