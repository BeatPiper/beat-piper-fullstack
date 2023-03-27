import { Button, Group, Stack, Title } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { IconPlayerPlay } from '@tabler/icons-react';
import SpotifyLogin from '@/components/SpotifyLogin';

function HomeLoggedIn() {
  const { data: session, status } = useSession();

  const spotifyQuery = trpc.spotify.get.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <Stack>
      <Title order={2}>Hi {session.user.email}, thank you for using Beat Piper</Title>
      {spotifyQuery.isSuccess && (
        <Group>
          {spotifyQuery.data ? (
            <Button component={Link} href="/playlists" leftIcon={<IconPlayerPlay />}>
              Start Piping
            </Button>
          ) : (
            <Button leftIcon={<IconPlayerPlay />} disabled>
              Start Piping
            </Button>
          )}
          <SpotifyLogin spotifyQuery={spotifyQuery} />
        </Group>
      )}
    </Stack>
  );
}

export default HomeLoggedIn;
