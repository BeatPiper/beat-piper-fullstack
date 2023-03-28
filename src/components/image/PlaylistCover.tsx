import Image from 'next/image';
import { Avatar } from '@mantine/core';
import { IconMusic } from '@tabler/icons-react';
import React from 'react';

function PlaylistCover({ playlist }: { playlist: SpotifyApi.PlaylistObjectSimplified }) {
  if (playlist.images && playlist.images.length) {
    return <Image src={playlist.images[0].url} alt="Playlist image" width={38} height={38} />;
  } else {
    return (
      <Avatar alt="Playlist image">
        <IconMusic />
      </Avatar>
    );
  }
}

export default PlaylistCover;
