import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AppShell, Group, Header, Image, MantineProvider, MediaQuery, Title } from '@mantine/core';
import { type Session } from 'next-auth';
import { trpc } from '@/utils/trpc';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import AuthButtons from '@/components/AuthButtons';
import PlausibleProvider from 'next-plausible';

interface CustomAppProps extends AppProps {
  pageProps: {
    session?: Session;
  } & AppProps['pageProps'];
}

function App({ Component, pageProps: { session, ...pageProps } }: CustomAppProps) {
  return (
    <>
      <Head>
        <title>BeatPiper</title>
        <meta name="description" content="Search for Beat Saber maps using Spotify playlists" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PlausibleProvider domain="beatpiper.com" customDomain="https://analytics.soundux.rocks">
        <SessionProvider session={session}>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{ colorScheme: 'dark', cursorType: 'pointer' }}
          >
            <AppShell
              padding="md"
              header={
                <Header height={60} p="xs" fixed>
                  <Group sx={{ height: '100%' }} px={20} position="apart" noWrap>
                    <Group noWrap>
                      <Link href="/">
                        <Image src="/logo.png" alt="Logo" height={28} />
                      </Link>
                      <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
                        <Title order={2}>Beat Piper</Title>
                      </MediaQuery>
                    </Group>
                    <AuthButtons />
                  </Group>
                </Header>
              }
            >
              <Component {...pageProps} />
            </AppShell>
          </MantineProvider>
        </SessionProvider>
      </PlausibleProvider>
    </>
  );
}

export default trpc.withTRPC(App);
