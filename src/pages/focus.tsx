import Head from 'next/head';

import styles from 'styles/focus.module.scss';
import { FaSpotify } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function Focus() {
  const startTime = 25 * 60; // 25 minutes

  const [time, setTime] = useState(startTime);
  const [isActive, setIsActive] = useState(false);
  const [hasTimeFinished, setHasTimeFinished] = useState(false);
  let countdownTimeout: NodeJS.Timeout;

  const seconds = time % 60 < 10 ? `0${time % 60}` : time % 60;
  const minutes = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);

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

  function startCountdown() {
    console.log(minutes.toString().length)
    setIsActive(true);
  }

  function stopCountdown() {
    setIsActive(false);
  }

  function resetCountdown() {
    setTime(startTime);
    setHasTimeFinished(false);
    setIsActive(false);
  }

  const topTracks = [
    {
      name: 'Bixinho',
      artist: 'Lupa'
    },
    {
      name: 'Você gosta dela',
      artist: 'Daparte'
    },
    {
      name: 'Não foi por mal',
      artist: 'Jovem Dionisio'
    },
    {
      name: 'Nunca fui desse lugar',
      artist: 'Daparte (Feat. Lagum)'
    },
    {
      name: 'Vou Levar',
      artist: 'O Grilo'
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Pomofy | Focus</title>
      </Head>
      <header>
        <div className={styles.musicWrapper}>
          <FaSpotify size={36} color="var(--primary)" />
          <p>
            <span>Vento na cara</span> - Terno Rei
          </p>
        </div>
        <button className={styles.userWrapper}>
          <p>ericknathan</p>
          <img src="https://github.com/ericknathan.png" alt="Erick Nathan" />
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
              <div className={styles.track}>
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
