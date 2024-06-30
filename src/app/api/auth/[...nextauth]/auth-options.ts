// import getAccessToken from "@/utils/axios/getAccessToken";
// import { mahaScoreBackendUrl } from "@/utils/axios/getAxios";
import { routes } from '@/config/routes';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  // debug: true,
  pages: {
    signIn: routes.retailer.login,
    error: routes.retailer.login,
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30, // Expire in 30 Days
  },
  callbacks: {
    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      if (account?.provider === 'credentials') {
        if (user) {
          return {
            email: token?.email,
            ...user,
          };
        }
      }

      // Get Access Token
      if (new Date().getTime() < token?.expiresIn) return token;

      // const role = token?.role === "user" ? "user" : "admin";
      // return await getAccessToken(token, role);
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      };
    },
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {},
      async authorize(credentials: any) {
        const user = JSON.parse(credentials.userData);
        return user as any;
      },
    }),
  ],
};
