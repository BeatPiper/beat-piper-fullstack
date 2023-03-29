import { protectedProcedure, router } from '@/server/trpc';
import {
  getPlaylistTracks,
  getPlaylists,
  getSpotifyUser,
  getPlaylistDetails,
  grantSpotify,
} from '@/utils/spotify';
import z from 'zod';
import { urlContentToDataUri } from '@/utils/image';
import { filterAccountForClient } from '@/server/helpers/filterAccountForClient';

export const spotifyRouter = router({
  get: protectedProcedure.query(async ({ ctx: { session } }) => {
    const {
      user: { userId },
    } = session;

    const spotifyUser = await getSpotifyUser(userId);
    return spotifyUser ? filterAccountForClient(spotifyUser) : null;
  }),
  playlists: protectedProcedure.query(async ({ ctx: { session } }) => {
    const spotifyUser = filterAccountForClient(await grantSpotify(session.user.userId));
    // TODO: implement pagination
    const playlists = await getPlaylists();

    return { playlists, spotifyUser };
  }),
  playlist: protectedProcedure
    .input(
      z.object({
        playlistId: z.string(),
      })
    )
    .query(async ({ input, ctx: { session } }) => {
      await grantSpotify(session.user.userId);
      const { playlistId } = input;

      // TODO: implement pagination
      const tracks = await getPlaylistTracks(playlistId);
      const details = await getPlaylistDetails(playlistId);

      const image = details.images.length ? await urlContentToDataUri(details.images[0].url) : null;

      return { tracks, details, image };
    }),
});
