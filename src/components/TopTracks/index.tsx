import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './topTracks.module.scss';

export function TopTracks() {
  const session = useSession();
  const router = useRouter();

  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (!session?.data?.accessToken) return;

    async function getTopTracks() {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=short_term`,
          {
            headers: {
              Authorization: `Bearer ${session.data.accessToken}`
            }
          }
        );
        const data = await response.data;

        const topTracks = data.items.map(item => {
          return {
            name: item.name,
            artist: item.artists[0].name,
            url: item.external_urls.spotify
          };
        });

        setTopTracks(topTracks);
      } catch(error) {
        toast.error('Something went wrong. Please try again.');
      }
    }

    getTopTracks();
  }, [session]);

  return (
    <div className={styles.tracksWrapper}>
      <h2>Top Tracks</h2>
      <div className={styles.tracks}>
        {topTracks.map((track, index) => (
          <a
            className={styles.track}
            key={index}
            href={track.url}
            target="_blank"
          >
            <p>{index + 1}</p>
            <div className={styles.info}>
              <h3>{track.name}</h3>
              <h4>{track.artist}</h4>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
