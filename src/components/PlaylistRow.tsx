import React from 'react';
import { Anchor, Button, Group, Text } from '@mantine/core';
import { IconTestPipe } from '@tabler/icons-react';
import Link from 'next/link';
import PlaylistCover from '@/components/image/PlaylistCover';
import PlaylistOwnerImage from '@/components/image/PlaylistOwnerImage';

function PlaylistRow({ playlist }: { playlist: SpotifyApi.PlaylistObjectSimplified }) {
  return (
    <tr>
      <td>
        <Group>
          <PlaylistCover playlist={playlist} />
          <Text>{playlist.name}</Text>
        </Group>
      </td>
      <td>
        <Anchor href={playlist.owner.uri}>
          <Group>
            <PlaylistOwnerImage playlist={playlist} />
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
  );
}

export default PlaylistRow;
