import Head from 'next/head';
import { useSession, signIn } from 'next-auth/react';

import styles from 'styles/home.module.scss';
import { FaSpotify } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push('/focus');
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Pomofy | Login</title>
      </Head>
      <h1>Pomofy</h1>
      <button onClick={() => signIn('spotify')}>
        Login com o Spotify
        <FaSpotify size={24} />
      </button>
    </div>
  );
}
