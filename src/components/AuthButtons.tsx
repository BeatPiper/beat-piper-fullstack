import { Avatar, Button, Group, Menu, UnstyledButton } from '@mantine/core';
import { IconLogin, IconLogout, IconUser, IconUserCog } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

function AuthButtons() {
  const session = useSession();
  const router = useRouter();
  const isOnAuthRoute = useMemo(() => {
    return router.pathname === '/log-in';
  }, [router.pathname]);

  if (session.status === 'authenticated') {
    return (
      <Menu shadow="md" width={200} transitionProps={{ transition: 'pop-top-right' }}>
        <Menu.Target>
          <Avatar radius="xl" src={session.data.user.image} component={UnstyledButton}>
            <IconUser />
          </Avatar>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Account</Menu.Label>
          <Menu.Item icon={<IconUserCog size={14} />} component={Link} href="/profile">
            Manage
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Actions</Menu.Label>
          <Menu.Item icon={<IconLogout size={14} />} onClick={() => signOut({ redirect: false })}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }

  if (isOnAuthRoute) {
    return null;
  }

  return (
    <Group noWrap>
      <Button component={Link} href="/log-in" leftIcon={<IconLogin />}>
        Log In
      </Button>
    </Group>
  );
}

export default AuthButtons;
