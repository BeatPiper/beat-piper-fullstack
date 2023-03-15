import { Button, Group } from '@mantine/core';
import { IconLogin, IconLogout, IconUserPlus } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

function AuthButtons() {
  const session = useSession();
  const router = useRouter();
  const auth = useMemo(() => {
    return router.pathname === '/sign-up' || router.pathname === '/log-in';
  }, [router.pathname]);

  return session.status === 'authenticated' ? (
    <Button onClick={() => signOut({ redirect: false })} leftIcon={<IconLogout />}>
      Logout
    </Button>
  ) : (
    <Group noWrap>
      {!auth && (
        <>
          <Button component={Link} href="/sign-up" leftIcon={<IconUserPlus />}>
            Sign up
          </Button>
          <Button component={Link} href="/log-in" leftIcon={<IconLogin />}>
            Log In
          </Button>
        </>
      )}
    </Group>
  );
}

export default AuthButtons;
