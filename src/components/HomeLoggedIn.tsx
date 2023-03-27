import { Button, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { IconBrandSpotify, IconPlayerPlay } from '@tabler/icons-react';
import { Session } from 'next-auth';

function HomeLoggedIn() {
  const { data: session, status } = useSession();

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <Stack align="center">
      <Title order={2}>Hi {session.user.email}, thank you for using Beat Piper</Title>
      <StartButtons session={session} />
    </Stack>
  );
}

function StartButtons({ session }: { session: Session }) {
  const { isLoading, isError, data, error, remove } = trpc.spotify.get.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: session.user !== undefined,
  });

  const logout = trpc.spotify.logout.useMutation({
    onMutate: remove,
  });

  if (isLoading) {
    return <Loader variant="dots" />;
  }

  if (isError) {
    return (
      <Group position="center">
        <Text>{error?.message}</Text>
      </Group>
    );
  }

  return (
    <Group>
      {data ? (
        <Button component={Link} href="/playlists" leftIcon={<IconPlayerPlay />}>
          Start Piping
        </Button>
      ) : (
        <Button leftIcon={<IconPlayerPlay />} disabled>
          Start Piping
        </Button>
      )}
      {data ? (
        <Button onClick={() => logout.mutate()} color="green" leftIcon={<IconBrandSpotify />}>
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
    </Group>
  );
}

export default HomeLoggedIn;
