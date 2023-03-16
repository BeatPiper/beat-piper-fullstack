import SpotifyWebApi from 'spotify-web-api-node';
import { User } from 'next-auth';
import { prisma } from '@/common/prisma';
import { SpotifyUser } from '@prisma/client';

export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/trpc/spotify.callback`,
});

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
  }
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
