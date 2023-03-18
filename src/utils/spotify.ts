import SpotifyWebApi from 'spotify-web-api-node';
import { User } from 'next-auth';
import { prisma } from '@/common/prisma';
import { SpotifyUser } from '@prisma/client';

export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/trpc/spotify.callback`,
});

const SPOTIFY_PAGINATION_LIMIT = 50;

export async function getSpotifyUser(userId: User['id']) {
  return prisma.spotifyUser.findFirst({
    where: { userId },
  });
}

export async function createOrUpdateSpotifyUser({
  accessToken,
  refreshToken,
  expiresAt,
  userId,
  spotifyId,
}: SpotifyUser) {
  return prisma.spotifyUser.upsert({
    where: { userId },
    update: {
      accessToken,
      refreshToken,
      expiresAt,
    },
    create: {
      accessToken,
      refreshToken,
      expiresAt,
      userId,
      spotifyId,
    },
  });
}

export async function grantSpotify(userId: User['id']) {
  const spotifyUser = await getSpotifyUser(userId);
  if (!spotifyUser) {
    throw new Error('Spotify user not found');
  }

  spotifyApi.setAccessToken(spotifyUser.accessToken);
  spotifyApi.setRefreshToken(spotifyUser.refreshToken);

  if (new Date() > spotifyUser.expiresAt) {
    const refreshedUser = await refreshSpotifyUser(spotifyUser);
    spotifyApi.setAccessToken(refreshedUser.accessToken);
    spotifyApi.setRefreshToken(refreshedUser.refreshToken);
    return refreshedUser;
  }

  return spotifyUser;
}

export async function refreshSpotifyUser(spotifyUser: SpotifyUser) {
  const { body } = await spotifyApi.refreshAccessToken();
  // TODO: handle error
  return await prisma.spotifyUser.update({
    where: { userId: spotifyUser.userId },
    data: {
      accessToken: body.access_token,
      refreshToken: body.refresh_token || spotifyUser.refreshToken,
      expiresAt: new Date(Date.now() + body.expires_in * 1000),
    },
  });
}

export async function deleteSpotifyUser(userId: User['id']) {
  return prisma.spotifyUser.delete({
    where: { userId },
  });
}

export async function getPlaylists(userId: User['id']) {
  const spotifyUser = await grantSpotify(userId);

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

    return { playlists, spotifyUser };
  }
}

type PlaylistTrackObjectPresent = SpotifyApi.PlaylistTrackObject & {
  track: NonNullable<SpotifyApi.PlaylistTrackObject['track']>;
  is_local: false;
};

export async function getPlaylistTracks(userId: User['id'], playlistId: string) {
  await grantSpotify(userId);

  const playlistTracks = await spotifyApi.getPlaylistTracks(playlistId, {
    limit: SPOTIFY_PAGINATION_LIMIT,
  });

  if (playlistTracks.statusCode === 200) {
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
}
