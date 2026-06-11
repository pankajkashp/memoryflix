import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Thin route handler — all logic lives in src/lib/auth.ts
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
