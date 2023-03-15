import NextAuth, { DefaultSession, JWT } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      userId: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
  }
}
