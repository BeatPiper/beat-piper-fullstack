import { Button, Card, Group, Stack, Text, TextInput, Title, useMantineTheme } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { IconTrash } from '@tabler/icons-react';
import PageTitle from '@/components/PageTitle';

function ProfilePage() {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <>
      <PageTitle title="My Account" />
      <Group position="center">
        <Card radius="lg" p="xl" withBorder style={{ minWidth: 400 }}>
          <Stack spacing="sm">
            <Stack spacing={2}>
              <Title order={2}>Welcome</Title>
              <Text color={theme.colors.gray[5]}>Manage your account here</Text>
            </Stack>

            <Stack spacing="sm">
              <TextInput label="Name" value={session.user.name ?? ''} readOnly />
              <TextInput label="Email" value={session.user.email ?? ''} disabled />
              <Button variant="outline" color="red" fullWidth leftIcon={<IconTrash />}>
                Delete my account
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Group>
    </>
  );
}

export default ProfilePage;
