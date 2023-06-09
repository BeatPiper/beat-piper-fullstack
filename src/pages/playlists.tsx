import { trpc } from '@/utils/trpc';
import { Card, Checkbox, Group, Image, Loader, Stack, Table, Text, Title } from '@mantine/core';
import { IconUserCog } from '@tabler/icons-react';
import PlaylistRow from '@/components/PlaylistRow';
import { useMemo, useState } from 'react';
import PageTitle from '@/components/app/PageTitle';

function Playlists() {
  return (
    <>
      <PageTitle title="Playlists" />
      <PlaylistTable />
    </>
  );
}

function PlaylistTable() {
  const [onlyOwn, setOnlyOwn] = useState(false);

  const { isLoading, isError, data, error } = trpc.spotify.playlists.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const shownPlaylists = useMemo(() => {
    if (!data) {
      return [];
    }
    if (!onlyOwn) {
      return data.playlists;
    }
    return data.playlists.filter(playlist => playlist.owner.id === data.spotifyUser.providerAccountId);
  }, [data, onlyOwn]);

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
    <Stack>
      <Group position="center">
        <Card radius="md">
          <Checkbox
            checked={onlyOwn}
            onChange={event => setOnlyOwn(event.currentTarget.checked)}
            label={
              <Group align="center">
                <IconUserCog /> Only show playlists created by me
              </Group>
            }
          />
        </Card>
      </Group>
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
          {shownPlaylists.map(playlist => (
            <PlaylistRow key={playlist.id} playlist={playlist} />
          ))}
        </tbody>
      </Table>
    </Stack>
  );
}

export default Playlists;
