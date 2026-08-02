import { withAuth } from "next-auth/middleware";

// Protects /dashboard and all routes underneath it.
// Unauthenticated requests are redirected to /login.
// /stories/** is NOT protected here — added in Phase 3 when stories are implemented.
//
// Note: Next.js 16 renamed middleware.ts → proxy.ts.
// This file replaces src/middleware.ts.
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [],
};
