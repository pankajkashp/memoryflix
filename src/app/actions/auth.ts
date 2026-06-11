"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// ── Signup ────────────────────────────────────────────────────────────────────

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email({ error: "Please enter a valid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignupState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    general?: string[];
  };
};

export async function signup(
  _state: SignupState,
  formData: FormData
): Promise<SignupState> {
  // 1. Validate fields server-side
  const result = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { name, email, password } = result.data;

  // Dynamic import: PrismaClient is only instantiated when signup is
  // actually submitted — not at module-load time during next build.
  const { prisma } = await import("@/lib/prisma");

  // 2. Check for duplicate email
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { errors: { email: ["An account with this email already exists"] } };
  }

  // 3. Hash password — never store plain text
  const hashedPassword = await bcrypt.hash(password, 12);

  // 4. Create user
  try {
    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
  } catch {
    return { errors: { general: ["Something went wrong. Please try again."] } };
  }

  // 5. Redirect to login — user must sign in after registering
  redirect("/login?registered=true");
}
