import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";


export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Use stateless JWT sessions — no Session table needed in the DB
  session: {
    strategy: "jwt",
  },
  // Redirect unauthenticated users to /login
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      // These fields are for the built-in next-auth sign-in page (not used).
      // We have our own LoginForm.
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Dynamic import: PrismaClient is instantiated only when a login
        // attempt is made — not at module-load time during next build.
        const { prisma } = await import("@/lib/prisma");

        // Look up user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        // Compare submitted password against the stored bcrypt hash
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // Persist id and role into the JWT token on sign-in
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Expose id and role on the session object available in Server Components
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
