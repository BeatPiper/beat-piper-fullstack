import { getServerSession, type NextAuthOptions } from 'next-auth';
import { prisma } from '@/server/prisma';
import type { GetServerSidePropsContext } from 'next';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import SpotifyProvider from 'next-auth/providers/spotify';
import { env } from '@/env.mjs';

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      authorization:
        'https://accounts.spotify.com/authorize?scope=user-read-email+playlist-read-private+playlist-read-collaborative&show_dialog=true',
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.userId = user.id;
        session.user.email = user.email;
        session.user.role = user.role;
      }

      return session;
    },
  },
  pages: {
    signIn: '/log-in',
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, nextAuthOptions);
};
