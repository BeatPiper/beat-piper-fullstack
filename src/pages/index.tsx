import Head from 'next/head';
import { useSession } from 'next-auth/react';
import HomeLoggedIn from '@/components/HomeLoggedIn';
import HomeLoggedOut from '@/components/HomeLoggedOut';

function Home() {
  const { status } = useSession();

  return (
    <>
      <Head>
        <title>BeatPiper</title>
        <meta name="description" content="Search for Beat Saber maps using Spotify playlists" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {status === 'authenticated' ? <HomeLoggedIn /> : <HomeLoggedOut />}
    </>
  );
}

export default Home;
