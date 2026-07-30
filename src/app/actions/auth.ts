"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// Basic in-memory rate limiter for signup
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }
  if (now - record.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  record.count += 1;
  return true;
}

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
  // Very basic IP/identifier based rate limiting (using a fixed string or headers in real app, but here we can just use email as an identifier since we are in a server action and IP isn't easily accessible without headers API).
  // Actually, Server Actions can access headers.
  // Wait, let's import headers from next/headers
  // We'll add the import at the top later, but for now we'll do it dynamically
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
  
  if (!checkRateLimit(ip)) {
    return { errors: { general: ["Too many requests. Please try again later."] } };
  }

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
