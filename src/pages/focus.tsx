import Head from 'next/head';
import { signOut, useSession } from 'next-auth/react';

import styles from 'styles/focus.module.scss';
import { FaSpotify } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export default function Focus() {
  const session = useSession();
  const router = useRouter();

  const startTime = 25 * 60; // 25 minutes

  const [time, setTime] = useState(startTime);
  const [isActive, setIsActive] = useState(false);
  const [hasTimeFinished, setHasTimeFinished] = useState(false);
  let countdownTimeout: NodeJS.Timeout;

  const seconds = time % 60 < 10 ? `0${time % 60}` : time % 60;
  const minutes =
    Math.floor(time / 60) < 10
      ? `0${Math.floor(time / 60)}`
      : Math.floor(time / 60);

  useEffect(() => {
    if (isActive && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      setHasTimeFinished(true);
      setIsActive(false);
    }
  }, [isActive, time]);

  function resumeTrack() {
    return axios.put('https://api.spotify.com/v1/me/player/play', null, {
      headers: {
        Authorization: `Bearer ${session.data.accessToken}`
      }
    });
  }

  function stopPlayingTrack() {
    return axios.put('https://api.spotify.com/v1/me/player/pause', null, {
      headers: {
        Authorization: `Bearer ${session.data.accessToken}`
      }
    });
  }

  async function startCountdown() {
    try {
      setIsActive(true);
      await resumeTrack();
    } catch (error) {
      const errorMessage = error.response.data.error.message;
      if (errorMessage.includes('Restriction violated')) {
        return toast.info('The music is already playing!');
      } else if (errorMessage.includes('No active device found')) {
        return toast.error('No active device found!');
      }

      return toast.error(error.response?.data?.error?.message);
    }
  }

  async function stopCountdown() {
    try {
      setIsActive(false);
      await stopPlayingTrack();
    } catch (error) {
      const errorMessage = error.response.data.error.message;
      if (errorMessage.includes('Restriction violated')) {
        return toast.info('The music is already stopped!');
      } else if (errorMessage.includes('No active device found')) {
        return toast.error('No active device found!');
      }

      return toast.error(error.response?.data?.error?.message);
    }
  }

  function resetCountdown() {
    setTime(startTime);
    setHasTimeFinished(false);
    setIsActive(false);
    stopPlayingTrack();
  }

  const [topTracks, setTopTracks] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState({
    artist: '',
    track: ''
  });

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (!session?.data?.accessToken) return;

    async function getTopTracks() {
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
          artist: item.artists[0].name
        };
      });

      setTopTracks(topTracks);
    }

    async function getCurrentlyPlaying() {
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

      setCurrentPlaying({
        artist: data.item.artists.map(artist => artist.name).join(', '),
        track: data.item.name
      });
    }

    getTopTracks();
    getCurrentlyPlaying();
  }, [session]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Pomofy | Focus</title>
      </Head>
      <ToastContainer />
      <header>
        <div className={styles.musicWrapper}>
          <FaSpotify size={36} color="var(--primary)" />
          <p>
            {currentPlaying.track === '' ? (
              'Nothing is playing right now'
            ) : (
              <>
                <span>{currentPlaying.track}</span> - {currentPlaying.artist}
              </>
            )}
          </p>
        </div>
        <button
          className={styles.userWrapper}
          onClick={() =>
            signOut({
              callbackUrl: '/'
            })
          }
        >
          <p>{session?.data?.user?.name}</p>
          <img
            src={session?.data?.user?.image}
            alt={session?.data?.user?.name}
          />
        </button>
      </header>
      <main>
        <div className={styles.timerWrapper}>
          <h1 className={styles.timer}>
            <span>{minutes}</span>:<span>{seconds}</span>
          </h1>
          <div className={styles.controllers}>
            {!isActive && time !== startTime ? (
              <>
                {time !== 0 && (
                  <button onClick={startCountdown}>Continue</button>
                )}
                <button onClick={resetCountdown}>Restart</button>
              </>
            ) : (
              !isActive && <button onClick={startCountdown}>Start</button>
            )}
            {isActive && <button onClick={stopCountdown}>Pause</button>}
          </div>
        </div>
        <div className={styles.tracksWrapper}>
          <h2>Top Tracks</h2>
          <div className={styles.tracks}>
            {topTracks.map((track, index) => (
              <div className={styles.track} key={index}>
                <p>{index + 1}</p>
                <div className={styles.info}>
                  <h3>{track.name}</h3>
                  <h4>{track.artist}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
