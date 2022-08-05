import Head from 'next/head';
import { useSession, signIn } from 'next-auth/react';

import styles from 'styles/home.module.scss';
import { FaSpotify } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push('/focus');
  }

  if (router.query.error) {
    if(router.query.error === 'OAuthCallback') {
      router.push('/')
      toast.error('Apparently you don\'t have Spotify Premium, so you can\'t use pomofy :(', {
        toastId: 'premium-error',
      });
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Pomofy | Login</title>
      </Head>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>
          <img src="logo.svg" alt="" />
          <h1>Pomofy</h1>
        </div>
      <p>A simple tool to help you focus on your tasks integrated with Spotify</p>
      </div>
      <button
        onClick={() =>
          signIn('spotify', {
            redirectTo: '/focus',
          })
        }
      >
        Login with Spotify
        <FaSpotify size={24} />
      </button>
    </div>
  );
}
