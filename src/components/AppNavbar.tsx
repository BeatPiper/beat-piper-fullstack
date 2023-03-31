import { Button, type ButtonProps, createPolymorphicComponent, Group } from '@mantine/core';
import React, { forwardRef } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { IconHome, IconPlaylist, IconTestPipe } from '@tabler/icons-react';

interface AppNavbarIconProps extends ButtonProps {
  active: boolean;
  icon: React.ReactNode;
}

const _Button = forwardRef<HTMLButtonElement, AppNavbarIconProps>(
  ({ active, icon, children, ...props }, ref) => (
    <Button
      component="button"
      ref={ref}
      variant={active ? 'gradient' : 'subtle'}
      leftIcon={icon}
      {...props}
    >
      {children}
    </Button>
  )
);
_Button.displayName = 'AppNavbarIcon';

export const AppNavbarIcon = createPolymorphicComponent<'button', AppNavbarIconProps>(_Button);

function AppNavbar({ ...props }) {
  const router = useRouter();
  const { status } = useSession();

  return (
    <Group noWrap {...props}>
      <AppNavbarIcon component={Link} href="/" active={router.pathname === '/'} icon={<IconHome />}>
        Home
      </AppNavbarIcon>
      {status === 'authenticated' && (
        <>
          <AppNavbarIcon
            component={Link}
            href="/playlists"
            active={router.pathname === '/playlists'}
            icon={<IconPlaylist />}
          >
            Playlists
          </AppNavbarIcon>
          <AppNavbarIcon active={router.pathname.startsWith('/playlist/')} icon={<IconTestPipe />}>
            Piper
          </AppNavbarIcon>
        </>
      )}
    </Group>
  );
}

export default AppNavbar;
