import {
  Alert,
  Anchor,
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
import {
  IconCirclePlus,
  IconCircleX,
  IconSettingsPlus,
  IconTrash,
  IconUserPlus,
} from '@tabler/icons-react';
import PageTitle from '@/components/app/PageTitle';
import { trpc } from '@/utils/trpc';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';
import Link from 'next/link';

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

            {session?.user.role === 'PLUS' ? (
              <Alert
                icon={<IconCirclePlus size="1rem" color="green" />}
                title="You are a Beat Piper Plus member!"
                color="dark"
                radius="lg"
                variant="filled"
              >
                <Anchor color={theme.colors.gray[5]} component={Link} href="/plus">
                  <Group spacing="xs">
                    <IconSettingsPlus />
                    <Text>Manage your subscription</Text>
                  </Group>
                </Anchor>
              </Alert>
            ) : (
              <Alert
                icon={<IconCirclePlus size="1rem" color="red" />}
                title="You don't have Beat Piper Plus!"
                color="dark"
                radius="lg"
                variant="filled"
              >
                <Anchor color={theme.colors.gray[5]} component={Link} href="/plus">
                  <Group spacing="xs">
                    <IconUserPlus />
                    <Text>Upgrade to Beat Piper Plus now</Text>
                  </Group>
                </Anchor>
              </Alert>
            )}

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
              <TextInput label="Name" value={session?.user.name ?? ''} readOnly />
              <TextInput label="Email" value={session?.user.email ?? ''} disabled />
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
