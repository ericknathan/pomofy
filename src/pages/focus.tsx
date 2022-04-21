import Head from 'next/head';

import styles from 'styles/focus.module.scss';
import { FaSpotify } from 'react-icons/fa';

export default function Focus() {
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
            <span>25</span>:<span>00</span>
          </h1>
          <div className={styles.controllers}>
            <button>Start</button>
            <button>Stop</button>
          </div>
        </div>
        <div className={styles.tracksWrapper}>
          <h2>Top Tracks</h2>
          <div className={styles.tracks}>
            {topTracks.map((track, index) => (
              <div className={styles.track}>
                <p>{index+1}</p>
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
