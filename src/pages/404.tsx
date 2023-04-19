import Head from 'next/head';
import { Title, Text, Stack, Button } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';
import { useRouter } from 'next/router';

function Custom404() {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>Not found</title>
      </Head>
      <Stack align="center">
        <Title>Error 404</Title>
        <Text color="dimmed" size="lg" align="center">
          You may have mistyped the address, or the page has been moved to another URL.
        </Text>
        <Button onClick={handleClick} size="md" leftIcon={<IconArrowBack />}>
          Back to safety
        </Button>
      </Stack>
    </>
  );
}

export default Custom404;
