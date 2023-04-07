import { protectedProcedure, router } from '../trpc';
import { spotifyRouter } from '@/server/routers/spotify';

export const appRouter = router({
  spotify: spotifyRouter,
  deleteUser: protectedProcedure.mutation(async ({ ctx: { session, prisma } }) => {
    await prisma.user.delete({
      where: {
        id: session.user.userId,
      },
    });
    return true;
  }),
});

export type AppRouter = typeof appRouter;
