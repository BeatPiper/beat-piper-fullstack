import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';

import { prisma } from '@/common/prisma';
import { nextAuthOptions } from '@/common/auth';

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
