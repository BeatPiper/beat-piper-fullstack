import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';

import { prisma } from '@/server/prisma';
import { nextAuthOptions } from '@/server/auth';

export async function createContext({ req, res }: CreateNextContextOptions) {
  const session = await getServerSession(req, res, nextAuthOptions);

  return {
    req,
    res,
    session,
    prisma,
  };
}

export type IContext = inferAsyncReturnType<typeof createContext>;
