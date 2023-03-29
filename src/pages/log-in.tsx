import { Alert, Badge, Button, Card, Group, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { IconAlertCircle, IconBrandGoogle, IconBrandSpotify } from '@tabler/icons-react';
import Head from 'next/head';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

function LogIn() {
  const { query } = useRouter();
  const theme = useMantineTheme();

  return (
    <>
      <Head>
        <title>Log in</title>
      </Head>
      <Group position="center">
        <Card radius="lg" p="xl" withBorder style={{ minWidth: 400 }}>
          <Stack spacing="sm">
            <Stack spacing={2}>
              <Title order={2}>Welcome</Title>
              <Text color={theme.colors.gray[5]}>Please choose your provider to continue</Text>
            </Stack>

            {query.error && (
              <Alert color="red" title="Error" icon={<IconAlertCircle />}>
                {query.error}
              </Alert>
            )}

            <Button
              leftIcon={<IconBrandSpotify />}
              variant="outline"
              color="green"
              fullWidth
              onClick={() => signIn('spotify', { callbackUrl: (query.callbackUrl as string) || '/' })}
            >
              Log in with Spotify
            </Button>
            <Button leftIcon={<IconBrandGoogle />} variant="outline" color="gray" fullWidth>
              <Group spacing="xs">
                Log in with Google
                <Badge variant="light" size="sm">
                  Soon
                </Badge>
              </Group>
            </Button>
          </Stack>
        </Card>
      </Group>
    </>
  );
}

export default LogIn;
