import { PrismaClient } from "@prisma/client";

// Clear any stale global prisma reference from previous schema versions
if (typeof globalThis !== "undefined" && (globalThis as any).prisma) {
  delete (globalThis as any).prisma;
}

const globalForPrisma = globalThis as unknown as {
  prisma_v2?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma_v2 ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma_v2 = prisma;
}
