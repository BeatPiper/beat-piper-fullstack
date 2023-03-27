import { Image, Stack, Text, Title, useMantineTheme } from '@mantine/core';

function HomeLoggedOut() {
  const theme = useMantineTheme();

  return (
    <Stack align="center">
      <Image src="/logo.png" alt="Logo" height={250} fit="contain" />
      <Title order={1}>Beat Piper</Title>
      <Text color={theme.colors.gray[5]}>Play your Spotify collection in Beat Saber now!</Text>
    </Stack>
  );
}

export default HomeLoggedOut;
