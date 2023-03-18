import { useRouter } from 'next/router';
import Head from 'next/head';
import { trpc } from '@/utils/trpc';
import {
  Alert,
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  createStyles,
  Group,
  HoverCard,
  Image,
  Loader,
  ScrollArea,
  SegmentedControl,
  Spoiler,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconArchive,
  IconArrowBack,
  IconCheck,
  IconChecklist,
  IconChecks,
  IconInfoCircle,
  IconListDetails,
  IconMusic,
  IconSquare,
  IconSquareCheck,
  IconUser,
  IconX,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { matchTracks } from '@/utils/beatsaver';
import { useListState } from '@mantine/hooks';

const useStyles = createStyles(theme => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    zIndex: 2,

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`,
    },
  },
}));

function Playlist() {
  return (
    <>
      <Head>
        <title>Playlist</title>
      </Head>
      <PlaylistTable />
    </>
  );
}

function PlaylistTable() {
  const { classes } = useStyles();
  const router = useRouter();
  const id = router.query.id as string;

  const { isLoading, isError, data, error } = trpc.spotify.playlist.useQuery(
    { playlistId: id },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const [selectedMaps, handlers] = useListState<string>([]);
  const [matchedTracks, setMatchedTracks] = useState<Awaited<ReturnType<typeof matchTracks>>>(null);

  useEffect(() => {
    (async () => {
      setMatchedTracks(null);
      if (data) {
        const tracks = data.map(x => x.track);
        const matched = await matchTracks({ tracks });
        setMatchedTracks(matched);
      }
    })();
  }, [data]);

  const noMapsFound = useMemo(() => {
    return matchedTracks?.every(({ maps }) => !maps.length) ?? true;
  }, [matchedTracks]);

  const noTrackWithMultipleMaps = useMemo(() => {
    return matchedTracks?.every(({ maps }) => maps.length < 2) ?? false;
  }, [matchedTracks]);

  // Map selector functions
  function selectNoMaps() {
    handlers.setState(() => []);
  }

  function selectFirstMap() {
    selectNoMaps();
    matchedTracks?.forEach(({ maps }) => {
      if (maps.length) {
        handlers.append(maps[0].id);
      }
    });
  }

  function selectAllMaps() {
    selectNoMaps();
    matchedTracks?.forEach(({ maps }) => {
      if (maps.length) {
        handlers.append(...maps.map(map => map.id));
      }
    });
  }

  // Map selector queries
  const everyFirstChecked = useMemo(() => {
    return (
      matchedTracks?.every(({ maps }) => {
        if (maps.length) {
          // first map has to be selected, others need to be unchecked
          return maps.every((map, idx) =>
            idx === 0 ? selectedMaps.includes(map.id) : !selectedMaps.includes(map.id)
          );
        }

        return true;
      }) ?? false
    );
  }, [matchedTracks, selectedMaps]);

  const allChecked = useMemo(() => {
    return (
      matchedTracks?.every(({ maps }) => {
        return maps.every(map => selectedMaps.includes(map.id));
      }) ?? false
    );
  }, [matchedTracks, selectedMaps]);

  const noneChecked = useMemo(() => !selectedMaps.length, [selectedMaps]);

  if (isLoading) {
    return (
      <Stack align="center">
        <Image src="/logo.png" height={250} fit="contain" alt="Logo" />
        <Title>Fetching playlist...</Title>
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

  if (!matchedTracks) {
    // TODO: show progress
    return (
      <Stack align="center">
        <Image src="/logo.png" height={250} fit="contain" alt="Logo" />
        <Title>Piping...</Title>
        <Loader size="xl" variant="bars" mt="xl" />
      </Stack>
    );
  }

  return (
    <Stack>
      <Group grow>
        <Button component={Link} href="/playlists" leftIcon={<IconArrowBack />} color="gray">
          Back to playlists
        </Button>
        <Button type="submit" leftIcon={<IconArchive />} disabled={!selectedMaps.length}>
          Download as archive (.zip)
        </Button>
        <Button type="submit" leftIcon={<IconListDetails />} disabled={!selectedMaps.length}>
          Download as playlist (.bplist)
        </Button>
      </Group>
      <Group position="center" noWrap>
        {noMapsFound ? (
          <Alert icon={<IconAlertCircle />} color="orange">
            Unfortunately, no maps were found for any of the tracks in this playlist.
          </Alert>
        ) : (
          <>
            <Text>Selected maps</Text>
            <SegmentedControl
              value={noneChecked ? 'none' : allChecked ? 'all' : everyFirstChecked ? 'first' : 'custom'}
              onChange={type => {
                if (type === 'none') {
                  selectNoMaps();
                } else if (type === 'first') {
                  selectFirstMap();
                } else if (type === 'all') {
                  selectAllMaps();
                }
              }}
              data={[
                {
                  label: (
                    <Center>
                      <IconSquare size={16} />
                      <Box ml={10}>None</Box>
                    </Center>
                  ),
                  value: 'none',
                },
                {
                  label: (
                    <Center>
                      <IconSquareCheck size={16} />
                      <Box ml={10}>First</Box>
                    </Center>
                  ),
                  value: 'first',
                  disabled: noTrackWithMultipleMaps,
                },
                {
                  label: (
                    <Center>
                      <IconChecks size={16} />
                      <Box ml={10}>All</Box>
                    </Center>
                  ),
                  value: 'all',
                },
                {
                  label: (
                    <Center>
                      <IconChecklist size={16} />
                      <Box ml={10}>Custom</Box>
                    </Center>
                  ),
                  value: 'custom',
                  disabled: true,
                },
              ]}
            />
          </>
        )}
      </Group>
      <ScrollArea sx={{ height: 'calc(100vh - 210px)', width: '100%' }} type="auto">
        <Table>
          <thead className={classes.header}>
            <tr>
              <th>Track</th>
              <th>Artist</th>
              <th>Map(s)</th>
            </tr>
          </thead>
          <tbody>
            {matchedTracks.map(({ track, maps }) => (
              <tr key={track.id}>
                <td>
                  <Group>
                    {track.album.images && track.album.images.length ? (
                      <Avatar src={track.album.images[0].url} alt="Track image" />
                    ) : (
                      <Avatar alt="Track image">
                        <IconMusic />
                      </Avatar>
                    )}
                    <Text>{track.name}</Text>
                  </Group>
                </td>
                <td>
                  <Group>
                    {track.artists.map(artist => (
                      <Anchor key={artist.id} href={artist.uri}>
                        <Group>
                          <Avatar alt="Artist image">
                            <IconUser />
                          </Avatar>
                          <Text>{artist.name}</Text>
                        </Group>
                      </Anchor>
                    ))}
                  </Group>
                </td>
                <td>
                  {maps.length ? (
                    <Spoiler maxHeight={100} showLabel="Show more" hideLabel="Hide">
                      <Stack>
                        {maps.map(map => (
                          <Group key={map.id} spacing="xs">
                            <Checkbox
                              value={map.id}
                              label={map.name}
                              checked={selectedMaps.includes(map.id)}
                              onChange={() => {
                                if (selectedMaps.includes(map.id)) {
                                  handlers.filter(id => id !== map.id);
                                } else {
                                  handlers.append(map.id);
                                }
                              }}
                            />
                            <HoverCard
                              key={map.id}
                              width={350}
                              shadow="md"
                              withArrow
                              position="top-start"
                              // openDelay={200}
                              withinPortal
                            >
                              <HoverCard.Target>
                                <IconInfoCircle size={16} />
                              </HoverCard.Target>
                              <HoverCard.Dropdown>
                                <Stack spacing={1}>
                                  {map.versions && map.versions.length > 0 && (
                                    <Group spacing="sm" noWrap>
                                      <Text weight="bold">Difficulties</Text>
                                      <Group spacing={5}>
                                        {map.versions[0].diffs.map(diff => (
                                          <Badge key={diff.difficulty} size="sm">
                                            {diff.difficulty}
                                          </Badge>
                                        ))}
                                      </Group>
                                    </Group>
                                  )}
                                  {map.description && (
                                    <Group spacing={1}>
                                      <Text weight="bold">Description</Text>
                                      <Spoiler maxHeight={50} showLabel="Show more" hideLabel="Hide">
                                        <Text>{map.description}</Text>
                                      </Spoiler>
                                    </Group>
                                  )}
                                  <Group spacing="sm">
                                    <Text weight="bold">Ranked</Text>
                                    {map.ranked ? (
                                      <IconCheck color="green" size={16} />
                                    ) : (
                                      <IconX color="red" size={16} />
                                    )}
                                  </Group>
                                  <Group spacing="sm">
                                    <Text weight="bold">Automapper</Text>
                                    {map.automapper ? (
                                      <IconCheck color="green" size={16} />
                                    ) : (
                                      <IconX color="red" size={16} />
                                    )}
                                  </Group>
                                  {map.tags && map.tags.length > 0 && (
                                    <Group spacing="sm" noWrap>
                                      <Text weight="bold">Tags</Text>
                                      <Group spacing={5}>
                                        {map.tags.map(tag => (
                                          <Badge key={tag} size="xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </Group>
                                    </Group>
                                  )}
                                </Stack>
                              </HoverCard.Dropdown>
                            </HoverCard>
                          </Group>
                        ))}
                      </Stack>
                    </Spoiler>
                  ) : (
                    <Text>No maps found for this track</Text>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    </Stack>
  );
}

export default Playlist;
