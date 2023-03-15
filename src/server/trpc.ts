import { initTRPC } from '@trpc/server';
import { IContext } from '@/server/context';

const t = initTRPC.context<IContext>().create();

export const router = t.router;
export const procedure = t.procedure;
