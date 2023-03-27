import { protectedProcedure, router } from '@/server/trpc';
import {
  createOrUpdateSpotifyUser,
  deleteSpotifyUser,
  getPlaylistTracks,
  getPlaylists,
  getSpotifyUser,
  spotifyApi,
  getPlaylistDetails,
} from '@/utils/spotify';
import z from 'zod';

export const spotifyRouter = router({
  get: protectedProcedure.query(async ({ ctx: { session } }) => {
    const {
      user: { userId },
    } = session;

    return await getSpotifyUser(userId);
  }),
  auth: protectedProcedure.query(async ({ ctx: { res } }) => {
    // required Spotify API scopes to read playlists
    const scopes = ['playlist-read-private', 'playlist-read-collaborative'];
    // generate a random string for the state
    const state = Math.random().toString(36).slice(2);

    return res.redirect(spotifyApi.createAuthorizeURL(scopes, state, true));
  }),
  logout: protectedProcedure.mutation(async ({ ctx: { session } }) => {
    const {
      user: { userId },
    } = session;

    try {
      await deleteSpotifyUser(userId);
      return { status: 200, message: 'Successfully logged out of Spotify' };
    } catch (err) {
      return { status: 200, message: 'Spotify not connected' };
    }
  }),
  callback: protectedProcedure.query(async ({ ctx: { session, req, res } }) => {
    const {
      user: { userId },
    } = session;

    const { code, state } = req.query;
    if (typeof code !== 'string' || typeof state !== 'string') {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }
    // TODO: validate state

    const { body, statusCode } = await spotifyApi.authorizationCodeGrant(code);
    if (statusCode === 200) {
      const { access_token: accessToken, refresh_token: refreshToken, expires_in } = body;

      spotifyApi.setAccessToken(accessToken);
      spotifyApi.setRefreshToken(refreshToken);
      const me = await spotifyApi.getMe();

      if (me.statusCode !== 200) {
        return res.status(500).json({ error: `Spotify returned ${me.statusCode}` });
      }

      await createOrUpdateSpotifyUser({
        accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + expires_in * 1000),
        userId,
        spotifyId: me.body.id,
      });

      return res.redirect('/'); // TODO: redirect to previous page
    } else {
      return res.status(500).json({ error: `Spotify returned ${statusCode}` });
    }
  }),
  playlists: protectedProcedure.query(async ({ ctx: { session } }) => {
    // TODO: implement pagination
    return getPlaylists(session.user.userId);
  }),
  playlist: protectedProcedure
    .input(
      z.object({
        playlistId: z.string(),
      })
    )
    .query(async ({ input, ctx: { session } }) => {
      const { playlistId } = input;

      // TODO: implement pagination
      const tracks = await getPlaylistTracks(session.user.userId, playlistId);
      const details = await getPlaylistDetails(session.user.userId, playlistId);

      return { tracks, details };
    }),
});
