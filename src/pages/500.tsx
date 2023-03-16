import Head from 'next/head';
import { Title, Text, Stack } from '@mantine/core';

function Custom500() {
  return (
    <>
      <Head>
        <title>Server Error</title>
      </Head>
      <Stack align="center">
        <Title>Error 500</Title>
        <Text color="dimmed" size="lg" align="center">
          An error occurred on the server. Please try again later.
        </Text>
      </Stack>
    </>
  );
}

export default Custom500;
