import NextAuth from "next-auth";
import { authConfig } from "@/auth/config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "@/services/user";
import {
  getTwoFactorConfirmationByUserId,
} from "@/services/two-factor-confirmation";
import { isExpired } from "@/lib/utils";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 Day
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);
      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      // If user's 2FA checked
      if (existingUser.isTwoFactorEnabled) {
        const existingTwoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        // If two factor confirmation doesn't exist, then prevent to login
        if (!existingTwoFactorConfirmation) return false;
        // If two factor confirmation is expired, then prevent to login
        const hasExpired = isExpired(existingTwoFactorConfirmation.expires);
        if (hasExpired) return false;
      }

      return true;
    },
  },
  ...authConfig,
});
