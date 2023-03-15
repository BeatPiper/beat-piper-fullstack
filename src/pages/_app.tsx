import type { AppProps } from 'next/app'
import Head from 'next/head';
import {AppShell, Group, Header, Image, MantineProvider, MediaQuery, Title} from '@mantine/core';
import { Session } from 'next-auth';
import { trpc } from '@/utils/trpc';
import { SessionProvider } from 'next-auth/react';
import Link from "next/link";
import AuthButtons from "@/components/AuthButtons";

interface CustomAppProps extends AppProps {
    pageProps: {
        session?: Session;
    } & AppProps["pageProps"];
}

function App({
         Component,
         pageProps: { session, ...pageProps }
}: CustomAppProps) {
  return (
      <>
        <Head>
          <title>Page title</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>

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
      </>
  );
}

export default trpc.withTRPC(App);
