import { routes } from '@/config/routes';
import getAccessToken from '@/utils/axios/getAccessToken';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: routes.retailer.login,
    error: routes.retailer.login,
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30, // Expire in 30 Days
  },
  callbacks: {
    async jwt(data: any) {
      if (data?.account?.provider === 'credentials') {
        if (data?.user) {
          return {
            email: data?.token?.email,
            ...data?.user,
          };
        }
      }
      if (data?.trigger === 'update') {
        if (data.session) {
          return data.session;
        }
      }

      // Get Access Token
      if (new Date().getTime() < data?.token?.expiresIn) return data?.token;

      return await getAccessToken(data?.token);
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
