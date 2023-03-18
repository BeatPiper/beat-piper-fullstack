import { trpc } from '@/utils/trpc';
import Head from 'next/head';
import { Anchor, Avatar, Button, Group, Image, Loader, Stack, Table, Text, Title } from '@mantine/core';
import { IconMusic, IconTestPipe, IconUser, IconHome } from '@tabler/icons-react';
import Link from 'next/link';

function Playlists() {
  return (
    <>
      <Head>
        <title>Playlists</title>
      </Head>
      <Stack>
        <Group grow>
          <Button component={Link} href="/" leftIcon={<IconHome />} color="gray">
            Home
          </Button>
        </Group>
        <PlaylistTable />
      </Stack>
    </>
  );
}

function PlaylistTable() {
  const { isLoading, isError, data, error } = trpc.spotify.playlists.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <Stack align="center">
        <Image src="/logo.png" height={250} fit="contain" alt="Logo" />
        <Title>Getting your saved playlists...</Title>
        <Loader size="xl" mt="xl" />
      </Stack>
    );
  }

  if (isError) {
    return (
      <Group position="center">
        <Text>{error?.message}</Text>
      </Group>
    );
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Playlist</th>
          <th>Author</th>
          <th>Tracks</th>
          <th>Select</th>
        </tr>
      </thead>
      <tbody>
        {data.map(playlist => (
          <tr key={playlist.id}>
            <td>
              <Group>
                {playlist.images && playlist.images.length ? (
                  <Avatar src={playlist.images[0].url} alt="Playlist image" />
                ) : (
                  <Avatar alt="Playlist image">
                    <IconMusic />
                  </Avatar>
                )}
                <Text>{playlist.name}</Text>
              </Group>
            </td>
            <td>
              <Anchor href={playlist.owner.uri}>
                <Group>
                  {playlist.owner.images && playlist.owner.images.length ? (
                    <Avatar src={playlist.owner.images[0].url} alt="User image" />
                  ) : (
                    <Avatar alt={playlist.name}>
                      <IconUser />
                    </Avatar>
                  )}
                  <Text>{playlist.owner.display_name}</Text>
                </Group>
              </Anchor>
            </td>
            <td>
              <Text>{playlist.tracks.total}</Text>
            </td>
            <td>
              <Button component={Link} href={`/playlist/${playlist.id}`} leftIcon={<IconTestPipe />}>
                Start piping
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default Playlists;
