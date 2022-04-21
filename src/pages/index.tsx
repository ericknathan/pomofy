import Head from 'next/head';

import styles from 'styles/home.module.scss';
import { FaSpotify } from 'react-icons/fa';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pomofy | Login</title>
      </Head>
      <h1>Pomofy</h1>
      <button>
        Login com o Spotify
        <FaSpotify size={24}/>
      </button>
    </div>
  );
}
