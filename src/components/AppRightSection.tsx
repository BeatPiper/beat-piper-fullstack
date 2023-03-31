import { ActionIcon, Button } from '@mantine/core';
import Link from 'next/link';
import { IconBrandGithub } from '@tabler/icons-react';
import AuthButtons from '@/components/AuthButtons';

function AppRightSection() {
  return (
    <>
      <ActionIcon component={Link} href="https://github.com/BeatPiper" target="_blank">
        <IconBrandGithub />
      </ActionIcon>
      <Button variant="subtle" compact component={Link} href="/privacy-policy">
        Privacy policy
      </Button>
      <AuthButtons />
    </>
  );
}

export default AppRightSection;
