import "next-auth";
import "next-auth/jwt";

// Augment next-auth types to include id and role on session and JWT.
// This is required because next-auth's default User type does not include
// these fields. Without this, TypeScript will error when accessing them.

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
