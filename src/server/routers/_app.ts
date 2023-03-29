import { router } from '../trpc';
import { spotifyRouter } from '@/server/routers/spotify';

export const appRouter = router({
  spotify: spotifyRouter,
});

export type AppRouter = typeof appRouter;
