import { procedure, router } from '@/server/trpc';
import {
  createOrUpdateSpotifyUser,
  deleteSpotifyUser,
  getSpotifyUser,
  grantSpotify,
  spotifyApi,
} from '@/utils/spotify';
import { inferRouterInputs } from '@trpc/server';

const SPOTIFY_PAGINATION_LIMIT = 50;

export const spotifyRouter = router({
  get: procedure.query(async ({ ctx: { session, res } }) => {
    if (!session) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    const {
      user: { userId },
    } = session;

    return await getSpotifyUser(userId);
  }),
  auth: procedure.query(async ({ ctx: { session, res } }) => {
    if (!session) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    // required Spotify API scopes to read playlists
    const scopes = ['playlist-read-private', 'playlist-read-collaborative'];
    // generate a random string for the state
    const state = Math.random().toString(36).slice(2);

    return res.redirect(spotifyApi.createAuthorizeURL(scopes, state, true));
  }),
  logout: procedure.mutation(async ({ ctx: { session, res } }) => {
    if (!session) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
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
  callback: procedure.query(async ({ ctx: { session, req, res } }) => {
    if (!session) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    const {
      user: { userId },
    } = session;

    const { code, state } = req.query;
    if (typeof code !== 'string' || typeof state !== 'string') {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    const { body, statusCode } = await spotifyApi.authorizationCodeGrant(code);
    if (statusCode === 200) {
      const { access_token: accessToken, refresh_token: refreshToken, expires_in } = body;

      await createOrUpdateSpotifyUser({
        accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + expires_in * 1000),
        userId,
      });

      return res.redirect('/'); // TODO: redirect to previous page
    } else {
      return res.status(200).json({ error: `Spotify returned ${statusCode}` });
    }
  }),
  playlists: procedure.query(async ({ ctx: { session, res } }) => {
    if (!session) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    await grantSpotify(session.user.userId);

    const playlistsResponse = await spotifyApi.getUserPlaylists({ limit: SPOTIFY_PAGINATION_LIMIT });

    if (playlistsResponse.statusCode === 200) {
      const start = playlistsResponse.body;
      const playlists = start.items;

      let offset = SPOTIFY_PAGINATION_LIMIT;
      while (playlists.length < start.total) {
        playlists.push(
          ...(await spotifyApi.getUserPlaylists({ offset, limit: SPOTIFY_PAGINATION_LIMIT })).body.items
        );
        offset += SPOTIFY_PAGINATION_LIMIT;
      }

      return playlists;
    }
  }),
});
