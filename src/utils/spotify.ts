import SpotifyWebApi from 'spotify-web-api-node';
import { type User } from 'next-auth';
import { prisma } from '@/server/prisma';
import { type Account } from '@prisma/client';
import { env } from '@/env.mjs';
import { TRPCError } from '@trpc/server';

export const spotifyApi = new SpotifyWebApi({
  clientId: env.SPOTIFY_CLIENT_ID,
  clientSecret: env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `${env.NEXTAUTH_URL || 'http://localhost:3000'}/api/trpc/spotify.callback`,
});

const SPOTIFY_PAGINATION_LIMIT = 50;

export async function getSpotifyUser(userId: User['id']) {
  return prisma.account.findFirst({
    where: { userId, provider: 'spotify' },
  });
}

export async function grantSpotify(userId: User['id']) {
  const spotifyUser = await getSpotifyUser(userId);
  if (!spotifyUser) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Spotify user not found' });
  }

  if (!spotifyUser.access_token || !spotifyUser.refresh_token || spotifyUser.expires_at === null) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Spotify user not authorized' });
  }

  spotifyApi.setAccessToken(spotifyUser.access_token);
  spotifyApi.setRefreshToken(spotifyUser.refresh_token);

  if (Date.now() > spotifyUser.expires_at * 1000) {
    const refreshedUser = await refreshSpotifyUser(spotifyUser);

    if (!refreshedUser.access_token || !refreshedUser.refresh_token) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Spotify user not authorized' });
    }

    spotifyApi.setAccessToken(refreshedUser.access_token);
    spotifyApi.setRefreshToken(refreshedUser.refresh_token);
    return refreshedUser;
  }

  return spotifyUser;
}

export async function refreshSpotifyUser(spotifyUser: Account) {
  const { body } = await spotifyApi.refreshAccessToken();
  // TODO: handle error
  return await prisma.account.update({
    where: { id: spotifyUser.id },
    data: {
      access_token: body.access_token,
      refresh_token: body.refresh_token || spotifyUser.refresh_token,
      expires_at: Math.floor(Date.now() / 1000 + body.expires_in),
    },
  });
}

export async function getPlaylists() {
  const playlistsResponse = await spotifyApi.getUserPlaylists({ limit: SPOTIFY_PAGINATION_LIMIT });

  if (playlistsResponse.statusCode !== 200) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Spotify returned ${playlistsResponse.statusCode}`,
    });
  }

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

type PlaylistTrackObjectPresent = SpotifyApi.PlaylistTrackObject & {
  track: NonNullable<SpotifyApi.PlaylistTrackObject['track']>;
  is_local: false;
};

export async function getPlaylistTracks(playlistId: string) {
  const playlistTracks = await spotifyApi.getPlaylistTracks(playlistId, {
    limit: SPOTIFY_PAGINATION_LIMIT,
  });

  if (playlistTracks.statusCode !== 200) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Spotify returned ${playlistTracks.statusCode}`,
    });
  }

  const start = playlistTracks.body;
  const tracks = start.items;

  let offset = SPOTIFY_PAGINATION_LIMIT;
  while (tracks.length < start.total) {
    tracks.push(
      ...(await spotifyApi.getPlaylistTracks(playlistId, { offset, limit: SPOTIFY_PAGINATION_LIMIT }))
        .body.items
    );
    offset += SPOTIFY_PAGINATION_LIMIT;
  }

  // filter local tracks
  return tracks.filter(
    (track): track is PlaylistTrackObjectPresent => track.track !== null && !track.is_local
  );
}

export async function getPlaylistDetails(playlistId: string) {
  const playlistDetails = await spotifyApi.getPlaylist(playlistId);

  if (playlistDetails.statusCode !== 200) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Spotify returned ${playlistDetails.statusCode}`,
    });
  }

  return playlistDetails.body;
}
