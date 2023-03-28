import { Avatar } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import React from 'react';

function PlaylistOwnerImage({ playlist }: { playlist: SpotifyApi.PlaylistObjectSimplified }) {
  if (playlist.owner.images && playlist.owner.images.length) {
    return <Avatar src={playlist.owner.images[0].url} alt="User image" />;
  } else {
    return (
      <Avatar alt={playlist.name}>
        <IconUser />
      </Avatar>
    );
  }
}

export default PlaylistOwnerImage;
