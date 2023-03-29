import { useSession } from 'next-auth/react';
import HomeLoggedIn from '@/components/HomeLoggedIn';
import HomeLoggedOut from '@/components/HomeLoggedOut';

function Home() {
  const { status } = useSession();

  if (status === 'authenticated') {
    return <HomeLoggedIn />;
  } else {
    return <HomeLoggedOut />;
  }
}

export default Home;
