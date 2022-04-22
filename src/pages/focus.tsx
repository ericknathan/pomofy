import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';

import styles from 'styles/focus.module.scss';

import { Header } from 'components/Header';
import { Timer } from 'components/Timer';
import { TopTracks } from 'components/TopTracks';

import axios from 'axios';

export default function Focus() {
  const session = useSession();
  const router = useRouter();

  const [currentPlayingTrack, setCurrentPlayingTrack] = useState({
    artist: '',
    track: ''
  });

  useEffect(() => {
    console.log(session);
    if (session.status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (!session?.data?.accessToken) return;

    async function getCurrentlyPlaying() {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/me/player/currently_playing`,
          {
            headers: {
              Authorization: `Bearer ${session.data.accessToken}`
            }
          }
        );

        if (response.status === 204) return;

        const data = await response.data;

        setCurrentPlayingTrack({
          artist: data.item.artists.map(artist => artist.name).join(', '),
          track: data.item.name
        });
      } catch (error) {
        const errorMessage = error.response.data.error.message;
        if (errorMessage.includes('The access token expired')) {
          try {
            signIn('spotify', {
              redirectTo: '/focus',
            });
          } catch {
            signOut({
              callbackUrl: '/'
            });
          }
        }
      }
    }

    getCurrentlyPlaying();
  }, [session]);

  return (
    <div className={styles.container}>
      <Head>
        <title>{`Pomofy ${
          currentPlayingTrack.track !== ''
            ? `| ${currentPlayingTrack.track} • ${currentPlayingTrack.artist}`
            : ''
        }`}</title>
      </Head>
      <Header currentPlayingTrack={currentPlayingTrack} />
      <main>
        <Timer />
        <TopTracks />
      </main>
    </div>
  );
}
