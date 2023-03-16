import { Button } from '@mantine/core';
import { IconBrandSpotify } from '@tabler/icons-react';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';

// TODO: type spotifyQuery
function SpotifyLogin({ spotifyQuery }: { spotifyQuery: any }) {
  const logout = trpc.spotify.logout.useMutation();

  return (
    <>
      {spotifyQuery.data ? (
        <Button
          onClick={async () => {
            await logout.mutateAsync();
            spotifyQuery.refetch();
          }}
          color="green"
          leftIcon={<IconBrandSpotify />}
        >
          Log out Spotify
        </Button>
      ) : (
        <Button
          component={Link}
          href="/api/trpc/spotify.auth"
          color="green"
          leftIcon={<IconBrandSpotify />}
        >
          Login with Spotify
        </Button>
      )}
    </>
  );
}

export default SpotifyLogin;
