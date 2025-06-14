// src/pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/product",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
};


// 👇 This is required in `pages/api`
export default NextAuth(authOptions);
