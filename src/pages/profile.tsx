import {
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { signOut, useSession } from 'next-auth/react';
import { IconCircleX, IconTrash } from '@tabler/icons-react';
import PageTitle from '@/components/PageTitle';
import { trpc } from '@/utils/trpc';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';

function ProfilePage() {
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const router = useRouter();

  const [opened, { open, close }] = useDisclosure(false);
  const deleteAccountMutation = trpc.deleteUser.useMutation();

  if (status !== 'authenticated') {
    return null;
  }

  const deleteAccount = async () => {
    await deleteAccountMutation.mutateAsync();
    await signOut({ redirect: false });
    await router.push('/');
  };

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

            <Modal
              opened={opened}
              onClose={close}
              title="Delete account"
              centered
              overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
              }}
            >
              <Stack spacing="sm">
                <Text>Are you sure you want to delete your account?</Text>
                <Group spacing="sm" grow>
                  <Button onClick={close} leftIcon={<IconCircleX />}>
                    Cancel
                  </Button>
                  <Button
                    color="red"
                    loading={deleteAccountMutation.isLoading}
                    leftIcon={<IconTrash />}
                    onClick={() => deleteAccount()}
                  >
                    Delete
                  </Button>
                </Group>
              </Stack>
            </Modal>

            <Stack spacing="sm">
              <TextInput label="Name" value={session.user.name ?? ''} readOnly />
              <TextInput label="Email" value={session.user.email ?? ''} disabled />
              <Button variant="outline" color="red" fullWidth onClick={open} leftIcon={<IconTrash />}>
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
