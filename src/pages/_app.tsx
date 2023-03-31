import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AppShell, Group, Header, Image, MantineProvider, MediaQuery, Title } from '@mantine/core';
import { type Session } from 'next-auth';
import { trpc } from '@/utils/trpc';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import PlausibleProvider from 'next-plausible';
import { env } from '@/env.mjs';
import AppNavbar from '@/components/AppNavbar';
import AppRightSection from '@/components/AppRightSection';

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

      <PlausibleProvider
        enabled={!!env.NEXT_PUBLIC_PLAUSIBLE_HOST}
        domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
        customDomain={env.NEXT_PUBLIC_PLAUSIBLE_HOST}
      >
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
                  <Group sx={{ height: '100%', whiteSpace: 'nowrap' }} px={20} position="apart" noWrap>
                    <Group noWrap position="left" sx={{ flexGrow: 1, flexShrink: 1, flexBasis: '0%' }}>
                      <Link href="/">
                        <Image src="/logo.png" alt="Logo" height={28} />
                      </Link>
                      <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
                        <Title order={2}>Beat Piper</Title>
                      </MediaQuery>
                    </Group>
                    <Group noWrap sx={{ flexGrow: 0, flexShrink: 0, flexBasis: 'auto' }}>
                      <MediaQuery query="(max-width: 850px)" styles={{ display: 'none' }}>
                        <AppNavbar />
                      </MediaQuery>
                    </Group>
                    <Group noWrap position="right" sx={{ flexGrow: 1, flexShrink: 1, flexBasis: '0%' }}>
                      <AppRightSection />
                    </Group>
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
